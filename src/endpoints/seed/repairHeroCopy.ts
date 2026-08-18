import type { Payload, PayloadRequest } from 'payload'

type Ctx = { payload: Payload; req: PayloadRequest }

/**
 * Corrects superseded wording in page hero subtitles.
 *
 * Copy lives in the database, so editing a seed fixture fixes nothing on any
 * install that already exists — `authorPage` early-returns on an authored page.
 * Every wording correction therefore needs a repair like this one, run
 * unconditionally from `seedVerify`.
 *
 * ── Why the predicate is the superseded string itself ──
 * It is the narrowest possible signal: the exact sentence being replaced. Once
 * corrected the string is gone, so this can never fire twice, and an editor who
 * has since rewritten the sentence keeps their version untouched — the repair
 * writes only into the absence of the correction, never over a decision.
 *
 * Add a row per correction. Keep `from` an exact, whole-sentence match rather
 * than a fragment: a fragment can appear inside copy that was never meant to
 * change, and a hero subtitle is not the only thing a loose phrase would hit.
 */
const HERO_SUBTITLE_FIXES: { slug: string; from: string; to: string }[] = [
  // Oxford comma before the final item, matching the rest of the site's copy
  // (e.g. "accuracy, defensibility, and compliance" on the same page family).
  {
    slug: 'specialists',
    from: 'Our specialists are highly skilled professionals committed to the highest standards of professionalism, accuracy and impartiality.',
    to: 'Our specialists are highly skilled professionals committed to the highest standards of professionalism, accuracy, and impartiality.',
  },
  {
    slug: 'specialist-panel',
    from: 'Our specialists are highly skilled professionals committed to the highest standards of professionalism, accuracy and impartiality.',
    to: 'Our specialists are highly skilled professionals committed to the highest standards of professionalism, accuracy, and impartiality.',
  },
]

export const repairHeroCopy = async ({ payload, req }: Ctx): Promise<void> => {
  for (const { slug, from, to } of HERO_SUBTITLE_FIXES) {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      req,
    })
    const page = found.docs[0] as unknown as
      | { id: number | string; hero?: { subtitle?: string | null } | null }
      | undefined
    const subtitle = page?.hero?.subtitle
    if (!page || typeof subtitle !== 'string' || !subtitle.includes(from)) continue

    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { hero: { ...page.hero, subtitle: subtitle.replace(from, to) } } as never,
      req,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`— Repaired hero copy on /${slug}`)
  }
}
