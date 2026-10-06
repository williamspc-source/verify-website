import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  EventsExplorerClient,
  type EventItem,
} from '@/blocks/EventsExplorer/EventsExplorerClient'

/**
 * The location shown on an events listing, and when it is a link.
 *
 * The bug this pins: the listing wrapped the location in an <a> to the EVENT'S
 * OWN PAGE, unconditionally, around a flattened copy of the text. So an editor
 * who added a link to the Location field saw it ignored, and one who then removed
 * that link saw the location still linked — now to the event's URL. "Remove the
 * link" changed where it pointed instead of removing it.
 *
 * The rule now: the page shows exactly what the editor left in the field. A link
 * exists iff the field contains one, and it points where the editor pointed it.
 *
 * Like the inline-rich-text tests, these read the markup: the wrong behaviour
 * renders without error and merely links where it should not.
 *
 * The breaks, run:
 *
 *  · Put the old `<a href={href}>` back around the location in `EventRow` →
 *    "plain text is not a link" and "an editor link points where it was
 *    pointed" both fail.
 *  · Drop `locationRich` from `serialise()` in EventsExplorer/Component.tsx →
 *    the editor-link cases fail (the link is flattened away again), while the
 *    plain-text cases keep passing — which is why both halves are tested.
 */

const EVENT_PAGE = '/events/event/the-grove-seminar'
const VENUE_URL = 'https://maps.example.com/the-grove-rooftop'

const text = (t: string) => ({
  type: 'text',
  text: t,
  version: 1,
  format: 0,
  mode: 'normal',
  style: '',
  detail: 0,
})

const link = (url: string, label: string) => ({
  type: 'link',
  version: 3,
  format: '',
  indent: 0,
  direction: 'ltr',
  fields: { linkType: 'custom', url, newTab: true },
  children: [text(label)],
})

const field = (...children: unknown[]) =>
  ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          children,
        },
      ],
    },
  }) as unknown as EventItem['locationRich']

// A past event, so it lands in a rendered group whatever today's date is.
const event = (over: Partial<EventItem>): EventItem => ({
  id: '1',
  title: 'The Grove Seminar',
  slug: 'the-grove-seminar',
  date: '2020-03-04T00:00:00.000Z',
  timeLabel: '',
  location: 'The Grove Rooftop',
  eventType: '',
  typeLabel: 'Event',
  cpdEligible: false,
  cost: '',
  excerpt: '',
  registrationUrl: '',
  image: null,
  ...over,
})

const renderList = (e: EventItem, cardStyle: 'list' | 'card' = 'list') =>
  render(
    <EventsExplorerClient
      events={[e]}
      mode="past-only"
      pageSize={10}
      showSearch={false}
      cardStyle={cardStyle}
    />,
  )

afterEach(cleanup)

describe('events listing — location (list rows)', () => {
  it('plain text is not a link', () => {
    const { container } = renderList(
      event({ locationRich: field(text('The Grove Rooftop')) }),
    )
    const meta = container.querySelector('.event-list-meta') as HTMLElement
    expect(meta.textContent).toContain('The Grove Rooftop')
    expect(meta.querySelectorAll('a')).toHaveLength(0)
  })

  it('never links the location to the event page itself', () => {
    const { container } = renderList(event({ locationRich: field(text('The Grove Rooftop')) }))
    const hrefs = Array.from(container.querySelectorAll('.event-list-meta a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).not.toContain(EVENT_PAGE)
  })

  it('an editor link points where the editor pointed it', () => {
    const { container } = renderList(
      event({ locationRich: field(link(VENUE_URL, 'The Grove Rooftop')) }),
    )
    const anchors = container.querySelectorAll('.event-list-meta a')
    expect(anchors).toHaveLength(1)
    expect(anchors[0].getAttribute('href')).toBe(VENUE_URL)
    expect(anchors[0].textContent).toBe('The Grove Rooftop')
  })

  it('a partly-linked location keeps its words together', () => {
    const { container } = renderList(
      event({
        location: 'The Grove Rooftop',
        locationRich: field(text('The Grove '), link(VENUE_URL, 'Rooftop')),
      }),
    )
    const where = container.querySelector('.event-list-location') as HTMLElement
    expect(where.textContent).toBe('The Grove Rooftop')
    expect(where.querySelectorAll('a')).toHaveLength(1)
    expect(where.querySelector('a')?.textContent).toBe('Rooftop')
  })

  it('a plain-string location with no rich value is shown, unlinked', () => {
    const { container } = renderList(event({ location: 'The Grove Rooftop' }))
    const meta = container.querySelector('.event-list-meta') as HTMLElement
    expect(meta.textContent).toContain('The Grove Rooftop')
    expect(meta.querySelectorAll('a')).toHaveLength(0)
  })

  it('no location, no location row', () => {
    const { container } = renderList(event({ location: '', locationRich: field() }))
    expect(container.querySelector('.event-list-location')).toBeNull()
    expect(container.querySelector('.event-list-meta a')).toBeNull()
  })
})

describe('events listing — location (cards)', () => {
  it('plain text is not a link', () => {
    const { container } = renderList(
      event({ locationRich: field(text('The Grove Rooftop')) }),
      'card',
    )
    const meta = container.querySelector('.event-card-meta') as HTMLElement
    expect(meta.textContent).toContain('The Grove Rooftop')
    expect(meta.querySelectorAll('a')).toHaveLength(0)
  })

  it('an editor link is honoured', () => {
    const { container } = renderList(
      event({ locationRich: field(link(VENUE_URL, 'The Grove Rooftop')) }),
      'card',
    )
    const a = container.querySelector('.event-card-meta a')
    expect(a?.getAttribute('href')).toBe(VENUE_URL)
  })
})
