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

// A minimal Lexical richText wrapping a single heading node (used for the enquiry
// form's "Send Us Your Enquiry" intro heading).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const headingRichText = (text: string, tag: 'h2' | 'h3' | 'h4' = 'h3'): any => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'heading',
        tag,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

/**
 * Authors the homepage (`/`) block layout to match .design-reference/index.html:
 * home hero (+ definition panel) · audience gateway (light-grey band) · who-we-are
 * (two-column w/ image placeholder) · tabbed "What We Do" (medico-legal services
 * grid + AAMLE education, light-blue band) · two-column "Claims We Support" ·
 * featured-specialists carousel (light-grey band) · testimonials carousel ·
 * two-column enquiry section (contact details + enquiry form).
 * Everything stays editable in the admin.
 */
export const seedHomepage = async ({ payload, req }: Ctx): Promise<void> => {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
    req,
  })
  const rec = found.docs[0] as { id: number | string; layout?: unknown[] } | undefined
  if (!rec) {
    payload.logger.warn('— Homepage seed: no "home" page found, skipping')
    return
  }
  // Don't clobber a hand-authored homepage (>2 real blocks); only fill the stub.
  if (Array.isArray(rec.layout) && rec.layout.length > 2) {
    payload.logger.info('— Homepage already authored, skipping')
    return
  }

  // ── The 8 medico-legal service cards for the "What We Do" grid ──
  // Reference (index.html) shows exactly 8 icon+title cards, in this order:
  // IME · JME · File Review · Supplementary Report · Teleconference · Expert
  // Evidence · Surrogate Assessment & Interpreter Booking · Brief Reduction & LOI
  // Review. (Excludes Medical Negligence + Educational Services / AAMLE.)
  const serviceSlugs = [
    'independent-medical-examination',
    'joint-medical-examination',
    'file-review',
    'supplementary-report',
    'teleconference-expert-evidence', // rendered as the standalone "Teleconference" card
    'expert-evidence',
    'surrogate-assessment-interpreter-booking',
    'brief-reduction-loi-review',
  ]

  // Create-if-missing / normalise helper so the home grid resolves all 8 cards at
  // seed time. seedDataLayer (which runs BEFORE this module) seeds the *combined*
  // "Teleconference & Expert Evidence" doc and no standalone "Expert Evidence"
  // (that is added later by seedServices, which runs AFTER the homepage). So here
  // we (a) ensure the standalone `expert-evidence` doc exists — mirroring
  // seedServices' definition exactly so it is reused, not duplicated — and
  // (b) normalise the combined doc's title to the reference/author-intended
  // standalone name "Teleconference". Everything stays admin-editable.
  const ensureService = async (
    slug: string,
    createData: Record<string, unknown>,
    normalise: Record<string, unknown> = {},
  ): Promise<void> => {
    const res = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      req,
    })
    const existing = res.docs[0]
    if (!existing) {
      await payload.create({
        collection: 'services',
        data: { slug, ...createData } as never,
        req,
        context: { disableRevalidate: true },
      })
      return
    }
    const current = existing as unknown as Record<string, unknown>
    const drift = Object.entries(normalise).filter(([k, v]) => current[k] !== v)
    if (drift.length > 0) {
      await payload.update({
        collection: 'services',
        id: existing.id,
        data: Object.fromEntries(drift) as never,
        req,
        context: { disableRevalidate: true },
      })
    }
  }

  await ensureService('expert-evidence', {
    title: 'Expert Evidence',
    category: 'medico-legal',
    serviceGroup: 'reporting',
    icon: 'headset',
    shortDescription:
      'Full coordination for specialists providing oral expert evidence in court or tribunal — from report preparation to hearing logistics.',
    order: 31,
  })
  await ensureService('teleconference-expert-evidence', {}, { title: 'Teleconference' })

  // Resolve to service IDs in the exact reference order (independent of each doc's
  // `order` field), dropping any slug that still can't be found.
  const svcRes = await payload.find({
    collection: 'services',
    where: { slug: { in: serviceSlugs } },
    limit: 20,
    depth: 0,
    req,
  })
  const idBySlug = new Map(svcRes.docs.map((d) => [d.slug, d.id]))
  const serviceIds = serviceSlugs
    .map((s) => idBySlug.get(s))
    .filter((id): id is NonNullable<typeof id> => id != null)

  // Make each "What We Do" tile clickable to its canonical destination (there are
  // no standalone /services/<slug> pages — the reference links each card to its
  // parent service page + section anchor). Setting `linkOverride` on the service
  // doc keeps it editable in the admin and is honoured by the grid even with
  // `linkToService` off. Mirrors `.design-reference/index.html` service cards.
  const tileLinkOverrides: Record<string, string> = {
    'independent-medical-examination': '/ime',
    'joint-medical-examination': '/jme',
    'file-review': '/reporting-services#file-review',
    'supplementary-report': '/reporting-services#supplementary-report',
    'teleconference-expert-evidence': '/reporting-services#teleconference',
    'expert-evidence': '/reporting-services#expert-evidence',
    'surrogate-assessment-interpreter-booking': '/admin-services#surrogate-assessment',
    'brief-reduction-loi-review': '/admin-services#brief-reduction',
  }
  for (const [slug, href] of Object.entries(tileLinkOverrides)) {
    const id = idBySlug.get(slug)
    if (!id) continue
    await payload.update({
      collection: 'services',
      id,
      data: { linkOverride: href } as never,
      req,
      context: { disableRevalidate: true },
    })
  }

  // Medico-Legal Services grid: hand-picked (icon + title only). Falls back to the
  // medico-legal category if the service docs aren't seeded yet.
  const servicesGrid =
    serviceIds.length > 0
      ? {
          blockType: 'servicesGrid',
          source: 'manual',
          services: serviceIds,
          columns: '4',
          hideDescription: true,
          linkToService: false,
          footerLinks: [custom('/services', 'View Medico-Legal Services')],
        }
      : {
          blockType: 'servicesGrid',
          source: 'auto',
          category: 'medico-legal',
          columns: '4',
          limit: 8,
          hideDescription: true,
          linkToService: false,
          footerLinks: [custom('/services', 'View Medico-Legal Services')],
        }

  // ── Look up the enquiry form for the bottom contact section ──
  const findForm = async (title: string): Promise<number | string | undefined> => {
    const res = await payload.find({
      collection: 'forms',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      req,
    })
    return res.docs[0]?.id
  }
  const enquiryFormId = (await findForm('Enquiry')) ?? (await findForm('Contact'))

  const hero = {
    type: 'homeHero',
    heading: 'Ensuring [[Accuracy,]] [[Empowering Justice]]',
    subtitle:
      'With a commitment to excellence, accuracy, and timely reporting, we strive to deliver unparalleled service, helping you navigate the complexities of medico-legal matters with the confidence and trust.',
    showShield: true,
    definition: {
      term: 'VERIFY',
      pronunciation: 'verb',
      text: 'to make sure or demonstrate that (something) is true, accurate, or justified',
      definitionStyle: 'glow',
    },
    links: [enquiry('Make an Enquiry'), custom('#services', 'Explore Our Services')],
  }

  // Contact details for the enquiry section (reference-exact copy).
  const contactItems = [
    { icon: 'phone', label: 'Phone', value: '07 3356 0469', href: 'tel:0733560469' },
    {
      icon: 'envelope-simple',
      label: 'Email',
      value: 'admin@vmls.com.au',
      href: 'mailto:admin@vmls.com.au',
    },
    { icon: 'map-pin', label: 'Office', value: 'Level 18, 127 Creek Street, Brisbane QLD 4000' },
    {
      icon: 'clock',
      label: 'Office Hours',
      value: 'Monday – Friday, 08:30 – 17:00',
      note: 'For 7:45am appointments, please be advised that our office is not staffed until 7:30am.',
    },
  ]

  // The enquiry FORM — right-hand card of the two-column enquiry band. FormBlock
  // is now nestable in a Row column, so it renders SIDE-BY-SIDE with the contact
  // info inside one accent band (reference `.contact-grid`), replacing the old
  // stacked "info band, then detached form band" pattern.
  const enquiryFormBlock = enquiryFormId
    ? {
        blockType: 'formBlock',
        form: enquiryFormId,
        enableIntro: true,
        introContent: headingRichText('Send Us Your Enquiry', 'h3'),
        cssClass: ['vf-home-enquiry-formcard'],
      }
    : null

  const layout = [
    // ── Audience gateway (light-grey band) ──
    {
      blockType: 'gatewayCards',
      heading: 'Medico-Legal Support, [[Tailored to You]]',
      background: 'muted',
      columns: '3',
      cards: [
        {
          icon: 'briefcase',
          subtitle: 'Legal Professionals & Case Managers',
          title: 'For Clients',
          description:
            'Refer with confidence. Every report expertly quality-assured before it reaches you.',
          accent: 'blue',
          links: [
            custom('/services', 'Our Services'),
            custom('/specialist-panel', 'Specialist Panel'),
            custom('/about', 'Why Refer to Us'),
            custom('/for-clients#faqs', 'Frequently Asked Questions'),
          ],
          ...custom('/for-clients', 'Learn More'),
        },
        {
          icon: 'user',
          subtitle: 'People Attending an Examination',
          title: 'For Claimants',
          description:
            'Helpful information to prepare you for your appointment and understand what to expect.',
          accent: 'steel',
          links: [
            custom('/for-claimants#process-overview', 'Process Overview'),
            custom('/for-claimants#appointment-guide', 'In-Person Appointment Guide'),
            custom('/for-claimants#video-guide', 'Videolink Appointment Guide'),
            custom('/for-claimants#claimant-faqs', 'Frequently Asked Questions'),
          ],
          ...custom('/for-claimants', 'Learn More'),
        },
        {
          icon: 'stethoscope',
          subtitle: 'Medical Specialists',
          title: 'For Medical Specialists',
          description:
            'Join a panel that values your expertise and supports your professional growth.',
          accent: 'charcoal',
          links: [
            custom('/join-expert-panel', "Join VERIFY's Expert Panel"),
            custom('/join-expert-panel#panel-benefits', 'Working with VERIFY'),
            custom('https://aamle.com.au/', 'AAMLE Education & Training', { newTab: true }),
            custom('/events', 'Upcoming Webinars & Training'),
          ],
          ...custom('/join-expert-panel', 'Join Expert Panel'),
        },
      ],
    },
    // ── Who we are (two-column with image placeholder) ──
    {
      blockType: 'splitFeature',
      background: 'white',
      rows: [
        {
          eyebrow: 'Who We Are',
          title: 'VERIFY [[Medico-Legal]] Solutions',
          imageSide: 'left',
          imagePlaceholder: true,
          placeholderLabel: '[ Company Image Placeholder ]',
          body: plainTextToLexical(
            'VERIFY Medico-Legal Solutions provides independent medico-legal reporting and examination coordination with a focus on accuracy, responsiveness, and clarity. We support legal firms, insurers, and government bodies with reliable reporting services that help complex matters progress with confidence.\n\nFounded by Wes Lerch, who brings more than 25 years of experience in personal injury law and insurance litigation, VERIFY offers a practical understanding of what clients need and what complex matters demand.',
          ),
          ...custom('/about', 'About VERIFY'),
        },
      ],
    },
    // ── What we do (tabbed, light-blue band) ──
    {
      blockType: 'tabs',
      anchorId: 'services',
      eyebrow: 'What We Do',
      heading: 'Comprehensive [[Medico-Legal]] Services',
      subheading:
        'From independent examinations to professional education, VERIFY supports legal, insurance, and medical professionals with trusted medico-legal expertise.',
      background: 'accent',
      tabs: [
        {
          label: 'Medico-Legal Services',
          icon: 'first-aid',
          content: [servicesGrid],
        },
        {
          label: 'Educational Services',
          icon: 'graduation-cap',
          // Reference HOME educational tab (index.html #edu-panel): a "What AAMLE
          // Offers" intro + THREE numbered feature panels + a "Sponsorship
          // Opportunities" soft callout + an "Explore AAMLE" button. Composed from
          // ProcessSteps (auto-numbered 01/02/03 panels) + a one-item FeatureGrid
          // (the soft callout) + a Button, since the aamleEducation block is a
          // fixed two-column wordmark layout that can't express numbered panels.
          content: [
            {
              blockType: 'processSteps',
              variant: 'edu-panels',
              background: 'white',
              eyebrow: 'What AAMLE Offers',
              heading: 'Complimentary Education [[for Industry Professionals]]',
              subheading:
                'In 2025, VERIFY expanded its commitment to education with the creation of the Australian Academy of Medico-Legal Education (AAMLE). Under the banner of AAMLE, VERIFY provides a range of complimentary educational offerings across the medico-legal industry.',
              steps: [
                {
                  icon: 'users',
                  badge: 'Free to Join',
                  title: 'Free Membership & Events',
                  description:
                    'Membership is free and facilitates access to complimentary educational events and resources to support continuous learning and professional development across the medico-legal industry.',
                },
                {
                  icon: 'graduation-cap',
                  badge: 'CPD Eligible',
                  title: 'Non-accredited, CPD-eligible Training',
                  description:
                    'AAMLE provides non-accredited, CPD-eligible training on various medico-legal topics, including:',
                  bullets: [
                    {
                      text: 'Bimonthly webinars featuring insights from guest speakers with extensive medico-legal industry experience',
                    },
                    {
                      text: 'Specialised training tailored to the client, delivered as in-person seminars or webinars including activities and takeaway reference resources',
                    },
                  ],
                },
                {
                  icon: 'book-open',
                  badge: 'AAMLE Exclusive',
                  title: 'Access to Discounted IME Training',
                  description:
                    'AAMLE maintain a training partnership with Brigham and Associates, Inc. (‘Brigham & Associates’)—the unparalleled provider of comprehensive and focused courses on the AMA Guides to the Evaluation of Permanent Impairment (‘the AMA Guides’). Access AAMLE-exclusive discounted training in the AMA Guides, including the Certified Impairment Rater (CIR) Exam.',
                },
              ],
            },
            {
              blockType: 'featureGrid',
              background: 'white',
              columns: '1',
              cardStyle: 'plain',
              cssClass: ['vf-home-edu-sponsor'],
              items: [
                {
                  icon: 'handshake',
                  title: 'Sponsorship Opportunities',
                  description:
                    'Industry partners may sponsor AAMLE educational events and initiatives to support professional development across the medico-legal sector.',
                },
              ],
            },
            {
              blockType: 'button',
              align: 'center',
              cssClass: ['vf-home-edu-cta'],
              links: [custom('https://aamle.com.au/', 'Explore AAMLE', { newTab: true })],
            },
          ],
        },
      ],
    },
    // ── Claims we support (two-column: heading/desc/CTA + arrow checklist) ──
    {
      blockType: 'section',
      background: 'white',
      cssClass: ['vf-home-claims'],
      content: [
        {
          blockType: 'row',
          gap: 'wide',
          alignY: 'top',
          columns: [
            {
              content: [
                {
                  blockType: 'text',
                  richText: plainTextToLexical('Areas of Expertise'),
                  cssClass: ['claims-eyebrow'],
                },
                {
                  blockType: 'heading',
                  text: 'Claims We [[Support]]',
                  level: 'h2',
                  size: 'lg',
                },
                {
                  blockType: 'text',
                  richText: plainTextToLexical(
                    'VERIFY has extensive experience across a wide range of claim types, providing expert medico-legal services to support fair and accurate outcomes.',
                  ),
                },
                {
                  blockType: 'button',
                  links: [custom('/ime#claim-types', 'Learn More')],
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'specialtyGrid',
                  source: 'auto',
                  taxonomy: 'claim-types',
                  variant: 'checklist',
                },
              ],
            },
          ],
        },
      ],
    },
    // ── Featured specialists (carousel, light-grey band) ──
    {
      blockType: 'peopleGrid',
      eyebrow: 'Featured Specialists',
      heading: 'Meet Our [[Expert Panel]]',
      subheading:
        'VERIFY works with a variety of highly skilled medical experts who are well-versed in legal procedures and understand the importance of their role in supporting the justice system.',
      background: 'muted',
      source: 'specialists',
      layout: 'carousel',
      limit: 8,
      linkProfiles: true,
      footerLinks: [
        custom('/specialist-panel', 'View Full Panel'),
        custom('/join-expert-panel', 'Join Expert Panel'),
      ],
    },
    // ── Testimonials (carousel) ──
    {
      blockType: 'testimonialsGrid',
      eyebrow: 'Testimonials',
      heading: 'What Our [[Clients Say]]',
      subheading:
        'Trusted by legal firms, insurers, and medical professionals across Queensland and Australia.',
      source: 'auto',
      layout: 'carousel',
      // Reference carousel shows all 6 testimonials (3 visible at a time).
      limit: 6,
      carouselOptions: { visible: 3, showArrows: true },
    },
    // ── Enquiry section — ONE accent band, two columns (reference `.contact-grid`
    // 1fr 1.4fr): LEFT = left-aligned contact info, RIGHT = the enquiry form card.
    {
      blockType: 'section',
      background: 'accent',
      anchorId: 'contact',
      cssClass: ['vf-home-enquiry'],
      content: [
        {
          blockType: 'row',
          gap: 'wide',
          alignY: 'top',
          cssClass: ['vf-home-enquiry-row'],
          columns: [
            {
              content: [
                {
                  blockType: 'contactDetails',
                  eyebrow: 'Make an Enquiry',
                  heading: 'Request a Booking or Make an Enquiry',
                  subheading:
                    'Have a question or ready to book? Our team is here to help guide you through the medico-legal process with professionalism and care.',
                  useGlobal: false,
                  items: contactItems,
                  cssClass: ['vf-home-enquiry-info'],
                },
              ],
            },
            ...(enquiryFormBlock ? [{ content: [enquiryFormBlock] }] : []),
          ],
        },
      ],
    },
  ]

  await payload.update({
    collection: 'pages',
    id: rec.id,
    data: { hero, layout } as never,
    req,
    context: { disableRevalidate: true },
  })
  payload.logger.info('— Homepage authored')
}
