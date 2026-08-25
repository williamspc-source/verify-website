import { iconOptions } from '@/components/Icon'

/**
 * The curated icon list, for the picker.
 *
 * ## Why the picker fetches this instead of importing it
 *
 * `iconOptions` is derived from `iconMap`, and that module imports 101 Phosphor
 * components at module scope. `IconSelect` is a **client** component rendered on
 * every icon field in the admin, so importing the list would drag all 101 into
 * the admin bundle to display nothing but their names. Serving it keeps the list
 * derived from the same map the site renders from — so it cannot drift — while
 * the admin bundle stays exactly as it was.
 */
export const GET = async (): Promise<Response> =>
  new Response(JSON.stringify({ icons: iconOptions }), {
    headers: {
      'Content-Type': 'application/json',
      // Changes only when the map does, i.e. on a deploy.
      'Cache-Control': 'public, max-age=3600',
    },
  })
