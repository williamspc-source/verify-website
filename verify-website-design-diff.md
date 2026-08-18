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
- **Band colour was missing** — *added 2026-08-14, after this audit, and now fixed.* Target renders
  this intro as its own `.team-intro` section on a light-blue gradient
  (`linear-gradient(135deg, #eef9ff 0%, #e6f4ff 48%, #d9efff 100%)`), with the photo grid below it on
  `.team-grid-section`'s grey `#f5f6f8`. The build had folded the intro into the People Grid block, so
  one block meant one background and the blue band did not exist — the whole thing was grey.
  The colour was never the problem: `--band-accent` already defaults to that exact gradient and is
  editable in Design System → Section bands. What was missing was a way to give a block's *header* a
  different band from its body. The People Grid now has a **Header band** control
  (`headerBandField`, `src/fields/blockFields.ts`), set to Accent on this page by
  `src/endpoints/seed/seedBlockBands.ts`. Guarded in `tests/e2e/frontend.e2e.spec.ts`, which reads
  both expected colours out of this reference page rather than hardcoding them.
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
**CORRECTED 2026-08-18 — this was wrong, and wrong in the way the records already warn about.**
"No meaningful differences" was concluded from the question text and the open-by-default state. Never
measured: the rows were rounded outlined white cards with a 12px gap against the reference's flat
hairline-divided list; the toggle was a bare `+` glyph against a 28px circled ± that inverts to
white-on-blue when open; the question ran at 18px against 14.72px; and the answer at 18px/32.4px
against 14.08px/24.64px. A structural match is not a visual match. Closed in Comparison 35.

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
- **CORRECTED 2026-08-18 — CLOSED in Comparison 36.** This entry read as still-outstanding for a long
  time, and the fields half was in fact done: the fixture had been rebuilt (eyebrow, icon contact
  items, callout, card, the exact six fields, "Send Enquiry", Qualifications dropped). What had NOT
  been done was the only part that made any of it render — every layout rule hung off `cssClass`
  values that a fixture edit cannot deliver to an authored page, so ~110 lines of correct CSS matched
  nothing and the section still shipped single-column and uncarded. The lesson is not "rebuild the
  section"; it is that a page-scoped class is stored data, and a fixture that sets one needs a repair.
- Also missing, and never recorded here: the reference has a placeholder in every input. Payload's
  form-builder defines `placeholder` on `select` only, so this was a missing capability rather than
  missing content. Closed in Comparison 36.

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
- ~~**List formatting downgraded (recurring pattern)**: Target presents "Appointment coordination," "Brief and document management," and "Quality-assured reporting" as a 3-column grid of bordered cards, each with an icon, heading, and description. Current collapses these into a plain inline bulleted list under an added intro line "What we help with".~~
  **✅ STALE — corrected 2026-08-18, see Comparison 34.** They have been a 3-column card grid for some
  time; the bulleted-list description was long out of date and would have sent the next reader looking
  for a problem that no longer existed. What was actually wrong was the card *paint* — the shared
  bordered card rather than the reference's quieter treatment — now an editable **Soft** card style.
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
- **CORRECTED 2026-08-18 — and all of it CLOSED in Comparison 35.** This entry said "the same 15
  questions". There are **16**, and there always were; the count was never checked, only eyeballed.
  Extracting and diffing both sides shows all 16 questions AND all 16 answers are byte-identical to
  the reference, so nothing was ever wrong with the content here.
- ~~**Icon style differs**: Target uses chevron-down (˅) icons; Current uses plus (+) icons.~~ Real,
  and the least of it — see Comparison 35. Closed by the `toggleStyle: chevron` variant.
- ~~**Missing callout styling**~~ — the callout box had already been built by the time this was
  re-read (`.vf-faq__help`, measured identical to the reference for background, padding, radius and
  position). What was still wrong was its *contents*: no info icon, the copy split into a bold
  heading, and the contacts inline behind a middot instead of stacked behind their own icons.
  Closed in Comparison 35.

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
- **CORRECTED 2026-08-18 — CLOSED in Comparison 35.** **16** questions, not 15, same as the Clients
  page. All 16 questions and all 16 answers are byte-identical to the reference.
- ~~**Icon style differs (recurring)**~~ / ~~**Missing callout styling (recurring)**~~ — both closed
  in Comparison 35. Neither was the largest gap on this page: the accordion was drawn as rounded
  outlined cards against the reference's flat divided list, and the section band was white against
  the reference's pale blue. Two passes recorded the toggle glyph and missed both.

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

## Comparison 22: Re-audit of the recurring cross-page issues (2026-08-17)

The thirteen recurring issues below were logged on **2026-07-04**. Nine implementation passes have
landed since (see `HOMEPAGE-CHANGES.md`), and only item 6 had been struck through — so the list had
been claiming twelve open faults for six weeks without anyone re-checking whether they were still
true. **Most of them were not.**

**Method.** The reference was served over HTTP on `:4100` (`python3 -m http.server` from
`.design-reference/`), not opened over `file://` — its stylesheet is linked root-absolute and
silently fails to load otherwise, which makes every shared-sheet rule read as an unstyled default.
The build was read from the running `LOCAL_PROD_REPRO` server on `:3000`, so these are production
bundles, not a Turbopack dev build. 22 page pairs, headless Chromium at 1440×900, DOM read after
`load` with a font-settle poll, pointer parked at `(4,4)` before any resting measurement.

**Three of my own probes produced confident wrong answers before they produced right ones.** Each is
recorded because the failure shape is reusable, not because the fix was interesting:

| Probe | Wrong answer | Cause |
|---|---|---|
| Literal `[[brackets]]` | "present on **all 26** pages" | Grepped whole documents. Every hit was in the RSC flight payload inside `<script>` — the *unrendered* rich-text JSON. Zero appear in visible markup. |
| Section heading diff | "**19** missing/extra sections across 9 pages" | `textContent` glues `<br>`-broken headings ("Ready to Refer Your**N**ext Matter"), so a heading present on both sides failed to match itself. `innerText` leaves 2 real differences, on 2 pages. |
| Breadcrumb trails | "reference trail is one level shorter, on every page" | The selector took `li, a` only. The reference marks the current page with `<strong>`, so every reference trail lost its leaf. 13 of 22 trails are in fact **identical**. |

The shield probe (item 5) additionally found the mark on 1 of 22 pages while `README.md` says it
sits behind interior heroes generally. That control was too weak to report from, so item 5 was
re-measured by counting `.page-hero-shield` in the served HTML directly.

### Verified status of the thirteen

| # | Issue | Status as of 2026-08-17 |
|---|---|---|
| 1 | Hero heading / shield-graphic overlap | **Resolved.** No `h1` box intersects a shield box on any of the 22 pages. |
| 2 | Stray horizontal white line above hero headings | **Resolved.** No rule-like element (width > 40px, height ≤ 6px, visible background or top border) sits above the `h1` inside any hero — on the build *or* the reference. |
| 3 | Breadcrumbs missing or too deep | **Largely resolved.** Present on every interior page; **13 of 22 trails match the reference exactly**. Nine differ, and narrowly — see below. |
| 4 | Extra hero subtext where Target's hero is heading-only | **Resolved.** Hero paragraph counts are identical on all 22 pages (16 on each side in total). |
| 5 | Shield shown where Target omits it | **Resolved.** Reporting Services, Administrative Services and In the Loop — the three named pages — render no hero shield. Build and reference agree on all six comparable pages. |
| 6 | Low-contrast text on dark bands | Resolved in Comparison 19 (unchanged). |
| 7 | Icon-card rows downgraded to inline bullets | **Not re-verified.** Needs a per-page read; not detectable structurally. |
| 8 | Stray stuck focus outlines | **Resolved.** No element carries a visible outline at rest on any of the 22 pages. |
| 9 | Category tags genericised | **Partly open**, and much narrower than logged — only the three *Featured* cards on In the Loop. See below. |
| 10 | Footer tagline present in Current, absent from Target | **Mischaracterised.** The footers are otherwise identical; the real delta is opening hours. See below. |
| 11 | Custom bottom CTA sections where Target has none | **Resolved.** Every CTA section matches its reference counterpart. The apparent mismatches were the `<br>` artefact above. |
| 12 | Literal `[[double bracket]]` rich text | **Resolved.** Zero occurrences in visible markup across 26 pages; `.vf-accent` renders. |
| 13 | Missing Public Transport / Car Parks detail | **Resolved.** Present on Contact and For Claimants — the same two pages as the reference. |

### Resolution — all six closed, 2026-08-17

Decided and actioned in the pass that follows this audit. **Two were fixed; four were deliberate.**

| | Item | Outcome |
|---|---|---|
| A | Nine breadcrumb trails | **Accepted as-is.** No change. |
| B | Featured cards had no topic tag | **Fixed.** |
| C | `/events` was a directory | **Fixed** — reference hub, with our search kept. |
| D | `/contact` portal section | **Accepted.** Kept; useful to a visitor. |
| E | Footer opening hours | **Accepted.** Kept; editable `Offices` content. |
| F | IME/JME icon points | **Withdrawn — my finding was wrong.** |

**A, in detail.** Labels stay long (`Independent Medical Examination (IME)`, not `IME`); depth stays
at `Home › Section › Page`; the legal pages and Specialist Availability keep the trails the reference
omits. The three *depth* rows would have meant copying an inconsistency — the reference keeps the
section level on `specialty-list` and `join-expert-panel` but drops it on `specialist-panel`, and
keeps it on `/events` while dropping it on that page's own children. Ours is self-consistent.

