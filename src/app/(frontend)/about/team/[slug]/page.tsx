import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React, { cache } from 'react'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Team } from '@/payload-types'

// `team-settings` isn't in the generated payload-types yet, so describe the shape
// we read locally and cast defensively.
type TeamSettingsShape = {
  labels?: {
    breadcrumbHomeLabel?: string | null
    breadcrumbSectionLabel?: string | null
    roleLabel?: string | null
    qualificationLabel?: string | null
    aboutPrefix?: string | null
  } | null
} | null

type Args = { params: Promise<{ slug?: string }> }

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

  const settings = (await getCachedGlobal('team-settings' as never, 0)()) as TeamSettingsShape
  const labels = settings?.labels

  const m = member as Team & Record<string, unknown>
  const photo = typeof m.photo === 'object' ? m.photo : null
  const sections = Array.isArray(m.sections)
    ? (m.sections as { heading?: string; body?: unknown }[])
    : []
  const qualifications = Array.isArray(m.qualifications)
    ? (m.qualifications as { qualification?: string }[])
    : []
  // Accent word for the bio heading — the member's first name ("About Wes").
  const firstName = (m.title ?? '').split(/\s+/)[0]

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={`/about/team/${decodedSlug}`} />

      {/* Hero */}
      <section className="staff-hero">
        <div className="container">
          <nav className="staff-hero-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{labels?.breadcrumbHomeLabel || 'Home'}</Link>
            <span aria-hidden>›</span>
            <Link href="/meet-the-team">{labels?.breadcrumbSectionLabel || 'Meet the Team'}</Link>
            <span aria-hidden>›</span>
            <strong>{m.title}</strong>
          </nav>
          <div className="staff-hero-content">
            <h1 className="staff-hero-name">{m.title}</h1>
            {m.role ? <p className="staff-hero-role">{m.role}</p> : null}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="staff-body">
        <div className="container">
          <div className="staff-body-grid">
            {/* Bio column */}
            <div>
              {m.bio ? (
                <div className="staff-section">
                  <div className="staff-section-heading">
                    {labels?.aboutPrefix || 'About'} <span>{firstName}</span>
                  </div>
                  <div className="staff-bio">
                    <RichText data={m.bio as never} enableGutter={false} enableProse={false} />
                  </div>
                </div>
              ) : null}
              {sections.map((sec, i) => (
                <div className="staff-section" key={i}>
                  <div className="staff-section-heading">
                    <span>{sec.heading}</span>
                  </div>
                  {sec.body ? (
                    <div className="staff-bio">
                      <RichText data={sec.body as never} enableGutter={false} enableProse={false} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div>
              <div className="staff-photo">
                {photo ? (
                  <Media resource={photo} imgClassName="staff-photo-img" />
                ) : null}
              </div>

              <div className="staff-sidebar-info">
                {m.role ? (
                  <div className="staff-sidebar-item">
                    <div className="staff-sidebar-item-icon">
                      <Icon name="briefcase" />
                    </div>
                    <div>
                      <div className="staff-sidebar-item-label">{labels?.roleLabel || 'Role'}</div>
                      <div className="staff-sidebar-item-text">{m.role}</div>
                    </div>
                  </div>
                ) : null}
                {qualifications.map((q, i) =>
                  q.qualification ? (
                    <div className="staff-sidebar-item" key={i}>
                      <div className="staff-sidebar-item-icon">
                        <Icon name="graduation-cap" />
                      </div>
                      <div>
                        <div className="staff-sidebar-item-label">
                          {labels?.qualificationLabel || 'Qualification'}
                        </div>
                        <div className="staff-sidebar-item-text">{q.qualification}</div>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          </div>
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
