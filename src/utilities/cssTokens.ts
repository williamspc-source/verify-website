import type { DesignSystem } from '@/payload-types'

/**
 * Builds the `:root { … }` CSS text that carries every CMS-editable design token
 * (Site Settings → Brand colours, Design System → everything else).
 *
 * ── Why this is a <style> tag and not an inline style on <html> ──────────────
 * These tokens used to be applied as `<html style={…}>`. An inline style
 * attribute outranks every author selector, so an editor writing
 * `:root { --primary: red }` in Globals → Custom Styles → Global CSS was
 * silently overridden and the escape hatch could not override anything. Emitting
 * a real stylesheet puts all three layers at the same specificity (0,1,0), so
 * plain source order decides:
 *
 *   1. globals.css `:root`              — built-in defaults
 *   2. <style id="verify-design-tokens">— CMS values           (this file)
 *   3. <style id="verify-custom-styles">— Custom Styles global (always wins)
 *
 * That ordering is a contract. Both tags are rendered at the top of <body> in
 * `app/(frontend)/layout.tsx`, in that order — do not reorder them, and do not
 * wrap either in `@layer`: unlayered CSS beats layered CSS, so layering this
 * block would let the globals.css defaults win over the editor's values.
 */

/**
 * Values come from the database and are interpolated into a <style> element,
 * where `</style>` would end the element and turn a colour field into an HTML
 * injection point. Property names are code-controlled (the fixed lists below),
 * so only values need checking.
 *
 * Anything that could terminate a declaration, a rule, or the element is
 * rejected outright rather than escaped — a CSS token value never legitimately
 * needs these characters, and silently falling back to the built-in default is
 * always safer than emitting a broken or hostile stylesheet. The same regex is
 * exported so field `validate` functions can tell the editor at save time
 * instead of letting them wonder why nothing happened.
 */
export const UNSAFE_TOKEN_VALUE = /[<>{};\\]|\/\*|\*\/|[\u0000-\u001f]/

export const safeTokenValue = (value?: string | null): string | null => {
  const v = value?.trim()
  if (!v || v.length > 200 || UNSAFE_TOKEN_VALUE.test(v)) return null
  return v
}

/** Last-resort guard for any assembled CSS string bound for dangerouslySetInnerHTML. */
export const stripStyleClose = (css: string): string => css.replace(/<\/style/gi, '')

type BrandColors =
  | {
      primary?: string | null
      primaryStrong?: string | null
      text?: string | null
      mutedText?: string | null
      accent?: string | null
      border?: string | null
      accentLight?: string | null
      primaryDeep?: string | null
      textOnDark?: string | null
      mutedTextOnDark?: string | null
      accentOnDark?: string | null
      borderOnDark?: string | null
      // Surfaces
      background?: string | null
      surface?: string | null
      surfaceText?: string | null
      white?: string | null
      muted?: string | null
      primaryText?: string | null
      ring?: string | null
      // Extended blues
      secondary?: string | null
      secondaryText?: string | null
      secondaryBright?: string | null
      steel?: string | null
      gradientStart?: string | null
      navy?: string | null
      definitionBlue?: string | null
      paleSurface?: string | null
      // Status & feedback
      success?: string | null
      warning?: string | null
      error?: string | null
      formError?: string | null
      calloutInfo?: string | null
      calloutNote?: string | null
      calloutSuccess?: string | null
      calloutWarning?: string | null
      availInPerson?: string | null
      availTelehealth?: string | null
      availEither?: string | null
    }
  | null
  | undefined

/**
 * Collects `--name: value` pairs in insertion order. Brand colours and design
 * tokens write disjoint name sets; if that ever stops being true the old
 * `{...brandColorStyle(), ...designTokenStyle()}` spread would have resolved the
 * clash silently, so warn loudly in development instead.
 * (`tests/int/cssTokens.int.spec.ts` asserts the sets stay disjoint.)
 */
class TokenMap {
  private readonly out = new Map<string, string>()

