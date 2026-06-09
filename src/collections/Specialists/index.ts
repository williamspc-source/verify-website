import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateSpecialist } from './hooks/revalidateSpecialist'
import { slugField } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// External doctor profiles. SEPARATE from internal Team. References the four
// admin-editable taxonomies (specialty / claim-types / assessment-types /
// areas-of-expertise) so the directory can filter by them.
export const Specialists: CollectionConfig<'specialists'> = {
  slug: 'specialists',
  labels: { singular: 'Specialist', plural: 'Specialists' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    position: true,
    specialty: true,
    photo: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'position', 'specialty', 'updatedAt'],
    group: 'People',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Full name',
      required: true,
      admin: { description: 'Full display name including honorific, e.g. "Dr Adam Parr".' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'position',
              type: 'text',
              label: 'Position / title line',
              admin: { description: 'e.g. "Consultant Spinal Surgeon".' },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Falls back to an initials avatar on the frontend.' },
            },
            {
              name: 'bio',
              type: 'richText',
            },
            {
              name: 'locations',
              type: 'array',
              admin: { description: 'Cities / regions where this specialist consults.' },
              fields: [{ name: 'location', type: 'text', required: true }],
            },
            {
              name: 'qualifications',
              type: 'array',
              fields: [{ name: 'qualification', type: 'text', required: true }],
            },
            {
              name: 'accreditations',
              type: 'array',
              fields: [{ name: 'accreditation', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    // ── Sidebar: classification + flags ──
    {
      name: 'specialty',
      type: 'relationship',
      relationTo: 'specialties',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'claimTypes',
      type: 'relationship',
      relationTo: 'claim-types',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'assessmentTypes',
      type: 'relationship',
      relationTo: 'assessment-types',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'areasOfExpertise',
      type: 'relationship',
      relationTo: 'areas-of-expertise',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in featured listings (e.g. the homepage).',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional surname used for sorting the directory.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateSpecialist],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
