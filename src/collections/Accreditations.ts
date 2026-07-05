import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'
import { revalidateSiteOnChange, revalidateSiteOnDelete } from '@/utilities/revalidateSite'

// Specialist accreditations / impairment-rating credentials (AMA 5, GEPI 2,
// CIME (ABIME), PIRS, …). A controlled taxonomy so the Specialist Panel filter
// and the per-profile accreditation chips stay consistent and admin-managed.
export const Accreditations: CollectionConfig = {
  slug: 'accreditations',
  labels: { singular: 'Accreditation', plural: 'Accreditations' },
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
      admin: { description: 'e.g. "AMA 5", "GEPI 2", "CIME (ABIME)", "PIRS".' },
    },
    iconField({ admin: { description: 'Icon shown with the accreditation chip (e.g. seal-check).' } }),
    {
      name: 'description',
      type: 'textarea',
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
