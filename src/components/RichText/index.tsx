import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'
import { accentText } from '@/utilities/accentText'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  if (relationTo === 'posts') {
    // Posts live under /in-the-loop/{stream}/{slug}; fall back to a bare
    // /in-the-loop/{slug} when the linked post's stream isn't populated.
    const stream = (value as { stream?: unknown }).stream
    const streamSlug =
      stream && typeof stream === 'object' ? (stream as { slug?: string }).slug : undefined
    return streamSlug ? `/in-the-loop/${streamSlug}/${slug}` : `/in-the-loop/${slug}`
  }
  return `/${slug}`
}

// Lexical text-format bitmask (bold/italic/etc.), mirrored so we can re-wrap
// accent-transformed text without importing from deep inside the package.
const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
} as const

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Honour the VERIFY [[accent]] convention in rich-text body copy (headings use
  // accentText() directly). Reproduces the default text converter's format
  // handling so bold/italic/etc. still work, with the [[…]] → .vf-accent split
  // applied to the innermost text node.
  text: ({ node }) => {
    const { format } = node
    let content: React.ReactNode = accentText(node.text)
    if (format & TEXT_FORMAT.BOLD) content = <strong>{content}</strong>
    if (format & TEXT_FORMAT.ITALIC) content = <em>{content}</em>
    if (format & TEXT_FORMAT.STRIKETHROUGH)
      content = <span style={{ textDecoration: 'line-through' }}>{content}</span>
    if (format & TEXT_FORMAT.UNDERLINE)
      content = <span style={{ textDecoration: 'underline' }}>{content}</span>
    if (format & TEXT_FORMAT.CODE) content = <code>{content}</code>
    if (format & TEXT_FORMAT.SUBSCRIPT) content = <sub>{content}</sub>
    if (format & TEXT_FORMAT.SUPERSCRIPT) content = <sup>{content}</sup>
    return content
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
