import type { Block } from 'payload'

import { anchorIdField, backgroundField, cssClassField } from '@/fields/blockFields'

// Featured-article carousel (design ref: .ni-featured / .ni-carousel on the
// "In the Loop" page). One full-width article slide at a time with autoplay,
// prev/next arrows and dot indicators. Fully data-driven from the Posts
// collection — either auto (featured posts / the Featured stream) or a manual
// hand-picked selection.
export const FeaturedArticles: Block = {
  slug: 'featuredArticles',
  interfaceName: 'FeaturedArticlesBlock',
  labels: { singular: 'Featured Articles Carousel', plural: 'Featured Articles Carousels' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Featured',
      admin: { description: 'Small uppercase label above the carousel (optional).' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      admin: {
        description:
          'Auto: newest featured posts (checkbox "Featured" or the Featured stream). Manual: hand-pick posts below.',
      },
      options: [
        { label: 'Automatic (featured posts)', value: 'auto' },
        { label: 'Manual selection', value: 'manual' },
      ],
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        condition: (_data, siblingData) => siblingData?.source === 'manual',
        description: 'The posts to show in the carousel, in order.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        condition: (_data, siblingData) => siblingData?.source !== 'manual',
        description: 'Max number of posts to show (automatic mode).',
      },
    },
    {
      name: 'badgeLabel',
      type: 'text',
      defaultValue: 'Featured',
      admin: {
        description: 'Text of the small badge shown on each slide (defaults to "Featured").',
      },
    },
    {
      name: 'bylinePrefix',
      type: 'text',
      defaultValue: 'By:',
      admin: {
        description:
          'Prefix shown before the author/date byline on each slide (defaults to "By:").',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Read Full Article →',
      admin: {
        description:
          'Text of the "read more" call-to-action link on each slide (defaults to "Read Full Article →").',
      },
    },
    anchorIdField,
    backgroundField,
    cssClassField,
  ],
}
