import type { Payload, PayloadRequest } from 'payload'

type Ctx = { payload: Payload; req: PayloadRequest }

/**
 * Two content repairs that a seed edit alone cannot deliver, because `authorPage`
 * early-returns on an already-authored document — so a fixture change only ever
 * reaches a virgin database. The box will be one; a working install is not.
 * Same reasoning as `repairLinkTargets`.
 *
 * ── Both repairs are ADDITIVE. ──────────────────────────────────────────────
 *
 * Everything they touch is editable at /admin, and a repair that reasserts the
 * fixture on every seed run would quietly revert an editor — which is a worse
 * failure than the gap it closes, and precisely what this codebase's rules exist
 * to prevent. So each one writes only into an *absence*:
 *
 *   · the carousel is inserted only when the page has no `slideCarousel` at all;
 *     an existing one is never inspected, reordered or rewritten;
 *   · the explorer instance is reused as-is, so edited search settings, page size
 *     and labels survive — only its position in the array changes;
 *   · the hero heading changes only while it still holds the exact superseded
 *     string;
 *   · a post's category is set only when it has none.
 *
 * Re-running the seed after any hand-edit must therefore be a no-op. That is the
 * acceptance test, not an aspiration.
 */

// ── /events hub ─────────────────────────────────────────────────────────────

/** The heading the events hub was seeded with before it became the reference's
 *  hub page. Matched exactly: anything else is an editor's wording. */
const SUPERSEDED_EVENTS_HEADING = 'Medico-Legal [[Education Events]]'
const EVENTS_HEADING = 'Medico-Legal Education for [[Better Practice]]'

/**
 * The four-ways carousel, matching `.design-reference/events/events-seminars.html`.
 * Identical in shape to the instance in `seedShowcase`, which is where this
 * content has been living while the events hub went without it.
 */
export const fourWaysCarousel = () => ({
  blockType: 'slideCarousel' as const,
  eyebrow: 'Programs & partnerships',
  heading: 'Four ways VERIFY brings medico-legal learning to life',
  autoplay: true,
  interval: 5800,
  slides: [
    {
      title: 'Informative Seminars',
      body: 'Tailored professional development seminars for legal, insurance and medical professionals across the medico-legal domain.',
      accent: 'seminars' as const,
      visualLabel: 'Seminar',
      pills: [{ text: 'CPD-ready' }, { text: 'Practical topics' }, { text: 'Expert-led' }],
    },
    {
      title: 'Specialist Insights Presentations',
      body: 'Deep-dive presentations from our expert panel on the issues shaping assessment and reporting.',
      accent: 'insights' as const,
      visualLabel: 'Insights',
      pills: [{ text: 'Panel experts' }, { text: 'Case studies' }],
    },
    {
      title: 'Networking Events',
      body: 'Connect with peers across the medico-legal sector at curated networking events.',
      accent: 'networking' as const,
      visualLabel: 'Networking',
      pills: [{ text: 'Industry-wide' }, { text: 'Relationship-building' }],
    },
    {
      title: 'Industry Sponsorships',
      body: 'Partner with VERIFY and AAMLE to support education and innovation in the sector.',
      accent: 'sponsorships' as const,
      visualLabel: 'Sponsorship',
      pills: [{ text: 'Brand visibility' }, { text: 'Thought leadership' }],
    },
  ],
})

const blockTypeOf = (b: unknown): string | null =>
  b && typeof b === 'object' && typeof (b as { blockType?: unknown }).blockType === 'string'
    ? (b as { blockType: string }).blockType
    : null

export const repairEventsHub = async ({ payload, req }: Ctx): Promise<void> => {
  const found = await payload.find({
    collection: 'pages',
    limit: 1,
    depth: 0,
    where: { slug: { equals: 'events' } },
    req,
  })
  const page = found.docs[0]
  if (!page) return

  const layout = Array.isArray((page as { layout?: unknown }).layout)
    ? ([...((page as { layout: unknown[] }).layout ?? [])] as unknown[])
    : []

  const data: Record<string, unknown> = {}
  const changes: string[] = []

  // The carousel — only into an absence.
  if (!layout.some((b) => blockTypeOf(b) === 'slideCarousel')) {
    // Sit it directly above the explorer, so the page reads: what we run, then
    // find one. With no explorer present, append and leave the rest alone.
    const explorerAt = layout.findIndex((b) => blockTypeOf(b) === 'eventsExplorer')
    if (explorerAt === -1) layout.push(fourWaysCarousel())
    else layout.splice(explorerAt, 0, fourWaysCarousel())
    data.layout = layout
    changes.push('added the Programs & partnerships carousel')
  }

  // The hero heading — only while it is still the superseded string.
  const hero = (page as { hero?: Record<string, unknown> | null }).hero
  if (hero && hero.heading === SUPERSEDED_EVENTS_HEADING) {
    data.hero = { ...hero, heading: EVENTS_HEADING }
    changes.push('updated the hero heading')
  }

  if (!changes.length) return

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: data as never,
    req,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`— Events hub: ${changes.join(', ')}`)
}

// ── Featured article topic chips ────────────────────────────────────────────

/** Post slug → the category slug its card should show beside the Featured badge,
 *  per `.design-reference/in-the-loop/in-the-loop.html`. */
const FEATURED_CATEGORY: Record<string, string> = {
  'the-ime-referral-brief-why-quality-documentation-determines-report-quality': 'expert-guidance',
  'aamle-2026-annual-conference-registration-now-open': 'aamle-events',
  'understanding-queenslands-updated-workcover-guidelines-what-every-legal-practitioner-needs-to-know':
    'industry-insights',
}

export const repairFeaturedCategories = async ({ payload, req }: Ctx): Promise<void> => {
  let fixed = 0

  for (const [postSlug, categorySlug] of Object.entries(FEATURED_CATEGORY)) {
    const found = await payload.find({
      collection: 'posts',
      limit: 1,
      depth: 0,
      where: { slug: { equals: postSlug } },
      req,
    })
    const post = found.docs[0]
    if (!post) continue

    // Only into an absence. A post an editor has already categorised — even
    // differently from the reference — is left alone.
    const existing = (post as { categories?: unknown }).categories
    if (Array.isArray(existing) && existing.length > 0) continue

    const category = await payload.find({
      collection: 'categories',
      limit: 1,
      depth: 0,
      where: { slug: { equals: categorySlug } },
      req,
    })
    const categoryId = category.docs[0]?.id
    if (!categoryId) continue

    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { categories: [categoryId] } as never,
      req,
      context: { disableRevalidate: true },
    })
    fixed++
  }

  if (fixed) payload.logger.info(`— Featured articles: added a topic chip to ${fixed} post(s)`)
}
