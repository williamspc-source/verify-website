# Current state

**Snapshot: 2026-08-23 (evening).** Where the project actually stands — what is working, what is not, and what
has to happen to get it onto the box. Written for the person driving the work, not as a handover.

This file is a **status snapshot**, not a reference. It deliberately does not restate architecture,
invariants, or editor instructions — those live elsewhere and would rot here as a second copy. Every
section below points at the document that owns the detail.

> **Keep it true, and keep it short.** This is the sixth record in a set whose whole rule is that a
> change lands in every document it touches, in the same pass. A status file is the easiest of the
> six to let drift, and a stale status file is the most misleading of the six — it is the one people
> read to decide whether something needs doing. If an item here is fixed, delete it; do not annotate
> it. The history is in `git log` and in `HOMEPAGE-CHANGES.md`.

| Where to look | For |
|---|---|
| `CLAUDE.md` | Architecture, invariants, and the measurement traps that have already caused wrong conclusions |
| `OUTSTANDING.md` | Known-imperfect things, each with measured impact and the cost of fixing it |
| `README.md` | Running, testing, deploying, and where images go |
| `src/Styles/HOOKS.md` | The non-technical editor's manual — every control and where it lives |
| `HOMEPAGE-CHANGES.md` | What each implementation pass changed, and what it verified |
| `ADMIN-GUIDE.md` | What every admin sidebar item is for — the editor's system guide |
| `verify-website-design-diff.md` | Design reference vs build, page by page. **Comparison 55 is the latest**; 22 is the last full cross-page audit |
| `REVIEW-CHECKLIST.md` | Every page and block, to tick off during manual review. Working document — it is spent once the review is done |

---

## Stack

Next.js 16.2.6 (App Router) · Payload 3.85.0 (Postgres) · React 19.2.6 · Tailwind 4 · `pnpm`.
One application serves both the public site and `/admin`.

---

## What is working well

**The build is green on every gate but one.** Re-measured 2026-08-23 after the TryBooking pass, not
carried over from an earlier one:

| Gate | Result |
|---|---|
| `pnpm exec tsc --noEmit` | clean |
| `pnpm lint` | clean — no errors, no warnings, no new suppressions |
| `pnpm test:int` | **205/205**, 12 files — measured 5 runs in 5 after the identifier fix, where it previously failed 1–2 in 3 |
| `pnpm test:e2e` | **61/61**; `admin.e2e.spec.ts` and `links.e2e.spec.ts` still flake under a full run on a *dev* server — `OUTSTANDING.md` §2 |
| `zsh tests/int/prove-guards.sh` | **11/11** — every guard proven to go red on its deliberate break |
| `referenceCssDiff.mjs`, all 13 families | zero differences |

> **This file owns the test counts.** They were in four documents and no two agreed; `CLAUDE.md` and
> `README.md` now carry the commands instead. Note the e2e number cannot be counted from source: **27**
> `test(` declarations expand to **54**, because `images.e2e.spec.ts` and `richTextRender.e2e.spec.ts`
> both parameterise one per route. Run it.

> This run was against a **dev** server on `:3000` — a clean one, restarted with `.next` removed —
> and `admin.e2e.spec.ts` did not flake in it. The previous reading in this table was taken against
> the production server and is no longer what the numbers describe. `OUTSTANDING.md` §2 diagnoses the
> flake as a 5s timeout against a cold Turbopack compile, which a warmed dev server would not hit;
> one clean run is not proof either way, so do not close §2 on it.

**The content model is complete and populated.** 22 collections, 10 globals, and **89** live URLs
across five sitemaps, counted 2026-08-20 — 27 pages, 4 posts, 26 specialists, 19 team, 13 events.
Nothing is a stub. It was 113 (28/24/26/19/16): the 2026-08-20 content cull replaced 24 scaffold
articles with 4 real ones and 16 scaffold events with 13 real ones, and the Style Guide page was
removed the same day. Re-count from the sitemaps rather than editing this line.

**The design gap is much smaller than the log suggested.** Re-audited 2026-08-17 against the
reference served over HTTP: of the twelve recurring cross-page issues still marked open, **ten are
resolved**. Breadcrumbs, hero shields, dark-band contrast, literal `[[bracket]]` text, focus-ring
artefacts and CTA structure are all correct now. 21 of 22 page pairs match structurally.

