import type { Block } from 'payload'

import { link } from '@/fields/link'
import {
  backgroundField,
  cssClassField,
  elementClassesField,
  gridDisplayFields,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

const sourceIs =
  (value: string) =>
  (_: unknown, siblingData: { source?: string } = {}) =>
    (siblingData?.source ?? 'auto') === value

export const SpecialtyGrid: Block = {
  slug: 'specialtyGrid',
  interfaceName: 'SpecialtyGridBlock',
  labels: { singular: 'Specialty Grid', plural: 'Specialty Grids' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto — list the Specialties taxonomy', value: 'auto' },
        { label: 'Hand-picked', value: 'manual' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    // Auto mode
    iconField({
      name: 'defaultIcon',
      label: 'Default icon',
      defaultValue: 'stethoscope',
      admin: { condition: sourceIs('auto'), description: 'Icon used for every specialty.' },
    }),
    {
      name: 'linkToDirectory',
      type: 'checkbox',
      label: 'Link each specialty to the directory',
      admin: { condition: sourceIs('auto') },
    },
    {
      name: 'directoryPath',
      type: 'text',
      defaultValue: '/specialists',
      admin: {
        condition: (_, d) => sourceIs('auto')(_, d) && Boolean((d as { linkToDirectory?: boolean })?.linkToDirectory),
        description: 'Links become <path>?specialty=<slug>.',
      },
    },
    // Manual mode
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Specialty', plural: 'Specialties' },
      admin: { condition: sourceIs('manual') },
      fields: [iconField(), { name: 'label', type: 'text', required: true }, link({ appearances: false })],
    },
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
