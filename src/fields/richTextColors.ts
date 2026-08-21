import type { Field } from 'payload'

/**
 * The colours an editor can paint text with, and the single place they are defined.
 *
 * ## Why this is a field rather than a toolbar button
 *
 * Payload 3.85 ships `TextStateFeature`, which would put a colour dropdown inside
 * the rich-text toolbar and let an editor colour one word mid-sentence. It is
 * deliberately not used. Colour here is a property of an *element* — this
 * heading, this card's body — not of a run of words, and there is already a
 * mechanism for the one-word case: `[[double brackets]]` paint a phrase in the
 * brand accent (see `accentText`). Adding a second, overlapping way to colour a
 * word would leave two controls fighting over the same text, with the bracket
 * winning, and no way for an editor to tell why.
 *
 * ## Why keys and tokens rather than stored colour values
 *
 * The field stores `brand`, never `#1c75bc`. The CSS class it emits resolves
 * through the design token, and every one of those tokens is already editable in
 * **Site Settings → Brand colours**. So a rebrand re-paints every coloured word
 * on the site at once. Storing a literal would freeze each word at the hex that
 * was current when someone typed it, and a rebrand would leave them behind —
 * scattered, invisible until someone noticed the wrong blue.
 *
 * ## Light and dark bands
 *
 * `Heading` and `Body` need no dark variant: `.vf-on-dark` (globals.css) already
 * re-points `--text-dark`/`--text-mid` to the on-dark scale, so a card that an
 * editor switches from light to dark carries its text colour with it. That flip
 * is the reason this palette is expressed in tokens rather than colours, and why
 * those two are the sane defaults to reach for.
 *
 * The two that *do* need a dark variant are the ones that would vanish: brand
 * blue is low-contrast on a dark band and deep navy is nearly invisible on one,
 * so both re-point on `.vf-on-dark` — the same treatment
 * `.vf-section--primary .vf-accent` already gets.
 */

export type BrandTextColor = {
  /** Stored value, and the `vf-tc-` class suffix. */
  key: string
  /** What the editor reads in the dropdown. */
  label: string
  /** The design token the class resolves through. */
  token: string
  /** The token's value in `:root`, asserted by the palette guard. */
  fallback: string
  /** Where it re-points inside `.vf-on-dark`, when it would otherwise disappear. */
  onDarkToken?: string
  /** Shown under the control. */
  description?: string
}

/**
 * Seven entries, on purpose. This is a brand palette an editor picks from, not a
 * colour wheel: enough to express emphasis, de-emphasis and the two brand blues,
 * few enough that every combination has been looked at on both a light and a
 * dark band.
 */
export const BRAND_TEXT_COLORS: readonly BrandTextColor[] = [
  {
    key: 'heading',
    label: 'Heading text',
    token: '--text-dark',
    fallback: '#414042',
    description: 'The default colour of a heading. Turns white on a dark band.',
  },
  {
    key: 'body',
    label: 'Body text',
    token: '--text-mid',
    fallback: '#222222',
    description: 'The default colour of body copy. Turns pale on a dark band.',
  },
  {
    key: 'brand',
    label: 'Brand blue',
    token: '--primary',
    fallback: '#1c75bc',
    onDarkToken: '--accent-on-dark',
  },
  {
    key: 'deep',
    label: 'Deep navy',
    token: '--primary-deep',
    fallback: '#1a3a5c',
    onDarkToken: '--text-on-dark',
  },
  { key: 'bright', label: 'Bright blue', token: '--secondary-bright', fallback: '#2d8fe8' },
  {
    key: 'muted',
    label: 'Muted grey-blue',
    token: '--steel',
    fallback: '#93abbf',
    description: 'For a line that should sit back from the copy around it.',
  },
  {
    key: 'white',
    label: 'White',
    token: '--text-on-dark',
    fallback: '#ffffff',
    description: 'For text over a photograph or a coloured panel.',
  },
] as const

/** The value meaning "leave it as the design intends" — emits no class at all. */
export const INHERIT_COLOR = 'inherit'

/**
 * The class for a stored colour key, or `undefined` for "no class".
 *
 * Returns `undefined` — rather than throwing or emitting `vf-tc-undefined` — for
 * a key that is absent, `inherit`, or no longer in the palette. A colour retired
 * from the list therefore degrades to the design's own colour rather than to
 * unstyled text, and old content keeps rendering.
 */
export const colorClass = (key?: string | null): string | undefined => {
  if (!key || key === INHERIT_COLOR) return undefined
  return BRAND_TEXT_COLORS.some((c) => c.key === key) ? `vf-tc-${key}` : undefined
}

/**
 * A "Text colour" select.
 *
 * Defaults to `inherit`, which is what makes adding this control to a block a
 * no-op: every existing page keeps the colour it has, and the field only does
 * something once an editor chooses. That is also what makes the claim "this
 * change moves no pixels" provable with `computedSnapshot.mjs`.
 */
export const textColorField = (
  overrides: { name?: string; label?: string; description?: string } = {},
): Field =>
  ({
    name: overrides.name ?? 'textColour',
    type: 'select' as const,
    label: overrides.label ?? 'Text colour',
    defaultValue: INHERIT_COLOR,
    options: [
      { label: 'Default (as designed)', value: INHERIT_COLOR },
      ...BRAND_TEXT_COLORS.map((c) => ({ label: c.label, value: c.key })),
    ],
    admin: {
      description:
        overrides.description ??
        'Colours this text. Brand colours follow Site Settings, so a rebrand updates them everywhere. A phrase in [[double brackets]] keeps the accent colour regardless.',
    },
  }) as Field
