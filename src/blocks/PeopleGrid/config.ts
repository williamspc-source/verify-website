import type { Block } from 'payload'

import {
  backgroundField,
  cssClassField,
  elementClassesField,
  gridDisplayFields,
  sectionHeaderFields,
} from '@/fields/blockFields'

const sourceIs =
  (value: string) =>
  (_: unknown, siblingData: { source?: string } = {}) =>
    (siblingData?.source ?? 'specialists') === value

export const PeopleGrid: Block = {
  slug: 'peopleGrid',
  interfaceName: 'PeopleGridBlock',
  labels: { singular: 'People Grid', plural: 'People Grids' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'specialists',
      options: [
        { label: 'Specialists', value: 'specialists' },
        { label: 'Team', value: 'team' },
        { label: 'Hand-picked', value: 'manual' },
      ],
    },
    // Specialist filters
    {
      type: 'row',
      admin: { condition: sourceIs('specialists') },
      fields: [
        {
          name: 'onlyAdvertised',
          type: 'checkbox',
          label: 'Only advertised specialists',
          admin: { width: '50%' },
        },
        {
          name: 'featuredOnly',
          type: 'checkbox',
          label: 'Only featured specialists',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'specialty',
      type: 'relationship',
      relationTo: 'specialties',
      admin: {
        condition: sourceIs('specialists'),
        description: 'Optional — limit to one specialty.',
      },
    },
    // Team filter
    {
      name: 'department',
      type: 'select',
      admin: { condition: sourceIs('team'), description: 'Optional — limit to one department.' },
      options: [
        { label: 'Operations', value: 'operations' },
        { label: 'Business Development', value: 'business-development' },
        { label: 'Reception & Bookings', value: 'reception-bookings' },
        { label: 'Quality Assurance', value: 'quality-assurance' },
      ],
    },
    // Manual selection
    {
      name: 'people',
      type: 'relationship',
      relationTo: ['specialists', 'team'],
      hasMany: true,
      admin: { condition: sourceIs('manual') },
    },
    // Display
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'grid',
          admin: { width: '33%' },
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'Carousel', value: 'carousel' },
          ],
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '4',
          admin: { width: '33%' },
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 8,
          admin: { width: '33%', description: 'Max people to show (collection sources).' },
        },
      ],
    },
    {
      name: 'linkProfiles',
      type: 'checkbox',
      label: 'Link cards to profile pages',
      admin: { description: 'Enable once individual profile pages exist.' },
    },
    {
      name: 'carouselOptions',
      type: 'group',
      label: 'Carousel options',
      admin: {
        description:
          'Infinite auto-scrolling marquee (pauses on hover). Arrows flip the scroll direction.',
        condition: (_, siblingData) => (siblingData as { layout?: string })?.layout === 'carousel',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'speed',
              type: 'number',
              defaultValue: 30,
              label: 'Loop duration (seconds)',
              admin: { width: '50%', description: 'Lower = faster scroll.' },
            },
            {
              name: 'direction',
              type: 'select',
              defaultValue: 'left',
              label: 'Start direction',
              admin: { width: '50%' },
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        { name: 'showArrows', type: 'checkbox', defaultValue: true, label: 'Show direction arrows' },
      ],
    },
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
