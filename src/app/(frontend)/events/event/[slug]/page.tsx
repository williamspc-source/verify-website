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
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'

import type { Event, EventsSetting } from '@/payload-types'

type Args = { params: Promise<{ slug?: string }> }

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

  // Upcoming vs past is derived at render time from the event date.
  const eventTime = new Date(event.date).getTime()
  const isPast = !Number.isNaN(eventTime) && eventTime < Date.now()

  const typeLabel = EVENT_TYPE_LABELS[event.eventType ?? ''] || 'Event'
  const metaParts = [formatDate(event.date), event.timeLabel, event.location].filter(
    (p): p is string => Boolean(p),
  )

  const cost = event.cost?.trim() || 'Free'
  const showFacts = Boolean(cost) || Boolean(event.cpdEligible)

  const hasDescription = !isRichTextEmpty(event.description)
  const hasRecap = !isRichTextEmpty(event.recap)
  const blurb = host.blurb?.trim()
  const callout = host.callout?.trim()

  // Register / contact CTA. External registration link takes priority; otherwise
  // open the site-wide enquiry drawer via the [data-enquiry-panel] hook.
  const registerHref = event.registrationUrl?.trim() || ''
  const ctaLabel = isPast
    ? event.registrationLabel || host.contactLabel || 'Contact Us'
    : event.registrationLabel || host.registerLabel || 'Register Your Interest'
  const ctaClass = cn('btn', isPast ? 'btn-outline' : 'btn-primary')
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

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={`/events/event/${decodedSlug}`} />

      {/* Hero */}
      <section className="page-hero page-hero--light page-hero--center">
        <div className="container">
          <div className="section-label">{typeLabel}</div>
          <h1>{event.title}</h1>
          {metaParts.length ? (
            <p className="event-hero-meta">{metaParts.join(' · ')}</p>
          ) : null}
          <p className="event-hero-status">{isPast ? 'Past Event' : 'Upcoming Event'}</p>
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
                    ? `CPD · ${event.cpdPoints} point${event.cpdPoints === 1 ? '' : 's'}`
                    : 'CPD eligible'}
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
                  This event has now concluded. Contact our team for recordings or resources from
                  this session.
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
            <a className="event-back" href="/events">
              <Icon name="caret-left" className="size-4" /> Back to all events
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
  return generateMeta({ doc: event as never })
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
