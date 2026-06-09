import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  // Full nested path (e.g. /services/medico-legal/ime) for nested-docs pages.
  // When provided it takes precedence over the collection-prefix + slug form.
  path?: string | null
}

export const generatePreviewPath = ({ collection, slug, path }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Prefer an explicit nested path; otherwise build from the collection prefix + slug.
  const resolvedPath = path
    ? '/' + path.split('/').filter(Boolean).map(encodeURIComponent).join('/')
    : `${collectionPrefixMap[collection]}/${encodeURIComponent(slug)}`

  const encodedParams = new URLSearchParams({
    path: resolvedPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
