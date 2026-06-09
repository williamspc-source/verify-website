import type { CSSProperties } from 'react'

/**
 * Turns the Site Settings `colors` group into an inline style object of CSS
 * custom properties. Applied to <html> (which is :root), so any set value
 * overrides the defaults in globals.css; empty fields fall through to those
 * defaults. Each brand colour maps to every token that should track it.
 */
type BrandColors =
  | {
      primary?: string | null
      primaryStrong?: string | null
      text?: string | null
      mutedText?: string | null
      accent?: string | null
      border?: string | null
    }
  | null
  | undefined

export const brandColorStyle = (colors: BrandColors): CSSProperties => {
  const style: Record<string, string> = {}

  const set = (vars: string[], value?: string | null) => {
    const v = value?.trim()
    if (v) vars.forEach((name) => (style[name] = v))
  }

  if (!colors) return {}

  set(['--primary'], colors.primary)
  set(['--primary-strong'], colors.primaryStrong)
  set(['--foreground', '--text-dark'], colors.text)
  set(['--muted-foreground', '--text-mid'], colors.mutedText)
  set(['--bg-light-1', '--accent'], colors.accent)
  set(['--border', '--border-light', '--input'], colors.border)

  return style as CSSProperties
}
