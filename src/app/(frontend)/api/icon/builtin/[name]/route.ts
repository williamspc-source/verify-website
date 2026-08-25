import { createElement } from 'react'

import { iconMap, type IconName } from '@/components/Icon'

/**
 * One curated icon, as an SVG file.
 *
 * The picker previews every tier the same way — a `mask-image` painted with the
 * admin's own text colour — so an uploaded icon and a built-in one look like what
 * they will look like on the page. Rendering the real Phosphor component here
 * means the preview is the same artwork at the same weight as the site draws,
 * rather than a second copy that can drift.
 *
 * Only `iconMap` is imported. The full Phosphor barrel is deliberately NOT
 * imported anywhere: a namespace import of all 1,513 icons is what the first
 * attempt at this feature reached for, and it defeats tree-shaking for a list
 * this site does not offer.
 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
): Promise<Response> => {
  const { name } = await params

  // Refuse anything that is not a plain kebab name before the map lookup.
  if (!/^[a-z0-9-]+$/.test(name)) return new Response('Not found', { status: 404 })

  // Not `typeof === 'function'`: Phosphor icons are `forwardRef` components,
  // which are OBJECTS. That check 404s every icon that exists, which reads
  // exactly like a name the library does not have.
  const Cmp = iconMap[name as IconName]
  if (!Cmp) return new Response('Not found', { status: 404 })

  // Imported inside the handler, not at module scope: Next refuses a static
  // `react-dom/server` import under `(frontend)` — it assumes the module is
  // browser-reachable and fails the build with a message about components, which
  // is misleading for a route handler.
  const { renderToStaticMarkup } = await import('react-dom/server')

  const svg = renderToStaticMarkup(
    createElement(Cmp as React.ComponentType<Record<string, unknown>>, {
      weight: 'duotone',
      // The mask reads alpha and discards the colour, so this only has to be opaque.
      color: '#000',
    }),
  )

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      // Built from a package version that only changes on an upgrade.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
