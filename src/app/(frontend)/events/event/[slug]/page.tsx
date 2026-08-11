import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import RichText from '@/components/RichText'
import { Icon } from '@/components/Icon'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { PersonCard, type PersonCardData } from '@/components/PersonCard'
import { mediaFocal } from '@/utilities/focalPoint'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'
import { EVENTS_INDEX_PATH, eventPath, specialistPath, teamPath } from '@/utilities/routes'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { eventCrumbs, getCrumbSettings } from '@/utilities/breadcrumbs'
import { eventTiming } from '@/utilities/eventTiming'

import type { Event, EventsSetting } from '@/payload-types'

type Args = { params: Promise<{ slug?: string }> }

// Generic event-page UI labels, sourced from the Events Settings global's `labels`
// group. Typed locally and read defensively until types are regenerated on deploy.
type EventLabels = {
  statusPastLabel?: string | null
  statusUpcomingLabel?: string | null
  freeLabel?: string | null
  cpdPointsTemplate?: string | null
  cpdEligibleLabel?: string | null
  concludedFallback?: string | null
  backToEventsLabel?: string | null
  breadcrumbSectionLabel?: string | null
  presentersHeading?: string | null
}

// Human-readable labels for the event type, matching the Events collection options.
const EVENT_TYPE_LABELS: Record<string, string> = {
  networking: 'Networking Event',
  'client-training': 'Client Training',
  'industry-briefing': 'Industry Briefing',
  workshop: 'Workshop',
  webinar: 'Webinar',
  'breakfast-seminar': 'Breakfast Seminar',
  masterclass: 'Masterclass',
  'specialist-seminar': 'Specialist Seminar',
}

const formatDate = (value?: string | null): string => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const isRichTextEmpty = (data: unknown): boolean => {
  const children = (data as { root?: { children?: unknown[] } } | null)?.root?.children
  return !Array.isArray(children) || children.length === 0
}

// Time-based safety net: a stale event page self-heals even if an on-demand
// revalidation hook is missed. 15 minutes rather than an hour because the page
// now decides, server-side, whether registrations are still open — so this is the
// window in which a closed event can still show "Register Your Interest".
// Regeneration is lazy, so pages nobody visits cost nothing.
export const revalidate = 900

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.map(({ slug }) => ({ slug: slug ?? '' }))
}

