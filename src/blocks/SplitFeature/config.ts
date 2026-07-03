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

export const SplitFeature: Block = {
  slug: 'splitFeature',
  interfaceName: 'SplitFeatureBlock',
  labels: { singular: 'Split Feature', plural: 'Split Features' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Row', plural: 'Rows' },
      admin: { description: 'Each row alternates image side automatically unless overridden.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imageSide',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Auto (alternate)', value: 'auto' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
            iconField({ admin: { width: '50%', description: 'Optional icon above the title.' } }),
          ],
        },
        { name: 'title', type: 'text', required: true },
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
          name: 'bulletsLabel',
          type: 'text',
          admin: { description: 'Optional mini-heading above the bullets (e.g. "When to Request").' },
        },
        {
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullet', plural: 'Bullets' },
          fields: [
            { name: 'text', type: 'text', required: true },
            iconField({ admin: { description: 'Optional per-bullet icon.' } }),
          ],
        },
        link({ appearances: false }),
        anchorIdField,
      ],
    },
    cssClassField,
    elementClassesField,
    ...displayFields,
  ],
}
