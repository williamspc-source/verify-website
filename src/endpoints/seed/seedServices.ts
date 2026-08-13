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

// The shared bottom CTA used across every services page (design reference:
// every services/**/*.html closes with the identical `.svc-cta` band).
const closingCta = () => ({
  blockType: 'ctaBand',
  eyebrow: 'Get Started',
  heading: 'Ready to Refer Your [[Next Matter to VERIFY?]]',
  text: 'Whether you have a specific referral or need guidance on the most suitable service, we are here to make the process simple, efficient, and responsive from the very start.',
  links: [enquiry('Make an Enquiry'), custom('/specialists/specialist-panel', 'View Specialist Panel')],
})

async function authorPage(
  { payload, req }: Ctx,
  slug: string,
  hero: Record<string, unknown>,
  layout: unknown[],
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
    data: { hero, layout } as never,
    req,
    context: { disableRevalidate: true },
  })
  payload.logger.info(`— Authored /${slug}`)
}

/**
 * Authors the Services group of pages to match .design-reference/services/*.
 *
 *  · /services                 — services landing (IME/JME split, reporting +
 *                                administrative feature grids, AAMLE education, CTA)
 *  · /medico-legal/ime         — Independent Medical Examination
 *  · /medico-legal/jme         — Joint Medical Examination
 *  · /medico-legal/reporting-services — File Review, Supplementary, etc.
 *  · /medico-legal/admin-services     — Surrogate, Brief Reduction, etc.
 *  · /medico-legal             — Medico-Legal Services parent stub
 *  · /educational-services     — Educational Services parent stub
 *
 * Everything stays editable in the admin.
 */
