// "In the Loop" article posts, transcribed/paraphrased from the design reference
// (.design-reference/in-the-loop/*). Titles are the real article H1s; slugs derive
// from the reference filenames. Bodies are faithful paraphrases of the reference
// article (the QA-insight volumes carry the reference's real, detailed content;
// the templated streams are rewritten from each article's title + lead). Consumed
// by the data-layer seed, which resolves `stream` (slug) → streams collection id,
// `categories` (slugs) → categories collection ids, and runs each body through
// plainTextToLexical() for the richText `content` field.
//
// `categories` carry the per-article chip shown on the In-the-Loop hub cards
// (e.g. "Company News" vs "Industry News"). The ArchiveBlock renders the post's
// OWN first category, falling back to the stream title when a post has none — so
// QA-insight posts deliberately omit a category and inherit the "QA Insights"
// stream tag.

export type PostSeed = {
  title: string
  slug: string
  stream: string // stream slug (featured | news-updates | industry-insights | specialist-spotlights | qa-insights | staff-narratives | resources)
  categories?: string[] // category slugs — the per-article chip on hub cards
  featured?: boolean
  excerpt: string
  author: { name: string; role: string }
  publishedAt: string // ISO date string, e.g. '2026-06-15'
  body: string // plain text; paragraphs separated by \n\n
}

