import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { toClassName } from '@/utilities/cssClass'
import { generateMeta } from '@/utilities/generateMeta'
import { docPath, specialistPath } from '@/utilities/routes'
import { pageCrumbs } from '@/utilities/breadcrumbs'
import { getCachedGlobal } from '@/utilities/getGlobals'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

/**
 * Pages use the nested-docs plugin, so a page's full URL is the chain of its
 * ancestors' slugs (e.g. /services/medico-legal/ime), held on the last
 * breadcrumb's `url`; we route on it via this catch-all segment. `docPath`
 * (src/utilities/routes.ts) is the shared builder for that path.
 */

// Time-based safety net: even if an on-demand revalidation hook is missed, a
// stale page self-heals within the hour instead of persisting until redeploy.
export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      breadcrumbs: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => doc.slug !== 'home')
    .map((doc) => {
      const path = docPath(doc)
      return { slug: path.split('/').filter(Boolean) }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const segments = (slug ?? []).map((s) => decodeURIComponent(s))
  const path = segments.length ? '/' + segments.join('/') : '/'
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageByPath({ segments })

  // No homeStatic fallback here by design. The Payload template substituted its
  // own placeholder homepage whenever `/` resolved to nothing — so unpublishing
  // or renaming the Home page silently served "Payload Website Template" to
  // every visitor, with nothing in the admin to explain it. A 404 is the honest
  // answer: it is obviously wrong, so it gets noticed and fixed.

  if (!page) {
    // Specialist profiles moved from /specialists/<slug> to
    // /specialists/profiles/<slug>. A stub route at /specialists/[slug] can't live
    // here — it would shadow the pages nested under /specialists (Specialist Panel,
    // Specialty List, …) — so the old profile URLs fall through to this catch-all.
    // 308 them to the new path when a matching specialist exists (else fall through
    // to the normal redirect/404 so we don't turn a real 404 into a redirect chain).
    if (!draft && segments.length === 2 && segments[0] === 'specialists') {
      const target = await specialistRedirect(segments[1])
      if (target) permanentRedirect(target)
    }
    return <PayloadRedirects url={path} />
  }

  // A now-nested page can still be reached at a stale flat URL (e.g. /ime) via the
  // single-segment leaf-slug fallback in queryPageByPath. Send those to the
  // canonical breadcrumb path (308) so the same page is never served at two URLs.
  // Skipped in draft/preview, where the preview path is authoritative and the
  // breadcrumbs of an unsaved draft may not be current.
  if (!draft) {
    const canonical = docPath(page)
    if (canonical !== path) {
      permanentRedirect(canonical)
    }
  }

  const { hero, layout } = page
  const pageClass = toClassName((page as { cssClass?: string | string[] | null }).cssClass)

  const siteSettings = await getCachedGlobal('site-settings', 0)()
  const crumbSettings = siteSettings?.breadcrumbs

  // No page-level vertical padding: the hero and every block render as full-bleed
  // sections that own their own spacing, so the page sits flush under the header
  // and above the footer (no white strip above the hero / gap before the footer).
  return (
    <article className={pageClass || undefined}>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={path} />

      {draft && <LivePreviewListener />}

      <RenderHero
        {...hero}
        crumbs={pageCrumbs(page, crumbSettings?.homeLabel)}
        crumbSeparator={crumbSettings?.separator}
        crumbNavLabel={crumbSettings?.navLabel}
        title={page.title}
      />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const segments = (slug ?? []).map((s) => decodeURIComponent(s))
  const page = await queryPageByPath({ segments })

  return generateMeta({ doc: page, url: docPath(page) })
}

// Returns the canonical profile path for a legacy /specialists/<slug> URL when a
// published specialist with that slug exists, else null. Used to 308 old profile
// links after the route moved under /specialists/profiles.
const specialistRedirect = cache(async (slug: string): Promise<string | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'specialists',
    depth: 0,
    limit: 1,
    pagination: false,
    // The comment above says "published", and without this it wasn't: the Local
    // API defaults to overrideAccess: true, so an unpublished specialist matched
    // and the legacy URL redirected to a profile page that then 404s.
    overrideAccess: false,
    where: { slug: { equals: slug } },
    select: { slug: true },
  })
  return result.docs?.[0] ? specialistPath(slug) : null
})

const queryPageByPath = cache(async ({ segments }: { segments: string[] }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  // The leaf slug is the last path segment; home (no segments) resolves to 'home'.
  const leafSlug = segments.at(-1) ?? 'home'

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 10,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: leafSlug,
      },
    },
  })

  const docs = result.docs || []

  if (segments.length === 0) {
    return docs[0] || null
  }

  // Disambiguate pages that share a leaf slug under different parents by
  // matching the full nested path.
  const wanted = '/' + segments.join('/')
  const exact = docs.find((doc) => docPath(doc) === wanted)
  if (exact) return exact

  // No exact path match. For a single top-level segment we may still have found
  // the page by its leaf slug — a stale flat URL for a now-nested page (the
  // caller 308s it to canonical), or a page whose breadcrumbs aren't populated
  // yet. Only trust it when exactly one page carries that slug; multiple
  // candidates can't be disambiguated without a matching breadcrumb path, so
  // fall through to 404 rather than guess.
  if (segments.length === 1 && docs.length === 1) return docs[0]

  return null
})
