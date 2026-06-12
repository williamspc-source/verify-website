import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

type StylesGlobal = {
  globalCss?: string | null
  presets?: { name?: string | null; css?: string | null }[] | null
}

/**
 * Injects the admin-authored Custom Styles site-wide: the global CSS plus every
 * preset's CSS (verbatim). Classes are applied to blocks/heroes/pages via their
 * strict "Custom CSS class(es)" picker. Rendered once in the frontend layout.
 */
export const CustomCSS: React.FC = async () => {
  const styles = (await getCachedGlobal('custom-styles', 0)()) as StylesGlobal

  const parts: string[] = []
  if (styles?.globalCss?.trim()) parts.push(styles.globalCss.trim())
  for (const preset of styles?.presets || []) {
    if (preset?.css?.trim()) parts.push(preset.css.trim())
  }

  const css = parts.join('\n\n')
  if (!css) return null

  return <style id="verify-custom-styles" dangerouslySetInnerHTML={{ __html: css }} />
}
