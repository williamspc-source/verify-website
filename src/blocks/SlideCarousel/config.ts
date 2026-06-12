import type { Block } from 'payload'

import { cssClassField, elementClassesField } from '@/fields/blockFields'

// Full-width slide carousel — faithful port of the design reference's
// `.events-offer-*` carousel (one slide at a time, arrows + dots + pause/play).
export const SlideCarousel: Block = {
  slug: 'slideCarousel',
  interfaceName: 'SlideCarouselBlock',
  labels: { singular: 'Slide Carousel', plural: 'Slide Carousels' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', admin: { width: '40%' } },
        { name: 'heading', type: 'text', required: true, admin: { width: '60%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'interval',
          type: 'number',
          defaultValue: 5800,
          label: 'Autoplay interval (ms)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Slide', plural: 'Slides' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        {
          name: 'accent',
          type: 'select',
          defaultValue: 'seminars',
          label: 'Visual colour',
          options: [
            { label: 'Blue', value: 'seminars' },
            { label: 'Deep blue', value: 'insights' },
            { label: 'Charcoal', value: 'networking' },
            { label: 'Sky', value: 'sponsorships' },
          ],
        },
        {
          name: 'visualLabel',
          type: 'text',
          label: 'Visual label',
          admin: { description: 'Short word shown on the coloured panel (e.g. "Seminar").' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional. Fills the coloured panel when set.' },
        },
        {
          name: 'pills',
          type: 'array',
          labels: { singular: 'Pill', plural: 'Pills' },
          maxRows: 6,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    cssClassField,
    elementClassesField,
  ],
}
