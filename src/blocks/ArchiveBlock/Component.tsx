import type {
  Post,
  Event,
  Category,
  Stream,
  Media as MediaType,
  ArchiveBlock as ArchiveBlockProps,
} from '@/payload-types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
import { cn } from '@/utilities/ui'
import { bgClasses, type SectionBackground } from '@/components/Section'
import { toClassName } from '@/utilities/cssClass'
import { postPath, eventPath, IN_THE_LOOP_PATH } from '@/utilities/routes'

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatDate = (value?: string | null, long = false): string => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const months = long ? MONTHS_LONG : MONTHS_SHORT
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

// Map a stream slug to the design-reference card tint suffix (img-*/tag-*).
const STREAM_TINT: Record<string, string> = {
  'news-updates': 'news',
  'industry-insights': 'insights',
  'specialist-spotlights': 'spotlight',
  'qa-insights': 'qa',
  resources: 'resource',
  'staff-narratives': 'news',
  featured: 'news',
}

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

// Resolve a post's byline (name/role/photo) from the free-text author fields,
// falling back to a linked Team member / Specialist (source relationship).
type AuthorInfo = { name: string | null; role: string | null; photo: MediaType | null }
const resolveAuthor = (post: Post): AuthorInfo => {
  const author = post.author
  let name = author?.name || null
  let role = author?.role || null
  let photo = author?.photo && typeof author.photo === 'object' ? (author.photo as MediaType) : null

  const source = author?.source
  if (source && typeof source === 'object' && source.value && typeof source.value === 'object') {
    const person = source.value as {
      title?: string | null
      role?: string | null
      position?: string | null
      photo?: unknown
    }
    if (!name) name = person.title || null
    if (!role) role = person.role || person.position || null
    if (!photo && person.photo && typeof person.photo === 'object') {
      photo = person.photo as MediaType
    }
  }

  return { name, role, photo }
}

// Category/stream label for a post, preferring the post's OWN first category so
// each card shows its specific tag (e.g. "Company News" vs "Industry News").
const postTagLabel = (post: Post, stream: Stream | null): string | null => {
  const firstCategory = Array.isArray(post.categories)
    ? (post.categories.find((c) => typeof c === 'object') as Category | undefined)
    : undefined
  return firstCategory?.title || stream?.title || null
}

// ── Staff-narrative card (In-the-Loop → Staff Narratives) ───
const NarrativeCard: React.FC<{ post: Post; readMoreLabel: string }> = ({ post, readMoreLabel }) => {
  if (!post) return null

  const stream = typeof post.stream === 'object' && post.stream ? (post.stream as Stream) : null
  const { name, role, photo } = resolveAuthor(post)
  const tagLabel = postTagLabel(post, stream)
  const dateLabel = formatDate(post.publishedAt)
  // Stream-less legacy posts have no canonical article URL; send them to the hub
  // rather than emit the /in-the-loop/<slug> path that resolves as a stream → 404.
  const href = postPath(post) ?? IN_THE_LOOP_PATH

  return (
    <div className="ni-narrative-card">
      <div className="ni-narrative-author">
        <div className="ni-narrative-avatar">
          {photo ? (
            <Media resource={photo} fill imgClassName="ni-narrative-photo" />
          ) : (
            <Icon name="user-circle" weight="regular" />
          )}
        </div>
        <div>
          {name && <div className="ni-narrative-name">{name}</div>}
          {role && <div className="ni-narrative-role">{role}</div>}
        </div>
      </div>
      <div>
        <a className="ni-narrative-title" href={href}>
          {post.title}
        </a>
        {post.excerpt && <p className="ni-narrative-excerpt">{post.excerpt}</p>}
      </div>
      <div className="ni-narrative-footer">
        <div className="ni-narrative-meta">
          {tagLabel && <span className="ni-narrative-tag">{tagLabel}</span>}
          {dateLabel && <span className="ni-narrative-date">{dateLabel}</span>}
        </div>
        <a className="ni-narrative-link" href={href}>
          {readMoreLabel}
        </a>
      </div>
    </div>
  )
}

