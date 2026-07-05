import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { AvailabilityBlock as Props, AvailabilitySession, Specialist } from '@/payload-types'

import { ExpertsCarousel } from '@/components/ExpertsCarousel'
import type { PersonCardData } from '@/components/PersonCard'
import { Section } from '@/components/Section'
import RichText from '@/components/RichText'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

import { AvailabilityClient, type AvailabilityRow, type EnquiryConfig } from './AvailabilityClient'

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

const HONORIFICS = new Set([
  'dr',
  'mr',
  'mrs',
  'ms',
  'prof',
  'prof.',
  'professor',
  'adj',
  'adj.',
  'adjunct',
  'associate',
  'a/prof',
])

// Two-letter monogram from the name, skipping honorifics ("Dr James Reidy" → "JR").
const initialsOf = (name: string): string => {
  const words = name
    .split(/\s+/)
    .filter((w) => w && !HONORIFICS.has(w.toLowerCase().replace(/[^a-z.]/g, '')))
  const letters = words.map((w) => w[0]).filter(Boolean)
  return (letters[0] ?? '') + (letters[1] ?? '')
}

// "Mon 7 Dec" (no comma) in Australian locale.
const dateLabel = (iso: string): string =>
  new Date(iso)
    .toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(',', '')

const MODE_META: Record<string, { cls: string; label: string }> = {
  'in-person': { cls: 'sa-inperson', label: 'In-person' },
  telehealth: { cls: 'sa-telehealth', label: 'Telehealth' },
  either: { cls: 'sa-either', label: 'In-person or Telehealth' },
}

const startOfToday = (): string => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export const AvailabilityBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const { showCarousel = true, showLegend = true, cssClass } = props

  const payload = await getPayload({ config: configPromise })
  const global = await getCachedGlobal('specialist-availability', 0)()

  // Advertised specialists → the featured carousel only.
  const specialistsRes = await payload.find({
    collection: 'specialists',
    where: { advertise: { equals: true } },
    depth: 1,
    limit: 100,
    sort: 'lastName',
  })
  const specialists = specialistsRes.docs

  // Live, advertised sessions (status available, today onward, not expired).
  const now = new Date().toISOString()
  const sessionsRes = await payload.find({
    collection: 'availability-sessions',
    where: {
      and: [
        { status: { equals: 'available' } },
        { date: { greater_than_equal: startOfToday() } },
        { expiresAt: { greater_than_equal: now } },
      ],
    },
    // depth 3 so each session's specialist has its OWN relations populated
    // (photo + accreditation TITLES live two levels below the session).
    depth: 3,
    limit: 500,
    sort: ['date', 'startTime'],
  })

  // ── Availability list: driven PURELY by availability-sessions ──
  // Only specialists who actually have available sessions appear (no "call to
  // book" rows). Specialist details come from the populated session.specialist.
  type Bucket = { sp: Specialist; sessions: AvailabilitySession[] }
  const bySpecialist = new Map<string, Bucket>()
  for (const s of sessionsRes.docs) {
    const sp = s.specialist
    if (!sp || typeof sp !== 'object') continue
    const key = String(sp.id)
    if (!bySpecialist.has(key)) bySpecialist.set(key, { sp: sp as Specialist, sessions: [] })
    bySpecialist.get(key)!.sessions.push(s)
  }

  const rows: AvailabilityRow[] = Array.from(bySpecialist.values())
    .sort((a, b) => (a.sp.lastName || a.sp.title).localeCompare(b.sp.lastName || b.sp.title))
    .map(({ sp, sessions }) => {
      const dateMap = new Map<string, AvailabilityRow['dates'][number]>()
      for (const sess of sessions) {
        if (!sess.date) continue
        const label = dateLabel(sess.date)
        if (!dateMap.has(label)) dateMap.set(label, { date: label, chips: [] })
        const meta = MODE_META[sess.mode || 'either'] ?? MODE_META.either
        dateMap.get(label)!.chips.push({
          id: String(sess.id),
          time: sess.startTime || '',
          end: sess.endTime || '',
          type: meta.label,
          modeClass: meta.cls,
        })
      }
      return {
        id: String(sp.id),
        name: sp.title,
        position: sp.position ?? null,
        initials: initialsOf(sp.title),
        photoUrl: mediaUrl(sp.photo),
        // Populated Accreditation docs use `title` (e.g. "CIME (ABIME)"); bare
        // IDs (depth too shallow) are skipped.
        accreditations: (sp.accreditations || [])
          .map((a) => (a && typeof a === 'object' ? a.title : null))
          .filter((a): a is string => Boolean(a)),
        dates: Array.from(dateMap.values()),
      }
    })

  // ── Featured carousel: driven by the "Advertise availability" toggle ──
  const featured: PersonCardData[] = specialists.map((sp: Specialist) => ({
    name: sp.title,
    position: sp.position ?? null,
    location:
      Array.isArray(sp.locations) && sp.locations[0] && typeof sp.locations[0] === 'object'
        ? (sp.locations[0].title ?? null)
        : null,
    badge: typeof sp.specialty === 'object' && sp.specialty ? sp.specialty.title : null,
    photoUrl: mediaUrl(sp.photo),
    href: null,
    tags: (sp.accreditations || [])
      .map((a) => (a && typeof a === 'object' ? a.title : null))
      .filter((a): a is string => Boolean(a))
      .slice(0, 3),
  }))

  const enquiry: EnquiryConfig = {
    email: global.enquiryEmail || 'admin@vmls.com.au',
    subject: global.enquirySubject || 'Specialist Availability Enquiry',
    bodyIntro: global.enquiryBodyIntro || 'Hello VERIFY team,',
    bodyFooter: global.enquiryBodyFooter || 'Thank you.',
  }

  // The Make a Booking page's "View availability below" link targets #availability.
  const hasCarousel = showCarousel && featured.length > 0

  return (
    <>
      {hasCarousel ? (
        <Section id="availability" background="accent" className="vf-availability-carousel">
          {global.carouselEyebrow || global.carouselTitle || global.carouselSubtitle ? (
            <div className="vf-availability-carousel__header">
              {global.carouselEyebrow ? (
                <div className="section-label">{global.carouselEyebrow}</div>
              ) : null}
              {global.carouselTitle ? (
                <h2 className="section-title">{accentText(global.carouselTitle)}</h2>
              ) : null}
              {global.carouselSubtitle ? (
                <p className="section-subtitle">{global.carouselSubtitle}</p>
              ) : null}
            </div>
          ) : null}
          <ExpertsCarousel cards={featured} />
        </Section>
      ) : null}

      <Section
        id={hasCarousel ? undefined : 'availability'}
        background="white"
        className={cn('vf-availability', 'vf-section--pb-compact', toClassName(cssClass))}
      >
        {global.intro ? (
          <div className="vf-availability__intro">
            <RichText data={global.intro} enableGutter={false} enableProse={false} />
          </div>
        ) : null}
        <AvailabilityClient rows={rows} enquiry={enquiry} showLegend={Boolean(showLegend)} />
      </Section>
    </>
  )
}
