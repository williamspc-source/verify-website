import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import {
  cssClassField,
  displayFields,
  sectionHeaderFields,
} from '@/fields/blockFields'

// Embeds a map (or any iframe embed, incl. a YouTube video) with optional action
// buttons — the "Where to Find Us" module on Contact / For-Claimants, and the
// prep-video on For-Claimants. Can reference an Office record or take a raw URL.
export const MapEmbed: Block = {
  slug: 'mapEmbed',
  interfaceName: 'MapEmbedBlock',
  labels: { singular: 'Map / Embed', plural: 'Maps / Embeds' },
  fields: [
    ...sectionHeaderFields,
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'map',
      options: [
        { label: 'Map', value: 'map' },
        { label: 'Video / iframe embed', value: 'embed' },
      ],
    },
    {
      name: 'office',
      type: 'relationship',
      relationTo: 'offices',
      admin: {
        condition: (_, s) => s?.kind === 'map',
        description: 'Optional — pull the address + office info panel from an Office record.',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      label: 'Embed URL',
      admin: {
        description: 'Map embed src, or a YouTube/Vimeo URL. Overrides the office map if set.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'aspect',
          type: 'select',
          defaultValue: '16-9',
          admin: { width: '50%' },
          options: [
            { label: '16:9', value: '16-9' },
            { label: '4:3', value: '4-3' },
            { label: 'Square', value: '1-1' },
            { label: 'Tall (map)', value: 'map' },
          ],
        },
        { name: 'title', type: 'text', admin: { width: '50%', description: 'Accessible title.' } },
      ],
    },
    {
      name: 'showOfficeInfo',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show office info panel (address/hours/transport/parking)',
      admin: { condition: (_, s) => s?.kind === 'map' },
    },
    linkGroup({
      overrides: {
        name: 'actions',
        label: 'Action buttons',
        maxRows: 3,
        admin: { description: 'e.g. Get directions / Call / Email.' },
      },
    }),
    cssClassField,
    ...displayFields,
  ],
}
