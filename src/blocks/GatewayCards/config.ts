import type { Block } from 'payload'

import { link } from '@/fields/link'
import {
  backgroundField,
  cssClassField,
  elementClassesField,
  gridDisplayFields,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

export const GatewayCards: Block = {
  slug: 'gatewayCards',
  interfaceName: 'GatewayCardsBlock',
  labels: { singular: 'Gateway Cards', plural: 'Gateway Cards' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        iconField(),
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'links',
          type: 'array',
          label: 'Quick links',
          labels: { singular: 'Link', plural: 'Links' },
          maxRows: 6,
          admin: { description: 'Listed in the lower panel above the call-to-action button.' },
          fields: [link({ appearances: false })],
        },
        link({ appearances: false }),
      ],
    },
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
