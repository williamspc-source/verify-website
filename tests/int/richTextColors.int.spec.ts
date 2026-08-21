import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  BRAND_TEXT_COLORS,
  INHERIT_COLOR,
  colorClass,
  textColorField,
} from '@/fields/richTextColors'

/**
 * The editor's colour palette has two halves that can drift apart.
 *
 * `src/fields/richTextColors.ts` decides what the dropdown offers and what class
 * each choice emits. `globals.css` decides what those classes paint. Nothing but
 * this file makes the two agree — and the failure is silent in the worst
 * direction: an editor picks "Bright blue", the field saves, the class lands in
 * the HTML, and the text does not change colour because no rule matches. A
 * control that can be set and does nothing is the first thing this repo's
 * invariants forbid.
 *
 * The breaks that prove these, all run:
 *
 *  · Delete the `.vf-tc-bright` rule from globals.css → **2 fail**, not 1: the
 *    missing-rule assertion and the `!important` one, since a rule that is not
 *    there declares nothing either. Both name `bright`.
 *  · Remove the `!important` from `.vf-tc-brand` → **1 fails**, naming `brand`.
 *    That flag is load-bearing rather than lazy: page-scoped ports like
 *    `.vf-client-overview .vf-split__title` (0,2,0) outrank a bare `.vf-tc-*`
 *    (0,1,0), so without it the editor's choice loses to a rule they cannot see.
 *  · The token assertion needed no deliberate break — **it failed on its first
 *    run**, because `--text-dark` and `--text-mid` are declared as
 *    `var(--text-dark-base)` rather than as hexes. That alias is the mechanism
 *    the dark-band flip depends on, so the guard learned to follow one hop
 *    rather than the CSS being flattened to satisfy it. Recorded because the
 *    tempting "fix" was the damaging one.
 */

const CSS = readFileSync(join(process.cwd(), 'src/app/(frontend)/globals.css'), 'utf8')

/** The `:root` block that opens the file, where the brand tokens are declared. */
const ROOT_BLOCK = CSS.slice(CSS.indexOf(':root'), CSS.indexOf('}', CSS.indexOf('--radius')))

const ruleFor = (key: string): string | null => {
  // The bare class only — `.vf-tc-x {`, never `.vf-on-dark .vf-tc-x {` or
  // `.vf-tc-x .vf-accent {`, both of which would satisfy a substring search
  // while the colour itself went undeclared.
  const match = CSS.match(new RegExp(`(^|\\n)\\.vf-tc-${key}\\s*\\{([^}]*)\\}`))
  return match ? match[2]! : null
}

describe('the brand text-colour palette', () => {
  it('offers something to pick', () => {
    // A positive control: every assertion below iterates the palette, and an
    // empty palette would satisfy all of them vacuously.
    expect(BRAND_TEXT_COLORS.length).toBeGreaterThan(0)
  })

  it.each(BRAND_TEXT_COLORS.map((c) => [c.key, c] as const))(
    'every palette colour has a rule: %s',
    (key, colour) => {
      const rule = ruleFor(key)
      expect(rule, `globals.css has no \`.vf-tc-${key}\` rule`).not.toBeNull()
      expect(rule, `\`.vf-tc-${key}\` should resolve through ${colour.token}`).toContain(
        `var(${colour.token})`,
      )
    },
  )

  it.each(BRAND_TEXT_COLORS.map((c) => [c.key, c] as const))(
    'every rule states its colour as an explicit choice: %s',
    (key) => {
      expect(
        ruleFor(key),
        `\`.vf-tc-${key}\` must win over page-scoped rules an editor cannot see`,
      ).toContain('!important')
    },
  )

  /**
   * Resolve one level of aliasing. `--text-dark` is declared as
   * `var(--text-dark-base)` rather than as a hex, and that indirection is
   * load-bearing rather than incidental: `.vf-on-dark` re-points `--text-dark`
   * to the on-dark scale, and `.vf-on-light` restores it from the `-base` pair.
   * A guard that demanded a literal would have been "fixed" by flattening the
   * alias, which would break the light-card-inside-a-dark-band case.
   */
  const resolveToken = (token: string): string | undefined => {
    const declared = ROOT_BLOCK.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1]?.trim()
    const alias = declared?.match(/^var\((--[a-z0-9-]+)\)$/)?.[1]
    return alias ? resolveToken(alias) : declared
  }

  it.each(BRAND_TEXT_COLORS.map((c) => [c.token, c] as const))(
    'every token is defined in :root with the fallback the palette records: %s',
    (token, colour) => {
      expect(ROOT_BLOCK, `${token} is not declared in :root`).toContain(`${token}:`)
      const declared = resolveToken(token)
      expect(
        declared,
        `${token} resolves to \`${declared}\` in :root but the palette records \`${colour.fallback}\``,
      ).toContain(colour.fallback)
    },
  )

  it.each(
    BRAND_TEXT_COLORS.filter((c) => c.onDarkToken).map((c) => [c.key, c.onDarkToken!] as const),
  )('a colour that would vanish on a dark band re-points: %s', (key, onDarkToken) => {
    const match = CSS.match(new RegExp(`\\.vf-on-dark \\.vf-tc-${key}[^{]*\\{([^}]*)\\}`))
    expect(match?.[1], `no \`.vf-on-dark .vf-tc-${key}\` rule`).toBeTruthy()
    expect(match![1]).toContain(`var(${onDarkToken})`)
  })
})

describe('colorClass', () => {
  it('emits a class for a real palette key', () => {
    expect(colorClass('brand')).toBe('vf-tc-brand')
  })

  it('emits nothing for absent, inherit, or a retired colour', () => {
    // Degrading to the design's own colour is the point: content coloured with a
    // key that is later removed keeps rendering, just uncoloured. Emitting
    // `vf-tc-undefined` would leave a class in the HTML that nothing paints.
    expect(colorClass(null)).toBeUndefined()
    expect(colorClass(undefined)).toBeUndefined()
    expect(colorClass(INHERIT_COLOR)).toBeUndefined()
    expect(colorClass('galaxy')).toBeUndefined()
  })
})

describe('textColorField', () => {
  it('defaults to inherit, so adding the control to a block moves nothing', () => {
    const field = textColorField() as { defaultValue?: string; options?: { value: string }[] }
    expect(field.defaultValue).toBe(INHERIT_COLOR)
    expect(field.options?.[0]?.value).toBe(INHERIT_COLOR)
  })

  it('offers exactly the palette, plus the default', () => {
    const field = textColorField() as { options?: { value: string }[] }
    expect(field.options?.map((o) => o.value)).toEqual([
      INHERIT_COLOR,
      ...BRAND_TEXT_COLORS.map((c) => c.key),
    ])
  })
})
