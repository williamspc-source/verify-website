import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import {
  anchorIdField,
  backgroundField,
  containerWidthField,
  cssClassField,
  iconField,
  motionField,
} from '@/fields/blockFields'

// AAMLE educational-services showcase (homepage "Educational Services" tab).
// Reproduces the design's 2-col intro, the numbered gradient feature panels, the
// soft sponsorship note and the closing CTA — every label, icon, badge, paragraph,
// bullet and link is editable.
export const AamleEducation: Block = {
  slug: 'aamleEducation',
  interfaceName: 'AamleEducationBlock',
  labels: { singular: 'AAMLE Education', plural: 'AAMLE Education Sections' },
  fields: [
    backgroundField,

    // ── Intro (2-column: label + heading on the left, description on the right) ──
    {
      name: 'intro',
      type: 'group',
      label: 'Intro',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'What AAMLE Offers',
          admin: { description: 'Small uppercase eyebrow above the heading (left column).' },
        },
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Complimentary Education [[for Industry Professionals]]',
          admin: {
            description:
              'Wrap the accented phrase in [[brackets]] to colour it in the brand blue, e.g. "Complimentary Education [[for Industry Professionals]]".',
          },
        },
        {
          name: 'description',
          type: 'richText',
          admin: { description: 'Right-column intro paragraph(s). Bold is supported.' },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },

    // ── Feature panels (numbered gradient rows) ──
    {
      name: 'panels',
      type: 'array',
      label: 'Feature panels',
      labels: { singular: 'Panel', plural: 'Panels' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'step',
              type: 'text',
              defaultValue: '01',
              admin: { width: '33%', description: 'Large faint step number, e.g. "01".' },
            },
            iconField({ admin: { width: '33%', description: 'Icon shown in the left column.' } }),
            {
              name: 'badge',
              type: 'text',
              admin: { width: '34%', description: 'Small pill label, e.g. "Free to Join".' },
            },
          ],
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'badgeAccent',
          type: 'checkbox',
          label: 'Brighter badge',
          admin: { description: 'Use the brighter (accent) badge style.' },
        },
        {
          name: 'description',
          type: 'richText',
          admin: { description: 'Right-column paragraph(s). Bold / italic supported.' },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'list',
          type: 'array',
          label: 'Bulleted list',
          labels: { singular: 'Item', plural: 'Items' },
          admin: { description: 'Optional bullet list shown under the description.' },
          fields: [{ name: 'item', type: 'text', required: true }],
        },
      ],
    },

    // ── Sponsorship soft note ──
    {
      name: 'sponsor',
      type: 'group',
      label: 'Sponsorship note',
      fields: [
        iconField({ defaultValue: 'handshake' }),
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Sponsorship Opportunities',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Industry partners may sponsor AAMLE educational events and initiatives to support professional development across the medico-legal sector.',
        },
      ],
    },

    // ── Closing CTA ── (appearances off: keeps nested-in-Tabs enum names under
    // Postgres' 63-char limit)
    link({ appearances: false, overrides: { label: 'Call-to-action button' } }),

    anchorIdField,
    cssClassField,
    containerWidthField,
    motionField,
  ],
}
