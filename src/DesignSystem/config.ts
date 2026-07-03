import type { GlobalConfig } from 'payload'

import { revalidateDesignSystem } from './hooks/revalidateDesignSystem'

// One editable value behind a named preset. Stored as text so authors can enter
// any CSS length (px, rem, clamp(...)). Empty falls back to the built-in default
// defined in globals.css (:root).
const tokenField = (name: string, label: string, fallback: string) => ({
  name,
  type: 'text' as const,
  label,
  admin: {
    width: '50%',
    placeholder: fallback,
    description: `Default: ${fallback}. Any CSS length (px, rem, clamp…). Empty = default.`,
  },
})

// The values BEHIND the presets used by Section/Row/atom blocks. Each maps to a
// CSS custom property applied to <html> at runtime (see designTokenStyle), so a
// change here re-themes every block that uses that preset — site-wide.
export const DesignSystem: GlobalConfig = {
  slug: 'design-system',
  label: 'Design System',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Design',
    description:
      'Edit what each spacing/size preset means. Changes apply across the whole site instantly. These set the values; pick a preset per block in the page editor.',
  },
  fields: [
    {
      name: 'typography',
      type: 'group',
      label: 'Typography',
      admin: {
        description:
          'Font families used site-wide. Empty = the licensed brand font (MuseoSansRounded). To use a different font, first load it via Globals → Custom Styles → Global CSS (@font-face), then enter its family name here.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            tokenField('headingFont', 'Heading font', 'MuseoSansRounded, sans-serif'),
            tokenField('bodyFont', 'Body font', 'MuseoSansRounded, sans-serif'),
          ],
        },
        tokenField('baseSize', 'Base body size', '1rem'),
      ],
    },
    {
      name: 'spacing',
      type: 'group',
      label: 'Section spacing',
      admin: { description: 'Vertical padding presets for sections (also drives Spacer atoms).' },
      fields: [
        {
          type: 'row',
          fields: [
            tokenField('compact', 'Compact', 'clamp(2rem, 4vw, 3rem)'),
            tokenField('normal', 'Normal', 'clamp(3.5rem, 8vw, 5.5rem)'),
          ],
        },
        {
          type: 'row',
          fields: [
            tokenField('spacious', 'Spacious', 'clamp(5rem, 10vw, 7.5rem)'),
            tokenField('xl', 'Extra large', 'clamp(7rem, 12vw, 10rem)'),
          ],
        },
      ],
    },
    {
      name: 'gaps',
      type: 'group',
      label: 'Column gaps',
      admin: { description: 'Space between columns in a Row.' },
      fields: [
        {
          type: 'row',
          fields: [tokenField('tight', 'Tight', '1rem'), tokenField('normal', 'Normal', '2rem')],
        },
        tokenField('wide', 'Wide', '3.5rem'),
      ],
    },
    {
      name: 'headings',
      type: 'group',
      label: 'Heading sizes',
      admin: { description: 'Visual sizes for the Heading atom (independent of level).' },
      fields: [
        {
          type: 'row',
          fields: [
            tokenField('sm', 'Small', 'clamp(1.1rem, 2vw, 1.25rem)'),
            tokenField('md', 'Medium', 'clamp(1.35rem, 2.5vw, 1.6rem)'),
          ],
        },
        {
          type: 'row',
          fields: [
            tokenField('lg', 'Large', 'clamp(1.75rem, 3.5vw, 2.4rem)'),
            tokenField('xl', 'Extra large', 'clamp(2.25rem, 5vw, 3.25rem)'),
          ],
        },
        tokenField('display', 'Display', 'clamp(2.75rem, 7vw, 4.5rem)'),
      ],
    },
    {
      name: 'text',
      type: 'group',
      label: 'Body text sizes',
      admin: { description: 'Sizes for the Text atom.' },
      fields: [
        {
          type: 'row',
          fields: [
            tokenField('sm', 'Small', '0.9rem'),
            tokenField('base', 'Base', '1rem'),
          ],
        },
        tokenField('lg', 'Large', '1.2rem'),
      ],
    },
    {
      name: 'radius',
      type: 'group',
      label: 'Corner rounding',
      admin: { description: 'Rounding presets for the Image atom.' },
      fields: [
        {
          type: 'row',
          fields: [tokenField('sm', 'Small', '8px'), tokenField('md', 'Medium', '16px')],
        },
      ],
    },
    {
      name: 'bands',
      type: 'group',
      label: 'Section bands',
      admin: { description: 'Background colour/gradient for each section banding option.' },
      fields: [
        tokenField('muted', 'Muted (grey)', '#f5f6f8'),
        tokenField('accent', 'Accent (light blue)', 'linear-gradient(135deg, #eef9ff, #e6f4ff, #d9efff)'),
        tokenField('primary', 'Primary (dark blue)', 'linear-gradient(135deg, #0d4f85, #1c75bc)'),
        tokenField('dark', 'Dark (charcoal)', '#414042'),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateDesignSystem],
  },
}
