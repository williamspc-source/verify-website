import type { Field, GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/utilities/revalidateGlobal'

// Host-derived boilerplate for event detail pages. The per-event record holds the
// specifics (date/title/etc.); this global holds the copy that only varies by host
// (AAMLE vs VERIFY) so it isn't retyped on every event.
const hostGroup = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'blurb', type: 'textarea', label: 'Program blurb', admin: { description: 'Intro paragraph shown on every event by this host.' } },
    { name: 'callout', type: 'text', label: 'Callout', admin: { description: 'e.g. "Run by AAMLE", "Hosted by VERIFY".' } },
    {
      type: 'row',
      fields: [
        { name: 'attendHeading', type: 'text', defaultValue: 'How to Attend', admin: { width: '50%' } },
        { name: 'recapHeading', type: 'text', defaultValue: 'Event Recap', admin: { width: '50%' } },
      ],
    },
    { name: 'attendBody', type: 'textarea', label: 'How-to-attend copy' },
    {
      type: 'row',
      fields: [
        { name: 'registerLabel', type: 'text', label: 'Register button label', admin: { width: '50%' } },
        { name: 'contactLabel', type: 'text', label: 'Contact button label', admin: { width: '50%' } },
      ],
    },
  ],
})

// Generic UI labels shown on every event detail page, regardless of host.
const labelsGroup: Field = {
  name: 'labels',
  type: 'group',
  label: 'Event page labels',
  admin: {
    description: 'Generic UI labels shown on every event detail page, regardless of host.',
  },
  fields: [
    {
      name: 'presentersHeading',
      type: 'text',
      defaultValue: 'Presenters',
      admin: { description: 'Heading above the presenter cards on an event page.' },
    },
    {
      name: 'breadcrumbSectionLabel',
      type: 'text',
      defaultValue: 'Events & Seminars',
      admin: {
        description:
          'Second breadcrumb link (the events hub). The first crumb — “Home” — is shared site-wide and lives in Site Settings → Breadcrumbs.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'statusUpcomingLabel',
          type: 'text',
          defaultValue: 'Upcoming Event',
          admin: { width: '50%', description: 'Status pill for events still to come.' },
        },
        {
          name: 'statusPastLabel',
          type: 'text',
          defaultValue: 'Past Event',
          admin: { width: '50%', description: 'Status pill for events whose date has passed.' },
        },
      ],
    },
    {
      name: 'freeLabel',
      type: 'text',
      defaultValue: 'Free',
      admin: { description: 'Cost shown when an event has no cost set.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cpdPointsTemplate',
          type: 'text',
          defaultValue: 'CPD · {points} point(s)',
          admin: {
            width: '50%',
            description: 'CPD line when points are set. Use {points} for the number.',
          },
        },
        {
          name: 'cpdEligibleLabel',
          type: 'text',
          defaultValue: 'CPD eligible',
          admin: { width: '50%', description: 'CPD line when eligible but no point count is set.' },
        },
      ],
    },
    {
      name: 'concludedFallback',
      type: 'textarea',
      label: 'Concluded-event fallback',
      defaultValue:
        'This event has now concluded. Contact our team for recordings or resources from this session.',
      admin: { description: 'Shown under a past event that has no recap content.' },
    },
    {
      name: 'backToEventsLabel',
      type: 'text',
      defaultValue: 'Back to all events',
      admin: { description: 'Link back to the events listing at the bottom of the page.' },
    },
  ],
}

export const EventsSettings: GlobalConfig = {
  slug: 'events-settings',
  label: 'Events Settings',
  access: { read: () => true },
  admin: {
    group: 'Content',
    description: 'Host-specific boilerplate copy shown on event detail pages (AAMLE / VERIFY).',
  },
  fields: [hostGroup('aamle', 'AAMLE events'), hostGroup('verify', 'VERIFY events'), labelsGroup],
  hooks: {
    afterChange: [revalidateGlobal('events-settings')],
  },
}
