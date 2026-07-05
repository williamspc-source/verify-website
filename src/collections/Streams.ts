import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'
import { revalidateSiteOnChange, revalidateSiteOnDelete } from '@/utilities/revalidateSite'

// "In the Loop" content streams (Featured, News & Updates, Industry Insights,
// Specialist Spotlights, QA Insights, Staff Narratives, Resources). A Post's
// `stream` places it in a hub section and drives its /in-the-loop/{stream}/{slug}
// URL folder + breadcrumb. Distinct from `categories`, which are topic chips.
export const Streams: CollectionConfig = {
  slug: 'streams',
  labels: { singular: 'Stream', plural: 'Streams' },
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
      admin: { description: 'e.g. "QA Insights", "News & Updates", "Specialist Spotlights".' },
    },
    iconField({ admin: { description: 'Icon shown on the stream tab / category chip.' } }),
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first in the hub section nav.' },
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    afterChange: [revalidateSiteOnChange],
    afterDelete: [revalidateSiteOnDelete],
  },
}
