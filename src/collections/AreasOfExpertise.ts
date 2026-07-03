import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

// Clinical conditions / body-regions a specialist covers (Spine, Knee, PTSD, …).
// Admin-editable taxonomy.
export const AreasOfExpertise: CollectionConfig = {
  slug: 'areas-of-expertise',
  labels: { singular: 'Area of Expertise', plural: 'Areas of Expertise' },
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
    {
      name: 'description',
      type: 'textarea',
    },
    slugField({
      position: undefined,
    }),
  ],
}
