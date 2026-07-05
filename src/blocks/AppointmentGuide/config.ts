import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { cssClassField, iconField, sectionHeaderFields } from '@/fields/blockFields'

const richBody = {
  name: 'body',
  type: 'richText' as const,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
}

// The For-Claimants "Appointment Guide": a top-level type toggle (In-Person /
// Videolink), each holding a set of tabs, each tab holding icon-led item lists,
// optional highlight cards and an optional callout. Two levels of nesting that no
// existing block expresses.
export const AppointmentGuide: Block = {
  slug: 'appointmentGuide',
  // Short DB name — the deep nesting (block → types → tabs → cards → icon) would
  // otherwise blow past Postgres's 63-char identifier limit for generated enums.
  dbName: 'appt_guide',
  interfaceName: 'AppointmentGuideBlock',
  labels: { singular: 'Appointment Guide', plural: 'Appointment Guides' },
  fields: [
    ...sectionHeaderFields,
    {
      name: 'selectLabel',
      type: 'text',
      label: 'Type selector label',
      admin: {
        description:
          'Small uppercase label shown above the appointment-type toggle. Defaults to "Select your appointment type".',
      },
    },
    {
      name: 'types',
      type: 'array',
      minRows: 1,
      label: 'Appointment types',
      labels: { singular: 'Type', plural: 'Types' },
      admin: { description: 'The top-level toggle (e.g. In-Person, Videolink).' },
      fields: [
        {
          type: 'row',
          fields: [
            iconField({ admin: { width: '20%' } }),
            { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'sublabel', type: 'text', admin: { width: '40%' } },
          ],
        },
        {
          name: 'tabs',
          type: 'array',
          minRows: 1,
          labels: { singular: 'Tab', plural: 'Tabs' },
          fields: [
            {
              type: 'row',
              fields: [
                iconField({ admin: { width: '30%' } }),
                { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
              ],
            },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [iconField(), { name: 'heading', type: 'text', required: true }, richBody],
            },
            {
              name: 'highlightCards',
              type: 'array',
              label: 'Highlight cards',
              dbName: 'hcards',
              fields: [
                iconField(),
                { name: 'title', type: 'text', required: true },
                {
                  name: 'bullets',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'callout',
              type: 'group',
              label: 'Callout (optional)',
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'info',
                  options: [
                    { label: 'Info', value: 'info' },
                    { label: 'Note', value: 'note' },
                    { label: 'Warning', value: 'warning' },
                  ],
                },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },
    cssClassField,
  ],
}
