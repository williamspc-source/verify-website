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
        { label: '2 per row', value: '2' },
        { label: '3 per row', value: '3' },
        { label: '4 per row', value: '4' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: { description: 'Steps are auto-numbered in order (01, 02, …).' },
      fields: [
        iconField(),
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
