import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

const colorField = (name: string, label: string, example: string) => ({
  name,
  type: 'text' as const,
  label,
  admin: {
    width: '50%',
    description: `Hex, e.g. ${example}. Leave empty to use the built-in default.`,
  },
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'VERIFY Medico-Legal Solutions',
    },
    {
      type: 'collapsible',
      label: 'Brand assets',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Main logo shown in the header (and footer if no footer logo is set).' },
        },
        {
          name: 'logoFooter',
          label: 'Footer logo (optional)',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional override for the footer; falls back to the main logo.' },
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Browser tab / app icon. Use a square PNG or SVG.' },
        },
        {
          name: 'socialImage',
          label: 'Social / OG image (optional)',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Default preview image when pages are shared. Ideally 1200×630.' },
        },
      ],
    },
    {
      name: 'colors',
      label: 'Brand colours',
      type: 'group',
      admin: {
        description: 'Overrides the site colour palette at runtime. Empty fields use the built-in defaults.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            colorField('primary', 'Primary', '#1c75bc'),
            colorField('primaryStrong', 'Primary (hover/active)', '#155fa0'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('text', 'Body text', '#414042'),
            colorField('mutedText', 'Muted text', '#737373'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('accent', 'Light accent / hover background', '#cbe5fa'),
            colorField('border', 'Borders', '#c6c6c6'),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
