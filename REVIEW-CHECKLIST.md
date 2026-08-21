# Manual review checklist

Every page and every block on it, in the order they render. Tick as you go.

**Generated 2026-08-17** from the live `/api/pages` on the local production server — this is the
actual block list from the database, not a reading of the rendered HTML. `/search` is a dedicated
route rather than a Pages document, so it appears under *Site-wide* below instead.

**Counts re-measured 2026-08-20: 26 CMS pages, 136 blocks** (was 27 pages / 215 blocks at
generation). The Style Guide page was removed, and the 2026-08-20 content cull took the rest. **The
per-page block lists below have NOT been regenerated**, so treat a block that is listed and is not on
the page as a stale line rather than a missing block — /in-the-loop is the one where that is
expected, and its section explains why.

## How to use it

- Blocks are listed **in render order**, nested exactly as they nest in the admin
  (Section → Row → Column → block).
- The quoted text is the block's own heading, so you can find it on the page. `[[brackets]]`
  are stripped — they are the brand-accent marker, not literal copy.
- Counts in parentheses (`6 cards`, `3 steps`) are what the block actually holds, so a block
  that has lost its content is visible here before you open the page.
- **Content inside an inactive tab is not in the served HTML.** Tabs are expanded below; click
  each pane. This has already caused a block to be reported missing when it was rendering fine.
- Anchors are shown as `#name` where a block defines one.

**Before logging something, check it is not already known.** `verify-website-design-diff.md`
Comparison 22 closed all six of its items, and Comparison 24 records the events pages. The
deliberate deviations from the reference, which are **not** faults: the nine breadcrumb trails, the
Contact portal section, the footer opening hours, the brand typeface, and the search bar on
`/events` (the reference hub has none).

**Heads-up on the rest of the site.** The events pages have been diffed declaration by declaration;
no other page has. The reference sizes heroes per page family — `/services` at 42.4px and `/contact`
at 69.6px against our shared 60.8px — so expect similar gaps elsewhere, and see
`node tests/visual/referenceCssDiff.mjs` for how to enumerate them rather than spot them.

**To compare against the design reference**, serve it over HTTP — never `file://`, which silently
drops its stylesheet and makes everything read as an unstyled default:

```bash
(cd .design-reference && python3 -m http.server 4100)
```

---

## Site-wide — review once, not per page

- [ ] **Header nav** — every item resolves, including any pointing at an article
- [ ] **Footer** — nav columns, contact block, opening hours, social links
- [ ] **Enquiry drawer** — opens, submits, and a row appears under **Form Submissions**
- [ ] **Breadcrumbs** — see Comparison 22 §A before logging anything
- [ ] **`/search`** — results render and each links somewhere real
- [ ] **404 page** — an unmatched URL lands somewhere sensible
- [ ] **Mobile** — nav, hero, and any carousel at a narrow width
- [ ] **Skip link** — tab from the top of any page; it should appear on focus

---

## Pages

### Home  
`/`

