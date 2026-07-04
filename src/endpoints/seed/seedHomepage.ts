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

/**
 * Authors the homepage (`/`) block layout to match .design-reference/index.html:
 * home hero (+ definition panel) · audience gateway · who-we-are · tabbed
 * "What We Do" (medico-legal services + AAMLE education) · claims checklist ·
 * featured-specialists carousel · testimonials carousel · closing CTA band.
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

  const layout = [
    // ── Audience gateway ──
    {
      blockType: 'gatewayCards',
      heading: 'Medico-Legal Support, [[Tailored to You]]',
      background: 'white',
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
            custom('/for-clients', 'Frequently Asked Questions'),
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
            custom('/for-claimants#in-person-appointment', 'In-Person Appointment Guide'),
            custom('/for-claimants#videolink-appointment', 'Videolink Appointment Guide'),
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
    // ── Who we are ──
    {
      blockType: 'splitFeature',
      rows: [
        {
          eyebrow: 'Who We Are',
          title: 'VERIFY [[Medico-Legal]] Solutions',
          imageSide: 'left',
          body: plainTextToLexical(
            'VERIFY Medico-Legal Solutions provides independent medico-legal reporting and examination coordination with a focus on accuracy, responsiveness, and clarity. We support legal firms, insurers, and government bodies with reliable reporting services that help complex matters progress with confidence.\n\nFounded by Wes Lerch, who brings more than 25 years of experience in personal injury law and insurance litigation, VERIFY offers a practical understanding of what clients need and what complex matters demand.',
          ),
          ...custom('/about', 'About VERIFY'),
        },
      ],
    },
    // ── What we do (tabbed) ──
    {
      blockType: 'tabs',
      eyebrow: 'What We Do',
      heading: 'Comprehensive [[Medico-Legal]] Services',
      subheading:
        'From independent examinations to professional education, VERIFY supports legal, insurance, and medical professionals with trusted medico-legal expertise.',
      tabs: [
        {
          label: 'Medico-Legal Services',
          icon: 'first-aid',
          content: [{ blockType: 'servicesGrid', source: 'auto', columns: '4', linkToService: true }],
        },
        {
          label: 'Educational Services',
          icon: 'graduation-cap',
          content: [
            {
              blockType: 'aamleEducation',
              link: {
                type: 'custom',
                url: 'https://aamle.com.au/',
                label: 'Explore AAMLE',
                newTab: true,
              },
            },
          ],
        },
      ],
    },
    // ── Claims we support (arrow checklist) ──
    {
      blockType: 'specialtyGrid',
      eyebrow: 'Areas of Expertise',
      heading: 'Claims We [[Support]]',
      subheading:
        'VERIFY has extensive experience across a wide range of claim types, providing expert medico-legal services to support fair and accurate outcomes.',
      background: 'white',
      source: 'auto',
      taxonomy: 'claim-types',
      variant: 'checklist',
    },
    // ── Featured specialists (carousel) ──
    {
      blockType: 'peopleGrid',
      eyebrow: 'Featured Specialists',
      heading: 'Meet Our [[Expert Panel]]',
      subheading:
        'VERIFY works with a variety of highly skilled medical experts who are well-versed in legal procedures and understand the importance of their role in supporting the justice system.',
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
      carouselOptions: { visible: 3, showArrows: true },
    },
    // ── Closing CTA ──
    {
      blockType: 'ctaBand',
      eyebrow: 'Get Started',
      heading: 'Request a Booking or [[Make an Enquiry]]',
      text: 'Have a question or ready to book? Our team is here to help guide you through the medico-legal process with professionalism and care.',
      links: [enquiry('Make an Enquiry'), custom('/contact', 'Contact Us')],
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
