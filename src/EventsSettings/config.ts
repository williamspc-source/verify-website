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

export const EventsSettings: GlobalConfig = {
  slug: 'events-settings',
  label: 'Events Settings',
  access: { read: () => true },
  admin: {
    group: 'Content',
    description: 'Host-specific boilerplate copy shown on event detail pages (AAMLE / VERIFY).',
  },
  fields: [hostGroup('aamle', 'AAMLE events'), hostGroup('verify', 'VERIFY events')],
  hooks: {
    afterChange: [revalidateGlobal('events-settings')],
  },
}
