import type { Event } from '@/payload-types'
import { mediaSrc } from '@/utilities/mediaSrc'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Section } from '@/components/Section'
import type { SectionBackground } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

import { EventsExplorerClient } from './EventsExplorerClient'
import type { EventItem, EventsExplorerLabels, EventsExplorerGroups } from './EventsExplorerClient'

// Human-readable event-type labels — kept in sync with the Events collection
// options (mirrors EVENT_TYPE_LABELS in ArchiveBlock / the event detail page).
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


// Field reads are typed defensively because payload-types have not been
// regenerated for this block yet.
type Props = {
  eyebrow?: string | null
  heading?: string | null
  subheading?: string | null
  mode?: 'all' | 'upcoming-only' | 'past-only' | null
  pageSize?: number | null
  showSearch?: boolean | null
  labels?: EventsExplorerLabels | null
  cardStyle?: 'list' | 'card' | null
  groups?: EventsExplorerGroups | null
  anchorId?: string | null
  background?: SectionBackground | null
  cssClass?: string | string[] | null
  bare?: boolean
}

/**
 * `photoWidth` is the CSS width the event photo renders at, measured:
 * 310px in a list row, 260px in a hub card. Doubled for retina inside
 * `mediaSrc`, which then serves the smallest generated size that covers it
 * rather than the original upload.
 */
const serialise = (e: Event, photoWidth: number): EventItem => ({
  id: String(e.id),
  title: e.title,
  slug: e.slug ?? '',
  date: e.date ? new Date(e.date).toISOString() : '',
  timeLabel: e.timeLabel ?? '',
  location: e.location ?? '',
  eventType: e.eventType ?? '',
  typeLabel: EVENT_TYPE_LABELS[e.eventType ?? ''] || 'Event',
  cpdEligible: Boolean(e.cpdEligible),
  cost: e.cost ?? '',
  excerpt: e.excerpt ?? '',
  registrationUrl: e.registrationUrl ?? '',
  image: mediaSrc(e.image, photoWidth * 2),
})

// Server block: fetches ALL events once (published only) and hands plain,
// serialisable objects to the client, which decides upcoming vs past from the
// live browser date.
export const EventsExplorerBlock: React.FC<Props> = async (props) => {
  const { eyebrow, heading, subheading, anchorId, background, cssClass, bare } = props
  const mode = (props as { mode?: Props['mode'] }).mode || 'all'
  const pageSize = (props as { pageSize?: number | null }).pageSize || 8
  const showSearch = (props as { showSearch?: boolean | null }).showSearch ?? true
  const labels = (props as { labels?: EventsExplorerLabels | null }).labels ?? undefined
  // Defaults to the list presentation, so the two dedicated listing pages are
  // untouched; only a block explicitly set to `card` takes the hub treatment.
  const cardStyle = (props as { cardStyle?: 'list' | 'card' | null }).cardStyle || 'list'
  const groups = (props as { groups?: EventsExplorerGroups | null }).groups ?? undefined

  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 200,
    pagination: false,
    overrideAccess: false,
    sort: 'date',
  })

  const events = res.docs.map((e) => serialise(e, cardStyle === 'card' ? 260 : 310))

  const hasHeader = Boolean(eyebrow || heading || subheading)

  return (
    <Section
      bare={bare}
      background={background || 'white'}
      id={anchorId || undefined}
      className={cn('events-explorer', toClassName(cssClass))}
    >
      {/* The same `.events-section-header` the upcoming/past groups use, so this
          heading matches them by construction rather than by two rules kept in
          step by hand. It previously rendered in a `.events-explorer-header`
          that set only a margin, leaving its <h2> at the base reset: 18px/400,
          against 37.6px/700 for the two headings directly beneath it. */}
      {hasHeader ? (
        <div className="events-section-header events-explorer-header">
          <div>
            {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
            {heading ? <h2>{accentText(heading)}</h2> : null}
            {subheading ? <p>{subheading}</p> : null}
          </div>
        </div>
      ) : null}

      <EventsExplorerClient
        events={events}
        mode={mode || 'all'}
        pageSize={pageSize}
        showSearch={showSearch}
        labels={labels}
        cardStyle={cardStyle}
        groups={groups}
      />
    </Section>
  )
}