**F was a false positive, and it is the fourth probe error in this comparison.** I reported the
reference's three intro points as missing from IME and JME. They are on both pages: "Injury
Stability", "Work Capacity" and "Causation" each return **2** occurrences in the served HTML — the
same count as a control string I already knew was present. The probe only inspected the first
`<section>` after the hero, so content that had been **moved further down the page** read as absent.
The lesson is the one the other three already taught, at a different scale: a negative result needs
a positive control *at the scope being searched*, not merely somewhere on the page.

**C, as built.** `/events` is now Hero → *Four ways VERIFY brings medico-legal learning to life* →
the searchable Events Explorer. The `h1` matches the reference exactly. The explorer **replaces** the
reference's two static preview sections rather than joining them: it already splits upcoming from
past and lists everything, so keeping the previews would print the same events twice on one page. The
search bar is a deliberate improvement — the reference hub has none.

No code was written for either fix, and no schema changed. The carousel already existed, complete,
in `seedShowcase`; `postTagLabel` already preferred a post's own category.

### What was open before that pass

**A. Breadcrumbs — nine trails, three kinds of difference.**

| Page | Build | Reference | Kind |
|---|---|---|---|
| `/about/meet-the-team` | Home › **About VERIFY** › Meet the Team | Home › **About Us** › Meet the Team | label |
| `/services/medico-legal/ime` | … › **Independent Medical Examination (IME)** | … › **IME** | label (build verbose) |
| `/services/medico-legal/jme` | … › **Joint Medical Examination (JME)** | … › **JME** | label (build verbose) |
| `/specialists/specialist-panel` | Home › **Specialists** › Specialist Panel | Home › Specialist Panel | depth |
| `/events/upcoming-events` | Home › **Events & Seminars** › Upcoming Events | Home › Upcoming Events | depth |
| `/events/past-events` | Home › **Events & Seminars** › Past Events | Home › Past Events | depth |
| `/specialists/specialist-availability` | Home › Specialists › Specialist Availability | *(none)* | presence |
| `/privacy-policy` | Home › Privacy Policy | *(none)* | presence |
| `/terms-conditions` | Home › Terms & Conditions | *(none)* | presence |

The three **depth** rows are a decision, not a defect: **the reference contradicts itself.**
`specialty-list` and `join-expert-panel` both render `Home › Specialists › …`, while
`specialist-panel` renders `Home › Specialist Panel`; `/events` renders `Home › Events & Seminars`
while its own children drop that level. The build is self-consistent and the reference is not, so
matching it here would mean copying an inconsistency. Left as a question for whoever owns the design.

**B. In the Loop — the three Featured cards carry no topic tag.** Every other tag on the page
matches. The reference gives each featured card a second, specific tag beside `FEATURED`
(`INDUSTRY INSIGHTS`, `AAMLE EVENTS`, `EXPERT GUIDANCE`); the build shows `FEATURED` alone. This is
the surviving remnant of item 9. One card also reads `FEATURED FEATURED`, which looks like a
duplicated tag and is worth an eye before it is fixed.

**C. `/events` is a directory where the reference hub is a marketing page.** The only substantial
structural gap left. The build's `/events` lists event titles under *Explore VERIFY & AAMLE Events*;
`events-seminars.html` instead offers *Four ways VERIFY brings medico-legal learning to life*,
*Latest Medico-Legal Education Events* and *Recent VERIFY & AAMLE Programs*. The `h1` differs too —
"Medico-Legal Education Events" against "Medico-Legal Education for Better Practice".

> Note this **supersedes Comparison 15**, whose headline was a page-count mismatch (Target 2 pages,
> Current 1). The build now has three — `/events`, `/events/upcoming-events`, `/events/past-events` —
> against the reference's three, and the two child pages align. Comparison 15 §3 also called the
> four-ways carousel an *extra* not present in either target; it is present in `events-seminars.html`,
> which that comparison did not look at.

**D. `/contact` has one section the reference does not:** *What you can do in the portal*.

**E. The footer carries opening hours the reference omits.** Identical on all 22 pages otherwise.
Build: `…Street Brisbane QLD 4000 Monday to Friday 08:30 – 17:00`. Reference: `…Street, Brisbane QLD
4000`. So item 10's "tagline" framing was wrong — the delta is `Offices.hours` plus a lost comma
after the street. Both are editable content, not code.

**F. Not re-verified:** item 7 (icon-card rows vs inline bullets). It needs a per-page visual read
and no structural probe distinguishes it. — *Later checked, and wrong; see the resolution above.*

---

## Comparison 23: What the events-hub fix exposed (2026-08-17)

Fixing §C surfaced a defect with a far wider blast radius than the gap itself, and it is recorded
here because it is a content-safety fault, not a design one.

**Every seed run rewrote 13 of the 27 pages from the fixture, discarding editor changes.**

Each of the seven `authorPage` copies decided whether a page had been written with
`layout.length > 2`. That is a proxy for "looks substantial", not for "someone wrote this", and it
fails in the direction that costs an editor their work: any page holding two or fewer blocks is
overwritten every time. Measured on the local database: Contact, Meet the Team, Specialists,
Specialist Panel, Information Centre, Events & Seminars, Upcoming Events, Past Events, Educational
Services, Other Reporting Services, Specialist Availability, Privacy Policy and Terms & Conditions.

**Proven, not reasoned about.** The events hero was reworded through the API to
`EDITOR WORDING TEST`, the seed re-run, and the fixture wording came back. `/events` walked into this
precisely because the fix left it at **exactly two** blocks — carousel plus explorer — and `2 > 2` is
false.

The correct signal already existed: `isPlaceholderLayout` in `seedVerify`, which matches the single
scaffold `content` block the page tree creates ("…is scaffolded and ready for content"). It was used
only for the two pages built outside `authorPage`, while the seven copies each guessed instead. It
now lives in `src/endpoints/seed/authored.ts` as `isUnauthored`, and all seven read it — seven copies
of a rule being how the collection→prefix map in `routes.ts` came to disagree with itself.

**Re-tested after the fix**, with three simultaneous edits: the hero reworded, a carousel slide
deleted, and a featured post's category changed. All three survived a full seed run. The trade this
locks in is deliberate and already documented for links: **a fixture edit no longer reaches an
existing install**, so every content correction must be paired with a narrow, additive repair that
writes only into an absence (`src/endpoints/seed/seedEventsHub.ts`).

---

## Comparison 24: The events pages, diffed declaration by declaration (2026-08-17)

Comparison 23 recorded `/events` as rebuilt to match the reference. **It did not match, and the
verification is why that went unnoticed.** The check compared the `h1` string and the list of `h2`
headings. A structural match was reported as a visual one.

