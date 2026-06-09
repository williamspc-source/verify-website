import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

// Service / report kinds (IME, JME, File Review, Teleconference, …).
// Admin-editable taxonomy.
export const AssessmentTypes: CollectionConfig = {
  slug: 'assessment-types',
  labels: { singular: 'Assessment Type', plural: 'Assessment Types' },
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
