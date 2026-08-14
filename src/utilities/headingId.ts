import { stripAccent } from './accentText'

/**
 * Anchor ids for rich-text headings.
 *
 * This is the *single* definition, and it has to stay that way. An in-page
 * anchor is two halves — the link and the target — and they were built by two
 * copies of the same slugify: one in the article page (for the contents list's
 * hrefs) and one in `ArticleToc` (which assigned the ids on mount). Two copies
 * of a function are two things that can drift, and a drifted pair fails
 * silently: the contents list still renders, the headings still render, and the
 * links just do nothing.
 *
 * Worse, assigning ids on mount meant they did not exist in the server HTML at
 * all, so a *pasted* `…/article#some-heading` URL landed at the top of the page.
 * The browser resolves a fragment while parsing, long before React runs.
 *
 * So: the id is derived here, the rendered heading gets it from the converter in
 * `src/components/RichText` (opt in with `headingIds`), and the contents list
 * gets it from the same call in the article page. One function, both sides.
 */

/**
 * Structural view of a Lexical node — the minimum needed to read a heading's
 * text without depending on the editor's serialised types.
 *
 * `type` is load-bearing, not decoration. Without at least one property in
 * common with `SerializedLexicalNode` (`{ type, version }`) this is a TypeScript
 * *weak type*, and passing a real heading node's `children` to it fails with
 * TS2559 "has no properties in common".
 */
export type TextishNode = {
  type?: string
  tag?: string
  text?: string
  children?: TextishNode[]
}

/** Heading label → anchor id. */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Plain text of a Lexical node, including any nested link/format children. */
export const lexicalNodeText = (node: TextishNode): string =>
  node.text ?? (Array.isArray(node.children) ? node.children.map(lexicalNodeText).join('') : '')

/**
 * The heading as a reader sees it. `[[double brackets]]` are the VERIFY accent
 * convention (see `accentText`) — display syntax, not content — so they come out
 * of both the id and the contents-list label. Without this the sidebar prints
 * the brackets literally while the heading itself renders them as colour.
 */
export const headingLabel = (node: TextishNode): string =>
  stripAccent(lexicalNodeText(node)).trim()

/**
 * Anchor id for a heading node in isolation.
 *
 * Returns `''` when the text slugifies to nothing — a punctuation-only or
 * non-ASCII heading. Callers must treat `''` as "no id" rather than emitting
 * `id=""` or `href="#"`, which scrolls to the top of the page and looks like a
 * broken link.
 */
export const headingId = (node: TextishNode): string => slugify(headingLabel(node))

/**
 * Anchor id for the heading at `index`, disambiguated against its siblings.
 *
 * Two headings with the same words in one document would otherwise emit the same
 * id: invalid HTML, a duplicate React key in the contents list, and a second
 * heading that no link can reach. Counting *earlier* siblings makes the suffix
 * depend only on what precedes it, so the renderer and the contents list compute
 * the same answer from the same array without sharing any state.
 *
 * No article collides today (measured: 0 of 55 headings), so this is here to
 * keep a future one honest rather than to fix a present fault.
 */
export const headingIdAt = (siblings: TextishNode[], index: number): string => {
  const node = siblings[index]
  if (!node) return ''
  const id = headingId(node)
  if (!id) return ''

  let earlier = 0
  for (let i = 0; i < index; i++) {
    const sibling = siblings[i]
    if (sibling?.type === 'heading' && headingId(sibling) === id) earlier++
  }
  return earlier ? `${id}-${earlier + 1}` : id
}
