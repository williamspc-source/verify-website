import type { CSSProperties } from 'react'

import type { DesignSystem } from '@/payload-types'

/**
 * Turns the Design System global into an inline style object of CSS custom
 * properties applied to <html> (:root). Any set value overrides the defaults in
 * globals.css; empty fields fall through to those defaults. Each token maps to
 * the var name the `.vf-*--<preset>` classes reference, so editing one re-themes
 * every block that uses that preset. Mirrors `brandColorStyle`.
 */
export const designTokenStyle = (tokens?: DesignSystem | null): CSSProperties => {
  const style: Record<string, string> = {}

  const set = (name: string, value?: string | null) => {
    const v = value?.trim()
    if (v) style[name] = v
  }

  if (!tokens) return {}

  set('--font-heading', tokens.typography?.headingFont)
  set('--font-body', tokens.typography?.bodyFont)
  set('--size-text-base', tokens.typography?.baseSize)

  set('--space-compact', tokens.spacing?.compact)
  set('--space-normal', tokens.spacing?.normal)
  set('--space-spacious', tokens.spacing?.spacious)
  set('--space-xl', tokens.spacing?.xl)

  set('--gap-tight', tokens.gaps?.tight)
  set('--gap-normal', tokens.gaps?.normal)
  set('--gap-wide', tokens.gaps?.wide)

  set('--size-heading-sm', tokens.headings?.sm)
  set('--size-heading-md', tokens.headings?.md)
  set('--size-heading-lg', tokens.headings?.lg)
  set('--size-heading-xl', tokens.headings?.xl)
  set('--size-heading-display', tokens.headings?.display)

  set('--size-text-sm', tokens.text?.sm)
  set('--size-text-base', tokens.text?.base)
  set('--size-text-lg', tokens.text?.lg)

  set('--vf-radius-sm', tokens.radius?.sm)
  set('--vf-radius-md', tokens.radius?.md)

  set('--band-muted', tokens.bands?.muted)
  set('--band-accent', tokens.bands?.accent)
  set('--band-primary', tokens.bands?.primary)
  set('--band-dark', tokens.bands?.dark)

  return style as CSSProperties
}
