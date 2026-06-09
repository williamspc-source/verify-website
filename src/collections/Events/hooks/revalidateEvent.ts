import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/events/${doc.slug}`

      payload.logger.info(`Revalidating event at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/events')
      revalidateTag('events-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath(`/events/${previousDoc.slug}`)
      revalidateTag('events-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/events/${doc?.slug}`)
    revalidateTag('events-sitemap', 'max')
  }

  return doc
}