**The things that used to fail silently now fail loudly.** This is the property most worth
protecting. The server refuses to boot without `SMTP_HOST` / `NEXT_PUBLIC_SERVER_URL` /
`PREVIEW_SECRET`; unsent mail is logged at *error*, not info; cache purges expire rather than go
stale; document URLs come from one function; and `tests/int/adminControls.int.spec.ts` fails the
build if a field an editor can set is read by nothing. `zsh tests/int/prove-guards.sh` proves each
guard can actually go red — run it if you change a test.

---

## What is not done

### 1. The box is out of date and is being rebuilt from scratch — baseline now generated

The version deployed on the Proxmox box predates the data layer, the branding work and the whole
redesign. **The decision is to wipe it and do a fresh install rather than migrate.** Nothing in the
live database needs preserving — no editor content, no uploads, no submissions.

**The blocker is cleared.** `src/migrations/` now holds a single
`20260823_130006_baseline.{ts,json}`, generated from the current schema; the stale 5 July baseline
is deleted and `index.ts` points at the new one. `OUTSTANDING.md` §1 — the catch-up migration with
its five drops, hand-pasted `USING` clauses and pre-flight check — is fully superseded and exists
only as history.

**It was verified against an empty database rather than left for the box to discover.** A scratch
`verify_cms_migtest` was created, `pnpm payload migrate` ran it in 685ms with no errors, and a
column-level diff of the result against `verify_cms` — table, column and data type — returned
**zero differences in both directions**: 310 tables, 3605 columns, 1305 indexes on each. The scratch
database was then dropped.

The `up` function is **310 `CREATE TABLE` and 995 `CREATE INDEX … USING btree`, with no `DROP` and
no `ALTER … USING`**; the 310 drops are all in `down`, as they should be. Exactly one identifier
reaches 63 characters — `_pages_v_blocks_people_grid_asmt_type_id_assessment_types_id_fk`, which is
the *complete* name rather than a truncated one (next longest is 62). That check exists because a
name truncated at 63 is what made the schema rewrite itself on every boot; see the identifier
invariant in `CLAUDE.md`.

**The schema is frozen.** Any field change from here needs its own `migrate:create` on top, so treat
a new collection/global/block field as a deliberate decision rather than a tweak.

### What is left before pushing

Nothing in the repo. On the box: pull → `pnpm payload migrate` → `pnpm build`, then seed with
`POST /next/seed-verify` (needs `ENABLE_SEED_ENDPOINT=true` and a logged-in user). Its `.env` must
set `SMTP_HOST`, `NEXT_PUBLIC_SERVER_URL` and `PREVIEW_SECRET` or `instrumentation.ts` exits 1 — and
**`LOCAL_PROD_REPRO` must never be set there**.

### 2. Design gaps — none open

All six items from `verify-website-design-diff.md` Comparison 22 are closed: two fixed (`/events`
rebuilt as the reference hub; the In the Loop featured cards given topic tags), three accepted as
deliberate deviations (breadcrumbs, the Contact portal section, the footer opening hours), and one
withdrawn as a false positive of mine (the IME/JME icon points are present — the probe was scoped to
one section and the content had moved down the page).

The event **detail** page was then rebuilt past the reference — an approved deviation, written up as
Comparison 25. It now has a recap body with anchored headings and a contents list, a photo gallery,
downloads, an optional photo hero, and one action row instead of three stacked elements.

**Those are empty editor surfaces.** No event has a recap, a photo, a gallery or a download yet, and
nothing was invented to fill them: a past event still shows the "this event has now concluded" line
until someone writes one. That is the next content job, not a defect.

`/services` followed (Comparison 26): the split-row icon removed, both card designs ported into
page-scoped rules, and the Enquire links aligned in both grids. `referenceCssDiff.mjs` now has a
`services` family reading zero, and gained two fixes of its own — it had been treating `@layer` like
`@media`, so every rule in `@layer components` read as missing.

`/services/medico-legal/ime` followed (Comparison 27): the assessment-format cards now use a new
**Banded** card style on FeatureGrid — a tinted header panel behind the icon and title — with the
reference's icon chips, item tiles and hover. `referenceCssDiff.mjs` has an `ime` family reading zero.

