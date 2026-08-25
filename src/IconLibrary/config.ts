import type { GlobalConfig } from 'payload'

import { revalidateIconLibrary } from './hooks/revalidateIconLibrary'

/**
 * Which icons the pickers offer, chosen from the 1,513 Phosphor ships.
 *
 * ## Why this is a list and not "show everything"
 *
 * Search over 1,513 icons works, but it also puts a games controller and a
 * Facebook logo one keystroke away from a medico-legal page. This global is the
 * policy — an admin browses everything and decides what editors see — while
 * `/api/icon/phosphor/[name]` remains able to render any of them, so adding one
 * is a save rather than a deploy.
 *
 * ## Two rules that keep it from ever emptying a page
 *
 * 1. **An empty list means the built-in set**, not "no icons". A global nobody
 *    has opened yet, or one saved empty by accident, behaves exactly as the site
 *    did before it existed. See `effectiveIconList`.
 * 2. **Removing an icon never un-picks it.** The list decides what is OFFERED;
 *    every stored value keeps rendering, and the picker still shows an icon a
 *    document already uses even when the library no longer lists it — the rule
 *    `CssClassSelect` applies to an unknown class.
 *
 * Stored as kebab names — `brain`, `stethoscope` — the same strings an icon
 * field holds, so there is nothing to translate between the two.
 */
export const IconLibrary: GlobalConfig = {
  slug: 'icon-library',
  label: 'Icon Library',
  admin: {
    group: 'Design',
    description:
      'The icons editors can choose from. Browse everything Phosphor offers and add the ones that suit the site. Leave it empty to offer the built-in set.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'icons',
      type: 'text',
      hasMany: true,
      label: 'Icons editors can choose',
      admin: {
        components: { Field: '@/fields/IconLibraryPicker#IconLibraryPicker' },
        description:
          'Search all 1,513 Phosphor icons and click to add or remove. Removing one stops it being offered; it never changes a page that already uses it.',
      },
    },
  ],
  hooks: { afterChange: [revalidateIconLibrary] },
}
