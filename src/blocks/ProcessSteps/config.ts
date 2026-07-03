import type { Block } from 'payload'

import {
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
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      admin: { description: 'How many steps per row on desktop.' },
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
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
