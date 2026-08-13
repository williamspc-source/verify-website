import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateSiteOnChange, revalidateSiteOnDelete } from '@/utilities/revalidateSite'

// Client testimonials shown across the site (home "What Our Clients Say", etc.).
// Fully admin-editable — the front end never hardcodes quotes.
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'authorRole',
    group: 'Content',
    defaultColumns: ['authorRole', 'org', 'featured', 'order'],
  },
  // The card is two attribution lines — position, then organisation and location
  // (design reference index.html:472-475). It carries no portrait and no personal
  // name; these are anonymised client quotes. `authorName` and `avatar` used to
  // exist here and were removed rather than left as controls that render nothing.
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'The testimonial text (no surrounding quotation marks needed).' },
    },
    {
      name: 'authorRole',
      type: 'text',
      required: true,
      admin: {
        description: 'Line 1 of the attribution — the position, e.g. "Senior Associate".',
      },
    },
    {
      name: 'org',
      type: 'text',
      label: 'Organisation and location',
      admin: {
        description:
          'Line 2 of the attribution, e.g. "Personal Injury Law Firm — Brisbane, QLD". Leave empty to show the position alone.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          defaultValue: 5,
          min: 1,
          max: 5,
          admin: { width: '50%', description: 'Star rating (1–5).' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { width: '50%', description: 'Lower numbers appear first.' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show in featured testimonial listings.' },
    },
  ],
  hooks: {
    afterChange: [revalidateSiteOnChange],
    afterDelete: [revalidateSiteOnDelete],
  },
}
