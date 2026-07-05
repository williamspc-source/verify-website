import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  anchorIdField,
  cssClassField,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    ...sectionHeaderFields,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '1',
      admin: { description: 'Lay the questions out in one or two columns.' },
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'question', type: 'text', required: true, admin: { width: '70%' } },
            iconField({ admin: { width: '30%', description: 'Optional icon.' } }),
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional image shown with this item (accordion-with-image layout).' },
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
        anchorIdField,
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'exclusive',
          type: 'checkbox',
          label: 'Only one open at a time',
          admin: { width: '50%', description: 'Opening one question closes the others.' },
        },
        {
          name: 'openFirst',
          type: 'checkbox',
          label: 'Open the first item by default',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'helpCard',
      type: 'group',
      label: 'Help card (optional)',
      admin: { description: 'A "still have questions?" card shown after the list.' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'text', admin: { width: '50%' } },
            { name: 'phone', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    // Block-level anchor id (distinct from the per-item anchorId inside `items`)
    // so header/deep links like `/ime#claim-types` can target the whole block.
    anchorIdField,
    cssClassField,
  ],
  labels: {
    plural: 'FAQs',
    singular: 'FAQ',
  },
}
