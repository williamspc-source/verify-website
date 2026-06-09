import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateTeam } from './hooks/revalidateTeam'
import { slugField } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// Internal VERIFY staff. SEPARATE from Specialists (external doctors).
export const Team: CollectionConfig<'team'> = {
  slug: 'team',
  labels: { singular: 'Team Member', plural: 'Team' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    role: true,
    department: true,
    photo: true,
    order: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'role', 'department', 'order'],
    group: 'People',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Full name',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'role',
              type: 'text',
              admin: { description: 'e.g. "IT Manager | Lawyer".' },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'bio',
              type: 'richText',
            },
            {
              name: 'qualifications',
              type: 'array',
              fields: [{ name: 'qualification', type: 'text', required: true }],
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
    {
      name: 'department',
      type: 'select',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Operations', value: 'operations' },
        { label: 'Business Development', value: 'business-development' },
        { label: 'Reception & Bookings', value: 'reception-bookings' },
        { label: 'Quality Assurance', value: 'quality-assurance' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Sort order within the department (lower shows first).',
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
    afterChange: [revalidateTeam],
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