Every carousel was then cross-referenced against the reference (Comparison 28): five of seven already
matched, the `/jme` marquee was slowed 34s → 60s with its arrows removed, and the Availability strip's
30s fallback was corrected to 60s. Featured Articles gained the motion/control fields the other
carousels already had.

The `/jme` and `/admin-services` process steps were then ported to the reference (Comparison 29) —
56px circles, plain step numbers, and the reference's type scale — with a new editable **Step number
style** field, since the reference uses `1` on some pages and `01` on others. The heading-wrap guard
in `frontend.e2e.spec.ts` gained a narrow, re-proved exemption for the two headers that cap
themselves on purpose.

`/services/medico-legal/reporting-services` followed (Comparison 30), and changed how these ports are
done. The four before it pinned their design to a page class; this one puts it in the block, as three
independent Split Feature settings — **Row style**, **Text density**, **Bullet style** — plus a
per-row **Placeholder icon**. Each defaults to what already rendered, so any split section can take
the look and none of them moved. A `reporting-services` family reads zero, the page joined
`computedSnapshot.mjs` (14 of 29 routes → 15), and uploading an image to a row still replaces the
placeholder outright, which is proven rather than assumed.

Medical Negligence was then removed from the services pages (Comparison 31) — the row on
reporting-services, the card on `/services`, and the prose mention on `/services/medico-legal`. It is
a **content decision and a deliberate deviation from the reference**, which carries both. The claim
type, the `/ime` accordion and the contact form's option are untouched, so the offering itself is
unchanged. The heading became "Four Ways", and the rows moved to `imageSide: 'auto'` so the
alternation now maintains itself.

The /ime "What's Included" text was then corrected (Comparison 32) — the detail descriptions were
rendering at 18px against the reference's 12.8px, and the label was grey instead of brand blue. The
page had been reading **zero** in `referenceCssDiff.mjs` throughout, for two reasons now fixed: the
tool blanket-skipped `color` for any aliased selector, and one mapping was `null`ed with a
justification that was simply untrue. Removing the `color` skip surfaced five more differences across
three families — one real, four measured and explained.

Specialist profiles followed (Comparison 33), and were **not** a CSS problem — 15 element groups
measured clean against the reference. Three fields were wired wrongly: the subtitle showed the
specialty because `specialty` is required and the `position` fallback could never be reached; all 96
qualification rows showed one icon because the seed dropped the per-row value; and
`Accreditations.icon` was read by nothing. All 26 profiles now verify by enumeration — 153 rows, 0
icon and 0 subtitle mismatches — and the icon rule is proven against the reference corpus by a test.
Two guard holes were found and recorded, and one real difference (light-band breadcrumb colour, which
affects ~25 pages) is deferred as `OUTSTANDING.md` §5 for a decision.

`/information-centre/for-clients` followed (Comparison 34). The section that looked completely
different needed **three stored field values**, not a port: Card alignment had never been set (the
homepage's identical grid already had it), the band was flat grey where `--band-accent` is already
byte-identical to the reference's gradient, and the padding preset was one step too large. The support
cards became a new editable **Soft** card style. The homepage was wrong in the same way and now
measures 0 against its own reference. Recurring item 7 in the design-diff was **corrected** — it had
described these cards as a bulleted list long after they stopped being one.

The FAQ accordions followed (Comparison 35), across all four pages that have one. The content was
already exact — all 32 questions and 32 answers on the two Information Centre pages are byte-identical
to the reference — so every gap was presentation: the reference draws one flat divided list, ours drew
four rounded card stacks. Now six settings on the FAQ block, each defaulting to what already rendered
(proven: 0 nodes moved with the fields added and no data touched), plus a reusable **Pale blue**
Section background. The page-scoped `.vf-faq.jme-faq-aside` class was retired for the `columns: split`
field that supersedes it. The tooling gap mattered more than the CSS: `referenceCssDiff.mjs` matched
`ime` on `^\.ime-format` and `jme` on `^\.jme-process`, so both read zero while a second section on
each of the same two pages was covered by nothing — four new families now cover them, and all
**twelve** read zero.

`/specialists/join-expert-panel` followed (Comparison 36), and was the sharpest instance yet of a
recorded trap: the enquiry band's CSS was already written and correct, and **none of it could render**,
because every rule hung off `cssClass` values that a seed fixture set and `authorPage` never delivered
— zero `cssClass` rows for the page, ~110 lines of dead CSS. It is now three block fields (Row →
Column ratio, Icon List → Heading align, Form → Card style), which also retired the two *other*
page-scoped classes doing the same card job on Contact and the homepage. Placeholders turned out to be
a missing capability rather than missing content — Payload's form-builder declares `placeholder` on
`select` alone — so the plugin now adds one to text/email/textarea/number and the renderer reads it.
Thirteen diff families read zero.

**Comparison 37** is the first team-requested feature rather than a reference gap: the two
"register for the booking portal" buttons — new on `/contact`'s portal card, retargeted on
`/make-a-booking` — now open the visitor's mail app with the enquiry already written. The wording is
one template in **Site Settings → Booking portal registration email**, read at render, so one edit
changes both. The body is the design reference's own, byte for byte. `CMSLink` cannot be async (three
client components import it), so the new `portalEnquiry` link type is resolved by the block and
offered only on the two blocks that resolve it — enforced by the resolver's return type, so
forwarding a raw link is a compile error rather than a dead button.

