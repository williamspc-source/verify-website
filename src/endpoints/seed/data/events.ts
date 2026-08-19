// Events & seminars, transcribed from the design reference (events-data.js).
// `date` is ISO (YYYY-MM-DD); the seed converts it to a Date. Upcoming vs past is
// derived from the date at view time, so the same list drives both dedicated
// pages (/upcoming-events, /past-events) and the In-the-Loop AAMLE hub.
//
// `cpdEligible`: the reference marks only AAMLE-hosted events "CPD Eligible · Free"
// on the compact In-the-Loop cards (events.js formatLine: host === 'aamle'). We
// mirror that here so the ArchiveBlock compact card renders the same status line.

export type EventSeed = {
  slug: string
  title: string
  eventType:
    | 'networking'
    | 'client-training'
    | 'industry-briefing'
    | 'workshop'
    | 'webinar'
    | 'breakfast-seminar'
    | 'masterclass'
    | 'specialist-seminar'
  date: string
  timeLabel: string
  location: string
  host: 'aamle' | 'verify'
  cpdEligible?: boolean
  registrationUrl: string
  excerpt: string
}

export const EVENTS: EventSeed[] = [
  {
    slug: 'end-of-year-medico-legal-case-review',
    title: 'End-of-Year Medico-Legal Case Review',
    eventType: 'networking',
    date: '2025-12-15',
    timeLabel: '4:00 pm - 6:00 pm',
    location: 'Brisbane CBD',
    host: 'verify',
    registrationUrl: '',
    excerpt: 'A professional networking event and case review exploring recurring medico-legal issues from the year and practical lessons for future referrals.',
  },
  {
    slug: 'ime-scheduling-and-claimant-readiness',
    title: 'IME Scheduling and Claimant Readiness',
    eventType: 'client-training',
    date: '2026-01-23',
    timeLabel: '10:00 am - 11:00 am',
    location: 'Online webinar',
    host: 'verify',
    registrationUrl: '',
    excerpt: 'A process-focused session on appointment preparation, claimant communications, documentation expectations, and reducing delays in IME workflows.',
  },
  {
    slug: 'workcover-queensland-claims-update',
    title: 'WorkCover Queensland Claims Update',
    eventType: 'industry-briefing',
    date: '2026-02-07',
    timeLabel: '12:30 pm - 1:30 pm',
    location: 'Online briefing',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/past-events/',
    excerpt: 'A concise industry briefing covering current WorkCover claim trends, medical evidence considerations, and practical updates for legal and insurance teams.',
  },
  {
    slug: 'psychiatric-injury-claims-workshop',
    title: 'Psychiatric Injury Claims Workshop',
    eventType: 'workshop',
    date: '2026-02-21',
    timeLabel: '9:30 am - 11:30 am',
    location: 'Brisbane CBD',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A workshop for practitioners managing psychiatric injury claims, focused on diagnosis, causation, pre-existing history, and practical IME preparation.',
  },
  {
    slug: 'common-brief-preparation-errors',
    title: 'Common Brief Preparation Errors',
    eventType: 'webinar',
    date: '2026-03-13',
    timeLabel: '1:00 pm - 2:00 pm',
    location: 'Online webinar',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A client training session unpacking the brief preparation issues that most often delay appointments, create report gaps, or trigger avoidable supplementary questions.',
  },
  {
    slug: 'pain-medicine-in-personal-injury-claims',
    title: 'Pain Medicine in Personal Injury Claims',
    eventType: 'breakfast-seminar',
    date: '2026-03-27',
    timeLabel: '7:30 am - 9:30 am',
    location: 'The Grove Rooftop',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/past-events/',
    excerpt: 'A specialist breakfast seminar covering chronic pain assessment, causation questions, treatment histories, and the role of functional reporting in personal injury matters.',
  },
  {
    slug: 'quality-assurance-in-expert-evidence',
    title: 'Quality Assurance in Expert Evidence',
    eventType: 'webinar',
    date: '2026-04-18',
    timeLabel: '12:00 pm - 1:00 pm',
    location: 'Online webinar',
    host: 'verify',
    registrationUrl: '',
    excerpt: 'A behind-the-scenes session explaining how quality assurance improves report accuracy, consistency, and responsiveness to referral questions.',
  },
  {
    slug: 'medico-legal-report-writing-masterclass',
    title: 'Medico-Legal Report Writing Masterclass',
    eventType: 'masterclass',
    date: '2026-04-24',
    timeLabel: '9:00 am - 12:00 pm',
    location: 'Brisbane CBD',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A practical masterclass for specialists and legal teams focused on clear reasoning, defensible conclusions, report structure, and common medico-legal drafting pitfalls.',
  },
  {
    slug: 'breakfast-seminar-with-dr-ashwani-garg',
    title: 'Breakfast Seminar with Dr Ashwani Garg',
    eventType: 'breakfast-seminar',
    date: '2026-05-27',
    timeLabel: '7:30 am - 9:30 am',
    location: 'The Grove Rooftop',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/events/breakfast-seminar-with-dr-ashwani-garg/',
    excerpt: "A psychiatrist's practical guide to mediation preparation, presented by Dr Ashwani Garg, Consultant Psychiatrist. This breakfast seminar will focus on report interpretation, preparation strategy, and the questions legal teams should clarify before mediation.",
  },
  {
    slug: 'ama-guides-6th-edition-practical-refresher',
    title: 'AMA Guides 6th Edition Practical Refresher',
    eventType: 'webinar',
    date: '2026-06-12',
    timeLabel: '12:00 pm - 1:00 pm',
    location: 'Online webinar',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A focused refresher covering how the AMA Guides are applied in Queensland medico-legal practice, with worked examples from recent impairment assessment scenarios.',
  },
  {
    slug: 'navigating-queensland-ctp-reforms',
    title: 'Navigating Queensland CTP Reforms',
    eventType: 'workshop',
    date: '2026-06-28',
    timeLabel: '8:30 am - 10:30 am',
    location: 'VERIFY Brisbane Boardroom',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/events/',
    excerpt: 'An expert-led workshop examining practical implications of the July 2026 CTP reforms for solicitors, case managers, and insurers operating in Queensland.',
  },
  {
    slug: 'reading-a-medico-legal-report',
    title: 'Reading a Medico-Legal Report',
    eventType: 'webinar',
    date: '2026-07-15',
    timeLabel: '1:00 pm - 2:00 pm',
    location: 'Online webinar',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A practical guide for solicitors and claims teams on what to look for when reviewing an IME report, identifying gaps, and preparing targeted supplementary questions.',
  },
  {
    slug: 'psychiatric-imes-what-practitioners-need-to-know',
    title: 'Psychiatric IMEs: What Practitioners Need to Know',
    eventType: 'specialist-seminar',
    date: '2026-07-22',
    timeLabel: '12:30 pm - 1:30 pm',
    location: 'Online webinar',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A specialist-led session covering psychiatric independent medical examinations, including referral questions, contested diagnoses, secondary gain, and report limitations.',
  },
  {
    slug: 'expert-evidence-essentials-for-litigation-teams',
    title: 'Expert Evidence Essentials for Litigation Teams',
    eventType: 'networking',
    date: '2026-08-06',
    timeLabel: '4:00 pm - 6:00 pm',
    location: 'Brisbane CBD',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/events/',
    excerpt: 'A networking and education event for litigation teams covering expert engagement, report defensibility, conference preparation, and evidence readiness.',
  },
  {
    slug: 'orthopaedic-impairment-assessment-update',
    title: 'Orthopaedic Impairment Assessment Update',
    eventType: 'webinar',
    date: '2026-08-20',
    timeLabel: '12:00 pm - 1:00 pm',
    location: 'Online webinar',
    host: 'aamle',
    cpdEligible: true,
    registrationUrl: 'https://aamle.com.au/2026-seminar-menu/',
    excerpt: 'A concise orthopaedic update for legal and insurance teams, covering common impairment assessment issues and how to brief specialists more effectively.',
  },
  {
    slug: 'claimant-communication-and-examination-preparation',
    title: 'Claimant Communication and Examination Preparation',
    eventType: 'client-training',
    date: '2026-09-04',
    timeLabel: '9:00 am - 10:30 am',
    location: 'VERIFY Brisbane Boardroom',
    host: 'verify',
    registrationUrl: '',
    excerpt: 'A client-focused session on helping claimants understand the IME process, reducing avoidable delays, and improving appointment readiness.',
  },
]
