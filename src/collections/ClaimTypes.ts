import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

// Legal scheme / claim types a specialist assesses under (Workers' Comp, CTP, …).
// The primary referrer filter. Admin-editable taxonomy.
export const ClaimTypes: CollectionConfig = {
  slug: 'claim-types',
  labels: { singular: 'Claim Type', plural: 'Claim Types' },
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
