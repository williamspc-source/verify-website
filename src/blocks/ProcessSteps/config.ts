import type { Block } from 'payload'

import {
  anchorIdField,
  backgroundField,
  cssClassField,
  elementClassesField,
  gridDisplayFields,
  iconField,
  richBodyField,
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
      // The reference uses BOTH styles: plain digits on jme.html and
      // admin-services.html, zero-padded on for-clients.html and
      // for-claimants.html. So it is a per-instance choice, not a global one.
      name: 'numberStyle',
      type: 'select',
      defaultValue: 'padded',
      label: 'Step number style',
      options: [
        { label: 'Padded — 01, 02, 03', value: 'padded' },
        { label: 'Plain — 1, 2, 3', value: 'plain' },
      ],
    },
    // The shared `subheading` above is plain text, and it is one field on a helper
    // used by 26 blocks — widening it to rich text would touch 58 columns. Only
    // this variant's intro needs emphasis (the reference bolds "Australian Academy
    // of Medico-Legal Education (AAMLE)"), so the rich version is scoped to it and
    // falls back to `subheading` when left empty.
    richBodyField('introRich', {
      label: 'Intro copy (rich text)',
      admin: {
        condition: (_, sibling) => sibling?.variant === 'edu-panels',
        description:
          'Replaces the plain Subheading for this variant, adding bold and italic. Leave empty to keep using Subheading.',
      },
    }),
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
          name: 'badgeStyle',
          type: 'select',
          defaultValue: 'plain',
          label: 'Badge emphasis',
          admin: {
            condition: (_, sibling: { badge?: string | null } = {}) => Boolean(sibling?.badge),
            description: 'Highlight brightens the pill so one step stands out from the others.',
          },
          options: [
            { label: 'Plain', value: 'plain' },
            { label: 'Highlight', value: 'accent' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Optional — leave empty for a number-only step.' },
        },
        richBodyField('description', {
          admin: {
            description:
              'Body copy for the step. Bold and italic are available — the reference AAMLE panel bolds an organisation name and italicises a publication title.',
          },
        }),
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
