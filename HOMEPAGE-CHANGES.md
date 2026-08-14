# Homepage redesign — what changed

Every homepage section audited against `.design-reference/index.html` and its gaps closed, on
2026-08-13, from `6bacabf`.

Each row says what the reference asks for, what the build was doing, what changed, and **how to
check it yourself** without reading code. Outcomes are `Fixed`, `Deliberate` (left different, with
the reason) or `Deferred` (logged in `OUTSTANDING.md` with its cost).

Read the three lists after the table too: **new/removed admin controls**, **database changes that
will not travel with a git push**, and **what was left undone**.

> **Five further passes followed**, each with its own section at the end of this file. Where the
> first pass's text below has been overtaken, it is marked rather than rewritten, so the record
> stays a history and not just a snapshot.
>
> 1. [Second pass — the deferred items, closed](#second-pass--the-deferred-items-closed). Three
>    deferred items, including one that turned out to be a live site-wide bug rather than a homepage
>    issue.
> 2. [Third pass — every image uploadable from the admin](#third-pass--every-image-uploadable-from-the-admin).
>    Closes B14, and fixes a shield that followed Site Settings on the homepage and nowhere else.
> 3. [Fourth pass — centred section titles were wrapping at 720px](#fourth-pass--centred-section-titles-were-wrapping-at-720px).
>    One un-ported `max-width` was breaking 10 headings across 8 pages.
> 4. [Fifth pass — testimonial cards lifted on hover and got clipped](#fifth-pass--testimonial-cards-lifted-on-hover-and-got-clipped).
>    A field default nobody chose, moving cards inside a viewport with no room for it.
> 5. [Sixth pass — the link audit](#sixth-pass--the-link-audit). Every link on all 114 pages
>    measured against the reference, four reported faults fixed, and a guard so it is never asserted
>    again.
>
> A pattern worth naming across passes 3–5: each began as "this one thing on the homepage looks
> wrong" and each turned out to be a global — a hardcoded asset, an un-ported width cap, a field
> default — reaching well beyond the page it was noticed on.

---

## The four you reported

| Ref | Reference asks for | Was doing | Changed | Files | How to check | Outcome |
|---|---|---|---|---|---|---|
| **A1a** | Service cards centred, icon over title, equal 172px height (`styles.css:882-896`) | Left-aligned. Deliberate at the time: `.service-card` is shared with Feature Grid and Resources Grid, which render a description that centring would misalign | New **Card alignment** control on the Services Grid block (Left / Centred). Centred adds the flex-column centring, the 172px minimum and the reference's 54px icon tile — scoped to that grid only, so no other block moves | `blocks/ServicesGrid/config.ts`, `Component.tsx`, `globals.css` | Homepage → "What We Do" → the 8 cards are centred and equal height. Admin → Home → Services Grid → **Card alignment** | Fixed |
| **A1b** | 8 specific Phosphor icons (`index.html:180-228`) | 6 of 8 wrong — IME was a clipboard, Expert Evidence a headset, Teleconference a video camera | The six values corrected on the Service documents. No new icons needed; all eight already existed | `seed/data/services.ts`, `seedServices.ts`, `seedHomepage.ts`, + the live database | Homepage → the 8 card icons are a first-aid kit, three people, a clipboard, a file+, a phone, a gavel, a user-check, a document | Fixed |
| **A2** | A 20×20 stroked arrow in brand blue, vertically centred in a 20px column (`styles.css:1610-1635`) | A bare `→` character with **no styling rule at all**, sitting top-aligned in a 54px column — the column was still sized for a numbered variant that had been removed | Arrow is now the reference SVG; `.claim-arrow` rule added; row grid corrected to `20px 1fr`; the dead `.claim-num` rule deleted | `blocks/SpecialtyGrid/Component.tsx`, `globals.css` | Homepage → "Claims We Support" → all 9 arrows are blue, aligned with their label, tight to the text | Fixed |
| **A3** | Card is stars → quote mark → italic quote → divider → position → organisation & location. No portrait, no personal name (`index.html:468-476`) | Position and organisation sat **side by side** on one row; the grid version also drew a 👤 emoji placeholder portrait and ignored the organisation entirely | Attribution rebuilt as the reference column, pinned to the card's bottom edge by a divider; portrait and personal name removed from both renderers and from the collection | `blocks/TestimonialsGrid/Component.tsx`, `TestimonialsClient.tsx`, `collections/Testimonials.ts`, `globals.css` | Homepage → Testimonials → each card ends with a rule, then the role, then "… — Brisbane, QLD". No avatars anywhere | Fixed |
| **A4a** | Full-width uppercase button on a blue gradient with a resting glow (`styles.css:2001-2019`) | Only the glow was ported — no gradient, no uppercase, no letter-spacing | The missing declarations added. The reference's own padding/radius deliberately **not** copied: its `!important` block overrides them back to the shared values, which is what it actually renders | `globals.css` | Homepage → Make an Enquiry → the button reads **SEND ENQUIRY**, full width, on a gradient | Fixed |
| **A4b** | — | The slide-out enquiry drawer had a *second*, different submit button with its own hardcoded hover colour, outside the shared button system | Drawer button now uses the same `btn btn-primary form-submit` classes as the in-page form; its private rule deleted | `components/EnquiryDrawer/index.tsx`, `globals.css` | Click "Make an Enquiry" in the header → the drawer's button matches the one on the homepage form | Fixed |

---

## The rest of the homepage

| Ref | Section | Reference asks for | Was doing | Changed | How to check | Outcome |
|---|---|---|---|---|---|---|
| **B1** | Hero | Two lines: "Ensuring Accuracy," dark, then "Empowering Justice" blue (`index.html:31-32`) | One line, **both** phrases blue | Heading fields accept a line break (press Enter); heading text corrected | Homepage → the H1 is two lines, only the second is blue | Fixed |
| **B2** | Who We Are | Two paragraphs, 18px apart (`styles.css:788`) | Ran together as one block with **zero** gap, at the wrong size | Paragraph rhythm restored | Homepage → "VERIFY Medico-Legal Solutions" → visible gap between the two paragraphs | Fixed |
| **B3** | Audience cards | Quick-link arrows in a muted blue-grey (`styles.css:13`) | **Near-invisible** — a faithful port of `var(--secondary)`, but that token had been repurposed to a pale blue, giving roughly 1.2:1 on white | New **Muted blue-grey** brand colour, and the arrows point at it | Homepage → the three cards' "→" links are clearly visible | Fixed |
| **B4** | Featured Specialists | No arrow controls; loop takes 60s (`styles.css:1667`) | Two arrow buttons the reference doesn't have, running at double speed | Arrows off, speed 60 — both were already editable fields | Homepage → the specialist marquee has no side buttons and drifts slowly | Fixed |
| **B5** | Contact details | Small italic grey aside under a value (`styles.css:1951`) | Never ported; an inline style rendered the office-hours note as ordinary body copy | Rule ported; the inline style removed | Homepage → Make an Enquiry → the "7:45am appointments" note is small, grey and italic | Fixed |
| **B6** | Featured Specialists | Names/roles truncate with an ellipsis (`styles.css:1717-1725`) | Long roles wrapped to 2-3 lines, so card heights went ragged | Truncation restored; card padding corrected to 16px | Homepage → specialist cards are all the same height | Fixed |
| **B7a** | AAMLE panel | Panel 3 is two paragraphs | Collapsed into one wall of text | Step descriptions now render a blank line as a paragraph break | Homepage → What We Do → Educational Services → panel 03 has two paragraphs | Fixed |
| **B7b** | AAMLE panel | Bold partner name, italic publication title | Plain text | **Not done** — see below | — | Deferred |
| **B8a** | Audience cards | 52px between the heading block and the cards | 16px — 36px of air lost | Restored | Homepage → clear gap under "Medico-Legal Support, Tailored to You" | Fixed |
| **B8b** | What We Do | 28px subtitle→pills, 56px pills→panel | 48px and 32px | Restored; the tab bar's spacing moved out of an inline style so a preset can override it | Homepage → spacing around the two tab pills | Fixed |
| **B9** | Enquiry band | Flat `#e6f4ff` (`styles.css:1910-1913`) | A three-stop gradient | New **Band · Flat light blue** preset, applied to that section | Homepage → the enquiry band is one even colour | Fixed |
| **B10** | Buttons | Every button family normalised to the shared 8px radius / 13×28 padding / 48px min-height (`styles.css:116-139`) | Gateway CTAs 12px-round, hero CTAs 6px and 2px taller | The two divergent families corrected. The reference's `!important` block itself was **not** copied — it would have made every button rule unoverridable | Homepage → the three card CTAs match other buttons | Fixed |
| **B11** | Hero | Definition panel offset 48px down; 24px internal gap (`index.html:48`, `styles.css:520-528`) | No offset; 16px gap plus a −6px pull | Restored | Homepage → the definition panel sits lower than the heading, with more room inside | Fixed |
| **B12** | AAMLE panel | Panel 2's pill is brighter (`styles.css:1334`) | The brighter style existed but nothing could apply it | New **Badge emphasis** control (Plain / Highlight) on each step | Educational Services → "CPD Eligible" stands out. Admin → Process Steps → a step → **Badge emphasis** | Fixed |
| **B13** | Featured Specialists | `#f0f2f4` (`styles.css:1647`) | `#f5f6f8` — and this can't be fixed by retuning the shared token, because the reference genuinely uses the lighter grey for the cards band above | New **Band · Deeper grey** preset, applied to that section | Homepage → the specialists band is a touch deeper than the cards band | Fixed |
| **B14** | Who We Are | Plain sentence-case placeholder label, no icon, plus a vignette | An icon above an uppercase label | Deferred at the time; **done in the third pass** — icon dropped, 0.85rem sentence-case label, radial vignette, shared with `.who-image-main` | Homepage → Who We Are, and every Split Feature row awaiting a photo | Fixed |
| **B15** | AAMLE sponsor | 36×40 padding, icon top-aligned, no hover | 30×36, icon centred, and it inherited a blue bar that wiped across on hover — on a panel that isn't a link | Corrected; hover artefact removed | Educational Services → the sponsorship callout doesn't animate on hover | Fixed |

### Deliberate — left different from the reference, on purpose

These already carried a written reason in the code and were **not** changed:

- **Hero definition panel** uses the "glow" style, not the reference's grey "frame". The reference's
  own greys measure **4.44:1 — below the AA contrast minimum**. Both styles are selectable in the
  admin, so switching is one click if you want the reference look.
- **Audience card secondary text** is 0.82 alpha rather than 0.75, same contrast reason.
- **Expert cards** stay simple (photo, name, role) — no specialty badge, no qualification pills.
- **Section padding** is 88px site-wide where the reference mixes 80 and 88. That 88 is the Design
  System's own spacing scale and is editable per section; matching the reference exactly would mean
  overriding the site's rhythm in one place.

---

## Admin controls added

| Control | Where | What it does | Default |
|---|---|---|---|
| **Card alignment** | any Services Grid block | Left, or Centred (icon over title, equal card height) | Left — so no other page changed |
| **Badge emphasis** | each Process Steps step, when the step has a badge | Plain, or Highlight | Plain |
| **Muted blue-grey** | Site Settings → Brand colours | The card link-arrow colour | `#93abbf` |
| **Band · Flat light blue** | Custom Styles preset | Solid pale-blue section band | — |
| **Band · Deeper grey** | Custom Styles preset | Slightly deeper grey band | — |
| Line breaks in headings | every heading field, and the hero heading | Press Enter for a line break; `[[brackets]]` still colour a phrase | — |

**Also fixed:** the "Custom CSS class(es)" picker now offers the eight layout classes the homepage
depends on (`vf-home-claims`, `vf-home-enquiry-row`, …). Before, they were stored but never offered
— so removing one was a **one-way door**: delete `vf-home-claims` and the Claims band collapsed to
one column with no way to put it back. A new guard test fails if that list ever advertises a class
no rule defines.

## Admin controls removed

| Control | Why |
|---|---|
| Testimonial → **Author name** | The card design has no personal name. Leaving the field would have been a control that renders nothing |
| Testimonial → **Avatar** | Same — the card has no portrait |

Neither had a value on any of the six testimonials, so no content was lost locally. **Check the box
before migrating** — see `OUTSTANDING.md` §5, which now expects **five** `DROP COLUMN`s, not three.

Testimonial → **Organisation** is now labelled **Organisation and location**, because that is what
it holds ("Personal Injury Law Firm — Brisbane, QLD") and what line 2 of the card renders.

---

## Database changes — these do NOT travel with a git push

Code changes deploy; content does not. These were applied to the local database and written into
the seed fixtures, so a **fresh** box picks them up when the seed runs. An **existing** box needs
them applied by hand in the admin.

| What | Where in the admin |
|---|---|
| 6 service icons (IME, JME, File Review, Supplementary Report, Teleconference, Expert Evidence, Brief Reduction) | Services → each document → Icon |
| Services Grid → Card alignment = **Centred** | Home → What We Do → Medico-Legal Services tab |
| Hero heading → `Ensuring Accuracy,` ⏎ `[[Empowering Justice]]` | Home → Hero |
| Specialists carousel → arrows **off**, speed **60** | Home → Featured Specialists |
| AAMLE heading line break; panel 3 split into two paragraphs; panel 2 badge = **Highlight** | Home → What We Do → Educational Services |
| `band-flat-blue` on the enquiry section, `band-grey-deep` on the specialists section | those blocks → Custom CSS class(es) |
| Two new Custom Styles presets | Globals → Custom Styles |

---

## Housekeeping in the same pass

- **A design hazard removed.** `globals.css` defined the AAMLE panel family **twice**, ~2,900 lines
  apart, with different values — a different background, a decorative circle, different type sizes.
  The page looked right only because the later copy happened to come last in the file. Any
  reordering would have silently changed the design. The 25 conflicting rules were removed from the
  earlier copy; the 46 rules unique to it were kept, because they style the AAMLE page.
- **40 dead rules deleted** — including three contradictory definitions of the hero, specialists and
  enquiry band colours that no element uses and that disagree with both the reference and each other.
  Reading them mid-audit produced a confident wrong answer. Every deletion was verified by searching
  the code **and** querying the database for stored class names, not by the dead-CSS script (whose
  own header warns it produces candidates, not verdicts). One class the audit called dead —
  `.who-image-main` — turned out to be in live use by the "Why VERIFY" block and was kept.
- Net: `globals.css` is **216 lines shorter**.

---

## What was left undone

| # | Item | Why | Logged | Status |
|---|---|---|---|---|
| 1 | **Bold/italic inside a process-step description** — the AAMLE panel loses two emphasised phrases | Needs the field to become rich text: a `varchar → jsonb` column change affecting **26 descriptions across 6 blocks in 4 files**, and this repo has already had a destructive schema change hang the local server. Two emphasised phrases on one panel did not justify that risk in the same pass as the visual work | ~~`OUTSTANDING.md` §7~~ | **Done in the second pass** |
| 2 | **Split-feature image placeholder** typography | **16 rows** across the site use it, and every one is scaffolding awaiting a real photograph — the moment an image is uploaded, none of it renders. Restyling temporary content in 16 places is churn | ~~`OUTSTANDING.md` §6 (renumbered)~~ | **Done in the third pass** |
| 3 | Two hardcoded colours in the enquiry drawer (`#155a8f` is gone, but `#2e9e5a` on the confirmation message remains) | Out of scope for a homepage styling pass; changing it shifts a visible green | mentioned here | **Done in the second pass** |

### One thing found that is bigger than the homepage

While verifying the new Custom Styles presets, the site kept serving the **old** stylesheet even
though the admin had saved and the revalidation hook had run without error. Only deleting
`.next/cache` cleared it.

If that also happens in production, an editor who changes a brand colour, a design token or a style
preset would see the save succeed and **the site keep the old value** — the exact class of silent
failure this codebase's rules exist to prevent. It was only observed in dev, and dev and production
handle that cache differently, so it is **not** established that production is affected.

> **Overtaken by the second pass.** It *is* established: reproduced under `next start`, root-caused
> and fixed. It was also not quite what the paragraph above guesses — see
> [the second pass](#1-every-cache-purge-was-soft-not-a-purge). The caution in the last sentence
> was right, though: the fix was made only after reproducing the failure.

---

## Verification — actually run, with results

| Check | Result |
|---|---|
| `pnpm lint` | Clean — no errors, no warnings, no suppressions added |
| `pnpm exec tsc --noEmit` | Clean |
| `pnpm test:int` | **109/109** (one new guard) |
| `zsh tests/int/prove-guards.sh` | **6/6** — every guard, including the new one, proven to go RED on a deliberate break |
| `pnpm build` | Passes, sitemap generated |
| `pnpm test:e2e` | **6/6** |
| Computed-style diff vs a baseline captured before any change | 592 nodes changed. **Every change classified and matched to an intended edit** — see below |
| Rendered HTML, scoped per section | 8 centred cards with 8 distinct icons · 9 SVG arrows, no `.claim-num` · no avatar or personal name in testimonials · both submit buttons on the shared classes · no carousel arrows |
| Admin | Create New renders a form (the canary for the revalidation crash) · all four new controls appear · removed fields gone · the class registry ships to the browser |

**The visual diff, classified.** Nothing unexplained:

- Every other page shows exactly one changed node — the enquiry drawer's submit button. Intended.
- `/services`, `/information-centre/for-clients`: paragraph size in split-feature bodies. Intended.
- `/make-a-booking`: specialist card padding 20 → 16px. Intended.
- `/style-guide`: hero offset, definition gap, gateway spacing, arrow colour. Intended.
- `/in-the-loop`: one `transform` differing in the third decimal — a scroll-reveal animation frame,
  the known false-positive signature, not a regression.
- Homepage: 12 arrow-colour changes, 9 claim-arrow colour + 9 row-grid changes, 3 button radii,
  2 button backgrounds, 2 band colours. Each maps to a row in the tables above.

---

# Second pass — the deferred items, closed

Same day, immediately after the above. Three of the four deferred items were closed. The order below
is by consequence, not by effort.

---

## 1. Every cache purge was soft, not a purge

**This was the important one, and it was not a homepage problem.** The first pass logged it as
"observed in dev, may not affect production, cause unknown". All three hedges were wrong.

**What was happening.** Every cache purge in the codebase passed the profile name `'max'` to
`revalidateTag`. Traced through the installed Next 16.2.6:

1. the built-in `max` profile is `{ stale: 300, revalidate: 2592000, expire: 31536000 }` — the last
   one is a **year**;
2. given *any* profile, Next sets `stale = now` but `expired = now + expire × 1000`. Given **no**
   profile it sets `expired = now`;
3. the check for "is this tag dead" requires `expired <= now`, which a year in the future never is.

So a "purge" only ever marked the entry **stale**, never expired — stale-while-revalidate. The page
kept serving the old value and refreshed in the background.

**Measured under `next start`, before and after.** A Design System token (`--vf-text-scale`) changed
through the admin, then the served HTML read back:

| | before the fix | after the fix |
|---|---|---|
| Editor's first reload after saving | **the old value** | the new value |
| Same reload 5 seconds later | the new value | the new value |
| Three quick edits in a row | the page ran **two versions behind** | each reload matched the save |

**Why it mattered.** An editor changes a brand colour, a logo, the header nav or a design token;
the admin says saved; they reload and see no change. That is the "appears to work when it doesn't"
failure the project's rules exist to prevent, and it applied to **all ten globals**, all five
sitemap tags, `redirects` and `primary-office`.

**The fix.** `safeRevalidateTag` now always sends `{ expire: 0 }` — an immediate hard expiry — and
its `profile` parameter has been **removed entirely**, so no call site can reintroduce the bug.
27 call sites across 15 files dropped their `, 'max'`.

> **How the call sites were nearly missed.** Searching for `safeRevalidateTag(` returned **zero**
> results, because every file imports it renamed (`import { safeRevalidateTag as revalidateTag }`).
> A guard written the same way would have been incapable of ever failing. The guard that now exists
> resolves each file's local alias first, and its proof script breaks it both ways.

**Something the fix cannot cover, now written down:** a purge only reaches the process that calls
it. A write made from a CLI script cannot purge a separately running server. That is the real
explanation for the first pass's stubborn stylesheet — the write came from a script, so the running
dev server never heard about it.

---

## 2. Rich text in process-step descriptions

The AAMLE panel now carries the reference's emphasis: **Brigham and Associates, Inc.** in bold and
*Guides to the Evaluation of Permanent Impairment* in italic, plus **Australian Academy of
Medico-Legal Education (AAMLE)** in the intro. Three phrases — that is the whole visible payoff, and
it is worth saying plainly next to the work it took.

| | |
|---|---|
| **Field** | `Process Steps → Steps → Description` is now **rich text**, with bold, italic, underline and link. Nothing else — no headings, no lists |
| **New field** | `Intro copy (rich text)`, shown only on the *AAMLE education feature panels* variant. Leave it empty and the plain Subheading is used exactly as before |
| **Schema** | `description` changed `varchar → jsonb` on the live and draft tables (26 and 132 rows), and `intro_rich` was added to both. Applied by hand in one `ALTER COLUMN … USING`, which is what kept Payload's dev-push from stopping on its invisible *"Accept warnings? (y/N)"* prompt |
| **Seed** | All 26 seeded descriptions wrapped in `plainTextToLexical`, which now understands `**bold**` and `*italic*`. Without that parser the whole conversion would have shipped and changed nothing visible |

**It looks identical apart from the emphasis, and that was checked rather than assumed.** Rich text
renders inside a wrapper `<div>`, so every paragraph moved one level deeper. Pairing each of the 14
replaced paragraphs with its replacement, all 14 compute **byte-identically** — same size, colour,
line-height, margins. The two-paragraph AAMLE panel still has exactly 12px between its paragraphs;
that used to come from the flex gap and now comes from a CSS rule written in anticipation of this
change. Three other Process Steps layouts gained the same paragraph spacing, which they had silently
lacked.

---

## 3. The last hardcoded colour in the enquiry drawer

`#2e9e5a` on the "thanks, we'll be in touch" confirmation now reads `var(--callout-success)`, a Site
Settings field. The green shifts very slightly (to `#16a34a`) and becomes editable. It appears on
**14 pages** — every page carrying the enquiry drawer.

---

## Also in this pass

- **The mistakes are now written down.** `CLAUDE.md` → *Verifying a change* gained eight new traps,
  each from a real wrong answer during this work: greps that silently disabled themselves, a
  Playwright probe that never logged in and reported every admin form as broken, a `LIKE` query that
  could never match a `jsonb` column, checking content inside an inactive tab with `curl`, and a
  write script that exited 0 having written nothing. Each entry names the measurement that exposed it.
- **`OUTSTANDING.md` corrected and pruned.** The two fixed entries were deleted rather than annotated
  (that file's own rule). Two things it asserted were wrong and are now fixed: that an add-plus-drop
  "pushes cleanly" (the drop is exactly what hangs), and that production was unaffected by the
  caching bug. Its schema-drift figures did not reconcile with either source and were re-measured
  from scratch: **3207 → 3334 columns**.
- **The deploy migration has a new hazard, documented.** A generated `ALTER COLUMN … TYPE jsonb`
  without a `USING` clause fails on the first row, because the existing values are prose. The exact
  statement to paste is checked in at `src/migrations/REFERENCE-processSteps-richtext.sql`.

---

## Verification — second pass

| Check | Result |
|---|---|
| `pnpm lint` | Clean |
| `pnpm exec tsc --noEmit` | Clean |
| `pnpm test:int` | **110/110** (one new guard) |
| `zsh tests/int/prove-guards.sh` | **8/8** proven to go RED, including both new break cases |
| `pnpm build` · `pnpm test:e2e` | Passes · **6/6** |
| Computed-style diff vs a baseline captured before any change | **61 nodes changed, all 61 classified, none unexplained** |
| The caching fix, end to end under `next start` | Editor's first reload now shows the saved value (before: the previous one) |
| Rendered AAMLE panel | `<strong>` and `<em>` present in both the intro and panel 3; two paragraphs, 12px apart |
| Admin | Pages and Posts **Create New** both render full forms (23 and 14 inputs, no console errors) — the canary for the revalidation crash |
| **Fresh reseed from an empty database** | 303 tables pushed, seed succeeded, and the rendered panel is **identical** to the converted one — so the box's from-scratch path produces the same result |

**The 61 changed nodes, classified.** Nothing unexplained:

| Count | What | Where |
|---|---|---|
| 28 | New nodes — the rich-text wrapper `<div>` and its `<p>` | the three pages with a visible Process Steps block |
| 14 | The bare `<p>` each wrapper replaced | same three pages |
| 14 | Enquiry confirmation green → `var(--callout-success)` | all 14 pages with the drawer |
| 5 | Scroll-reveal animation frames (opacity/transform only) | `/`, `/in-the-loop`, `/style-guide` — the known false-positive signature |

The homepage's own AAMLE panel is **not** in that diff, because it lives inside an inactive tab that
is not server-rendered — which is itself one of the new traps. It was checked in a browser instead.

---

# Third pass — every image uploadable from the admin

The site ships before its photography exists, so the question was not "are the placeholders pretty"
but "can the person taking this over add all 20 photographs from `/admin`, with no developer".

**The capability was already there, with one exception.** All four blocks that draw a placeholder
(`SplitFeature`, `AamleEducation`, `LeadershipSpotlight`, `WhyVerify`) have a Media upload field, and
in every one an uploaded image *wins* over the placeholder. The bundled logo and footer logo are
fallbacks behind Site Settings, not hardcoding.

## 1. The brand shield followed Site Settings on the homepage and nowhere else

Not in the register — found while auditing. The shield read from **Site Settings → Shield** on the
home hero, but was a hardcoded CSS background on `.page-hero-shield` (behind **every** interior page
hero) and on the Contact page's portal cards. Uploading a new shield changed the homepage and left
the rest of the site on the old one.

Fixed by emitting a `--vf-shield-url` token from the same field, so all three surfaces follow it.
Because editor-supplied values land inside a `<style>` tag *and* inside `url("…")`, the new
`safeUrlToken()` in `src/utilities/cssTokens.ts` rejects any URL containing `'`, `"`, `(`, `)` or a
backslash rather than trusting Payload's filename normalisation.

**Proven in a browser, not in the database:** uploaded a distinct image, watched all three surfaces
change, cleared it, watched all three revert.

## 2. The split-feature placeholder, finished (B14 / register §2)

Brought to the reference's `.who-image-main` treatment: no icon, 0.85rem sentence-case label at
weight 600, radial vignette, 135° gradient. Written once and shared by both selectors.

**One correction to the register's framing.** It said the 145° gradient was wrong. It is not: the
reference uses 135° for the photo box but **145° for specialist avatars**, and
`--vf-grad-image-tint` has nine consumers, all avatar-type tints. Retuning it would have pushed
eight surfaces *away* from the reference. The placeholder takes an explicit 135° gradient instead,
still built from Site Settings brand colours.

## 3. Two guards so it stays true

The build now fails if a brand asset is referenced straight from a CSS rule instead of through a
Site Settings token (this is what would have caught the shield), or if a block draws an image
placeholder without offering an upload to replace it.

---

# Fourth pass — centred section titles were wrapping at 720px

Reported: **"Comprehensive Medico-Legal Services"** and **"Medico-Legal Support, Tailored to You"**
render on two lines here and one line in the design reference.

## The cause

One declaration, with no counterpart in the reference. Everything else in that heading stack was
ported faithfully — `.section-title` is byte-identical to `styles.css:56-64`, and `.container`
matches at 1180px/24px. But `SectionHeader` wraps centred headers in a div the reference does not
have:

```css
.vf-section-header--centered { max-width: var(--vf-measure, 720px); }
```

The reference puts the same headings in `.what-header` / `.audience-gateway-intro`, neither of which
sets a width, so the `<h2>` gets the container's full **1132px**. Only the *subtitle* is narrowed
there (600px / 640px) — and both of those rules **were** ported. The 720px came from the component's
old inline styles.

Measured at 1440px: the two headings need **808px** and **798px**, and were given 720px. Below a
~1130px viewport the `3vw` clamp shrinks the type enough that they fit anyway, which is why this
only showed on desktop.

| | Before | After |
|---|---|---|
| Centred section headers site-wide | 37 | 37 |
| Wrapping at 1440px | 13 | **3** |
| Wrapping at 768px | 0 | 0 |

The three that still wrap are limited by their own column, not by the cap: the enquiry panel's
heading (445px), the JME FAQ's (380px), and `/services` "Coordinated Support for Every Matter",
whose header is a `.svc-admin-split` grid giving the title a 620px track.

## What changed

- `max-width` removed from `.vf-section-header--centered`, with a comment at the rule recording why
  it must not come back.
- `--vf-measure: 720px` deleted — that rule was its only consumer repo-wide. `--vf-measure-narrow`
  stays; `ContactDetails` reads it.
- **No `text-wrap: balance`.** The reference sets it only on `.hero-heading`.

## New guard

`tests/e2e/frontend.e2e.spec.ts` — *"centred section headers do not narrow themselves into a wrap"*,
over `/`, `/about`, `/services` and `/services/medico-legal/admin-services`.

It states the fault as a causal claim rather than a width comparison: neutralise the header's own
`max-width`, and if a two-line title collapses to one, the header did that to itself. That framing
is what exempts the legitimate cases without an allowlist — and the first version, which compared
natural width against the nearest `.container`, got it wrong and reported `/services` as broken.

## Verification — fourth pass

| Check | Result |
|---|---|
| `pnpm lint` · `pnpm exec tsc --noEmit` | Clean · Clean |
| `pnpm test:int` | **114/114** |
| `pnpm build` | Passes |
| `pnpm test:e2e` | **12/12** (was 8; the new guard adds 4) |
| New guard proven RED | 2 violations on `/`, 1 on `/about`, 2 on admin-services — and `/services` correctly stays green |
| Page sweep, 29 pages × 4 viewports | 13 wraps → 3 at 1440/1280/1024; 0 → 0 at 768. **No title anywhere gained a line**, and **no subtitle changed width** |
| Computed-style diff vs a baseline captured before the change | **72 nodes changed, all 72 classified**, node count identical (6454 → 6454) |
| CSS actually reached the browser | `getComputedStyle` reports `max-width: none` and a 1132px header, with `nav.site-nav → position: sticky` as a positive control |

**The 72 changed nodes, classified:**

| Count | What |
|---|---|
| 45 | Header and auto-width children, `720px → 1132px` |
| 6 | Same, in a narrower band: `720px → 772px` |
| 23 | `−50px` height — one 50px line removed from an unwrapped heading, and its ancestors |
| 3 | `−100px` height — `/`'s body, main and article, which each contain two unwrapped headings |
| 3 | Scroll-reveal animation frames (sub-pixel `matrix()`, opacity 0.998 → 1) — the known signature |

## Also found while verifying

The computed-style harness had **two dead routes**: `/about-verify` and `/legal/privacy-policy` both
404, and since `capture` never checked status it banked the not-found page as a baseline twice
(178 nodes each — identical counts, which is how it was spotted) while `/about` and
`/privacy-policy` went unmeasured. Corrected, and `capture` now refuses any non-200. Coverage went
6454 → 6675 nodes.

`README.md` also warned that the harness does **not** measure `width`, `height`,
`grid-template-columns` or `transform`. All four had been added; the warning argued against trusting
the one gate that catches exactly this class of bug. Corrected.

---

# Fifth pass — testimonial cards lifted on hover and got clipped

Reported: the testimonials section moves up when highlighted, the top gets cut off, and it should
just highlight.

## The cause

Not the card's CSS. `.testimonial-card:hover` (globals.css:3009) is a faithful port of
`styles.css:1856` and is **colour only**:

```css
.testimonial-card:hover { border-color: var(--primary); box-shadow: var(--shadow); }
```

Nothing in the reference's testimonials translates or scales a card — the only transforms there are
the track's `translateX` and `scale(1.08)` on the nav arrows.

The movement came from a CMS-only global. `TestimonialsGrid` spreads `gridDisplayFields`, whose
`hoverEffectField` has **`defaultValue: 'lift'`**, and the homepage seed never sets `hoverEffect` —
so Payload stored `lift` on its own, `Section` emitted `vf-hover-lift`, and
`.vf-hover-lift .vf-card:hover { transform: translateY(-4px) }` applied. The ported rule is
unlayered so it won on colour, but it declares no `transform`, so nothing opposed the lift.

**Why it looked broken rather than just different:** `.testimonials-viewport` is `overflow: hidden`
and *exactly* the card's height — 407.64px viewport, 407.64px card, zero padding. Measured at
1440px:

| | Rest | Hover (before) | Hover (after) |
|---|---|---|---|
| `transform` | `none` | `matrix(1, 0, 0, 1, 0, -4)` | `none` |
| Card top vs viewport top | flush | **4px above — clipped** | flush |
| `box-shadow` | `none` | `0 4px 24px rgba(28,117,188,.1)` — **clipped away entirely** | — |
| `border-top-color` | `rgb(198, 198, 198)` | `rgb(28, 117, 188)` | `rgb(28, 117, 188)` |

So the lift bought nothing: its shadow was invisible and its movement only shaved the card's top
edge and corners.

## What changed

One unlayered rule beside the ported one — `.testimonial-card:hover { transform: none; }` — so it
beats `@layer components` with no `!important` and without editing the port. The highlight is now
what the reference specifies: the border turning brand blue.

**It neutralises `lift` only.** `.vf-hover-zoom`, `-glow`, `-accent-bar` and `-none` are unlayered
at higher specificity and still win, so four of the block's five Hover effect options keep working.
`src/Styles/HOOKS.md` records the exception, so the editor's manual does not promise a Lift that a
testimonials block will not perform.

Of the three homepage sections carrying `vf-hover-lift`, only two have a clipping ancestor, and the
experts carousel already gives itself `padding-top: 6px` — enough for its 4px lift. It was not
touched.

## New guard

`tests/e2e/frontend.e2e.spec.ts` — *"a testimonial card highlights on hover without moving"*. It
asserts no movement, no clipping, **and that the border colour changed** — without that last clause
"did not move" is also satisfied by a hover that never landed. A gateway card is hovered in the same
test as a positive control.

Three breaks were applied, and the one that stayed green is worth recording too:

| Break | Result |
|---|---|
| Delete the new rule | **RED** — `matrix(1, 0, 0, 1, 0, -4)` |
| Widen it to `.vf-card:hover` | Green, correctly: `.audience-card:hover` is unlayered at the same specificity and declared later, so nothing regressed |
| Neutralise `.audience-card:hover`'s own lift, making hover undetectable | **RED** on the positive control — the case it exists for |

## Verification — fifth pass

| Check | Result |
|---|---|
| `pnpm lint` · `pnpm exec tsc --noEmit` | Clean · Clean |
| `pnpm test` | **114/114** int, **13/13** e2e (was 12) |
| `pnpm build` | Passes |
| Computed-style diff vs a baseline captured before the change | **3 nodes — the known scroll-reveal animation frames, and nothing else.** The harness never triggers `:hover`, so a hover-only change must leave every resting style untouched; it did |
| Browser, at 1440px | Testimonial `none → none`, border `#c6c6c6 → #1c75bc`, `clippedAbove: 0`. Gateway card `none → -6px`, still lifting |

## Two traps this pass added to `CLAUDE.md`

- **`pnpm build` while `pnpm dev` is running poisons the dev server** — they share `.next`. A hover
  rule confirmed working minutes earlier began computing to `none` on every run while `:hover` still
  matched, which reproduced four times and looked exactly like a deterministic defect in the new
  test. `rm -rf .next` and a restart fixed it with the source unchanged.
- **Park the pointer before reading a "resting" style.** Playwright's mouse stays put while
  `scrollIntoViewIfNeeded` moves the page under it, so an element can already be hovered when it is
  measured at rest. That made the first draft of the positive control read the same value twice and
  pass while proving nothing.

---

# Sixth pass — the link audit

Reported: the Videolink guide went to a video, Upcoming Webinars went to the Events hub, Join Expert
Panel skipped the form, and the service cards landed on body text. Plus: *"you said they all match,
except they do not"*. That was fair — it had been asserted, not measured.

## What was measured this time

All **114 pages** from the five sitemaps, **6,177 anchors / 224 unique targets**, every status,
every fragment re-checked *after hydration*, and **177 link texts across 22 pages** diffed against
their `.design-reference` counterpart.

| | Before | After |
|---|---|---|
| Internal links not returning 200 | 1 | **0** |
| Dead fragments | 0 of 202 | **0 of 202** |
| Content links on a redirecting legacy path | 30 | **0** |
| Pages in a sitemap that 404 | 1 | **0** |

## The four reported faults

| # | Was | Now |
|---|---|---|
| Videolink Appointment Guide | `/for-claimants#video-guide` — the YouTube section | opens the guide **on the Videolink type** |
| Upcoming Webinars & Training | `/events` | `/events/upcoming-events` |
| Join Expert Panel (gateway CTA) | `/join-expert-panel` | `/specialists/join-expert-panel#join-form` |
| Service card anchors | title behind the 72px sticky nav | title clears it |

**Videolink needed new capability, not a new URL.** The guide had no anchor field and its toggle
read nothing from the URL (`useState(0)`), so it could not be deep-linked at all. Each appointment
type now carries an editable Anchor ID rendered on its button, and the guide reads the hash —
matching the reference, which puts the same ids on its tab buttons.

**The service cards' anchors were already correct.** There was simply no scroll offset anywhere in
the repo: measured, `File Review`'s heading landed at y=12 under a 72px nav. One rule on `html`
fixed all 25 anchor links, including the header's own sub-menu.

## Also fixed

`/legal/terms-conditions` (404 → `/terms-conditions`) · 30 legacy paths → canonical · the Surrogate
card now targets the whole services section, as the reference does · deep-linked accordion items
open and scroll to their title · "View Specialist Panel" ×2 → the panel, not the section landing ·
"View All Events" → the hub · the portal-access email body → the reference's wording.

**Kept deliberately different:** the homepage "Frequently Asked Questions" link keeps its `#faqs`
jump where the reference has none. Your call, recorded so it does not read as an oversight.

## Why it had drifted, and what stops it now

**Anchored links could not be internal links.** `link()` offered a resolved document *or* a raw
string, with nowhere to put a `#fragment` — so every anchored link was a hand-typed path, which is
exactly what goes stale. Links now have a **Jump to section** box that works with a document
reference, so they follow the page if it moves.

**A seed edit alone fixes nothing.** The seed had *already* been corrected to canonical paths; every
existing install still served the old ones, because the page seeds early-return on authored pages.
`seedLinkRepairs.ts` now repairs unconditionally, the same way `repairServiceLinks` does.

**`tests/e2e/links.e2e.spec.ts`** crawls the sitemaps every run and fails the build on a non-200, a
redirecting legacy path, a fragment with no target, a sitemap page that does not render, or any of
the four reported faults regressing. Proven red four ways.

## Three measurement errors I made, and what they cost

1. **65 "dead anchors" that were not dead.** I read the DOM at `domcontentloaded`; article heading
   ids are assigned on mount. All 65 were false positives — including `#join-form`, which I told you
   was missing. Re-checked properly: 0 of 202.
2. **My control could not fail.** `#main-content` is in the root layout and arrives in the first
   byte, so it passed in exactly the runs that were wrong.
3. **A stale build faked a guard's proof.** Deleting the scroll offset and re-running its test said
   PASS. The dev server had not recompiled; with the break confirmed live in the browser it went red.

All three are now in `CLAUDE.md`.

## One thing the guard found that I had not

**`/posts` was advertised in the sitemap and returned 404** — a leftover default from the Payload
template. Nothing on the site links to it, so a link crawl could never see it; only search engines
would have. Removed.

---

# Seventh pass — article deep links, closing the register

The sixth pass left one item deferred: article heading ids were assigned by JavaScript after the
page loaded, so a **pasted** article URL with a `#section` opened the article at the top instead of
jumping to the section. Clicking an item in the *In This Article* list worked, which is why nobody
had reported it — the fault only shows when a URL is copied out of the address bar and shared, which
for an article is a normal thing to do.

That was the last open entry in `OUTSTANDING.md` besides the migration. It is now fixed.

## What was wrong

The browser resolves a `#fragment` while it is still reading the page — long before any JavaScript
runs. The ids were being attached afterwards, so at the moment it mattered there was nothing on the
page with that name. Measured on a fresh load: the page stayed at the very top.

Two copies of the same naming function were also in play — one building the contents list's links,
one attaching the ids. Nothing was wrong with either, but two copies of a function are two things
that can drift apart, and if they ever had, every contents link on the site would have quietly
stopped working while still rendering perfectly.

## What changed

**The ids are written into the page itself now**, by the same function that builds the contents
list — one function called twice, so the link and the thing it points at cannot disagree. There is
no new field and nothing for an editor to fill in.

**Clicking a contents item now puts that section's link in the address bar**, so it can be copied
and shared. Previously the address bar never changed, so there was no working link to copy — the
same defect from the other end.

**Two smaller things fixed on the way:**

- `[[Bracket]]` accent markers are now tidied out of the contents list. No article heading uses one
  today, so nobody had seen the brackets print literally in the sidebar — but they would have.
- A reader who has asked their computer for reduced motion now gets an instant jump rather than an
  animated scroll. The site honoured that setting in four other places and not this one.

Documented for editors in `src/Styles/HOOKS.md` — including the one thing worth knowing:
**rewording a heading changes its link**, so a previously shared link lands at the top of the
article rather than at that section.

## New guard

`tests/e2e/links.e2e.spec.ts` gained a test that checks the same thing three ways, because each
catches something the others cannot:

1. The id is present in the **raw page as the server sends it** — across all 24 articles and all 55
   contents links. This is the actual claim; a browser reading can be satisfied by JavaScript
   putting the id there afterwards, which was the bug.
2. On a **fresh load**, the heading lands exactly on the site's scroll line, clear of the sticky
   menu — and the same article opened *without* a fragment sits at the top, so the two states are
   distinguishable. Without that second half, "the heading is at the top of the screen" is also true
   of a page that never scrolled.
3. The same, with **JavaScript switched off entirely**. Nothing client-side can fake that one.

**Measured after the change:** 55 of 55 contents links have their target in the server HTML; the
heading lands at 96px on the scroll line with a 72px menu above it, identically with JavaScript on
and off. Blocks whose anchors were never affected — the service accordions, the appointment guide —
were re-measured and land the same way, so the new check measures the page and not itself.

## Two measurement errors, again

1. **I wrote up a break before running it.** The new test's comment claimed one of its three checks
   would slip past the others. I then ran that break: it does not — every check catches it. The
   comment now records what the break actually did, and gives the honest reason the other two checks
   earn their place. A confident, wrong explanation in a comment outlives whoever wrote it.
2. **A stale build hid a working fix.** The change was correct and the served page showed no ids
   through every reload. Clearing the build cache and restarting, source untouched, and they
   appeared. This is the fourth time a stale build has produced a confident wrong answer here — but
   the first time it hid a fix rather than a break. Both directions now recorded in `CLAUDE.md`.

## One thing found while verifying, and deliberately not fixed

The admin panel's own end-to-end test fails intermittently — twice in six full runs — waiting five
seconds for the dashboard to appear on a development server that is compiling it on demand, right
after the link crawl has walked 114 pages through that same server. It passes every time on its own,
and it fails the same way on the code as it was before this change, so it is not a symptom of this
work. Logged as `OUTSTANDING.md` §2 with the ten-minute fix, rather than folded into a
content-rendering commit.

---

# Eighth pass — interior hero titles were a step too light

Reported by eye: every interior page's hero title looked less bold than the design reference.
Measured, it was — the build rendered **700** where the reference renders **800**, at an identical
61px. Nothing else in the hero differed.

## The cause, and why it had stuck

It was changed to 700 **on purpose**, and written up as a correction. `verify-website-design-diff.md`
§5 lists it among "seventeen typography values [that] had drifted from the reference and are now
aligned: … `.page-hero h1` weight 800 → 700".

**The reference declares that rule twice, and the two copies disagree.** Its shared stylesheet says
700. Every one of its nine real pages then redeclares the rule in the page itself, after the
stylesheet, and wins with **800**. The pass read the shared sheet. Tellingly it took the *size* from
the page's copy and the *weight* from the shared one, so both were in front of it.

Being logged as a fix is what kept it: anyone re-checking would have read "aligned to the reference"
and moved on. That entry has been corrected in place rather than quietly overwritten.

## What changed

One value: `.page-hero h1` back to **800**. It affects **59 of your 61 pages**, plus every event
detail page. The homepage hero, article headers, specialist profiles and team member pages were
already 800 and were not touched — re-measured after the change to confirm they had not moved.

## Was anything else ported from the wrong copy?

Checked rather than assumed, since the same method could have hit any of the other sixteen. A script
compared **every** declaration across all three sources — the shared stylesheet, the inline block of
all 108 reference pages, and the build — and flagged each one where the pages disagree with the
shared sheet *and* the build followed the shared sheet.

**Two, in the whole stylesheet.** One was this bug. The other is a contact-form padding on a single
page, which is too thin an agreement to act on — recorded rather than changed.

## New guard

`tests/e2e/frontend.e2e.spec.ts` now reads the expected weight **out of the reference page** and
compares it to what the built page computes, over three page pairs. It deliberately does not contain
the number 800: a number in a test would have been just as wrong as the number in the CSS, and would
have locked the mistake in. Proven red two ways — reverting the weight, and pointing the parser at a
page with no such rule so the "found nothing" control fires rather than passing silently.

## Something I got wrong, and reversed

I recommended also removing three unused hero types left over from the Payload template, which
render their titles at 400. You approved it. **My cost estimate was wrong and I reverted it.**

The hero type is stored as a database enum, so removing options rewrites the type — and it failed:
62 rows of draft history still hold `lowImpact`, on pages that are ordinary page heroes today. The
live pages were clean, which is why I missed it; the version history was not. Doing it properly needs
a data migration over version history, bundled into the single hand-reviewed migration you run before
deploying, for a tidy-up nobody asked for.

While the config was in that state the local site returned an error on every page. Nothing was
damaged — the database change is all-or-nothing and rolled back, with the enum and all 481 rows
intact — but it is recorded, with the row counts and the exact fix, as `OUTSTANDING.md` §3 for after
the deploy.

## Verification — eighth pass

Lint and typecheck clean · **123/123** integration · **18/18** end-to-end (was 17) · production build
passes. Five pages measured against their reference counterparts: all now 800 against 800. The
computed-style comparison against a pre-change baseline changed **24** elements of 6,675: **21** are
hero titles and their accent spans going 700 → 800 and nothing else — the boxes did not resize, so
nothing reflowed — and the other three are the known scroll-animation false positive.

---

# Ninth pass — the Meet the Team intro had lost its blue band

You spotted that *"Our People / Experienced, Dedicated & Client-Focused"* on **About us → Meet the
Team** should sit on light blue, as the design reference has it, and asked whether that was editable
from the admin.

## The answer to the question: partly, and not in a way that could produce this

Two of the three pieces were already there:

- **The colour** is editable — Design System → Section bands → *Accent (light blue)*. Its default is
  **byte-identical** to the reference's, so nothing needed changing there.
- **The band choice** is editable — the People Grid block has a Background picker with an Accent
  option.

What was missing is that *"Our People"* and the team photos are **one block**, so they shared one
background. The reference uses two sections: blue behind the intro, grey behind the photos. An editor
could make the whole thing blue or the whole thing grey — never blue-then-grey.

So the thing to add was not a colour. It was a way to give a block's heading a band of its own.

## What changed

**A new control: People Grid → Header band.** Leave it on *"Same as the section"* and nothing changes
— which is how every existing block on the site renders, untouched. Pick a colour and the eyebrow,
heading and intro move onto their own full-width band above the content.

Two things it deliberately will not do: it renders **no band at all** if the block has no heading
text (an empty coloured stripe is worse than no stripe), and it does nothing inside a Section or Row,
where a block has already inherited its parent's background.

**Measured after the change**, against the reference's own declared values:

| Band | Reference | Build before | Build now |
|---|---|---|---|
| Hero | dark blue gradient | same ✓ | same ✓ |
| Intro — *Our People* | `#eef9ff → #e6f4ff → #d9efff` | **absent** | **exact match** |
| Photo grid | `#f5f6f8` | `#f5f6f8` ✓ | `#f5f6f8` ✓ |

**Correction — the spacing below the copy was wrong, and I called it acceptable.** I first shipped the
band at the site's standard 88px top and bottom and wrote that it "reads slightly more generous rather
than wrong". You looked at it against the reference and said there was too much space underneath. You
were right, and there was a real fault behind it, not just a taste difference:

The intro paragraph carries a **48px bottom margin**. That exists so a section header can separate
itself from the content below it *in the same section* — and it is exactly right there. Alone in its
own band there is nothing below it, so those 48px became dead space **inside** the blue band. Measured
136px between the last line of copy and the bottom of the band, where the reference has 64px.

Fixed by dropping the trailing margin on a header band's last element — the same idiom already used
for the gateway cards — and giving a header-only band the compact bottom preset rather than a full
section's. Both are tokens, so Design System → Spacing still governs them.

The number that is actually visible is the seam between the copy and the photos: **136px now, against
the reference's 144px**, down from 176px. The page got 88px shorter.

## It had to reach the live site, not just a fresh install

Editing the seed alone would have changed nothing on the box: the page seeds skip a page that already
has content. That is the trap that left 30 links stale earlier in this project.

So the fix ships in both places — the seed, and an unconditional repair
(`seedBlockBands.ts`) that runs on every seed and writes only when the stored value actually differs.

**The repair was tested on its own, because the first run proved nothing.** It reported "0 changes" —
the page seed had already set the value, so the repair had nothing to do. That is exactly the
"exited 0 having written nothing" trap, so the value was reset and the repair run in isolation:
**1 change**, value confirmed in the database, and a second run reported **0** (it is idempotent).

## New guard

A test now asserts **both** bands, reading the two expected colours out of the reference page rather
than hardcoding them. The second half is the one that matters: "the intro is blue" is equally
satisfied by the entire section going blue, which is the wrong design and was the cheap shortcut this
work exists to avoid.

Proven able to fail two ways — reverting the stored setting, and making the grid blue as well — each
confirmed live in a browser first.

## Verification — ninth pass

Lint and typecheck clean · **123/123** integration · **19/19** end-to-end (was 18) · production build
passes. Three distinct bands confirmed in a browser at 1440px and compared with the reference side by
side. The People Grids on the homepage and the JME page were re-checked and render exactly one band,
unchanged.

After the spacing correction the computed-style comparison isolates it exactly: **six** elements
changed — the band's bottom padding 88px → 48px, the paragraph's bottom margin 48px → 0, the three
heights that follow from those, and one known animation frame on another page. A control route was
byte-identical across all 357 of its measurements.

Computed-style comparison against a pre-change baseline: 343 of the changed elements are on
`/about/meet-the-team` — expected, since adding a section renumbers everything below it on that page
— and the only three elsewhere are the known scroll-animation false positive. A control route was
byte-identical across all 357 of its measurements.

Database cost: **2 added columns**, nullable and defaulted to inert. Nothing dropped, no list of
allowed values changed. The migration's deliberate drop-count of five is untouched.
