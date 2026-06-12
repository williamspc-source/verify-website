import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { cssClassField, displayFields, elementClassesField } from '@/fields/blockFields'

export const CTABand: Block = {
  slug: 'ctaBand',
  interfaceName: 'CTABandBlock',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  // Always a dark gradient band — no background option.
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    linkGroup({ overrides: { maxRows: 2 } }),
    cssClassField,
    elementClassesField,
    ...displayFields,
  ],
}
