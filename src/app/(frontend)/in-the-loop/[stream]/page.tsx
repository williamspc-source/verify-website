import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageHero } from '@/heros/PageHero'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'

import type { Stream } from '@/payload-types'

type Args = { params: Promise<{ stream?: string }> }

// Staff narratives use the author-led narrative card; every other stream uses the
// standard image-led post card.
const NARRATIVE_STREAMS = new Set(['staff-narratives'])

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'streams',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.filter((d) => d.slug).map((d) => ({ stream: d.slug as string }))
}

export default async function StreamIndexPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { stream: streamParam = '' } = await paramsPromise
  const slug = decodeURIComponent(streamParam)

  const stream = await queryStreamBySlug({ slug })
  if (!stream) notFound()

  const isNarrative = NARRATIVE_STREAMS.has(slug)

  // Reuse the In-the-Loop hub's ArchiveBlock so cards match the hub exactly; here
  // it lists EVERY published post in the stream (the hub only shows a preview).
  const archiveProps = {
    blockType: 'archive',
    populateBy: 'collection',
    relationTo: 'posts',
    stream: stream.id,
    limit: 500,
    columns: isNarrative ? '2' : '3',
    postStyle: isNarrative ? 'narrative' : 'card',
    readMoreLabel: 'Read More →',
  } as unknown as React.ComponentProps<typeof ArchiveBlock>

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={`/in-the-loop/${slug}`} />

      <PageHero
        {...({
          type: 'pageHero',
          theme: 'dark',
          align: 'left',
          showShield: false,
          eyebrow: 'In the Loop',
          heading: stream.title,
          subtitle: stream.description || 'Browse every article in this stream.',
        } as React.ComponentProps<typeof PageHero>)}
      />

      {/* Breadcrumb bar — mirrors the article page's `.art-meta-bar`. */}
      <div className="art-meta-bar">
        <div className="container">
          <nav aria-label="Breadcrumb" className="art-breadcrumb">
            <a href="/">Home</a>
            <span className="art-breadcrumb-sep">›</span>
            <a href="/in-the-loop">In the Loop</a>
            <span className="art-breadcrumb-sep">›</span>
            <strong>{stream.title}</strong>
          </nav>
        </div>
      </div>

      <section className="ni-section bg-white">
        <ArchiveBlock {...archiveProps} />
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { stream: streamParam = '' } = await paramsPromise
  const stream = await queryStreamBySlug({ slug: decodeURIComponent(streamParam) })
  if (!stream) return {}
  return {
    title: `${stream.title} — In the Loop | VERIFY`,
    description: stream.description || undefined,
  }
}

const queryStreamBySlug = cache(async ({ slug }: { slug: string }): Promise<Stream | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'streams',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return (result.docs?.[0] as Stream) || null
})
