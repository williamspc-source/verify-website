import type { Event } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Section } from '@/components/Section'
import type { SectionBackground } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

import { EventsExplorerClient } from './EventsExplorerClient'
import type { EventItem, EventsExplorerLabels } from './EventsExplorerClient'

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

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

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
  anchorId?: string | null
  background?: SectionBackground | null
  cssClass?: string | string[] | null
  bare?: boolean
}

const serialise = (e: Event): EventItem => ({
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
  image: mediaUrl(e.image),
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

  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 200,
    pagination: false,
    overrideAccess: false,
    sort: 'date',
  })

  const events = res.docs.map(serialise)

  const hasHeader = Boolean(eyebrow || heading || subheading)

  return (
    <Section
      bare={bare}
      background={background || 'white'}
      id={anchorId || undefined}
      className={cn('events-explorer', toClassName(cssClass))}
    >
      {hasHeader ? (
        <div className="events-explorer-header">
          {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
          {heading ? <h2>{accentText(heading)}</h2> : null}
          {subheading ? <p>{subheading}</p> : null}
        </div>
      ) : null}

      <EventsExplorerClient
        events={events}
        mode={mode || 'all'}
        pageSize={pageSize}
        showSearch={showSearch}
        labels={labels}
      />
    </Section>
  )
}
