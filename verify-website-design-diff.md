# VERIFY Website — Design Reference vs Payload Build: Differences Log

**Purpose:** Running log of visual/structural differences between the design reference (target) and the current Payload CMS build (localhost), to be handed to Claude Code for implementation.

**Legend:**
- **Target** = design reference (e.g. `127.0.0.1` screenshots)
- **Current** = live Payload build (e.g. `localhost` screenshots)

---

## Comparison 1: Home Page (submitted 2026-07-04)

> **STATUS 2026-08-13 — superseded.** The homepage was audited section by section against
> `.design-reference/index.html` and the gaps closed; see `HOMEPAGE-CHANGES.md` for the itemised
> record. Several notes below were already stale when that audit ran — items 5 and 8 describe the
> "Claims We Support" band and the enquiry section as missing, and both had since shipped. Treat
> this comparison as history, not as a to-do list, and re-verify against the build before acting
> on any line of it.

### 1. Hero Section
No differences — heading, subtext, and buttons match.

### 2. "Medico-Legal Support, Tailored to You" cards
- **Section background**: Current is white; Target is light gray/blue.
- **"For Clients" card**: Current is missing the subtitle line "Legal Professionals & Case Managers" under the heading (the other two cards already have their subtitles).

### 3. "Who We Are" section
- **Broken rich text**: Current renders literal `[[Medico-Legal]]` brackets in the heading instead of styled blue text reading "Medico-Legal."
- **Layout**: Current is a single full-width text block. Target is a two-column layout with an image (currently a placeholder box in target) on the left and the heading/copy/button on the right.

### 4. "Comprehensive Medico-Legal Services" section
- **Section background**: Current white; Target light blue.
- **Card count/content**: Current shows 9 cards (3×3) including "Medical Negligence" and "Educational Services / AAMLE," each with a description paragraph. Target shows 8 simpler cards (2×4), icon + title only, no descriptions, and no "Medical Negligence" or "Educational Services/AAMLE" tiles in this view.
- **CTA button**: Target has a "View Medico-Legal Services" button below the grid; Current has no button here.

### 5. "Claims We Support" section
- **Layout**: Current is a centered, single-column list of claims with full-width divided rows. Target is a two-column layout — heading, description, and a "Learn More" button on the left; claims listed in a two-column grid with icons on the right.
- **Missing items**: Current is missing "National Disability Insurance Scheme (NDIS)" and "Fitness for Work Assessment."
- **Naming**: Current's first item is "CTP / Motor Vehicle Accident"; Target's is "Motor Vehicle Accident (MVA) / Compulsory Third-Party Insurance (CTP)" — more explicit naming.
- **Missing CTA**: No "Learn More" button in Current.

### 6. "Meet Our Expert Panel" section
- **Section background**: Current white; Target light gray.
- **Card design**: Current cards have a colored specialty badge/tag overlaid on the photo and list qualifications/degrees underneath the specialty line. Target cards are simpler — photo, name, specialty title only, no badge overlay, no degree list.
- **Broken content**: Current's 4th panel card (Dr Slava Poel) shows a placeholder shield icon instead of a photo.
- Note: different sample specialists shown in each — likely seed data, not a design difference; flag only if data should also be reconciled.

### 7. Testimonials section
- **Attribution format**: Current uses a single line, e.g. "Senior Associate, Legal Firm — Brisbane." Target uses a two-line format: role on one line, then "Company Name — City, QLD" on the next (e.g. "Senior Associate" / "Personal Injury Law Firm, Brisbane, QLD"), with locations consistently included for all three testimonials.

### 8. Bottom CTA / Enquiry section
Biggest gap in this comparison:
- **Current**: Dark blue full-width banner, centered heading/text, single "Make an Enquiry" button. No form, no contact details.
- **Target**: Light blue background, two-column layout — left side has heading, text, and contact details (Phone, Email, Office address, Office Hours with icons); right side has a full enquiry form (First Name, Last Name, Email, Phone, Company/Organisation, Type of Enquiry dropdown, Message field, "Send Enquiry" button).
- Current needs the contact-details block and the entire enquiry form built out.

### 9. Footer
No meaningful differences — layout and content match.

---

## Comparison 2: About Page (submitted 2026-07-04)

### 1. Hero Section
- **Heading/graphic overlap bug**: Current's hero heading text ("What We Stand For") overlaps the shield graphic on the right — heading appears to run too large/wide for its container. Target's heading wraps cleanly onto two lines without touching the graphic.
- **Stray visual artifact**: Current shows a thin horizontal white line/bar above the heading that isn't present in Target.
- **Missing breadcrumb**: Target has a "HOME : ABOUT VERIFY" breadcrumb row above the heading; Current has no breadcrumb.
- **Subtext copy differs**: Target: "Built on a clear conviction, VERIFY delivers accurate, timely, and defensible medico-legal reporting that supports confident decision making and strengthens the integrity of every case." Current: "VERIFY Medico-Legal Solutions delivers independent, quality-assured medico-legal reporting built on accuracy, responsiveness and clarity." — shorter and differently worded; align to Target copy.

### 2. "Medico-Legal Solutions Built on Trust & Precision" (About Verify) section
- **Broken rich text**: Current renders literal `[[Trust & Precision]]` brackets in the heading instead of styled blue text reading "Trust & Precision."
- **Layout**: Target is a two-column layout with an image placeholder ("COMPANY PHOTO PLACEHOLDER") on the left and heading/copy on the right. Current is a single full-width text column with no image.
- **Copy length/content**: Target has two longer paragraphs including the founding detail ("founded in 2021 by Wesley Lerch") and a second paragraph on accuracy/objectivity/integrity in process. Current has shorter, different paragraphs that omit the founding-story detail.
- **Extra button**: Current has an "Explore Our Services" button in this section that does not appear in Target — remove it here (Target has no CTA button in this block).

### 3. "Excellence in Medico-Legal Reporting" (Our Mission) section
- **Missing icon**: Target shows a small shield/logo icon above/beside the "Excellence in Medico-Legal Reporting" heading; Current is missing this icon.
- **Subtitle copy differs**: Target: "VERIFY provides high levels of support to both our clients and medical specialists throughout every step of the medico-legal process. At VERIFY, we dedicate ourselves to achieving excellence in medico-legal reporting through:" Current: "Our mission is to raise the standard of medico-legal reporting through precision, partnership and continuous improvement." — different, shorter copy.
- **Card background pattern**: Target cards alternate background colors in a checkerboard pattern (light blue / white / light blue / white / light blue / white for cards 01–06). Current cards all use the same light blue background with no alternating pattern — needs the checkerboard treatment restored.

### 4. "Queensland's Leading Medico-Legal Reporting Company" (Our Vision) section
- **Broken rich text**: Current renders literal `[[Medico-Legal Reporting Company]]` brackets instead of styled blue text.
- **Layout**: Target is a two-column layout with a "Vision Photo Placeholder" image on the right; Current is single-column text only, no image.
- **Extra button**: Current has a "Get in Touch" button that does not appear in Target — Target has no CTA button in this block.
- **Copy differs**: Target: "VERIFY's vision is to become the leading medico-legal reporting company in Queensland, recognised for excellence in service delivery and commitment to the highest industry standards." Current: "To be recognised as the most trusted medico-legal reporting company in Queensland and beyond — the partner legal and insurance professionals turn to for clarity, quality and dependable outcomes." — different wording/framing.

### 5. "CCARRE — The Principles That Guide Us" (Our Values) section
- **Subtitle copy differs**: Target: "These six values define how we build our team, our systems, and our relationships with every client and specialist we work with." Current: "Six values shape how we work and how we treat the people we work with." — shorter, different.
- **Card description copy differs across all six values** — e.g. "Client Focus": Target "We build trusted partnerships through integrity, care, and clear communication." vs Current "We put the needs of our clients and claimants at the centre of everything we do." Each of the six value descriptions (Client Focus, Continuous Learning, Accountability, Reliability, Respect, Excellence) differs in wording between Target and Current — align all six to Target copy.
- Layout/structure (3×2 grid, dark background, alternating white/light-blue cards) already matches — no structural change needed here.

### 6. "What Sets Us Apart" section
- **Subtitle copy differs**: Target: "VERIFY delivers accurate and consistent medico-legal support, guided by a strong understanding of both legal and medical demands. We bridge that gap through careful coordination and trusted service." Current: "A quality-first operation, end to end." — much shorter, needs expanding to match Target.
- Layout (accordion list left, image right) already matches.

### 7. Founder Section
Largest content/structure gap on this page:
- **Eyebrow label differs**: Target "MEET OUR FOUNDER"; Current "LEADERSHIP."
- **Heading differs**: Target "Built by Someone Who Lived the Problem"; Current "Founded on Experience."
- **Missing pull-quote**: Target includes an italicized quote block: "I built VERIFY because I knew what the industry needed — and I knew it wasn't being delivered." Current has no quote — needs to be added.
- **Body copy shorter in Current**: Target has a fuller two-paragraph bio; Current's paragraph is shorter and omits detail present in Target.
- **Tag/pill list incomplete**: Target shows four tags — "25+ Years — Personal Injury Law," "Insurance Litigation," "AAMLE QLD Delegate (2024)," "Founder, AAMLE." Current shows only three, with different wording — "25+ years in personal injury law," "Insurance litigation specialist," "Founder, VERIFY Medico-Legal Solutions" — missing the "AAMLE QLD Delegate (2024)" tag entirely and the remaining tags are reworded to different phrasing/casing.
- **CTA button differs**: Target button reads "Meet the Full Team"; Current reads "Get in Touch." Should be "Meet the Full Team" and likely link to a team page rather than a contact action.
- **Photo placeholder label**: Target "FOUNDER PHOTO PLACEHOLDER" with name badge overlay "Wes Lerch / Founder & Managing Director" at bottom of image. Current has a smaller/different placeholder ("WES LERCH PHOTO") with the badge positioned/sized differently — align sizing and placement to Target.

### 8. Bottom CTA section
- **Eyebrow label**: Confirm both say "GET STARTED" — appears consistent.
- **Heading differs**: Target "Ready to Refer Your Next Matter to VERIFY?"; Current "Partner with VERIFY" — needs updating to Target's heading.
- **Subtext differs**: Target: "Whether you have a specific referral or need guidance on the most suitable option, we are here to make the process simple, efficient, and responsive from the very start." Current: "Refer a matter, book a service, or ask us anything — our team responds promptly." — different, shorter copy.
- **Missing second button**: Target has two buttons — "Make an Enquiry" (filled/white) and "View Specialist Panel" (outline). Current has only "Make an Enquiry" — missing "View Specialist Panel" button entirely.

### 9. Footer
No meaningful differences — layout and content match.

---

## Comparison 3: Team Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb**: Target has a "HOME › ABOUT US › MEET THE TEAM" breadcrumb above the heading; Current has no breadcrumb.
- **Stray visual artifact**: Current again shows a thin horizontal white line/bar above the heading (same bug flagged on the About page) — not present in Target.
- **Subtext copy differs**: Target: "Our team brings together expertise in medico-legal coordination, client services, quality assurance, and administration — united by a shared commitment to accuracy, integrity, and outstanding service." Current: "A dedicated operations, client-support and business-development team coordinating your matters end to end." — shorter, different wording.
- Heading itself ("The People Behind VERIFY") and shield graphic match.

### 2. "Our People" intro section
- **Heading differs**: Target "Experienced, Dedicated & Client-Focused"; Current "Meet the Team."
- **Subtext copy differs**: Target: "At VERIFY, our team is our greatest strength. Every member plays a vital role in delivering the accuracy, care, and responsiveness our clients and claimants deserve. We are proud of the talented, dedicated individuals who make this possible every day." Current: "The people who coordinate referrals, manage bookings and support every matter through to delivery." — shorter, different.

### 3. Team member cards — photo treatment
- **Photo style differs**: Target uses full-bleed rectangular headshot photos filling the top of each card. Current uses small circular cropped avatar images centered in the card — a different, less prominent photo treatment. Update Current to match Target's full rectangular photo style.

