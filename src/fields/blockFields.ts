import type { Field } from 'payload'

import { iconOptions } from '@/components/Icon'

// Shared admin field helpers so blocks stay consistent and DRY. Everything a
// block renders is editable through these fields.

export const backgroundField: Field = {
  name: 'background',
  type: 'select',
  defaultValue: 'white',
  options: [
    { label: 'White', value: 'white' },
    { label: 'Light grey', value: 'muted' },
    { label: 'Light blue accent', value: 'accent' },
    { label: 'Primary (dark blue)', value: 'primary' },
  ],
  admin: { description: 'Section background colour.' },
}

export const alignField: Field = {
  name: 'align',
  type: 'select',
  defaultValue: 'left',
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Centered', value: 'center' },
  ],
}

// Scroll-reveal animation applied to the section as it enters the viewport.
export const motionField: Field = {
  name: 'motion',
  type: 'select',
  defaultValue: 'none',
  admin: { description: 'Animate the section in as it scrolls into view.' },
  options: [
    { label: 'None', value: 'none' },
    { label: 'Fade up', value: 'fade-up' },
    { label: 'Fade in', value: 'fade-in' },
    { label: 'Zoom in', value: 'zoom-in' },
  ],
}

// Hover treatment applied to cards/items within a block.
export const hoverEffectField: Field = {
  name: 'hoverEffect',
  type: 'select',
  defaultValue: 'lift',
  admin: { description: 'Hover effect for cards/items in this block.' },
  options: [
    { label: 'None', value: 'none' },
    { label: 'Lift', value: 'lift' },
    { label: 'Glow', value: 'glow' },
    { label: 'Zoom', value: 'zoom' },
    { label: 'Accent bar', value: 'accent-bar' },
  ],
}

export const containerWidthField: Field = {
  name: 'containerWidth',
  type: 'select',
  defaultValue: 'normal',
  admin: { description: 'Content width for this section.' },
  options: [
    { label: 'Normal', value: 'normal' },
    { label: 'Narrow', value: 'narrow' },
    { label: 'Wide', value: 'wide' },
    { label: 'Full width', value: 'full' },
  ],
}

// Display option bundles appended to block configs to keep them DRY.
export const displayFields: Field[] = [containerWidthField, motionField]
export const gridDisplayFields: Field[] = [containerWidthField, motionField, hoverEffectField]

// Eyebrow + heading + subheading, used by most blocks via a SectionHeader.
export const sectionHeaderFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    admin: { description: 'Small uppercase label above the heading (optional).' },
  },
  { name: 'heading', type: 'text' },
  { name: 'subheading', type: 'textarea' },
]

export const iconField = (overrides: Partial<Field> = {}): Field =>
  ({
    name: 'icon',
    type: 'select',
    options: iconOptions,
    admin: { description: 'Icon shown with this item.' },
    ...overrides,
  }) as Field

// Strict preset picker — applies class names defined in the Custom Styles global.
// Editors choose from defined presets only (no free text); stored as a string[].
// Define presets once in Globals → Custom Styles, then apply them anywhere.
export const presetClassField = (overrides: Partial<Field> = {}): Field =>
  ({
    name: 'cssClass',
    type: 'text',
    hasMany: true,
    label: 'Custom CSS class(es)',
    admin: {
      description: 'Pick styles defined in Globals → Custom Styles.',
      components: { Field: '@/fields/CssClassSelect#CssClassSelect' },
    },
    ...overrides,
  }) as Field

export const cssClassField: Field = presetClassField()

// Per-element style slots: apply presets to specific parts of a block.
export const elementClassesField: Field = {
  name: 'elementClasses',
  type: 'group',
  label: 'Element styles',
  admin: { description: 'Apply preset classes to specific parts of this block.' },
  fields: [
    presetClassField({ name: 'heading', label: 'Heading' }),
    presetClassField({ name: 'card', label: 'Cards / items' }),
    presetClassField({ name: 'button', label: 'Buttons' }),
  ],
}