// ── Post card (In-the-Loop hub) ─────────────────────────────
const PostCard: React.FC<{ post: Post; readMoreLabel: string }> = ({ post, readMoreLabel }) => {
  if (!post) return null

  const stream = typeof post.stream === 'object' && post.stream ? (post.stream as Stream) : null
  const streamSlug = stream?.slug ?? null
  const tint = (streamSlug && STREAM_TINT[streamSlug]) || 'news'

  const chipLabel = postTagLabel(post, stream)

  const heroImage =
    post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null

  const href = postPath(post) ?? IN_THE_LOOP_PATH

  const dateLabel = formatDate(post.publishedAt)

  return (
    <a className="ni-card" href={href}>
      <div className={cn('ni-card-img', `img-${tint}`)}>
        {heroImage ? (
          <Media resource={heroImage} fill imgClassName="ni-card-photo" />
        ) : (
          <Icon name={stream?.icon || 'file-text'} weight="regular" />
        )}
      </div>
      <div className="ni-card-body">
        <div className="ni-card-meta">
          {chipLabel && <span className={cn('ni-card-tag', `tag-${tint}`)}>{chipLabel}</span>}
          {dateLabel && <span className="ni-card-date">{dateLabel}</span>}
        </div>
        <div className="ni-card-title">{post.title}</div>
        {post.excerpt && <p className="ni-card-excerpt">{post.excerpt}</p>}
        <span className="ni-card-link">{readMoreLabel}</span>
      </div>
    </a>
  )
}

// Format/status line for the compact card: "Webinar · CPD Eligible · Free".
const eventFormatLine = (event: Event, typeLabel: string | null): string => {
  const parts: string[] = []
  if (typeLabel) parts.push(typeLabel)
  if (event.cpdEligible) parts.push('CPD Eligible')
  const cost = typeof event.cost === 'string' ? event.cost.trim() : ''
  if (cost) parts.push(cost)
  else if (event.cpdEligible) parts.push('Free')
  return parts.join('  ·  ')
}

// ── Compact event card (In-the-Loop hub) ────────────────────
const EventHubCard: React.FC<{ event: Event; typeLabel: string | null }> = ({
  event,
  typeLabel,
}) => {
  const d = event.date ? new Date(event.date) : null
  const validDate = d && !Number.isNaN(d.getTime()) ? d : null
  const href = eventPath(event.slug) ?? '/events'

  return (
    <div className="ni-event-card">
      {validDate && (
        <div className="ni-event-date-badge">
          <span className="day">{validDate.getDate()}</span>
          <span className="month">{MONTHS_SHORT[validDate.getMonth()]}</span>
        </div>
      )}
      <div className="ni-event-body">
        <span className="ni-event-format">{eventFormatLine(event, typeLabel)}</span>
        <a className="ni-event-title" href={href}>
          {event.title}
        </a>
        {event.excerpt && <p className="ni-event-desc">{event.excerpt}</p>}
        <a className="ni-event-link" href={event.registrationUrl || href}>
          {event.registrationLabel || 'Register Now'} →
        </a>
      </div>
    </div>
  )
}

