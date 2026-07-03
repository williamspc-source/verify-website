import type { Block } from 'payload'

import {
  alignYField,
  anchorIdField,
  columnSpanField,
  contentBlocksField,
  cssClassField,
  gapField,
  textAlignField,
} from '@/fields/blockFields'
import { NESTABLE_BLOCKS } from '../nestable'

// Layout primitive: a responsive column grid. The number of columns is derived
// from how many columns you add; each column holds its own nested content and can
// span extra tracks. Stacks to a single column on mobile.
export const Row: Block = {
  slug: 'row',
  interfaceName: 'RowBlock',
  labels: { singular: 'Row / Columns', plural: 'Rows' },
  fields: [
    { type: 'row', fields: [gapField, alignYField] },
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      labels: { singular: 'Column', plural: 'Columns' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: 'Each column becomes a grid track. Add columns to widen the row.',
        components: { RowLabel: '@/blocks/Row/ColumnRowLabel#ColumnRowLabel' },
      },
      fields: [
        { type: 'row', fields: [columnSpanField, textAlignField] },
        contentBlocksField(NESTABLE_BLOCKS),
      ],
    },
    cssClassField,
    anchorIdField,
  ],
}
