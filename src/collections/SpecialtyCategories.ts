import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'

// Groups of specialties (Surgery, Psychiatry & Psychology, Medicine, Allied
// Health) used to build the Specialty List filter bar + accordion grouping.
// Each Specialty references one of these via its `category` field.
export const SpecialtyCategories: CollectionConfig = {
  slug: 'specialty-categories',
  labels: { singular: 'Specialty Category', plural: 'Specialty Categories' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Taxonomy',
    defaultColumns: ['title', 'order', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Surgery", "Psychiatry & Psychology", "Medicine", "Allied Health".' },
    },
    iconField({ admin: { description: 'Icon shown on the filter button for this group.' } }),
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first in the filter bar / accordion.' },
    },
    slugField({
      position: undefined,
    }),
  ],
}