What that check never looked at, all measured afterwards: hero alignment (`start` against the
reference's `center`), type scale (60.8px/800 against 52.8px/700), copy width (1132px against 860px),
the subtitle (different copy, 18.4px/560px against 16px/650px), the section background, the card
design, and every slide *body* — which were paraphrases carried over from `seedShowcase`, where only
the four **titles** matched. Four titles out of four is exactly what a heading comparison finds
before it stops.

### The structural root cause

The reference has **two** event presentations, and the hub was given the wrong one:

| Reference page | Presentation | Our block |
|---|---|---|
| `events-seminars.html` (hub) | `.event-card` grid — image panel, date, type tag, "More info →" | `ArchiveBlock` already emitted this markup |
| `upcoming-events.html`, `past-events.html` | filter toolbar + list rows | `EventsExplorer` |

`/events` was given `EventsExplorer`, so the hub rendered the *child pages'* list rows with their
calendar graphic. `EventsExplorer` now takes a `cardStyle` (`list` by default, so both child pages are
untouched) and carries the reference's section headers.

### Enumerating instead of spotting

Three rounds of "you have missed something" preceded this, each finding another difference by eye.
`node tests/visual/referenceCssDiff.mjs events` parses every declaration on both sides and prints a
count. It reported **26 selectors missing and 6 differing**, including two that no amount of looking
had found:

- `.events-offer-eyebrow::before` drew a **24px dash** before the eyebrow that the reference hides —
  visible in every screenshot as `— PROGRAMS & PARTNERSHIPS`, and never noticed;
- `.events-offer-carousel` had a literal `20px` rewritten by the radius codemod to `var(--radius)`,
  which is `0.5rem` here and `8px` in the reference. **The codemods are documented as
  "value-preserving by construction". This one was not**, and it shrank the carousel's corners by 12px.

Three of the reported faults turned out to be already correct, and were left alone: the autoplay
interval (5801ms against 5800), the transition (0.55s, identical curve), and the arrow geometry
(42×42 at x=197/1201). The real cause of "it skips too fast" was the **hover binding** — ours covered
only the inner viewport, so hovering the heading or the arrows, which is exactly when you want it to
stop, did nothing. The reference binds to the whole section.

### Building the tool honestly took three corrections

Worth recording, because each is a way a diff tool lies:

1. Comparing raw text made all **60+** token substitutions look like defects. Resolving `var()` and
   `color-mix()` first is what left a readable list.
2. Resolving both sides with **one** token map was wrong: both stylesheets define `--radius` and they
   disagree. `.events-view-link` was reported as differing when the two computed values are identical.
3. Font tokens must compare **by name**. Resolving `--font-heading` produced 24 phantom differences
   whose "reference" and "build" lines were the same string — the brand typeface is a deliberate,
   documented deviation (Comparison 19), not a porting error.

The tool now reports **zero**, and every fix was then confirmed with `getComputedStyle` — a rule in
the file is not a rule on the page.

### Deliberate deviations, recorded so they are not re-reported

- **The search bar on `/events`.** The reference hub has none; it offers two static previews instead.
  Ours keeps search and the explorer supplies both sections, so no event is listed twice.
- **An empty card shows the event's date**, where the reference prints a fixed "Event image" label.
- **Arrow glyphs are `<svg>`**, not `<i>` — Phosphor React renders components, and the caret is the
  same shape at the same 20px.
- **The events hero port is scoped to `.events-pages`**, not `.events-hero`, because widening
  `.page-hero h1` would restyle 25 unrelated pages and break the hero-weight guard.

### Follow-up: four headings at weight 400, and a blind spot in the diff

Reported after the pass above, and worth recording because the tool built to prevent exactly this
missed it. Four `h2`s on `/events` rendered at **400** where the reference renders **700** — the
carousel heading, both group headings, and the explorer's own heading. The *sizes* were already
right, which is what made it look finished.

**`referenceCssDiff.mjs` reported zero throughout**, because it compares declarations that exist on
both sides and `font-weight` is declared on neither. The reference omits it and inherits the
browser's `h2 { bold }`; the `@layer base` block at the top of `globals.css` resets `h1…h6` to
`font-weight: unset` — *inherit*, for an inherited property — so a faithful port of that omission
takes the body's 400. Identical stylesheets, different rendering, nothing to diff. **A declaration
diff cannot see a property neither side declares**, and that is now recorded in the tool's header and
in `CLAUDE.md`.

Measured scope before changing anything: across eight page pairs, headings computing 400 were
**build 4, reference 0** — all four on `/events`. Not a global fault, and deliberately not fixed
globally. `.events-offer-toolbar h2` and `.events-section-header h2` now declare `font-weight: 700`;
the count is 0 on both sides.

The explorer's heading was a second fault in the same place: `.events-explorer-header` set only a
`margin-bottom`, so its `h2` fell through the reset to **18px/400** beside two 37.6px headings. It
now renders through the same `.events-section-header` markup the groups use, so it matches by
construction rather than by two rules kept in step by hand. Only the hub explorer has a header —
both child pages set no eyebrow, heading or subheading — so nothing else moved.

The explorer's subheading ("Everything coming up and every recent program in one place…") is gone.
The reference has no equivalent. Note what it took: the string had been rewritten in the fixture an
earlier pass, but the repair only ever *fills* an empty field, so the edit never reached a database
and the original line was still what rendered. **Deleting a value needs its own exact-match rule**,
and it is matched against both superseded strings so an editor's own subheading survives — verified.

### Still open, found while measuring

The reference sizes heroes **per page family**. `/about` matches ours; `/services` renders at 42.4px
and `/contact` at 69.6px against our shared 60.8px. Not touched in this pass.

---

## Comparison 25: The event detail page, rebuilt past the reference (2026-08-17)

**This is a deliberate, client-approved deviation.** The reference's event page is a stub — two
paragraphs, a 260px `.map-tile`, one AAMLE button — and a recap has nothing to be a recap *of*. It is
built past that, the way the article page was. The `events` family in `referenceCssDiff.mjs` covers
the three listing pages only; the detail page's styles come from `styles.css` and fall outside its
`match` regex, so nothing here is gated by that tool.

### What was measured wrong, and why the tools said nothing

| | Build | Reference |
|---|---|---|
| Body column | **595px / 16px** | 1132px / 18px |
| `<strong>` in the intro | *absent — nothing was rich text* | bold |
| "Contact Us" href | `aamle.com.au/2026-seminar-menu/` | — |
| `.event-presenters__heading` | weight **400** | — |
| `.art-attachments__heading` (article page too) | weight **400** | — |

The width and size are one fault with one cause: **`@tailwindcss/typography` owns `.prose` as well**,
and our hand-ported reference rules declare neither `max-width` nor `font-size`, so the plugin's 65ch
and 1rem won unopposed. The same collision was costing the legal pages 2px of body text. And the
obvious fix — drop the class — would have been worse than the bug, because our port declares no
`font-weight` either: every heading and every `<strong>` on the page was getting its weight from the
plugin. See the new entry in `CLAUDE.md`'s trap table.

The bold was impossible rather than missing. Events Settings' `blurb` and `callout` were `textarea`
and `text`; the reference bolds inside both. They are rich text now (a `varchar → jsonb` conversion
applied by hand in `psql`, per the destructive-schema trap), and the seed writes the reference's
wording through `plainTextToLexical`, whose `**…**` parser already existed for the AAMLE panel.

### What the page is now

Hero (full-bleed photo when the event has an image, today's flat hero when not) → intro and host
callout → presenters → **recap, as the main body**, with anchored headings and an inline contents
list → photo gallery and downloads → one action row.

The row is the answer to three stacked elements that each did too little: the CTA paragraph, the
260px tile containing one word of location text already printed in the hero, and the back link.
It is now *Contact Us / Register* · *View this event on AAMLE* (only when a Host event page URL is
set) · *Back to all events*.

The cost/CPD pills are gone from every event page, matching the reference, which shows them nowhere.
`cpdPoints` and three Events Settings labels would have been orphaned by that, so `eventFormatLine`
in `ArchiveBlock` — the event cards' "Webinar · CPD eligible · Free" line — now reads all four
instead of hardcoding two strings and ignoring the point count.

### Caught immediately after, by asking one question of the finished page

*"What if we add resources — will the line still say contact our team for recordings?"* It did.
Measured: a past event with a download and no recap rendered *"Contact our team for recordings or
resources from this session."* directly above *"Downloads · Session recording"* — the page telling
someone to email for the file two inches below it. The concluded-event fallback is now two editable
lines, chosen on whether any photos or downloads are attached. Both branches verified, plus the
gallery-only case.

### Two measurements that lied on the way through

- **A deep link read as broken at `waitUntil: 'load'`** — heading at y=1006 instead of y=96. Images
  were still settling and the browser had not finished re-scrolling. At `networkidle` it lands at
  **96**, identical to the article page used as a control.
- **A break that proved nothing.** Two new fields were broken at once to test the orphan-field guard.
  `galleryHeading` went red; `hostEventUrl` did **not**, because `href={hostEventUrl}` is textually
  identical to the `{ field }` destructuring shape the matcher accepts. Recorded in
  `adminControls.int.spec.ts` rather than papered over — the guard is weakest exactly where a field's
  value is copied into an identically-named local.

---

## Comparison 26: /services — two card designs, and an icon the reference never drew (2026-08-17)

Three items raised from a side-by-side. Two were genuine port errors; the third was the opposite of
how it looked.

### The icon above "Independent Medical Examinations"

Reported as "not present on the reference". **It is** — `services.html:423` is
`<div class="svc-feature-icon"><i class="ph-duotone ph-activity"></i></div>`, with a 36×36 rule and a
16px margin, and the JME row below it deliberately has none.

It never draws, because **`ph-activity` is not in Phosphor's duotone set**. Measured in the reference:
that `<i>` computes `width: 0, height: 0` with `::before` content `none`, while
`.reporting-card-icon i` on the same page resolves to a real 24px glyph — so the webfont loaded
(unpkg returned 200) and the icon name is simply wrong. Ours drew one because `Icon` maps `activity`
→ Phosphor React's `Pulse`, which exists.

Removed by decision, to match what the reference *renders*. It is data
(`pages_blocks_split_feature_rows.icon`), so the fixture edit was paired with an unconditional repair
matched exactly against `'activity'`. Proven both ways: a restored `'activity'` is cleared on the next
seed, and a hand-picked `'shield-check'` survives it.

### The Administrative header

Ours put the intro beside the heading; the reference stacks it. Not a deviation — a port error. The
reference's `.admin-header` is a **wrapping flex row**, and at our container width it always wraps:
the heading block measures 788px, the subtitle is capped at 480px, and `788 + 20 + 480 = 1288 > 1132`.
Our port had frozen that into a `1fr auto` grid at 620+480, which fits inside 1132 and therefore never
wrapped. Now flex-wrap, with the eyebrow given `flex-basis: 100%` so our flat SectionHeader markup
reproduces the reference's two-row geometry without changing the shared component.

### The Enquire links

| | Reference | Build before | Build now |
|---|---|---|---|
| Reporting cards | 247 / 247 / 247 | ragged | **219 / 219 / 219** |
| Admin cards | 283 / 264 / 264 / **309** | ragged | **279 ×4** |

The reference aligns only the reporting cards (`flex-direction: column`, `p { flex: 1 }`,
`link { margin-top: auto }`) and leaves the admin ones genuinely ragged. Aligning both was requested,
so the admin section is a **deliberate departure**, recorded in the CSS beside the rule.

### Two card designs, not one

The reference has `.reporting-card` (white on grey) and `.admin-card` (translucent on blue); we render
both with one `.service-card`, which also renders on the homepage and `/for-clients`. Both treatments
are now ported into the `.svc-reporting` / `.svc-admin-split` scopes, so the shared card is untouched
elsewhere — confirmed by a computed-style snapshot over 14 routes: **only `/services` changed** (91
nodes), plus one 0.014px `matrix()` on `/in-the-loop`, which is the scroll-reveal frame signature.

Also caught by enumerating rather than looking: the split-row heading is `clamp(1.3rem, 2.2vw, 1.75rem)`
in the reference and had been ported at the shared `.section-title` scale of `clamp(1.7rem, 3vw, 2.5rem)`
— which is why "Independent Medical Examinations" wrapped to two lines at 40px where the reference sets
one at 28px. And the image-placeholder label is 0.72rem uppercase with 0.1em tracking, against our
0.85rem mixed case.

### Then the cards turned out to be sitting flush against the text

Reported after the above landed: "we need just a little extra space below the text and above the
cards". Measured, the gap was **0px** in the Administrative band and **16px** in the reporting one,
against **48px** for both in the reference.

**The diff had just reported this page as zero.** Its comparison loop excluded `margin` and
`margin-bottom` for any selector checked under a rename, on the stated grounds that they were
"verified equal in the browser" — the exact `NOT_PORTED`-shaped failure the tool exists to prevent,
inside the tool itself. Removing those two from the skip surfaced **11** spacing differences here and
one on `events`, none ever compared: both section headers' 48px, the split row's 14px/22px rhythm, and
every card's icon/heading/body margin (20/10/22 for reporting, 18/10/18 for admin).

The `events` one was a real false positive — the reference declares `margin-bottom: 24px` where
`.vf-breadcrumb` declares `margin: 0 0 24px`. Fixed by expanding `margin`/`padding` shorthands into
longhands during parsing, rather than by adding an exception; an exception would have left the same
blind spot for every future family. An excused shorthand now also excuses its sides.

One more instance of the stale-build trap on the way through, the fifth: with the rules in the file
and the diff at zero, the browser still measured 0px. `rm -rf .next` and a restart, source unchanged,
and both bands read exactly 48px.

### And then the intro was centred, by the fix for the spacing

Reported next: "the text isn't meant to be centred". It wasn't centred by design — it was a
regression from the pass above. That pass deleted an `!important` from the admin subtitle's margin,
justified as "the scoped rule already outranks `.section-subtitle`". True, and beside the point: the
rule it was actually beating is
`.vf-section-header--centered .vf-section-header__subtitle { margin-inline: auto }`, equal
specificity and declared ~1,600 lines later, so it wins on order. `SectionHeader` always emits that
modifier — which is exactly why the sibling `margin-inline` and `max-width` rules in the same block
carry `!important` too. Measured after restoring it: the intro starts at the same x as the heading at
1440, 1276 and 1100, matching the reference at all three.

**Neither tool caught it.** `computedSnapshot.mjs` measured `marginTop`/`marginBottom` and no
horizontal spacing, padding or position — the paragraph's width never changed, so a 326px sideways
shift was outside the instrument, and it reported the page as unchanged. It now records
`marginLeft`/`Right`, `paddingLeft`/`Right` and `textAlign`, proven by re-introducing the break:
0 changed nodes before, 2 after. And `referenceCssDiff.mjs` compared `!important` as part of a value,
so `margin: 0 !important` read as *differing* from `margin: 0` — which is what made deleting it look
like closing a gap. It strips the flag now.

### The tool was blind to every layered rule

`referenceCssDiff.mjs` treated `@layer` exactly like `@media` — collecting its rules into the
media bucket, which is never compared. So everything in `@layer components` — `.vf-section`,
`.vf-split__icon` and the rest — was reported as **absent from the build** while sitting in the file.
A cascade layer is not a conditional group; it applies at every viewport. Fixed, and the events family
still reads zero, so nothing was resting on the bug.

It also gained an `EXPLAINED` list: per-declaration exceptions with a reason each, for the differences
that cannot close — editor-controlled spacing presets and column counts against the reference's
literals, `stroke` on filled Phosphor icons, and two spellings of one computed value. Without it the
count could never reach zero, and a count that never reaches zero is one nobody reads. **services: 0.**

---

## Comparison 27: /ime — banding the assessment-format cards (2026-08-17)

Six changes to "Four Ways to Attend Your IME", a **FeatureGrid** block. Two findings changed what the
work actually was.

**The icons already matched — all sixteen.** The four card icons (`user`, `video-camera`,
`users-three`, `house`) and every one of the twelve "What's Included" icons are the same Phosphor
names the reference uses. Nothing in the seed or the database needed touching. What differed was
presentation: the reference sets each item icon in a 30×30 tinted tile and each card icon in a white
chip on a tinted band, while ours were bare glyphs on a flat card.

**The Videolink card's blue border and solid blue icon were the hover state**, not a featured
variant. There is no such variant in this repo — no field, no column, no CSS rule; `.service-card:hover`
sets `border-color: var(--primary)` and inverts the icon tile. The pointer was over that card in the
screenshot. Which turned out to be the sixth item anyway: that hover was reported as "a bit much".

### What changed

| | Reference | Was |
|---|---|---|
| Card top | `.ime-format-card-top`, `linear-gradient(145deg,#f0f8ff,#e6f4ff)`, padding 28/28/22 | no wrapper element at all |
| Card icon | 52px, solid white, radius 14, soft shadow | 48px, flat `--bg-light-1`, radius 10 |
| Item icons | 30×30 tile, `--bg-light-1`, radius 8 | bare 20px svg |
| The line under each description | none | `border-top: 1px solid var(--border-light)` |
| Hover | `translateY(-4px)`, `0 12px 36px rgba(28,117,188,.13)`, border `.22` | `translate(-4px,-4px)`, `--vf-shadow-hard`, border full primary, plus a 3px bar wiping across the top |
| Item alignment | `flex-start` | `flex-start` → **now centred, by request** |

Measured after: the header band is **140px** on both sides, the icon chip 52px white on both, the item
tiles 30×30 `rgb(203,229,250)` on both, and each item icon's midpoint sits within **0px** of its text
block's midpoint.

### The band needed markup, so it became a capability

`.service-card` had icon, title, description and details as flat siblings — nothing to paint. Rather
than hardcode a wrapper, `FeatureGrid` gained a third **Card style: "Banded"**, which renders
`.vf-card__head` and `.vf-card__body`. Opt-in for two reasons: the block renders on seven pages, and
`computedSnapshot.mjs` keys nodes by structural index path, so an unconditional wrapper would have
invalidated every one of those baselines in the same pass that needed them as a regression check.
Confirmed afterwards — only `/ime` moved (270 nodes), plus the usual sub-pixel `matrix()` on
`/in-the-loop`.

Worth recording: **no other page uses the `details` markup at all**, so the removed divider and the new
icon wrapper reach nothing else. The verification step written to check "the border is still there on
the other FeatureGrid pages" had no subject.

### A responsive bug the section was hiding

`FeatureGrid/Component.tsx` set an inline `grid-template-columns` **longhand**, which outranks every
stylesheet — including the responsive `.services-grid` overrides the comment at `globals.css:2189`
exists to protect. Every other grid block sets `--vf-cols` instead. So this grid was pinned 2-across
down to 480px. Fixed; and since `.services-grid` has a 2-column rule at ≤1024px and nothing below it,
`.ime-formats` also gained the reference's own 820px collapse to one column.

### Five deliberate departures, all in `EXPLAINED`

The card keeps its white→`#f7fbff` body gradient (reference: flat white) — asked for. The item icons
are centred against the whole item (reference: top-aligned with a 1px optical nudge, which is
meaningless once centred) — asked for. Section padding stays the editable `--space-normal` preset, the
column count stays the editor's `--vf-cols`, and `stroke` is not set on filled Phosphor icons.
`ime: 0`, and `events` / `services` still zero.

---

## Comparison 28: every carousel, cross-referenced (2026-08-17)

Prompted by the `/jme` specialist strip reading as too fast. **Seven instances, five
implementations. Five already matched the reference; two did not.**

| Carousel | Page | Build | Reference | |
|---|---|---|---|---|
| PeopleGrid marquee | `/services/medico-legal/jme` | 34s, arrows on | 60s, no arrows | **fixed** |
| PeopleGrid marquee | `/` | 60s, no arrows | 60s, no arrows | ✓ |
| Availability marquee | `/make-a-booking`, `/specialists/specialist-availability` | 30s | 60s | **fixed (speed)** |
| SlideCarousel | `/events` | 5800ms, arrows, dots, hover-pause | 5800ms intended | ✓ |
| FeaturedArticles | `/in-the-loop` | 5000ms, arrows, 3 dots | 5000ms, arrows, 3 dots | ✓ |
| TestimonialsGrid | `/` | no autoplay, arrows only | no autoplay, arrows only | ✓ |
| PeopleGrid marquee | `/style-guide` | 30s, arrows on | *no counterpart* | left as a controls demo |

Measured after: **every marquee reads `animation-duration: 60s`**, matching the reference on all four
of its own instances. `/in-the-loop` still advances at ~5s with 2 arrows and 3 dots; `/events` still
at ~5.8s with 2 arrows and 4 dots; the homepage testimonials still do not auto-advance at all.

### Arrow behaviour needed no decision

All four arrow implementations already behaved exactly as the reference's do. The direction-toggle
arrows on the specialist marquee — which look like an odd affordance — are **not ours**: the reference
does the same on `specialist-availability.html:170` and `make-a-booking.html:381`, `aria-pressed` and
`title="Move right"` / `"Move left"` included. The stepping arrows step on both sides.

### The 30s that was wrong in two places

The Availability strip passes no `speed` at all, so it fell through to the component's fallback — which
was 30, half the reference's 60. Fixing the fallback and the `PeopleGrid.speed` default together
corrected `/make-a-booking` and `/specialists/specialist-availability` without touching either block's
data. `globals.css`'s base `30s` was aligned too; it never renders, because the component always sets
an inline `animation-duration`, but a stylesheet claiming the wrong number is how the next person gets
misled.

### The reference's own events carousel is broken

Worth recording, because it looks like a difference and is not one. `events-seminars.html` is coded for
5800ms autoplay, hover-pause, arrow keys and a Pause/Play button — but no element carries
`data-offer-toggle`, so `toggleButton.addEventListener` throws at line 234 and **everything registered
after it never runs**: the hover-pause handlers, the keyboard handler, and the `start()` call itself.
In a browser the reference's carousel does not move at all. Ours matches the intent, which is the call
that was made here.

### Two accepted departures

- **No arrows on the Availability marquee**, where the reference has them. Decided deliberately.
- **SlideCarousel and FeaturedArticles ignore `prefers-reduced-motion`**, as the reference does. Only
  the specialist marquee honours it (`ExpertsCarousel/index.tsx:38` and `globals.css:2978`). Left as
  is, and recorded so it is a known state rather than an oversight.

### FeaturedArticles was the one carousel with no controls at all

5000ms autoplay, arrows and dots were all hardcoded. It now has `autoplay`, `interval`, `showArrows`
and `showDots`, defaulted to exactly the previous behaviour so nothing moved. Proven not inert: with
`autoplay` off the track stopped for 9s, and with `showDots` off the three dots disappeared while both
arrows stayed.

Deliberately **not** copying `SlideCarousel`'s `(interval ?? 5800) || 5800` idiom
(`SlideCarousel/Component.tsx:86`) — that turns a stored `0` back into the default, so the field
cannot express a value it accepts. The new one uses `?? 5000` and guards `tick <= 0` explicitly.

---

## Comparison 29: /jme "The JME Process, Step by Step" (2026-08-17)

Ported to the reference's treatment. Every measured value now matches:

| | Was | Reference / now |
|---|---|---|
| Step circle | 72px, 22.4px glyph, blue glow shadow | **56px, 16px, 4px band-coloured border, no shadow** |
| Step numbers | `01 02 03` | **`1 2 3`** |
| Heading | 40px, one line | **38.4px, wraps to two** (header capped at 600px) |
| Step title | 16.8px | **13.44px / 700, 6px below** |
| Step description | 14.4px | **12.48px / 1.55** |
| Connector | `top: 36px`, primary→light→primary | **`top: 28px`, light→primary→light** |

The circle's `border: 4px solid var(--band-muted)` is what makes the connector appear to stop at each
circle rather than run beneath it — the border is the band colour, so it masks the line.

### The numbering is per-instance, not a global style

`padStart(2, '0')` was hardcoded in `ProcessSteps/Component.tsx` for all four variants. Checking the
reference before changing it: it uses **both** — plain digits on `jme.html` and
`admin-services.html`, zero-padded on `for-clients.html` and `for-claimants.html`. So it became an
editable **Step number style** field, defaulted to `padded` so the other five instances did not move.

### The repair had to be keyed on the class, not the value

The first version set the number style whenever it was "still the default". But `padded` **is** the
default *and* a legitimate editor choice, so that predicate cannot tell an untouched block from a
deliberate one — it would have re-asserted `plain` on every seed run, forever. The `jme-process` scope
class is the marker instead, making the repair one-shot. Proven: with the class removed the block is
migrated, and with the class present a hand-set `padded` survives a reseed. Same shape as
`isUnauthored` — write into an absence, never into a value that merely looks like a default.

### Scoped, because `.vf-process*` is shared

The ProcessSteps "cards" variant also renders on `/admin-services`, `/style-guide` and (as other
variants) `/for-clients`, `/for-claimants` and the homepage. All confirmed unchanged after: still
`01 02 03` at 72px, and none carry the `jme-process` scope.

**Then done too — `/admin-services` (reference `.as-how`).** Same compact design, and every value now
matches: 560px header, `clamp(1.7rem, 3vw, 2.2rem)` heading wrapping to two lines, plain digits,
56px circles, `0 16px` step padding, and the connector at `top: 28px` starting at **155.5px** on both
sides.

The reference declares `.jme-process*` and `.as-how*` as two families, but they are the same design —
only the header width, the heading clamp and the step padding differ. The shared half is written once
as a grouped selector. The connector inset, which the reference hardcodes per family (10% for five
columns, 12.5% for four), is derived from `--vf-cols` instead:
`calc(100% / (2 * var(--vf-cols)) + 14px)`. That resolves to both reference values exactly and means a
three- or six-step process needs no new rule. Both families read zero with that noted in `EXPLAINED`.

### The heading-wrap guard fired, and was right to

`tests/e2e/frontend.e2e.spec.ts` went **19 → 18**: the `as-how` header caps itself at 560px and wraps
its title, which is precisely the fault that guard was written to catch. Here the wrap is the design —
the reference's own heading wraps at that width.

The guard could not tell the two apart by measuring, because in the DOM they are identical. Its claim
was narrowed rather than weakened: an `INTENTIONAL` map of section classes, each naming the reference
rule it ports. Re-proved red afterwards by restoring `max-width: 720px` on
`.vf-section-header--centered` — **3 specs fail**, 2 on `/`, 1 on `/about`, and, importantly, 1 on
`/services/medico-legal/admin-services`, because the exemption skips only the `as-how` header and the
guard still catches the other header on that same page. An exemption that blinded the whole page would
be worse than no guard.

The original fault was a *shared* rule capping every centred header site-wide; these are page-scoped
ports of a specific measured value. That is the distinction the map records.

A `jme` family was added to `referenceCssDiff.mjs` and driven to **zero**; `ime`, `services` and
`events` all still read zero. Three explained departures: the editable spacing preset, the editable
column count, and `display: block` on the step title — the reference needs it because its title is a
`<strong>`, ours is an `<h4>`.

---

## Comparison 30: /services/medico-legal/reporting-services — as settings, not a page scope (2026-08-18)

"Five Ways to Get the Specialist Opinion You Need" had the right content and the wrong everything
else. The cause was that the section had **almost no CSS of its own**: it is a `splitFeature` block,
and `globals.css` scoped 22 lines to it (the bullet dots). Everything else fell through to the shared
`.vf-split*` base, which is tuned for /ime, /jme and About.

| | Was | Reference / now |
|---|---|---|
| Row separator | none — a 64px gap | **1px `--border-light` rule, 60px padding either side** |
| Row title | 40px (full `.section-title` scale) | **25.6px, `-0.02em`, 14px below** |
| "When to Request" | bold sentence-case body text | **9.6px, weight 800, `0.14em`, uppercase, brand blue** |
| Body copy | 15.52px / 1.75 | **14.88px / 1.8, 20px below** |
| Bullets | 18px, tick icons | **13.28px / 1.5, 5px dots at `top: 8px`** |
| Gap under the description | 0px | **20px** |
| Header h2 line-height | 48px | **46.08px** |
| Placeholder | label only, 13.6px sentence case | **44px glyph above an 11.52px uppercase caption** |

### The design is a setting, not a class scoped to this page

The four page ports before this one (`.svc-learn-rows`, `.ime-formats`, `.jme-process`, `.as-how`)
all pin their design to a page class. Asked whether that should be editable instead, and it should:
the divider, the type scale and the dot bullets are **Row style**, **Text density** and **Bullet
style** on the Split Feature block, plus a per-row **Placeholder icon**. Each defaults to what
already rendered, so any split section site-wide can now take this look and none of them moved.
Proven both ways: `/style-guide` takes the dots and gives them back (5 ticks → 0 → 5).

Two things stayed page-scoped on purpose, and both are palette literals rather than design choices:
the placeholder gradient tilts 145deg here where the shared base uses 135deg, and the caption is
tinted differently. The base is shared with About, the homepage, /specialists and
/information-centre, whose own references keep 135deg.

### Three findings worth carrying

**A `defaultValue` forecloses using absence as a migration signal.** The repair was written to fire
when all four new fields were unset — sound, and wrong. A new column does not arrive null when its
field declares a default: the adapter emits `ADD COLUMN … DEFAULT`, which Postgres backfills into
every existing row. Measured before the repair had ever run, the block already read
`spaced/default/check`, indistinguishable from an editor's choice. `placeholderIcon` is the only one
of the four with no default, so it is the only genuine absence — and keying on it makes the repair
fire exactly once. Verified both directions: cleared, it restores; with Spaced chosen by hand, that
choice survives a re-seed.

**"Visually inert" is not "unchanged", and the snapshot is what knows the difference.** The
placeholder's `flex-direction: column; gap: 12px` was written unscoped, on the reasoning that
stacking a single child does nothing. True — and it still moved `row-gap` from `normal` to `12px` on
six boxes across `/`, `/about`, `/services` and `/ime`. Gated on
`:has(.vf-split__placeholder-icon)`, the compare came back with **only** this route and the usual
`/in-the-loop` sub-pixel scroll-reveal frame.

**A negative assertion needs a positive control, again.** The first draft proved the dot variant on
`/services` and reported "default ticks gone" — trivially true, because only reporting-services and
`/style-guide` have any bullets at all. Re-pointed at `/style-guide`, where the count goes 5 → 0 → 5
and the claim means something.

### Departures, each recorded rather than quietly taken

- **The header stays full width.** The reference caps it at 640px, which wraps its h2 to two lines.
  Not ported, by decision — which is why the heading-wrap guard needed no `INTENTIONAL` entry here.
  Its 19/19 staying put is the check that the cap was not ported by accident.
- **The caption colour is derived, not literal.** The reference hardcodes `#7aafc8`; ours mixes it
  from the brand colour so a rebrand retints it, landing within 1/255 on red and green and 16/255
  bluer. In `EXPLAINED`, with the measurement.
- **Stacking stays at our 860px, not the reference's 820px** — 860 is where every other `.vf-split`
  stacks, and splitting it would leave a 40px band behaving unlike the rest of the site. The
  reference's `order: -1` (image above text on *every* row when stacked) is ported; our base only
  reset `order` to 0, leaving it below the text on reversed rows.
- **`--compact` is deliberately not `.svc-learn-rows`' numbers.** /services is a different reference
  page with a different scale (title `clamp(1.3rem, 2.2vw, 1.75rem)`, body `0.95rem`). Unifying them
  would make both stop matching.

A `reporting-services` family was added to `referenceCssDiff.mjs` and driven to **zero** across 18
reference selectors; the other five families still read zero. The page also joined
`computedSnapshot.mjs`, which covered 14 of 29 routes and now covers 15.

---

## Comparison 31: Medical Negligence removed from the services pages (2026-08-18)

A content decision, not a fidelity one, and **a deliberate deviation from the reference** — recorded
here because the reference disagrees on both counts: its reporting-services page has five rows, and
its `/services` "Reports & Opinions" grid does carry a Medical Negligence card.

**VERIFY still accepts medical negligence claims.** This removes the service from the *services
pages* only. Untouched on purpose: the `medical-negligence` ClaimTypes doc (linked to 7 specialists),
the `/ime` claim accordion that lists it as a claim type, and the contact form's "Medical Negligence
Opinion" option — so enquiries still have a route in. The Services doc itself is still seeded and
kept complete, one edit from being usable again; it is simply listed nowhere.

| Page | Change |
|---|---|
| `/services/medico-legal/reporting-services` | The Medical Negligence row deleted — five rows to four |
| ditto | Heading **"Five Ways…" → "Four Ways…"**, which the row count had made wrong |
| ditto | All four rows switched to `imageSide: 'auto'` |
| `/services` | The card dropped from the Reports & Opinions grid (5 → 4, in a 3-column grid) |
| `/services/medico-legal` | "Medical Negligence opinions" removed from the "Other Reporting Services" prose |

### Alternation is now self-maintaining

The rows stored explicit `left`/`right` values, so deleting the third would have left
left · right · **right** · left. Rather than hand-flipping the survivors, all four moved to
`imageSide: 'auto'` — the field's own default, which alternates from the row's index. Adding or
removing a row again keeps the pattern with no manual fix, and an editor can still pin a single row.

### The first repair here that deletes a row, and why it keys on the heading

Every prior repair fills an absence. Deleting inverts the safety argument: the obvious predicate —
"a row with `anchorId: medical-negligence` exists" — would delete that row on **every** future seed
run, so an editor who deliberately re-added the service would lose it again with no way to tell why.

The superseded heading string is the marker instead. It is content, so it has no `defaultValue` to be
backfilled (the trap recorded last session), exactly one thing ever wrote it, and this repair is what
replaces it. Proven in both directions:

- Restored the full superseded state — the row re-inserted through the API, explicit left/right, the
  old heading, the old prose, the card back on `/services` — re-ran the seed, and **all four edits
  reapplied**.
- Then, with the heading at "Four Ways", added a Medical Negligence row by hand and re-ran the seed:
  **it survived**. That is the assertion that separates one-shot from "worked once".

### Two things the first pass got wrong

**The parent page was missed.** The prose edit went into the fixture only, and `/services/medico-legal`
is an authored page — so `authorPage` early-returns and the live page went on advertising a service the
page below it no longer had. Caught by asserting the served HTML of every affected page rather than
only the one being worked on.

**A content-anchored regex hit the wrong page.** A rewrite scoped from `heading: 'Four Ways` matched
`/ime`'s identically-worded *"Four Ways to Attend Your IME"* first, ~440 lines earlier, and ran over
that region instead. It happened to change nothing, and `git diff` is what showed that — the same
blast-radius failure as the bulk edit recorded last session, from the opposite direction. Redone with
explicit line numbers, each asserted against the `anchorId` on the following line.

### Verification

Snapshot moved **only** `/services/medico-legal/reporting-services` (31 nodes) and `/services` (8),
plus the usual `/in-the-loop` scroll-reveal frame. Nothing links to `#medical-negligence` — the two
anchors `links.e2e.spec.ts` asserts are `#file-review` and `#expert-evidence`, both surviving — so the
links spec stayed green unedited. All six CSS families still read zero; this pass changes no CSS.

**One thing to look at rather than fix blind:** the `/services` grid is `columns: '3'`, so four cards
now leave a single orphan on the second row. It is an editor field, one click to change to 2 or 4, and
3 is what the reference sets — so it was left alone.

---

## Comparison 32: /ime "What's Included" — and the two tool bugs that hid it (2026-08-18)

Reported by eye, on a page the diff tool had been reporting as **zero** since Comparison 27. That is
the finding; the CSS fix is three declarations.

| | Was | Reference / now |
|---|---|---|
| Detail description | **18px / 30.6px**, `--text-dark` | **12.8px / 19.84px**, `--text-mid` |
| "WHAT'S INCLUDED" label | `rgb(34,34,34)` | **brand blue** `rgb(28,117,188)` |
| Detail title colour | correct, but only by inheritance | declared explicitly |

The description size is why those cards ran so much taller than the reference's — every item wrapped
to three lines instead of one or two.

### Why a family reading zero was wrong twice over

**1. `color` was blanket-skipped for every aliased selector.** `referenceCssDiff.mjs` carried
`['position', 'z-index', 'overflow', 'color']`, so no colour difference on any renamed selector could
ever be reported. The skip sat *directly beneath* the comment explaining that `margin` had been
removed from that same list after hiding 11 real spacing gaps on /services — the lesson was written
down and the next entry in the list went unexamined.

Deleting `color` surfaced **five** more across three families. Each was then measured in the browser
at 1440px before being judged, rather than assumed either way:

| Selector | Verdict |
|---|---|
| `.svc-feature-img-label` | **Real.** 50%-translucent primary against an opaque `#7aafc8`. Fixed — same brand-mix as reporting-services. |
| `.svc-feature-link:hover` | Artefact. `var(--primary-strong, var(--primary-strong))` — a doubled fallback that defeated the token resolver. Simplified; both measure `rgb(21,95,160)`. |
| `.events-hero-breadcrumb` | Explained. `--bc-link` has three context-dependent definitions; on a dark band it resolves to the reference literal exactly. |
| `.events-hero h1` | Explained. Ours colours via `.page-hero--dark`; both measure `rgb(255,255,255)`. |
| `.ime-format-included-text strong` | Explained → **fixed anyway.** Both measured `rgb(65,64,66)`, but ours only by inheritance, so it is declared now. |

**2. A `null` mapping carried a false justification.** `'.ime-format-included-text span': null` was
annotated *"no rule of its own on either side; both inherit body type"*. The reference declares three
properties on it. A `null` deletes a selector from the comparison entirely, so that one comment is
the whole reason the size difference was invisible — no amount of re-running the tool could find it.

Both are now in `CLAUDE.md`'s trap list. The general shape: **a comparison tool's exclusions are
load-bearing code, and a blanket skip is not a reason.** An exclusion belongs in `EXPLAINED`, per
selector, per property, with a measurement.

### One probe mistake worth recording

The first browser probe compared `.ime-formats .vf-card__title` against the reference's
`.ime-format-card-top h3` and reported the card title as the wrong colour. Two errors at once: the
selector matched the *first* card on the page, which belongs to a different grid; and the reference
paints nothing at `h3` level — both halves of "**In-Person** Assessment" live in coloured spans
(`.card-name` blue, `.card-type` dark), where ours puts the blue on the title element and the dark on
the suffix. Comparing the halves that actually render: both `rgb(28,117,188)` / `rgb(65,64,66)` at
16.8px/700. No defect — but "the tool says zero and my probe says red" is worth resolving before
changing CSS, not after.

### Verification

Snapshot moved **only** `/services/medico-legal/ime` (62 nodes) and `/services` (2, the caption
colour). All six families read zero again, now with `color` genuinely compared. int **131/131**,
e2e **19/19**.

---

## Comparison 33: specialist profiles — a data problem wearing a design problem's clothes (2026-08-18)

You reported two things on `/specialists/profiles/<slug>`: the line under the name showed the
specialty ("Spinal Surgery") instead of the job title, and every qualification carried the same icon.

**The CSS was already correct.** Measuring 15 element groups against the reference at 1440px — hero,
avatar, name, subtitle, chips, section labels, bio, area items, type items, sidebar card, sidebar
title, list rows, icon, content band, grid — every one matched. The only deltas were a `color-mix`
serialisation artefact and **0.03px** on an icon box. Nothing here was a porting failure; three
fields were wired wrongly.

| Defect | Cause |
|---|---|
| Subtitle showed the specialty | `specialty` is `required: true`, so the `specialty.title \|\| position` fallback could never reach `position` — a field seeded for all 26 and rendered on none |
| All 96 qualifications showed `medal` | The per-row `icon` field existed; the seed dropped it, so the `\|\| 'medal'` fallback fired every time |
| Accreditation icons hardcoded | `Accreditations.icon` was declared, described as driving "the profile chips", and read by nothing |

### The icon rule is extracted from the reference, not invented

Parsing all 26 reference profiles yields **86 distinct text→icon pairs with zero conflicts** —
`graduation-cap` 33, `medal` 28, `seal-check` 17, `certificate` 8. A classifier over that corpus
reproduces **all 86 exactly**, and getting there took two iterations: the first version missed
`MRCPSYCH (UK)`, and the token added to fix it broke `FRACDS (OMS) RACDS`. A rule that reads sensibly
is not a rule that is right.

That proof is now a test (`tests/int/qualificationIcon.int.spec.ts`) which re-derives the corpus from
the reference on every run rather than comparing against a pasted table — a table in a test can only
prove the copy still matches itself. Proven red both ways: breaking the certificate branch fails with
8 named mismatches, dropping `fracds` fails with exactly the one case an earlier version got wrong.

### Verified by enumeration, not by looking

All 26 profiles compared against the reference, panel by panel: **153 qualification and accreditation
rows, 0 icon mismatches, 0 subtitle mismatches**, and 4 distinct icons rendering where there had been
1. Icons were identified by SVG path fingerprint, because Phosphor React emits path data and never the
slug — grepping our HTML for an icon name could only ever return "absent".

Splitting the comparison **per panel** rather than per page is what found the one real content gap:
`dr-amritash-rai` was missing all three of his accreditations (AMA 5, PIRS, GEPI 2). A whole-page row
count had hidden it, because a shortfall in one panel cancelled against a surplus in the other.
`dr-david-wheatley` keeps a deliberate difference — the reference prints one row reading "CIME, AMA 5"
where ours holds two records, consistent with the taxonomy decision below.

### Two guard holes found

**The orphan-field guard cannot see a field with a common name.** It joins every consumer file into
one haystack — deliberately, since per-collection scoping produced false positives — so a field called
`icon` is satisfied by any of the **27 files** containing a `.icon` read. `Accreditations.icon` was
green throughout. Recorded in `CLAUDE.md`; the same hole covers `title`, `description` and `link`.

**`referenceCssDiff` did not decode CSS unicode escapes**, so `content: '\\203A'` read as differing from
`content: '›'` — the same character. Fixed in `normalise()`, which covers any escaped glyph.

### One thing deferred rather than done

Mapping the breadcrumb selectors instead of skipping them surfaced a **real, closeable** difference:
our light-band breadcrumb renders darker and heavier than the reference's (link `rgb(34,34,34)` vs
`rgb(115,115,115)`; separator also darker and 12.48px vs 10.6px; current navy/700 vs `rgb(65,64,66)`/900).
The reference is consistent — those three values appear 49/23/46 times across its pages — so ours
differs on **every** interior page, not just this one. No family had compared a light-band breadcrumb
before; the `events` one is on a dark hero, where our tokens already match.

The fix is three token values, not a page-scoped override, and it changes ~25 pages at once. Logged
as `OUTSTANDING.md` §5 with its cost, and recorded per-declaration in `EXPLAINED` so the family still
reads zero and can catch the next regression — legitimate only because each entry says what the
difference is and where the decision lives.

### Approved deviations, unchanged

The breadcrumb trail stays ours (Home › Specialist Panel › the doctor's name, against the reference's
two-item generic trail); qualifications stay in the case they are typed rather than the reference's
capitals; and the Assessment Types / Areas taxonomy keeps our wording — MVA/CTP as one record,
"Expert Evidence / Witness", "Joint Medical Examination (JME)" — because those match the service names
used elsewhere on the site and drive the Specialist Panel filters.

A `specialist-profile` family now reads zero across 37 reference selectors, and the route joined
`computedSnapshot.mjs` (15 of 29 routes → 16). Snapshot moved only `/specialists` (7 nodes — Amritash
Rai's restored chips on his directory card) plus the usual `/in-the-loop` frame; **zero** on the
profile route itself, since the harness measures computed style and this pass changed content.
int **134/134** (three new), e2e **19/19**.

---

## Comparison 34: /information-centre/for-clients — a field nobody set (2026-08-18)

Reported: the three support cards do not match, and "OUR SERVICES" is completely different. Measured
against the reference at 1440px, **34 differing declarations** across the two sections.

### "Our Services" was one unset field

The reference renders those eight cards as centred tiles — icon above a centred title, 172px minimum
height. Ours rendered `display: block`, left-aligned, no minimum height, because the block's **Card
alignment** field was never set and defaults to `left`. The homepage runs the *identical* grid with
`cardAlign: 'center'`, so the two pages had been disagreeing with each other.

Two more differences in that section were also field values, not CSS:

| | Ours | Reference |
|---|---|---|
| Band | flat `--band-muted` grey | `--band-accent`, which is **byte-identical** to its gradient |
| Padding | 120px (`spacious`) | 88px — exactly where `--space-normal` caps |

So the section that looked "completely different" needed **three stored values**, not a port.

### The card the reference uses on only two pages

The rest is CSS, and the constraint that shaped it: the reference uses `.service-card` on **index.html
and for-clients.html only**, both as centred tiles. We generalised the class across ~8 pages, which is
why its shared geometry drifted. The reference-exact paint therefore went on
`.services-grid.vf-cards--center` — a variant used by exactly those two pages — rather than the base
class, which would have dragged six pages the reference never styled this way and taken four families
that read zero with it.

The homepage was wrong in the same way and is now correct too: measured against *its* reference,
**0 differences**.

### The support cards are a different card, so they are a different style

The reference's `.client-support-item` is not its service tile: flat white rather than the shared
gradient, wider radius, soft blue shadow, 46px icon, and a gentle `translateY(-2px)` hover instead of
the neo-brutalist shift. That became a fourth **Card style** on Feature Grid — *Soft* — alongside
Card / Plain / Banded, so any feature grid can take it. It replaces `.vf-client-support`, which set
four of these declarations and left the rest to the shared card: the reason the section never matched.

### Two bugs found by measuring, that reading could not have caught

**I broke the tiles' hover while fixing their resting state.** The new
`.services-grid.vf-cards--center .service-card` rule is (0,3,0); `.service-card:hover` is only (0,2,0).
Adding a scoped resting shadow silently disabled the neo-brutalist hover the reference *does* specify.
Caught by measuring hover, not by reading the file, and fixed by restating it at that specificity.

**The reference's own hover cannot be measured with JavaScript on.** Its scroll-reveal sets an *inline*
transform, which outranks the stylesheet's `:hover` rule — so the reference read as `matrix(1,0,0,1,0,0)`
and looked like it had no hover at all. Measured with `javaScriptEnabled: false`, both sides match
exactly: `translateY(-2px)` for support cards, `translate(-4px,-4px)` with a `6px 6px 0` hard shadow
for the tiles, and no accent bar on either.

**A stale Turbopack build, for the sixth time.** The intro scope rules were in the file, the class was
in the DOM (`vf-section-bare vf-split-feature vf-client-overview`), and every value was unchanged.
`rm -rf .next` and a restart, source untouched, and they applied. Checking *whether the class reached
the DOM* is what separated "stale build" from "bad selector" in one step.

### Extended beyond the report, deliberately

The intro above the cards measured **10 further differences** (heading 700 vs 800 at a 2.5rem cap
against 2.4rem, paragraph line-height, and a placeholder with no glyph where the reference draws a
52px one). They are in the same section, so they were closed too rather than left behind — the
`placeholderIcon` field built for reporting-services covered the glyph.

### Two tool fixes

`referenceCssDiff` now normalises whitespace around `/`, so `aspect-ratio: 4 / 3` stops reading as
different from `4/3`; and the accent bar our cards draw — which no card in the reference has — is
dropped on both these sections per your decision, leaving it on the pages that have grown to expect it.

A `for-clients` family reads zero across 32 reference selectors. Snapshot moved **only** the two
intended routes (`/information-centre/for-clients` 88 nodes, `/` 30) plus the usual `/in-the-loop`
frame. int **134/134**, e2e **19/19**.

---

## Comparison 35: the FAQ accordion — one design, four pages (2026-08-18)

Reported: the FAQ sections on `/information-centre/for-claimants` and `/information-centre/for-clients`
are "completely different" to the reference. Then widened: fold in every other page the same change
touches, so they all become correct rather than merely untouched.

### The content was already perfect

All **32 questions and all 32 answers** across the two Information Centre pages are byte-identical to
the reference — established by extracting both sides and diffing them, not by reading. Every gap was
presentation. That also corrects three earlier entries: Comparisons 12 and 13 both recorded "15
questions" (there are 16), and Comparison 6 cleared the JME FAQ on question text alone.

### The reference has one accordion, not four

Its three accordions are the same flat divided list — transparent rows, a hairline between each, no
boxes, no radius, no gaps. They vary on four axes only:

| | Information Centre | /ime claim types | /jme FAQ |
|---|---|---|---|
| Toggle | bare CSS chevron | 28px circled ± | 28px circled ± |
| When open | question tints blue | question stays dark, pill fills | ditto |
| Rule colour | `#e2e8f0` | `rgba(28,117,188,.15)` | `var(--border-light)` |
| Leading icon | none | 36px tinted tile, answer indented 52px | none |
| Question size | 0.97rem | 0.95rem | 0.92rem |

Ours drew all four as rounded outlined white cards with a 12px gap and a `+` glyph — one design
decision applied everywhere, and wrong everywhere.

### Fixed as block settings, not page scopes

Six fields on the FAQ block — **Item style**, **Toggle style**, **Icon style**, **Density**, **Rule
colour**, **Content width** — plus a reusable **Pale blue** Section background. Every one of them
declares **no `defaultValue`**, so an unset value renders exactly what the block rendered before they
existed. Proven, not asserted: with the fields added and no stored data touched, the computed-style
snapshot moved **0 nodes** across 18 routes (8228 → 8228).

That also makes the repair possible. A field carrying a `defaultValue` cannot be a migration signal —
the adapter emits `ADD COLUMN … DEFAULT` and Postgres backfills every row. Confirmed in the schema:
all six new columns arrived with an empty Default, against `columns`, which shows `'1'::enum…`.

Two pairings are **derived rather than exposed**, because the reference makes the same pairing every
time and a field would invent a choice the design does not offer: the open-state tint follows the
toggle (chevron tints the text, pill fills the pill and leaves it dark), and the 52px answer indent
follows the icon tile. The rule colour is *not* derivable — /ime and /jme share the pill but use
different rule colours — so it gets its own control.

Retired on the way: `.vf-faq.jme-faq-aside`, a page-scoped class that hand-rolled the two-column
layout `columns: 'split'` already provides.

### What the measurement caught that reading would not

- **The diff tool had never covered any of this.** `referenceCssDiff.mjs` matches `ime` on
  `^\.ime-format` and `jme` on `^\.jme-process`; `.ime-claim-*` and `.jme-faq-*` fall outside both,
  and there was no Information Centre family at all. Those families read zero throughout while a
  second section on each of the same two pages went unmeasured. Four new families now cover them.
- **The construction differs and the rendering does not.** The reference hangs its n+1 hairlines off
  the list's `border-top` plus each item's `border-bottom`; ours off each item's `border-top` plus
  `:last-child`. Walking every element and collecting each non-zero border: /ime draws **10 rules on
  both sides**, one colour, spanning an identical **763px**; /jme draws **6 on both**, `rgb(198,198,198)`
  on both, spanning an identical **440px**. The reference is not self-consistent here — the
  Information Centre pages use *our* construction — so one family had to carry the note either way.
- **`max-height` and `transition` are a JS accordion's mechanism, not its appearance.** The reference
  animates a div from `max-height: 0`; a native `<details>` does not render its answer when closed.
  The open state is what matters, and it is byte-identical: /ime `0px 0px 20px 52px`, 820×69,
  14.08px/24.64px; /jme `0px 0px 20px`, 680×94, same type.

### One deliberate deviation

The reference's subtitle is a 600px box sitting *un-centred* inside its own 640px header, so its text
lands 20px left of centre under a centred heading. Ours is centred. This is the reference failing to
execute its own intent rather than expressing one, so it is not ported — recorded here rather than
matched.

### Result

All **twelve** `referenceCssDiff` families read zero, including the four new ones. Both toggle states
measured in the browser: chevron rotates 45° → −135° and tints to `rgb(28,117,188)`; pill inverts from
`#cbe5fa`/blue to blue/white while the question stays `rgb(65,64,66)`. Multiple answers can now stay
open on the Information Centre pages (asserted 2 open at once); /ime keeps one-at-a-time, per its
field. The Style Guide's FAQ still renders the untouched card style, so the default stays visible.
Snapshot moved only the four intended routes plus the usual `/in-the-loop` scroll-reveal frame.


## Comparison 36: /specialists/join-expert-panel — 110 lines of CSS nobody could reach (2026-08-18)

Reported: the enquiry section's styling and colouring are off, the "Enquiry Form" title sits outside
the box, and the fields have no placeholders.

### The styling half was never a CSS problem

`globals.css` already held a complete, correct port of this section — the `1fr 1.5fr` grid, the
left-aligned intro, blue contact links, and the form promoted to a card so its heading sits inside.
**None of it could ever render.** Every rule hung off a `cssClass` value (`vf-join-eoi`, `__layout`,
`__contact`, `__form`) that existed only in the seed fixture: `authorPage` early-returns on an
authored page, so the class never reached the database. Measured: **zero** `cssClass` rows for this
page, and no `vf-join-eoi*` class anywhere in the served HTML. One of the five, `.vf-join-eoi-form`,
was single-hyphen against a BEM double-underscore fixture and could not have matched even if the data
had been there.

So the fix was not to write CSS. It was to stop expressing the design as stored data:

| Was | Now |
|---|---|
| `cssClass: 'vf-join-eoi__layout'` | Row → **Column ratio** (1 : 1.5) + the new **Extra wide** (72px) gap |
| `cssClass: 'vf-join-eoi__contact'` | Icon List → **Heading align: Left** |
| `cssClass: 'vf-join-eoi__form'` | Form → **Card style** |
| `cssClass: 'vf-join-eoi__note'` | nothing — the Callout's `reassurance` style already emits the reference's own `.join-form-note` markup, measured identical |

The Form **Card style** field earns its keep beyond this page: `.ct-page .ct-enquiry-form`,
`.vf-join-eoi__form` and `.vf-home-enquiry-formcard` were three hand-rolled versions of one treatment.
All three are now the field, with only genuine per-page residuals left scoped — Contact's centred
width cap, the homepage's 24px heading gap.

### Placeholders were a missing capability, not missing content

Payload's form-builder declares `placeholder` on `select` and on no other field type, and our renderer
never read it. Both halves are fixed: the plugin's Forms collection override appends a **Placeholder**
field to text/email/textarea/number, and `renderField` emits it — including on `select`, whose
schema-supported placeholder had been silently inert behind a hardcoded "Select…".

A trap worth recording: the plugin's own `fields` config merges with `deepMergeWithSourceArrays`,
which **replaces** arrays rather than concatenating. Passing `{ fields: [placeholderField] }` there
would have wiped each block's real fields — name, label, width, required — leaving only the
placeholder. Appending to the built blocks in `formOverrides.fields` never restates what the plugin
already defines.

### Measured, not eyeballed

Everything below was `getComputedStyle` at 1440px with JavaScript disabled on both sides:

- Grid: **`424px 636px` with a 72px gap** — identical on both sides.
- Card: 636px wide, 40px padding, 16px radius, same shadow colour.
- Contact list: item 24.5px, icon 23.2px, list 65px tall, 16px gap — all identical.
- Inputs were **48.45px against the reference's 43px**, and the submit **56px against 48px**. Both came
  from our controls inheriting the body's 1.7 line-height where the reference's take the UA default.
- The submit's padding is **13px 28px, not the 15px 32px `.form-submit` declares** — a global
  `!important` block covering every `.btn` overrides it, so the reference never draws what it declares.
  Porting the declaration would have been porting a button that does not exist.

### Scope discipline

The form metrics are scoped to `.contact-form`, not the shared `.form-group`. Unscoped, they reached
the site-wide enquiry drawer and moved **every one of the 19 routes**; the reference gives its drawer
its own `.enquiry-panel-body` sizing, and ours mirrors that. Scoped, the change touches exactly the
three pages with an on-page form. Contact and the homepage moved *toward* their own reference —
Contact's form now measures 43 / 180 / 48 against the reference's 43 / 180 / 48.

### Result

A new `join-expert-panel` diff family reads zero, and so do the other twelve. Snapshot moved only
`/specialists/join-expert-panel` (59), `/contact` (30) and `/` (26), plus the usual `/in-the-loop`
frame. Both reported items asserted in the served HTML: six non-empty placeholders on the on-page form
(not the drawer's), and `<h3>Enquiry Form</h3>` inside the card, above the `<form>`.

**Deliberate deviations, recorded:** Message stays **required** (the reference leaves it optional; an
expression of interest with no message is not useful). The reference's intro sits **6px** lower than
ours via a nudge on a wrapper we do not have — measured, not carried.


## Summary of recurring, cross-page issues

> **Re-audited 2026-08-17 — read Comparison 22 above before acting on anything here.** Nine of the
> twelve items left open below are resolved; item 9 survives only on three cards, item 10 was
> mischaracterised, and item 7 is the one still genuinely unchecked. The entries are left in place
> because the per-page comparisons above reference them by number.

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

~~Recommend tackling items 1–6 and 12 first, since they're template/component-level and will likely resolve automatically across most pages once fixed in one place.~~

**Superseded by Comparison 22 (2026-08-17).** Items 1–6, 8 and 11–13 are verified resolved; that
recommendation is spent. What remains of this list is item 9 (three Featured cards on In the Loop)
and item 7 (unverified). The open work is now in Comparison 22 §A–F, not here.

---

## Comparison 37: a prefilled registration email, editable in one place (2026-08-18)

Requested by the team, not a reference gap: portal access is by registration only, so a visitor
should be able to click once and have the enquiry written for them — the same convenience the
availability grid already offers. Two buttons: a new one on `/contact`'s Online Booking Portal card
below **Call 07 3356 0469**, and `/make-a-booking`'s existing **Register an Account**, which merely
navigated to `/contact`.

### The copy is a port, the button is not

The reference already wrote this email and ships it on **28** of its own pages as a `Send Enquiry`
button — subject `VERIFY Booking Portal Access Request`, body asking for Full Name /
Company/Organisation / Contact Number / Email Address. That wording is carried over **byte for byte**,
trailing spaces after each label included, and the e2e test parses it out of
`.design-reference/specialists/profiles/dr-adam-parr.html` rather than restating it, so a drift in
the port cannot be absorbed by editing the assertion.

**The Contact card button itself is a deliberate addition the reference does not have** — its card
offers only the phone number. Recorded here so a later audit does not "correct" it away.
`/make-a-booking`'s reference link points at `/contact.html`; sending it to the mail client instead
is also deliberate, and the page's closing CTA band still offers the enquiry form.

### Where it is edited

One template in **Site Settings → Booking portal registration email** (send-to, subject, body). Both
buttons read it at render, so one edit changes both — proven by setting the subject to
`EDITOR WORDING TEST` and watching both pages change on the **first** reload.

### The constraint that shaped it

`CMSLink` cannot become async — three client components import it (`HighImpact`, `Header/Nav`,
`Header/Component.client`). So the new `portalEnquiry` link type is resolved into a `mailto:` by the
*block*, and is offered **only on the two blocks that resolve it** (`link({ portalEnquiry: true })`).
Offering it everywhere would have produced a control an editor can set that renders an inert span —
the failure this repo exists to prevent. The enum bears this out: `portalEnquiry` exists on
`enum_pages_blocks_button_links_link_type` and `enum_bkchooser_halves_links_link_type` and on nothing
else.

TypeScript enforces it too. The resolver's return type narrows `type` to what `CMSLink` accepts, so a
block that forwards raw links fails to compile — observed, not assumed: both call sites errored with
`'portalEnquiry' is not assignable` before they were wired up.

### Measured

- `/contact` carried **3** plain `mailto:admin@vmls.com.au` links before this and **0** with a
  subject, so every assertion is scoped to the portal card and keyed on the subject. Without that, an
  unscoped "is there a mailto?" passes whether or not the button was ever added.
- Blanking the recipient renders `data-link-unresolved` and **no** `mailto:?subject=` anywhere —
  both states asserted, not just the working one.
- The new button's computed style is **byte-identical** to the phone button above it.
- Snapshot: `/contact` only (80 nodes, +5 real), plus the usual `/in-the-loop` scroll-reveal frame.
  `/make-a-booking` is clean — only an href changed, and href is not a measured property.
- The one non-obvious node: `.ct-portal-card__features` went `margin-top: 43.125px → 0px`. That is
  `margin-top: auto` doing its job — the features block absorbs the card's slack, and a third button
  consumed it. No overflow; the 1px separator and 22px padding are intact.

All **13** diff families still zero; the new button is not in the reference, so none should move.
