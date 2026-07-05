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
    defaultColumns: ['authorRole', 'authorName', 'featured', 'order'],
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'The testimonial text (no surrounding quotation marks needed).' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'authorRole',
          type: 'text',
          required: true,
          admin: {
            width: '60%',
            description: 'e.g. "Senior Associate, Legal Firm — Brisbane".',
          },
        },
        {
          name: 'authorName',
          type: 'text',
          admin: { width: '40%', description: 'Optional — many testimonials are anonymous.' },
        },
      ],
    },
    {
      name: 'org',
      type: 'text',
      label: 'Organisation',
      admin: { description: 'Optional organisation name.' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Falls back to a placeholder avatar on the frontend.' },
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