export const POSTS: PostSeed[] = [
  // ————————————————————————————————————————————————————————————————
  // FEATURED (3) — all flagged featured for the hub carousel
  // ————————————————————————————————————————————————————————————————
  {
    title: 'The IME Referral Brief: Why Quality Documentation Determines Report Quality',
    slug: 'the-ime-referral-brief-why-quality-documentation-determines-report-quality',
    stream: 'featured',
    featured: true,
    excerpt:
      'A well-prepared referral brief is the single greatest factor in the quality of an independent medical examination report. Our senior coordinators outline what information specialists need — and what is most often missing from the briefs they receive.',
    author: { name: 'VERIFY Senior Coordination Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-04-28',
    body: `A well-prepared referral brief is the single greatest determinant of the quality of an independent medical examination report. In our coordination work with solicitors, insurers, and claims managers, the briefs that produce the clearest, most defensible opinions all share the same foundation: focused, relevant documentation and precise instructions.

The most common problem is not too little information, but too much of the wrong kind. A brief padded with duplicated records, irrelevant treatment notes, and unanswered questions slows the specialist down and dilutes the opinion. Providing a concise chronology, the material relevant to the specialist's field, and a clear list of the questions to be addressed does far more for report quality than volume ever will.

Timing matters too. Engaging early lets us manage specialist availability and deadlines, and confirm logistics before the assessment proceeds. Every VERIFY report then passes through structured quality assurance review, so gaps are identified and resolved before delivery rather than after.`,
  },
  {
    title:
      "AAMLE 2026 Annual Conference: Registration Now Open for Australia's Premier Medico-Legal Education Event",
    slug: 'aamle-2026-annual-conference-registration-now-open',
    stream: 'featured',
    featured: true,
    excerpt:
      'The AAMLE Annual Conference brings together medico-legal professionals, legal practitioners, and healthcare specialists for two days of expert-led sessions, workshops, and networking opportunities across Australia.',
    author: { name: 'AAMLE Secretariat', role: 'Conference Organising Committee' },
    publishedAt: '2026-06-05',
    body: `Registration is now open for the AAMLE 2026 Annual Conference, Australia's premier medico-legal education event. Over two days the program brings together legal practitioners, healthcare specialists, insurers, and claims professionals for expert-led sessions, practical workshops, and structured networking.

This year's program focuses on the issues shaping contemporary medico-legal practice — impairment assessment under the AMA Guides, report defensibility, evolving scheme requirements, and the coordination of complex assessments. Sessions are designed to be immediately applicable to day-to-day matters.

VERIFY is proud to support the conference and will be attending across both days. Early-bird registration is limited and places in the hands-on workshops fill quickly, so practitioners are encouraged to secure their spots ahead of the full program release.`,
  },
  {
    title:
      "Understanding Queensland's Updated WorkCover Guidelines: What Every Legal Practitioner Needs to Know",
    slug: 'understanding-queenslands-updated-workcover-guidelines-what-every-legal-practitioner-needs-to-know',
    stream: 'featured',
    featured: true,
    excerpt:
      "The recent amendments to Queensland WorkCover guidelines introduce significant changes to how independent medical examinations are requested, coordinated, and reported. We break down what's changed and what it means for your practice.",
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-05-12',
    body: `Recent amendments to Queensland's WorkCover guidelines introduce meaningful changes to how independent medical examinations are requested, coordinated, and reported. For legal practitioners and claims managers, understanding these changes early is the difference between a smooth assessment and avoidable delay.

The updates sharpen expectations around the information that must accompany a referral, the standard of documentation supporting an impairment assessment, and the way examiners are expected to frame their opinions against the treating evidence. Reports that do not align with the revised framework are more likely to attract challenge.

In practice, this reinforces the value of a well-scoped brief and a clear letter of instruction. VERIFY has updated its coordination and quality assurance processes to reflect the new guidelines, and our team is available to talk through how the changes apply to a specific matter.`,
  },

  // ————————————————————————————————————————————————————————————————
  // NEWS & UPDATES (3) — per-article chips: Company News / Industry News
  // ————————————————————————————————————————————————————————————————
  {
    title: 'VERIFY Expands Expert Panel with Five New Orthopaedic Surgeons',
    slug: 'verify-expands-expert-panel-with-five-new-orthopaedic-surgeons',
    stream: 'news-updates',
    categories: ['company-news'],
    excerpt:
      "We're pleased to welcome five highly credentialled orthopaedic surgeons to the VERIFY expert panel, expanding our capacity across Queensland and New South Wales.",
    author: { name: 'VERIFY', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-05-08',
    body: `VERIFY is pleased to welcome five highly credentialled orthopaedic surgeons to its expert panel, expanding assessment capacity across Queensland and New South Wales. Each brings extensive clinical and medico-legal experience across a range of musculoskeletal and traumatic injury presentations.

The expanded panel shortens waiting times for orthopaedic independent medical examinations — often among the most sought-after and heavily booked specialties — and gives instructing parties more choice in location and sub-specialty expertise.

All new panel members are supported by VERIFY's coordination and quality assurance teams, ensuring their reports meet the same standards of clarity, compliance, and defensibility that referrers expect.`,
  },
  {
    title: 'CTP Scheme Reforms: Key Changes Coming into Effect in July 2026',
    slug: 'ctp-scheme-reforms-key-changes-coming-into-effect-in-july-2026',
    stream: 'news-updates',
    categories: ['industry-news'],
    excerpt:
      "Queensland's CTP scheme is undergoing significant reform in July 2026. Here's what legal practitioners and insurers need to prepare for ahead of the changes.",
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-05-02',
    body: `Queensland's compulsory third party (CTP) scheme is undergoing significant reform, with key changes coming into effect in July 2026. The reforms affect how claims are managed and how medical evidence is gathered, and legal practitioners and insurers will need to adjust their processes ahead of the commencement date.

Among the practical implications are changes to the timing and coordination of independent medical examinations and to the expectations placed on the supporting documentation. Matters straddling the commencement date will need careful management to ensure assessments proceed under the correct framework.

VERIFY is monitoring the transition closely and updating its intake and coordination processes accordingly. We encourage instructing parties with matters approaching the July 2026 threshold to plan referrals early so assessments are completed under the appropriate rules.`,
  },
  {
    title: 'VERIFY Appointed to Queensland Government Preferred Supplier Panel',
    slug: 'verify-appointed-to-queensland-government-preferred-supplier-panel',
    stream: 'news-updates',
    categories: ['company-news'],
    excerpt:
      "VERIFY has been formally appointed to the Queensland Government's preferred supplier panel for independent medico-legal examination services.",
    author: { name: 'VERIFY', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-04-18',
    body: `VERIFY Medico-Legal Solutions has been formally appointed to the Queensland Government's preferred supplier panel for independent medico-legal examination services. The appointment recognises VERIFY's track record in coordinating high-quality, timely assessments across a broad range of specialties.

Panel status streamlines engagement for government agencies seeking independent medical examinations, backed by VERIFY's structured coordination and quality assurance processes. It reflects the standards of accuracy, defensibility, and turnaround that underpin every report we deliver.

The appointment expands VERIFY's capacity to support the public sector while maintaining the same rigorous quality assurance review applied across all of our work.`,
  },

  // ————————————————————————————————————————————————————————————————
  // INDUSTRY INSIGHTS (3) — chips: Practice Guide / Legal Framework / Clinical
  // ————————————————————————————————————————————————————————————————
  {
    title: 'Five Common Errors in IME Briefs That Delay Your Report',
    slug: 'five-common-errors-in-ime-briefs-that-delay-your-report',
    stream: 'industry-insights',
    categories: ['practice-guide'],
    excerpt:
      'The quality of an IME report begins long before the examination. These are the brief preparation errors we see most frequently — and how to avoid them.',
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-05-05',
    body: `The quality of an IME report begins long before the examination itself. Reviewing thousands of briefs, we see the same preparation errors recur — and each one adds avoidable delay or weakens the resulting opinion.

The most frequent are: including duplicated or irrelevant records that bury the material that matters; failing to provide a clear chronology of the injury and treatment; omitting a focused list of questions for the specialist to address; sending the brief too late for proper review; and referring the claimant before they have reached maximum medical improvement.

Each of these is straightforward to avoid with a short pre-send check. Trimming the brief to what is relevant, stating the questions clearly, and timing the referral well will consistently produce a faster, more defensible report. VERIFY's coordinators are happy to review brief material before it reaches the specialist.`,
  },
  {
    title: 'What Makes a Medico-Legal Report Legally Defensible?',
    slug: 'what-makes-a-medico-legal-report-legally-defensible',
    stream: 'industry-insights',
    categories: ['legal-framework'],
    excerpt:
      'Not all expert reports are created equal. We examine the clinical, procedural, and legal elements that determine whether a report will withstand scrutiny in court.',
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-04-28',
    body: `A legally defensible medico-legal report is one whose conclusions survive cross-examination. That resilience comes from three things working together: sound clinical reasoning, procedural compliance, and a clear line from the evidence to each opinion expressed.

Clinically, the report must apply the correct methodology — for impairment matters, the relevant edition of the AMA Guides — and show its working. Procedurally, it must record what material was reviewed, disclose the examiner's independence, and address the questions actually asked. Legally, every conclusion must be traceable to a stated basis rather than assertion.

Reports that skip these steps are vulnerable regardless of how eminent the author. VERIFY's quality assurance review exists precisely to test each report against these standards before it is delivered, so weaknesses are corrected in-house rather than exposed in the witness box.`,
  },
  {
    title: 'The Role of the Independent Medical Examiner in WorkCover Claims',
    slug: 'the-role-of-the-independent-medical-examiner-in-workcover-claims',
    stream: 'industry-insights',
    categories: ['clinical'],
    excerpt:
      "Understanding the examiner's obligations, the limits of their role, and how their opinion interacts with treating medical evidence in a WorkCover dispute.",
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-04-14',
    body: `In a WorkCover dispute, the independent medical examiner occupies a distinct role from the claimant's treating practitioners. Their task is not to treat, but to provide an impartial, evidence-based opinion on diagnosis, causation, impairment, and capacity for the assistance of the parties and the tribunal.

That independence carries clear obligations: to assess objectively, to ground each conclusion in the clinical findings and the material provided, and to distinguish opinion from advocacy. Where the examiner's view diverges from the treating evidence, the reasoning for that divergence must be transparent.

Understanding these boundaries helps instructing parties frame their questions appropriately and weigh the resulting opinion. VERIFY briefs its examiners to address the treating evidence directly, so their reports are both independent and genuinely useful to the matter.`,
  },

  // ————————————————————————————————————————————————————————————————
  // SPECIALIST SPOTLIGHTS (3) — chips: Orthopaedics / Psychiatry / Pain Medicine
  // ————————————————————————————————————————————————————————————————
  {
    title: 'In Conversation With: Dr [Name], Orthopaedic Surgeon',
    slug: 'in-conversation-with-dr-name-orthopaedic-surgeon',
    stream: 'specialist-spotlights',
    categories: ['orthopaedics'],
    excerpt:
      'We sat down with one of our most experienced orthopaedic specialists to discuss what makes a strong IME referral, the most common brief gaps, and what practitioners often misunderstand about impairment assessment.',
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-05-01',
    body: `We sat down with one of VERIFY's most experienced orthopaedic surgeons to discuss what separates a strong IME referral from a frustrating one, and the gaps he encounters most frequently.

The single most common problem, he says, is missing pre-injury imaging and history. Without a baseline, questions of causation and pre-existing degeneration become far harder to answer with confidence. A focused brief that includes prior imaging and incident records makes for a materially better opinion.

He also cautions against referrals made before the claimant has stabilised, which force preliminary rather than final opinions. His advice to practitioners is simple: brief early on logistics, but time the assessment for when the clinical picture is settled.`,
  },
  {
    title: 'Five Questions With: Dr [Name], Consultant Psychiatrist',
    slug: 'five-questions-with-dr-name-consultant-psychiatrist',
    stream: 'specialist-spotlights',
    categories: ['psychiatry'],
    excerpt:
      'A consultant psychiatrist on the VERIFY panel shares what separates a good psychiatric IME from a poor one, the role of secondary gain, and how she approaches contested diagnoses.',
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-04-18',
    body: `In this instalment of our specialist series, a consultant psychiatrist on the VERIFY panel answers five questions about psychiatric independent medical examinations — a field where the assessment method matters as much as the conclusion.

A strong psychiatric IME, she explains, rests on a thorough history, corroboration against the collateral records, and careful consideration of factors such as secondary gain and pre-existing conditions. The difference between a good report and a poor one usually lies in how transparently the examiner reasons through these issues.

On contested diagnoses, her approach is to set out the competing possibilities, weigh them against the evidence, and explain why she lands where she does. That transparency, she notes, is what allows a report to hold up when it is tested.`,
  },
  {
    title: 'A Day in the Practice: Chronic Pain Assessment in Medico-Legal Context',
    slug: 'a-day-in-the-practice-chronic-pain-assessment-in-medico-legal-context',
    stream: 'specialist-spotlights',
    categories: ['pain-medicine'],
    excerpt:
      'A pain medicine specialist walks us through how he approaches chronic pain IMEs, the intersection of clinical complexity and legal requirements, and the questions referrers most often get wrong.',
    author: { name: 'VERIFY Editorial Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-04-04',
    body: `Chronic pain sits among the most challenging presentations in medico-legal assessment, because the injury is real but rarely visible on imaging. In this spotlight, a pain medicine specialist on the VERIFY panel walks us through how he approaches a chronic pain IME.

His method starts with a careful history — mechanism of injury, treatment trajectory, medication, and the day-to-day functional impact — before turning to examination and the available records. The aim, he explains, is to build a consistent picture that distinguishes genuine impairment from the confounders that referrers most often ask about.

He notes that the most useful referrals are specific: they ask targeted questions about diagnosis, causation, and capacity rather than requesting a general opinion. Clear instructions, he says, let the specialist address exactly what the matter turns on.`,
  },

  // ————————————————————————————————————————————————————————————————
  // QA INSIGHTS (5) — no category; inherit the "QA Insights" stream chip.
  // Faithful paraphrase of the real "In the Loop" volumes.
  // ————————————————————————————————————————————————————————————————
  {
    title: 'In the Loop Vol. 24 — Combining Whole Person Impairment Figures',
    slug: 'in-the-loop-vol-24-combining-whole-person-impairment-figures',
    stream: 'qa-insights',
    excerpt:
      'How Whole Person Impairment figures are correctly combined under the AMA Guides — and why it is not simple addition.',
    author: { name: 'Sharla Johnston', role: 'Quality Assurance Lead' },
    publishedAt: '2025-09-22',
    body: `A question we field often in Quality Assurance is why a report's total Whole Person Impairment (WPI) figure doesn't match the sum of its parts. If a claimant has a 7% lumbar spine impairment, an 8% finger amputation, and a 15% lower limb impairment, the arithmetic sum is 30% — yet the specialist may correctly report 27%.

The answer lies in the Combined Values Chart of the AMA Guides to the Evaluation of Permanent Impairment, Fifth Edition. Rather than adding figures, each impairment is combined so that a new impairment applies only to the portion of the person that remains unimpaired. Working the example through the chart — 15% combined with 8%, then combined with 7% — yields 27%.

This is why total WPI can never exceed 100%: the figures are proportional reflections of overall functional loss, not raw numbers to be added indefinitely. Understanding the method helps practitioners explain a figure to a client, defend a compliant report, and recognise when a rating may be inconsistent with the Guides and warrant review.`,
  },
  {
    title: 'In the Loop Vol. 25 — Compiling Briefs to Medical Specialists',
    slug: 'in-the-loop-vol-25-compiling-briefs-to-medical-specialists',
    stream: 'qa-insights',
    excerpt:
      'Putting together a brief to a medico-legal specialist is a balancing act. Here is what the best briefs have in common.',
    author: { name: 'Aki Tsimouris', role: 'Quality Assurance Officer' },
    publishedAt: '2025-11-03',
    body: `Compiling a brief to a medico-legal specialist is a balancing act. It is tempting to include every available record so nothing is missed, but that often produces a brief that is large, costly, and cluttered with material that draws focus away from the subject incident.

The best briefs are built around relevance to the specialist's field. An orthopaedic surgeon benefits from pre-injury imaging and prior incident forms; a psychiatrist from school counsellor or treating psychologist records. Including only what is pertinent gives the specialist a clear picture of the claimant before and after the incident.

Great briefs also trim and de-duplicate. Redacted or poorly copied pages, unrelated pathology and imaging, and — most commonly — records duplicated across multiple treating providers are removed. Checking material against these principles before it is sent improves turnaround, ensures relevance, and reduces the specialist's reading time and cost.`,
  },
  {
    title: 'In the Loop Vol. 26 — Why Maximum Medical Improvement is the Baseline for a Reliable IME',
    slug: 'in-the-loop-vol-26-why-maximum-medical-improvement-is-the-baseline-for-a-reliable-ime',
    stream: 'qa-insights',
    excerpt:
      'Assessing before Maximum Medical Improvement is reached produces preliminary opinions that often need to be revisited.',
    author: { name: 'Evie Le', role: 'Quality Assurance Manager' },
    publishedAt: '2026-01-29',
    body: `In medico-legal practice, the timing of an independent medical examination can matter as much as its findings. We regularly see requests for a permanent impairment assessment before the examinee has reached Maximum Medical Improvement (MMI) — the point at which the condition is stable and stationary and no further significant change is expected.

Assessing an injury that is still healing produces a speculative, 'preliminary' report that cannot support a final WPI rating. That usually means a second assessment months later once MMI is reached — expert costs incurred twice over, added administrative burden, and limited value toward settlement in the meantime.

As a rule of thumb, we suggest a minimum of nine months from injury for physical conditions and twelve months for psychiatric injuries, alongside evidence that symptoms and treatment have plateaued. Asking the specialist to address MMI status as well as WPI in the letter of instruction avoids the cost of a reassessment.

There are exceptions — an early IME can be worthwhile to resolve a disputed diagnosis, establish causation, or assess current work capacity before the clinical picture changes. The key is to undertake an early assessment only where it delivers a genuine benefit to the claim, not simply to move a matter along.`,
  },
  {
    title: 'In the Loop Vol. 27 — Timing the IME Process',
    slug: 'in-the-loop-vol-27-timing-the-ime-process',
    stream: 'qa-insights',
    excerpt:
      'A practical timeline for the whole IME process — from booking specialist availability through to report delivery.',
    author: { name: 'Mel Smith', role: 'Quality Assurance Officer' },
    publishedAt: '2026-03-27',
    body: `The IME process has several time-sensitive stages, and planning around them prevents avoidable stress. Sought-after specialists are frequently booked out three months or more in advance, so the single best step is to book as early as possible to secure an appointment within your required timeframe.

Briefing is its own balancing act. Collate the brief too early and you may miss recent records; too late and the specialist has no time to review it. Aim to provide the brief one to three weeks before the examination — recent enough to be current, early enough for proper preparation.

The claimant needs preparation too. Confirm the location, date, and time at least one to two weeks ahead, ensure any forms are returned, and, for video assessments, help them test their equipment and confirm a private location. Where a solicitor relays communications, allow extra lead time to avoid missed messages.

Finally, keep the lines open. Provide an alternate contact for the day of assessment, flag any urgent deadlines to VERIFY as early as possible, and let us know if further documents arrive during drafting — a supplementary report can often be arranged even after the specialist has formed an opinion.`,
  },
  {
    title: 'The IME Report Quality Checklist: What VERIFY Reviews Before Release',
    slug: 'the-ime-report-quality-checklist-what-verify-reviews-before-release',
    stream: 'qa-insights',
    excerpt:
      "A transparent look inside VERIFY's quality assurance process — the multi-point review every report passes before it reaches a client.",
    author: { name: 'VERIFY Quality Assurance Team', role: 'Medico-Legal Solutions' },
    publishedAt: '2026-05-05',
    body: `Every report VERIFY delivers passes through a structured quality assurance review before it reaches the instructing party. This is a transparent look at what that review covers.

We check that the report addresses each referral question directly and completely; that the methodology is correct for the matter — for impairment, the relevant edition of the AMA Guides — and that its application is shown rather than asserted. We confirm the examiner has recorded the material reviewed, disclosed their independence, and grounded each conclusion in a stated basis.

We also test the report for internal consistency, reconciling figures and findings between the body and the summary, and we read it for clarity so a non-clinician can apply its conclusions. Only once a report satisfies each of these points is it released — so weaknesses are corrected in-house rather than exposed later.`,
  },

  // ————————————————————————————————————————————————————————————————
  // STAFF NARRATIVES (4) — role-based chips + author name/role byline.
  // Order under -publishedAt matches the reference grid (Sarah → James →
  // Emma → Michael).
  // ————————————————————————————————————————————————————————————————
  {
    title: 'Why a Clear Referral Brief Makes All the Difference in an IME Outcome',
    slug: 'why-a-clear-referral-brief-makes-all-the-difference-in-an-ime-outcome',
    stream: 'staff-narratives',
    categories: ['coordination'],
    excerpt:
      "After reviewing thousands of IME briefs, one pattern stands out: the quality of the brief directly shapes the quality of the report. Here's what we consistently see missing — and how a few changes can transform the result.",
    author: { name: 'Sarah Mitchell', role: 'Senior Coordination Manager' },
    publishedAt: '2026-05-06',
    body: `After coordinating and reviewing thousands of IME briefs, one pattern stands out above all others: the quality of the brief directly shapes the quality of the report. The strongest opinions almost always trace back to a brief that was clear, focused, and well-timed.

What is consistently missing is not volume but direction — a concise chronology, the records relevant to the specialist's field, and a specific set of questions for the opinion to address. When those elements are present, the specialist can concentrate on the medicine rather than untangling the paperwork.

My advice to instructing parties is to treat the brief as the foundation of the whole matter, not an administrative afterthought. A little time spent scoping it well repays itself many times over in turnaround, clarity, and defensibility — and our coordinators are always glad to help before it is sent.`,
  },
  {
    title: 'The Three Most Common Report Gaps We See — and How We Address Them',
    slug: 'the-three-most-common-report-gaps-we-see-and-how-we-address-them',
    stream: 'staff-narratives',
    categories: ['quality-assurance'],
    excerpt:
      "Our QA process reviews every report before it reaches the instructing party. These are the three gaps that appear most often, what causes them, and the steps VERIFY takes to ensure they don't reach your desk.",
    author: { name: 'James Tran', role: 'Quality Assurance Lead' },
    publishedAt: '2026-04-29',
    body: `Our quality assurance process reviews every report before it reaches the instructing party, and across thousands of reviews the same three gaps recur more than any others.

The first is incomplete engagement with the referral questions — a report that answers the medicine but not the specific questions asked. The second is reasoning stated as a conclusion without the supporting steps, which leaves an opinion vulnerable under cross-examination. The third is inconsistency between the body of the report and its summary, where a figure or finding is expressed differently in two places.

None of these are failures of expertise; they are gaps in how an opinion is communicated. VERIFY's structured review checks every report against the referral questions, tests each conclusion for a stated basis, and reconciles the summary with the detail — so these issues are resolved in-house, before the report reaches your desk.`,
  },
  {
    title: 'What Legal Practitioners Really Need from a Medico-Legal Provider',
    slug: 'what-legal-practitioners-really-need-from-a-medico-legal-provider',
    stream: 'staff-narratives',
    categories: ['client-experience'],
    excerpt:
      "Having worked closely with solicitors, insurers, and claims managers, I've learned that responsiveness and transparency matter just as much as report quality. Here's what our clients tell us they value most.",
    author: { name: 'Emma Kowalski', role: 'Client Relations Manager' },
    publishedAt: '2026-04-21',
    body: `Having worked closely with solicitors, insurers, and claims managers over many years, I have learned that report quality is only part of what clients value. Responsiveness and transparency matter just as much.

What practitioners tell us they need most is certainty: a clear turnaround they can plan around, proactive updates when something changes, and a single point of contact who understands the matter. When a deadline is tight, they want to know early whether it can be met — not to discover a delay at the last moment.

At VERIFY we treat communication as part of the service, not an afterthought. Confirmed timeframes, early flags on anything that might affect delivery, and a coordinator who knows your matter are what turn a good report into a genuinely reliable one.`,
  },
  {
    title: 'Balancing Clinical Accuracy and Legal Utility in Medico-Legal Reporting',
    slug: 'balancing-clinical-accuracy-and-legal-utility-in-medico-legal-reporting',
    stream: 'staff-narratives',
    categories: ['clinical-insights'],
    excerpt:
      'A medico-legal report must satisfy two audiences with very different needs. Drawing on my experience advising both specialists and legal teams, I explore how the best reports achieve both — and where most fall short.',
    author: { name: 'Dr. Michael Hayes', role: 'Clinical Advisor' },
    publishedAt: '2026-04-14',
    body: `A medico-legal report has to satisfy two audiences with quite different needs. The clinician values diagnostic precision and nuance; the lawyer needs clear, applicable conclusions that answer the questions in issue. The best reports serve both without sacrificing either.

Advising specialists and legal teams alike, I have found the tension resolves through structure rather than compromise. Rigorous clinical reasoning belongs in the body of the report; its practical consequences — diagnosis, causation, impairment, capacity — belong in conclusions expressed plainly enough for a non-clinician to apply.

When a report achieves that balance, it is both accurate and genuinely useful, and far more likely to withstand scrutiny. Getting there is largely a matter of discipline: say what the evidence supports, address exactly what was asked, and make the reasoning easy to follow.`,
  },
]