export const seedServices = async (ctx: Ctx): Promise<void> => {
  const { payload, req } = ctx

  // ══════════════════════════════════════════════════════════════════════
  // GRANULAR SERVICE DOCS (idempotent)
  // ----------------------------------------------------------------------
  // The Services-landing "Reports & Opinions" grid and the Admin-services
  // page cards are driven by the ServicesGrid block (source: manual), so the
  // reference cards must exist as Service docs. We upsert the reporting +
  // administrative services here (enriching the three that already exist and
  // creating the rest). Copy + icons are ported verbatim from the reference.
  // ══════════════════════════════════════════════════════════════════════
  const ensureService = async (data: Record<string, unknown>): Promise<number | string> => {
    const found = await payload.find({
      collection: 'services',
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
      req,
    })
    if (found.docs[0]) {
      await payload.update({
        collection: 'services',
        id: found.docs[0].id,
        data: data as never,
        req,
        context: { disableRevalidate: true },
      })
      return found.docs[0].id
    }
    const created = await payload.create({
      collection: 'services',
      data: data as never,
      req,
      context: { disableRevalidate: true },
    })
    return created.id
  }

  // ── Reporting services (Medico-Legal · Reporting) ──
  const fileReviewId = await ensureService({
    slug: 'file-review',
    title: 'File Review',
    category: 'medico-legal',
    serviceGroup: 'reporting',
    icon: 'clipboard-text',
    shortDescription:
      "A specialist reviews the claimant's medical records without a physical examination — ideal where attendance is not possible or a paper-based opinion is sufficient.",
    order: 3,
  })
  const supplementaryId = await ensureService({
    slug: 'supplementary-report',
    title: 'Supplementary Report',
    category: 'medico-legal',
    serviceGroup: 'reporting',
    icon: 'file-plus',
    shortDescription:
      'Additional specialist opinions addressing new records or questions that arise after an initial report has been delivered.',
    order: 4,
  })
  const negligenceId = await ensureService({
    slug: 'medical-negligence',
    title: 'Medical Negligence',
    category: 'medico-legal',
    serviceGroup: 'reporting',
    icon: 'shield-check',
    shortDescription:
      'Expert opinions on whether the applicable standard of care was met — prepared to withstand scrutiny in court or tribunal.',
    order: 5,
  })
  // Repurpose the previously-combined "Teleconference & Expert Evidence" doc as
  // the standalone Teleconference service (the reference lists them separately).
  const teleconferenceId = await ensureService({
    slug: 'teleconference-expert-evidence',
    title: 'Teleconference',
    category: 'medico-legal',
    serviceGroup: 'reporting',
    icon: 'phone',
    shortDescription:
      'Facilitated expert sessions for matters requiring specialist input without a formal written report.',
    order: 6,
  })
  const expertEvidenceId = await ensureService({
    slug: 'expert-evidence',
    title: 'Expert Evidence',
    category: 'medico-legal',
    serviceGroup: 'reporting',
    icon: 'gavel',
    shortDescription:
      'Full coordination for specialists providing oral expert evidence in court or tribunal — from report preparation to hearing logistics.',
    order: 31,
  })

  // ── Administrative services ──
  // shortDescription = the punchy Services-landing card copy; body = the formal
  // Administrative-Services-page accordion copy (both ported from the reference).
  const surrogateId = await ensureService({
    slug: 'surrogate-assessment',
    title: 'Surrogate Assessment Service',
    category: 'administrative',
    serviceGroup: 'administrative',
    icon: 'user-plus',
    shortDescription:
      "Distance or mobility shouldn't delay your matter. We arrange a qualified surrogate so the physical assessment proceeds — and your report stays on track.",
    body: plainTextToLexical(
      "Where a physical examination is clinically necessary but the claimant cannot travel to the specialist's rooms, VERIFY engages an allied health professional to attend the claimant's location and conduct the physical examination under the real-time direction of the specialist via secure videolink — maintaining full clinical accuracy while removing geographic barriers.",
    ),
    order: 32,
  })
  const interpreterId = await ensureService({
    slug: 'interpreter-booking',
    title: 'Interpreter Booking Service',
    category: 'administrative',
    serviceGroup: 'administrative',
    icon: 'chat-circle-text',
    shortDescription:
      'Ensure nothing is lost in translation. We source and manage NAATI-certified interpreters so every claimant is heard clearly and your specialist gets the full picture.',
    body: plainTextToLexical(
      'Where a claimant requires language assistance, VERIFY arranges an accredited, NAATI-certified interpreter to attend the assessment — either in person or via videolink. VERIFY manages the booking, briefing, and all logistics, with interpreter attendance confirmed as part of the standard appointment notice.',
    ),
    order: 33,
  })
  const briefReductionId = await ensureService({
    slug: 'brief-reduction',
    title: 'Brief Reduction Service',
    category: 'administrative',
    serviceGroup: 'administrative',
    icon: 'file-text',
    shortDescription:
      'A sharper brief means a sharper report. We distil voluminous records into a focused clinical summary — so your specialist spends time opining, not reading.',
    body: plainTextToLexical(
      'Legal briefs submitted to specialists often span hundreds of pages. VERIFY condenses these materials into a focused, clinician-ready document — presenting only the most relevant information in a clear, structured format to increase review efficiency and contribute to a more accurate clinical opinion.',
    ),
    order: 34,
  })
  const loiReviewId = await ensureService({
    slug: 'letter-of-instruction-review',
    title: 'Letter of Instruction Review',
    category: 'administrative',
    serviceGroup: 'administrative',
    icon: 'files',
    shortDescription:
      'We review the questions posed and the authority to act before a brief goes out — and, where a firm would like it, work with them to develop and flesh out their instruction templates so every referral starts on the right footing.',
    body: plainTextToLexical(
      'VERIFY reviews letters of instruction before they are issued to specialists, checking that referral questions are clear, relevant records are identified, and the brief supports an accurate medico-legal opinion — reducing ambiguity, delays, and unnecessary follow-up.',
    ),
    order: 35,
  })

  const reportingServices = [fileReviewId, supplementaryId, negligenceId, teleconferenceId, expertEvidenceId]
  // Landing-grid order: Surrogate · Interpreter · Brief Reduction · LOI (single row of four).
  const adminServicesRow = [surrogateId, interpreterId, briefReductionId, loiReviewId]
  // Accordion column order: col 1 = Surrogate + Brief Reduction, col 2 = Interpreter + LOI
  // (the block splits the array in half into two columns → matches the reference layout).
  const adminServicesAccordion = [surrogateId, briefReductionId, interpreterId, loiReviewId]

  // ══════════════════════════════════════════════════════════════════════
  // SERVICES LANDING
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'services',
    {
      type: 'pageHero',
      theme: 'dark',
      align: 'center',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Medico-Legal Services Built on [[Precision & Trust]]',
      subtitle:
        'From independent medical examinations to expert evidence coordination and industry education — VERIFY delivers every service with the rigour, accuracy, and professional care that legal and insurance matters demand.',
    },
    [
      // ── IME + JME: two alternating image/text rows, plain "Learn more →" links ──
      {
        blockType: 'splitFeature',
        background: 'white',
        cssClass: ['svc-learn-rows'],
        rows: [
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'left',
            icon: 'activity',
            title: 'Independent Medical Examinations',
            body: plainTextToLexical(
              'Impartial assessments delivered nationally by accredited specialists, supported by full end-to-end coordination and a mandatory quality assurance review on every report.',
            ),
            ...custom('/services/medico-legal/ime', 'Learn more →'),
          },
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'right',
            title: 'Joint Medical Examinations',
            body: plainTextToLexical(
              'A single specialist agreed upon by both parties — delivering a shared, independent medical opinion that reduces duplication, cost, and resolution time across WorkCover, CTP, and TPD matters.',
            ),
            ...custom('/services/medico-legal/jme', 'Learn more →'),
          },
        ],
      },
      // ── Reporting services grid (Enquire → links) — reference `.reporting-header`
      //    is left-aligned (svc-reporting overrides the block's centred header) ──
      {
        blockType: 'servicesGrid',
        eyebrow: 'Other Reporting Services',
        heading: 'Medico-Legal [[Reports & Opinions]]',
        background: 'muted',
        cssClass: ['svc-reporting'],
        source: 'manual',
        services: reportingServices,
        columns: '3',
        showEnquire: true,
      },
      // ── Administrative services grid (dark band, Enquire → links) — reference
      //    `.admin-header` is a split row: eyebrow+heading bottom-left, subtitle
      //    bottom-right (svc-admin-split) ──
      {
        blockType: 'servicesGrid',
        eyebrow: 'Administrative Services',
        heading: 'Coordinated Support for [[Every Matter]]',
        subheading:
          'Behind every strong report is a well-run examination. Our administrative services handle the details that make the difference.',
        background: 'primary',
        cssClass: ['svc-glow-band', 'svc-admin-split'],
        source: 'manual',
        services: adminServicesRow,
        columns: '4',
        showEnquire: true,
      },
      // ── AAMLE education — reference `.aamle-section` is a full-bleed, edge-to-edge
      //    two-column band with square corners (containerWidth full + aamle-full) ──
      {
        blockType: 'aamleEducation',
        background: 'white',
        containerWidth: 'full',
        cssClass: ['aamle-full'],
        eyebrow: 'Educational Services',
        wordmark: 'AAMLE',
        subheading: 'Australian Academy of Medico-Legal Education',
        badge: { icon: 'graduation-cap', text: 'CPD-Eligible Programs' },
        description: plainTextToLexical(
          "AAMLE is VERIFY's educational arm — delivering complimentary, CPD-eligible programs to legal, medical, and insurance professionals across Australia, at no cost to participants.",
        ),
        items: [
          { icon: 'video-camera', label: 'CPD-Eligible Webinars' },
          { icon: 'graduation-cap', label: 'Specialist Training Events' },
          { icon: 'book-open', label: 'Discounted AMA Guides Access' },
          { icon: 'globe', label: 'Open to All — Nationally' },
        ],
        imagePlaceholder: true,
        placeholderLabel: 'Image Placeholder',
        ...custom('https://aamle.com.au/', 'Explore AAMLE', { newTab: true }),
      },
      // ── Closing CTA ──
      closingCta(),
    ],
  )

  // ══════════════════════════════════════════════════════════════════════
  // IME
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'ime',
    {
      type: 'pageHero',
      theme: 'service',
      align: 'left',
      showBreadcrumb: true,
      // Reference `.ime-hero` has no shield graphic — just breadcrumb + heading.
      showShield: false,
      heading: 'Independent Medical [[Examination (IME)]]',
    },
    [
      // ── What is an IME (image left + intro) ──
      {
        blockType: 'splitFeature',
        background: 'white',
        cssClass: ['vf-ime-what'],
        rows: [
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'left',
            eyebrow: 'What is an IME?',
            title: 'An Expert Medical Opinion, [[Independent of All Parties]]',
            body: plainTextToLexical(
              "An Independent Medical Examination (IME) is a formal medico-legal assessment conducted by an accredited specialist who has no treating relationship with the claimant. The specialist provides an objective, evidence-based opinion on the claimant's injuries or medical condition.\n\nVERIFY manages every aspect of the IME process — from specialist selection and appointment scheduling through to report delivery and quality assurance — so your matter progresses without delay.",
            ),
          },
        ],
      },
      // ── The 3 key points as icon-led rows with a BOLD heading + description
      //    (reference `.ime-what-point`). SplitFeature bullets are single-line
      //    only, so the points live in a FeatureGrid (icon + title + description). ──
      {
        blockType: 'featureGrid',
        background: 'white',
        columns: '3',
        cardStyle: 'plain',
        hoverEffect: 'none',
        cssClass: ['ime-what-points'],
        items: [
          {
            icon: 'heartbeat',
            title: 'Injury Stability & Permanence',
            description:
              'Assessment of whether the injury is stable, stationary, or likely to improve, and the degree of any permanent impairment.',
          },
          {
            icon: 'users',
            title: 'Work Capacity & Functional Impact',
            description:
              "Expert opinion on how the injury affects the claimant's ability to work and carry out daily activities.",
          },
          {
            icon: 'shield-check',
            title: 'Causation & Treatment Needs',
            description:
              'Impartial opinion on the cause of the injury and any recommended treatment, rehabilitation, or further investigation.',
          },
        ],
      },
      // ── Claim types accordion (first item open) ──
      {
        blockType: 'faq',
        anchorId: 'claim-types',
        eyebrow: 'Areas of Expertise',
        heading: 'IMEs Across All [[Major Claim Types]]',
        subheading:
          'VERIFY provides independent medical examinations across a broad range of personal injury, occupational, and disability claim categories.',
        columns: '1',
        exclusive: true,
        openFirst: true,
        cssClass: ['ime-claim-faq'],
        items: [
          {
            icon: 'shield',
            question: 'Motor Vehicle Accident / Compulsory Third-Party Insurance',
            answer: plainTextToLexical(
              "IMEs for road traffic injury claims under Queensland's CTP scheme, addressing physical and psychological injuries, causation, and long-term prognosis.",
            ),
          },
          {
            icon: 'briefcase',
            question: "Workers' Compensation",
            answer: plainTextToLexical(
              'Independent assessments for workplace injury claims covering degree of impairment, work capacity, treatment needs, and fitness for return to work.',
            ),
          },
          {
            icon: 'users-three',
            question: 'Public Liability',
            answer: plainTextToLexical(
              'Expert medical opinions for injury claims arising from incidents on public or private property, supporting both liability and quantum assessments.',
            ),
          },
          {
            icon: 'book-open',
            question: 'Historical or Institutional Abuse',
            answer: plainTextToLexical(
              'Specialist psychiatric and psychological assessments for claimants in matters involving historical or institutional trauma, with sensitivity to complex presentations.',
            ),
          },
          {
            icon: 'wind',
            question: 'Dust Diseases',
            answer: plainTextToLexical(
              'Medical examinations for occupational lung disease claims including asbestosis, mesothelioma, and silicosis, conducted by respiratory and occupational medicine specialists.',
            ),
          },
          {
            icon: 'user',
            question: 'National Disability Insurance Scheme (NDIS)',
            answer: plainTextToLexical(
              'Functional capacity and diagnostic assessments supporting NDIS access requests, plan reviews, and eligibility determinations across a range of disability types.',
            ),
          },
          {
            icon: 'wheelchair',
            question: 'Total & Permanent Disability (TPD)',
            answer: plainTextToLexical(
              'Expert medical opinions on whether a claimant satisfies the TPD definition under their life or income protection insurance policy, based on current functional capacity.',
            ),
          },
          {
            icon: 'shield-check',
            question: 'Medical Negligence',
            answer: plainTextToLexical(
              'Independent expert opinions on breach of duty, causation, and the extent of harm in medical negligence proceedings, drawn from our specialist panel.',
            ),
          },
          {
            icon: 'user-check',
            question: 'Fitness for Work Assessment',
            answer: plainTextToLexical(
              "Independent evaluations of a worker's capacity to safely perform specific duties, tasks, or hours — supporting employers, insurers, and return-to-work coordinators.",
            ),
          },
        ],
      },
      // ── Assessment formats (2 × 2 grid) — reference `.ime-format-card`: the
      //    format NAME is blue and " Assessment" dark; header left-aligned ──
      {
        blockType: 'featureGrid',
        eyebrow: 'Assessment Formats',
        heading: 'Four Ways to Attend [[Your IME]]',
        subheading:
          'VERIFY offers flexible assessment formats to accommodate varying clinical needs, geographic constraints, and personal circumstances — while always maintaining the integrity of the examination.',
        background: 'white',
        columns: '2',
        cssClass: ['ime-formats'],
        items: [
          {
            icon: 'user',
            title: 'In-Person',
            titleSuffix: 'Assessment',
            description:
              "An independent medico-legal examination conducted at the specialist's consulting rooms. The specialist provides an impartial medical opinion on the claimant's injuries or condition — evaluating stability, permanence, and impact on work capacity.",
            detailsLabel: "What's Included",
            details: [
              {
                icon: 'user',
                title: 'Face-to-Face Examination',
                description:
                  'Direct physical examination conducted by the specialist at their consulting rooms or a designated venue',
              },
              {
                icon: 'file-text',
                title: 'Full Clinical Assessment',
                description:
                  "Comprehensive review of the claimant's medical history, current condition, and all relevant documentation",
              },
              {
                icon: 'check-circle',
                title: 'All Specialties',
                description: 'Available across all medical specialties on the VERIFY panel',
              },
            ],
          },
          {
            icon: 'video-camera',
            title: 'Videolink',
            titleSuffix: 'Assessment',
            description:
              "Available where the claimant is unable to attend the specialist's rooms in person. The examination is conducted remotely via secure videolink, allowing the specialist to provide a full clinical opinion without requiring physical attendance.",
            detailsLabel: "What's Included",
            details: [
              {
                icon: 'desktop',
                title: 'Device Requirements',
                description: 'A computer or tablet with a functioning camera and microphone',
              },
              {
                icon: 'cell-signal-full',
                title: 'Reliable Connection',
                description: 'A reliable, stable internet connection for the duration of the assessment',
              },
              {
                icon: 'house',
                title: 'Private Environment',
                description: 'A private, quiet space for the full duration of the assessment',
              },
            ],
          },
          {
            icon: 'users-three',
            title: 'Surrogate',
            titleSuffix: 'Assessment',
            description:
              'Where in-person attendance is not feasible but a physical examination is clinically necessary, a trained allied health professional conducts the examination locally under real-time specialist direction via videolink — maintaining clinical rigour while expanding access for regional claimants. Available for Orthopaedic Surgeons and Occupational Therapists only.',
            detailsLabel: "What's Included",
            details: [
              {
                icon: 'users-three',
                title: 'Local Examiner',
                description:
                  'An allied health professional (typically a physiotherapist) conducts the physical examination locally on your behalf',
              },
              {
                icon: 'video-camera',
                title: 'Real-Time Direction',
                description: 'The specialist guides the physical examination remotely via videolink in real time',
              },
              {
                icon: 'check-circle',
                title: 'Specialty Availability',
                description: 'Available for IMEs with Orthopaedic Surgeons and Occupational Therapists only',
              },
            ],
          },
          {
            icon: 'house',
            title: 'Home Visit',
            titleSuffix: 'Assessment',
            description:
              'Assessing the claimant in their own home or care facility enables a comprehensive evaluation of their current condition, daily challenges, functional capacity, and living environment — allowing for more thorough recommendations regarding home modifications and ongoing support needs. Available for Occupational Therapists only.',
            detailsLabel: "What's Included",
            details: [
              {
                icon: 'user',
                title: 'At Home or in Care',
                description:
                  "Conducted at the claimant's own home or care facility for a familiar, comfortable environment",
              },
              {
                icon: 'file-text',
                title: 'Holistic Assessment',
                description:
                  'Detailed evaluation of condition, functional capacity, daily challenges, and goals within the actual living environment',
              },
              {
                icon: 'clock',
                title: 'Availability & Requirements',
                description:
                  'Available for IMEs with Occupational Therapists only; suitable environment required for assessment',
              },
            ],
          },
        ],
      },
      // ── The IME process: two side-by-side pathway cards (4 steps each) ──
      {
        blockType: 'audiencePathways',
        eyebrow: 'The IME Process',
        heading: "Whether You're a [[Client or a Claimant]]",
        subheading:
          "We've outlined the IME process from two perspectives — for the legal and insurance professionals who refer matters, and for the claimants attending the assessment.",
        background: 'muted',
        pathways: [
          {
            variant: 'client',
            eyebrow: 'For Clients',
            title: 'How the IME Process Works for Clients',
            description:
              'A step-by-step guide to referring a matter, managing the process, and receiving your report through VERIFY.',
            steps: [
              {
                title: 'Submit Your Referral',
                description:
                  "Lodge your referral via VERIFY's booking portal with the claimant's details and any relevant documentation.",
              },
              {
                title: 'Specialist Allocation',
                description:
                  'VERIFY matches your matter to an appropriate accredited specialist based on claim type, specialty, and availability.',
              },
              {
                title: 'Appointment Coordination',
                description:
                  'VERIFY manages all scheduling, claimant communication, interpreter bookings, and any administrative requirements.',
              },
              {
                title: 'QA Review & Report Delivery',
                description:
                  "The finalised report passes through VERIFY's Quality Assurance review before being delivered to your office.",
              },
            ],
            ...custom('/information-centre/for-clients', 'View Client Process'),
          },
          {
            variant: 'claimant',
            eyebrow: 'For Claimants',
            title: 'What to Expect at Your IME Assessment',
            description:
              'Understand what happens at your appointment and how to prepare so your assessment runs smoothly.',
            steps: [
              {
                title: "You'll Receive an Appointment Letter",
                description:
                  "VERIFY will send you a confirmation letter with the date, time, location, and specialist's details.",
              },
              {
                title: 'Bring Relevant Documentation',
                description:
                  'Bring any medical records, imaging, or correspondence relevant to your injury that you have in your possession.',
              },
              {
                title: 'The Assessment',
                description:
                  'The specialist will review your history, ask questions about your injury and its impact, and may conduct a physical examination.',
              },
              {
                title: 'After Your Assessment',
                description:
                  'The specialist prepares a report for the referring party. VERIFY does not share the report directly with claimants.',
              },
            ],
            ...custom('/information-centre/for-claimants', 'View Claimant Guide'),
          },
        ],
      },
      // ── Closing CTA ──
      closingCta(),
    ],
  )

  // ══════════════════════════════════════════════════════════════════════
  // JME
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'jme',
    {
      type: 'pageHero',
      theme: 'service',
      align: 'left',
      showBreadcrumb: true,
      // Reference `.jme-hero` has no shield graphic — just breadcrumb + heading.
      showShield: false,
      heading: 'Joint Medical [[Examination (JME)]]',
    },
    [
      // ── What is a JME (image right + intro) ──
      {
        blockType: 'splitFeature',
        background: 'white',
        cssClass: ['vf-ime-what'],
        rows: [
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'right',
            eyebrow: 'What is a JME?',
            title: 'One Specialist. [[Jointly Instructed by Both Parties.]]',
            body: plainTextToLexical(
              'A Joint Medical Examination (JME) — also referred to as a Joint Independent Medical Examination (JIME) — is a medico-legal assessment where one independent specialist is engaged and instructed together by both the plaintiff and defendant (or their legal representatives).\n\nRather than each side commissioning their own report, both parties agree on a single specialist, who then assesses the claimant and provides one shared report. This approach eliminates duplicated assessments, conflicting opinions, and unnecessary cost.',
            ),
          },
        ],
      },
      // ── The 3 key points as icon-led rows with a BOLD heading + description
      //    (reference `.jme-what-point`), rendered via a FeatureGrid so each point
      //    shows a bold heading and a separate description (SplitFeature bullets
      //    are single-line only). ──
      {
        blockType: 'featureGrid',
        background: 'white',
        columns: '3',
        cardStyle: 'plain',
        hoverEffect: 'none',
        cssClass: ['jme-what-points'],
        items: [
          {
            icon: 'shield-check',
            title: 'Jointly Instructed & Mutually Agreed',
            description:
              'Both parties agree on the specialist and the letter of instruction before the assessment proceeds.',
          },
          {
            icon: 'info',
            title: 'One Report, Shared by All',
            description:
              "The specialist's report is provided simultaneously to both parties — transparent, consistent, and binding in nature.",
          },
          {
            icon: 'currency-dollar',
            title: 'Lower Cost & Fewer Delays',
            description:
              'Reduces the number of assessments the claimant must attend and lowers the overall costs incurred by both parties.',
          },
        ],
      },
      // ── Why choose a JME ──
      {
        blockType: 'featureGrid',
        eyebrow: 'Why Choose a JME',
        heading: 'The Benefits of a [[Joint Approach]]',
        subheading:
          'A JME is not always the right choice for every matter — but where it is appropriate, the advantages for both parties are significant.',
        background: 'accent',
        columns: '3',
        cssClass: ['jme-benefits'],
        items: [
          {
            icon: 'currency-dollar',
            title: 'Reduced Costs for Both Parties',
            description:
              'A single specialist fee rather than two separate IME fees — directly lowering the overall costs associated with the claim.',
          },
          {
            icon: 'clock',
            title: 'Faster Resolution',
            description:
              'Eliminating the need to schedule and attend multiple assessments across both sides accelerates the overall claims timeline.',
          },
          {
            icon: 'users-three',
            title: 'Less Burden on the Claimant',
            description:
              'The claimant attends one assessment instead of potentially two or more, reducing inconvenience and stress throughout the process.',
          },
          {
            icon: 'shield',
            title: 'Unimpeachable Impartiality',
            description:
              'A jointly-instructed specialist cannot be characterised as biased toward either party, strengthening the credibility of the opinion in proceedings.',
          },
          {
            icon: 'file-text',
            title: 'No Conflicting Reports',
            description:
              'One report means no duelling expert opinions — which can simplify settlement negotiations and reduce time spent in dispute.',
          },
          {
            icon: 'list',
            title: 'Streamlined Court Preparation',
            description:
              'Courts and tribunals often look favourably on matters where parties have agreed to a joint expert, as it demonstrates cooperation and proportionality.',
          },
        ],
      },
      // ── Featured specialists carousel (dark band) ──
      {
        blockType: 'peopleGrid',
        eyebrow: 'Our Specialist Panel',
        heading: 'Specialists Who Conduct JME Assessments',
        subheading:
          "VERIFY's panel includes accredited specialists across a broad range of medical disciplines experienced in jointly-instructed assessments.",
        background: 'primary',
        cssClass: ['svc-glow-band'],
        source: 'specialists',
        layout: 'carousel',
        limit: 10,
        linkProfiles: true,
        carouselOptions: { speed: 34, direction: 'left', showArrows: true },
        footerLinks: [
          custom('/specialists/specialist-panel', 'View Full Panel'),
          enquiry('Make an Enquiry'),
        ],
      },
      // ── The JME process ──
      {
        blockType: 'processSteps',
        eyebrow: 'How It Works',
        heading: 'The JME Process, [[Step by Step]]',
        subheading:
          'VERIFY manages the entire JME process from initial agreement through to report delivery — keeping both parties informed at every stage.',
        background: 'muted',
        columns: '5',
        steps: [
          {
            title: 'Joint Agreement',
            description:
              plainTextToLexical('Both parties agree to engage a single specialist and submit a joint letter of instruction to VERIFY.'),
          },
          {
            title: 'Specialist Selection',
            description:
              plainTextToLexical('VERIFY presents suitable specialists for consideration. Both parties confirm their agreed choice.'),
          },
          {
            title: 'Brief & Scheduling',
            description:
              plainTextToLexical('VERIFY coordinates the brief, manages all scheduling, and handles claimant communication and logistics.'),
          },
          {
            title: 'Assessment',
            description: plainTextToLexical('The jointly-instructed specialist conducts the examination and prepares their report.'),
          },
          {
            title: 'QA & Delivery',
            description:
              plainTextToLexical("VERIFY's QA team reviews the report before it is simultaneously released to both parties."),
          },
        ],
      },
      // ── FAQ — reference `.jme-faq-inner` is a two-column grid: a left heading
      //    column (380px, left-aligned) beside the accordion (jme-faq-aside) ──
      {
        blockType: 'faq',
        eyebrow: 'Frequently Asked Questions',
        heading: 'Common Questions [[About JMEs]]',
        subheading:
          'Here are the questions we hear most often from legal professionals and insurers considering a JME for their matter.',
        columns: '1',
        exclusive: true,
        openFirst: true,
        cssClass: ['jme-faq-aside'],
        items: [
          {
            question: "Does both parties' consent mean the specialist is jointly instructed?",
            answer: plainTextToLexical(
              'Yes. A JME requires both parties — typically through their legal representatives — to jointly agree on the specialist and submit a shared letter of instruction. The specialist then receives direction from both sides equally and reports to both simultaneously. VERIFY facilitates this entire process.',
            ),
          },
          {
            question: 'Can either party request their own IME after receiving the JME report?',
            answer: plainTextToLexical(
              'Generally, once parties have agreed to a joint expert and received the report, seeking a further independent opinion can be difficult to justify — particularly if the matter is before a court. Any decision to seek a further IME after a JME should be made on legal advice. VERIFY can assist with either pathway.',
            ),
          },
          {
            question: 'Who pays for the JME?',
            answer: plainTextToLexical(
              'This is a matter for the parties to agree upon before engaging VERIFY. Common arrangements include splitting the fee equally, one party bearing the cost, or the cost being apportioned as part of a broader costs agreement. VERIFY will invoice the agreed party or parties as instructed.',
            ),
          },
          {
            question: "What happens if the parties can't agree on a specialist?",
            answer: plainTextToLexical(
              'VERIFY can present a shortlist of suitable specialists for both parties to consider. If agreement on a specific specialist cannot be reached, we can assist by providing additional options or discussing alternative approaches — including whether separate IMEs may be more appropriate in the circumstances.',
            ),
          },
          {
            question: 'Is the JME report binding on both parties?',
            answer: plainTextToLexical(
              'The JME report is provided to both parties equally and may carry significant weight in proceedings. Whether it is formally binding depends on the jurisdiction, the terms of any agreement between the parties, and any court or tribunal orders in place. Legal advice should be sought on the effect of the report in your specific matter.',
            ),
          },
        ],
      },
      // ── Closing CTA (standardised) ──
      closingCta(),
    ],
  )

  // ══════════════════════════════════════════════════════════════════════
  // REPORTING SERVICES
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'reporting-services',
    {
      type: 'pageHero',
      theme: 'service',
      align: 'left',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Specialist Reporting [[Beyond the Examination]]',
    },
    [
      // ── Five alternating service rows (plain service-name headings, dot bullets, no buttons) ──
      {
        blockType: 'splitFeature',
        eyebrow: 'Our Services',
        heading: 'Five Ways to Get [[the Specialist Opinion You Need]]',
        subheading:
          'VERIFY offers a full spectrum of specialist reporting options — each designed to support your matter at the right stage, with the right level of clinical input.',
        background: 'white',
        cssClass: ['rs-services'],
        rows: [
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'left',
            anchorId: 'file-review',
            title: 'File Review',
            body: plainTextToLexical(
              'A specialist reviews the available medical records, imaging, and documentation and provides a written or verbal opinion on the clinical issues in dispute — without directly examining the claimant.',
            ),
            bulletsLabel: 'When to Request',
            bullets: [
              { text: 'The claimant is unwilling or unable to attend an examination' },
              { text: 'The claimant is overseas, incapacitated, or deceased' },
              { text: 'A preliminary opinion on available file materials is needed' },
              { text: 'To assess consistency across existing medical evidence' },
            ],
          },
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'right',
            anchorId: 'supplementary-report',
            title: 'Supplementary Report',
            body: plainTextToLexical(
              'A follow-up to an existing specialist report, addressing additional documents or materials received after the original report was finalised. May require a further examination if the new material is clinically significant.',
            ),
            bulletsLabel: 'When to Request',
            bullets: [
              { text: 'New medical evidence becomes available after the initial report' },
              { text: "A claimant's condition has changed since the original assessment" },
              { text: 'Additional questions arise not addressed in the original report' },
              { text: 'To respond to a report obtained by the opposing party' },
            ],
          },
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'left',
            anchorId: 'medical-negligence',
            title: 'Medical Negligence',
            body: plainTextToLexical(
              "A specialist with expertise in the relevant field provides an independent opinion on whether medical treatment fell below the accepted standard of care, and whether any such departure caused the claimant's injury or loss.",
            ),
            bulletsLabel: 'When to Request',
            bullets: [
              { text: 'Medical malpractice or clinical negligence claims' },
              { text: 'Healthcare provider liability matters' },
              { text: 'Cases requiring a specialist opinion on standard of care' },
              { text: 'Matters involving alleged procedural or diagnostic errors' },
            ],
          },
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'right',
            anchorId: 'teleconference',
            title: 'Teleconference',
            body: plainTextToLexical(
              'A direct discussion between the specialist and instructing lawyers — by telephone or secure videolink — to seek preliminary clinical opinions, clarify findings from an existing report, or obtain specialist input without commissioning a formal written report.',
            ),
            bulletsLabel: 'When to Request',
            bullets: [
              { text: 'Seeking a preliminary opinion before commissioning a formal report' },
              { text: 'Clarifying specific points in an existing specialist report' },
              { text: 'Urgent specialist input is required on a time-sensitive matter' },
              { text: 'General clinical discussion to inform litigation strategy' },
            ],
          },
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'left',
            anchorId: 'expert-evidence',
            title: 'Expert Evidence',
            body: plainTextToLexical(
              'When a matter proceeds to hearing or trial, VERIFY arranges for the specialist to attend and provide expert evidence — in person or via secure videolink — including sworn testimony, cross-examination, and expert conclave attendance.',
            ),
            bulletsLabel: 'When to Request',
            bullets: [
              { text: 'Court, tribunal, or commission hearings requiring specialist testimony' },
              { text: 'Cross-examination of the reporting specialist by the opposing party' },
              { text: 'Expert conclaves or concurrent evidence sessions' },
              { text: 'Mediations requiring specialist attendance or written conclave report' },
            ],
          },
        ],
      },
      // ── Closing CTA ──
      closingCta(),
    ],
  )

  // ══════════════════════════════════════════════════════════════════════
  // ADMINISTRATIVE SERVICES
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'admin-services',
    {
      type: 'pageHero',
      theme: 'service',
      align: 'left',
      showBreadcrumb: true,
      showShield: false,
      heading: 'Administrative & [[Support Services]]',
    },
    [
      // ── Overview (image right, no button) ──
      {
        blockType: 'splitFeature',
        background: 'white',
        rows: [
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            imageSide: 'right',
            eyebrow: 'Why Administrative Services Matter',
            title: 'The Detail Work, [[Handled for You]]',
            body: plainTextToLexical(
              "A successful medico-legal assessment depends on far more than the examination itself. Language barriers, geographic constraints, and poorly prepared documentation can each compromise the quality and timeliness of an outcome.\n\nVERIFY's Administrative Services address these challenges directly — providing specialist coordination, interpreter access, and document management as part of a seamless, professionally managed process.",
            ),
          },
        ],
      },
      // ── Four admin services (image + "+" accordion reveal) ──
      {
        blockType: 'servicesGrid',
        eyebrow: 'Our Services',
        heading: 'Four Services. [[One Less Thing to Manage.]]',
        subheading:
          "VERIFY's Administrative Services handle the logistical complexity of medico-legal assessments — so your team can stay focused on the matter.",
        background: 'muted',
        source: 'manual',
        services: adminServicesAccordion,
        layout: 'accordion',
      },
      // ── The process ──
      {
        blockType: 'processSteps',
        eyebrow: 'The Process',
        heading: 'Simple to Request, [[Seamless to Deliver]]',
        subheading:
          'Every VERIFY administrative service follows the same straightforward process — from initial request through to completion, with clear communication at each stage.',
        background: 'accent',
        columns: '4',
        steps: [
          {
            title: 'Submit Your Request',
            description:
              plainTextToLexical("Contact VERIFY's team with details of your matter and the administrative service required."),
          },
          {
            title: 'VERIFY Confirms',
            description:
              plainTextToLexical('We confirm the service details, logistics, and any requirements specific to your matter.'),
          },
          {
            title: 'We Coordinate',
            description:
              plainTextToLexical('VERIFY manages all logistics — scheduling, briefing, documentation, and communication.'),
          },
          {
            title: 'Seamless Delivery',
            description:
              plainTextToLexical('The service is completed and confirmed, with any relevant documentation delivered to your office.'),
          },
        ],
      },
      // ── Closing CTA (standardised) ──
      closingCta(),
    ],
  )

  // ══════════════════════════════════════════════════════════════════════
  // MEDICO-LEGAL (parent stub)
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'medico-legal',
    {
      type: 'pageHero',
      theme: 'dark',
      align: 'left',
      showBreadcrumb: true,
      showShield: true,
      eyebrow: 'Services',
      heading: 'Medico-Legal [[Services]]',
      subtitle:
        'Independent examinations, joint assessments, specialist reporting, and the administrative coordination that keeps every matter moving.',
    },
    [
      {
        blockType: 'splitFeature',
        background: 'white',
        rows: [
          {
            imagePlaceholder: true,
            placeholderLabel: 'Image Placeholder',
            eyebrow: 'Overview',
            title: 'Everything a Matter Needs, [[Under One Roof]]',
            imageSide: 'left',
            body: plainTextToLexical(
              'VERIFY provides the full range of medico-legal services — from Independent and Joint Medical Examinations through to specialist reporting and the administrative coordination that supports every assessment. Each service is delivered with the same rigour, accuracy, and quality assurance.',
            ),
            ...custom('/services', 'All Services'),
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'Explore',
        heading: 'Our Medico-Legal [[Service Lines]]',
        subheading: 'Choose a service to learn more about how VERIFY can support your matter.',
        background: 'muted',
        columns: '4',
        items: [
          {
            icon: 'first-aid',
            title: 'Independent Medical Examination',
            titleSuffix: 'IME',
            description:
              'Impartial assessments by accredited specialists, with full coordination and mandatory QA on every report.',
          },
          {
            icon: 'users-three',
            title: 'Joint Medical Examination',
            titleSuffix: 'JME',
            description:
              'A single jointly-instructed specialist agreed by both parties — reducing cost, duplication, and delay.',
          },
          {
            icon: 'file-magnifying-glass',
            title: 'Other Reporting Services',
            description:
              'File Reviews, Supplementary Reports, Medical Negligence opinions, Teleconferences, and Expert Evidence.',
          },
          {
            icon: 'user-plus',
            title: 'Administrative Services',
            description:
              'Surrogate assessments, interpreter bookings, brief reduction, and letter of instruction review.',
          },
        ],
      },
      closingCta(),
    ],
  )

  // ══════════════════════════════════════════════════════════════════════
  // EDUCATIONAL SERVICES (parent stub)
  // ══════════════════════════════════════════════════════════════════════
  await authorPage(
    ctx,
    'educational-services',
    {
      type: 'pageHero',
      theme: 'dark',
      align: 'left',
      showBreadcrumb: true,
      showShield: true,
      eyebrow: 'Services',
      heading: 'Educational [[Services]]',
      subtitle:
        'Through AAMLE — the Australian Academy of Medico-Legal Education — VERIFY delivers complimentary, CPD-eligible education to legal, medical, and insurance professionals across Australia.',
    },
    [
      {
        blockType: 'aamleEducation',
        background: 'white',
        eyebrow: 'Educational Services',
        wordmark: 'AAMLE',
        subheading: 'Australian Academy of Medico-Legal Education',
        badge: { icon: 'graduation-cap', text: 'CPD-Eligible Programs' },
        description: plainTextToLexical(
          "AAMLE is VERIFY's educational arm — delivering complimentary, CPD-eligible programs to legal, medical, and insurance professionals across Australia, at no cost to participants.",
        ),
        items: [
          { icon: 'video-camera', label: 'CPD-Eligible Webinars' },
          { icon: 'graduation-cap', label: 'Specialist Training Events' },
          { icon: 'book-open', label: 'Discounted AMA Guides Access' },
          { icon: 'globe', label: 'Open to All — Nationally' },
        ],
        imagePlaceholder: true,
        placeholderLabel: 'Image Placeholder',
        ...custom('https://aamle.com.au/', 'Explore AAMLE', { newTab: true }),
      },
      {
        blockType: 'ctaBand',
        eyebrow: 'Stay in the Loop',
        heading: 'Upcoming Webinars & [[Training Events]]',
        text: 'Browse upcoming AAMLE events and register your interest — every session is complimentary and CPD-eligible.',
        links: [custom('/events', 'View Upcoming Events'), enquiry('Make an Enquiry')],
      },
    ],
  )
}