**The admin was audited and made legible.** Nothing anywhere explained the 22 collections and 10
globals, and the admin used different words from the site in four places. `Posts` is now **Articles**,
`Categories` **Topics**, `Areas of Expertise` **Assessment Areas**; the settings globals moved out of
the content groups into **Page settings**; every collection and global gained a one-line description;
and the dashboard stopped telling editors to visit a *Globals* heading that does not exist.
`ADMIN-GUIDE.md` is the new editor-facing guide. One real defect fell out of it: Claim Types were
concatenated into the Assessment Types list on 23 of 26 specialist profiles, so a claim type never
appeared under its own name — now its own section, a deliberate departure from the reference.

**Comparisons 39-48**, all since that audit, in a line each: the join-panel benefit cards styled —
and their CSS found to have been unreachable, hung off a page-scoped class that never reached the
database (39); every event given one date fallback (40); images served at the size they render, six
routes falling from 19.5 MB to 4.5 MB (41); the claimant process photo and the founder portrait
(42-43); `/in-the-loop`'s empty sections and their nav tabs removed together (44); a rule between
Upcoming and Past on `/events` (45); team profiles given a second photo, with a double crop fixed
(46); `/contact`'s parking caveat moved to sit with the car parks (47); and this documentation audit
(48). The detail is in `verify-website-design-diff.md`; this list exists so a reader can see that the
narrative above stops at 38 on purpose.

**Comparison 49 (2026-08-21) is a capability pass, not a design one.** Every field
an editor types words into is rich text — 585 columns, up from ~50 — with bold,
italic, underline and links on the field and a brand-palette **Text colour** on
the block. `[[brackets]]` still paint a phrase in the accent. `computedSnapshot`
reads 8385 nodes before and after with an empty diff, so it moved no pixels; six
new guards keep it that way. What stays plain — URLs, mailto bodies, alt text,
CSS classes, tokens, `<option>` labels — is listed with a reason in
`tests/int/proseFields.int.spec.ts`.

**Comparison 50 (2026-08-21) made that colour control real, and it had not been.**
The **Text colour** dropdown Comparison 49 added was declared on 26 blocks, saved
to Postgres and **read by nothing** — no component forwarded it — so an editor
could set it on any section heading and see no change. The orphan-field guard was
blind to it because the field arrives through a shared bundle it never read. Both
are fixed, and a colour swatch now sits in the toolbar of every rich-text box, so
colour is available per *selection* as well as per element. Measured: `.vf-tc-brand`
computes `rgb(28,117,188)` against a `rgb(65,64,66)` control, and `computedSnapshot`
is empty at the same 8385 nodes because nothing is coloured until someone colours it.

**Comparison 51 (2026-08-23) removed a hover effect from tiles nothing can click.**
The booking-portal band's three tiles brightened under the pointer and did
nothing — on 26 specialist profiles plus three pages — because the design
reference declares that hover on its own non-interactive `<div>`s. One CSS rule
covered all 29. Measured: the tile went `/ 0.1` → `/ 0.17` before and `/ 0.1` →
`/ 0.1` after, with the enquiry button unchanged as the control. Nothing in the
suite could have caught it, so `tests/visual/findFalseHover.mjs` now audits for
the shape; it reports **14** further candidates, mostly cards carrying the
editor's own **Hover effect** setting, which are content decisions rather than
defects. Two unrelated blockers were fixed to get a green run — see
`verify-website-design-diff.md` Comparison 51.

