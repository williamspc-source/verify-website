import { getCachedIconLibrary } from '@/utilities/getIconLibrary'

/**
 * The icons a picker should offer, as `[{ value, label }]`.
 *
 * ## Why the picker fetches this instead of importing it
 *
 * Two reasons. The list is now **editable** — it comes from the Icon Library
 * global, not from source — and `IconSelect` is a **client** component rendered
 * on every icon field in the admin, so importing `iconMap` to build the fallback
 * would drag 101 Phosphor components into the admin bundle to display nothing but
 * their names.
 *
 * Not cached at the HTTP layer: an admin who adds an icon should see it in the
 * next picker they open, and `getCachedIconLibrary` already means this costs one
 * query per change rather than one per request.
 */

/** `arrow-right` → `Arrow Right`, for a picker that shows words beside pictures. */
const label = (name: string): string =>
  name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const GET = async (): Promise<Response> => {
  const names = await getCachedIconLibrary()

  return new Response(
    JSON.stringify({ icons: names.map((value) => ({ value, label: label(value) })) }),
    { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
  )
}
