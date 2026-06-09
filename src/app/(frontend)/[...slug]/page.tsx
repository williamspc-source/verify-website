import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

/**
 * Pages use the nested-docs plugin, so a page's full URL is the chain of its
 * ancestors' slugs (e.g. /services/medico-legal/ime). The last breadcrumb's
 * `url` holds that full path; we route on it via this catch-all segment.
 */
type WithBreadcrumbs = {
  slug?: string | null
  breadcrumbs?: ({ url?: string | null } | null)[] | null
}

const pagePath = (doc: WithBreadcrumbs): string => {
  const breadcrumbs = doc.breadcrumbs
  if (Array.isArray(breadcrumbs) && breadcrumbs.length) {
    const last = breadcrumbs[breadcrumbs.length - 1]
    if (last?.url) return last.url
  }
  return doc.slug ? `/${doc.slug}` : '/'
}

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
      const path = pagePath(doc as WithBreadcrumbs)
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
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageByPath({ segments })

  // Remove this code once your website is seeded
  if (!page && segments.length === 0) {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={path} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={path} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const segments = (slug ?? []).map((s) => decodeURIComponent(s))
  const page = await queryPageByPath({ segments })

  return generateMeta({ doc: page })
}

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
  const exact = docs.find((doc) => pagePath(doc as WithBreadcrumbs) === wanted)
  if (exact) return exact

  // Fallback for a single top-level segment (covers pages whose breadcrumbs
  // are not yet populated, e.g. immediately after enabling nested-docs).
  if (segments.length === 1) return docs[0] || null

  return null
})
