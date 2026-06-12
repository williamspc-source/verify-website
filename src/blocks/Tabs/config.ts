import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  backgroundField,
  cssClassField,
  displayFields,
  elementClassesField,
  sectionHeaderFields,
} from '@/fields/blockFields'

export const TabsBlock: Block = {
  slug: 'tabs',
  interfaceName: 'TabsBlockType',
  labels: { singular: 'Tabbed Section', plural: 'Tabbed Sections' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'tabs',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Tab', plural: 'Tabs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'content',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tabStyle',
          type: 'select',
          defaultValue: 'pills',
          admin: { width: '50%' },
          options: [
            { label: 'Pills', value: 'pills' },
            { label: 'Underline', value: 'underline' },
          ],
        },
        {
          name: 'defaultTab',
          type: 'number',
          defaultValue: 0,
          admin: { width: '50%', description: 'Index of the tab open by default (0 = first).' },
        },
      ],
    },
    cssClassField,
    elementClassesField,
    ...displayFields,
  ],
}