### 4. Section naming
- **"Client Support" renamed**: Target's third section is labeled "CLIENT SUPPORT"; Current labels the equivalent section "RECEPTION & BOOKINGS." Align section label to Target ("Client Support") unless this rename is an intentional content decision to confirm with the team.

### 5. Team member roster differences (content/data — confirm with team before treating as a pure design fix)
- **Business Development**: Target lists 3 people — Sydney Shepard, Georgia Gowen, Thanh Nguyen. Current lists only 2 — Georgia Gowen is missing entirely.
- **Client Support / Reception & Bookings**: Target's 4th person is "Naomi Wijedoru" (Bookings Admin); Current shows "Jaynalyn Malijan" in that slot instead — different person.
- **Quality Assurance**: Target lists 8 people — Sharla Johnston, Mel Smith, Aki Tsimouris, James Heffernan, Eva Tabrizi, Jordan Dennis, Sophia Ryan, Madeline Cook. Current lists 10 people, including several not in Target — Evie Le (Quality Assurance Manager), Ricaliza Perlas (Offshore Manager), Kimberly Patente, Zenuel Bermundo, Jefferson Cortez — while dropping Target's Eva Tabrizi, Jordan Dennis, and Sophia Ryan. Card order also differs. This looks like a real roster/data discrepancy rather than a styling issue — flag for Spencer to confirm the authoritative current roster before reconciling.

### 6. Visual bug — stray card highlight
- **Unintended blue outline**: In Current, the "Kimberly Patente" card has a blue focus/hover-style border visibly stuck on in the static screenshot. No card in Target has this treatment — likely a lingering `:focus` or `:active` state applied incorrectly; should be cleared so no card shows this border by default.

### 7. Bottom CTA section
- **Heading differs**: Target "Ready to Refer Your Next Matter to VERIFY?"; Current "Work with Our Team."
- **Subtext differs**: Target: "Whether you have a specific referral or need guidance on the most suitable service, we are here to make the process simple, efficient, and responsive from the very start." Current: "Have a question or ready to refer a matter? Our team is here to help." — shorter, different.
- **Low-contrast/illegible text bug**: In Current, the eyebrow label above the heading and the second button's label both render with very low contrast (near-invisible against the background) — likely a text-color/background-color mismatch bug. Compare against Target, where the eyebrow ("GET STARTED") and second button ("View Specialist Panel") are both clearly legible in white/light text. Needs a contrast/color fix, not just a copy fix.
- **Second button content differs**: Target's second button reads "View Specialist Panel"; Current's second button appears to read something else entirely (illegible due to the contrast bug above) — confirm intended label once contrast is fixed; likely should also be "View Specialist Panel" or a team-page-appropriate equivalent (e.g. "Contact Us") — confirm with Spencer.

### 8. Footer
- **Possible tagline inconsistency**: Current's footer includes a tagline paragraph under the logo ("Independent medico-legal reporting and examination coordination, built on accuracy, responsiveness and clarity."). This tagline does not appear to be present in Target's footer on this page. Worth double-checking against the Home page footer (which included this tagline in both versions per Comparison 1) to confirm whether it should appear site-wide or was cropped out of this particular Target screenshot.

---

## Comparison 4: Services Page (submitted 2026-07-04)

### 1. Hero Section
- **Heading/graphic overlap bug**: Same recurring issue as the About and Team pages — Current's hero heading ("Precision & Trust") overlaps the shield graphic. Target wraps cleanly without touching the graphic.
- **Stray visual artifact**: Current again shows the thin horizontal white line/bar above the heading (recurring bug across all inner pages checked so far).
- **Missing breadcrumb**: Target has a "HOME › SERVICES" breadcrumb; Current has none.
- **Minor copy drop**: Target subtext reads "...independent medical examinations to expert **evidence** coordination and industry education..."; Current drops the word "evidence" — "...independent medical examinations to expert coordination and industry education..." Restore the missing word.

### 2. IME / JME intro section — major structural rebuild needed
This is the largest divergence on the page:
- **Target structure**: Two separate, alternating image+text blocks, each full-width — "Independent Medical Examinations" (image placeholder left, heading/copy/"Learn more →" link right), then a divider line, then "Joint Medical Examinations" (heading/copy/"Learn more →" link left, image placeholder right). Each has a large image placeholder alongside it.
- **Current structure**: Collapsed into a single stacked text-only section with an added eyebrow ("MEDICO-LEGAL SERVICES"), a combined heading ("Independent & Joint Medical Examinations") and intro subtext not present in Target, followed by two sequential text blocks (each with a small icon, a small eyebrow label — "FOR ALL MAJOR CLAIM TYPES" / "ONE SPECIALIST, BOTH PARTIES" — a heading, paragraph, and a filled button). No images at all.
- **Link style differs**: Target uses plain text links "Learn more →"; Current uses filled buttons labeled "Learn More About IMEs" / "Learn More About JMEs."
- Needs rebuilding to match Target's two-column alternating image/text layout, remove the extra group heading/eyebrow/subtext Current introduced, restore image placeholders, and revert buttons to plain "Learn more →" text links.

### 3. "Medico-Legal Reports & Opinions" section
- **Extra subtext**: Current adds a subtext paragraph under the heading ("A full spectrum of specialist reporting options beyond the standard examination — each designed to support your matter at the right stage.") that doesn't appear in Target, which shows only the eyebrow + heading with no subtext. Confirm whether to keep this addition or remove it to match Target exactly.
- **Missing "Enquire →" links**: Target shows an "Enquire →" link at the bottom of each of the 5 cards (File Review, Supplementary Report, Medical Negligence, Teleconference, Expert Evidence). Current's cards appear to be missing these links entirely — needs to be added back.

