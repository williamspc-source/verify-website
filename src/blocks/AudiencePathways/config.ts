import type { Block } from 'payload'

import { link } from '@/fields/link'
import {
  anchorIdField,
  backgroundField,
  cssClassField,
  displayFields,
  sectionHeaderFields,
} from '@/fields/blockFields'

// Dual audience-pathway cards (design ref: services/medico-legal/ime.html →
// `.ime-pathways`). Two side-by-side cards, each a coloured header + a numbered
// step list + a CTA. One card styled dark-blue ("client"), the other light-blue
// ("claimant"); the per-card `variant` picks which treatment applies. Every label,
// step and link is editable.
export const AudiencePathways: Block = {
  slug: 'audiencePathways',
  interfaceName: 'AudiencePathwaysBlock',
  labels: { singular: 'Audience Pathways', plural: 'Audience Pathways' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      name: 'pathways',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      labels: { singular: 'Pathway', plural: 'Pathways' },
      admin: {
        description: 'Two audience pathway cards shown side by side.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'client',
          admin: {
            description:
              'Card treatment. "Client" = dark-blue header; "Claimant" = light-blue header.',
          },
          options: [
            { label: 'Client (dark blue)', value: 'client' },
            { label: 'Claimant (light blue)', value: 'claimant' },
          ],
        },
        {
          name: 'eyebrow',
          type: 'text',
          admin: { description: 'Small uppercase audience label, e.g. "For Clients".' },
        },
        { name: 'title', type: 'text', admin: { description: 'Card heading (h3).' } },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Short intro paragraph under the card heading.' },
        },
        {
          name: 'steps',
          type: 'array',
          minRows: 1,
          labels: { singular: 'Step', plural: 'Steps' },
          admin: { description: 'Numbered steps (numbers are added automatically).' },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'Bold step lead-in.' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: 'Step detail text.' },
            },
          ],
        },
        link({ appearances: false, overrides: { label: 'CTA link' } }),
      ],
    },
    anchorIdField,
    cssClassField,
    ...displayFields,
  ],
}