The next input is your pass through `REVIEW-CHECKLIST.md` — the two colour lines
in it are worth doing carefully, since one of them passed by eye for a whole pass
while the control underneath it did nothing, and there is now a line for hover
affordances too.

### 3. Smaller known items

Each is measured and justified in `OUTSTANDING.md` — do not re-derive them:

- **§2** `admin.e2e.spec.ts` fails intermittently in a full run — a default 5s timeout against a
  cold admin bundle, not an admin fault. Test-only.
- **§6** Three dead CSS rules scoped to `.ct-portal-card`, a class that never reaches the DOM. Nothing
  renders wrong — a separate live rule covers it — and restoring the class would *move* the page, so
  the fix is deletion, in the next dead-CSS sweep.
- **§3** The three Payload-template hero types render their title at weight 400. No page uses one,
  but the dropdown offers them. Removing them needs a data migration over `_pages_v` history.
- **§4** `.contact-form` padding follows the reference's superseded rule. Needs someone who knows
  the design to say which value is intended.
- **§11 / §12** Format, not size: specialist headshots are PNG, so their derivatives are too (~1.5 MB
  across `/` and `/specialists`), and the bundled shield is a 1166px PNG in a 50px box.
- **§15 / §16** A faithful port nothing can reach, and two self-sectioning blocks missing from
  `selfSpaced` — Events Explorer and Featured Articles carry a stray 64px.
- **§17** An article is bylined to **Evie Le**, who is not on the team and whose photograph has been
  removed. A content decision: re-attribute the article, or put her back with a photograph.
- **§18** Seven of `referenceCssDiff.mjs`'s exceptions rest on browser measurements older than the
  stylesheet they excuse. All 13 families read zero today; the exceptions are what needs re-taking.
- **§19** Stats Band, Spacer, Divider, Icon and Image are on no page since `/style-guide` was removed,
  so nothing reviews them.
- **Text colour, if it "does nothing":** check three things in order — the page is still a **draft**
  (press Publish), the choice was one of the two *"Follows the band"* entries (identical to Default on
  a light background, by design), or the words being looked at are in a **card** rather than the
  block's own heading, which is all the dropdown reaches. All three were hit in one sitting.
- **§20** The toolbar colour swatch is `TextStateFeature`, which Payload 3.85 marks
  `@experimental`. Live and working; re-check it on any Payload upgrade. Stored content is a bare
  palette key, so a broken API could cost the control but never the words.
- **§21** Enter in a heading makes a paragraph in the editor (the page renders it as a line break
  either way). Cost measured by writing it.
- **§22** Payload now boots in ~7s, which silently *skipped* two integration specs until their
  timeouts were raised — a suite reporting green while checking nothing.

### 4. /in-the-loop shows one section, because one stream has articles

The 2026-08-20 content cull left four real articles, all in the **QA Insights** stream. Seven of the
hub's eight sections therefore have nothing to list, and each is now set to hide itself when empty —
**and its tab in the sticky category nav goes with it**. Measured on the served page: 1 tab, 1
anchor, 0 dead fragments, identical with JavaScript disabled.

Nothing needs changing. Publish an article into any stream and that section and its tab both come
back on their own. To *see* an empty section — to check its wording before the content exists —
untick "Hide this section when it has nothing to show" on that block; the tab returns with it.
See `src/Styles/HOOKS.md` and `verify-website-design-diff.md` Comparison 44.

The three scaffold resources were deleted with the articles: each was only a link to one of them, and
`links.e2e.spec.ts` caught all three 404ing. `ensureResource` in `seedHubs.ts` is retained for the
first genuine resource.

**Every one of the 13 events is in the past.** So `/events/upcoming-events` renders its empty state
("No upcoming events are listed right now — please check back soon"), and the hub's *AAMLE Events*
section — which lists upcoming events only — counts as empty and is hidden with the rest. Both are
the source data, not a fault; a future-dated event brings them back.

### 4b. Photographs — the team is done, twelve placeholders remain

All 27 supplied photographs are in (2026-08-20): **19 of 19 team members** and **26 of 26
specialists** have a headshot, sourced from the tracked folders and reproducible on a fresh install.
Eight page photographs are placed through `repairContentImages.ts`.

