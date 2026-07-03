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
    (siblingData?.source ?? 'auto') === value

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: { singular: 'Services Grid', plural: 'Services Grids' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto — list the Services collection', value: 'auto' },
        { label: 'Hand-picked', value: 'manual' },
      ],
    },
    {
      type: 'row',
      admin: { condition: sourceIs('auto') },
      fields: [
        {
          name: 'category',
          type: 'select',
          admin: { width: '50%', description: 'Optional — limit to one category.' },
          options: [
            { label: 'Medico-Legal', value: 'medico-legal' },
            { label: 'Administrative', value: 'administrative' },
            { label: 'Educational', value: 'educational' },
          ],
        },
        {
          name: 'serviceGroup',
          type: 'select',
          admin: { width: '50%', description: 'Optional — finer group (examinations vs reporting).' },
          options: [
            { label: 'Examination', value: 'examination' },
            { label: 'Reporting', value: 'reporting' },
            { label: 'Administrative', value: 'administrative' },
            { label: 'Education', value: 'education' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      admin: { description: 'Card grid, or an expandable accordion (with per-service image + body).' },
      options: [
        { label: 'Card grid', value: 'grid' },
        { label: 'Accordion', value: 'accordion' },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { condition: sourceIs('manual') },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          admin: { width: '50%' },
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 12,
          admin: { width: '50%', description: 'Max services to show (auto source).' },
        },
      ],
    },
    {
      name: 'linkToService',
      type: 'checkbox',
      label: 'Link each card to its service page',
      admin: { description: 'Enable once service pages exist.' },
    },
    {
      name: 'servicePathPrefix',
      type: 'text',
      defaultValue: '/services',
      admin: {
        condition: (_, d) => Boolean((d as { linkToService?: boolean })?.linkToService),
        description: 'Links become <prefix>/<slug>.',
      },
    },
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
