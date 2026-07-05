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
  const breadcrumb = (settings as { breadcrumb?: Record<string, string> })?.breadcrumb ?? {}
  const portalEnquirySubject =
    (settings as { portalEnquirySubject?: string })?.portalEnquirySubject ||
    'VERIFY Booking Portal Access Request'
  const portalEnquiryType =
    (settings as { portalEnquiryType?: string })?.portalEnquiryType ||
    'Register for Online Booking Portal'

  const portalTiles = Array.isArray(portal.tiles)
    ? (portal.tiles as { icon?: string | null; label?: string | null }[]).filter((t) => t?.label)
    : []
  const enquiryLabel = (portal.enquiryLabel as string) || 'Send Enquiry'
  const enquiryEmail = (portal.enquiryEmail as string) || ''
  const enquiryHref = enquiryEmail
    ? `mailto:${enquiryEmail}?subject=${encodeURIComponent(portalEnquirySubject)}`
    : undefined

  const s = specialist as Specialist & Record<string, unknown>
  const photo = typeof s.photo === 'object' ? s.photo : null
  const specialtyTitle =
    (typeof s.specialty === 'object' && s.specialty
      ? (s.specialty as { title?: string }).title
      : '') || (s.position as string) || ''
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

      {/* Hero */}
      <section className="profile-hero">
        <div className="container">
          <div className="profile-hero-inner">
            <div className="profile-avatar">
              {photo ? (
                <Media resource={photo} alt={s.title} />
              ) : (
                <span>{initials(s.title)}</span>
              )}
            </div>
            <div className="profile-info">
              <nav className="profile-breadcrumb" aria-label="Breadcrumb">
                <Link href={breadcrumb.breadcrumbParentHref || '/specialist-panel'}>
                  {breadcrumb.breadcrumbParentLabel || 'Specialist Panel'}
                </Link>
                <span aria-hidden>›</span>
                <strong>{breadcrumb.breadcrumbCurrentLabel || 'Specialist Profile'}</strong>
              </nav>
              <h1 className="profile-name">{s.title}</h1>
              {specialtyTitle ? <p className="profile-specialty">{specialtyTitle}</p> : null}
              <div className="profile-hero-meta">
                {locations.length ? (
                  <div className="profile-location">
                    <Icon name="map-pin" className="profile-location-icon" />
                    {locations.join(' | ')}
                  </div>
                ) : null}
                {languages.length ? (
                  <div className="profile-languages">
                    <Icon name="translate" className="profile-lang-icon" />
                    {languages.join(', ')}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="profile-content">
        <div className="container">
          <div className="profile-grid">
            {/* Main column */}
            <div>
              {s.bio ? (
                <div className="profile-section">
                  <div className="profile-section-label">{labels.biography || 'Biography'}</div>
                  <div className="profile-bio">
                    <RichText data={s.bio as never} enableGutter={false} />
                  </div>
                </div>
              ) : null}

              {areas.length ? (
                <div className="profile-section">
                  <div className="profile-section-label">
                    {labels.assessmentAreas || 'Assessment Areas'}
                  </div>
                  <div className="profile-areas-list">
                    {areas.map((a) => (
                      <div key={a} className="profile-area-item">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {assessmentTypes.length ? (
                <div className="profile-section">
                  <div className="profile-section-label">
                    {labels.assessmentTypes || 'Assessment Types'}
                  </div>
                  <div className="profile-types">
                    {assessmentTypes.map((a) => (
                      <div key={a} className="profile-type-item">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Sidebar */}
            <div>
              {qualifications.length ? (
                <div className="profile-sidebar-card">
                  <div className="profile-sidebar-title">
                    {labels.qualifications || 'Qualifications'}
                  </div>
                  <ul className="profile-qual-list">
                    {qualifications.map((q, i) => (
                      <li key={i}>
                        <Icon name={q.icon || 'medal'} className="profile-qual-icon" />
                        {q.qualification}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {accreditations.length ? (
                <div className="profile-sidebar-card">
                  <div className="profile-sidebar-title">
                    {labels.accreditations || 'Accreditations'}
                  </div>
                  <ul className="profile-qual-list">
                    {accreditations.map((a) => (
                      <li key={a}>
                        <Icon name="seal-check" className="profile-qual-icon" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
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
                  data-enquiry-type={portalEnquiryType}
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