What is left is **12 of the 20 image placeholders**, listed in `OUTSTANDING.md` §13 with what
closing each one costs. They render the designed pale-blue tile; nothing looks broken.

---

## Working locally

The loop in use is **production mode**, not `pnpm dev` — it is what the box will run, and it does
not have the dev server's stale-bundle failure mode.

```bash
./start.sh          # build + serve, backgrounded → .dev.log / .dev.pid, binds 0.0.0.0
./stop.sh
```

This needs `LOCAL_PROD_REPRO=1` in `.env`, because `next start` sets `NODE_ENV=production` and the
server otherwise refuses to boot without deploy secrets. It prints a banner on every boot and
disables nothing else. **Never set it on the box** — it is the only thing between a misconfigured
deploy and months of silently discarded enquiries.

Local admin is `admin@local.test` / `password` against the dedicated `verify_cms` Postgres 15
database. The adapter pushes schema in dev, so there are no local migrations.

**To diff a page against the design reference**, serve the reference over HTTP — never open it over
`file://`:

```bash
(cd .design-reference && python3 -m http.server 4100)
```

Its stylesheet is linked root-absolute (`/assets/css/styles.css`) and silently fails to load from
the filesystem, so every shared-sheet rule reads as an unstyled default and you measure the wrong
thing. Note also that each reference page redeclares what it needs in an inline `<style>` block at
equal specificity — **the inline copy is the one that renders**, not the shared sheet.

---

## Pushing to the box

Production builds and migrates on a remote Proxmox box, reached over Tailscale and managed through
the Proxmox dashboard. The loop is: commit locally → push → the box pulls, builds, migrates.

**Nothing is pushed until the polishing work is finished.** Commits accumulate on `main` locally;
the baseline is regenerated once, at the end, against whatever the schema has become by then.

### Before pushing — in this order

The order matters. `pnpm build` goes **after** the tests: build and dev share `.next`, and building
while a server is up replaces the bundle that `pnpm test:e2e` is about to reuse. That has already
produced four consecutive reproductions of a "defect" that was a poisoned server.

1. `pnpm exec tsc --noEmit`
2. `pnpm test` — lint, then integration, then e2e
3. `./stop.sh`, then `pnpm build` — must pass *without* `LOCAL_PROD_REPRO`
4. `./start.sh` and click through: submit the enquiry drawer and confirm a row appears under
   **Form Submissions**; open a draft post's **Preview**; check header and footer nav links resolve
5. Regenerate the baseline migration (§1 above) — **last**, once fields have stopped moving

Every commit must typecheck on its own, not merely at the end of the branch — `README.md` →
*Committing* has the cheap per-commit check.

### On the box — fresh install

1. Clone, `pnpm install`, and write `.env`. Required or the server will not boot:
   `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, `SMTP_HOST`.
   Also set `CRON_SECRET`. **Do not set `LOCAL_PROD_REPRO`.**
2. Create an empty Postgres database, then `pnpm payload migrate` — the regenerated baseline builds
   the whole schema in one step.
3. `pnpm build`, then start the server.
4. Register the first admin user at `/admin`.
5. Seed the scaffold content: set `ENABLE_SEED_ENDPOINT=true`, restart, `POST /next/seed-verify`
   while logged in, then **unset it and restart**. The endpoint rewrites page parents — which
   changes live URLs — and overwrites taxonomy copy from code fixtures, so it must not stay
   reachable in production.
6. **Admin → System → Search → Reindex.** Search results store their own canonical `uri`, written
   on save; documents that predate a seed keep whatever they had, and a result with no `uri`
   renders unlinked.
7. Set **Admin → Site Settings → Breadcrumbs** (`Home` / `›` / `Breadcrumb`) and the brand assets —
   these start empty on a fresh install.

### After deploying, check these first

They cover the areas where a silent failure would otherwise go unnoticed:

- `/admin/collections/pages/create` renders **a form, not just a sidebar** — the canary for the
  revalidation crash described in `CLAUDE.md`.
- The enquiry drawer submits and a row appears under **Form Submissions**. A drawer that cannot
  reach its backend must say so and disable submit — never acknowledge locally.
- A page with a **Process Steps** block renders its step descriptions as paragraphs, not raw JSON.
- Header and footer nav links resolve, including any pointing at an article.
- One interior page hero, and a testimonial card.
