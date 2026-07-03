import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

// Full office records that drive the "Where to Find Us" module on the Contact and
// For-Claimants pages (address, hours, transport, parking, embedded map). Distinct
// from the lean `Locations` taxonomy (which only filters the specialist directory).
export const Offices: CollectionConfig = {
  slug: 'offices',
  labels: { singular: 'Office', plural: 'Offices' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'order', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Brisbane (Head Office)".' },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: { description: 'Full postal address (line breaks preserved).' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: { width: '50%', description: 'Display phone, e.g. "07 3356 0469".' },
        },
        {
          name: 'email',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'Google Map embed URL',
      admin: {
        description: 'The src URL from a Google Maps "Embed a map" iframe. Leave empty to derive from the address.',
      },
    },
    {
      name: 'hours',
      type: 'array',
      label: 'Opening hours',
      labels: { singular: 'Hours row', plural: 'Hours rows' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'days', type: 'text', admin: { width: '50%', placeholder: 'Monday – Friday' } },
            { name: 'time', type: 'text', admin: { width: '50%', placeholder: '08:30 – 17:00' } },
          ],
        },
      ],
    },
    {
      name: 'hoursNote',
      type: 'text',
      admin: { description: 'Optional caveat, e.g. the 7:30am staffing note.' },
    },
    {
      name: 'transport',
      type: 'array',
      label: 'Public transport',
      labels: { singular: 'Transport item', plural: 'Transport items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'note', type: 'text' },
        { name: 'href', type: 'text', label: 'Optional link' },
      ],
    },
    {
      name: 'parking',
      type: 'array',
      label: 'Parking',
      labels: { singular: 'Car park', plural: 'Car parks' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'walkTime', type: 'text', admin: { width: '50%', placeholder: '3 min walk' } },
            { name: 'heightLimit', type: 'text', admin: { width: '50%', placeholder: '2.0 m' } },
          ],
        },
        { name: 'href', type: 'text', label: 'Optional link' },
        { name: 'note', type: 'text' },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'Any additional guidance shown in the location module.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    slugField({
      position: undefined,
    }),
  ],
}
