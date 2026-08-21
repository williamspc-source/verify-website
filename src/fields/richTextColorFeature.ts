import { TextStateFeature } from '@payloadcms/richtext-lexical'

import { BRAND_TEXT_COLORS } from './richTextColors'

/**
 * The brand colour swatches in the rich-text toolbar.
 *
 * ## Why this is a separate file from `richTextColors.ts`
 *
 * `TextStateFeature` comes from the *server* export of
 * `@payloadcms/richtext-lexical`. `richTextColors.ts` holds `colorClass()`, which
 * `InlineRichText` and the shared text converter both call while rendering the
 * site — client code. Putting the feature beside them would pull the editor
 * package into every heading's bundle. One palette, two importers, two files.
 *
 * ## What is stored
 *
 * Nothing but the key. `TextStateFeature` writes Lexical NodeState onto the text
 * node, which serialises under `$` (lexical's `NODE_STATE_KEY`):
 *
 *     { "type": "text", "text": "Expert Panel", "$": { "color": "brand" } }
 *
 * The `css` below is **the editor's swatch and preview only** — it is not written
 * into the document, which is what makes this free of any schema change: no new
 * column, no migration, and a colour retired from the palette degrades to
 * uncoloured text rather than to a stale hex.
 *
 * The page gets its colour from the class instead. That is deliberate and it is
 * the same reasoning as the block-level control: `.vf-tc-brand` resolves through
 * `--primary`, which **Site Settings** owns, so a rebrand repaints every coloured
 * word at once. A stored `#1c75bc` would freeze each word at the blue that
 * happened to be current when someone typed it.
 *
 * ## The literal hexes here
 *
 * The admin has no `--primary` — `brandColorStyle()` puts the brand tokens on
 * `<html>` in the front-end layout only — so the swatch cannot use `var()`. It
 * uses the `fallback` each palette entry already records, and
 * `richTextColors.int.spec.ts` asserts every one of those matches the token's
 * value in `:root`. So the swatch can drift from the page only by making that
 * guard go red.
 *
 * ## `@experimental`
 *
 * Payload marks `TextStateFeature` experimental in 3.85, so its API may move on
 * an upgrade. The exposure is two call sites — this file and the `text` converter
 * in `src/components/RichText/shared.tsx`. Stored content is a bare key, so even
 * a breaking API change cannot corrupt what editors have written.
 */
export const brandTextColorFeature = () =>
  TextStateFeature({
    state: {
      color: Object.fromEntries(
        BRAND_TEXT_COLORS.map((colour) => [
          colour.key,
          {
            label: colour.label,
            css: {
              color: colour.fallback,
              // White on the editor's white background is an invisible swatch and
              // invisible text the moment it is applied — the editor would look
              // like it had deleted the words. The outline is an admin-only
              // affordance; the page renders `.vf-tc-white` with no shadow.
              ...(colour.key === 'white' ? { 'text-shadow': '0 0 2px rgba(0, 0, 0, 0.65)' } : {}),
            },
          },
        ]),
      ),
    },
  })
