import type { Block } from 'payload'

import {
  cssClassField,
  headingLevelField,
  headingSizeField,
  textAlignField,
} from '@/fields/blockFields'

// Atom block (nestable-only): a single heading. Level controls the HTML tag for
// SEO/accessibility; size controls the visual scale independently.
export const Heading: Block = {
  slug: 'heading',
  interfaceName: 'HeadingBlock',
  labels: { singular: 'Heading', plural: 'Headings' },
  fields: [
    { name: 'text', type: 'text', required: true },
    { type: 'row', fields: [headingLevelField, headingSizeField] },
    textAlignField,
    cssClassField,
  ],
}