- [ ] **Hero** (homeHero) — "Ensuring Accuracy, Empowering Justice" — subtitle, shield, breadcrumb
- [ ] **Gateway Cards** — "Medico-Legal Support, Tailored to You" (3 cards)
- [ ] **Split Feature** (1 rows)
- [ ] **Tabs** — "Comprehensive Medico-Legal Services" (2 tabs, #services)
  - [ ] Tab: **Medico-Legal Services**
    - [ ] **Services Grid** (manual, grid)
  - [ ] Tab: **Educational Services**
    - [ ] **Process Steps** — "Complimentary Education for Industry Professionals" (3 steps, edu-panels)
    - [ ] **Feature Grid** (1 items)
    - [ ] **Button** (1 links)
- [ ] **Section**
  - [ ] **Row**
    - [ ] Column 1 of 2
      - [ ] **Text**
      - [ ] **Heading** — "Claims We Support"
      - [ ] **Text**
      - [ ] **Button** (1 links)
    - [ ] Column 2 of 2
      - [ ] **Specialty Grid** (auto, checklist)
- [ ] **People Grid** — "Meet Our Expert Panel" (specialists, carousel)
- [ ] **Testimonials** — "What Our Clients Say" (auto, carousel)
- [ ] **Section** (#contact)
  - [ ] **Row**
    - [ ] Column 1 of 2
      - [ ] **Contact Details** — "Request a Booking or Make an Enquiry" (4 items)
    - [ ] Column 2 of 2
      - [ ] **Form**

### About VERIFY  
`/about`

- [ ] **Hero** (pageHero) — "Who We Are & What We Stand For" — subtitle, shield, breadcrumb
- [ ] **Split Feature** (1 rows)
- [ ] **Mission Pillars** — "Excellence in Medico-Legal Reporting" (6 pillars, #about-mission)
- [ ] **Split Feature** (1 rows)
- [ ] **Value Cards** — "CCARRE — The Principles That Guide Us" (6 cards)
- [ ] **Why VERIFY** — "What Sets Us Apart" (6 items)
- [ ] **Leadership Spotlight** — "Built by Someone Who Lived the Problem" (4 credentials)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Meet the Team  
`/about/meet-the-team`

- [ ] **Hero** (pageHero) — "The People Behind VERIFY" — subtitle, shield, breadcrumb
- [ ] **People Grid** — "Experienced, Dedicated & Client-Focused" (team, grid)
  - [ ] Department headings read correctly and sit in the order set in Taxonomy → Departments
  - [ ] Nobody is missing — a member with no department does not silently drop out of the grid
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Contact Us  
`/contact`

- [ ] **Hero** (pageHero) — "Make an Enquiry or Book a Service" — eyebrow "Contact", subtitle, shield, breadcrumb, 3 meta items
- [ ] **Section** (#enquiry)
  - [ ] **Row**
    - [ ] Column 1 of 2
      - [ ] **Form**
    - [ ] Column 2 of 2
      - [ ] **Heading** — "Online Booking Portal"
      - [ ] **Text**
      - [ ] **Text**
      - [ ] **Button** (1 links)
      - [ ] **Text**
      - [ ] **Text**
      - [ ] **Button** (1 links)
      - [ ] **Icon List** — "What you can do in the portal" (5 items)
- [ ] **Map** — "Where to Find Us" (3 actions)

### Events & Seminars  
`/events`

- [ ] **Hero** (pageHero) — "Medico-Legal Education for Better Practice" — centred, subtitle, breadcrumb
- [ ] **Slide Carousel** — "Four ways VERIFY brings medico-legal learning to life" (4 slides, eyebrow *Programs & partnerships*)
- [ ] **Events Explorer** — "Explore VERIFY & AAMLE Events" (all, with search, **card presentation**)
  - [ ] Upcoming section — "Latest Medico-Legal Education Events" + intro + *View more upcoming events*
  - [ ] **Band behind the Past section** — pale blue, full width, running flush into the footer with no white strip beneath it (Separating Upcoming from Past → Band behind the Past group)
  - [ ] Past section — "Recent VERIFY & AAMLE Programs" + intro + *View more past events*
  - [ ] Cards show the event image, or its **date** when no image is uploaded

### Past Events  
`/events/past-events`

- [ ] **Hero** (pageHero) — "Explore Past Medico-Legal Education Events" — breadcrumb
- [ ] **Events Explorer** (past-only)

### Upcoming Events  
`/events/upcoming-events`

- [ ] **Hero** (pageHero) — "Explore Upcoming Medico-Legal Education Events" — breadcrumb
- [ ] **Events Explorer** (upcoming-only)

### In the Loop  
`/in-the-loop`

All eight sections below are set to **hide themselves when they have nothing to list**, and the
Section Nav drops the matching tab with them. With today's content only `#qa-insights` has articles,
so the nav shows **one** tab and the seven others render nothing — that is correct, not a fault. To
review a hidden section's wording, untick "Hide this section when it has nothing to show" on it.

- [ ] **Hero** (pageHero) — "Your Source for Medico-Legal Intelligence" — subtitle, breadcrumb, image panel
- [ ] **Section Nav** (8 items configured; **1 rendered today**)
- [ ] **Featured Articles** — "Featured" (auto, #featured) — *hidden: no featured articles*
- [ ] **Archive** (#news) — *hidden: no News & Updates articles*
- [ ] **Archive** (#events) — *hidden: lists upcoming events, and all 13 events are past*
- [ ] **Archive** (#insights) — *hidden: no Industry Insights articles*
- [ ] **Archive** (#spotlights) — *hidden: no Specialist Spotlights articles*
- [ ] **Resources Grid** — "Guides, Checklists & Templates" (auto, ni-resource, #resources) — *hidden: no resources*
- [ ] **Archive** (#qa-insights) — the one section with content (4 articles)
- [ ] **Archive** (#staff-narratives) — *hidden: no Staff Narratives articles*
- [ ] **Newsletter** — "Be the First to Know About VERIFY & AAMLE Updates"

### Information Centre  
`/information-centre`

- [ ] **Hero** (pageHero) — "Information Centre" — subtitle, shield, breadcrumb
- [ ] **Gateway Cards** — "Who Are You?" (2 cards)
- [ ] **CTA Band** — "Not Sure Where to Start?" (2 links)

### For Claimants  
`/information-centre/for-claimants`

- [ ] **Hero** (pageHero) — "Information for Claimants" — subtitle, breadcrumb
- [ ] **Process Steps** — "Your Examination Step by Step" (5 steps, claimant, #process-overview)
  - [ ] Left-column photo fills its frame with no band of background showing
  - [ ] With no photo: the pale blue placeholder shows its caption and glyph, not an empty box
- [ ] **Section** (#appointment-guide)
  - [ ] **Text**
  - [ ] **Heading** — "What to Expect — Every Step of the Process"
  - [ ] **Text**
- [ ] **Appointment Guide** (2 types)
- [ ] **Video** — "Watch Our Preparation Guide" (video set, #video-guide)
- [ ] **Section** (#claimant-faqs)
  - [ ] **FAQ** — "Frequently Asked Questions" (16 items)
- [ ] **Section** (#location)
  - [ ] **Map** — "Where to Find Us" (3 actions)

### For Clients  
`/information-centre/for-clients`

- [ ] **Hero** (pageHero) — "Information for Clients" — subtitle, breadcrumb
- [ ] **Section** (#support)
  - [ ] **Split Feature** (1 rows)
  - [ ] **Feature Grid** (3 items)
- [ ] **Section** (#services)
  - [ ] **Services Grid** — "Comprehensive Medico-Legal Services" (manual, grid)
- [ ] **Section** (#process)
  - [ ] **Process Steps** — "Our Process" (6 steps, two-row)
  - [ ] **Callout** (1 links)
- [ ] **Cost Grid** — "Minimising Your Client's Report Costs" (3 cards, #costs)
- [ ] **Section** (#faqs)
  - [ ] **FAQ** — "Client FAQs" (16 items)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Make a Booking  
`/make-a-booking`

- [ ] **Hero** (pageHero) — "Make a Booking" — subtitle, breadcrumb
- [ ] **Booking Chooser** (2 halves)
- [ ] **Availability**
- [ ] **CTA Band** — "Ready to Book Your Next Appointment with VERIFY?" (2 links)

### Privacy Policy  
`/privacy-policy`

- [ ] **Hero** (pageHero) — "Privacy Policy" — eyebrow "Legal", subtitle, breadcrumb
- [ ] **Section**
  - [ ] **Row**
    - [ ] **Rich Content**

### Services  
`/services`

- [ ] **Hero** (pageHero) — "Medico-Legal Services Built on Precision & Trust" — subtitle, breadcrumb
- [ ] **Split Feature** (2 rows)
- [ ] **Services Grid** — "Medico-Legal Reports & Opinions" (manual, grid)
- [ ] **Services Grid** — "Coordinated Support for Every Matter" (manual, grid)
- [ ] **AAMLE Education** — "Educational Services" (4 items)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Educational Services  
`/services/educational-services`

- [ ] **Hero** (pageHero) — "Educational Services" — eyebrow "Services", subtitle, shield, breadcrumb
- [ ] **AAMLE Education** — "Educational Services" (4 items)
- [ ] **CTA Band** — "Upcoming Webinars & Training Events" (2 links)

### Medico-Legal Services  
`/services/medico-legal`

- [ ] **Hero** (pageHero) — "Medico-Legal Services" — eyebrow "Services", subtitle, shield, breadcrumb
- [ ] **Split Feature** (1 rows)
- [ ] **Feature Grid** — "Our Medico-Legal Service Lines" (4 items)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Administrative Services  
`/services/medico-legal/admin-services`

- [ ] **Hero** (pageHero) — "Administrative & Support Services" — breadcrumb
- [ ] **Split Feature** (1 rows)
- [ ] **Services Grid** — "Four Services. One Less Thing to Manage." (manual, accordion, #as-services-section)
- [ ] **Process Steps** — "Simple to Request, Seamless to Deliver" (4 steps, cards)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Independent Medical Examination (IME)  
`/services/medico-legal/ime`

- [ ] **Hero** (pageHero) — "Independent Medical Examination (IME)" — breadcrumb
- [ ] **Split Feature** (1 rows)
- [ ] **Feature Grid** (3 items)
- [ ] **FAQ** — "IMEs Across All Major Claim Types" (9 items, #claim-types)
- [ ] **Feature Grid** — "Four Ways to Attend Your IME" (4 items)
- [ ] **Audience Pathways** — "Whether You're a Client or a Claimant" (2 pathways)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Joint Medical Examination (JME)  
`/services/medico-legal/jme`

- [ ] **Hero** (pageHero) — "Joint Medical Examination (JME)" — breadcrumb
- [ ] **Split Feature** (1 rows)
- [ ] **Feature Grid** (3 items)
- [ ] **Feature Grid** — "The Benefits of a Joint Approach" (6 items)
- [ ] **People Grid** — "Specialists Who Conduct JME Assessments" (specialists, carousel)
- [ ] **Process Steps** — "The JME Process, Step by Step" (5 steps, cards)
- [ ] **FAQ** — "Common Questions About JMEs" (5 items)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Other Reporting Services  
`/services/medico-legal/reporting-services`

- [ ] **Hero** (pageHero) — "Specialist Reporting Beyond the Examination" — breadcrumb
- [ ] **Split Feature** — "Four Ways to Get the Specialist Opinion You Need" (4 rows — Medical Negligence removed 2026-08-18)
- [ ] **CTA Band** — "Ready to Refer Your Next Matter to VERIFY?" (2 links)

### Specialists  
`/specialists`

- [ ] **Hero** (pageHero) — "Our Panel of Medical Specialists" — subtitle, shield, breadcrumb
- [ ] **Specialist Directory** — "Search the directory"
- [ ] **Portal CTA** — "Online Booking Portal" (3 tiles, 2 links)

### Join Expert Panel  
`/specialists/join-expert-panel`

- [ ] **Hero** (pageHero) — "Join Our Expert Panel" — subtitle, shield, breadcrumb
- [ ] **Split Feature** (1 rows)
- [ ] **Section** (#panel-benefits)
  - [ ] **Feature Grid** — "What We Offer Our Panel Specialists" (6 items)
- [ ] **Section** (#join-form)
  - [ ] **Row**
    - [ ] Column 1 of 2
      - [ ] **Icon List** — "Express Your Interest" (2 items)
      - [ ] **Callout**
    - [ ] Column 2 of 2
      - [ ] **Form**

### Specialist Availability  
`/specialists/specialist-availability`

- [ ] **Hero** (pageHero) — "Specialist Availability" — eyebrow "Specialists", subtitle, breadcrumb
- [ ] **Availability**

### Specialist Panel  
`/specialists/specialist-panel`

- [ ] **Hero** (pageHero) — "Our Panel of Medical Specialists" — subtitle, shield, breadcrumb
- [ ] **Specialist Directory** — "Search the directory"
- [ ] **Portal CTA** — "Online Booking Portal" (3 tiles, 2 links)

### Specialty List  
`/specialists/specialty-list`

- [ ] **Hero** (pageHero) — "Our Specialty List" — subtitle, shield, breadcrumb
- [ ] **Specialty Directory**
- [ ] **Section**
  - [ ] **Callout** (1 links)
- [ ] **Portal CTA** — "Online Booking Portal" (3 tiles, 2 links)

### Terms & Conditions  
`/terms-conditions`

- [ ] **Hero** (pageHero) — "Standard Terms & Conditions" — eyebrow "Legal", subtitle, breadcrumb
- [ ] **Section**
  - [ ] **Row**
    - [ ] **Rich Content**

---

## Templated detail pages

These render from one template each, so reviewing every document is wasted effort — check two or
three per collection, picking ones that differ (long vs short, with image vs without).

**Posts — 4 documents** (2026-08-20; was 24 before the content cull), at
`/in-the-loop/<stream>/<slug>`. All four are in the **QA Insights** stream; the other six streams
exist and are empty.

There is also a **stream index** at `/in-the-loop/<stream>` — one page per stream, listing that
stream's articles. Check the populated one and an empty one; they are the same template and only the
empty case can render as a page with nothing on it.

- [ ] `/in-the-loop/qa-insights` — lists the four articles, header reads as the stream
- [ ] An empty stream — reads as empty on purpose, not as a broken page

- [ ] Article header — title, stream badge, byline, hero image
- [ ] Body rich text — headings, lists, emphasis, links
- [ ] Contents / heading anchors — click one, then paste the `#fragment` URL into a fresh tab
- [ ] Related / next article
- [ ] A post in a stream you have not opened yet

**Specialists — 26 documents**, at `/specialists/profiles/<slug>`.

- [ ] Photo, or the initials fallback when empty
- [ ] Specialties, claim types, assessment types, areas of expertise
- [ ] Accreditations and locations
- [ ] Booking / availability CTA
- [ ] One specialist with sparse data, to see the empty states

**Team — 19 documents**, at `/about/team/<slug>`.

- [ ] Photo or initials fallback, role, bio
- [ ] **No ROLE pin under the photo** — the role appears once, under the name in the hero
- [ ] A member with a **Profile photo** set shows it here and their **Team photo** on Meet the Team
- [ ] A member with **Show no photo on the profile page** ticked has no photo and a full-width bio
- [ ] Back-link to Meet the Team

**Events — 13 documents** (2026-08-20; all past-dated), at `/events/event/<slug>`. Rebuilt past the reference (approved) —
see `verify-website-design-diff.md` Comparison 25 and `src/Styles/HOOKS.md` for what an editor can
put on one.

- [ ] Date, time, location, presenter
- [ ] Status badge and CTA — an **upcoming** event and a **past** one behave differently, and
      deliberately disagree: an event can be finished and still taking expressions of interest
- [ ] Action row at the foot — *Contact Us / Register* · *View this event on AAMLE* (only on events
      with a Host event page URL) · *Back to all events*
- [ ] Registration CTA wording on each

Empty by design until someone writes them — check the surface, not the absence:

- [ ] **Recap** on a past event: heading anchors, an "In this recap" list once it has two headings
- [ ] **Photo gallery** and **Downloads**
- [ ] **Image** on an event → full-bleed photo hero; no image → the plain hero

---

## Blocks this checklist cannot reach

**Stats Band, Spacer, Divider, Icon and Image are on no page.** They were only ever displayed on
`/style-guide`, which was removed on 2026-08-20 — correctly, since it was a developer page a visitor
could reach. Nothing here reviews them, and nothing on the live site would show a regression in them.
Recorded in `OUTSTANDING.md`; they are not broken, they are simply unobserved. Do not add them to a
page to make this list tidy — that is a content change, and it puts a demo on a real page.

## Notes

Log anything you find here, then we work through it. If a whole page is fine, tick its blocks and
move on — the value is in the ones that are not.
