import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'
import { revalidateSiteOnChange, revalidateSiteOnDelete } from '@/utilities/revalidateSite'

// Downloadable / link-out resources shown in the "In the Loop → Resources" grid
// and the Information Centre (checklists, guides, templates). Each card can point
// to an uploaded file (PDF) OR an external URL.
export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: 'Resource', plural: 'Resources' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'resourceType', 'audience', 'order'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    iconField({ admin: { description: 'Icon shown on the resource card.' } }),
    {
      type: 'row',
      fields: [
        {
          name: 'resourceType',
          type: 'select',
          defaultValue: 'guide',
          admin: { width: '50%' },
          options: [
            { label: 'Checklist', value: 'checklist' },
            { label: 'Guide', value: 'guide' },
            { label: 'Template', value: 'template' },
            { label: 'Fact sheet', value: 'fact-sheet' },
          ],
        },
        {
          name: 'audience',
          type: 'select',
          defaultValue: 'clients',
          admin: { width: '50%' },
          options: [
            { label: 'Clients (lawyers/insurers)', value: 'clients' },
            { label: 'Claimants', value: 'claimants' },
            { label: 'Everyone', value: 'all' },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Downloadable file (e.g. PDF). Leave empty to link out instead.' },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External URL',
      admin: {
        description: 'Used when no file is uploaded — links the card to this URL instead.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Button label',
      admin: { description: 'e.g. "Download", "Read guide". Defaults to "Download" if empty.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
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
