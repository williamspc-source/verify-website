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
