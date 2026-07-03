import type { Block } from 'payload'

import { link } from '@/fields/link'
import {
  cssClassField,
  displayFields,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

// A simple single-line "icon + text" list (e.g. the booking-portal "What you can
// do" chips). Distinct from FeatureGrid, whose items are icon + title + description
// cards.
export const IconList: Block = {
  slug: 'iconList',
  interfaceName: 'IconListBlock',
  labels: { singular: 'Icon List', plural: 'Icon Lists' },
  fields: [
    ...sectionHeaderFields,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        {
          type: 'row',
          fields: [
            iconField({ admin: { width: '30%' } }),
            { name: 'text', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        link({ appearances: false, disableLabel: true }),
      ],
    },
    cssClassField,
    ...displayFields,
  ],
}
