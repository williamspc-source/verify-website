import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { cssClassField } from '@/fields/blockFields'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Optional heading shown above the questions.' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
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
    {
      name: 'exclusive',
      type: 'checkbox',
      label: 'Only one open at a time',
      admin: { description: 'Opening one question closes the others.' },
    },
    cssClassField,
  ],
  labels: {
    plural: 'FAQs',
    singular: 'FAQ',
  },
}
