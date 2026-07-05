// Converts a plain-text bio (paragraphs separated by blank lines) into the
// minimal Lexical richText shape Payload expects. Shared by the data-layer seed.

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (text: string, tag: 'h2' | 'h3') => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

// A blank-line-separated block beginning with `## ` (or `### `) becomes a real
// Lexical heading node — this is how article bodies get the H2 sections the
// scroll-spy TOC keys off. Everything else is a paragraph. (`.` doesn't match
// newlines without the `m` flag, so multi-line blocks never match.)
const blockToNode = (block: string) => {
  const m = /^(#{2,3})\s+(.+)$/.exec(block)
  if (m) return heading(m[2].trim(), m[1].length === 3 ? 'h3' : 'h2')
  return paragraph(block)
}

export const plainTextToLexical = (text?: string | null) => {
  const blocks = (text || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      children: blocks.length ? blocks.map(blockToNode) : [paragraph('')],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
