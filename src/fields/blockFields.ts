import type { Block, Field } from 'payload'

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
    // Flat fill rather than the `accent` gradient. Added so the home hero's band
    // could stop being a hardcoded inline colour; available everywhere since it
    // is a genuinely useful option, not a one-off.
    { label: 'Light blue (solid)', value: 'accent-solid' },
    { label: 'Primary (dark blue)', value: 'primary' },
    { label: 'Dark (charcoal)', value: 'dark' },
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

// Resting depth for cards/items → `.vf-shadow-<slug>` (globals.css tail).
// 'default' emits no class, so adding this to a block changes nothing until an
// editor opts in. The presets set the RESTING shadow only; hover treatment
// stays with hoverEffectField, so the two compose rather than fight.
export const shadowField: Field = {
  name: 'shadow',
  type: 'select',
  defaultValue: 'default',
  label: 'Card shadow',
  admin: {
    description:
      'Resting depth/glow for cards in this block. Edit what each preset looks like in Globals → Design System → Shadows & glows.',
  },
  options: [
    { label: "Default (component's own)", value: 'default' },
    { label: 'None (flat)', value: 'none' },
    { label: 'Extra small', value: 'xs' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra large', value: 'xl' },
    { label: 'Glow', value: 'glow' },
    { label: 'Glow (strong)', value: 'glow-strong' },
  ],
}

// Drop shadow for the Image atom → `.vf-image--shadow-<slug>`. A narrower scale
// than shadowField on purpose: the glow rungs are a card treatment and read as a
// halo behind a photo. Defaults to none, so existing images are untouched.
export const imageShadowField: Field = {
  name: 'shadow',
  type: 'select',
  defaultValue: 'none',
  label: 'Shadow',
  admin: {
    description: 'Drop shadow behind the image. Edit the values in Globals → Design System.',
  },
  options: [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra large', value: 'xl' },
  ],
}

// Display option bundles appended to block configs to keep them DRY.
export const displayFields: Field[] = [containerWidthField, motionField]
export const gridDisplayFields: Field[] = [
  containerWidthField,
  motionField,
  hoverEffectField,
  shadowField,
]

// Eyebrow + heading + subheading, used by most blocks via a SectionHeader.
export const sectionHeaderFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    admin: { description: 'Small uppercase label above the heading (optional).' },
  },
  {
    name: 'heading',
    type: 'text',
    admin: {
      description: 'Wrap a word/phrase in [[brackets]] to highlight it in the brand accent colour, e.g. "Meet Our [[Expert Panel]]".',
    },
  },
  { name: 'subheading', type: 'textarea' },
]

// Optional HTML id so a section/row/item can be targeted by in-page hash links
// and the header nav sub-menu (e.g. #file-review, #surrogate). Slug-validated so
// it produces a stable, valid anchor. Rendered as the element `id`.
export const anchorIdField: Field = {
  name: 'anchorId',
  type: 'text',
  label: 'Anchor ID',
  admin: {
    description:
      'Optional #id for in-page / nav links, e.g. "file-review" is targeted by a link to #file-review. Lowercase letters, numbers and hyphens only.',
  },
  validate: (val: string | null | undefined) =>
    !val ||
    /^[a-z][a-z0-9-]*$/.test(val) ||
    'Use lowercase letters, numbers and hyphens; must start with a letter.',
}

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

// ---------------------------------------------------------------------------
// Layout-primitive field helpers (Section / Row / atom blocks).
//
// All are fixed-named PRESET selects. Their slugs map to `.vf-*--<slug>` modifier
// classes in globals.css, and those classes resolve their actual values from CSS
// custom properties (e.g. `--space-spacious`, `--gap-wide`, `--size-heading-lg`).
// The VALUES are owner-editable site-wide via the Design System global, so a token
// change re-themes every block that uses it — without touching these field defs.
// ---------------------------------------------------------------------------

// Spacing preset → `var(--space-<slug>)`. Used for section padding top/bottom.
export const spacingField = (name: string, label: string, description?: string): Field =>
  ({
    name,
    type: 'select',
    label,
    defaultValue: 'normal',
    admin: description ? { description } : {},
    options: [
      { label: 'None', value: 'none' },
      { label: 'Compact', value: 'compact' },
      { label: 'Normal', value: 'normal' },
      { label: 'Spacious', value: 'spacious' },
      { label: 'Extra large', value: 'xl' },
    ],
  }) as Field

export const paddingTopField = spacingField('paddingTop', 'Padding top', 'Space above the content.')
export const paddingBottomField = spacingField(
  'paddingBottom',
  'Padding bottom',
  'Space below the content.',
)
// Bundle appended to Section configs (presented as one admin row).
export const spacingFields: Field[] = [
  { type: 'row', fields: [paddingTopField, paddingBottomField] },
]

// Gap between columns → `var(--gap-<slug>)`.
export const gapField: Field = {
  name: 'gap',
  type: 'select',
  defaultValue: 'normal',
  label: 'Gap',
  admin: { description: 'Space between columns.' },
  options: [
    { label: 'None', value: 'none' },
    { label: 'Tight', value: 'tight' },
    { label: 'Normal', value: 'normal' },
    { label: 'Wide', value: 'wide' },
  ],
}

