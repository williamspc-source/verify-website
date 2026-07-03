import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'

import type { Team } from '@/payload-types'

type Args = { params: Promise<{ slug?: string }> }

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'team',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.map(({ slug }) => ({ slug: slug ?? '' }))
}

export default async function TeamProfilePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const member = await queryMemberBySlug({ slug: decodedSlug })

  if (!member) return <PayloadRedirects url={`/about/team/${decodedSlug}`} />

  const m = member as Team & Record<string, unknown>
  const photo = typeof m.photo === 'object' ? m.photo : null
  const sections = Array.isArray(m.sections)
    ? (m.sections as { heading?: string; body?: unknown }[])
    : []
  const qualifications = Array.isArray(m.qualifications)
    ? (m.qualifications as { qualification?: string }[])
    : []

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={`/about/team/${decodedSlug}`} />

      <section className="vf-profile-hero">
        <div className="container vf-profile-hero__inner">
          <div className="vf-profile-hero__avatar">
            {photo ? (
              <Media resource={photo} imgClassName="vf-profile-hero__img" />
            ) : (
              <span className="vf-profile-hero__initials">{initials(m.title)}</span>
            )}
          </div>
          <div className="vf-profile-hero__body">
            <h1 className="vf-profile-hero__name">{m.title}</h1>
            {m.role ? <p className="vf-profile-hero__position">{m.role}</p> : null}
          </div>
        </div>
      </section>

      <section className="vf-section--white" style={{ paddingBlock: 'var(--space-normal)' }}>
        <div className="container vf-profile-grid">
          <div className="vf-profile-main">
            {m.bio ? (
              <div className="vf-profile-block">
                <h2 className="vf-profile-block__title">About</h2>
                <RichText data={m.bio as never} enableGutter={false} />
              </div>
            ) : null}
            {sections.map((sec, i) => (
              <div className="vf-profile-block" key={i}>
                <h2 className="vf-profile-block__title">{sec.heading}</h2>
                {sec.body ? <RichText data={sec.body as never} enableGutter={false} /> : null}
              </div>
            ))}
          </div>
          <aside className="vf-profile-sidebar">
            {qualifications.length ? (
              <div className="vf-profile-card">
                <h3 className="vf-profile-card__title">Qualifications</h3>
                <ul>
                  {qualifications.map((q, i) => (
                    <li key={i} className="vf-profile-card__item">
                      {q.qualification}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const member = await queryMemberBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: member as never })
}

const queryMemberBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'team',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
