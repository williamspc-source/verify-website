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

export const plainTextToLexical = (text?: string | null) => {
  const paragraphs = (text || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      children: paragraphs.length ? paragraphs.map(paragraph) : [paragraph('')],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