// Vertical alignment of columns within a Row → `.vf-row--alignY-<slug>`.
export const alignYField: Field = {
  name: 'alignY',
  type: 'select',
  defaultValue: 'stretch',
  label: 'Vertical alignment',
  admin: { description: 'How columns line up vertically.' },
  options: [
    { label: 'Top', value: 'top' },
    { label: 'Center', value: 'center' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Stretch', value: 'stretch' },
  ],
}

// Per-column grid span → `.vf-col--span-<slug>`.
export const columnSpanField: Field = {
  name: 'span',
  type: 'select',
  defaultValue: 'auto',
  label: 'Column span',
  admin: { description: 'How many grid columns this column occupies (Auto = equal share).' },
  options: [
    { label: 'Auto (equal)', value: 'auto' },
    { label: 'Span 1', value: '1' },
    { label: 'Span 2', value: '2' },
    { label: 'Span 3', value: '3' },
    { label: 'Span 4', value: '4' },
  ],
}

// Text/content alignment for atoms → `.vf-align-<slug>`.
export const textAlignField: Field = {
  name: 'align',
  type: 'select',
  defaultValue: 'left',
  label: 'Alignment',
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
}

// Heading semantic level (HTML tag) — decoupled from visual size for a11y.
export const headingLevelField: Field = {
  name: 'level',
  type: 'select',
  defaultValue: 'h2',
  label: 'Heading level',
  admin: { description: 'HTML tag for SEO/accessibility. Visual size is set separately.' },
  options: [
    { label: 'H1', value: 'h1' },
    { label: 'H2', value: 'h2' },
    { label: 'H3', value: 'h3' },
    { label: 'H4', value: 'h4' },
  ],
}

// Heading visual size → `var(--size-heading-<slug>)`.
export const headingSizeField: Field = {
  name: 'size',
  type: 'select',
  defaultValue: 'lg',
  label: 'Heading size',
  admin: { description: 'Visual size, independent of the heading level.' },
  options: [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra large', value: 'xl' },
    { label: 'Display', value: 'display' },
  ],
}

// Body text size → `var(--size-text-<slug>)`.
export const textSizeField: Field = {
  name: 'size',
  type: 'select',
  defaultValue: 'base',
  label: 'Text size',
  options: [
    { label: 'Small', value: 'sm' },
    { label: 'Base', value: 'base' },
    { label: 'Large', value: 'lg' },
  ],
}

export const buttonSizeField: Field = {
  name: 'size',
  type: 'select',
  defaultValue: 'md',
  label: 'Button size',
  options: [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ],
}

// Spacer height → `var(--space-<slug>)` (shares the spacing scale).
export const spacerSizeField: Field = {
  name: 'size',
  type: 'select',
  defaultValue: 'md',
  label: 'Spacer height',
  options: [
    { label: 'Extra small', value: 'xs' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra large', value: 'xl' },
  ],
}

export const dividerStyleField: Field = {
  name: 'style',
  type: 'select',
  defaultValue: 'line',
  label: 'Divider style',
  options: [
    { label: 'Line', value: 'line' },
    { label: 'Dots', value: 'dots' },
    { label: 'Gradient', value: 'gradient' },
  ],
}

export const dividerWidthField: Field = {
  name: 'width',
  type: 'select',
  defaultValue: 'full',
  label: 'Divider width',
  options: [
    { label: 'Full', value: 'full' },
    { label: 'Narrow', value: 'narrow' },
  ],
}

// Image display width → `.vf-image--<slug>`.
export const imageWidthField: Field = {
  name: 'width',
  type: 'select',
  defaultValue: 'full',
  label: 'Image width',
  options: [
    { label: 'Full', value: 'full' },
    { label: 'Wide', value: 'wide' },
    { label: 'Normal', value: 'normal' },
    { label: 'Narrow', value: 'narrow' },
  ],
}

// Corner rounding → `var(--radius-<slug>)` (full = pill/circle).
export const roundedField: Field = {
  name: 'rounded',
  type: 'select',
  defaultValue: 'md',
  label: 'Corner rounding',
  options: [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Full (pill/circle)', value: 'full' },
  ],
}

export const iconSizeField: Field = {
  name: 'size',
  type: 'select',
  defaultValue: 'md',
  label: 'Icon size',
  options: [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ],
}

// Icon colour → `.vf-icon--<slug>` (mapped to brand tokens).
export const iconColorField: Field = {
  name: 'color',
  type: 'select',
  defaultValue: 'primary',
  label: 'Icon colour',
  options: [
    { label: 'Primary', value: 'primary' },
    { label: 'Accent', value: 'accent' },
    { label: 'Muted', value: 'muted' },
    { label: 'Inherit (text colour)', value: 'inherit' },
  ],
}

// The nested-blocks field that makes Section/Row containers recursive. The caller
// passes the allowed child blocks (atoms + rich blocks) — kept generic here to
// avoid a circular import between this file and the block configs.
export const contentBlocksField = (blocks: Block[], overrides: Partial<Field> = {}): Field =>
  ({
    name: 'content',
    type: 'blocks',
    label: 'Content',
    blocks,
    admin: { initCollapsed: true },
    ...overrides,
  }) as Field
