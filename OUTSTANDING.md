# Outstanding issues

Things that are known-imperfect and were **deliberately not fixed**, with what each one actually
costs and what fixing it would cost. Written at handover so the next person inherits a register
rather than rediscovering these one at a time.

Every figure here was measured against the repository, not estimated. Where an issue is *not*
currently reachable, that is stated plainly — several of these are traps for a future change rather
than live faults today.

**Keep this file true.** Delete an entry when it is fixed; add one whenever something is knowingly
left undone. A stale register is worse than none, because people trust it.

Related: `CLAUDE.md` → **Invariants** (the rules these were judged against),
`CLAUDE.md` → **The records** (which document holds what, and the rule that they move together),
and `zsh tests/int/prove-guards.sh` (proves the automated guards can actually fail).

---

## Summary

| # | Issue | Live today? | User impact | Effort | Recommendation |
|---|---|---|---|---|---|
| 1 | The catch-up migration, abandoned — a **fresh baseline** replaces it | — | **Blocks deploy** until the baseline is generated | ~20 min | Superseded; the live procedure is `current-state.md` §1 |
| 2 | Two e2e specs are flaky under a loaded dev server, and can 500 an unrelated route | Test-only | `pnpm test` fails intermittently on a machine that is otherwise fine, sometimes reporting a page as broken when it is not | ~10 min | Worth doing before handover |
| 3 | Three template hero types render their title at 400 | Latent | An editor who picks one gets a visibly unstyled heading | ~30 min **+ a data migration** | After the deploy, not before |
| 4 | `.contact-form` padding follows the reference's superseded rule | Cosmetic | 12px more padding than one reference page shows | ~5 min | Only if someone confirms which is intended |
| 5 | Light-band breadcrumbs are darker and heavier than the reference | Cosmetic, ~25 pages | A slightly heavier trail than the reference draws | ~10 min + re-baseline | A decision, not a tidy-up — someone should confirm the lighter trail is wanted |
| 6 | Three dead CSS rules on a `.ct-portal-card` class that never reaches the DOM | No | None — a live rule covers it | ~5 min | Fold into the next dead-CSS sweep |
| 7 | A Service with no `linkOverride` would render a link to a page that does not exist | Latent — 0 broken links today | Only if someone adds one of the 6 override-less services to the one grid with linking on; `links.e2e.spec.ts` catches it | ~20 min + a schema change | Before anyone builds a new services grid |
| 8 | The availability button says "Send enquiry"; form submits say "Send Enquiry" | Cosmetic | One word, one button | ~10 min + a repair | With the next copy sweep |
| 9 | The Join the Expert Panel intro is 2–4px off, on selectors ~29 pages share | Cosmetic, 1 page | Sub-pixel to 4px on one intro band | ~15 min + re-baseline | Only with a wider type pass — the selectors are shared |
| 10 | Three deliberate departures from the reference | By design | None — all three are improvements on the reference | — | Recorded so nobody "fixes" them back |
| 10a | The portal tiles still read as instructions ("Download CV") | Yes, mild | A visitor may try to click a tile that does nothing | Editing 12 labels in the admin | Whenever you want the wording changed |
| 11 | Photo derivatives are PNG, which costs ~1.5 MB across two pages | Yes | `/` and `/specialists` carry ~1.5 MB more than they need | 2 lines + regenerating every derivative | Its own pass — the regeneration is migration-shaped |
| 12 | The bundled homepage shield is a 1166px PNG in a 50px box | Yes | 73 KB for a 50px logo, on every page | ~10 min | With the next asset sweep |
| 13 | Twelve of the twenty image placeholders have no photograph | Yes | Twelve pale-blue placeholders where a photo belongs | Per photo: drop the file in and map it | As the photographs arrive |
| 14 | `public/media/` accumulates orphaned uploads across reseeds | Local only | None — disk on the dev machine | ~5 min | Whenever it bothers you |
| 15 | `.events-summary-section` is a faithful port that nothing can reach | No | None — dead CSS | ~5 min | Fold into the next dead-CSS sweep |
| 16 | Two self-sectioning blocks are missing from `selfSpaced` | Yes | A stray 64px above and below Events Explorer and Featured Articles | ~5 min + re-baseline | Next spacing pass — it moves pages, so measure |
| 17 | An article is bylined to someone who is not on the team | Yes | A byline that does not link, where the others do | ~5 min + a reseed | Needs a content decision first |
| 18 | The reference-diff exceptions rest on measurements older than the stylesheet | No | None — but the tool's exceptions cannot be trusted until re-taken | ~45 min | Before the next port that leans on them |
| 20 | The toolbar colour swatch rides an `@experimental` Payload API | Live and working | None today; a Payload upgrade could remove the control, never the content | ~20 lines to rebuild or drop back | Re-check on every Payload upgrade |
| 21 | Enter in a heading makes a paragraph, not a line break, in the editor | Admin only | The page renders correctly either way | ~40 lines **+ two pinned Lexical deps** | Only with the pin guarded |
| 22 | Payload boots in ~7s, and two specs were silently skipped for it | Dev/test only | A suite can report green while checking nothing | Unknown | Watch the admin, not the boot |
| 19 | Five blocks are on no page, so nothing reviews them | No | A regression in them would ship unseen | ~30 min for an unlisted style-guide page | A decision — doing nothing is defensible |

---

## 2. `admin.e2e.spec.ts` and `links.e2e.spec.ts` fail intermittently, and only in a full run

