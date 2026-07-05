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

import type { Specialist } from '@/payload-types'

type Args = { params: Promise<{ slug?: string }> }

// Pull the display title from a populated (depth>0) relationship value.
const relTitles = (arr: unknown): string[] =>
  Array.isArray(arr)
    ? arr
        .filter((x): x is { title?: string } => typeof x === 'object' && x !== null)
        .map((x) => x.title ?? '')
        .filter(Boolean)
    : []

const initials = (name: string): string =>
  name
    .replace(/^(Dr|Adj\.?\s*Prof\.?|Assoc\.?\s*Prof\.?|Prof\.?|Ms|Mr|Mrs)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'specialists',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.map(({ slug }) => ({ slug: slug ?? '' }))
}

export default async function SpecialistProfilePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const specialist = await querySpecialistBySlug({ slug: decodedSlug })

  if (!specialist) return <PayloadRedirects url={`/specialists/${decodedSlug}`} />

  const settings = await getCachedGlobal('specialist-profile', 1)()
  const portal = (settings as { portalCta?: Record<string, unknown> })?.portalCta ?? {}
  const labels = (settings as { labels?: Record<string, string> })?.labels ?? {}

  const portalTiles = Array.isArray(portal.tiles)
    ? (portal.tiles as { icon?: string | null; label?: string | null }[]).filter((t) => t?.label)
    : []
  const enquiryLabel = (portal.enquiryLabel as string) || 'Send Enquiry'
  const enquiryEmail = (portal.enquiryEmail as string) || ''
  const enquiryHref = enquiryEmail
    ? `mailto:${enquiryEmail}?subject=${encodeURIComponent('VERIFY Booking Portal Access Request')}`
    : undefined

  const s = specialist as Specialist & Record<string, unknown>
  const photo = typeof s.photo === 'object' ? s.photo : null
  const specialtyTitle =
    typeof s.specialty === 'object' && s.specialty ? (s.specialty as { title?: string }).title : ''
  const locations = relTitles(s.locations)
  const languages = Array.isArray(s.languages)
    ? (s.languages as { language?: string }[]).map((l) => l.language).filter(Boolean)
    : []
  const areas = relTitles(s.areasOfExpertise)
  const assessmentTypes = [...relTitles(s.claimTypes), ...relTitles(s.assessmentTypes)]
  const qualifications = Array.isArray(s.qualifications)
    ? (s.qualifications as { qualification?: string; icon?: string }[])
    : []
  const accreditations = relTitles(s.accreditations)

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={`/specialists/${decodedSlug}`} />

      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <nav className="profile-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>›</span>
          <Link href="/specialists">Specialists</Link>
          <span aria-hidden>›</span>
          <strong>{s.title}</strong>
        </nav>
      </div>

      {/* Hero */}
      <section className="vf-profile-hero">
        <div className="container vf-profile-hero__inner">
          <div className="vf-profile-hero__avatar">
            {photo ? (
              <Media resource={photo} imgClassName="vf-profile-hero__img" />
            ) : (
              <span className="vf-profile-hero__initials">{initials(s.title)}</span>
            )}
          </div>
          <div className="vf-profile-hero__body">
            <h1 className="vf-profile-hero__name">{s.title}</h1>
            {s.position ? <p className="vf-profile-hero__position">{s.position}</p> : null}
            {specialtyTitle ? (
              <p className="vf-profile-hero__specialty">{specialtyTitle}</p>
            ) : null}
            <div className="vf-profile-hero__chips">
              {locations.map((l) => (
                <span key={l} className="vf-chip">
                  <Icon name="map-pin" className="size-4" /> {l}
                </span>
              ))}
              {languages.map((l) => (
                <span key={l} className="vf-chip">
                  <Icon name="translate" className="size-4" /> {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="vf-section--white" style={{ paddingBlock: 'var(--space-normal)' }}>
        <div className="container vf-profile-grid">
          <div className="vf-profile-main">
            {s.bio ? (
              <div className="vf-profile-block">
                <h2 className="vf-profile-block__title">{labels.biography || 'Biography'}</h2>
                <RichText data={s.bio as never} enableGutter={false} />
              </div>
            ) : null}

            {areas.length ? (
              <div className="vf-profile-block">
                <h2 className="vf-profile-block__title">
                  {labels.assessmentAreas || 'Assessment Areas'}
                </h2>
                <ul className="vf-tag-list">
                  {areas.map((a) => (
                    <li key={a} className="vf-tag">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {assessmentTypes.length ? (
              <div className="vf-profile-block">
                <h2 className="vf-profile-block__title">Assessment Types</h2>
                <ul className="vf-tag-list">
                  {assessmentTypes.map((a) => (
                    <li key={a} className="vf-tag">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="vf-profile-sidebar">
            {qualifications.length ? (
              <div className="vf-profile-card">
                <h3 className="vf-profile-card__title">{labels.qualifications || 'Qualifications'}</h3>
                <ul>
                  {qualifications.map((q, i) => (
                    <li key={i} className="vf-profile-card__item">
                      {q.icon ? <Icon name={q.icon} className="size-5" /> : null}
                      {q.qualification}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {accreditations.length ? (
              <div className="vf-profile-card">
                <h3 className="vf-profile-card__title">{labels.accreditations || 'Accreditations'}</h3>
                <ul>
                  {accreditations.map((a) => (
                    <li key={a} className="vf-profile-card__item">
                      <Icon name="seal-check" className="size-5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Shared booking-portal CTA (from the Specialist Profile global) */}
      {portal.heading ? (
        <section className="portal-opt4">
          <div className="container">
            <div className="portal-opt4-inner">
              <div className="portal-opt4-header">
                {portal.eyebrow ? (
                  <div className="portal-opt4-eyebrow">{portal.eyebrow as string}</div>
                ) : null}
                <h2 className="opt-heading">{portal.heading as string}</h2>
              </div>
              {portal.subheading ? (
                <p className="opt-sub">{portal.subheading as string}</p>
              ) : null}
              {portalTiles.length ? (
                <div className="portal-opt4-tiles">
                  {portalTiles.map((tile, i) => (
                    <div key={i} className="portal-opt4-tile">
                      {tile.icon ? (
                        <Icon name={tile.icon} className="portal-opt4-tile-icon" />
                      ) : null}
                      <div className="portal-opt4-tile-label">{tile.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="opt-actions">
                <a
                  className="opt-btn-white"
                  data-enquiry-panel
                  data-enquiry-type="Register for Online Booking Portal"
                  {...(enquiryHref ? { href: enquiryHref } : { role: 'button', tabIndex: 0 })}
                >
                  {enquiryLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const specialist = await querySpecialistBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: specialist as never })
}

const querySpecialistBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'specialists',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
