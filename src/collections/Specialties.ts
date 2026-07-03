import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'

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
    iconField({ admin: { description: 'Icon shown for this specialty in directories/grids.' } }),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'specialty-categories',
      admin: {
        description: 'Filter group on the Specialty List page (Surgery / Psychiatry / …).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'keyAreas',
      type: 'array',
      label: 'Key areas',
      labels: { singular: 'Key area', plural: 'Key areas' },
      admin: { description: 'Short tags shown under the specialty (e.g. Hip & knee, Trauma).' },
      fields: [{ name: 'area', type: 'text', required: true }],
    },
    slugField({
      position: undefined,
    }),
  ],
}