Found while verifying the article deep-link pass, not caused by it — the change touches no admin
code, and the spec passes on the pre-change tree too.

**Measured:** across six full `pnpm test:e2e` runs, *"Admin Panel › can navigate to dashboard"*
failed twice with `expect(locator).toBeVisible() failed` on `span[title="Dashboard"]`. It passes
every time in isolation (`pnpm test:e2e tests/e2e/admin.e2e.spec.ts` → 3 passed, 17s). When it
fails, Playwright's serial mode skips the two admin tests behind it, so the run reports
`1 failed, 14 passed` out of 17 — two of the "missing" tests never ran rather than passing.

**The cause is a default timeout, not the admin.** Both `tests/helpers/login.ts` and the dashboard
test wait on the Dashboard element with Playwright's default 5-second `expect` timeout, against a
**dev server** that compiles the admin bundle on demand. The admin spec runs immediately after the
site-wide link crawl, which has just walked 114 pages through that same server. Five seconds is a
generous budget for a rendered page and a thin one for a cold Turbopack compile under load.

**The fix** is to give those two assertions their own timeout (`{ timeout: 30_000 }`), or to warm
`/admin` once in `beforeAll` before starting the clock. Not a longer global timeout — that would
slow every genuine failure in the suite to a crawl.

**Widened again 2026-08-18: it also produces outright 500s, not just timeouts.** A later full run
failed with *"pages listed in a sitemap that do not render: /in-the-loop → 500"* — which reads like a
broken route and is not one. The dev log settles it by counting rather than by argument: across that
session `/in-the-loop` served **200 twenty-five times and 500 once**, and `/` served **200 one hundred
and seven times and 500 once**. A genuinely broken route does not do that. The trigger is visible in
the log immediately before each failure — `Pulling schema from database…`, i.e. `seedUser.ts` building
its own Payload instance for the admin spec while the crawl that follows is already running. So the
admin spec does not merely fail on its own timeout; it can take the *next* spec down with it.

**Widened again 2026-08-20: the `beforeAll` hook now exceeds its own 30s budget.** Two of three full
`pnpm test` runs failed with *"beforeAll hook timeout of 30000ms exceeded"* at
`admin.e2e.spec.ts:12`, followed by *"browser.newContext: Target page, context or browser has been
closed"* — so the hook, not an assertion, is where the clock runs out, and all three admin tests are
lost with it. The same spec passed **3/3 in isolation in 16s** immediately afterwards, and the count
has grown — 17 tests when this was written, 31 on 2026-08-21 — which is more crawl traffic ahead
of it. (The suite counts live in `current-state.md`, dated; they were in four documents and no two
agreed.) Same cause, one layer up:
`seedTestUser()` builds its own Payload instance (*"Pulling schema from database…"*) while the rest of
the suite is still hitting the dev server. The fix in this section covers it — warm `/admin` once
before starting the clock — but the timeout to raise is `beforeAll`'s, not just the two assertions'.

Two things follow. A 500 in this suite is not evidence of a broken page until it reproduces — check
the ratio of 200s to 500s for that route in `.dev.log` first. And the `Ecmascript file had an error`
line that appears nearby is a red herring: it is the pre-existing Edge-Runtime warning about
`instrumentation.ts` calling `process.exit`, which is logged on every recompile and is unrelated.

**Widened 2026-08-18: the link crawl itself does it too.** During the FAQ pass, a full run reported
*"Links › every internal link resolves"* as the failure, with the three specs behind it skipped by
serial mode — the same `1 failed / N passed / M did not run` shape described above, just one spec
earlier. It passed in isolation immediately afterwards (43s) and the very next full run was
**19/19**, including that spec. So the fault is not specific to the admin bundle: any spec can draw
the short straw when the dev server is compiling on demand under a crawl. That also means the
"failing spec" name in a report is not diagnostic, and a single red run here is not evidence of a
regression until it reproduces.

Left alone because it is a test-harness fault with no user-facing effect, and widening the scope of
a content-rendering pass into the admin suite is how unrelated changes get bundled into one commit.

---

## 3. The three template hero types render their title at 400

`High impact` / `Medium impact` / `Low impact` are Payload-template heroes that were never designed
for VERIFY. They render their title through `RichText` with prose enabled, and `tailwind.config.mjs:12`
sets `h1 { fontWeight: 'normal' }`, so the title computes **400** — visibly unstyled next to the two
heroes that are designed. No reference page uses one, and **0 of 61 pages** have one selected. But
the Type dropdown offers them, so an editor can pick one tomorrow.

### Why it was not removed in the hero-weight pass — the interesting part

Removing the three options looks free. It is not, and the attempt is worth recording because the
cost is invisible until you try it.

`hero.type` is stored as a **Postgres enum** (`enum_pages_hero_type` and
`enum__pages_v_version_hero_type`), so dropping options rewrites the type on both tables. The dev
push attempted exactly that and failed:

```
Failed query: ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type"
  SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING …
22P02  enum_in
```

**Because rows still hold a removed value, and the live table is not where they are.** Measured:

| Table | Contents |
|---|---|
| `pages.hero_type` | 59 `pageHero`, 2 `homeHero` — **clean** |
| `_pages_v.version_hero_type` | 411 `pageHero`, 8 `homeHero`, **62 `lowImpact`** |

