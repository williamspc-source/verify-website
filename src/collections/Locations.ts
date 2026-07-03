import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

// Where specialists consult (Brisbane CBD, Gold Coast, Telehealth / Videolink, …).
// A taxonomy so the specialist directory can FILTER by location. Admin-editable.
export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Location', plural: 'Locations' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Taxonomy',
    defaultColumns: ['title', 'region', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Brisbane CBD", "Gold Coast", "Telehealth / Videolink".' },
    },
    {
      name: 'region',
      type: 'text',
      admin: { description: 'Optional grouping (e.g. "South East Queensland").' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first in filters.' },
    },
    slugField({
      position: undefined,
    }),
  ],
}
