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
  cssClassField,
  displayFields,
  elementClassesField,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

// Founder / leadership spotlight — a two-column band pairing a portrait (with a
// floating name/role badge) against a labelled headline, italic pull-quote, body
// copy, a row of credential pills and a CTA. Faithful port of the About page
// `.leadership` section; every string, the photo, the credentials and the link
// are editable.
export const LeadershipSpotlight: Block = {
  slug: 'leadershipSpotlight',
  interfaceName: 'LeadershipSpotlightBlock',
  labels: { singular: 'Leadership Spotlight', plural: 'Leadership Spotlights' },
  fields: [
    // Content-column header: eyebrow (section-label) + heading (section-title).
    // Wrap a word in [[brackets]] in the heading to accent it. `subheading` is an
    // optional lead paragraph.
    ...sectionHeaderFields,
    { ...backgroundField, defaultValue: 'muted' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Founder portrait. Falls back to a labelled placeholder when empty.' },
    },
    iconField({
      name: 'placeholderIcon',
      label: 'Placeholder icon',
      defaultValue: 'user-circle',
      admin: { description: 'Icon shown in the photo placeholder when no portrait is set.' },
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Wes Lerch',
          admin: { width: '50%', description: 'Name shown on the floating badge.' },
        },
        {
          name: 'role',
          type: 'text',
          defaultValue: 'Founder & Managing Director',
          admin: { width: '50%', description: 'Role line beneath the name on the badge.' },
        },
      ],
    },
    {
      name: 'badge',
      type: 'text',
      admin: {
        description: 'Optional small kicker above the name on the floating badge, e.g. "Founder".',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue:
        '"I built VERIFY because I knew what the industry needed — and I knew it wasn\'t being delivered."',
      admin: { description: 'Short italic pull-quote shown above the body copy.' },
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'credentials',
      type: 'array',
      labels: { singular: 'Credential', plural: 'Credentials' },
      admin: { description: 'Credential pills, e.g. "25+ Years — Personal Injury Law".' },
      fields: [{ name: 'cred', type: 'text', required: true }],
    },
    link({ appearances: false }),
    cssClassField,
    elementClassesField,
    ...displayFields,
    anchorIdField,
  ],
}
