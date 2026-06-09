import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateDelete, revalidateEvent } from './hooks/revalidateEvent'
import { slugField } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// Events & seminars. Upcoming vs past is derived from `date` at query time
// (not stored), so events roll over automatically.
export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    eventType: true,
    date: true,
    timeLabel: true,
    location: true,
    host: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'date', 'host'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'date',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description: 'Start date & time. Drives the upcoming/past split.',
                  },
                },
                {
                  name: 'timeLabel',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. "12:30 pm – 1:30 pm".' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'location', type: 'text', admin: { width: '50%' } },
                {
                  name: 'host',
                  type: 'select',
                  defaultValue: 'aamle',
                  admin: { width: '50%' },
                  options: [
                    { label: 'AAMLE', value: 'aamle' },
                    { label: 'VERIFY', value: 'verify' },
                  ],
                },
              ],
            },
            {
              name: 'registrationUrl',
              type: 'text',
              label: 'Registration URL',
              admin: { description: 'External booking link (e.g. AAMLE).' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              admin: { description: 'Short summary used in listings.' },
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'recap',
              type: 'richText',
              label: 'Recap (past events)',
              admin: { description: 'Optional write-up shown after the event has passed.' },
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
      name: 'eventType',
      type: 'select',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Networking Event', value: 'networking' },
        { label: 'Client Training', value: 'client-training' },
        { label: 'Industry Briefing', value: 'industry-briefing' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Breakfast Seminar', value: 'breakfast-seminar' },
        { label: 'Masterclass', value: 'masterclass' },
        { label: 'Specialist Seminar', value: 'specialist-seminar' },
      ],
    },
    {
      name: 'presenters',
      type: 'relationship',
      relationTo: ['specialists', 'team'],
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Optional — link to specialist or team presenters.',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateEvent],
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