### 4. "Coordinated Support for Every Matter" (Administrative Services) section
- **Low-contrast/illegible text bug**: The eyebrow ("ADMINISTRATIVE SERVICES"), heading ("Coordinated Support for Every Matter"), and subtext paragraph all render with very low contrast against the dark blue background in Current — barely legible/washed out. This is the same class of bug flagged on the Team page CTA. Needs a text-color fix so this content is clearly legible (matching Target's crisp white/light-blue text on the same blue background).
- **Missing "Enquire →" links**: As with the Reports & Opinions cards above, Target shows "Enquire →" links on each of the 4 admin service cards (Surrogate Assessment Service, Interpreter Booking Service, Brief Reduction Service, Letter of Instruction Review); Current's cards appear to be missing these.

### 5. AAMLE (Educational Services) section — major structural rebuild needed
Significant redesign divergence:
- **Missing AAMLE branding**: Target displays a large "AAMLE" wordmark/logo-style heading with the subheading "AUSTRALIAN ACADEMY OF MEDICO-LEGAL EDUCATION" underneath. Current replaces this entirely with a generic heading, "Complimentary, CPD-Eligible Education for Professionals" — the AAMLE brand name/logo treatment is missing altogether.
- **Missing pill badge**: Target has a "CPD-ELIGIBLE PROGRAMS" pill badge near the top of the section; Current has no equivalent badge.
- **Missing image**: Target has an image placeholder on the right side of the intro area; Current has no image anywhere in this section.
- **List format differs entirely**: Target shows a simple 4-item checklist with small icons (CPD-Eligible Webinars, Specialist Training Events, Discounted AMA Guides Access, Open to All — Nationally) — compact, single column, light background. Current instead shows 4 large numbered (01–04) full-width dark blue cards, each with its own icon, a small status badge (CPD-ELIGIBLE / IN PERSON / DISCOUNTED / NATIONWIDE), and a full descriptive paragraph — a much heavier, more detailed treatment than Target's simple list.
- **Extra content not in Target**: Current adds a "SPONSORSHIP OPPORTUNITIES" callout box below the list ("Industry partners may sponsor AAMLE educational events and initiatives to support professional development across the medico-legal sector.") that has no equivalent in Target.
- Recommend rebuilding this section to match Target's simpler two-column layout (AAMLE wordmark + badge + checklist + image), and confirming with the team whether the more detailed numbered-card content and sponsorship callout should be preserved elsewhere or discarded.

### 6. Bottom CTA section
- **Low-contrast/illegible text bug (recurring)**: Same issue as Team page — the "GET STARTED" eyebrow and the second button ("View Specialist Panel") both render illegibly/near-invisible in Current. Heading and first paragraph are fine. Needs the same contrast fix referenced in Comparison 3.

### 7. Footer
- Current again includes the tagline paragraph under the logo that doesn't appear in this Target screenshot — same inconsistency flagged in Comparison 3; still needs confirming whether the tagline is intended site-wide.

---

## Comparison 5: IME Detail Page (submitted 2026-07-04)

### 1. Hero Section
- **Breadcrumb too deep**: Target breadcrumb is "HOME · SERVICES · IME" (3 levels). Current shows "HOME › OUR SERVICES › MEDICO-LEGAL SERVICES › INDEPENDENT MEDICAL EXAMINATION (IME)" (4 levels) — extra "OUR SERVICES" and "MEDICO-LEGAL SERVICES" crumbs not present in Target. Simplify to match Target's shorter path.
- **Extra eyebrow label**: Current adds a "MEDICO-LEGAL SERVICES" label above the heading that Target doesn't have.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs as prior pages — heading text overlaps the shield graphic, and a stray white line appears above the heading.
- **Extra subtext paragraph**: Current adds hero body copy ("Accredited Independent Medical Examinations for WorkCover, CTP, TPD, and personal injury claims — delivered with impartiality, clinical precision, and mandatory quality assurance.") that isn't present in Target — Target's hero has only the breadcrumb and heading, no subtext.

### 2. "What is an IME?" section
- **Broken rich text**: Current renders literal `[[Independent of All Parties]]` brackets instead of styled blue text.
- **Missing image**: Target is a two-column layout with an image placeholder on the left; Current is single-column text only, no image.
- **List formatting downgraded**: Target presents the three assessment points ("Injury Stability & Permanence," "Work Capacity & Functional Impact," "Causation & Treatment Needs") as distinct icon-led rows, each with a bold heading and its own description line beneath. Current collapses these into plain inline bullet points (icon + bold term + description run together on one line) with an added intro line "What an IME Assesses" not present in Target — needs restoring to the icon-card row format.
- **Extra button**: Current adds a "Make an Enquiry" button in this section that Target does not have here.

### 3. "IMEs Across All Major Claim Types" section
- **Missing accordion interaction**: Target implements this as an accordion — each row has an expand/collapse (+/−) icon, and the first item is shown expanded with a description paragraph visible. Current is a static list with plain arrow icons (→) — no expand/collapse behavior, no descriptions ever shown for any item. Needs interactive accordion behavior added to match Target.
- **List content/count differs (recurring issue)**: Target lists 9 items — Motor Vehicle Accident/CTP, Workers' Compensation, Public Liability, Historical or Institutional Abuse, Dust Diseases, **National Disability Insurance Scheme (NDIS)**, Total & Permanent Disability (TPD), Medical Negligence, **Fitness for Work Assessment**. Current lists 8 items and is missing both NDIS and Fitness for Work Assessment, while including "Income Protection," which isn't on Target's list at all. This is the same NDIS/Fitness-for-Work-Assessment gap and Income-Protection substitution flagged on the Home page (Comparison 1) — looks like a shared/global claims-list content source that needs correcting once, which should fix it everywhere it's used.
- **Naming inconsistency (recurring)**: Target's first item is "Motor Vehicle Accident / Compulsory Third-Party Insurance"; Current's is "CTP / Motor Vehicle Accident" — same naming-order issue flagged on the Home page.
- **Ordering**: Current's list is alphabetized; Target's is not — confirm intended order.

### 4. "Four Ways to Attend Your IME" section
- **Grid layout differs**: Target arranges the 4 cards in a 2×2 grid; Current arranges all 4 in a single row. Update Current's grid to 2×2 to match.
- **Condensed card copy**: Several card descriptions are shortened/condensed in Current compared to Target's fuller copy — e.g. "Videolink Assessment": Target gives a two-sentence explanation including "...allowing the specialist to provide a full clinical opinion without requiring physical attendance," while Current cuts this down to a single, shorter sentence. Similarly "Surrogate Assessment" loses detail about clinical rigour and regional access in Current's shorter version. Recommend restoring Target's full copy across all 4 cards.

### 5. "Whether You're a Client or a Claimant" (IME Process) section — major structural rebuild needed
- **Target structure**: Two side-by-side static cards shown simultaneously — "For Clients" (How the IME Process Works for Clients, 4 numbered steps) and "For Claimants" (What to Expect at Your IME Assessment, 4 numbered steps) — each with its own "View Client Process" / "View Claimant Guide" button.
- **Current structure**: Replaced with a toggle-tab interface ("For Clients" / "For Claimants," only one visible at a time) sitting above a separate horizontal numbered stepper graphic (01–04, connected by a line: Submit Your Referral → Specialist Allocation → Appointment Coordination → QA Review & Report Delivery).
- **Duplicate/fragmented section**: Current then adds a *second*, separate section further down ("Guides for Clients & Claimants") that re-covers similar ground with its own two side-by-side cards — but with different, thinner content (only 3 steps each: Referral & Allocation, Coordination & QA, Turnaround & Delivery / Before Your Appointment, On the Day, After the Assessment) instead of Target's 4 steps per side.
- Recommend consolidating back into Target's single two-card side-by-side layout with 4 full steps per side, removing the separate tabbed stepper and the duplicate "Guides" section (or merging any genuinely new content from it into the correct single section).
- **Button label mismatch**: Target's client-side button reads "View Client Process"; Current's equivalent (in the duplicate section) reads "View Client Guide."

### 6. Bottom CTA section
- **Low-contrast/illegible text bug (recurring)**: Same bug as previous pages — eyebrow and the "View Specialist Panel" button both render illegibly against the dark blue background in Current.
- **Copy trimmed**: Target subtext ends "...to make the process simple, efficient, and responsive from the very start." Current drops the closing phrase, ending simply "...simple, efficient, and responsive." Restore full copy.

### 7. Footer
- Current again includes the under-logo tagline paragraph not shown in this Target screenshot — same recurring inconsistency flagged in Comparisons 3 and 4.

---

## Comparison 6: JME Detail Page (submitted 2026-07-04)

### 1. Hero Section
- **Breadcrumb too deep (recurring)**: Target is "HOME · SERVICES · JME" (3 levels); Current is "HOME › OUR SERVICES › MEDICO-LEGAL SERVICES › JOINT MEDICAL EXAMINATION (JME)" (4 levels) — same extra-crumb issue flagged on the IME page.
- **Extra eyebrow label (recurring)**: Current adds a "MEDICO-LEGAL SERVICES" label above the heading; Target doesn't have one.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs as every other inner page checked so far.
- **Extra subtext paragraph (recurring pattern)**: Current adds hero body copy ("A single jointly-instructed specialist agreed upon by both parties — reducing cost, duplication, and delay across WorkCover, CTP, and TPD matters.") not present in Target — Target's hero has only breadcrumb + heading, no subtext, matching the same pattern seen on the IME page.

### 2. "What is a JME?" section
- **Broken rich text**: Current renders literal `[[Jointly Instructed by Both Parties.]]` brackets instead of styled blue text.
- **Missing image**: Target is two-column with an image placeholder on the right; Current is single-column, no image — same pattern as the IME page's equivalent section.
- **List formatting downgraded (recurring)**: Target presents the three points ("Jointly Instructed & Mutually Agreed," "One Report, Shared by All," "Lower Cost & Fewer Delays") as icon-led rows with a bold heading and separate description line beneath each. Current collapses these into single-line inline bullets and adds an intro line "Why It Works" not present in Target — same downgrade pattern flagged on the IME page.
- **Extra button**: Current adds a "Make an Enquiry" button in this section that Target does not have here.

### 3. "The Benefits of a Joint Approach" section
- Content and layout (6 cards: Reduced Costs for Both Parties, Faster Resolution, Less Burden on the Claimant, Unimpeachable Impartiality, No Conflicting Reports, Streamlined Court Preparation) match well.
- **Visual bug — stray card highlight (recurring)**: The "No Conflicting Reports" card shows an unintended blue focus/hover-style border in Current, same class of bug flagged on the Team page's "Kimberly Patente" card. Should be cleared.

### 4. "Specialists Who Conduct JME Assessments" section
- **Low-contrast/illegible text bug (recurring)**: The eyebrow ("OUR SPECIALIST PANEL"), heading, and subtext all render washed-out/low-contrast against the dark blue background in Current.
- **Card design mismatch (recurring)**: Target's specialist cards are simple — photo, name, specialty title only. Current's cards add a colored specialty badge overlaid on the photo plus a list of qualifications/degrees beneath the specialty line — same "badge + degrees vs simple" mismatch flagged on the Home page's Expert Panel section (Comparison 1).
- **Broken photo (recurring)**: Current's 4th card (Dr Slava Poel) shows a placeholder shield icon instead of an actual photo — same bug flagged on the Home page.
- **Missing/illegible second button**: Target has two buttons here — "View Full Panel" and "Make an Enquiry." Current shows "View Full Panel" clearly, but the second button is blank/illegible — likely the same low-contrast bug, though worth confirming in dev tools whether the button element and label exist at all or are missing outright.
- Different sample specialists are shown between the two (seed/content data, not itself a design issue) — flag only if the underlying specialist data also needs reconciling.

### 5. "The JME Process, Step by Step" section
No meaningful differences — 5-step layout (Joint Agreement, Specialist Selection, Brief & Scheduling, Assessment, QA & Delivery) and copy match closely between Target and Current.

### 6. "Common Questions About JMEs" (FAQ) section
No meaningful differences — same 5 questions, same accordion behavior, first item expanded by default in both.

### 7. Bottom CTA section
- **Heading differs — custom vs standard CTA**: Target uses the standard site-wide CTA heading "Ready to Refer Your Next Matter to VERIFY?" Current instead uses a JME-specific heading, "Ready to Arrange a Joint Examination?"
- **Subtext differs accordingly**: Target's standard copy ("Whether you have a specific referral or need guidance on the most suitable service, we are here to make the process simple, efficient, and responsive from the very start.") is replaced in Current with JME-specific copy ("Talk to our team about whether a JME is the right approach for your matter — we will guide both parties through the process from the very start.").
- **Missing second button**: Target has two buttons — "Make an Enquiry" and "View Specialist Panel." Current shows only "Make an Enquiry" — the second button appears to be missing entirely here (not just low-contrast, unlike the specialist panel section above) — confirm and add back.
- **Flag for team decision**: Unlike other pages, this looks like an intentionally customized CTA for the JME page rather than an instance of the shared site-wide CTA component. Confirm with the team whether JME-specific messaging is desired here; either way, the missing second button should be restored.

### 8. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–5.

---

## Comparison 7: Reporting Services ("Other Reporting Services") Page (submitted 2026-07-04)

### 1. Hero Section
- **Breadcrumb too deep (recurring)**: Target is "HOME · SERVICES · OTHER REPORTING SERVICES" (3 levels); Current is "HOME › OUR SERVICES › MEDICO-LEGAL SERVICES › OTHER REPORTING SERVICES" (4 levels) — same extra-crumb pattern flagged on the IME and JME pages.
- **Extra eyebrow label (recurring)**: Current adds "MEDICO-LEGAL SERVICES" above the heading; Target has none.
- **Shield graphic present where Target has none**: Unlike the IME/JME pages (where Target *does* show the shield graphic), Target's hero on this page has **no** shield/scale icon at all — just heading and subtext. Current still renders the shield graphic here, which both adds an element Target doesn't want on this specific page *and* triggers the recurring heading/graphic overlap bug ("Beyond the Examination" text overlapping the icon). Confirm whether the shield graphic should be page-specific (present on IME/JME, absent on Reporting Services) or standardized — either way, Current shouldn't show it here to match Target.
- **Stray visual artifact (recurring)**: The thin horizontal white line bug appears again above the heading in Current.
- **Extra subtext paragraph (recurring pattern)**: Current adds hero body copy ("A full suite of specialist reporting services beyond the standard IME — File Reviews, Supplementary Reports, Medical Negligence opinions, Teleconferences, and Expert Evidence.") not present in Target — Target's hero has heading only, no subtext, consistent with the IME/JME pages.

### 2. "Five Ways to Get the Specialist Opinion You Need" section — structural rebuild needed
Same pattern as the IME/JME "intro" sections rebuilt earlier:
- **Missing images throughout**: Target alternates a two-column image+text layout across all 5 items (File Review, Supplementary Report, Medical Negligence, Teleconference, Expert Evidence), each with a large image placeholder on one side. Current drops all images entirely, replacing them with a single-column, icon-led text layout for each item.
- **Heading structure differs**: Target uses the plain service name as the heading (e.g. "File Review," "Medical Negligence"). Current instead uses a descriptive marketing-style headline (e.g. "A Paper-Based Specialist Opinion," "An Opinion on Standard of Care") and demotes the actual service name to a small eyebrow label above it (e.g. "FILE REVIEW," "MEDICAL NEGLIGENCE"). Confirm with the team which heading convention is intended — if Target's plain naming is correct, Current's marketing headlines should be removed or relocated as sub-text rather than replacing the primary heading.
- **Bullet style differs**: Target's "When to Request" lists use plain bullet dots; Current uses checkmark icons — minor style inconsistency to align.
- **Extra buttons added**: Current adds a "Make an Enquiry" button under every one of the 5 items; Target has no buttons in this section at all.
- Recommend rebuilding this section to match Target's alternating two-column image/text layout, restore plain service-name headings, remove the added per-item buttons, and switch bullets back to plain dots.

### 3. Bottom CTA section
- **Low-contrast/illegible text bug (recurring)**: The "GET STARTED" eyebrow and the "View Specialist Panel" button both render washed-out/illegible in Current, same as prior pages.
- **Copy trimmed and slightly altered (recurring pattern)**: Target: "Whether you have a specific referral or need guidance on the most suitable service, we are here to make the process simple, efficient, and responsive from the very start." Current: "Whether you have a specific referral or need guidance on the most suitable **reporting** service, we are here to make the process simple, efficient, and responsive." — adds the word "reporting" but drops the closing "from the very start," matching the same trimming pattern seen on the IME page.

### 4. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–6.

---

## Comparison 8: Administrative Services Page (submitted 2026-07-04)

### 1. Hero Section
- **Breadcrumb too deep (recurring)**: Target is "HOME · SERVICES · ADMINISTRATIVE SERVICES" (3 levels); Current is "HOME › OUR SERVICES › MEDICO-LEGAL SERVICES › ADMINISTRATIVE SERVICES" (4 levels) — same pattern flagged on IME, JME, and Reporting Services pages.
- **Extra eyebrow label (recurring)**: Current adds "MEDICO-LEGAL SERVICES" above the heading; Target has none.
- **Shield graphic present where Target has none (recurring)**: As with the Reporting Services page (Comparison 7), Target's hero here has no shield/scale icon — heading and subtext only. Current still renders the shield graphic, which both adds an unwanted element and triggers the recurring heading/graphic overlap bug ("Support Services" text overlapping the icon). This is now the second page confirming the shield graphic should likely be conditional/removed rather than shown on every inner-page hero — worth fixing once, site-wide.
- **Stray visual artifact (recurring)**: Thin horizontal white line bug appears above the heading in Current again.
- **Extra subtext paragraph (recurring pattern)**: Current adds hero body copy ("The coordination, logistical, and document-management tasks that support every medico-legal assessment — Surrogate Assessments, Interpreter Bookings, Brief Reduction, and Letter of Instruction Review.") not present in Target — Target's hero is heading-only, consistent with the IME/JME/Reporting Services pages.

### 2. "The Detail Work, Handled for You" section
- **Broken rich text**: Current renders literal `[[Handled for You]]` brackets instead of styled blue text.
- **Missing image**: Target is a two-column layout with an image placeholder (person icon) on the right; Current is single-column text only, no image — same pattern as prior service pages.
- **Extra button**: Current adds a "Make an Enquiry" button not present in Target.
- Body copy otherwise matches well between the two.

### 3. "Four Services. One Less Thing to Manage." section
- **Card design differs significantly**: Target's 4 cards each feature a large image-placeholder area (roughly two-thirds of the card) with an icon, and a white footer strip showing just the service name plus a "+" expand/collapse icon — descriptions are hidden behind the accordion toggle by default. Current's cards are much simpler: small icon top-left, heading, and the full description paragraph shown directly with no image and no expand/collapse interaction.
- **Card order differs**: Target order is Surrogate Assessment Service / Interpreter Booking Service (top row), Brief Reduction Service / Letter of Instruction Review (bottom row). Current swaps Interpreter Booking Service and Brief Reduction Service, placing Brief Reduction Service next to Surrogate Assessment Service instead.
- Recommend rebuilding these cards to match Target: add image placeholders, hide descriptions behind a "+" accordion toggle, and correct the card order.

### 4. "Simple to Request, Seamless to Deliver" (process) section
No meaningful differences — the 4-step process (Submit Your Request, VERIFY Confirms, We Coordinate, Seamless Delivery) matches in both content and layout.

### 5. Bottom CTA section
- **Heading differs — custom vs standard CTA (recurring pattern)**: Target uses the standard site-wide heading "Ready to Refer Your Next Matter to VERIFY?" Current instead uses a page-specific heading, "Need Support on a Matter?" — same pattern as the JME page's customized CTA (Comparison 6).
- **Subtext differs accordingly**: Target's standard copy is replaced in Current with page-specific copy: "Tell us what you need and our team will coordinate the details — so you can stay focused on the matter itself."
- **Low-contrast/illegible text bug (recurring)**: The "GET STARTED" eyebrow and the second button both render washed-out/illegible in Current.
- **Second button unclear**: Target's second button reads "View Specialist Panel." Current has a second button present but its label is illegible due to the contrast bug — confirm intended label (possibly "Back to Services" based on a faint outline, but needs verification in dev tools) once contrast is fixed.
- **Flag for team decision**: As with the JME page, confirm whether this page-specific CTA messaging is intentional; regardless, the second button needs to be legible and correctly labeled.

### 6. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–7.

---

## Comparison 9: Specialists / Specialist Panel Page (submitted 2026-07-04)

### ⚠️ Headline issue: this page has a fundamentally different structure/purpose between Target and Current
- **Target** is the actual **live specialist directory**: a "Search the directory" tool (search box + filter by specialty/accreditation/location + "Clear Filters") sitting directly above a full grid of ~26 individual specialist cards (photo, name, specialty, credentials, consulting locations, "View Profile" + "Request Availability" buttons per card).
- **Current** has been rebuilt as a **navigation hub page**: an intro ("Find the Right Specialist") followed by just 4 large link-out cards — "Specialist Panel" (→ Browse Specialists), "Specialty List" (→ View Specialties), "Specialist Availability" (→ Check Availability), "Join the Expert Panel" (→ Join Expert Panel) — with no specialist directory, search, or filtering shown on the page at all.
- This is a content-architecture decision, not a simple styling bug — recommend confirming with the team whether Current's hub-and-spoke approach (with the directory presumably living on a separate "Browse Specialists" sub-page) is the intended new design, in which case Target's reference screenshot is now out of date, or whether Target's single-page searchable directory is still correct and Current needs the directory rebuilt here. Everything below assumes Target is still the intended design.

### 1. Hero Section
- **Heading differs**: Target "Our Panel of Medical Specialists"; Current "Our Specialists" — much shorter, consistent with the hub-page pivot.
- **Missing breadcrumb**: Unlike other inner pages (which had breadcrumbs that were too deep), this page's Current version has **no breadcrumb at all**; Target shows a simple "HOME · SPECIALIST PANEL."
- **Subtext copy differs entirely**: Target: "At VERIFY, we work with a variety of medical specialists to provide a service uniquely catered to our clients. Our specialists are highly skilled professionals committed to the highest standards of professionalism, accuracy and impartiality." Current: "Explore VERIFY's panel of medical and allied-health experts — browse by specialty, or view current appointment availability. Specialists interested in medico-legal work can also join our panel." — reflects the hub-page pivot rather than a simple copy edit.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs seen on every other inner page.

### 2. Main content section — directory vs. navigation cards
See headline issue above. If reverting to Target's directory approach:
- Need to rebuild the search/filter toolbar (search box, specialty/accreditation/location dropdowns, "Clear Filters" button).
- Need to render the full specialist grid inline with photo, name, specialty, credentials, consulting locations, and both "View Profile" and "Request Availability" buttons per card.
- **Low-contrast text bug (recurring, new location)**: Within Current's 4 hub cards, the small italic subtitle line under each card title ("Full expert directory," "Current appointments," "For medical specialists") renders in a washed-out/low-contrast color against its card background — same class of contrast bug flagged repeatedly on other pages, here showing up even within light-content cards, not just dark hero/CTA sections.

### 3. Bottom section — "Online Booking Portal" feature entirely missing
- **Target** has a distinct feature-promo section: eyebrow "EVERYTHING YOU NEED, IN ONE PLACE," heading "Online Booking Portal," descriptive copy about real-time specialist scheduling and documents, three quick-link buttons (Specialist Availability, Download Specialist CV, Sample Redacted Report), and two primary actions ("Send Enquiry" button + a "07 3356 0469" phone-number button).
- **Current** replaces this entirely with a generic CTA: eyebrow "GET STARTED," heading "Need Help Choosing a Specialist?," different supporting copy, and two buttons ("Make an Enquiry" / "Contact Us"). The entire Online Booking Portal feature (with its three quick-link buttons and phone-number CTA) is missing from Current.
- **Visual bug — misplaced shield icon**: In Current, a VERIFY shield/logo icon appears to float awkwardly within this CTA section, seemingly out of place compared to Target, which has no icon here.
- **Stray white line bug appears outside the hero**: The recurring horizontal white line bug also shows up within this dark CTA section in Current, not just in page heroes — suggesting this is a broader shared-component/divider-rendering bug rather than something isolated to hero sections specifically.
- **Low-contrast text bug (recurring)**: The "GET STARTED" eyebrow and the "Contact Us" button both render illegibly against the dark background, consistent with the pattern on other pages.
- Recommend confirming with the team whether the Online Booking Portal feature should be restored here (likely yes, since it references specific functionality — CV downloads, sample reports, phone contact — that doesn't appear to exist elsewhere on the Current site).

### 4. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–8.

---

## Comparison 10: Specialty List Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb**: Target shows "HOME · SPECIALISTS · SPECIALTY LIST"; Current has no breadcrumb at all — same gap flagged on the Specialists hub page (Comparison 9), suggesting breadcrumbs may be missing across the whole Specialists section rather than just one page.
- **Stray visual artifact (recurring)**: The thin horizontal white line bug appears above the heading again in Current.
- Heading, subtext copy, and shield graphic otherwise match well between Target and Current on this page (no overlap issue observed here, unlike other inner pages).

### 2. "Explore Our Specialties" / specialty list section — significant content and structure gap
- **Filter tabs match**: Both versions have the same category filter tabs (All, Surgery, Psychiatry & Psychology, Medicine, Allied Health) — good consistency here.
- **List item format differs substantially**: Target's list items are content-rich — each specialty shows a full descriptive paragraph and a "KEY AREAS" tag list (e.g. Orthopaedic Surgery: Hip & knee, Shoulder & elbow, Hand & wrist, Foot & ankle, Trauma, Sports medicine) visible by default, plus a "View/Hide specialists" toggle that reveals full specialist cards (photo, name, specialty, location, "View Profile") for that category. Current's list items are much sparser in their collapsed state — just the specialty name, a numeric badge showing specialist count, and a "+" expand icon, with no visible description or key-area tags until expanded (no expanded state was available to compare, so it's unclear whether the richer content exists behind the "+" or is missing altogether — worth checking in the live build).
- **Specialty taxonomy differs**: Target lists 16 broader specialty categories (e.g. "General Surgery," "Pain Medicine," "Psychology," "Otolaryngology – Head and Neck Surgery"). Current lists 19 more granular categories with different names and splits — e.g. "General & Colorectal Surgery" instead of "General Surgery," "Pain Medicine & Anaesthesia" instead of "Pain Medicine," "Clinical & Consulting Psychology" instead of "Psychology," "ENT/Otolaryngology" instead of "Otolaryngology – Head and Neck Surgery," plus an added "Adult Psychiatry" category not present in Target at all. Current also appears to break out what Target treats as sub-tags under "Orthopaedic Surgery" (Hip & Knee, Foot & Ankle, Hand & Upper-Limb, Trauma) into separate top-level specialty categories ("Hip & Knee Arthroplasty," "Foot, Ankle & Trauma Surgery," "Hand & Upper-Limb Surgery"). This looks like a genuine content/taxonomy decision rather than a simple bug — flag for the team to confirm which categorization scheme is correct before reconciling.

### 3. Missing "Good to Know" callout
- Target includes a callout at the bottom of the specialty list: "GOOD TO KNOW — Can't find the specialty or specialist you need? We work with an extended network of specialists beyond those listed on our website. Contact our team to see how we can assist with your matter," with a "Contact Us" link. This callout is entirely missing from Current.

### 4. "Online Booking Portal" section
✅ This section matches well between Target and Current — same eyebrow, heading, description, three quick-link buttons (Specialist Availability, Download Specialist CV, Sample Redacted Report), and the "Send Enquiry" + phone number CTAs. Worth noting as a positive reference point: this is the correct implementation of the section that was found entirely missing on the Specialists hub page (Comparison 9) — that page's version should be brought in line with this one.

### 5. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–9.

---

## Comparison 11: Join Expert Panel Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb (recurring)**: Target shows "HOME · SPECIALISTS · JOIN EXPERT PANEL"; Current has no breadcrumb — consistent with the same gap on the Specialists hub and Specialty List pages (Comparisons 9–10), reinforcing that breadcrumbs are likely missing across the entire Specialists section rather than on individual pages.
- **Stray visual artifact (recurring)**: Thin horizontal white line bug appears above the heading again.
- **Button label differs**: Target's first hero button reads "Join Expert Panel"; Current's reads "Express Your Interest" instead — different label for what should be the same primary CTA (both presumably link to the enquiry form further down the page).
- Heading, subtext, and the phone-number button otherwise match.

### 2. "About Our Panel" section
- **Broken rich text**: Current renders literal `[[Quality & Integrity]]` brackets instead of styled blue text.
- **Missing image**: Target is a two-column layout with an image placeholder on the right; Current is single-column, no image.
- **Extra button**: Current adds a "See Panel Benefits" button not present in Target.
- Body copy otherwise matches closely.

### 3. "What We Offer Our Panel Specialists" section
- Content and layout (6 cards: End-to-End Administrative Support, Quality You Can Stand Behind, Built Around Your Practice, Report Writing Mastery, Exclusive AAMLE Membership, A Genuine Partnership) match well, with Current's copy slightly condensed in a couple of cards (e.g. "Report Writing Mastery" ends more abruptly) — minor, low priority.
- **Visual bug — stray card highlight (recurring, more pronounced)**: The "Exclusive AAMLE Membership" card shows an unintended blue border/focus-state outline, and its icon renders with a filled dark background instead of the light background used on every other card — the same class of "stuck focus state" bug flagged on the Team and JME pages, but visually more noticeable here since it also affects the icon styling.

### 4. "Express Your Interest" (Enquiry Form) section — layout and field rebuild needed
- **Layout differs substantially**: Target uses a two-column layout — left side has an eyebrow ("GET IN TOUCH"), heading, intro paragraph, separate icon-led contact items (email, phone), and an info callout box ("We will be in touch within 2 business days..."); right side has a distinct card-styled "Enquiry Form" panel. Current collapses this into a single-column, unboxed layout with no eyebrow, contact details folded into a plain sentence within the intro paragraph instead of separate icon items, and no callout box — followed directly by a plain (non-card) form.
- **Form fields differ**: Target's fields are First Name*, Last Name*, Email Address*, Phone Number, Medical Specialty, Message. Current relabels "Medical Specialty" as "Specialty / Discipline," relabels "Message" as "Tell us about your experience," and adds an extra "Qualifications" field not present in Target at all.
- **Submit button label differs**: Target reads "SEND ENQUIRY"; Current reads "Submit Expression of Interest."
- Recommend rebuilding this section to match Target's two-column layout with the card-styled form, restoring the separate contact-info block and callout, and confirming with the team whether the added "Qualifications" field and relabeled fields should be kept (they may be a deliberate refinement for this specific "join panel" context) or reverted to match Target exactly.

### 5. Bottom CTA section — entire section not present in Target
- **Target has no bottom CTA band on this page at all** — the page ends directly after the Enquiry Form section, straight into the footer.
- **Current adds an entire additional CTA section** not present in Target: eyebrow "GET STARTED," heading "Ready to Join VERIFY?," supporting copy, and two buttons ("Express Your Interest" + a second, illegible button).
- **Low-contrast/illegible text bug (recurring)**: As on other pages, the "GET STARTED" eyebrow and the second button both render washed-out/illegible against the dark background.
- **Flag for team decision**: Since Target doesn't have this section at all, confirm whether Current's addition should be kept for consistency with other service pages (recommended, since most other pages do have a closing CTA) or removed to match Target's page-ending exactly. If kept, the contrast bug still needs fixing and the second button's label needs confirming.

### 6. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–10.

---

## Comparison 12: Information for Clients Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb + stray floating tab bug**: Target shows "HOME · INFORMATION CENTRE · FOR CLIENTS." Current has no breadcrumb, but instead shows a small floating pill/tab element reading "How We Support You" positioned oddly at the boundary between the hero and the content below — looks like a broken anchor-nav or tab component rendering in the wrong place. This is a distinct bug from the simple "missing breadcrumb" pattern seen on the Specialists pages and should be investigated separately (likely a misplaced in-page nav/anchor component rather than an absent breadcrumb).
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs as other inner pages — shield graphic overlaps the heading text.
- Subtext copy matches between Target and Current.

### 2. "How We Support You" section
- **Broken rich text**: Current renders literal `[[report delivery]]` brackets instead of styled blue text.
- **Missing image**: Target is two-column with an image placeholder on the right; Current is single-column, no image.
- **List formatting downgraded (recurring pattern)**: Target presents "Appointment coordination," "Brief and document management," and "Quality-assured reporting" as a 3-column grid of bordered cards, each with an icon, heading, and description. Current collapses these into a plain inline bulleted list under an added intro line "What we help with" — same downgrade pattern seen on the IME/JME/Client-info-style sections on earlier pages.
- **Extra button**: Current adds a "View Our Services" button not present in Target here.

### 3. "Comprehensive Medico-Legal Services" section
- **Card count/content differs**: Target shows 8 cards — IME, JME, File Review, Supplementary Report, Teleconference, Expert Evidence, Surrogate Assessment & Interpreter Booking Service, Brief Reduction & LOI Review Service. Current shows only 6 — IME, JME, File Review, Supplementary Report, Medical Negligence, and a combined "Teleconference & Expert Evidence" card. Current is missing "Surrogate Assessment & Interpreter Booking Service" and "Brief Reduction & LOI Review Service" as distinct cards, has merged Teleconference and Expert Evidence into one card, and has added "Medical Negligence," which isn't part of Target's set here.
- **Missing CTA buttons**: Target has "View Medico-Legal Services" and "View Specialist Panel" buttons below the grid; Current has neither.
- **Inconsistent "active" card state**: Target shows "Joint Medical Examination (JME)" in a highlighted/selected state; Current highlights "File Review" instead. Worth checking whether this highlight is meant to be a fixed default or driven by some interactive/contextual logic — the mismatch may indicate the active-state logic itself is behaving unpredictably rather than just picking a different card.

### 4. "Our Process" section
- Content and layout (6-step process: Enquiry & Referral, Specialist Matching, Appointment Coordination, Examination & Drafting, Quality Assurance Review, Report Delivery) match well.
- **Missing "Good to Know" callout**: Target has a callout beneath the process steps — "Each service may follow a slightly different workflow. Our team is always happy to walk you through what to expect for your specific matter," with a "Contact Us →" link. This is missing entirely from Current.

### 5. "Minimising Your Client's Report Costs" section
No meaningful differences — the 3 cards (Keep the Brief and LOI Focused, Send material at least 5 business days before, Flag attendance risks early) and the closing Terms & Conditions note both match well.

### 6. "Client FAQs" section
- Content matches closely — both list the same 15 questions in the same order. Good consistency here.
- **Icon style differs**: Target uses chevron-down (˅) icons for the accordion toggles; Current uses plus (+) icons — minor style inconsistency, low priority.
- **Missing callout styling**: Target's closing "Have a question that is not covered here?" note is presented in a styled light-blue rounded callout box with icon and separately formatted email/phone lines. Current shows the same text as plain, unstyled paragraph text with no box, icon, or visual separation.

### 7. Bottom CTA section
- Heading and eyebrow copy match the standard site-wide CTA ("Ready to Refer Your Next Matter to VERIFY?") — good, this page correctly uses the shared component rather than a custom variant.
- **Low-contrast/illegible text bug (recurring)**: The "GET STARTED" eyebrow renders washed-out/illegible in Current, consistent with other pages.
- **Missing second button**: Target has both "Make an Enquiry" and "View Specialist Panel"; Current shows only "Make an Enquiry" — the second button is missing entirely here (not just illegible).

### 8. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–11.

---

## Comparison 13: Information for Claimants Page (submitted 2026-07-04)

### 1. Hero Section
- **Stray floating tab bug confirmed as recurring**: Current shows a floating pill/tab reading "Your Examination" positioned oddly at the hero/content boundary — the same broken component flagged as "How We Support You" on the Information for Clients page (Comparison 12). This confirms it's a pattern affecting the Information Centre section broadly, not a one-off, and no breadcrumb renders here either.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs as other inner pages.
- **Subtext reworded**: Target: "Attending an independent medico-legal examination? Here's what to expect, how to prepare, and everything you need to know before and on the day." Current: "Attending an independent medico-legal examination — what to expect, what to bring, how to prepare, and answers to the questions claimants ask us most." — different phrasing conveying similar meaning; low priority but worth aligning if exact copy matters.

### 2. "Your Examination Step by Step" section — structural rebuild needed
- **Layout differs completely**: Target uses a compact two-column layout — left side has eyebrow "PROCESS OVERVIEW," heading, and intro paragraph; right side is a simple numbered list (01–05), each with a bold heading and description line, no graphic stepper. Current instead renders this as a large vertical timeline with big circular numbered icons (01–05) connected by a vertical line, each with its own icon, heading, and description below it — a much heavier visual treatment.
- Recommend rebuilding to match Target's compact two-column text list rather than the vertical timeline graphic.

### 3. "What to Expect — Every Step of the Process" (Appointment Guide) section — significant styling regression
- **Broken/unstyled appointment-type selector**: Target shows two clearly styled, selectable toggle cards ("In-Person Appointment" / "Videolink Appointment") with icons and sub-labels. In Current, this renders as plain run-together text with no card styling or spacing ("In-Person AppointmentAt a clinic or examination centreVideolink AppointmentFrom your home or a private location") — looks like a CSS/component rendering failure rather than an intentional simplification.
- **Tab content unstyled**: The three tabs ("Before You Attend," "On the Day," "What Happens Next") do render as buttons in Current, but the content beneath them appears as plain, unstyled paragraph/dash-list text rather than Target's structured layout with distinct "Complete your paperwork" / "Notify us of any special needs" blocks.
- **Missing card grid**: Target presents "What to bring," "What to wear," and "When to arrive" as a 3-column grid of bordered cards with bullet lists. Current shows this same content as plain unstyled text blocks with dash-prefixed items, with no card borders or column layout.
- This entire section needs a full rebuild/restyling to match Target — it looks like a genuine implementation bug (missing CSS/component) rather than a design decision, given how broken the text rendering appears.

### 4. "Watch Our Preparation Guide" (video) section
No meaningful differences — video embed, heading, and subtext all match between Target and Current.

### 5. "Frequently Asked Questions" section
- Content matches — both list the same 15 questions in the same order.
- **Icon style differs (recurring)**: Target uses chevron-down icons; Current uses plus icons — same minor inconsistency flagged on the Information for Clients page.
- **Missing callout styling (recurring)**: Target's "Have a question that is not covered here?" note is in a styled light-blue callout box with icon; Current shows the same text unstyled, with no box or icon — same pattern as the Clients page.

### 6. "Where to Find Us" section
- Map, address, and the three action buttons (Get Directions, phone, Email Us) match between both.
- **Missing wayfinding detail**: Target's info panel includes "Office Hours" (with a note about 7:45am appointments), "Recommended Public Transport" (specific transit stops and walking distances), and "Nearby Car Parks" (named car parks with pricing/height and a parking availability note). Current's panel is condensed to just "Brisbane (Head Office)," Address, Contact, and Opening Hours — missing the Public Transport and Nearby Car Parks sections entirely. This is a genuine content loss that reduces practical usefulness for claimants finding the office; recommend restoring.

### 7. Bottom CTA section — entire section not present in Target
- **Target has no CTA band on this page** — it goes straight from "Where to Find Us" into the footer.
- **Current adds an entire CTA section** not present in Target: heading "Have a Question About Your Examination?," supporting copy, and a single "Make an Enquiry" button. This is the same "Current adds an extra CTA section Target doesn't have" pattern seen on the Join Expert Panel page (Comparison 11).
- **Flag for team decision**: Confirm whether this addition should be kept for consistency with other pages (likely fine, unlike the Join Expert Panel case this one isn't visibly broken/low-contrast) or removed to match Target's page-ending exactly.

### 8. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–12.

---

## Comparison 14: "In the Loop" Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb (recurring)**: Target shows "HOME · IN THE LOOP"; Current has none.
- **Missing category tab bar**: Target has a full horizontal tab/anchor-nav bar directly below the hero (Latest, News & Updates, AAMLE Events, Industry Insights, Specialist Spotlights, Resources, QA Insights, Staff Narratives) with "Latest" active by default. This entire navigation bar is missing from Current.
- **Wrong hero graphic**: Target's hero shows a page-specific image placeholder (with a small "SCROLL TO EXPLORE" indicator) rather than the shield/scale icon. Current shows the generic shield graphic instead — same "shield shown where Target wants something else" pattern flagged on the Reporting Services and Administrative Services pages (Comparisons 7–8), now confirmed on a fourth page.

### 2. "Featured" section — component/pattern mismatch
- **Target**: A single large featured-article carousel — one prominent card with a big image, category tag ("FEATURED · INDUSTRY INSIGHTS"), headline, excerpt, byline, "Read Full Article →" link, plus carousel arrows and dot indicators suggesting multiple rotating slides.
- **Current**: A "Featured Reading" section instead — 3 equal-sized cards in a static grid, each with a small image, category tag, headline, one-line excerpt, and "Read More →," plus a "View All" link.
- This is a genuine component/pattern difference (single rotating featured hero vs. static 3-card grid), not just a styling tweak — recommend confirming with the team which pattern is intended before rebuilding.

### 3. "Latest from VERIFY" (News & Updates) section
- Content matches (same 3 articles, same headlines/dates).
- **Category tag genericized**: Target shows specific tags per article ("COMPANY NEWS," "INDUSTRY NEWS"); Current shows a uniform "NEWS & UPDATES" tag on all three, losing the more specific per-article categorization.

### 4. "Upcoming Webinars & Training" (AAMLE Events) section
- **Missing 4th event**: Target shows 4 events in a 2×2 grid; Current shows only 3 in a single-column list — missing Target's "Orthopaedic Impairment Assessment Update" entry.
- **Card design differs**: Target uses a compact date-badge (day/month box) plus CPD-eligible/Free status tags; Current uses a full-width card with an image placeholder instead of the date badge, and no CPD-eligible/Free tags at all.
- **Link label differs**: Target reads "Register Now →"; Current reads "More Info →."
- "View All Events" link present in both.

### 5. "Practical Knowledge for Practitioners" (Industry Insights) section
- Content matches (same 3 articles).
- **Category tag genericized (recurring)**: Target shows specific tags per article ("PRACTICE GUIDE," "LEGAL FRAMEWORK," "CLINICAL"); Current shows a uniform "INDUSTRY INSIGHTS" tag on all three.

### 6. "Meet the Experts Behind the Reports" (Specialist Spotlights) section
- Content matches (same 3 articles).
- **Category tag genericized (recurring)**: Target shows specific tags ("ORTHOPAEDICS," "PSYCHIATRY," "PAIN MEDICINE"); Current shows a uniform "SPECIALIST SPOTLIGHTS" tag on all three.

### 7. "Guides, Checklists & Templates" (Resources) section
- Content matches (same 3 resources).
- **Audience-segment tag missing**: Target shows a tag combining resource type and audience ("CHECKLIST — CLIENTS," "GUIDE — CLIENTS," "GUIDE — CLAIMANTS"); Current drops this tag entirely, using only a plain icon-prefixed link ("↓ Download Checklist," "→ Read Guide") with no audience labeling.

### 8. "From VERIFY's Quality Assurance Team" (QA Insights) section
- **Missing content**: Target shows 5 articles (In the Loop Vol. 24–27 plus "The IME Report Quality Checklist"); Current shows only 3 (Vol. 25–27), missing Vol. 24 and the Quality Checklist piece, and in a different order.
- Category tag ("QA INSIGHTS") is consistent between both — no genericization issue here, unlike the sections above.

### 9. "Insights from the VERIFY Team" (Staff Narratives) section
- **Missing content and missing author attribution**: Target shows 4 articles in a 2×2 grid, each with the author's photo, name, and role (Sarah Mitchell – Case Coordinator Manager, James Tran – Quality Assurance Lead, Emma Kowalski – Client Experience Manager, Dr. Michael Hayes – Clinical Advisor). Current shows only 2 articles, with no author photo, name, or role shown on either card at all — losing both half the content and the entire author-attribution treatment.
- **Category tag genericized (recurring)**: Target shows role-based tags ("COORDINATION," "QUALITY ASSURANCE," "CLIENT EXPERIENCE," "CLINICAL INSIGHTS"); Current shows a uniform "STAFF NARRATIVES" tag.

### 10. "Be the First to Know" (Newsletter) section
No meaningful differences — heading, subtext, email input, Subscribe button, and privacy note all match well.

### 11. Footer — data error
- **Wrong phone number**: Current's footer shows "07 5794 0469" under Contact, which doesn't match the "07 3356 0469" used consistently everywhere else on the site (including Target's version of this same page). This looks like a genuine data/typo bug rather than a design difference and should be corrected.
- Current also includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–13.

---

## Comparison 15: Events & Seminars — Target has 2 separate pages, Current has 1 combined page (submitted 2026-07-04)

### ⚠️ Headline issue: page count mismatch
Target implements this as **two distinct pages**, each with its own dedicated hero, breadcrumb, and full searchable/filterable listing:
- **"Upcoming Events"** page — heading "Explore Upcoming Medico-Legal Education Events," breadcrumb "HOME › UPCOMING EVENTS," full list of 5 upcoming events with a search/filter toolbar.
- **"Past Events"** page — heading "Explore Past Medico-Legal Education Events," breadcrumb "HOME › PAST EVENTS," full list of 8 past events with the same search/filter toolbar.

Current implements this as a **single combined "Events & Seminars" page** with one generic hero, no breadcrumb, a promotional carousel section not present in Target at all, and two abbreviated preview sections (3 items each, with "view more" links) instead of full listings.

This is a genuine information-architecture gap, not a styling issue — recommend splitting Current into the same two dedicated pages as Target, each with its own full listing and search/filter functionality, rather than trying to patch the combined page. Detail below assumes that split happens; sub-points describe what each rebuilt page needs to match.

### 1. Hero Section (both target pages)
- **Heading is generic instead of page-specific**: Current's single hero reads "Medico-Legal Education for Better Practice" for both use cases, rather than Target's distinct "Explore Upcoming..." / "Explore Past..." headings — this naturally resolves once split into two pages.
- **Missing breadcrumbs (recurring)**: Neither Target heading variant currently appears in Current at all, and no breadcrumb renders — consistent with the missing-breadcrumb pattern flagged on other sections (Specialists, Information Centre).
- **Extra subtext not in Target**: Current's hero adds body copy ("VERIFY and AAMLE host practical education, industry briefings, specialist-led seminars, and professional networking events for legal, medical, and insurance professionals.") that neither of Target's dedicated hero designs include.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs seen on every other inner page.

### 2. Missing search/filter toolbar
- Both of Target's dedicated pages include a full toolbar directly below the hero — a search input, a "Dates" picker, filter/sort icon controls, and a "Search" button — sitting directly above the full event list. This toolbar is entirely absent from Current's combined page.

### 3. Extra "Four Ways VERIFY Brings Medico-Legal Learning to Life" carousel — not present in either Target page
- Current adds a substantial promotional section (eyebrow "PROGRAMS & PARTNERSHIPS," heading, an interactive carousel showing numbered slides like "02/04 'Specialist Insights' Presentations" with tag pills "Specialist voices," "Clinical clarity," "Case context," pause/navigation controls, and a graphic side panel) that has no equivalent anywhere in Target's Upcoming Events or Past Events page designs.
- Recommend confirming with the team whether this is an intentional new addition worth keeping (and if so, where it should live — perhaps as its own standalone content block) or whether it should be removed since it doesn't correspond to anything in Target's reference design.

### 4. Upcoming events content — condensed preview vs. full list
- **Missing events**: Target's full Upcoming Events page lists 5 events (Reading a Medico-Legal Report, Psychiatric IMEs: What Practitioners Need to Know, Expert Evidence Essentials for Litigation Teams, Orthopaedic Impairment Assessment Update, Claimant Communication and Examination Preparation). Current's "Latest Medico-Legal Education Events" preview section shows only the first 3, with a "View more upcoming events →" link presumably intended to lead to a fuller listing that doesn't currently exist as a dedicated page.
- **Card details differ**: Target's cards show a full description, and separate calendar/clock/location icon rows for date, time, and location, with a "MORE INFO" button. Current's cards condense date/time/location onto fewer lines and add a category tag (WEBINAR / SPECIALIST SEMINAR / NETWORKING EVENT) not present on Target's Upcoming Events cards, with a "More info →" text link instead of a bordered button.

### 5. Past events content — condensed preview vs. full list
- **Missing events**: Target's full Past Events page lists 8 events (Navigating Queensland CTP Reforms, AMA Guides 6th Edition Practical Refresher, Breakfast Seminar with Dr Ashwani Garg, Medico-Legal Report Writing Masterclass, Quality Assurance in Expert Evidence, Pain Medicine in Personal Injury Claims, Common Brief Preparation Errors, Psychiatric Injury Claims Workshop). Current's "Recent VERIFY & AAMLE Programs" preview section shows only the first 3, with a "View more past events →" link.
- **Card details differ**: Same pattern as the upcoming-events cards — Current adds a category tag (WORKSHOP / WEBINAR / BREAKFAST SEMINAR) not present on Target's Past Events cards, and uses "View recap →" as a text link rather than Target's bordered "VIEW RECAP" button.

### 6. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–14.
- Phone number is correct here ("07 3356 0469") — unlike the "In the Loop" page (Comparison 14), no data error found on this page's footer.

---

## Comparison 16: Contact Us Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb**: Target shows "HOME · CONTACT US"; Current has no breadcrumb, showing only a small "CONTACT" label in its place — not an actual breadcrumb path, just a category label.
- **Heading line-break/color treatment differs**: Target displays the heading as two distinct lines ("Make an Enquiry" / "or Book a Service") with a color change between lines (white, then light blue). Current wraps it differently as a single flowing heading, with the color change applied mid-sentence rather than per-line.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs as other inner pages — "Book a Service" overlaps the shield graphic in Current.
- Subtext copy and the contact-details row (phone, email, hours) match closely between both — good consistency here.

### 2. Enquiry form + Online Booking Portal section — layout and field rebuild needed
- **Layout differs substantially**: Target uses a two-column layout — a card-styled "Send Us Your Enquiry" form on the left, and a separate "Online Booking Portal" sidebar card on the right (with login CTA, registration info, "Call" button, and a vertical checklist of portal features). Current stacks everything in a single column: an unboxed, unstyled form with no "Send Us Your Enquiry" heading, followed by the Online Booking Portal content rebuilt as a full-width dark blue band with the checklist rendered as a 2-row card grid instead of a simple list.
- **Form field differences**:
  - Target fields: First Name*, Last Name*, Email Address*, Phone Number, Company/Organisation, Type of Enquiry (dropdown), Message/Enquiry*.
  - Current fields: First Name*, Last Name*, Email Address*, Phone Number, Company/Organisation* (now required, wasn't in Target), **Your Role** (new dropdown field not in Target at all), Service Required* (dropdown — renamed from Target's "Type of Enquiry"), Matter Details/Message* (renamed from Target's "Message/Enquiry").
  - Confirm with the team whether the added "Your Role" field and the relabeled fields are an intentional refinement (plausible, since they add useful context) or should be reverted to match Target exactly.
- **Submit button styling differs**: Target's button reads "SEND ENQUIRY" in uppercase; Current's reads "Send Enquiry" in sentence case.
- **Extra eyebrow on Portal card**: Current adds a "CLIENT PORTAL ACCESS" eyebrow above the "Online Booking Portal" heading that Target's sidebar card version doesn't show.
- Recommend rebuilding this section into Target's two-column layout: card-styled form on the left, light sidebar Portal card (not a full-width dark band) on the right with the checklist restored to a simple vertical list.

### 3. "Where to Find Us" section
- Map, address heading, and the three action buttons (Get Directions, phone, Email Us) all present in both.
- **Missing wayfinding detail (recurring pattern)**: Same gap flagged on the Information for Claimants page (Comparison 13) — Target's info panel includes "Office Hours" (with the 7:45am appointment note), "Recommended Public Transport" (specific stations/stops and walking distances), and "Nearby Car Parks" (named car parks with heights/distances and a parking-availability note). Current's panel only shows "Brisbane (Head Office)," Address, Contact, and Opening Hours — missing Public Transport and Nearby Car Parks entirely. Since this same content is missing in the same way on two separate pages, it's likely sourced from one shared "location" content block that needs the additional fields restored once, rather than being fixed per-page.
- **Button style differs**: Target's three action buttons appear as outlined/bordered light buttons; Current's render as solid filled blue buttons — a styling inconsistency worth aligning.

### 4. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–15.
- Phone number is correct here ("07 3356 0469").

---

## Comparison 17: Make a Booking Page (submitted 2026-07-04)

### 1. Hero Section
- **Missing breadcrumb (recurring)**: Target shows "HOME · MAKE A BOOKING"; Current has none.
- **Heading/graphic overlap + stray line bugs (recurring)**: Same template-level bugs as other inner pages — "Booking" text overlaps the shield graphic.
- Subtext copy matches between Target and Current.

### 2. "Specialist Availability / Client Portal" split section
✅ No meaningful differences — layout, copy, and buttons ("View availability below," "Log In to Portal," "Register an Account") all match well between Target and Current.

### 3. "Available This Month" (Featured Specialists) section
- **Heading/eyebrow differs**: Target has eyebrow "FEATURED SPECIALISTS" with heading "Available This Month"; Current has just "Featured specialists" as a plain heading with no eyebrow and no "Available This Month" framing.
- **Missing subtext**: Target includes a description line ("A selection of our expert panel with current appointment availability across in-person and telehealth sessions."); Current has no subtext here.
- **Missing qualification tags**: Target's specialist cards show credential tags (e.g. "CIME," "GEPI 2," "AMA 5") beneath the specialty title; Current's cards drop these tags entirely, showing only name and specialty.
- Different specialists are featured between the two (seed/content data, not itself a design issue).

### 4. Availability list section
- **Extra intro paragraph**: Current adds an intro line above the color-coded legend ("Browse current availability for our featured specialists. Select the sessions that suit your matter and send us an enquiry — our team will confirm the booking with you.") that Target doesn't include — Target goes straight from the section above into the legend bar.
- **Missing specialist photos and credentials — major regression**: Target's availability list shows each specialist's actual photo, name, specialty, and qualification tags (e.g. "CIME (ABIME); GEPI 2; AMA 5") alongside their available session times. Current replaces the photos entirely with plain circular initials avatars (e.g. "AL," "AG," "JR") and drops the qualification tags altogether, showing only name and specialty.
- **Missing specialist entry**: Target lists 6 specialists with availability (Dr James Reidy, Dr Ashwani Garg, Dr Lucas Murphy, Dr Simon Perkins, Adj. Prof. Anna Lenardon, Ms Orla Fox); Current lists only 5, missing Ms Orla Fox (Occupational Therapist) entirely. Order also differs between the two lists.
- **Date discrepancy — likely not a bug**: Target shows December dates; Current shows July dates. Since this list is framed as "This Month," differing dates likely just reflect when each screenshot was captured relative to a dynamically generated "current availability" window, rather than an actual defect — flagging for awareness only, not as something to fix.

### 5. Bottom CTA section
- Heading matches the standard CTA ("Ready to Book Your Next Appointment with VERIFY?") — good, correctly using the shared component here.
- **Low-contrast/illegible text bug (recurring)**: The "GET STARTED" eyebrow and the "View Specialist Panel" button both render washed-out/illegible in Current, consistent with the pattern on other pages.

### 6. Footer
- Current again includes the under-logo tagline paragraph not shown in Target — same recurring inconsistency flagged in Comparisons 3–16.
- Phone number is correct here ("07 3356 0469").

---

## Comparison 18: Navigation structure — stray "Specialist Availability" nav item (submitted 2026-07-04)

### Header/navbar inconsistency
- In **Target**, the "Specialist Availability" functionality has been folded into the **Make a Booking** page (Comparison 17) — there is no separate standalone page or nav entry for it anymore.
- In **Current**, "Specialist Availability" still exists as its own item in the header/navbar (likely under the Specialists dropdown, consistent with the "Specialist Availability" card seen on the Specialists hub page in Comparison 9), pointing to what is presumably now an orphaned or redundant page.
- **Action needed**: Remove the standalone "Specialist Availability" nav entry from Current's header now that this content lives on the Make a Booking page, and check for any other internal links/buttons pointing to the old standalone page (e.g. the "Specialist Availability" card on the Specialists hub page from Comparison 9 may need its link/copy updated to point to Make a Booking instead, or be reconciled with this change).

---

## Comparison 19: Typography & text-colour token audit (CSS-level, 2026-08-06)

Unlike Comparisons 1–18 this is **not a screenshot comparison**. It is a mechanical
selector/property diff of `.design-reference/assets/css/styles.css` (+ `article.css`,
`events.css`, + each template's inline `<style>` block) against
`src/app/(frontend)/globals.css`, cross-checked against the rendered DOM with a
contrast audit over 12 representative pages.

The 107 reference HTML files collapse to **23 unique templates** by inline-`<style>`
hash — and 46 of them (index, every In-the-Loop article, every event, the legal pages)
carry no inline CSS at all, so that one cluster covers the homepage and all article
templates together.

**Method caveats** (so the numbers below are read correctly): `@media` blocks are
stripped before diffing, so responsive variants don't show as false positives, but
duplicate selectors are still last-wins; and the "missing selector" pass only sees
rules that declare a typography/colour property, so a build rule that sets only layout
on the same selector reads as "missing" when it isn't.

### 1. Fonts — the headline finding

The design reference uses **three** faces (`styles.css:23-24`, `1-8`):

| Role | Reference | Was in build |
| --- | --- | --- |
| Headings, buttons, nav, eyebrows | Montserrat | MuseoSansRounded |
| Body copy | Open Sans | MuseoSansRounded |
| Hero "VERIFY" definition word only | MuseoSansRounded 900 | MuseoSansRounded |

Both `--font-heading` and `--font-body` pointed at Museo, so a single licensed display
face was doing all three jobs. Fixed: Montserrat and Open Sans are now self-hosted
(`src/app/(frontend)/fonts/`, variable woff2, latin subset, ~123 KB total, no CDN
dependency at build or runtime) and Museo is reduced to a new `--font-display` token
with exactly one consumer, `.hero-def-word`.

296 CSS rules already routed through `var(--font-heading)`, so the switch was two lines
in `:root` — no rule-by-rule edit. `--font-heading` had been declared in **both**
`@theme` and `:root` and the two were out of sync; the `@theme` copy is gone and the
`font-heading` utility is now an `@utility` that reads the runtime var, so it honours a
Design System override (it previously did not).

### 2. Base text size

Reference: `body { font-size: 18px }` with `html` left at 16px (`styles.css:36`) — so
`rem` still resolves against 16px and only *inherited, unsized* text picks up 18px. The
build set no body size, leaving that text at 16px. Now `--font-size-base: 18px`,
editable via Design System → Typography. Most visible on article body copy (`.prose p`
has no explicit size).

### 3. Text colour was never tokenised — root cause of recurring issue #6

`--text-mid` was `#737373` in the build against **`#222222`** in the reference
(`styles.css:20`) — 115 rules consume it, so essentially all secondary copy site-wide
was lighter than target. Note the reference's naming is inverted: "mid" (#222222) is
*darker* than "dark" (#414042).

Critically, that value could not be fixed in CSS: `SiteSettings.colors.mutedText` is
stored in the database and inlined onto `<html>`, which outranks every `:root` rule —
and the branding seed **early-returned whenever a logo already existed**, so it could
never repair an established site. The seed's colour write is now an unconditional,
idempotent repair (fills empty fields, retires known-stale values, leaves deliberate
admin choices alone) and no longer suppresses revalidation, since the palette is read
through `getCachedGlobal`.

Dark-band text was previously flipped by **three hardcoded allowlists naming five
selectors**; anything outside them (rich-text prose, split-feature body, card meta)
kept its light-mode grey on dark at roughly 3:1. Replaced with a `.vf-on-dark` context
class that re-points `--text-dark`/`--text-mid` so all 115 consumers flip at once, plus
a `.vf-on-light` reset for light cards sitting inside a dark band. Four new
admin-editable tokens back it: text / muted text / accent / border on dark
(Site Settings → Brand colours).

### 4. Audience cards (homepage) — the reported bug

The reference gives `.audience-card-subtitle` **no** base colour and sets it per card
(`styles.css:2352-2360`). All four rules were dropped in the port and replaced with a
flat `color: var(--text-mid)`, which rendered the subtitle at ~2.2:1 on the blue card
and ~1.5:1 on the charcoal one. It was also the wrong font (inheriting Open Sans rather
than Montserrat), weight (400 vs 600) and size (0.9rem vs 14px). All restored.

Two adjacent faults found in the same block: `.audience-card-label` had absorbed the
missing subtitle's `margin-bottom` (10px, should be 5px); and the eyebrow renders with
`.section-label`, whose brand blue is *identical to the accent-1 card background* —
invisible the moment an editor types one. Both fixed.

### 5. Per-template drift corrected

> **Correction (2026-08-14): one of the seventeen was wrong, and this entry is how it survived.**
> `.page-hero h1` weight 800 → 700 was a **regression**, not an alignment, and it has been put back
> to 800.
>
> The reference holds that rule **twice and the two disagree**. `assets/css/styles.css:2587-2593`
> says `font-weight: 700` with `clamp(2rem, 5vw, 3rem)`; every one of the nine reference pages
> redeclares `.page-hero h1` in an inline `<style>` that loads *after* the `<link>`, at equal
> specificity, with **800** and `clamp(2.4rem, 5vw, 3.8rem)`. The inline copy is what those pages
> render. This pass read the shared sheet for the weight while taking the size from the inline rule,
> so it had both copies in front of it and mixed them — and then wrote the result up here as
> "aligned to the reference", which is what made it look settled.
>
> Blast radius: every `pageHero` page (59 of 61) plus every `/events/event/*` page.
> The other sixteen values were re-checked by parsing all three sources — shared sheet, all 108
> pages' inline blocks, and `globals.css` — and comparing every declaration, not just these
> seventeen. **Exactly one other** case exists (`.contact-form { padding }`, on a single page;
> see `OUTSTANDING.md`). Guarded now by the hero-weight test in `tests/e2e/frontend.e2e.spec.ts`,
> which reads the expected value out of the reference page rather than hardcoding a number.

Seventeen typography values had drifted from the reference and are now aligned:
`.section-label` 12px → 14px (every eyebrow site-wide), `.page-hero h1` weight 800 →
700 *(reverted — see the correction above)*, `.faq-item summary` 600 → 700, `.faq-item .faq-a` line-height 1.7 → 1.8,
`.spec-card .spec-name` 600 → 700 and 1.1 → 1.15rem, `.spec-card .spec-loc` colour
`--text-mid` → `--text-dark`, `.service-title` 0.9 → 1rem, `.service-desc` 0.82rem →
14px, `.service-icon` 1.4 → 1.55rem, `.contact-icon` 1rem → 1.4rem, `.expert-role` 0.8
→ 0.73rem, `.form-submit` 0.95 → 0.88rem, and the FAQ open/hover question tint that had
no equivalent in the build. The hero definition word also used `#8bb9dd` where the
reference has `#5ba3d9` — a token (`--definition-blue`) that already existed unused.

### 6. Deliberate deviations from Target (accessibility)

Two reference values fail WCAG AA and were **not** reproduced. Both are ported faithfully
from the reference's own per-page `<style>` blocks, so this is an intentional divergence:

- `.mv-mission-header .section-label` — `rgba(255,255,255,0.55)` ≈ 2.9:1 → `--accent-on-dark`.
- `.our-values .section-subtitle` — `rgba(255,255,255,0.65)` ≈ 4.0:1 → `--text-muted-on-dark`.

The on-dark muted token is 0.82 alpha where the reference uses 0.72/0.75 in places,
which lifts the audience-card and CTA-band body copy slightly above the reference.

### 7. Open item for a team decision — "Why VERIFY" band is inverted

**Not changed, needs a decision.** The reference renders `.why-verify` as a *light* blue
gradient (`#eef9ff → #d9efff`) with dark text (`styles.css:1440-1445`). The build renders
it as a *dark* blue gradient (`#0d4f85 → #1c75bc`) with white text, and every descendant
rule (`.why-card h3`, `.why-card p`, `.why-header .section-title/.section-label`) was
inverted to match. It is internally consistent and perfectly legible, so it reads as a
deliberate design change rather than a porting error — which is why it was left alone.
If Target is authoritative here, the whole block needs reverting together, not rule by rule.

### 8. Verified, not just asserted

A DOM contrast audit across 12 representative pages (homepage, about, services,
specialist panel + profile, booking, contact, In the Loop listing + article, information
centre, team member, event detail) computes each text node's ratio against its effective
background. It confirmed **zero** white-on-white or invisible-text cases after the change.
The token flip did initially introduce one — `.cost-item`, a white card inside the dark
`.cost-section` — which the audit caught and which is now in the `.vf-on-light` list;
the same sweep found and fixed a `.btn-white` label being flattened to charcoal. Every
light surface sitting inside a flipped context (11 site-wide) was enumerated
mechanically rather than by eye.

Remaining sub-AA cases are pre-existing reference values, chiefly `#93d0f7` eyebrows on
the blue gradient (~2.9:1) and `--primary` on `--bg-light-1` in the footer headings
(~3.7:1). Listed here rather than changed, since they are the reference's own palette
decisions.

---

## Comparison 20: Visual-effects audit — shadows, glows, interaction (CSS-level, 2026-08-06)

Triggered by the VERIFY definition card on the homepage rendering flat against the
reference. Scope was widened to a full effects diff: all 86 distinct reference
`box-shadow` values against the build's 74, plus every `filter`, `text-shadow`,
radial-gradient overlay and `@keyframes` in `.design-reference/`.

**Headline: the static port was better than expected; the gap was interaction.**
`.audience-card:hover`, `.btn-primary:hover` and `.expert-card:hover` are byte-identical
to the reference, and the radial-glow overlays (`.page-hero--dark::before`,
`.staff-hero::before`, `.why-verify::before`, …) are all present. Only three effects had
genuinely drifted.

### The definition card — the reported issue

Our CSS correctly ported the card's *static* layer (`#f8fbfd` panel, resting shadow, the
280px blurred blue orb `::before`). The reference's *interactive* layer was missed because
it lives in `assets/js/script.js:218-266`, not in a stylesheet:

| Effect | Reference source | Status |
| --- | --- | --- |
| Cursor-tracked white sheen (`::after` reading `--mx`/`--my`) | `styles.css:2185-2196` | ✅ added |
| Idle float — rAF, 9px amplitude, 5.5s period | `script.js:228-240` | ✅ added |
| 3D tilt on hover — `perspective(900px)`, ±12° | `script.js:253` | ✅ added |
| Hover shadow lift | `script.js:245` | ✅ added, as a token not an inline style |

Implemented as `src/heros/HomeHero/DefinitionPanel.tsx`, with four deliberate improvements
on the reference: a `prefers-reduced-motion` guard (the reference has none — it drops the
transforms but keeps sheen and shadow, which carry no motion), a
`(hover: hover) and (pointer: fine)` guard (the reference's rAF loop runs forever on
phones where `mousemove` never fires), an `IntersectionObserver` that pauses the loop
offscreen, and `will-change` scoped to an `.is-tilting` class rather than applied
permanently to a 390px layer that also contains a `blur(3px)` orb.

Editors get a three-way **Panel interaction** control (Full / Subtle / Off). The motion
constants stay CSS custom properties rather than CMS fields: they are a coupled physics
recipe, the admin has no live preview, and four number fields would have cost 8 columns
for a control nobody would use. They remain retunable from Custom Styles.

### ⚠️ Contrast bug found and fixed

`.hero-def-meaning` used the reference's `#6d767f` on `#f8fbfd` — **4.44:1, already below
AA before any overlay**, and the new sheen dropped it to 2.98:1 (a white wash lightens
text and background together, so the ratio falls). Solved as a pair: text darkened to
`#50565d` and the sheen reduced from the reference's 0.28 to 0.18, giving **7.14:1 at rest
and 4.54:1 under the sheen**. Missed by Comparison 19's sweep because these colours are
scoped to the `--glow` panel variant.

### Drift restored

| Selector | Was | Now |
| --- | --- | --- |
| `.service-card` | flat white, `var(--shadow)`, transparent border | reference gradient, `md` + inset top highlight, blue border |
| `.service-card:hover` | generic `translateY(-4px)` + `--shadow-lg` | the reference's neo-brutalist `translate(-4px,-4px)` + hard `6px 6px 0` offset, plus a `:focus-visible` outline (these cards are links) |
| `.form-submit` | no shadow at all | `glow-sm` resting / `glow-lg` hover — `.btn-primary` supplies no resting shadow, so the port lost it |

Geometry was deliberately **not** restored on `.service-card`: the reference card is icon
+ title only, ours also renders a description and an Enquire button, and the class is
shared by ServicesGrid, FeatureGrid and ResourcesGrid.

Three initially-suspected gaps were **rejected on inspection**: `.who-value` is dead CSS
(no component emits it); and `.qa-icon-wrap`, `.ime-hero-seal`, `.jme-hero-seal`,
`.ime-format-card-icon`, `.ct-response-badge-dot` are unported *elements*, not drift.

### Structural fix — shadows are now editable

Shadows were the one token family an editor could not touch: `--shadow`/`--shadow-lg`
existed in CSS but appeared in neither the Design System global nor `designTokenStyle.ts`,
and ~86 other values were hardcoded. Added a `--vf-shadow-*` / `--vf-glow-*` ladder
(6 elevation rungs + 3 glows + ring + inset-highlight + hard offset), every rung taken
from a real reference value, exposed as **Design System → Shadows & glows** and as a
per-block **Card shadow** picker on the 8 grid blocks plus the Image atom.

Colour comes from `--vf-shadow-color` via `color-mix()`, so one field retints the whole
site — verified by round-trip. `color-mix` adds no support risk: Tailwind v4 already
compiles this codebase's 27 opacity modifiers to it. Re-pointing the two legacy aliases at
the ladder made all 28 of their existing consumers editable for zero visual change.

### ⚠️ Latent bug found, deliberately not fixed

`.vf-hover-*` sits inside `@layer components`, while the ported component CSS
(`.service-card`, `.specialty-card`, …) is unlayered — and unlayered beats layered
regardless of specificity. So for any card with its own `:hover` rule, the `glow`, `zoom`
and `accent-bar` hover presets silently do nothing. **Inert today**: every block in the
database stores `lift` or `none`, and `lift` resolves identically either way. Moving
`.vf-hover-*` out of the layer would fix it but would then outrank `.service-card:hover`
and kill the neo-brutalist hover restored above. That is a hover-precedence change, not an
effects change — logged here rather than bundled in.

The new `.vf-shadow-*` rules are scoped `:not(:hover)` for the same reason: they set
*resting* depth only, so they compose with whatever hover treatment is in play instead of
flattening it.

---

## Comparison 21: Admin-editability audit — making every visual value CMS-controlled (2026-08-06)

Prompted by the handover requirement: the successor must be able to change anything visual from
the admin, without touching code. The audit found the problem was not merely that some values were
hardcoded — **the admin controls that already existed were largely ineffective.**

### Two structural faults

**1. The unlimited escape hatch was broken.** CMS tokens were applied as an inline `style`
attribute on `<html>`. An inline style outranks every stylesheet, so `:root { --primary: … }`
written in Globals → Custom Styles → Global CSS was silently ignored — and since the seed fills
every brand colour field, that was the normal state, not an edge case. Fixed by emitting the
tokens as a real stylesheet placed immediately before the Custom Styles tag, giving a genuine
three-layer cascade (defaults → CMS values → Global CSS). Verified: Global CSS now overrides a
Site Settings token and repaints the site.

**2. The brand colour fields barely propagated.** 204 occurrences of the brand blue were hardcoded
as `#1c75bc` / `rgba(28,117,188,α)`, so changing "Primary" repainted only a fraction of the site.
847 colour, radius and gradient literals were mechanically converted to `var()` / `color-mix()`.
Changing one field now repaints 66–113 elements per page.

### Also fixed

- **`SectionHeader` hardcoded the on-dark palette inline**, so all four "on dark" colour fields in
  Site Settings had no effect on any section header sitewide. The CSS already routed through the
  right tokens — the inline styles were purely defeating it. Removing them (and the now-pointless
  `onDark` prop) made the fields work, and corrected the eyebrow from an orphan `#8bb9dd` to the
  brand's `--accent-on-dark`.
- **The `Callout` block's 12-value palette** lived in a module constant applied inline, unreachable
  from admin. Now four CSS variants driven by editable status colours, per-variant alphas preserved
  exactly.
- **`--text-dark-base` / `--text-mid-base` / `--border-base`**: the emitter wrote the *derived*
  tokens, but `.vf-on-light` restores from the `-base` pair — so a brand text-colour edit silently
  reverted on every light card inside a dark band.
- **`</style>` injection hole**: Custom Styles injected editor CSS verbatim. Both style tags now
  strip it; token values are validated at save time rather than silently dropped at render.
- The home hero's band and rhythm were an inline `background: #cbe5fa; padding: 80px 0` —
  now editable fields, with `accent-solid` added as a reusable Section band.

### New admin surface

25 colour fields (Surfaces / Extended blues / Status & feedback), a 10-rung role-named radius
ladder, 4 gradient recipes, a transition control, and an **Overall size** knob that scales the
whole site proportionally. All colour fields gained a real picker — the text value stays
authoritative so the third of values that are `rgba()`/`var()`/`oklch` aren't coerced to `#000000`.
~40 columns, additive only.

### Method note

Every mechanical pass was gated on a **computed-style snapshot diff over 6,329 nodes** — value-
preserving substitutions must produce a byte-identical computed style, so any diff at all is a bug.
It caught three real errors that review would likely have missed: a `135deg` gradient folded onto a
`145deg` token, a `.vf-callout--info` rule colliding with the FAQ help card that borrows the class
name decoratively, and the home hero losing its padding to Tailwind's preflight. Tooling left in
`tests/visual/`.

**Deliberately not done:** the ~150 near-duplicate colour literals (drift clusters that in places
encode intentional stacked tints — collapsing them flattens depth cues in a way a pixel diff
reports as trivial), and the dead-CSS sweep (202 candidates; the detection depends on a
hand-maintained prefix allowlist and full route coverage, and a wrong deletion breaks a page
silently for zero editability gain). Both are now reachable via Global CSS regardless.

---

## Summary of recurring, cross-page issues

These patterns showed up on multiple pages throughout this review and are most efficiently fixed once at a shared/template level rather than page-by-page:

1. **Hero heading/shield-graphic overlap** — heading text collides with the shield icon on nearly every inner-page hero.
2. **Stray horizontal white line** above hero headings (and occasionally in other dark sections) — likely a shared divider/component bug.
3. **Breadcrumbs missing or too deep** — too many levels on Services sub-pages (IME, JME, Reporting, Administrative Services); missing entirely on Specialists section pages and Information Centre pages; a stray floating "tab" artifact appears in place of breadcrumbs on Information Centre pages specifically.
4. **Extra, unrequested hero subtext paragraphs** added on pages where Target's hero is heading-only.
5. **Shield graphic shown where Target omits it entirely** (Reporting Services, Administrative Services, In the Loop) — likely needs to be conditional rather than global.
6. ~~**Low-contrast/illegible text** on dark-background CTA sections (eyebrows and secondary buttons especially) — appears to be a shared text-color token issue, also seen inside light-background cards on the Specialists hub page.~~
   **✅ RESOLVED — see Comparison 19.** The diagnosis was right: it was a shared token
   issue. Dark-band text was flipped by three hardcoded allowlists covering only five
   selectors, so everything else kept its light-mode grey; and `--text-mid` itself was
   `#737373` against the reference's `#222222`, stored in the database where no CSS fix
   could reach it. Both are fixed at the token level (`.vf-on-dark` context class + an
   unconditional seed repair), so this should not recur page-by-page. Verified with a
   DOM contrast audit across 12 pages.
7. **List/card content downgraded from icon-card rows to plain inline bullets**, with an added intro line, across several "intro" sections (IME, JME, Reporting Services, Information for Clients).
8. **Stray "stuck focus state" blue outlines** appearing on random cards (Team page, JME page, Join Expert Panel page).
9. **Category tags "genericized"** into a single repeated section-level tag instead of specific per-item tags (most visible on the In the Loop page).
10. **Footer tagline paragraph** present in Current but absent from Target on most inner pages — worth confirming whether it should be site-wide.
11. **Custom/added bottom CTA sections** on pages where Target has none, or a different standard CTA — not necessarily wrong, but worth a team decision per page (JME, Administrative Services, Join Expert Panel, Information for Claimants).
12. **Broken rich text** rendering literal `[[double bracket]]` syntax instead of styled/colored text — appears on nearly every page's secondary heading.
13. **Missing "Recommended Public Transport" / "Nearby Car Parks" details** in the shared location/office-info block (Information for Claimants, Contact Us).

Recommend tackling items 1–6 and 12 first, since they're template/component-level and will likely resolve automatically across most pages once fixed in one place.