  set(names: string | string[], value?: string | null): void {
    const v = safeTokenValue(value)
    if (!v) return
    for (const name of Array.isArray(names) ? names : [names]) {
      if (this.out.has(name) && process.env.NODE_ENV !== 'production') {
        console.warn(`[cssTokens] duplicate custom property "${name}" — later value wins`)
      }
      this.out.set(name, v)
    }
  }

  get names(): string[] {
    return [...this.out.keys()]
  }

  toCss(): string {
    if (this.out.size === 0) return ''
    const body = [...this.out].map(([name, value]) => `${name}:${value}`).join(';')
    return `:root{${body}}`
  }
}

const addBrandColors = (map: TokenMap, colors: BrandColors): void => {
  if (!colors) return

  map.set('--primary', colors.primary)
  map.set('--primary-strong', colors.primaryStrong)

  // Set the *-base vars, not the derived ones. globals.css defines
  // `--text-dark: var(--text-dark-base)` and `.vf-on-light` restores from the
  // -base pair, so writing --text-dark directly meant a brand text-colour edit
  // silently reverted on every light card sitting inside a dark band.
  map.set(['--foreground', '--text-dark-base'], colors.text)
  map.set(['--muted-foreground', '--text-mid-base'], colors.mutedText)
  map.set(['--bg-light-1', '--accent'], colors.accent)
  // Same shape: --border and --border-light both derive from --border-base.
  map.set(['--border-base', '--input'], colors.border)
  map.set('--accent-light', colors.accentLight)
  map.set('--primary-deep', colors.primaryDeep)

  // Text on dark/coloured bands. `.vf-on-dark` re-points --text-dark/--text-mid
  // at these, so every descendant flips automatically rather than needing a
  // per-selector override.
  map.set('--text-on-dark', colors.textOnDark)
  map.set('--text-muted-on-dark', colors.mutedTextOnDark)
  map.set(['--accent-sky', '--accent-on-dark'], colors.accentOnDark)
  map.set('--border-on-dark', colors.borderOnDark)

  // Surfaces — what pages and cards are painted on.
  map.set('--background', colors.background)
  map.set(['--card', '--popover'], colors.surface)
  map.set(['--card-foreground', '--popover-foreground'], colors.surfaceText)
  map.set('--white', colors.white)
  map.set('--muted', colors.muted)
  map.set('--primary-foreground', colors.primaryText)
  map.set('--ring', colors.ring)

  // The wider blue ramp the gradients and decorative panels draw from.
  map.set('--secondary', colors.secondary)
  map.set(['--secondary-foreground', '--accent-foreground'], colors.secondaryText)
  map.set('--secondary-bright', colors.secondaryBright)
  map.set('--steel', colors.steel)
  map.set('--gradient-start', colors.gradientStart)
  map.set('--navy', colors.navy)
  map.set('--definition-blue', colors.definitionBlue)
  map.set('--bg-light-2', colors.paleSurface)

  // Semantic status colours, deliberately independent of the brand palette.
  map.set('--success', colors.success)
  map.set('--warning', colors.warning)
  map.set(['--error', '--destructive'], colors.error)
  map.set('--form-error', colors.formError)
  map.set('--callout-info', colors.calloutInfo)
  map.set('--callout-note', colors.calloutNote)
  map.set('--callout-success', colors.calloutSuccess)
  map.set('--callout-warning', colors.calloutWarning)
  map.set('--sa-inperson', colors.availInPerson)
  map.set('--sa-telehealth', colors.availTelehealth)
  map.set('--sa-either', colors.availEither)
}

