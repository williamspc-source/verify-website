import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { cssClassField, iconField } from '@/fields/blockFields'

// A standalone info/note callout usable directly in a page or Row column (unlike
// the Lexical-only `banner`). Covers the recurring "Good to know" notes, blue info
// boxes and FAQ help-cards across the design.
export const Callout: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: { singular: 'Callout / Note', plural: 'Callouts' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'info',
          admin: { width: '50%' },
          options: [
            { label: 'Info (blue)', value: 'info' },
            { label: 'Note (neutral)', value: 'note' },
            { label: 'Success (green)', value: 'success' },
            { label: 'Warning (amber)', value: 'warning' },
          ],
        },
        iconField({ admin: { width: '50%' } }),
      ],
    },
    { name: 'tag', type: 'text', admin: { description: 'Optional pill label, e.g. "Good to know".' } },
    { name: 'heading', type: 'text' },
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
    linkGroup({ overrides: { maxRows: 2 } }),
    cssClassField,
  ],
}
