import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
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
    iconField({ admin: { description: 'Icon shown on the category/topic chip.' } }),
    {
      name: 'color',
      type: 'text',
      admin: { description: 'Optional hex for the category chip, e.g. #1c75bc.' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    slugField({
      position: undefined,
    }),
  ],
}
