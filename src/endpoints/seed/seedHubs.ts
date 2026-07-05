import type { Payload, PayloadRequest } from 'payload'

import { plainTextToLexical } from './data/richText'

type Ctx = { payload: Payload; req: PayloadRequest }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const custom = (url: string, label: string, extra: Record<string, unknown> = {}): any => ({
  link: { type: 'custom', url, label, newTab: false, ...extra },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enquiry = (label: string): any => ({
  link: { type: 'enquiry', label, url: null, newTab: false },
})

// ── Minimal Lexical builders for archive `introContent` section headers ──
// (the shared plainTextToLexical only emits paragraphs; an archive section
// header wants a real heading + a supporting line).
const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})
const headingNode = (text: string) => ({
  type: 'heading',
  tag: 'h2',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const paragraphNode = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sectionIntro = (heading: string, desc?: string): any => ({
  root: {
    type: 'root',
    children: desc ? [headingNode(heading), paragraphNode(desc)] : [headingNode(heading)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

async function authorPage(
  { payload, req }: Ctx,
  slug: string,
  hero: Record<string, unknown>,
  layout: unknown[],
  // Optional per-page SEO meta (plugin-seo `meta` group). generateMeta renders
  // `<title>` as `${meta.title} | ${siteName}`, so pass the bare page title
  // (e.g. 'Upcoming Events') and let the site name suffix be appended.
  meta?: { title?: string; description?: string },
): Promise<void> {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    req,
  })
  const rec = found.docs[0] as { id: number | string; layout?: unknown[] } | undefined
  if (!rec) {
    payload.logger.warn(`— ${slug}: page not found, skipping`)
    return
  }
  if (Array.isArray(rec.layout) && rec.layout.length > 2) {
    payload.logger.info(`— ${slug} already authored, skipping`)
    return
  }
  await payload.update({
    collection: 'pages',
    id: rec.id,
    data: { hero, layout, ...(meta ? { meta } : {}) } as never,
    req,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`— Authored /${slug}`)
}

// Resolve an In-the-Loop stream SLUG → its record id (archive `stream` is a
// relationship, so the block wants the id, not the slug).
async function streamId({ payload, req }: Ctx, slug: string): Promise<number | string | null> {
  const s = await payload.find({
    collection: 'streams',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    req,
  })
  return (s.docs[0]?.id as number | string | undefined) ?? null
}

// Idempotently ensure a Resources doc exists (the `resources` collection ships
// empty, so the In-the-Loop resources grid would otherwise render nothing). Any
// failure is swallowed so it can never abort page authoring.
type ResourceSeed = {
  slug: string
  title: string
  icon: string
  resourceType: 'checklist' | 'guide' | 'template' | 'fact-sheet'
  audience: 'clients' | 'claimants' | 'all'
  description: string
  ctaLabel: string
  externalUrl: string
  order: number
}
async function ensureResource({ payload, req }: Ctx, data: ResourceSeed): Promise<void> {
  try {
    const existing = await payload.find({
      collection: 'resources',
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs.length > 0) return
    await payload.create({
      collection: 'resources',
      data: data as never,
      req,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`— Seeded resource: ${data.title}`)
  } catch (err) {
    payload.logger.warn(`— Resource "${data.slug}" not seeded: ${(err as Error).message}`)
  }
}

// ── Archive block builders ──────────────────────────────────────────────
// A stream-filtered posts archive (one In-the-Loop hub section).
const postsArchive = (opts: {
  stream?: number | string | null
  featured?: boolean
  heading: string
  desc: string
  cssClass: string[]
  viewAll?: string
  viewAllLabel?: string
  limit?: number
  columns?: '2' | '3' | '4'
  postStyle?: 'card' | 'narrative'
  anchorId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any => ({
  blockType: 'archive',
  populateBy: 'collection',
  relationTo: 'posts',
  ...(opts.stream ? { stream: opts.stream } : {}),
  ...(opts.featured ? { featured: true } : {}),
  ...(opts.postStyle ? { postStyle: opts.postStyle } : {}),
  ...(opts.anchorId ? { anchorId: opts.anchorId } : {}),
  limit: opts.limit ?? 3,
  columns: opts.columns ?? '3',
  introContent: sectionIntro(opts.heading, opts.desc),
  cssClass: opts.cssClass,
  // Always provide a valid view-all link — an empty group still validates its
  // required nested link, so default to the hub when a section has none.
  viewAllLink: custom(opts.viewAll ?? '/in-the-loop', opts.viewAllLabel ?? 'View All'),
})

// An events archive (upcoming/past), rendered via the shared event cards.
const eventsArchive = (opts: {
  view: 'upcoming' | 'past'
  heading: string
  desc: string
  cssClass: string[]
  viewAll?: string
  viewAllLabel?: string
  limit?: number
  columns?: '2' | '3' | '4'
  eventStyle?: 'card' | 'compact'
  anchorId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any => ({
  blockType: 'archive',
  populateBy: 'collection',
  relationTo: 'events',
  view: opts.view,
  ...(opts.eventStyle ? { eventStyle: opts.eventStyle } : {}),
  ...(opts.anchorId ? { anchorId: opts.anchorId } : {}),
  limit: opts.limit ?? 3,
  columns: opts.columns ?? '3',
  introContent: sectionIntro(opts.heading, opts.desc),
  cssClass: opts.cssClass,
  viewAllLink: custom(opts.viewAll ?? '/events', opts.viewAllLabel ?? 'View All'),
})

/**
 * Authors the content-hub landing pages to match the design reference:
 *  · /in-the-loop  (in-the-loop/in-the-loop.html) — sticky section-nav bar, a
 *    single rotating featured-article carousel, per-stream archives (news,
 *    industry insights, specialist spotlights, QA insights ×5, staff narratives
 *    ×4 in narrative-card style), a compact AAMLE upcoming-events archive (2×2,
 *    next 4), a resources grid and the newsletter band.
 *  · /events (chooser) — a two-card gateway routing to the dedicated listings
 *    (the old promo carousel + 3-item preview treatment is removed).
 *  · /upcoming-events (events/upcoming-events.html) — full upcoming event list.
 *  · /past-events (events/past-events.html) — full past event list (8 most recent).
 *    All authored only if the page nodes already exist (skipped gracefully
 *    otherwise; no nodes are created).
 * Every section stays editable in the admin.
 */
export const seedHubs = async (ctx: Ctx): Promise<void> => {
  // Seed a few scaffold resources so the In-the-Loop resources grid isn't empty
  // (admins can replace copy / attach real files later).
  await ensureResource(ctx, {
    slug: 'brief-preparation-checklist-for-ime-referrals',
    title: 'Brief Preparation Checklist for IME Referrals',
    icon: 'check-square',
    resourceType: 'checklist',
    audience: 'clients',
    description:
      'A step-by-step checklist for solicitors and case managers preparing referral briefs for independent medical examinations — covering documentation, claimant history, and referral-question structure.',
    ctaLabel: 'Download Checklist',
    externalUrl: '/information-centre',
    order: 1,
  })
  await ensureResource(ctx, {
    slug: 'understanding-ime-report-turnaround-times',
    title: 'Understanding IME Report Turnaround Times',
    icon: 'file-text',
    resourceType: 'guide',
    audience: 'clients',
    description:
      'A plain-language guide explaining how IME report timelines work, what affects turnaround, and how to plan your matter around realistic delivery expectations.',
    ctaLabel: 'Read Guide',
    externalUrl: '/information-centre',
    order: 2,
  })
  await ensureResource(ctx, {
    slug: 'what-to-expect-at-your-independent-medical-examination',
    title: 'What to Expect at Your Independent Medical Examination',
    icon: 'question',
    resourceType: 'guide',
    audience: 'claimants',
    description:
      'A clear, reassuring guide for claimants attending an IME — covering what to bring, what happens during the examination, and answers to the most common questions.',
    ctaLabel: 'Read Guide',
    externalUrl: '/for-claimants',
    order: 3,
  })

  // Resolve the In-the-Loop stream ids up front.
  const [news, insights, spotlights, qa, staff] = await Promise.all([
    streamId(ctx, 'news-updates'),
    streamId(ctx, 'industry-insights'),
    streamId(ctx, 'specialist-spotlights'),
    streamId(ctx, 'qa-insights'),
    streamId(ctx, 'staff-narratives'),
  ])

  // ── In the Loop ──────────────────────────────────────────────────────
  await authorPage(
    ctx,
    'in-the-loop',
    {
      type: 'pageHero',
      theme: 'dark',
      align: 'left',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Your Source for [[Medico-Legal]] Intelligence',
      subtitle:
        'Industry updates, expert perspectives, AAMLE events, and practical resources — everything you need to stay informed and ahead.',
    },
    [
      // Sticky category tab / anchor bar directly below the hero (design ref
      // `.ni-section-nav`). Order + labels mirror the reference exactly.
      {
        blockType: 'sectionNav',
        sticky: true,
        items: [
          { label: 'Latest', anchorId: 'featured' },
          { label: 'News & Updates', anchorId: 'news' },
          { label: 'AAMLE Events', anchorId: 'events' },
          { label: 'Industry Insights', anchorId: 'insights' },
          { label: 'Specialist Spotlights', anchorId: 'spotlights' },
          { label: 'Resources', anchorId: 'resources' },
          { label: 'QA Insights', anchorId: 'qa-insights' },
          { label: 'Staff Narratives', anchorId: 'staff-narratives' },
        ],
      },
      // Featured — a single rotating featured-article carousel (design ref
      // `.ni-featured` carousel), NOT a 3-card grid. Authored from the three
      // `featured` posts; the SlideCarousel gives the arrows + dots + autoplay.
      // RESIDUAL GAP (block-owned, not seed-fixable): the sticky nav's #featured
      // anchor cannot be resolved from the seed — SlideCarousel/config.ts has no
      // anchorId field (passing `anchorId:'featured'` here would be stripped), and
      // its `heading` is `required`, so the extra "This Month's Featured Reading"
      // heading can't be dropped to leave only the 'Featured' eyebrow. To match
      // the reference `.ni-featured`/`.ni-carousel` (image placeholder + 'Featured'
      // badge + category tag + 'By: … · date' byline + 'Read Full Article →'),
      // SlideCarousel needs a featured-article mode + anchorId + optional heading.
      {
        blockType: 'slideCarousel',
        eyebrow: 'Featured',
        heading: "This Month's [[Featured Reading]]",
        autoplay: true,
        interval: 5000,
        slides: [
          {
            title:
              "Understanding Queensland's Updated WorkCover Guidelines: What Every Legal Practitioner Needs to Know",
            body: "The recent amendments to Queensland WorkCover guidelines introduce significant changes to how independent medical examinations are requested, coordinated, and reported. We break down what's changed and what it means for your practice.",
            accent: 'insights',
            visualLabel: 'Industry Insights',
            pills: [{ text: 'VERIFY Editorial Team' }, { text: '12 May 2026' }],
          },
          {
            title:
              "AAMLE 2026 Annual Conference: Registration Now Open for Australia's Premier Medico-Legal Education Event",
            body: 'The AAMLE Annual Conference brings together medico-legal professionals, legal practitioners, and healthcare specialists for two days of expert-led sessions, workshops, and networking opportunities across Australia.',
            accent: 'seminars',
            visualLabel: 'AAMLE Events',
            pills: [{ text: 'AAMLE Secretariat' }, { text: '5 May 2026' }],
          },
          {
            title:
              'The IME Referral Brief: Why Quality Documentation Determines Report Quality',
            body: 'A well-prepared referral brief is the single greatest factor in the quality of an independent medical examination report. Our senior coordinators outline what information specialists need — and what is most often missing from the briefs they receive.',
            accent: 'sponsorships',
            visualLabel: 'Expert Guidance',
            pills: [{ text: 'VERIFY Senior Coordination Team' }, { text: '28 Apr 2026' }],
          },
        ],
      },
      // News & Updates — per-article "Company News" / "Industry News" chips.
      postsArchive({
        stream: news,
        anchorId: 'news',
        heading: 'Latest from [[VERIFY]]',
        desc: 'Company news, announcements, and updates from the medico-legal industry.',
        cssClass: ['ni-section', 'bg-grey'],
        viewAll: '/in-the-loop',
        viewAllLabel: 'View All News',
      }),
      // AAMLE Events (upcoming) — compact date-badge cards, 2×2, next 4 events.
      eventsArchive({
        view: 'upcoming',
        eventStyle: 'compact',
        columns: '2',
        limit: 4,
        anchorId: 'events',
        heading: 'Upcoming Webinars & [[Training]]',
        desc: 'Complimentary, CPD-eligible education for legal, medical, and insurance professionals.',
        cssClass: ['ni-section', 'bg-white'],
        viewAll: '/upcoming-events',
        viewAllLabel: 'View All Events',
      }),
      // Industry Insights — "Practice Guide" / "Legal Framework" / "Clinical" chips.
      postsArchive({
        stream: insights,
        anchorId: 'insights',
        heading: 'Practical Knowledge for [[Practitioners]]',
        desc: 'In-depth articles on medico-legal practice, legislation, and clinical assessment written for legal and insurance professionals.',
        cssClass: ['ni-section', 'bg-grey'],
        viewAll: '/in-the-loop',
        viewAllLabel: 'View All Insights',
      }),
      // Specialist Spotlights (dark band) — "Orthopaedics" / "Psychiatry" / "Pain Medicine".
      postsArchive({
        stream: spotlights,
        anchorId: 'spotlights',
        heading: 'Meet the Experts [[Behind the Reports]]',
        desc: 'Short profiles and conversations with specialists on the VERIFY expert panel.',
        cssClass: ['ni-section', 'bg-dark'],
        viewAll: '/specialist-panel',
        viewAllLabel: 'View All Spotlights',
      }),
      // Resources (light-blue band, driven by the Resources collection)
      {
        blockType: 'resourcesGrid',
        anchorId: 'resources',
        eyebrow: 'Resources',
        heading: 'Guides, Checklists & [[Templates]]',
        subheading:
          'Practical tools for legal practitioners, insurers, and claimants navigating the medico-legal process.',
        background: 'accent',
        source: 'auto',
        columns: '3',
        limit: 6,
      },
      // QA Insights — 5 items (Vol. 24–27 + the IME Report Quality Checklist).
      postsArchive({
        stream: qa,
        anchorId: 'qa-insights',
        limit: 5,
        heading: "From VERIFY's [[Quality Assurance Team]]",
        desc: 'Practical notes from the team that reviews every report — what they look for, what they find, and what it means for your matter.',
        cssClass: ['ni-section', 'bg-white'],
        viewAll: '/in-the-loop',
        viewAllLabel: 'View All QA Insights',
      }),
      // Staff Narratives — 2×2 narrative cards with author photo/name/role.
      postsArchive({
        stream: staff,
        anchorId: 'staff-narratives',
        postStyle: 'narrative',
        limit: 4,
        heading: 'Insights from the [[VERIFY Team]]',
        desc: 'Practical perspectives from the people behind your medico-legal outcomes.',
        cssClass: ['ni-section', 'bg-grey'],
        viewAll: '/in-the-loop',
        viewAllLabel: 'View All Narratives',
      }),
      // Newsletter
      {
        blockType: 'newsletter',
        eyebrow: 'Stay in the Loop',
        heading: 'Be the First to Know About [[VERIFY & AAMLE Updates]]',
        subheading:
          'Subscribe to receive new articles from In the Loop, AAMLE industry event invitations, and announcements — delivered directly to your inbox.',
        placeholder: 'Enter your email address',
        buttonLabel: 'Subscribe',
        note: 'Unsubscribe at any time. We respect your privacy.',
      },
    ],
  )

  // ── Events (chooser) ─────────────────────────────────────────────────
  // The reference splits events into two dedicated pages (/upcoming-events +
  // /past-events). The old combined page's promo carousel and 3-item preview
  // treatment are removed; /events is now a lightweight chooser that routes to
  // the two full listings.
  await authorPage(
    ctx,
    'events',
    {
      type: 'pageHero',
      theme: 'dark',
      align: 'left',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Medico-Legal [[Education Events]]',
      subtitle:
        'Practical education, industry briefings, and specialist-led seminars from VERIFY and AAMLE — browse what is coming up or revisit recent programs.',
    },
    [
      {
        blockType: 'gatewayCards',
        eyebrow: 'Events & Seminars',
        heading: 'Explore VERIFY & [[AAMLE Events]]',
        subheading: 'Choose upcoming events to register, or browse our recent programs.',
        background: 'white',
        columns: '2',
        cards: [
          {
            icon: 'calendar-check',
            eyebrow: 'Register Now',
            title: 'Upcoming Events',
            description:
              'Register for upcoming breakfast seminars, webinars, and specialist-led medico-legal education sessions from VERIFY and AAMLE.',
            accent: 'blue',
            ...custom('/upcoming-events', 'Explore Upcoming Events'),
          },
          {
            icon: 'clock',
            eyebrow: 'Recent Programs',
            title: 'Past Events',
            description:
              'Browse recent seminars, training sessions, and industry events delivered for the medico-legal community.',
            accent: 'steel',
            ...custom('/past-events', 'Explore Past Events'),
          },
        ],
      },
    ],
  )

  // ── Upcoming Events (dedicated full listing) ─────────────────────────
  await authorPage(
    ctx,
    'upcoming-events',
    {
      type: 'pageHero',
      theme: 'dark',
      // Reference `.events-hero` is centre-aligned (breadcrumb + heading centred,
      // 860px max-width). PageHero emits `page-hero--center` for align:'center'.
      align: 'center',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Explore Upcoming Medico-Legal [[Education Events]]',
    },
    [
      // NOTE: the reference also shows a search/filter toolbar above the list,
      // and renders the events as full-width list ROWS (`event-list-row`) with a
      // bordered CTA, meta-icon row, and pagination. No CMS toolbar/search block
      // and no ArchiveBlock list-row mode exist yet, so this uses the closest
      // available `card` layout (flagged as residual gaps). No section header.
      {
        blockType: 'archive',
        populateBy: 'collection',
        relationTo: 'events',
        view: 'upcoming',
        eventStyle: 'card',
        limit: 12,
        columns: '3',
        cssClass: ['ni-section', 'bg-white'],
      },
    ],
    {
      title: 'Upcoming Events',
      description:
        'Explore upcoming VERIFY and AAMLE medico-legal seminars, webinars, workshops, industry briefings, sponsorships, and networking events.',
    },
  )

  // ── Past Events (dedicated full listing — 8 most recent) ─────────────
  await authorPage(
    ctx,
    'past-events',
    {
      type: 'pageHero',
      theme: 'dark',
      // Reference `.events-hero` is centre-aligned (matches upcoming-events).
      align: 'center',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Explore Past Medico-Legal [[Education Events]]',
    },
    [
      // Reference `.events-list-shell` sits on a WHITE background (same as
      // upcoming-events), not grey. See the upcoming-events note re: the residual
      // list-row / filter-toolbar / pagination gaps that apply here too.
      {
        blockType: 'archive',
        populateBy: 'collection',
        relationTo: 'events',
        view: 'past',
        eventStyle: 'card',
        limit: 8,
        columns: '3',
        cssClass: ['ni-section', 'bg-white'],
      },
    ],
    {
      title: 'Past Events',
      description:
        'Browse previous VERIFY and AAMLE medico-legal seminars, webinars, workshops, industry briefings, sponsorships, and networking events.',
    },
  )
}
