import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * `revalidatePath` / `revalidateTag` that cannot take the caller down with them.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 * Next 16 throws when either is called from anywhere other than a Server Action
 * or a route handler — including "used ... during render which is unsupported".
 * Payload runs `afterChange` hooks **inside the database transaction**, so an
 * unguarded throw does not merely log: it aborts the operation and rolls the
 * write back.
 *
 * That was not hypothetical. Measured on this repo, at HEAD as well as on the
 * fixed tree: opening **Admin → Pages → Create New** rendered the sidebar and no
 * form at all — zero inputs, no `<form>` element, HTTP 200, nothing in the
 * browser console. Same for Posts. The server log showed:
 *
 *   ERROR: Route /admin/[[...segments]] used "revalidateTag global_header"
 *          during render which is unsupported.
 *   ERROR: Nested Docs plugin has had an error while adding breadcrumbs
 *          during document creation.
 *
 * Building the create view's initial form state runs the nested-docs breadcrumb
 * logic, that touched our revalidation hooks, and the throw propagated out of
 * form-state construction. The result was a CMS in which **no new page or post
 * could be created**, presenting as an empty screen with no error.
 *
 * Cache invalidation is best-effort by nature: the worst case of a skipped purge
 * is a page serving stale content until the next write or the next deploy. The
 * worst case of a thrown purge is losing the write. So it is always caught, and
 * always reported — never swallowed silently.
 */
type Logger = { warn: (msg: string) => void }

const report = (logger: Logger | undefined, what: string, err: unknown) => {
  const message =
    `Revalidation skipped (${what}): ${err instanceof Error ? err.message : String(err)}. ` +
    `The write itself succeeded; affected pages may serve stale content until the next change.`
  if (logger) logger.warn(message)
  else console.warn(message)
}

export const safeRevalidatePath = (
  path: string,
  type?: 'layout' | 'page',
  logger?: Logger,
): void => {
  try {
    if (type) revalidatePath(path, type)
    else revalidatePath(path)
  } catch (err) {
    report(logger, `path ${path}`, err)
  }
}

// Next 16 requires a cacheLife profile alongside the tag; every call site in this
// repo passes 'max', so that is the default rather than something to remember.
export const safeRevalidateTag = (
  tag: string,
  profile: 'max' | 'default' = 'max',
  logger?: Logger,
): void => {
  try {
    revalidateTag(tag, profile)
  } catch (err) {
    report(logger, `tag ${tag}`, err)
  }
}
