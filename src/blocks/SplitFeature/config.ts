import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import {
  backgroundField,
  cssClassField,
  displayFields,
  elementClassesField,
} from '@/fields/blockFields'

export const SplitFeature: Block = {
  slug: 'splitFeature',
  interfaceName: 'SplitFeatureBlock',
  labels: { singular: 'Split Feature', plural: 'Split Features' },
  fields: [
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
        { name: 'eyebrow', type: 'text' },
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
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullet', plural: 'Bullets' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        link({ appearances: false }),
      ],
    },
    cssClassField,
    elementClassesField,
    ...displayFields,
  ],
}
