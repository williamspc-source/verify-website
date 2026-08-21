import type { Field } from 'payload'

/**
 * The colours an editor can paint text with, and the single place they are defined.
 *
 * ## Two controls, one palette
 *
 * This array feeds both of them:
 *
 *  · the block-level **Text colour** select (`textColorField`, below), which sets
 *    the colour of a whole heading, subheading or card line; and
 *  · the **toolbar swatch** in every rich-text box, registered by
 *    `./richTextColorFeature.ts`, which colours whatever the editor selected.
 *
 * Both emit `.vf-tc-<key>`, so `globals.css` paints them identically and
 * `richTextColors.int.spec.ts` keeps all three in step.
 *
 * The toolbar half was originally left out on the reasoning that two ways to
 * colour a phrase would fight — the bracket against the picker — with the bracket
 * winning and no way for an editor to tell why. That was a real problem and it is
 * now decided rather than avoided: the converter marks a toolbar pick
 * `vf-tc--inline`, and `globals.css` lets it beat the `[[bracket]]` accent, while
 * the block-level select still loses to it. A default yields to the bracket; a
 * selection an editor made by hand does not.
 *
 * What was not reconsidered is where colours come from. Mid-paragraph colour is
 * still drawn from this seven-entry brand palette and never from a colour wheel.
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
 *
 * ── Why the band-following pair is LAST ─────────────────────────────────────
 * `heading` and `body` resolve to `--text-dark` and `--text-mid`, which on a
 * light band are the colours the text already is. Measured on the homepage
 * heading: **Default and "Heading text" both compute `rgb(65, 64, 66)`** — the
 * same value, to the byte. They earn their place by flipping on a dark band,
 * where they are the only way to say "this should stay readable if the band
 * changes", but on the light band an editor is usually looking at, choosing one
 * does nothing visible.
 *
 * They used to sit directly under "Default (as designed)", which is where an
 * editor experimenting clicks first. That happened: the control was tried,
 * "Heading text" was picked, nothing changed on the page, and it was reported —
 * correctly — as a colour control that does not colour. So the five that visibly
 * differ come first, and the two adaptive ones are labelled with what they are
 * for rather than with the part of the page they are named after.
 */
export const BRAND_TEXT_COLORS: readonly BrandTextColor[] = [
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
  // The two below follow the band rather than stating a colour. On a light band
  // they are what the text already is — picking one is a no-op you can see, which
  // is why they are last and why their labels lead with the flip.
  {
    key: 'heading',
    label: 'Follows the band — heading',
    token: '--text-dark',
    fallback: '#414042',
    description: 'Heading grey on a light band, white on a dark one.',
  },
  {
    key: 'body',
    label: 'Follows the band — body',
    token: '--text-mid',
    fallback: '#222222',
    description: 'Body grey on a light band, pale on a dark one.',
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
        'Colours this block’s heading and subheading — not its cards. To colour anything else, select the words and use the colour swatch in that field’s toolbar. The two “Follows the band” choices look identical to Default on a light background; they exist so text stays readable if the band is switched to dark.',
    },
  }) as Field