export default async function EventDetailPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) return <PayloadRedirects url={`/events/event/${decodedSlug}`} />

  const settings = (await getCachedGlobal('events-settings', 0)()) as EventsSetting | null
  const hostKey = event.host === 'verify' ? 'verify' : 'aamle'
  const host = (settings?.[hostKey] ?? {}) as NonNullable<EventsSetting['aamle']>
  const labels = ((settings as { labels?: EventLabels } | null)?.labels ?? {}) as EventLabels

  // `isPast` (badge, recap heading) and `registrationOpen` (the CTA) are separate
  // questions and are allowed to disagree — an event can be under way, or have
  // finished this morning, and still be taking expressions of interest. See
  // src/utilities/eventTiming.ts. Both are resolved server-side; `revalidate`
  // above bounds how stale they can get.
  const { isPast, registrationOpen } = eventTiming(event)

  const typeLabel = EVENT_TYPE_LABELS[event.eventType ?? ''] || 'Event'
  const crumbSettings = await getCrumbSettings()
  const crumbs = eventCrumbs(event, {
    home: crumbSettings.homeLabel,
    section: (settings as { labels?: EventLabels } | null)?.labels?.breadcrumbSectionLabel,
  })
  const metaParts = [formatDate(event.date), event.timeLabel, event.location].filter(
    (p): p is string => Boolean(p),
  )

  const cost = event.cost?.trim() || labels.freeLabel || 'Free'
  const showFacts = Boolean(cost) || Boolean(event.cpdEligible)

  const hasDescription = !isRichTextEmpty(event.description)
  const hasRecap = !isRichTextEmpty(event.recap)
  const blurb = host.blurb?.trim()
  const callout = host.callout?.trim()

  // Register / contact CTA. External registration link takes priority; otherwise
  // open the site-wide enquiry drawer via the [data-enquiry-panel] hook.
  const registerHref = event.registrationUrl?.trim() || ''
  // Keyed on registrationOpen, not isPast: "can I still register?" is what this
  // button answers, and an editor sets that per event via `registrationClosesAt`.
  const ctaLabel = registrationOpen
    ? event.registrationLabel || host.registerLabel || 'Register Your Interest'
    : event.registrationLabel || host.contactLabel || 'Contact Us'
  const ctaClass = cn('btn', registrationOpen ? 'btn-primary' : 'btn-outline')
  const cta = registerHref ? (
    <a className={ctaClass} href={registerHref} target="_blank" rel="noopener noreferrer">
      {ctaLabel}
    </a>
  ) : (
    <button type="button" data-enquiry-panel className={ctaClass}>
      {ctaLabel}
    </button>
  )

  const attendHeading = isPast
    ? host.recapHeading || 'Event Recap'
    : host.attendHeading || 'How to Attend'

  // Presenters: linked cards for panel/team members, plain cards for outside
  // speakers. Both were previously unrenderable — `presenters` had no consumer
  // at all, and there was no field for a guest.
  const presentersHeading =
    (settings as { labels?: EventLabels } | null)?.labels?.presentersHeading || 'Presenters'
  const presenterCards: PersonCardData[] = [
    ...(Array.isArray(event.presenters) ? event.presenters : []).flatMap((rel) => {
      if (!rel || typeof rel !== 'object' || typeof rel.value !== 'object') return []
      const person = rel.value as { title?: string | null; slug?: string | null; position?: string | null; role?: string | null; photo?: unknown }
      const photo = mediaFocal(person.photo)
      return [
        {
          name: person.title ?? '',
          position: person.position ?? person.role ?? null,
          photoUrl: photo.url,
          photoFocus: photo.focus,
          photoZoom: photo.zoom,
          href:
            rel.relationTo === 'specialists'
              ? specialistPath(person.slug)
              : teamPath(person.slug),
        },
      ]
    }),
    ...(Array.isArray(event.guestPresenters) ? event.guestPresenters : []).map((g) => ({
      name: g?.name ?? '',
      position: [g?.role, g?.organisation].filter(Boolean).join(', ') || null,
      href: null,
    })),
  ].filter((c) => c.name)

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={`/events/event/${decodedSlug}`} />

      {/* Hero */}
      <section className="page-hero page-hero--light page-hero--center">
        <div className="container">
          {/* The trail replaces the type kicker — same slot, same texture, and
              the reference never stacks the two. Tone and centring are inherited
              from page-hero--light / --center, so no props are needed. */}
          {crumbs.length >= 2 ? (
            <Breadcrumbs
              items={crumbs}
              separator={crumbSettings.separator}
              label={crumbSettings.navLabel}
            />
          ) : (
            <div className="section-label">{typeLabel}</div>
          )}
          <h1>{event.title}</h1>
          {metaParts.length ? (
            <p className="event-hero-meta">{metaParts.join(' · ')}</p>
          ) : null}
          <p className="event-hero-status">
            {isPast
              ? labels.statusPastLabel || 'Past Event'
              : labels.statusUpcomingLabel || 'Upcoming Event'}
          </p>
        </div>
      </section>

      {/* Description, host callout & location */}
      <section className="content-section">
        <div className="container">
          {showFacts ? (
            <ul className="event-facts">
              <li>
                <Icon name="currency-dollar" className="size-4" /> {cost}
              </li>
              {event.cpdEligible ? (
                <li>
                  <Icon name="certificate" className="size-4" />
                  {event.cpdPoints
                    ? (labels.cpdPointsTemplate || 'CPD · {points} point(s)').replace(
                        /\{points\}/g,
                        String(event.cpdPoints),
                      )
                    : labels.cpdEligibleLabel || 'CPD eligible'}
                </li>
              ) : null}
            </ul>
          ) : null}

          {hasDescription || event.excerpt || blurb ? (
            <div className="prose">
              {hasDescription ? (
                <RichText data={event.description as never} enableGutter={false} enableProse={false} />
              ) : event.excerpt ? (
                <p>{event.excerpt}</p>
              ) : null}
              {blurb ? <p>{blurb}</p> : null}
            </div>
          ) : null}

          {callout ? (
            <div className={cn('event-callout', hostKey === 'verify' && 'event-callout--verify')}>
              <p>{callout}</p>
            </div>
          ) : null}

          {presenterCards.length ? (
            <div className="event-presenters">
              <h2 className="event-presenters__heading">{presentersHeading}</h2>
              <div className="spec-grid" style={{ '--vf-cols': 3 } as React.CSSProperties}>
                {presenterCards.map((c, i) => (
                  <PersonCard key={i} {...c} />
                ))}
              </div>
            </div>
          ) : null}

          {event.location ? <div className="map-tile event-map">{event.location}</div> : null}
        </div>
      </section>

      {/* How to attend / recap */}
      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="event-attend">
            <h2 className="event-attend__heading">{attendHeading}</h2>
            {isPast ? (
              hasRecap ? (
                <div className="prose">
                  <RichText data={event.recap as never} enableGutter={false} enableProse={false} />
                </div>
              ) : (
                <p>
                  {labels.concludedFallback ||
                    'This event has now concluded. Contact our team for recordings or resources from this session.'}
                </p>
              )
            ) : (
              <p>
                {host.attendBody?.trim() ||
                  'Contact our team to register your interest or reserve a place — places are confirmed by email.'}
              </p>
            )}
            <p className="event-attend__cta">{cta}</p>
          </div>

          <p className="event-back-wrap">
            <a className="event-back" href={EVENTS_INDEX_PATH}>
              <Icon name="caret-left" className="size-4" /> {labels.backToEventsLabel ||
                'Back to all events'}
            </a>
          </p>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const event = await queryEventBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: event as never, url: eventPath(event?.slug) })
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }): Promise<Event | null> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    draft,
    depth: 1,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