Those 62 are template-era draft history for pages that are `pageHero` today. So the removal needs a
data migration — `UPDATE _pages_v SET version_hero_type = 'pageHero' WHERE version_hero_type IN
('highImpact','mediumImpact','lowImpact')` — before the enum can narrow, and the same must run on the
box, where the count will differ. That is a write over version history bundled into the single
hand-reviewed pre-deploy migration, in exchange for a tidy-up nobody asked for. Reverted.

The failure is atomic (the enum and all 481 rows were intact afterwards) but not quiet: while the
config was in that state, `getPayload()` threw on init and **every page 500'd** with a
`generateStaticParams` stack trace. See the matching trap in `CLAUDE.md`.

**The fix, after the deploy:** count both tables, add the `UPDATE` to the generated migration ahead
of the enum change, remove the three `options`, delete `src/heros/{HighImpact,MediumImpact,LowImpact}/`
and their entries in `RenderHero.tsx` (which already returns `null` for an unknown type), and narrow
the `media` field's condition. Leave `hero.richText` declared with `condition: () => false` unless
you also want to drop a column that holds data on **26 live pages and 411 version rows** — that is a
sixth and seventh `DROP COLUMN` and §1B says to stop at five.

---

## 4. `.contact-form` padding follows the reference's superseded rule