// ── Event card (Events list) ────────────────────────────────
const EventCard: React.FC<{ event: Event; isPast: boolean; compact?: boolean }> = ({
  event,
  isPast,
  compact,
}) => {
  if (!event) return null

  const typeLabel = event.eventType ? EVENT_TYPE_LABELS[event.eventType] || event.eventType : null

  if (compact) return <EventHubCard event={event} typeLabel={typeLabel} />

  const image = event.image && typeof event.image === 'object' ? event.image : null
  const dateLabel = formatDate(event.date, true)
  const href = eventPath(event.slug) ?? '/events'

  return (
    <article className="event-card">
      <a className="event-card-media" href={href}>
        {/* The reference prints a fixed "Event image" here. We print the date
            instead, so a panel still awaiting a photograph tells the visitor
            something. Matches EventsExplorer's card, which shares this design. */}
        {image ? (
          <Media resource={image} fill imgClassName="event-card-photo" />
        ) : (
          <span>{dateLabel || 'Event image'}</span>
        )}
      </a>
      <div className="event-card-body">
        <div className="event-card-top">
          {dateLabel && <span className="event-card-date">{dateLabel}</span>}
          {typeLabel && <span className="event-type-tag">{typeLabel}</span>}
        </div>
        <h3>{event.title}</h3>
        {event.excerpt && <p className="event-card-desc">{event.excerpt}</p>}
        <div className="event-card-meta">
          {event.timeLabel && <span>{event.timeLabel}</span>}
          {event.location && <span>{event.location}</span>}
        </div>
        <a className="event-card-link" href={href}>
          {isPast ? 'View recap' : 'More info'} →
        </a>
      </div>
    </article>
  )
}

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    relationTo,
    view,
    columns,
    stream,
    featured,
    selectedDocs,
    viewAllLink,
  } = props
  const {
    cssClass,
    postStyle,
    eventStyle,
    anchorId,
    background,
  } = props as {
    cssClass?: string | string[] | null
    postStyle?: 'card' | 'narrative' | null
    eventStyle?: 'card' | 'compact' | null
    anchorId?: string | null
    background?: SectionBackground | null
  }
  const readMoreLabel =
    (props as { readMoreLabel?: string | null }).readMoreLabel || 'Read More →'

  const limit = limitFromProps || 3
  const now = new Date()

  let posts: Post[] = []
  let events: Event[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    if (relationTo === 'events') {
      const nowISO = now.toISOString()
      const where: Where | undefined =
        view === 'upcoming'
          ? { date: { greater_than_equal: nowISO } }
          : view === 'past'
            ? { date: { less_than: nowISO } }
            : undefined

      const fetched = await payload.find({
        collection: 'events',
        // Without this the Local API's overrideAccess default bypasses
        // authenticatedOrPublished and archives list unpublished drafts.
        overrideAccess: false,
        depth: 1,
        limit,
        // upcoming → soonest first; past → most recent first
        sort: view === 'past' ? '-date' : 'date',
        ...(where ? { where } : {}),
      })

      events = fetched.docs
    } else {
      const flattenedCategories = categories?.map((category) =>
        typeof category === 'object' ? category.id : category,
      )
      const streamId = stream ? (typeof stream === 'object' ? stream.id : stream) : null

      const and: Where[] = []
      if (flattenedCategories && flattenedCategories.length > 0) {
        and.push({ categories: { in: flattenedCategories } })
      }
      if (streamId) {
        and.push({ stream: { equals: streamId } })
      }
      if (featured) {
        and.push({ featured: { equals: true } })
      }

      const fetched = await payload.find({
        collection: 'posts',
        overrideAccess: false,
        // depth 2 so the author's linked Team member / Specialist (and their photo)
        // are populated for the staff-narrative byline.
        depth: 2,
        limit,
        sort: '-publishedAt',
        ...(and.length > 0 ? { where: { and } } : {}),
      })

      posts = fetched.docs
    }
  } else if (selectedDocs?.length) {
    // Individual selection can mix posts and events.
    selectedDocs.forEach((doc) => {
      if (!doc || typeof doc.value !== 'object' || doc.value === null) return
      if (doc.relationTo === 'events') events.push(doc.value as Event)
      else posts.push(doc.value as Post)
    })
  }

  const hasContent = posts.length > 0 || events.length > 0
  const isNarrative = postStyle === 'narrative'
  const isCompactEvents = eventStyle === 'compact'
  const columnClass = `ni-grid-${columns || '3'}`
  const eventColumnClass = `ni-grid-${columns || '2'}`

  return (
    // Archive is the only one of 23 backgroundField consumers that rendered a
    // plain <div>, so its "Section background colour" select — six options —
    // did nothing at all. Apply the same band classes <Section> uses.
    <div
      className={cn(background ? bgClasses[background] : undefined, toClassName(cssClass))}
      id={anchorId || `block-${id}`}
    >
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}

      {posts.length > 0 && (
        <div className="container">
          <div className={isNarrative ? 'ni-narrative-grid' : columnClass}>
            {posts.map((post, index) =>
              isNarrative ? (
                <NarrativeCard key={post?.id ?? index} post={post} readMoreLabel={readMoreLabel} />
              ) : (
                <PostCard key={post?.id ?? index} post={post} readMoreLabel={readMoreLabel} />
              ),
            )}
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="container">
          <div className={isCompactEvents ? eventColumnClass : 'events-card-grid'}>
            {events.map((event, index) => (
              <EventCard
                key={event?.id ?? index}
                event={event}
                compact={isCompactEvents}
                isPast={view === 'past' || (!!event?.date && new Date(event.date) < now)}
              />
            ))}
          </div>
        </div>
      )}

      {hasContent && viewAllLink?.link?.label && (
        <div className="container mt-8 flex justify-end">
          <CMSLink className="ni-view-all" {...viewAllLink.link}>
            <Icon name="arrow-right" className="size-4" />
          </CMSLink>
        </div>
      )}
    </div>
  )
}
