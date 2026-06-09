import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Specialist } from '../../../payload-types'

export const revalidateSpecialist: CollectionAfterChangeHook<Specialist> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/specialists/${doc.slug}`

      payload.logger.info(`Revalidating specialist at path: ${path}`)

      revalidatePath(path)
      revalidateTag('specialists-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/specialists/${previousDoc.slug}`

      payload.logger.info(`Revalidating old specialist at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('specialists-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Specialist> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/specialists/${doc?.slug}`)
    revalidateTag('specialists-sitemap', 'max')
  }

  return doc
}
