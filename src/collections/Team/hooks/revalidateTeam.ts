import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Team } from '../../../payload-types'

export const revalidateTeam: CollectionAfterChangeHook<Team> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/about/team/${doc.slug}`

      payload.logger.info(`Revalidating team member at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/about/meet-the-team')
      revalidateTag('team-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath(`/about/team/${previousDoc.slug}`)
      revalidateTag('team-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Team> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/about/team/${doc?.slug}`)
    revalidateTag('team-sitemap', 'max')
  }

  return doc
}
