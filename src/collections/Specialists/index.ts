import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateSpecialist } from './hooks/revalidateSpecialist'
import { slugField } from 'payload'
import { iconField } from '@/fields/blockFields'

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
              type: 'relationship',
              relationTo: 'locations',
              hasMany: true,
              admin: {
                description:
                  'Cities / regions where this specialist consults. Drives the directory location filter.',
              },
            },
            {
              name: 'qualifications',
              type: 'array',
              fields: [
                { name: 'qualification', type: 'text', required: true },
                iconField({
                  admin: { description: 'Optional icon (e.g. graduation-cap, certificate).' },
                }),
              ],
            },
            {
              name: 'accreditations',
              type: 'relationship',
              relationTo: 'accreditations',
              hasMany: true,
              admin: {
                description:
                  'Impairment-rating credentials — drives the Specialist Panel accreditation filter and the profile chips.',
              },
            },
            {
              name: 'languages',
              type: 'array',
              admin: { description: 'Languages spoken (e.g. English).' },
              fields: [{ name: 'language', type: 'text', required: true }],
            },
            {
              name: 'bookingUrl',
              type: 'text',
              label: 'Booking link',
              admin: { description: 'Optional direct booking / enquiry URL.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cv',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'CV (PDF)',
                  admin: { width: '50%', description: 'Optional downloadable CV.' },
                },
                {
                  name: 'sampleReport',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Sample report (PDF)',
                  admin: { width: '50%', description: 'Optional redacted sample report.' },
                },
              ],
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
    // ── Specialist Availability ──
    // `advertise` features the specialist in the carousel on the Specialist
    // Availability page. The session list below the carousel is driven entirely
    // by the Availability Sessions collection — a specialist only appears in the
    // list when they have available sessions (no "call to book" rows).
    {
      name: 'advertise',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature in availability carousel',
      admin: {
        position: 'sidebar',
        description:
          'Show this specialist in the featured carousel on the Specialist Availability page. Their session list is driven separately by their Availability Sessions.',
      },
    },
    // Deprecated — superseded by the model above. Hidden (column retained; drop
    // via a migration later). Carousel = `advertise`; list = availability sessions.
    {
      name: 'availabilityHighlight',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'availabilityNote',
      type: 'text',
      defaultValue: 'Call to book',
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional given name used for sorting the directory by first name.',
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
