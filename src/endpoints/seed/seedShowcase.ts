import type { Payload, PayloadRequest } from 'payload'

/* =====================================================================
   Seeds a "Style Guide" page (/style-guide) that uses every block + hero
   variant with representative starter content. It is the review/handoff
   artifact: the assistant opens it in admin to see and polish each block,
   and views it directly at /style-guide.

   Published but UNLISTED (not in any nav). Unpublish or delete it before
   go-live. Idempotent: created once; only refreshed while still empty.
   ===================================================================== */

// ── Minimal Lexical helpers ──
const text = (t: string, format = 0) => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: t,
  version: 1,
})
const paragraph = (t: string) => ({
  type: 'paragraph',
  children: [text(t)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})
const heading = (t: string, tag: 'h2' | 'h3' = 'h3') => ({
  type: 'heading',
  tag,
  children: [text(t)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const richText = (children: unknown[]) => ({
  root: { type: 'root', children, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 },
})

const customLink = (label: string) => ({
  type: 'custom' as const,
  url: '#',
  label,
  newTab: false,
})

const buildLayout = (mediaId?: number | string | null) => [
  {
    blockType: 'gatewayCards' as const,
    eyebrow: 'Who we help',
    heading: 'Find your pathway',
    subheading: 'Audience gateway cards — icon, title, copy and a link. Hover to lift.',
    background: 'white' as const,
    columns: '3' as const,
    motion: 'fade-up' as const,
    cssClass: ['card-accent-bar'],
    cards: [
      {
        icon: 'scale',
        title: 'For Lawyers',
        description: 'Engage independent experts and order reports.',
        links: [
          { link: customLink('Our services') },
          { link: customLink('Specialist directory') },
          { link: customLink('How to refer') },
        ],
        link: customLink('Make a referral'),
      },
      {
        icon: 'shield',
        title: 'For Insurers',
        description: 'Reliable, defensible medico-legal opinions.',
        links: [
          { link: customLink('Our services') },
          { link: customLink('Quality assurance') },
          { link: customLink('Turnaround times') },
        ],
        link: customLink('Get in touch'),
      },
      {
        icon: 'user-check',
        title: 'For Claimants',
        description: 'What to expect at your examination.',
        links: [
          { link: customLink('Information centre') },
          { link: customLink('Preparing for your exam') },
          { link: customLink('Frequently asked questions') },
        ],
        link: customLink('Learn more'),
      },
    ],
  },
  {
    blockType: 'featureGrid' as const,
    eyebrow: 'Why VERIFY',
    heading: 'Built for accuracy',
    background: 'muted' as const,
    columns: '3' as const,
    cardStyle: 'card' as const,
    items: [
      { icon: 'clipboard-check', title: 'Quality assured', description: 'Every report is QA-reviewed before delivery.' },
      { icon: 'clock', title: 'On time', description: 'Delivered within agreed timeframes.' },
      { icon: 'users', title: 'Expert panel', description: 'A broad panel across every discipline.' },
    ],
  },
  {
    blockType: 'statsBand' as const,
    heading: 'By the numbers',
    background: 'primary' as const,
    stats: [
      { value: 34, suffix: '+', label: 'Specialists' },
      { value: 500, suffix: '+', label: 'IMEs / year' },
      { value: 20, suffix: '', label: 'Team members' },
      { value: 15, suffix: ' yrs', label: 'Experience' },
    ],
  },
  {
    blockType: 'processSteps' as const,
    eyebrow: 'How we work',
    heading: 'Our process',
    background: 'white' as const,
    columns: '3' as const,
    steps: [
      { icon: 'send', title: 'Enquiry & referral', description: 'Submit your referral and claimant details.' },
      { icon: 'users', title: 'Specialist matching', description: 'We match the right expert for the claim.' },
      { icon: 'file-text', title: 'Report delivery', description: 'A QA-reviewed report, on time.' },
    ],
  },
  {
    blockType: 'tabs' as const,
    eyebrow: 'Services',
    heading: 'What we offer',
    background: 'muted' as const,
    tabs: [
      { label: 'Medico-Legal', content: richText([heading('Medico-Legal Services'), paragraph('Independent examinations, joint examinations, file reviews and expert evidence.')]) },
      { label: 'Educational', content: richText([heading('Educational Services'), paragraph('AAMLE seminars, workshops and training for the medico-legal sector.')]) },
    ],
  },
  {
    blockType: 'splitFeature' as const,
    background: 'white' as const,
    rows: [
      {
        ...(mediaId ? { image: mediaId } : {}),
        imageSide: 'auto' as const,
        eyebrow: 'IME',
        title: 'Independent Medical Examinations',
        body: richText([paragraph('Impartial, expert assessment of injury, impairment and capacity.')]),
        bullets: [{ text: 'AMA Guides compliant' }, { text: 'In-person or telehealth' }, { text: 'Fast turnaround' }],
        link: customLink('Read more'),
      },
      {
        ...(mediaId ? { image: mediaId } : {}),
        imageSide: 'auto' as const,
        eyebrow: 'JME',
        title: 'Joint Medical Examinations',
        body: richText([paragraph('Coordinated joint examinations that streamline the claims process.')]),
        bullets: [{ text: 'Single coordinated appointment' }, { text: 'Reduced claimant burden' }],
        link: customLink('Read more'),
      },
    ],
  },
  {
    blockType: 'specialtyGrid' as const,
    eyebrow: 'Disciplines',
    heading: 'Specialties',
    subheading: 'Auto-listed from the Specialties taxonomy.',
    background: 'muted' as const,
    source: 'auto' as const,
    columns: '4' as const,
    defaultIcon: 'stethoscope',
    linkToDirectory: false,
  },
  {
    blockType: 'peopleGrid' as const,
    eyebrow: 'Featured specialists',
    heading: 'Available this month',
    subheading:
      'An infinite marquee of advertised specialists from the CMS — pauses on hover; arrows flip direction.',
    background: 'accent' as const,
    source: 'specialists' as const,
    onlyAdvertised: true,
    layout: 'carousel' as const,
    columns: '4' as const,
    limit: 8,
    linkProfiles: false,
    carouselOptions: {
      speed: 30,
      direction: 'left',
      showArrows: true,
    },
  },
  {
    blockType: 'peopleGrid' as const,
    heading: 'Meet the team',
    background: 'muted' as const,
    source: 'team' as const,
    layout: 'grid' as const,
    columns: '4' as const,
    limit: 8,
    linkProfiles: false,
  },
  {
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
  },
  {
    blockType: 'ctaBand' as const,
    heading: 'Ready to get started?',
    text: 'Talk to our team about your next referral.',
    links: [{ link: customLink('Contact us') }, { link: customLink('See availability') }],
  },
]

const heroForShowcase = () => ({
  type: 'homeHero' as const,
  eyebrow: 'Design system',
  heading: 'VERIFY block library',
  subtitle: 'Every reusable block and hero, with starter content. Edit any of it in the admin.',
  definition: {
    term: 'verify',
    pronunciation: '/ˈvɛrɪfʌɪ/ · verb',
    text: 'make sure or demonstrate that something is accurate, true or justified.',
  },
  links: [{ link: customLink('Primary action') }, { link: customLink('Secondary') }],
})

export const seedShowcase = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  const media = await payload.find({ collection: 'media', limit: 1, depth: 0, req })
  const mediaId = media.docs[0]?.id ?? null

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'style-guide' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = existing.docs[0]

  const data = {
    title: 'Style Guide',
    slug: 'style-guide',
    _status: 'published' as const,
    hero: heroForShowcase(),
    layout: buildLayout(mediaId),
  }

  if (!page) {
    await payload.create({
      collection: 'pages',
      depth: 0,
      req,
      context: { disableRevalidate: true },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    })
    payload.logger.info('— Created Style Guide showcase page (draft) at /style-guide')
    return
  }

  // Refresh only while still the placeholder scaffold.
  const layout = (page.layout ?? []) as { blockType?: string }[]
  const isPlaceholder =
    Array.isArray(layout) &&
    layout.length === 1 &&
    layout[0]?.blockType === 'content' &&
    JSON.stringify(layout[0]).includes('scaffolded and ready for content')

  if (isPlaceholder) {
    await payload.update({
      collection: 'pages',
      id: page.id,
      depth: 0,
      req,
      context: { disableRevalidate: true },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    })
    payload.logger.info('— Refreshed Style Guide showcase page')
  } else {
    payload.logger.info('— Style Guide page already populated, skipping')
  }
}
