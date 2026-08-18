import type { Block } from 'payload'

import {
  backgroundField,
  cssClassField,
  elementClassesField,
  gridDisplayFields,
  iconField,
  sectionHeaderFields,
} from '@/fields/blockFields'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Feature Grid', plural: 'Feature Grids' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '1 (vertical list)', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cardStyle',
      type: 'select',
      defaultValue: 'card',
      options: [
        { label: 'Card (bordered)', value: 'card' },
        { label: 'Plain (no border)', value: 'plain' },
        { label: 'Banded (tinted header)', value: 'banded' },
        { label: 'Soft (flat white, gentle hover)', value: 'soft' },
      ],
      admin: {
        description:
          '“Banded” puts the icon and title on a tinted panel across the top of each card, with the description and details below it. “Soft” is the quieter treatment used for the support cards on Information for Clients — flat white, a softer shadow, and a gentle lift on hover instead of the bolder shift.',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [
        iconField(),
        { name: 'title', type: 'text', required: true },
        {
          name: 'titleSuffix',
          type: 'text',
          admin: { description: 'Optional second-line / type label under the title (e.g. "In-Person").' },
        },
        { name: 'description', type: 'textarea' },
        {
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullet', plural: 'Bullets' },
          admin: { description: 'Optional simple bulleted list.' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          name: 'detailsLabel',
          type: 'text',
          admin: { description: 'Optional label above a nested detail list (e.g. "What\'s Included").' },
        },
        {
          name: 'details',
          type: 'array',
          label: 'Detail items',
          labels: { singular: 'Detail', plural: 'Details' },
          admin: { description: 'Nested icon + title + description sub-items (e.g. Assessment Format cards).' },
          fields: [
            iconField(),
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    cssClassField,
    elementClassesField,
    ...gridDisplayFields,
  ],
}
