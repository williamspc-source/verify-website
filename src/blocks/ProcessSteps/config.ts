import type { Block } from 'payload'

import {
  anchorIdField,
  backgroundField,
  cssClassField,
  elementClassesField,
  gridDisplayFields,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

export const ProcessSteps: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  labels: { singular: 'Process Steps', plural: 'Process Steps' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'cards',
      admin: {
        description:
          'Layout. "Cards" = numbered card grid. "Two-row process" = connected numbered rows (01–03 blue, 04+ dark) matching the reference Our Process. "Claimant step list" = left intro + a compact numbered list on the right (reference Your Examination Step by Step).',
      },
      options: [
        { label: 'Cards (numbered grid)', value: 'cards' },
        { label: 'Two-row process (connected)', value: 'two-row' },
        { label: 'Claimant step list', value: 'claimant' },
        { label: 'AAMLE education feature panels', value: 'edu-panels' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      admin: {
        description: 'How many steps per row on desktop (Cards + Two-row variants).',
      },
      options: [
        { label: '1 (vertical list)', value: '1' },
        { label: '2 per row', value: '2' },
        { label: '3 per row', value: '3' },
        { label: '4 per row', value: '4' },
        { label: '5 per row', value: '5' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: { description: 'Steps are auto-numbered in order (01, 02, …).' },
      fields: [
        {
          type: 'row',
          fields: [
            iconField({ admin: { width: '50%' } }),
            {
              name: 'badge',
              type: 'text',
              admin: { width: '50%', description: 'Optional pill label, e.g. "Free to Join".' },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Optional — leave empty for a number-only step.' },
        },
        { name: 'description', type: 'textarea' },
        {
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullet', plural: 'Bullets' },
          admin: { description: 'Optional bulleted list under the description.' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    anchorIdField,
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
