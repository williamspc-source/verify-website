import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

// Canonical medical disciplines — one per specialist. Admin-editable taxonomy.
export const Specialties: CollectionConfig = {
  slug: 'specialties',
  labels: { singular: 'Specialty', plural: 'Specialties' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Taxonomy',
    defaultColumns: ['title', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