Found by the sweep described in `CLAUDE.md` (the design reference declares most rules twice; the
page's inline `<style>` is the one that renders). The reference's shared sheet and the build both say
`padding: 40px`; one page's inline block says `28px 24px`.

Left alone deliberately: **one** page is not enough to call the inline value the intended norm, where
`.page-hero h1` had nine pages agreeing. Someone who knows the design should say which is right. The
sweep found no third case — it compared every declaration across all three sources, not just the
seventeen in `verify-website-design-diff.md` §5.

**Narrowed 2026-08-18.** This does **not** affect `/specialists/join-expert-panel`, which was the
other page anyone was likely to check: it declares no inline `.contact-form` rule, so the shared
sheet's 40px governs there and ours matches it exactly — measured 40px on both sides while closing
Comparison 36. The open question is confined to the one page whose inline block says `28px 24px`.

---

## 5. Light-band breadcrumbs are darker and heavier than the reference

Found while adding the `specialist-profile` family to `referenceCssDiff.mjs` — mapping the breadcrumb
selectors rather than skipping them is what surfaced it, and no family had ever compared a
**light-band** breadcrumb before. The `events` family maps one, but that hero is dark, where our
tokens already match.

Measured on `/specialists/profiles/dr-adam-parr` at 1440px:

| | Ours | Reference |
|---|---|---|
| Link | `rgb(34, 34, 34)` | `rgb(115, 115, 115)` |
| Separator | `rgb(34, 34, 34)`, 12.48px | `rgb(176, 176, 176)`, 10.6px |
| Current item | `rgb(26, 58, 92)`, weight 700 | `rgb(65, 64, 66)`, weight 900 |

**Not a page quirk.** The reference is consistent about these values — `#737373`, `#b0b0b0` and
`#414042` appear **49, 23 and 46 times** across its pages — so ours is darker on *every* interior page
with a breadcrumb, not just this one.

**Cost of fixing:** three token values in the light `--bc-*` context (`globals.css:4189-4191`; the
dark override is at `:4235-4237`, and must move with it or the two go out of step), plus
the separator's `font-size: 0.85em`. Not a page-scoped override — scoping it would make this page
disagree with the rest of the site, which is the opposite of the point. It is one small edit and a
snapshot re-baseline, but it changes ~25 pages at once, which is why it is a decision and not a
tidy-up: someone should confirm the lighter, quieter trail is wanted before it lands.

Recorded per-declaration in `referenceCssDiff.mjs`'s `EXPLAINED` table under `specialist-profile`, each
entry pointing back here. That keeps the family at zero so it can still catch the *next* regression —
legitimate only because the entries say what the difference is rather than asserting equivalence.

---

## 6. Three dead rules on a BEM parent class that never reaches the DOM

Found while verifying Comparison 37, by splitting `/contact`'s class attributes into a set rather than
grepping for a substring.

`globals.css` scopes three rules to `.ct-page .ct-portal-card` — lines **9192**, **9211** and
**9212**. The bare class **is not in the served HTML**. Only the children are (`__head`, `__label`,
`__text`, `__btn`, `__features`), and `ct-page` itself is present, so the scoping is fine and only the
parent hook is missing. A substring grep for `ct-portal-card` reports it present, because every child
class contains that string — which is why it went unnoticed.

Nothing is visibly wrong, because a **separate live rule** supplies the same treatment:
`.ct-page .ct-enquiry-grid .ct-portal-card__btn` (line 10809) already sets the button margin and
full-width sizing.

**Why it is not simply "add the missing class":** the dead rule sets `margin: 12px 0 4px` where the
live one sets `margin-top: 12px`. Restoring the parent class would introduce a 4px bottom margin on
every portal-card button group and move the page. The safe fix is to **delete** the three dead rules,
which is a tidy-up with a snapshot re-baseline attached rather than a bug fix — hence recorded rather
than done inside a feature pass.

**Cost:** three lines deleted, one snapshot compare on `/contact` to confirm nothing moves. Worth
folding into the next `findDeadCss.mjs` sweep rather than doing alone.

---

## 7. A Service without a `linkOverride` would render a link to a page that does not exist

**Measured 2026-08-18.** The first version of this entry got the mechanism wrong in a way that
mattered, so the figures below are the measurement, not a recollection of it.

The `services` collection has **no public route** — there is no `/services/<slug>` page, and
`LINKABLE_COLLECTIONS` in `routes.ts` excludes it. The service pages a visitor sees are Pages.
`ServicesGrid` nonetheless offers **Link to service page** plus a `servicePathPrefix`, which together
build a `<prefix>/<slug>` href that would 404.

**What this entry first claimed, and why it was wrong.** It said *"every seeded grid sets
`linkToService: false`"*, and treated that as the protection. Neither half holds:

- **`/information-centre/for-clients` has `linkToService: true`**, published. One of five live grids.
- The protection is `hrefFor()` in `Component.tsx`, which prefers `linkOverride` and only falls back
  to the generated path when there is none. All **8** services on that grid carry an override, so
  every href on the page resolves to a real Page. Nothing is broken.

**The real, narrower risk:** **6 of 14 services have no `linkOverride`**. Four (`Brief Reduction
Service`, `Surrogate Assessment Service`, `Interpreter Booking Service`, `Letter of Instruction
Review`) sit only on grids with linking off, so they render as unlinked cards; two (`Educational
Services / AAMLE`, `Medical Negligence`) are on no page at all. Add any of them to the for-clients
grid — the one grid with linking on — and it renders `/services/<slug>` and 404s.

**There is a net.** `links.e2e.spec.ts` enumerates every page from the five sitemaps and asserts each
internal link resolves, so it would catch this. It has to be run, which is the whole of the exposure.

**Cost of fixing:** either drop the two fields and the code path (`linkToService` has exactly one
`true` in the database and it changes nothing), or keep them and hide the toggle when no route
exists. Either is a block-config change, a schema change for the dropped columns, and a snapshot
compare. The block's own comment still claims the collection drives "the dedicated service pages",
which is stale and should go with it. `ADMIN-GUIDE.md` §4 already tells an editor the card needs a
Link override.

---

## 8. One enquiry button is cased differently from the others

**Measured 2026-08-18**, across `/`, `/contact`, `/make-a-booking`, `/information-centre/for-clients`
and a specialist profile.

The availability grid's button reads **"Send enquiry"**; every form submit button reads **"Send
Enquiry"**. Same action, different casing. That is the whole of it — a one-word fix to
`SpecialistAvailability → labels.sendEnquiryLabel`, plus an unconditional repair, because it is
stored copy and a fixture edit alone would not reach an existing install.

**Two things this entry used to claim, both measured false — do not re-derive them:**

- *"Five different wordings for one thing."* They are four wordings for four different actions, which
  is correct differentiation rather than drift: **Make an Enquiry** opens the enquiry drawer, **Send
  Enquiry** submits a form, **Enquire →** is a service-card link (16 of them on `/services`), and
  **Contact Us** is the nav item.
- *"On the specialist profile the seed and the code fallback disagree."* Not visible. The
  `specialist-profile` global stores `Make an Enquiry` and that is what renders; the `Send Enquiry`
  fallback in `profiles/[slug]/page.tsx` only fires when the field is empty, which it is not.

---

## 9. The Join the Expert Panel intro is 2–4px off, on selectors ~29 pages share

**Measured 2026-08-19 at 1440/1100/900px**, after the benefit cards on that page were fixed
(`verify-website-design-diff.md` Comparison 39). The intro band above them still differs from the
reference in four places, and every one is a **shared** selector:

| Selector | Reference | Ours | Gap |
|---|---|---|---|
| `.section-label` margin-bottom | 14px | 12px | 2px |
| `.section-title` margin-bottom | 20px | 16px | 4px |
| `.section-title` font-size clamp | max 2.4rem | max 2.5rem | 1.6px at 1440, **0 at ≤1100** |
| `.vf-split__body p` line-height | 1.85 | 1.75 | 1.55px per line |
| centred subtitle `max-width` | 640px | 600px | 40px |

Each is a class every section heading, eyebrow or split body on the site uses, so closing any of
them to satisfy one page changes ~29 pages — the shape of the `.page-hero h1` mistake, which moved
59 pages and was written up as a *correction*.

**The cost of fixing it properly is one variant, not five edits.** `.vf-client-overview`
(`globals.css:9240-9241`, where the selector this entry calls `.section-title` is in fact
`.vf-split__title`) **already encodes exactly this treatment** — `font-size: clamp(1.7rem,3vw,2.4rem)`,
`font-weight: 800`, `margin-bottom: 20px`, plus `.vf-client-overview .vf-split__body p { line-height:
1.85 }` — as a page scope for `/for-clients`, whose reference intro is the same editorial pattern.
So the honest fix is a single shared "editorial intro" density on SplitFeature serving both pages,
which would also let that page scope be deleted. Roughly: one field, one rule block, a repair for
each of the two pages, and a `computedSnapshot` run to prove `/for-clients` does not move.

Not done now because the reported fault was the benefit cards, which are fixed and verified, and
because a second page-scoped class here would repeat the exact bug Comparison 39 was about.

Each difference is recorded per-declaration in `referenceCssDiff.mjs`'s `EXPLAINED` with its
measurement, so the `join-expert-panel` family reads zero honestly rather than by omission.

---

## 10. Three deliberate departures from the reference

**Decided 2026-08-19** (`verify-website-design-diff.md` Comparison 40). Both will read as *defects*
to anyone diffing `/events/upcoming-events` or `/events/past-events` against the reference, and the
`events` diff family reads **zero either way** — it compares declarations, not which branch renders
— so without this entry they will eventually be "fixed".

**1. A date calendar where the reference draws a photo placeholder.** The reference renders a blue
`Event Photo` box on every row. We render an outlined calendar glyph with the day and month, on the
listings *and* the `/events` hub cards. The reference's own `.event-list-calendar*` rules
(`events.css:749–806`) are dead in the reference — leftovers its JS never uses — which is how we came
to have them. For the same reason we do **not** draw the 3px accent rule that block declares
(`events.css:753`): the reference never renders it, and it had made the listing rows disagree with
the hub cards. That omission is in `referenceCssDiff`'s `EXPLAINED` for `events`.

Chosen because a placeholder box tells a visitor nothing while the date is the single most useful
thing about an event. It is only ever a **fallback**: uploading **Event photo** on the event shows
the photograph instead, in both places.

*To reverse it:* render `.event-list-photo` with a `<span>` label instead of `<EventCalendar />` in
the three call sites (`EventsExplorerClient`'s `EventRow` and `EventCard`, `ArchiveBlock`'s event
card), delete `src/components/EventCalendar/`, and delete the calendar CSS. The `.event-list-photo`
rules are already in globals.css and already match the reference.

**2. No pagination control on a single page.** The reference always draws `‹ 1 ›`; ours returns
`null` at `pages <= 1` (`EventsExplorerClient.tsx`, `Pagination`). Visible on `/upcoming-events`,
which has 2 events; `/past-events` has 14 and shows the control normally.

Chosen because a control that cannot go anywhere is noise. *To reverse it:* delete the
`if (pages <= 1) return null` guard — the rest of the component already matches the reference's
`renderPagination` verbatim, disabled arrows included.

**3. No hover effect on the booking-portal tiles.** *(Decided 2026-08-23,
`verify-website-design-diff.md` Comparison 51.)* The reference declares
`.portal-opt4-tile:hover { background: rgba(255,255,255,0.17) }`; we declare nothing, and removed the
`transition` with it.

Its tiles — Specialist Availability, Download CV, Sample Redacted Report — are non-interactive
`<div>`s in the reference exactly as they are here, so the hover promised a click that could never
do anything. There is no CV or sample report on this site and there will not be; those live behind
the booking portal. The band appears on 26 specialist profiles plus `/specialists`,
`/specialists/specialty-list` and `/specialists/specialist-panel`, so it was wrong in 29 places.

This is the reference failing to execute its own intent rather than us mis-porting it — the same
shape as its `ph-activity` icon that renders nothing. Nothing will flag a re-port: **no
`referenceCssDiff` family matches `.portal-opt4*`** (`specialist-profile` matches
`/^\.profile-(hero|avatar|…)/` only), which is why this entry and the comment in globals.css both
exist. Guarded by `frontend.e2e.spec.ts` → *"nothing that cannot be clicked reacts to the pointer"*.

*To reverse it:* restore the two declarations. But if the tiles ever become links, restore the hover
**and** rewrite that guard — it asserts they are not clickable, so it would otherwise be satisfied by
deleting the effect again.

---

## 10a. The portal tiles still read as instructions

"Download CV" and "Sample Redacted Report" are imperative labels on tiles that cannot be clicked.
Removing the hover (§10.3) stops them *looking* like buttons; it does not stop them *reading* like
one, and "Download CV" still names a file this site does not serve.

**Live today?** Yes. Raised on 2026-08-23 alongside the hover, with noun-phrase wording offered
("Live Availability", "Specialist CVs", "Sample Redacted Reports"), and **declined for now** — the
hover was the reported problem and the wording is a content decision.

**User impact:** a visitor may still try to click. Lower than before, since nothing responds.

**Cost of changing it:** none in code. The labels are rich-text fields an editor can edit — three on
the **Specialist Profile** global (which feeds all 26 profiles) and three on each of the three pages
carrying the Portal CTA block. No deploy, no migration.

---

## 11. Photo derivatives are PNG, which costs ~1.5 MB across two pages

**Measured 2026-08-19**, after the image-sizing fix (`verify-website-design-diff.md` Comparison 41).
Every route now serves a correctly-sized derivative, and the six heaviest routes fell from
**19,501 KB to 4,500 KB**. What is left is almost entirely format:

| Route | Now | Largest single image |
|---|---|---|
| `/` | 1732 KB | `Dr Timothy Doyle-15-600x600.png` — **477 KB** |
| `/specialists` | 2066 KB | `Dr Simon Perkins-15-300x300.png` — **148 KB** |

Payload generates each derivative in the **source's** format, and the specialist headshots were
uploaded as PNG. A 600×600 PNG photograph is ~477 KB where the same image as JPEG or WebP is ~30 KB —
PNG is lossless and simply wrong for photographs. The `<Media>`/next-image path converts to WebP
automatically, which is why `/about/team/<slug>` is only 66 KB; the plain-`<img>` sites cannot.

**Two ways to close it, both with a real cost:**

1. **Add `formatOptions: { format: 'webp' }` to the `imageSizes` in `src/collections/Media.ts`.**
   Config is a two-line change, but Payload only generates derivatives **on upload** — every existing
   media doc would need its file re-processed, locally *and* on the box, and there is no built-in
   "regenerate sizes" command.
2. **Re-upload the specialist headshots as JPEG.** No code at all, and an editor can do it, but it
   relies on whoever uploads next knowing to do the same.

Estimated saving: roughly 1.5 MB per visit across those two routes. Not done now because the
reported fault — a photo rendering pixelated — is fixed and verified, and because option 1's
regeneration step is a migration-shaped task that deserves its own pass.

The guard (`tests/e2e/images.e2e.spec.ts`) caps a single CMS image at **600 KB** specifically to
accommodate these PNGs; that ceiling should come down when this is closed.

---

## 12. The bundled homepage shield is a 1166px PNG in a 50px box

**Measured 2026-08-19.** `/assets/images/VERIFY Shield.png` is 73 KB at 1166px wide and renders 50px
on the homepage — **23.4× oversized**, the worst ratio left on the site.

It is a **bundled static asset**, not a Media upload, so `mediaSrc` has no derivatives to choose from
and `next.config.ts`'s `localPatterns` only permits `/api/media/file/**` through the optimiser. The
code path *does* size it correctly when Site Settings → Brand assets → Shield is set; it is unset, so
the fallback file is what renders.

Cheapest fix: upload a shield through Site Settings (then it is sized like everything else), or
re-export the bundled PNG at ~100px. Either is minutes of work; neither is code.

This is why the image guard scopes its ratio check to CMS-served URLs — including the static asset
would have meant either failing on day one or setting the threshold to 24×, which would excuse every
real regression.

## 13. Twelve of the twenty image placeholders still have no photograph

**Re-measured 2026-08-20.** The *mechanism* gap this entry used to describe is closed: page
photographs are now seeded from `public/assets/images/content/` by
`src/endpoints/seed/repairContentImages.ts`, so a filled placeholder survives a database rebuild.
Eight are done. **Twelve are still empty**, waiting on photography:

| page | placeholder |
|---|---|
| `/services` | Independent Medical Examinations · Joint Medical Examinations |
| `/services/medico-legal` | Everything a Matter Needs, Under One Roof |
| `/services/medico-legal/ime` | An Expert Medical Opinion, Independent of All Parties |
| `/services/medico-legal/jme` | One Specialist. Jointly Instructed by Both Parties. |
| `/services/medico-legal/reporting-services` | Supplementary Report · Expert Evidence · Teleconference · File Review |
| `/specialists/join-expert-panel` | A Specialist Partnership Built on Quality & Integrity |
| `/services` and `/services/educational-services` | the two AAMLE Education panels |

Nothing renders wrong — the pale-blue tile is the designed empty state, and each says "Image
Placeholder".

**Cost of closing one:** drop the file in `public/assets/images/content/` and add one entry to
`TARGETS` in the repair. Minutes each.

**The trap to avoid:** filling one through the admin instead. That works immediately and is lost the
next time the database is rebuilt — which is how the box is being deployed. The repair route is the
one that survives.

## 14. `public/media/` accumulates orphaned uploads across reseeds

**Measured 2026-08-19.** Seventeen copies of one headshot — `wes-lerch.png` through
`wes-lerch-16.png`, each with its own `-300x300` derivative — sit in `public/media/`, and exactly one
(`-15`) is referenced by a Media doc. Every reseed against a fresh database uploads again while the
previous files stay on disk.

Impact is disk only, and local only: ~35 KB per orphan, and a fresh install on the box uploads each
photo once. Nothing renders wrong, because the unreferenced files are unreachable.

Cost of fixing: a cleanup script that lists `public/media/`, subtracts every `filename` and every
`sizes.*.filename` recorded in the Media collection, and deletes the remainder. The risk is the
obvious one — it must enumerate from the database and not from a filename pattern, or it will delete
a file that is in use.

## 15. `.events-summary-section` is a faithful port that nothing can reach

**Measured 2026-08-20.** `globals.css:5104-5105` carries the reference's

```css
.events-summary-section { padding: 78px 0; }
.events-summary-section.bg-soft { background: #f6fbff; }
```

and **neither can ever match**. The reference gives its Upcoming and Past groups a `<section>` each;
we render both inside one `<Section>`, so the class never reaches the DOM — 0 occurrences in the
browser, with `.events-section-header` ×3 and `.events-card-grid` ×2 as positive controls that the
check could see the region at all. (`curl | grep` is useless here: those groups are client-rendered,
and it reports 0 `.events-card-grid` on a page showing eight.)

It is **deliberately left dead** rather than wired up. Adding `.events-summary-section` to our group
divs would apply `padding: 78px 0` to every group on all three events pages — 156px per group,
including the two single-mode child listings that have no second group and no reason to move. The
separator work (Comparison 45) therefore uses its own `.events-explorer-group--band` modifier, which
takes the same job with the padding we want.

**Cost of closing it:** delete the two rules. Held back because the `events` diff family compares
declarations and would then report them missing from the build, so it needs a `NOT_PORTED` entry with
this reason in the same pass — and because this repo has twice nearly deleted live CSS on a dead-code
verdict.

Checked rather than assumed, because the first draft of this entry got it wrong: `.bg-soft` is **not**
a live class used elsewhere. It appears exactly once in `globals.css`, inside the compound selector
above, and is emitted by no component. So both rules are dead together and neither has an
independent consumer — which makes the deletion simpler than the caveat originally claimed, not
riskier.

## 16. Two self-sectioning blocks are missing from `selfSpaced`, so they carry a stray 64px

**Measured 2026-08-20.** `CLAUDE.md`'s own rule for adding a block says: *"add to `selfSpaced` if the
component wraps itself in `<Section>` (otherwise it gets the legacy `my-16` wrapper at top level)"*.
Two do not follow it —

| block | slug | renders `<Section>` | in `selfSpaced` |
|---|---|---|---|
| EventsExplorer | `eventsExplorer` | `Component.tsx:104` | **no** |
| FeaturedArticles | `featuredArticles` | `Component.tsx:157` | **no** |

— so each is wrapped in `.my-16` and carries **64px of margin above and below its own Section
padding**. That is what supplied half of the 152px white strip between the /events band and the
footer (Comparison 45); the band case is handled by `.my-16:has(> .events-explorer--band-to-edge)`,
which is the same collapse `.my-16:has(> .ni-section)` already does for Archive bands, but the stray
margin is still there in every other case.

Checked, not assumed: an audit of all 36 block components for a `<Section>` render initially reported
**three**, including `ArchiveBlock` — a false positive, because its match was a *comment* saying
"the same band classes `<Section>` uses". It renders a plain `<div>` and is correctly excluded, as the
`.ni-section` collapse rule above implies.

**Cost of closing it:** two lines in `RenderBlocks.tsx`. Held back because it removes 64px top and
bottom from `/events`, `/events/upcoming-events`, `/events/past-events` and `/in-the-loop` — four
pages moving, none of which anyone has complained about, on a change nobody asked for. Do it behind a
`computedSnapshot` capture and expect a diff, rather than as a tidy-up.

---
## 17. An article is bylined to someone who is not on the team

`src/endpoints/seed/data/posts.ts` names **Evie Le** as an author. She is not among the 19 team
members the seed creates, and her photograph is staged for deletion in the same working tree — so the
byline names a person with no profile to link to.

**Live today?** Yes, on the seeded articles that carry that byline.

**User impact:** small and cosmetic — a name renders as plain text where the other authors' names
resolve to a team profile. Nothing 404s, because `teamPath` returns nothing to link to rather than
fabricating an href.

**Why it was not fixed here:** it is a content decision, not a defect. Either the article is
re-attributed to a current team member, or Evie Le is restored to the team data with a photograph.
Both are one-line changes to the fixture **plus a seed run**, and the seed only writes into an
absence, so an article whose author an editor has already changed will not be touched.

**Cost of fixing:** ~5 minutes plus a reseed, once someone says which way.

**How it was nearly lost:** this was tracked in `current-state.md`, and that section was deleted in
the same pass that deleted the photograph — leaving the inconsistency live and recorded nowhere.
Which is what this register is for.

---

## 18. The reference-diff exceptions rest on measurements older than the stylesheet

`tests/visual/referenceCssDiff.mjs` keeps three lists of deliberate exceptions — `NOT_PORTED`,
`IMPLEMENTED_AS` and `EXPLAINED`. Seven `EXPLAINED`/`NOT_PORTED` reasons cite a browser measurement
taken at 1440px on **2026-08-18** or **2026-08-19**. `globals.css` has changed by 164 lines since.

**Live today?** No — all 13 families read zero on 2026-08-21, before and after that day's edits. This
is a trap for a future reading, not a current fault.

**User impact:** none directly. The risk is to the tool's credibility: the file's own rule is that an
aged exception needs its measurement **re-run, not re-read**, and a skip justified by "verified equal
in the browser" was once false and hid **11 real spacing gaps** on `/services`.

**Cost of fixing:** ~45 minutes. Re-take the seven readings at 1440px with JavaScript disabled on
both sides, and either confirm the reason or close the difference. That is a design pass, so it was
not folded into a documentation one; a dated age warning now sits above `EXPLAINED` so nobody reads
those reasons as fresh.

---

## 19. Five blocks are on no page, so nothing reviews them

**Stats Band**, **Spacer**, **Divider**, **Icon** and **Image** are selectable in the page builder and
appear on no page of the site. They were only ever displayed together on `/style-guide`, removed on
2026-08-20 — correctly, since it was a developer page a visitor could reach.

**Live today?** Not a fault. The blocks work; they are simply unobserved.

**User impact:** none now, and a regression in any of them would reach production unnoticed —
`REVIEW-CHECKLIST.md` cannot list what no page renders, and `computedSnapshot.mjs` cannot measure it.

**Cost of fixing:** ~30 minutes for an unlisted, `noindex` style-guide page that is not in the nav or
the sitemap — which is close to what was just deleted, so it is a real decision rather than an
oversight to correct. Doing nothing is defensible: these are the five simplest blocks in the builder.

**Do not** put them on a real page to make the checklist tidy.

---

## 20. The toolbar colour swatch rides an `@experimental` Payload API

This entry used to say per-word colour was *not offered*, on the reasoning that
it had not been asked for. It was asked for — the first thing the editor said on
opening a card was "I can't change text colour though" — so it is built, and what
remains is the risk it carries.

The swatch is `TextStateFeature`, which Payload 3.85 marks **`@experimental`:
"There may be breaking changes to this API"**. It is registered once, in
`src/fields/richTextColorFeature.ts`.

**Live today?** Yes, and working. Not a defect — a dependency to keep an eye on.

**User impact if it breaks:** on a Payload upgrade the toolbar could lose the
swatch, or the feature could refuse to construct and take the admin with it.
Neither can damage stored content: what is written to the document is the bare
palette key (`{"$":{"color":"brand"}}`), never CSS. Content coloured today keeps
rendering even if the editor half disappears entirely, because the *reading* half
is ours — `nodeColorClass` in `src/components/RichText/shared.tsx` — and depends
on nothing but the shape of the JSON.

**Cost of containing it:** the exposure is two files and roughly twenty lines. If
the API moves, the swatch can be rebuilt against whatever replaces it, or dropped
back to the block-level **Text colour** dropdown, which uses no experimental API
at all. **What to actually do:** re-read
`node_modules/@payloadcms/richtext-lexical/dist/features/textState/feature.server.d.ts`
after any Payload upgrade, and run `tests/int/richTextColors.int.spec.ts`, which
constructs the feature and reads its props back — so an API change fails a test
rather than a page.

---

## 21. Enter in a heading makes a paragraph, not a line break, in the editor

Pressing Enter inside a one-line rich-text field creates a second *paragraph* in
the stored value. `InlineRichText` renders a paragraph break as `<br>`, so **the
page is correct** — the two-line lockups render exactly as they did when these
were textareas, verified in the database as a `linebreak` node and on the page by
`computedSnapshot`.

**Live today?** Only in the admin, and only as a mild oddity: the editor shows
two paragraphs where the page shows two lines of one heading.

**Cost of fixing — measured by writing it, not estimated.** The code itself is
about 40 lines: a `createClientFeature` plugin registering
`INSERT_PARAGRAPH_COMMAND` at `COMMAND_PRIORITY_LOW` and dispatching
`INSERT_LINE_BREAK_COMMAND`, its `createServerFeature` half, a line in
`inlineRichTextField`, and a `generate:importmap` run. It compiles and reads
cleanly.

What stopped it is the dependency. `lexical` and `@lexical/react` are **not
installed** — Payload vendors them, and pnpm does not hoist them — so the feature
needs both added to `package.json` and **pinned to the version
`@payloadcms/richtext-lexical` vendors** (0.41.0 today). Two copies of Lexical in
one bundle is a subtle and unpleasant failure, and the pin has to be re-checked on
every Payload upgrade. That is a standing maintenance cost for an editing nicety
whose rendered output is already correct, so it was not taken.

If it is ever wanted: add the two packages at the exact vendored version, and add
a guard that fails when they drift from it.

---

## 22. Payload boots in ~7 seconds, and that is now load-bearing

Measured 2026-08-21: `getPayload()` takes ~7s against the local database, up from
the low single digits, because the config carries 585 rich-text fields and each
one generates a Lexical editor config.

**Live today?** In development and in tests, not for visitors — the production
server boots once.

**User impact:** two integration specs that boot Payload exceeded vitest's 10s
hook timeout and were reported as **skipped**, not failed. The suite went green
while checking nothing. Their timeouts are 30s now, but the number will keep
creeping.

**Cost of fixing:** unknown, and probably not worth chasing until it bites. The
thing to watch is the *admin* rather than the boot: a page with 30 blocks now
renders many more Lexical editors than it did. Time the heaviest page's admin
load before assuming it is fine.

---

## 1. The catch-up migration, abandoned

**Superseded on 2026-08-20 and kept only as a record.** This entry used to be a 215-line procedure
for taking the **live** database from the checked-in baseline to the current shape with one generated
catch-up migration. That is no longer the plan: the box is being wiped and rebuilt, so the move is a
**fresh baseline** — delete `src/migrations/`'s baseline, empty its index, and generate one
`CREATE TABLE` migration against an empty database. **The live procedure is `current-state.md` §1.**

Deleting it rather than leaving it was the point. Its pre-flight told the operator to confirm
*"exactly five `DROP COLUMN` statements … anything else dropping is a mistake — stop and
investigate"*. Re-measured 2026-08-21, the working tree drops **twelve** columns, every one of them
deliberate:

```
_pages_v.version_hero_scroll_hint          pages.hero_scroll_hint
_pages_v_blocks_people_grid.department     pages_blocks_people_grid.department
_team_v.version_department                 team.department
article_settings.labels_breadcrumb_home_label
team_settings.labels_breadcrumb_home_label team_settings.labels_role_label
specialist_profile.breadcrumb_breadcrumb_current_label
testimonials.author_name                   testimonials.avatar_id
```

Six of those are the department columns moving from a hardcoded select to the Departments taxonomy —
a *change of shape*, not a loss. An operator following the old instruction would have stopped a
correct deploy on the strength of a number that went stale under it. That is the failure mode this
register exists to prevent, which is why the whole procedure went rather than being annotated.

**Two things in it survive the change of plan**, because they are about how Payload generates SQL and
not about which migration you generate:

- **`migrate:create` will not warn you.** The *"Accept warnings and push schema to database? (y/N)"*
  prompt exists only in the **dev-push** path (`pushDevSchema.js`), which runs during local
  development. `migrate:create` writes the SQL silently, `DROP COLUMN`s included. **Read the
  generated file**, every time.
- **A `varchar → jsonb` conversion needs its `USING` clause**, and a generated migration does not
  carry one. `ProcessSteps.description` was converted locally with a paragraph-splitting expression
  checked in verbatim at **`src/migrations/REFERENCE-processSteps-richtext.sql`** — inert, because
  `src/migrations/index.ts` registers migrations explicitly rather than scanning the directory. A
  bare `ALTER COLUMN … TYPE jsonb` fails outright on a non-empty table, and `USING description::jsonb`
  is worse: it errors on the first row, because the values are prose, not JSON. A fresh baseline on an
  empty database sidesteps this — but the moment there is data, it applies again.

**Cost of the fresh baseline:** ~20 minutes, and it is the deploy's critical path. The measured drift
against the old baseline — 3518 columns against 3207, 308 tables against 301, 1295 indexes against
946, with 323 columns added and the 12 above removed (2026-08-21) — is now only useful as a sense of
how far the two had diverged. `current-state.md` §1 carries the live numbers and the commands that
re-take them.
