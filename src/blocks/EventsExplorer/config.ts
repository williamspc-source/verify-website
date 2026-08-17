import type { Block } from 'payload'

import {
  anchorIdField,
  backgroundField,
  cssClassField,
  sectionHeaderFields,
} from '@/fields/blockFields'

// Events Explorer — faithful port of the design reference's events listing pages
// (upcoming-events.html / past-events.html). Renders ALL events from the Events
// collection into a searchable, paginated `.event-list`. The upcoming/past split
// is computed CLIENT-SIDE from the browser's current date, so a statically
// rendered page never goes stale as event dates roll over.
export const EventsExplorer: Block = {
  slug: 'eventsExplorer',
  interfaceName: 'EventsExplorerBlock',
  labels: { singular: 'Events Explorer', plural: 'Events Explorers' },
  fields: [
    ...sectionHeaderFields,
    {
      type: 'row',
      fields: [
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'all',
          label: 'What to show',
          admin: {
            width: '50%',
            description: 'Show upcoming and past, or restrict to one. The split uses the visitor’s current date.',
          },
          options: [
            { label: 'Upcoming & Past', value: 'all' },
            { label: 'Upcoming only', value: 'upcoming-only' },
            { label: 'Past only', value: 'past-only' },
          ],
        },
        {
          name: 'pageSize',
          type: 'number',
          defaultValue: 8,
          min: 1,
          max: 50,
          label: 'Events per page',
          admin: { width: '50%', description: 'How many events show before pagination.' },
        },
      ],
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show search / filter bar',
    },
    {
      // The reference has two event presentations, and which one is right
      // depends on the page. The dedicated listings (upcoming-events.html /
      // past-events.html) use full-width list rows with a calendar block; the
      // hub (events-seminars.html) uses bordered cards with an image panel.
      // Defaulting to `list` keeps both child pages exactly as they are.
      name: 'cardStyle',
      type: 'select',
      defaultValue: 'list',
      label: 'Event presentation',
      admin: {
        description:
          'List rows suit a dedicated listing page. Cards suit a hub or overview, and show each event’s image.',
      },
      options: [
        { label: 'List rows (dedicated listing)', value: 'list' },
        { label: 'Cards with image (hub / overview)', value: 'card' },
      ],
    },
    {
      // Card mode gives each group the reference's `.events-section-header`:
      // an eyebrow, a heading whose [[bracketed]] half takes the brand accent,
      // a line of copy, and a "View more" button aligned to the right.
      name: 'groups',
      type: 'group',
      label: 'Section headers (card presentation)',
      admin: {
        condition: (_, siblingData) => siblingData?.cardStyle === 'card',
        description:
          'Shown above each group when the Cards presentation is used. Wrap part of a heading in [[double brackets]] to tint it with the brand colour.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'upcomingEyebrow', type: 'text', label: 'Upcoming · eyebrow', admin: { width: '50%' } },
            { name: 'upcomingHeading', type: 'text', label: 'Upcoming · heading', admin: { width: '50%' } },
          ],
        },
        { name: 'upcomingIntro', type: 'textarea', label: 'Upcoming · intro' },
        {
          type: 'row',
          fields: [
            { name: 'upcomingLinkLabel', type: 'text', label: 'Upcoming · link label', admin: { width: '50%' } },
            { name: 'upcomingLinkUrl', type: 'text', label: 'Upcoming · link URL', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'pastEyebrow', type: 'text', label: 'Past · eyebrow', admin: { width: '50%' } },
            { name: 'pastHeading', type: 'text', label: 'Past · heading', admin: { width: '50%' } },
          ],
        },
        { name: 'pastIntro', type: 'textarea', label: 'Past · intro' },
        {
          type: 'row',
          fields: [
            { name: 'pastLinkLabel', type: 'text', label: 'Past · link label', admin: { width: '50%' } },
            { name: 'pastLinkUrl', type: 'text', label: 'Past · link URL', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'labels',
      type: 'group',
      label: 'Labels & messages',
      admin: {
        description:
          'Editable UI text for this block — buttons, group headings, the search bar and empty-state messages. Leave a field blank to use its default.',
      },
      fields: [
        {
          name: 'moreInfoLabel',
          type: 'text',
          admin: { description: 'Button on each upcoming event. Default: “More Info”.' },
        },
        {
          name: 'viewRecapLabel',
          type: 'text',
          admin: { description: 'Button on each past event. Default: “View Recap”.' },
        },
        {
          name: 'upcomingHeading',
          type: 'text',
          admin: {
            description:
              'Heading above the upcoming list (shown only in “Upcoming & Past” mode). Default: “Upcoming Events”.',
          },
        },
        {
          name: 'pastHeading',
          type: 'text',
          admin: {
            description:
              'Heading above the past list (shown only in “Upcoming & Past” mode). Default: “Past Events”.',
          },
        },
        {
          name: 'emptyUpcoming',
          type: 'text',
          admin: {
            description:
              'Message when there are no upcoming events. Default: “No upcoming events are listed right now — please check back soon.”.',
          },
        },
        {
          name: 'emptyUpcomingSearch',
          type: 'text',
          admin: {
            description:
              'Message when a search matches no upcoming events. Default: “No upcoming events match your search.”.',
          },
        },
        {
          name: 'emptyPast',
          type: 'text',
          admin: {
            description: 'Message when there are no past events. Default: “No past events to show yet.”.',
          },
        },
        {
          name: 'emptyPastSearch',
          type: 'text',
          admin: {
            description:
              'Message when a search matches no past events. Default: “No past events match your search.”.',
          },
        },
        {
          name: 'loadingLabel',
          type: 'text',
          admin: {
            description: 'Shown briefly while events load in the browser. Default: “Loading events…”.',
          },
        },
        {
          name: 'searchPlaceholder',
          type: 'text',
          admin: { description: 'Placeholder in the search box. Default: “Search”.' },
        },
        {
          name: 'datesLabel',
          type: 'text',
          admin: {
            description: 'Label on the (decorative) dates control in the filter bar. Default: “Dates”.',
          },
        },
        {
          name: 'searchButtonLabel',
          type: 'text',
          admin: { description: 'Text on the filter bar’s submit button. Default: “Search”.' },
        },
      ],
    },
    anchorIdField,
    backgroundField,
    cssClassField,
  ],
}