const addDesignTokens = (map: TokenMap, tokens?: DesignSystem | null): void => {
  if (!tokens) return

  map.set('--font-heading', tokens.typography?.headingFont)
  map.set('--font-body', tokens.typography?.bodyFont)
  // The inherited body size, distinct from --size-text-base (the Text atom's
  // "base" preset, set from tokens.text.base below). They used to share a var,
  // so whichever field was filled in last silently won.
  map.set('--font-size-base', tokens.typography?.baseSize)
  // Scales the root font size, and with it every rem-based size on the site.
  map.set('--vf-text-scale', tokens.typography?.textScale)

  map.set('--space-compact', tokens.spacing?.compact)
  map.set('--space-normal', tokens.spacing?.normal)
  map.set('--space-spacious', tokens.spacing?.spacious)
  map.set('--space-xl', tokens.spacing?.xl)

  map.set('--gap-tight', tokens.gaps?.tight)
  map.set('--gap-normal', tokens.gaps?.normal)
  map.set('--gap-wide', tokens.gaps?.wide)

  map.set('--size-heading-sm', tokens.headings?.sm)
  map.set('--size-heading-md', tokens.headings?.md)
  map.set('--size-heading-lg', tokens.headings?.lg)
  map.set('--size-heading-xl', tokens.headings?.xl)
  map.set('--size-heading-display', tokens.headings?.display)

  map.set('--size-text-sm', tokens.text?.sm)
  map.set('--size-text-base', tokens.text?.base)
  map.set('--size-text-lg', tokens.text?.lg)

  map.set('--vf-radius-none', tokens.radius?.none)
  map.set('--vf-radius-sm', tokens.radius?.sm)
  map.set('--vf-radius-chip', tokens.radius?.chip)
  map.set('--vf-radius-card', tokens.radius?.card)
  map.set('--vf-radius-tile', tokens.radius?.tile)
  map.set('--vf-radius-md', tokens.radius?.md)
  map.set('--vf-radius-panel', tokens.radius?.panel)
  map.set('--vf-radius-pill', tokens.radius?.pill)
  map.set('--vf-radius-circle', tokens.radius?.circle)
  map.set('--radius', tokens.radius?.base)

  map.set('--vf-grad-image-tint', tokens.gradients?.imageTint)
  map.set('--vf-grad-deep', tokens.gradients?.deep)
  map.set('--vf-grad-hero', tokens.gradients?.hero)
  map.set('--vf-grad-avatar', tokens.gradients?.avatarTint)

  map.set('--band-muted', tokens.bands?.muted)
  map.set('--band-accent', tokens.bands?.accent)
  map.set('--band-primary', tokens.bands?.primary)
  map.set('--band-dark', tokens.bands?.dark)

  // Shadow/glow ladder. `--vf-shadow-color` feeds every colour-mix in the
  // scale, so setting just that one field retints the whole site's depth.
  map.set('--vf-shadow-color', tokens.effects?.color)
  map.set('--vf-shadow-color-deep', tokens.effects?.colorDeep)
  map.set('--vf-shadow-xs', tokens.effects?.xs)
  map.set('--vf-shadow-sm', tokens.effects?.sm)
  map.set('--vf-shadow-md', tokens.effects?.md)
  map.set('--vf-shadow-lg', tokens.effects?.lg)
  map.set('--vf-shadow-xl', tokens.effects?.xl)
  map.set('--vf-shadow-2xl', tokens.effects?.xxl)
  map.set('--vf-glow-sm', tokens.effects?.glowSm)
  map.set('--vf-glow-md', tokens.effects?.glowMd)
  map.set('--vf-glow-lg', tokens.effects?.glowLg)
  map.set('--vf-shadow-ring', tokens.effects?.ring)
  map.set('--vf-shadow-inset-highlight', tokens.effects?.insetHighlight)
  map.set('--vf-shadow-hard', tokens.effects?.hard)
  map.set('--transition', tokens.effects?.transition)
}

/** The CSS text for the `verify-design-tokens` <style> tag. Empty string = render nothing. */
export const buildTokenCss = (colors: BrandColors, tokens?: DesignSystem | null): string => {
  const map = new TokenMap()
  addBrandColors(map, colors)
  addDesignTokens(map, tokens)
  return stripStyleClose(map.toCss())
}

/** Exported for the disjointness test only. */
export const __tokenNames = (colors: BrandColors, tokens?: DesignSystem | null) => {
  const brand = new TokenMap()
  addBrandColors(brand, colors)
  const design = new TokenMap()
  addDesignTokens(design, tokens)
  return { brand: brand.names, design: design.names }
}
