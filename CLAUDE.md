# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

VERIFY Medico-Legal Solutions website — Next.js 16 (App Router) + Payload 3 (Postgres), `pnpm`,
Tailwind 4. Started from the Payload website template; heavily extended into a CMS-driven
page-builder for the VERIFY brand.

Payload API questions: read `.claude/skills/payload/SKILL.md` first, then
`.claude/skills/payload/reference/` for the detailed docs.

`OUTSTANDING.md` (repo root) is the register of known-imperfect things that were deliberately not
fixed, each with measured impact and the cost of fixing it. Check it before assuming something is an
oversight — and keep it true: delete an entry when it is fixed, add one whenever you knowingly leave
something undone.

## The records, and the rule for all of them

Ten documents describe this repo to someone who was not there. **A change lands in all the ones it
touches, in the same pass, or the set starts lying** — and a reader cannot tell which one is stale.

| File | Holds | Reader |
|---|---|---|
| `HANDOVER.md` | Standing a box up from nothing, and the handful of traps worth knowing on day one | Whoever inherits the project, having never seen it |
| `CLAUDE.md` | Architecture, invariants, traps | Whoever changes the code |
| `OUTSTANDING.md` | What is knowingly imperfect, and what fixing it costs | Whoever inherits it |
| `README.md` | Running, testing, deploying, and where images go | Whoever maintains it |
| `src/Styles/HOOKS.md` | Every editable control and where it lives | The non-technical editor |
| `ADMIN-GUIDE.md` | What every item in the admin sidebar **is**, and what feeds off it | ditto |
| `REVIEW-CHECKLIST.md` | Every page and block, in render order, to tick through | Whoever is doing the manual review |
| `verify-website-design-diff.md` | The design-reference audit for **every page**, numbered `Comparison N` | Whoever asked for the work |
| `HOMEPAGE-CHANGES.md` | The **homepage** audit only — one dated pass against `index.html` | ditto, for that one page |
| `current-state.md` | Status *now*: what works, what is open, how to get it onto the box | Whoever is driving the work |

It said **seven** while listing seven and `REVIEW-CHECKLIST.md` already existed unlisted — the rule
this section states, broken by the section itself. It went to nine with `ADMIN-GUIDE.md` and the
checklist that was always there, and to **ten** with `HANDOVER.md`.

`HANDOVER.md` and `README.md` are the pair most likely to be confused, and the split is by reader,
not by topic. **`README.md` is for whoever maintains it** and assumes the project is already
running. **`HANDOVER.md` is for someone who has never seen the repo**: how to get from an empty box
to a serving site, what the environment variables cost when wrong, and the small number of traps
that will otherwise eat their first day. Where they touch — deploying, testing — `HANDOVER.md` gives
the short path and points at `README.md`, rather than restating it.

`ADMIN-GUIDE.md` and `src/Styles/HOOKS.md` share a reader and must not share content. HOOKS.md owns
*"how do I change how this looks"*; ADMIN-GUIDE.md owns *"what is this thing and what feeds off it"*.
Where they touch — the Events recap fields, the specialist qualification icons, the Site Settings
enquiry form — cross-link, do not restate.

The last two are easy to confuse, and the table used to list only `HOMEPAGE-CHANGES.md` — which was
wrong, because every design pass since Comparison 25 has gone into `verify-website-design-diff.md`
and the table did not name it at all. A page pass belongs in `verify-website-design-diff.md` as the
next numbered `Comparison`. `HOMEPAGE-CHANGES.md` is closed history for one page; do not append to it.

`current-state.md` is the newest and the most fragile. It is a **snapshot**, so it holds no
architecture, no invariants and no editor instructions — only status, and pointers to whichever of
the other five owns the detail. That makes it the easiest to let drift and the worst one to leave
stale, because it is what people read to decide whether something still needs doing. When an item
there is fixed, **delete the item** rather than annotating it; the history belongs in `git log` and
`HOMEPAGE-CHANGES.md`. Two numbers in it are measured and go out of date silently — the test counts
and the schema drift — so re-measure rather than edit around them.

This has failed once already, and quietly: the image pass was written up in its published artifact
but **not** in `HOMEPAGE-CHANGES.md`, which went on claiming two finished items were "still
outstanding" until someone re-read it. If a pass is mirrored to a published artifact, update the
file and the artifact together — the artifact is a copy, never the source.

## Invariants

> **Nothing fails silently. Nothing appears to work when it doesn't.**

This site is handed over to people who do not write code. A control that looks editable and
isn't, a form that says "sent" and discarded the enquiry, a link that renders as nothing — all
of these are worse than a visible error, because nobody finds them and nobody can report them.
Every rule below is here because that failure already happened once in this repo.

| Rule | What went wrong without it |
|---|---|
| **Never report success a request did not confirm.** A form that cannot reach its backend says so and disables submit; it does not locally acknowledge. | The enquiry drawer used to `setStatus('sent')` whenever the form lookup had not resolved — visitors were thanked and the enquiry was discarded. |
| **A field an editor can set must be read, or hidden by `admin.condition`.** No control that silently does nothing. Guarded by `tests/int/adminControls.int.spec.ts`. | A page hero's `media` upload was ignored unless "image panel" was ticked; `SpecialtyGrid.columns` did nothing in checklist mode; `AvailabilitySessions.notes` said "shown with the slot" and was rendered nowhere. |
| **`src/utilities/routes.ts` is the only place a document path is built** — including `generatePreviewPath`. A `null` return means render it unlinked or as plain text, never a fabricated href. | Five copies of a collection→prefix map drifted apart. The last one sent draft Preview to `/posts/<slug>`, which 404s. `Card` interpolated an undefined `relationTo` into `/undefined/<slug>`. |
| **Globals whose links can point at Posts are read at depth 2.** A Post's `stream` is one relationship deeper than the link itself. | At depth 1 `postPath` returned null and `CMSLink` returned null, so a header nav item to an article rendered as *nothing* — the nav just looked short. |
| **Seed `ensure*` helpers return their id in both branches**; repairs go outside the early-return. | `ensureForm` returned `void` and bailed when the form existed, so any repair built on it could only ever run on a virgin database. `site-settings.enquiryForm` was never set, and the enquiry drawer was disabled site-wide on every install. |
| **Never call `revalidatePath`/`revalidateTag` from `next/cache` directly.** Use `safeRevalidatePath` / `safeRevalidateTag` from `src/utilities/safeRevalidate.ts`, and honour `context.disableRevalidate`. | Next 16 throws when either is called outside a Server Action or route handler, and Payload runs `afterChange` *inside the transaction*. Building the **Create New** form state tripped it, so `/admin/collections/pages/create` rendered the sidebar and **no form at all** — zero inputs, HTTP 200, nothing in the browser console. No page or post could be created. Same for CLI and job writes, where the throw rolls the write back. |
| **Never pass a named cacheLife profile to a tag purge.** `safeRevalidateTag(tag)` takes no profile and always sends `{ expire: 0 }`. Guarded by `adminControls.int.spec.ts`. | Every purge in the repo used to pass `'max'`. Given *any* profile Next sets `stale = now` but `expired = now + expire*1000` — and `max`'s expire is a **year**, which `areTagsExpired` (`expiredAt <= now`) never satisfies. So the tag went stale-while-revalidate instead of expiring. Measured under `next start`: after saving a Design System token, the editor's **first reload served the old value**, and three quick edits left the page two versions behind. Related: a tag purge only reaches the manifest of the process that calls it, so a `payload run` script cannot purge a separately running server. |
| **`308` only for moves that will never change again.** Anything whose destination an editor can change is `307`. | `/posts/<slug>` 308'd to a stream-derived URL; browsers cache that forever, so reassigning an article's stream stranded everyone who had followed the old link. |
| **A collection with autosave drafts creates a document when the Create New form is *opened*.** Anything that visits `/admin/collections/<x>/create` must delete what it made. | `admin.e2e.spec.ts` opens the Pages create form every run, so the suite left one empty draft behind each time — **72** had accumulated locally, and the Pages list was unusable to look at. Its own assertion is the tell: it expects a document *id* in the URL, which is only possible because autosave already wrote one. It now records that id and deletes it in `afterAll`, beside the existing `cleanupTestUser`. Proven both ways — 72→73 on a run before the fix, 73→73 after. |
| **Delete documents through Payload, never with SQL.** `_pages_v.parent_id` is `ON DELETE SET NULL`, not CASCADE. | A raw `DELETE FROM pages` over 72 empty drafts would have left **144** version rows pointing at nothing — invisible in the admin, and waiting to confuse a later migration. Payload's own delete removes the versions with the document; measured 0 null-parent rows in `_pages_v`, `_posts_v` and `_events_v` afterwards. |
| **zsh does not word-split an unquoted `$var`.** A `for id in $ids` loop over newline-separated ids runs **once**, with every id concatenated. | A delete loop over 73 ids fired a single request to `/api/pages/97\n64\n69…`, got HTTP 000 and removed nothing — while the same loop over a one-id list worked, so two of the three collections succeeded and it looked partially fine. Use `while read -r`. Same family as the `--include=*` glob trap already recorded. |
| **The admin sidebar's group order is derived from `payload.config.ts` array order**, not declared. Groups appear in order of first appearance while scanning `collections` then `globals`. That array also has to keep taxonomy lookups ahead of the content referencing them — both constraints at once. | Assigning tidy `admin.group` names left the sidebar in an arbitrary order (Media second, Reference after Availability) because nothing declares it. Reordering the array is the only lever, and it is the same array carrying the taxonomy-first rule.
| **`CMSLink` is imported by client components, so it cannot be async.** A link type needing a server lookup is resolved by the *block*, and offered only on blocks that resolve it (`link({ portalEnquiry: true })`). | Making it async would break `HighImpact`, `Header/Nav` and `Header/Component.client`. Offering `portalEnquiry` on every block instead would give an editor a type that renders an inert `data-link-unresolved` span wherever nothing resolves it — a control that can be set and silently does nothing. The resolver's return type narrows `type` to CMSLink's union, so a block that forwards raw links fails to compile; both call sites errored with `'portalEnquiry' is not assignable` before they were wired. |
| **A component that hardcodes `appearance="inline"` must have `appearances: false` in its config**, or read `.appearance` itself. | `CMSLink` destructures `appearance`, so a literal after `{...link}` wins and the editor's stored choice is discarded. |
| **Queries against draft-enabled collections pass `overrideAccess` explicitly.** The Local API defaults to `overrideAccess: true`. | A legacy `/specialists/<slug>` URL matched *unpublished* specialists and 308'd to a profile that 404s — while its own comment claimed it checked for published ones. |
| **After any collection/global field change:** `pnpm generate:types` locally, `migrate:create` + `migrate` on the box. Dev auto-push hides schema drift. | The checked-in baseline silently fell behind by ~29 FK columns plus several new fields. |
| **A guard that has never failed is not evidence.** Every test in `adminControls.int.spec.ts` records the deliberate break used to prove it goes red. Re-run it if you change the test (`zsh tests/int/prove-guards.sh`). | Three of four guard patterns were structurally incapable of failing — one asserted an array it never wrote to — and "94/94 passing" was reported as proof the work was sound. |
| **A helper takes the narrowest input that answers the question.** Don't accept a wide all-optional shape and return several answers; a caller holding a partial object will get a confident answer to a question it supplied no data for, and TypeScript will not object. | `eventTiming()` accepted `{date?, registrationClosesAt?}` and returned both `isPast` and `registrationOpen`. The events listing passes an `EventItem`, which has no `registrationClosesAt` — it compiled, and a wrong `registrationOpen` sat there waiting to be read. Split out `isEventPast(EventDateInput)`. |
| **A "read this field" check must not count code that *writes* it.** | The orphan-field guard's haystack included `src/endpoints`, where the seed writes `{ hoursNote: '…' }`. That looks identical to a read, so every seeded field appeared consumed — measured: deleting the only renderer of `Offices.hoursNote` still passed. |
| **An in-page anchor link is two halves: the link *and* the target.** Fixing one without the other is invisible. Guarded by `tests/e2e/links.e2e.spec.ts`. | The homepage's Videolink link was corrected to `#videolink-appointment` and the guide still opened on In-Person — the anchor ids had never reached the database, because `seedInfoBooking` early-returns on an authored page. The href looked right in every check that read hrefs. |
| **Content links live in the database, so a seed edit alone fixes nothing.** Pair every link correction with an unconditional repair (`src/endpoints/seed/seedLinkRepairs.ts`, run from `seedVerify`). | The seed had *already* been corrected to canonical paths. Every existing install, the box included, still served the old ones: 30 links across 9 pages on flat legacy paths that only resolved through a 308. |
| **"Has this been written yet?" is answered by `isUnauthored` (`src/endpoints/seed/authored.ts`) — never by counting blocks.** A repair writes only into an *absence*: a missing block, a superseded string, an empty field. Guarded by `tests/int/seedAuthored.int.spec.ts`. | All the `authorPage` guards asked `layout.length > 2`, which is a proxy for "looks substantial", not "someone wrote this" — so **13 of 27 pages** were rewritten from the fixture on every seed run, discarding editor changes. Proven: the events hero was reworded to `EDITOR WORDING TEST`, the seed re-run, and the fixture wording came back. The correct predicate already existed as `isPlaceholderLayout`; today it has one direct call site (`src/endpoints/seedVerify.ts:798`) plus its use inside `isUnauthored` itself. `tests/int/seedAuthored.int.spec.ts` asserts **six** files define `authorPage` — the seventh copy is inlined in `seedHomepage` — and its comment records that this control is what caught a guessed number, so trust the spec over any count written here. |
| **For a file, "absence" means the stored bytes differ from the source — not that the field is empty.** Media is deduped by `alt`, and Payload suffixes the stored filename on collision (`wes-lerch.png` → `wes-lerch-15.png`), so `filesize` is the only reliable disk↔database link. | The photo backfill guarded on `if (rec.photo) continue`, the team lookup hardcoded `${slug}.png` so a JPEG never matched, and `getOrCreateMedia` matched on `alt` and handed back the *old* doc. Three independent reasons a replacement photo committed to `public/assets/images/` changed nothing, none of which logged anything, on a seed run that reported success — covering all 26 specialists and 14 of 19 team members. Replace the file **in place** on the existing doc (`payload.update({ filePath })`): the id, alt, focal point and zoom survive, every reference updates at once, derivatives regenerate, and PNG alpha is preserved. |
| **A field with a `defaultValue` cannot be used as a migration signal.** To detect "this document predates the change", key on a *new* field that declares no default. | A repair meant to fire once keyed on all four new fields being unset. A new column does not arrive null when its field has a default: the adapter emits `ADD COLUMN … DEFAULT`, which Postgres backfills into every existing row. Measured before the repair had ever run, the block already read `spaced/default/check` — indistinguishable from an editor's choice, so the repair would never have fired at all. `placeholderIcon` (no default) was the only genuine absence available. |
| **An id a link can target must be in the server HTML, and the id and the link must come from one function** (`src/utilities/headingId.ts`; opt in per `RichText` with `headingIds`). Assigning ids in a `useEffect` is too late for the browser and too late to be worth doing. | Article heading ids were assigned by `ArticleToc` on mount, so a *pasted* `…/article#section` URL found nothing and stayed at the top — the browser resolves a fragment while parsing. Restoring that mount loop as a test break confirmed it: `scrollY 0`, heading still resting at y=972. The two slugify copies (one for the contents hrefs, one for the ids) were also free to drift, and a drifted pair renders perfectly and does nothing. |
| **A nav that hides an item for a sibling section decides emptiness through the SAME query the section runs.** Extract the block's filter to a `query.ts` beside it (`src/blocks/*/query.ts`), consumed by the block to fetch and by `src/blocks/sectionEmptiness.ts` to count. | The sticky Section Nav on `/in-the-loop` drops the tab of any section that renders nothing. Two copies of "which posts does this list" are free to disagree, and the failure is silent in both directions — a tab pointing at a section that is not there, or a live section with no way to reach it. Exactly how the five copies of the collection→prefix map in `routes.ts` drifted, and how three byte-identical event-type label maps nearly shipped a blank badge. The alternative — the client dropping pills whose `#id` is missing — cannot drift either, but costs a visible flash of tabs that then vanish and does nothing with JavaScript off. |
| **A walk over a block tree guards `Array.isArray` on EVERY child key.** Block field names are not unique across configs, so a key that holds children on one block holds a scalar on another. | `columns` is the Row block's array of columns *and* Archive's/ResourcesGrid's "how many per row" select, where it is the string `'3'`. `flattenBlocks` read it without the guard and threw `flatMap is not a function`, 500-ing `/in-the-loop` — the runtime form of the shared-field-name hole already recorded for the orphan-field guard. The neighbouring repairs in `src/endpoints/seed/` had the guard; the new helper was written from the same shape and lost it. |
| **A field an editor types words into is rich text; a field a machine reads is not.** Convert with `inlineRichTextField`, render with `InlineRichText`, and where a value is also read — an `aria-label`, an iframe `title`, a search haystack, a `{count}` template — flatten it with `richTextToPlain` at that point rather than refusing to convert the field. Guarded by `tests/int/proseFields.int.spec.ts`, which fails on any plain text field with no recorded reason. | Staff came from WordPress and could not bold a word. Two fields even claimed they could: AudiencePathways' step lead-in described itself as *"Bold step lead-in"* and LeadershipSpotlight's tagline as a *"Short italic pull-quote"*, both on plain inputs. |
| **Payload ACCEPTS a plain string in a rich-text field and stores it verbatim.** Nothing validates it. The seed's writes therefore go through `seedCreate`/`seedUpdate` (`src/endpoints/seed/seedWrite.ts`), which lift strings using the sanitised config; guarded by `tests/int/seedWrites.int.spec.ts`. | Measured with a probe: `payload.update({ heading: 'PROBE STRING VALUE' })` was accepted and came back out of the `jsonb` column as a string. The front end even rendered it, because `InlineRichText` takes both. The only place it showed was the admin, where the field would not open. |
| **An empty rich text is a TRUTHY object.** Every `if (!heading)` and `x \|\| 'Default'` guarding a converted field has to become `hasRichText(x)`. | Nine block components guarded their header with `Boolean(eyebrow \|\| heading \|\| subheading)`. Converted, that is permanently true — every blank header would have started painting an empty band, on every page. |
| **A `defaultValue` on a rich-text field must be a FUNCTION.** `richTextDefault('…')` returns one. | Payload writes a literal default into the DDL. A string default produced `"heading" jsonb DEFAULT 'What Sets Us [[Apart]]'`, which Postgres rejects as invalid JSON; the correct Lexical object produced an *unescaped* JSON literal, so the apostrophe in "Minimising Your Client's Report Costs" closed the SQL string and killed the `CREATE TABLE` with a bare syntax error naming the table, not the field. |
| **The compiler cannot see a component that declares its own `string` props.** `RenderBlocks` spreads a block loosely, so the lie stays inside the file and surfaces as a failed production build naming a *page*, or as React error #31 during hydration. Sweep for raw renders instead of trusting `tsc`. | `/events` returned HTTP 200 with complete, correct server HTML and then died hydrating, leaving 11 rendered nodes where there had been 425. `/specialists/specialty-list` and three profile pages each failed a build the same way, one at a time. |
| **A field a SHARED HELPER supplies is invisible to the orphan guard unless the guard reads the helper.** `declaredFieldNames` scans a block's own `config.ts`; anything arriving through `...sectionHeaderFields` is declared in `blockFields.ts` and was never in the set being checked. It resolves the bundles now (`HELPER_BUNDLES`, derived from the module so it cannot drift), guarded by the `A-bundle` case in `prove-guards.sh`. | `textColour` was added to `sectionHeaderFields`, appeared on **26 blocks**, saved to Postgres — and **not one component passed it on**. `SectionHeader` declares a `colour` prop and a grep for `colour=` across `src/blocks`, `src/heros` and `src/components` returned exactly one file: `SectionHeader` itself, defining it. Every editor on every section heading could pick a colour and watch nothing happen, for as long as the suite reported green. Fixing the guard immediately found a **second** case in the same shape — `SpecialistDirectory.subheading`, whose own component comment says "there is no subheading" — now hidden with `admin.condition: () => false`, which is the other half of the invariant. Third instance of this family, after the common-name hole (`icon`, `title`) and one name serving two purposes in one file. |
| **A hover effect belongs only on something that can be clicked.** A pointer response is a promise; on a `<div>` with no link in, on or around it, the promise is broken by design. Audit with `tests/visual/findFalseHover.mjs`; the portal case is guarded by `frontend.e2e.spec.ts`. | The booking-portal band's three tiles — Specialist Availability, Download CV, Sample Redacted Report — brightened on hover and did nothing, on 26 specialist profiles plus three pages. They are non-interactive `<div>`s **in the design reference too**, which still declares `.portal-opt4-tile:hover`, so a faithful port inherited the reference's own mistake. Nothing could have caught it: `computedSnapshot` never fires a hover, a declaration diff cannot tell a `<div>` from a link, and **no diff family matches `.portal-opt4*`** — a third instance of the `match`-regex trap, on a page whose family reads zero. |
| **A third-party widget script that initialises once per page load is incompatible with client-side navigation.** Assume it cannot be re-run, and design a visible fallback rather than reaching into its internals. Guarded by `tests/e2e/tryBooking.e2e.spec.ts`. | TryBooking's `widget.js` scans for `.tryb-widget` at `load`, sets a private `trybWidgetsInitialized` global, and exposes no re-init API — so a div React inserts during a soft navigation never renders, and re-adding the script does nothing. Measured in a browser: a widget added after `load` got no iframe at all. The block therefore renders a booking **link** that is hidden only on confirmed success; the degraded state is designed, and asserted, rather than chased. |
| **A cross-origin iframe that was REFUSED still exists as an element, with a height.** "An iframe appeared" is therefore not proof an embed worked; wait for a `postMessage` from its origin, which a frame that never loaded cannot send. | TryBooking's embed sends `frame-ancestors 'self' https:` and so is refused over `http` — the dev server. The iframe element was still created at **380px** (against 1324px when it works), holding a `chrome-error://chromewebdata/` document. A first probe read `iframe: true` and reported success; the page was in fact showing the browser's "refused to connect" panel. Keying the fallback on that would hide the booking link exactly when a visitor needs it. |
| **A generated identifier that exceeds Postgres's 63-character limit makes the schema never settle.** Drizzle names a foreign key `<table>_<column>_<reftable>_id_fk`; if that exceeds 63, Postgres truncates, Drizzle never finds the name it wants, and it drops and recreates the constraint on EVERY boot. **Budget the column name before adding a relationship to a block**: 63 − the `_pages_v_` table name − the referenced table − `_id_fk` − 2 separators. For a People Grid field that is **12 characters**. | `PeopleGrid.assessmentType` yielded `_pages_v_blocks_people_grid_assessment_type_id_assessment_types_id_fk` — 69 characters. Fixed by renaming the field to `asmtType` (column `asmt_type_id`, 12), which lands the name on exactly 63 and untruncated; **the proof is the oid holding still across three boots**, not the arithmetic. Measured: the constraint's oid changed on each `getPayload()` (1674921 → 1674968 → 1675016), and because vitest boots Payload per test file in parallel, two boots racing that DDL fail with `42704 undefined_object`. It read exactly like a flaky test and was twice dismissed as "the environment"; `pnpm test:int` failed 1–2 runs in 3 and now passes 5 in 5. `dbName` is **not** available as a fix — Payload 3.85 rejects it on a relationship field and the build fails to type check. See `OUTSTANDING.md`. |
| **A listing block with no filter set is not "showing everything" — it is showing whoever sorts first, under a heading that promises a selection.** A filter an editor never set looks identical to one that does not exist. Guarded by `tests/e2e/specialistCarousels.e2e.spec.ts`. | `PeopleGrid` builds no `where` clause when its filters are empty, so it returned the first N specialists by drag order. The homepage's *Meet Our Expert Panel* was the alphabet, and /jme's *Specialists Who Conduct JME Assessments* listed ten people of whom **three** were tagged for JME while five who were tagged were absent — for as long as the page had existed. The data to answer it was already there (`assessmentTypes`, 8 tagged); the block simply offered no filter on that axis, so no editor could reach it. |
| **A block that returns `null` on an empty result deletes its whole band, silently — so any filter added to one MUST be paired with proof that something matches.** Assert a non-zero count first; a set comparison alone passes perfectly against an empty page. | `PeopleGrid` ends `if (cards.length === 0) return null`. Ticking "Only featured specialists" while `Specialists.featured` was `false` on all 26 would have removed the homepage carousel, its heading, its subheading and both footer buttons — no error, no empty state, nothing in the console. `repairFeaturedSpecialists` therefore writes the flags **before** the filter and refuses to set the filter at all if the count is zero, and the e2e asserts the count before the membership. |
| **A field destructured from props and then never used passes the orphan-field guard.** `readsField`'s destructuring alternative is satisfied by the destructure itself. Measured, not assumed. | Deleting the entire `assessmentType` query from `PeopleGrid/Component.tsx` left `assessmentType,` in the props destructure — Pattern A **stayed green**, `tsc --noEmit` passed, and ESLint reported it only as a *warning*, which `pnpm lint` exits 0 on. So `pnpm test` was green on a dead control. The guard that goes red is the e2e. Same family as the common-name hole (`icon`, `title`) and the one-name-two-purposes hole, in a third shape: the guard is not fooled by a coincidental match but by the declaration of intent to read. |

| **An option that renders identically to "no option" is a dead control, even when its CSS rule is perfect.** A palette guard that checks each key *has* a rule cannot see this; the check has to be that the rule makes a **difference** on a real page. Guarded by `richTextRender.e2e.spec.ts`. | `heading` and `body` resolve to `--text-dark`/`--text-mid`, which on a light band are the colours the text already is: Default and "Heading text" both computed **`rgb(65, 64, 66)`**, identical to the byte. They sat first in the dropdown, directly under "Default (as designed)" — so the first thing an editor tried was the one thing that could not show a change, and a control that had just been fixed and measured was reported broken a second time. They are last now, labelled *"Follows the band"*, and excused by name in the guard rather than by silence. |

| **Payload's own JSX converters read `node.format` and ignore node state entirely.** Anything stored as Lexical NodeState — which serialises under `$` — renders only if *our* converter reads it (`nodeColorClass` in `src/components/RichText/shared.tsx`). | `TextStateFeature` puts a colour swatch in the toolbar and writes `{"$":{"color":"brand"}}` onto the text node. Registering it alone gives an editor a control that colours the text in the admin, saves cleanly, and paints nothing on the page — a brand-new instance of the failure it was added to fix. The two halves must ship together. |
| **A guard aimed at a rule that declares nothing passes forever.** Before asserting that rule X beats rule Y, check that Y declares the property at all. | The `!important` on `.vf-tc-*` was justified in a comment naming `.vf-client-overview .vf-split__title` as a 0,2,0 competitor. It sets `margin-bottom`, `font-size` and `font-weight` and **no colour** — so the e2e written against it stayed green with the flag deleted, and read as a guard that could not fail. Dark-band headings are the same trap for a different reason: `.vf-on-dark .vf-tc-*` carries its own flag, so those pass either way. The real competitors were found by parsing the *served* stylesheet for rules setting `color` on a header class at ≥2 classes, then measuring each with the flag removed: `.why-verify--light .why-header .section-title` goes brand blue with it and stays `rgb(65,64,66)` without. |

| **Never join or interpolate a copy value.** `.join(' ')` and `` `${x}` `` over rich text print `[object Object]` — no error, no warning, just the wrong words. Guarded by `tests/e2e/richTextRender.e2e.spec.ts`. | FAQ joined its help card's heading and body; `/information-centre/for-clients` shipped "[object Object] [object Object]" beside an info icon. `computedSnapshot` found it only because the paragraph had become one line instead of two. `/contact` printed it four more times, from `` ` \| ${t.note}` `` separators. |
| **`InlineRichText` adds no wrapper unless you ask for one**, and a heading must render `as={Tag}` rather than wrapping its text in a span. | Defaulting to `<span>` added 48 elements sitewide and nested `<span class="ni-card-link"><span>…</span></span>`. Worse, the Heading block's `<Tag><span>text</span></Tag>` handed the brand colour to the wrapper — `.section-title span` is the *accent* rule — and the heading itself went grey. |
| **Booting Payload runs a dev schema push, so a deliberately-broken config is applied to the local database.** `pnpm test:e2e` boots it through `tests/helpers/seedUser.ts`; so does any `payload run` script. Repair with `src/migrations/REFERENCE-inline-richtext.sql`, which is idempotent for this reason. | Proving one guard red converted **156 columns** back to varchar, keeping the Lexical JSON as text. Nothing said so; the next build simply failed. |
| **A scratch table in the app's own database hangs the dev push.** Drizzle reads an unknown table as one to drop, and waits on the invisible "Accept warnings?" prompt. | A `shape_cols` helper table left in `verify_cms` hung `getPayload()` for ten minutes with an empty log and no DB activity — indistinguishable from a slow boot. |
| **Don't cache a value that is already stable.** For a `useSyncExternalStore` snapshot, prefer a naturally-stable computation over a module-level memo. | `startOfDay(Date.now())` already returns the same number all day. Memoising it in a module variable froze "today" for the life of the JS bundle — which outlives a page, since client-side navigation doesn't re-evaluate modules — so a tab open overnight never re-bucketed events. |

## Commands

```bash
pnpm dev                  # http://localhost:3000 (admin at /admin), binds 0.0.0.0
./start.sh / ./stop.sh    # same server backgrounded → .dev.log / .dev.pid (LAN-shareable)
pnpm dev:prod             # clean build + start — needs LOCAL_PROD_REPRO=1 in .env (see Local development)
pnpm build                # ./stop.sh FIRST — build and dev share .next (see Verifying a change)
pnpm lint                 # eslint (pnpm lint:fix to autofix)
pnpm test                 # lint → int → e2e, in that order; stops at the first failure
pnpm test:int             # vitest, tests/int/**/*.int.spec.ts
pnpm test:e2e             # playwright, tests/e2e/ — starts/reuses a dev server on :3000
pnpm generate:types       # → src/payload-types.ts   (after ANY collection/global/block field change)
pnpm generate:importmap   # → src/app/(payload)/admin/importMap.js (after adding a custom admin component)

pnpm payload run scripts/inventory.ts   # → photo-inventory.csv + content-inventory.csv (review docs)
```

`scripts/inventory.ts` enumerates every image slot on the site and every page/article/event. Both
CSVs are gitignored working documents and go stale as soon as content changes — a deleted-and-
reseeded document returns with a **new id**, so `admin_url` starts pointing at a record that no
longer exists. Re-run it rather than editing a stale copy.

Single test: `pnpm test:int tests/int/api.int.spec.ts -t "name"` ·
`pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "name"`.

### What each suite guards

Six of these were never named anywhere in this file, so the invariants they cover read as unguarded
and the specs read as deletable. Counts are deliberately **not** recorded here — they live in
`current-state.md`, dated, because four documents once carried four disagreeing numbers.

| File | What it guards |
|---|---|
| `tests/int/adminControls.int.spec.ts` | The control guards: orphan fields, option values with no CSS rule, the class picker, hardcoded brand assets, placeholders with no upload, `cacheLife` on a tag purge, discarded `appearance`, unguarded draft queries. Proved by `zsh tests/int/prove-guards.sh` — **eleven** cases, all must report PASS. |
| `tests/int/seedAuthored.int.spec.ts` | `isUnauthored`/`isPlaceholderLayout`, and that every `authorPage` copy uses them rather than counting blocks. Also asserts how many files define `authorPage`, which is the number to trust. |
| `tests/int/cssTokens.int.spec.ts` | `buildTokenCss`/`safeTokenValue` sanitisation — editor-supplied values land inside a `<style>` tag. |
| `tests/int/eventTiming.int.spec.ts` | `isPast` at start-of-day, `registrationOpen` and its fallback, and that the two are allowed to disagree. The unit half of **Event timing** below. |
| `tests/int/headingId.int.spec.ts` | `headingId`/`slugify` — stable slugs, `[[accent]]` stripping, collision disambiguation. The unit half of the anchor-id invariant. |
| `tests/int/qualificationIcon.int.spec.ts` | Re-derives every qualification→icon pair from the design reference and asserts `qualificationIcon()` reproduces it, returns only icons in `iconMap`, and falls back. |
| `tests/int/api.int.spec.ts` | **One boot smoke test** (`fetches users`). The name promises a suite; it is not one. |
| `tests/int/productionEnv.int.spec.ts` | The boot gate: which environment variables are required while serving, that `next build` waives them all, and that `ALLOW_MISSING_SMTP` waives `SMTP_HOST` **and nothing else**. The negative assertion is the point — a test of only the happy branch cannot tell a targeted opt-out from a waiver of everything. |
| `tests/e2e/frontend.e2e.spec.ts` | The largest e2e file: skip link (both states), centred-heading wrap, hero weight, testimonial hover. Most of the browser traps below are its assertions. |
| `tests/e2e/links.e2e.spec.ts` | Every `#fragment` link has a target, plus the behavioural Videolink assertion — the "an anchor link is two halves" invariant. |
| `tests/e2e/images.e2e.spec.ts` | Images are served at the size they render, per route. **The guard for the four image invariants below** (`sizes`, width-only derivatives, the no-derivative majority case, `object-fit` without `fill`). |
| `tests/int/proseFields.int.spec.ts` | Every field an editor types words into is rich text, or is named with a reason. Walks the sanitised config, so it sees fields nested in arrays, groups, tabs and rows. |
| `tests/int/richTextColors.int.spec.ts` | The brand text-colour palette and its CSS agree — every key has a rule, every rule resolves through the token it claims, every token is in `:root` — **and** the toolbar swatches offer exactly that palette, previewing each colour as the literal the admin can resolve. It constructs `TextStateFeature` and reads its props back, so a Payload API change fails here rather than on a page. |
| `tests/int/lexicalText.int.spec.ts` | `richTextToPlain` / `hasRichText` — reading a copy value's words whether it holds a string or a tree. |
| `tests/int/inlineRichText.int.spec.tsx` | `InlineRichText` renders no `<p>`, no wrapper `<div>`, a `<br>` between paragraphs, and no element at all when none was asked for — plus the toolbar colour: a text node carrying `$: {color}` emits `.vf-tc-* .vf-tc--inline`, one without emits no span, and a retired key emits nothing. |
| `tests/int/seedWrites.int.spec.ts` | No seed file calls `payload.create`/`update` directly, bypassing the rich-text lift. |
| `tests/e2e/richTextRender.e2e.spec.ts` | No route renders `[object Object]` or throws while hydrating, **and** an editor's colour beats the page-scoped rule it has to beat — the browser half of the `!important` on `.vf-tc-*`, which no file check can see. |
| `tests/e2e/carousel.e2e.spec.ts` | `SlideCarousel` bounds: rapid next/prev, arrow keys, dot recovery, autoplay wrap. **The guard for the carousel invariant below** — and note it clicks with `{ force: true }`, without which the burst is not rapid. |
| `tests/e2e/specialistCarousels.e2e.spec.ts` | The three specialist carousels show a real selection, not whoever sorts first: the homepage equals the Featured set, /jme equals the JME-tagged set **as queried from the API** (so it stays true when an editor tags someone new), and Make a Booking equals the advertised set. Every case asserts a **non-zero count before** the membership — see the `return null` invariant. |
| `tests/e2e/tryBooking.e2e.spec.ts` | The TryBooking block never leaves a visitor looking at an empty box: the fallback link is present, correct and **visible** when the embed cannot load, the failed embed occupies **zero height**, and the link is in the server HTML with `javaScriptEnabled: false`. Note it asserts the *degraded* state deliberately — the embed is refused over http, so the success path is not testable on the dev server and was confirmed by hand over https. |
| `tests/e2e/admin.e2e.spec.ts` | The admin loads and the Pages create form renders. Seeds its own user, and deletes the autosave draft it creates. |
| `tests/helpers/` | `seedUser.ts` (deletes and recreates `dev@payloadcms.com`) and `login.ts`. |

**Changing a field's type (`text` → `richText`) is done by hand, in three steps**, because
the dev push stops on a prompt you cannot see:

1. Boot the app against an empty scratch database — everything is `CREATE TABLE`, so no
   prompt — and dump its catalog. That database *is* the shape the config wants, including
   every `_v` version shadow and every block nested in Tabs/Section/Row.
2. Load that catalog into `verify_cms` as `shape_cols`, run
   `src/migrations/REFERENCE-inline-richtext.sql` (it generates the `ALTER … USING` from
   the join rather than being typed), then **drop `shape_cols`** — an unknown table hangs
   the next push.
3. Diff the two catalogs and expect zero rows.

There is no typecheck script — use `pnpm exec tsc --noEmit`. ESLint ignores `src/payload-types.ts`.
Imports resolve through `@/*` → `src/*` and `@payload-config` → `src/payload.config.ts`.

`tests/e2e/admin.e2e.spec.ts` seeds its own admin user via `tests/helpers/seedUser.ts`, which
**deletes and recreates `dev@payloadcms.com`** in whatever DB `.env` points at — fine locally,
never against production. Playwright's `webServer` reuses an already-running `:3000`.

`README.md` has been rewritten as this project's handover readme (running it locally, deploying,
where the editor's manual lives). It is no longer the Payload template's.

## Local development

Fully isolated from production — it never touches the live database.

- **Database:** Homebrew `postgresql@15` on `127.0.0.1:5432`, dedicated DB `verify_cms`
  (owner `swinchester`, no password). `psql`/`createdb` live at
  `/opt/homebrew/opt/postgresql@15/bin/`.
  - A separate `vmls_dev` DB in the same Postgres belongs to an **unrelated Prisma app** —
    leave it alone.
- **Env:** `.env` (gitignored, local-only) sets `DATABASE_URL` to `verify_cms` with a fresh
  local `PAYLOAD_SECRET`. `.env.example` documents every variable and marks the three the
  server refuses to boot without (`SMTP_HOST`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`) —
  each degrades *invisibly* rather than loudly when missing.
  - The check lives in **`src/instrumentation.ts`**, which Next runs once before the first
    request, and it `process.exit(1)`s. It is not in `payload.config.ts` alone, because that
    module loads lazily: measured, `next start` with `SMTP_HOST` unset served the prerendered
    homepage with a **200** and only 500'd on `/admin` and `/api/*`. A half-alive server passes
    a deploy smoke-test that hits `/`.
  - It gates on *serving*, not on `NODE_ENV`. `next build` also sets `NODE_ENV=production`, and
    requiring mail credentials to build an artifact just broke `pnpm build`; the build is
    skipped via `NEXT_PHASE === 'phase-production-build'`.
  - `pnpm dev:prod` runs `next start`, which *is* serving, so it needs **`LOCAL_PROD_REPRO=1`**
    in your local `.env`. That prints a boxed banner on every boot and disables nothing else.
    **Never set it on the box.**
  - **`ALLOW_MISSING_SMTP=1` is the server-side equivalent, and waives `SMTP_HOST` and nothing
    else** — `NEXT_PUBLIC_SERVER_URL` and `PREVIEW_SECRET` stay required, so a genuinely
    misconfigured deploy still refuses to start. It exists because the staging box runs before mail
    credentials do. Guarded by `tests/int/productionEnv.int.spec.ts`, whose load-bearing assertion is
    the *negative* one: that the flag is not a blanket waiver. Proven red both ways — waiver deleted,
    and waiver widened to all three.
    **It must be removed before the site takes real enquiries.** While set, submissions are still
    stored but nobody is emailed, and admin password resets silently fail — surfaced by a boot banner
    and, more usefully, a red banner on the admin dashboard (`BeforeDashboard`), which keys on
    `SMTP_HOST` rather than on the flag so it is equally true on a dev machine.
  - `SMTP_HOST` is unset locally. Payload's built-in fallback is a console adapter that logs at
    *info* and resolves successfully — indistinguishable from a real send — so it is replaced by
    `src/email/emailNotSentAdapter.ts`, which logs `[EMAIL NOT SENT] to=… subject=…` at **error**
    level. The action that triggered the email still completes; only the notification is dropped.
- **Schema:** the Postgres adapter pushes schema in dev (non-production default), so the local
  DB auto-syncs on boot — **no local migrations**. `src/migrations/` holds a single baseline;
  migrations are authored/run on the server for production only.
- Local admin (throwaway): `admin@local.test` / `password`.
- Seed scaffold content (non-destructive, idempotent) while logged in:
  `POST /next/seed-verify` → `src/endpoints/seedVerify.ts`. It creates the nested page tree by
  slug and fills the globals. The template's destructive `/next/seed` route has been removed;
  everything under `src/endpoints/seed/` is now a module of the VERIFY seed (`seedHomepage`,
  `seedServices`, `seedDataLayer`, …) plus its `data/` fixtures.

## Deploy workflow

Production builds/migrates on a remote Proxmox box (reached via Tailscale; managed through the
Proxmox dashboard). Loop: edit code locally → commit & push → the box pulls, builds, and
migrates against the **live** database. The local `.env` and `verify_cms` DB stay on the Mac
and are never pushed.

After a `CollectionConfig`/`GlobalConfig` field change, the server sequence is:
`pnpm payload generate:types` → `pnpm payload migrate:create <name>` → `pnpm payload migrate` →
`pnpm build`. Multiple config changes in one push can share a single `migrate:create`.

## Architecture

### Routing

`src/app/(frontend)/` is the site, `src/app/(payload)/` is the admin + REST/GraphQL API.

- `/` and `/[...slug]` → **Pages**, via the nested-docs plugin. A page's real URL is the chain of
  its ancestors' slugs, stored on the last breadcrumb's `url`. `queryPageByPath` looks up by
  *leaf* slug, then disambiguates same-slug pages by matching the full breadcrumb path. Anything
  unmatched falls through to `PayloadRedirects`.
- Dedicated collection routes: `/posts/*`, `/in-the-loop/[stream]/[slug]` (Posts, grouped by the
  `streams` taxonomy), `/specialists/profiles/[slug]`, `/about/team/[slug]`,
  `/events/event/[slug]`, `/search`, plus five sitemap routes under `(sitemaps)/`. Specialist
  profiles deliberately sit one level down (`/specialists/profiles/`) so a dynamic segment at
  `/specialists/[slug]` doesn't outrank the `[...slug]` catch-all and swallow the CMS pages
  nested under `/specialists`.
- **`src/utilities/routes.ts` is the single source of truth for document URLs** (`docPath`,
  `postPath`, `specialistPath`, `teamPath`, `eventPath`, …). Link components, blocks,
  revalidation hooks, sitemaps, redirects and search sync all import from it — never
  interpolate a document path inline; historically hand-built paths disagreed with real routes
  and revalidated URLs nobody visits. Note `postPath` returns `null` for a post with no
  stream (render it unlinked; the old `/in-the-loop/<slug>` fallback 404'd).
- Draft preview goes through `/next/preview` + `/next/exit-preview`; each collection builds its
  preview URL with `generatePreviewPath`.

### Block system (the page builder)

Every block is a folder in `src/blocks/<Name>/` with `config.ts` (Payload `Block`, with
`interfaceName` so it gets a named generated type) and `Component.tsx`. Adding one means touching
several files:

1. `src/blocks/<Name>/config.ts` + `Component.tsx`.
2. `src/blocks/RenderBlocks.tsx` → add to `blockComponents`; add to `selfSpaced` if the component
   wraps itself in `<Section>` (otherwise it gets the legacy `my-16` wrapper at top level).
3. `src/collections/Pages/index.ts` → add to the `layout` blocks array to make it selectable.
4. Optional: `src/blocks/nestable.ts` (`NESTABLE_RICH_BLOCKS`) to allow it inside Section/Row, and
   `src/blocks/tabContent.ts` for inside Tabs. `tabContent.ts` deliberately re-lists its blocks
   instead of importing `nestable.ts` — importing would create a `Tabs ← nestable ← Tabs` cycle
   that evaluates to `undefined`.
5. `pnpm generate:types`.

`RenderBlocks` is **recursive** with two contexts. At `top` it applies the spacing wrapper; at
`nested` (used by the Section and Row components for their children) it passes `bare` so rich
blocks inherit the parent's background and container width instead of re-banding. Nesting depth is
bounded to `Section > Row > block`.

**Layout primitives:** `Section` (banding, container width, padding, motion) and `Row`
(responsive column grid) are the low-code container blocks; `Heading`/`Text`/`Button`/`Image`/
`Spacer`/`Divider`/`IconBlock` are nestable-only atoms. Editors compose new layouts from these
rather than getting a new bespoke block per design — build capability, don't hardcode a design.

**Porting a reference design: prefer a block *variant* over a page-scoped class.** When a reference
page styles a section differently, the tempting fix is a rule scoped to that page (`.svc-learn-rows`,
`.ime-formats`, `.jme-process`, `.as-how` all do this, and are staying). The better fix is a field on
the block that emits a modifier class — `FeatureGrid.cardStyle: banded`, `ProcessSteps.numberStyle`,
`SplitFeature.rowStyle`/`density`/`bulletStyle` — because the look then becomes available to every
instance instead of one URL. **Default every new variant to what already renders**, so adding it
moves nothing, and prove that with `computedSnapshot.mjs` rather than asserting it.

Page-scope only what is genuinely a per-page *literal* rather than a design choice: a gradient angle
one reference page tilts differently, a palette value. Say which it is in the comment. And a variant
must never make an existing field dead — when `bulletStyle: dot` replaces the tick, it replaces only
the *default* tick, because a bullet the editor gave an icon still has to keep it.

**Copy fields are rich text.** `inlineRichTextField(name, overrides)` is the one-line
form (headings, card titles, button labels — compact editor, no headings or lists) and
`richBodyField` the multi-paragraph one. Render both through
`src/components/RichText/Inline.tsx`, never by interpolating the value.

**Colour has two controls over one palette** (`BRAND_TEXT_COLORS`, `src/fields/richTextColors.ts`),
both emitting `.vf-tc-*` and both storing a *key* so Site Settings repaints every coloured word:

- `textColorField` gives a block a `textColour` select covering a whole heading and subheading. A
  block that spreads `sectionHeaderFields` **must forward it** — `<SectionHeader colour={textColour}>`,
  or `colour=` on each `InlineRichText` if it renders its own header. It is not compile-forced;
  `adminControls.int.spec.ts` is what proves it, and the field shipped read by nothing until that
  guard learned to see bundle-supplied fields.
- `brandTextColorFeature()` (`src/fields/richTextColorFeature.ts`) puts the same palette in every
  rich-text toolbar, registered once on `defaultLexical` so all ten field-level editors inherit it.
  It writes Lexical NodeState (`$`), which **only our converter renders** — see the Invariants table.
  Separate file from the palette because it imports the server export, and `colorClass` is client code.

Inside a coloured element a `[[bracketed]]` phrase keeps the brand accent; inside a *toolbar* pick it
does not, because that pick is `.vf-tc--inline` and an explicit selection outranks a bracket. All of
this is kept in step by `tests/int/richTextColors.int.spec.ts`.

Shared field helpers live in `src/fields/blockFields.ts` (`backgroundField`, `containerWidthField`,
`spacingFields`, `motionField`, `sectionHeaderFields`, `anchorIdField`, `iconField`,
`cssClassField`, …). Use them so blocks stay consistent and every rendered detail is admin-editable.
Section headings support `[[bracketed]]` text for brand-accent highlighting (`accentText.tsx`).

### Hero system

Parallel to the block builder and easy to miss. Pages carry a single `hero` group field defined
in `src/heros/config.ts`; a `type` select drives conditional field visibility through the local
`isType(...)` helper, and `src/heros/RenderHero.tsx` maps `type` → component via a `heroes`
record (`none` and unknown types render `null`). Five types: `pageHero` (default, interior
pages), `homeHero` (definition panel), plus the template's `highImpact`/`mediumImpact`/
`lowImpact`. Adding one means touching both files.

Heros reuse the same `blockFields.ts` helpers as blocks. Their spacing fields default to a
`'default'` sentinel that emits **no** class: the home hero's own 80px padding is not one of the
`--space-*` presets (`normal` is ~88px), so defaulting to a preset would silently reshape the
hero. Leave that sentinel in place.

### Styling and design tokens

Three layers, in override order:

1. `src/app/(frontend)/globals.css` `:root` — default values for `--space-*`, `--gap-*`,
   `--size-heading-*`, `--band-*`, `--vf-radius-*`, and the `.vf-*--<preset>` modifier classes
   that consume them.
2. **Design System global** (`src/DesignSystem/config.ts`) — editors set the *values* behind each
   preset; `designTokenStyle()` turns them into inline CSS custom properties on `<html>`, so one
   token edit re-themes every block using that preset. **Site Settings** feeds brand colours the
   same way via `brandColorStyle()`, plus logo/favicon/social image.
3. **Custom Styles global** (`src/Styles/config.ts`) — arbitrary global CSS plus named class
   presets; the `CssClassSelect` field component (`src/fields/CssClassSelect`) offers those presets
   as a strict picker on `cssClass` fields, and `toClassName()` normalises the value.

Block fields therefore store *preset slugs*, never raw CSS values. Icons come from a fixed Phosphor
registry in `src/components/Icon` (`iconMap` → `iconOptions`, consumed by `iconField`); add an icon
there and it becomes selectable everywhere. The brand typeface (MuseoSansRounded) is loaded locally
in `(frontend)/layout.tsx`.

Both `designTokenStyle()` and `brandColorStyle()` are built by `src/utilities/cssTokens.ts`
(`buildTokenCss`, `safeTokenValue`, `stripStyleClose`, `UNSAFE_TOKEN_VALUE`). Editor-supplied
values land inside a `<style>` tag, so sanitisation happens there — keep
`tests/int/cssTokens.int.spec.ts` green when touching token plumbing.

### Verifying a change — traps that have already caught someone

Most wrong conclusions here came from a bad *measurement*, not bad code. Before believing a check:

- **`pnpm lint` / `pnpm test:e2e` had both been broken for months** — lint crashed on a config shim,
  e2e asserted the Payload template's title. A suite that has never run is not a passing suite. Both
  now run in `pnpm test`; keep it that way.
- **Grepping rendered HTML matches the first hit, which is usually the header.** Checking an event's
  CTA with `grep 'class="btn'` returned the site header's button and gave the wrong answer twice.
  Scope the search to the region first (find the section, slice, then match inside it).
- **`node tests/visual/computedSnapshot.mjs` is keyed by structural index path, so any content change
  invalidates the baseline.** Running the seed as part of a verification pass destroyed a comparison
  that had been captured beforehand. Capture/compare *before* seeding, or recapture after.
  A handful of sub-pixel `matrix(…)`/`opacity` diffs are scroll-reveal animation frames, not
  regressions — same node count and only transform/opacity differing is the signature.
  **Its printed diff truncates** (`…and N more`), so "which routes changed?" cannot be answered by
  eyeballing or `grep`-ing the output — a `uniq -c` over the visible slice reported two routes when
  seven had moved. Read `tests/visual/__snapshots__/<name>.json` and count keys directly; the route is
  the substring before the first space. And when adding a route to `ROUTES`, add it **before**
  capturing the baseline, or the new route has nothing to compare against and reads as clean.
- **A Playwright probe can lie.** A DOM-walk that reported "event not on listing" was wrong; the
  event was there. Assert on something you have independently confirmed (curl the HTML, query the
  DB) before concluding a feature is broken.
- **The site has no `<header>` element** — the masthead is `<nav class="site-nav">`, and the footer is
  `footer.site-footer`. `playwright.config.ts` now sets `baseURL`, so specs can use `page.goto('/')`.
- **Breaking one consumer does not prove an orphan-field guard works** if the field has two
  consumers. Pick a field with exactly one renderer (`Offices.hoursNote`), not one with several
  (`Offices.hours`, read by both the Footer and ContactDetails).
- **Every negative result needs a positive control.** Before believing "not found", make the same
  check find something you already know is there. Each of these produced a confident, wrong "no":
  `grep --include=*` (unquoted, so zsh ate the glob and grep errored per-iteration) reported all 13
  dead-CSS candidates absent — acting on it would have deleted live CSS; searching for
  `safeRevalidateTag(` found **zero** of its 27 call sites, because every one imports it *aliased*
  as `revalidateTag`; grepping rendered HTML for Phosphor icon slugs could only ever say "absent",
  since Phosphor emits `<path>` data and never the slug; and a `LIKE '%"format":1%'` check on a
  `jsonb` column always fails, because Postgres re-serialises with a space after the colon (query
  the structure with `jsonb_array_elements`, not the text).
- **A Playwright probe that never logged in reports every page as broken.** `waitForURL('**/admin**')`
  matches `/admin/login`, so the probe sailed on unauthenticated and read the login form's two
  inputs as "the create form is empty" — the exact signature of a real past bug. Wait for a URL that
  *excludes* `/login`, and assert something only an authenticated page has.
- **A write script that exits 0 may have written nothing.** `pnpm payload run` produced no output,
  made no changes, and succeeded. Assert the write in the store afterwards; never trust the exit code.
  One specific cause: `payload run` **imports** the module, it does not call a default export — a
  script written as `export default async function ({ payload })` runs zero lines, prints nothing and
  exits 0. Do the work at the top level with `getPayload({ config })`.
- **Verify at the layer the visitor sees.** Two Custom Styles presets were in the database and the
  REST API returned all 27, while the served page still had 25. The database being right proves
  nothing about the page — that gap was the caching bug in the Invariants table.
- **A subagent's "dead code" verdict is a candidate, not a finding.** `.who-image-main` was reported
  dead; it is live in `WhyVerify/Component.tsx`, and deleting it would have broken a page.
- **A destructive schema change hangs dev-push on a prompt you cannot see.** Dropping two columns
  left the push waiting on *"Accept warnings and push schema to database? (y/N)"* inside a
  backgrounded log, and two unrelated new columns silently failed to push for half an hour. Apply
  that DDL by hand (`psql`) and restart, so the push finds no drift — that is how
  `ProcessSteps.description` was converted `varchar → jsonb`, prompt-free, in one
  `ALTER COLUMN … USING`.
  **Seen again 2026-08-20, from removing a field added ten minutes earlier.** "I only just added it"
  does not make a removal non-destructive: dropping `Departments.description` hung the push the same
  way. The symptom that time was `curl` returning **000** and a single admin request sitting at
  *"200 in 10.0min"* in the log, with the prompt several lines above it. Check `.dev.log` for
  *"Accept warnings"* before assuming the server is merely slow.
- **Content inside an inactive Tabs pane is not in the HTML.** `curl | grep` for the AAMLE panel
  found nothing on the homepage and the block was rendering perfectly — only the active tab is
  server-rendered. Drive a browser and click the tab.
- **A new rule in `globals.css` may not reach the browser.** A `.skip-link` rule was in the source,
  and the element rendered completely unstyled — `position: static`, no background — as visible body
  text above the nav on every page. Turbopack had not recompiled the stylesheet; `rm -rf .next` and a
  restart fixed it, source unchanged. So a CSS change that "does nothing" is a stale build before it
  is a bad selector. Confirm with `getComputedStyle` on the element and a **positive control** on a
  rule you know works (`nav.site-nav` → `position: sticky`). Do not try to read `document.styleSheets`
  — cross-sheet access throws, and a `try/catch` around it reports zero matches for *every* selector,
  including ones that are plainly applied.
- **A deleted CSS rule can go on being SERVED.** The stale-Turbopack trap already recorded runs in
  this direction too: `.portal-opt4-tile:hover` was gone from `globals.css` — verified by stripping
  comments and searching the source — while the served stylesheet still carried **two** copies. The
  new guard therefore passed in isolation and failed in a full run, which reads like a flaky test and
  is not. `./stop.sh && rm -rf .next && ./start.sh`, source unchanged, and the served sheet went to
  zero. When a hover/CSS assertion disagrees with itself between runs, `curl` the stylesheet the page
  actually links and grep it before touching the test.
- **A click on a visible, stable element can be silently dropped before hydration.** Playwright's
  actionability checks pass — the button is there and not moving — but React has not attached its
  handler, so nothing happens and nothing errors. `admin.e2e.spec.ts` clicked the **Content** tab,
  never switched panes (`activeTab: "Hero"`, `hasLayoutField: false`), and went on to count the
  *Hero* tab's fields: 3 rich-text editors against an expected 6, which reads exactly like a page
  that lost its converted fields. Waiting 30s for the tab to activate does not help — there is
  nothing in flight. Retry the click until the state changes (`expect(async () => { click; assert
  })` `.toPass()`). **A `waitForTimeout(300)` had masked this for months**, by giving a later
  re-render time to land, so the counts were right for the wrong reason; when the admin slowed the
  mask slipped, and raising the sleep to 1500ms "fixed" it and would have hidden the cause again.

- **`computedSnapshot.mjs` reporting *every* node as changed means it captured nothing, not that
  everything moved.** Its header line is the tell: `nodes: baseline 8385, now 0` followed by
  `DIFF: 8385 node(s) changed`. Seen after several back-to-back `pnpm test` and `prove-guards.sh`
  runs left the dev server wedged — `curl` returned **000** while `.dev.log` showed requests
  completing in 25-30s, with no *"Accept warnings"* prompt anywhere in it, so it was neither the
  destructive-DDL prompt nor the redundant-`CREATE TYPE` loop already recorded, just an exhausted
  Turbopack. `./stop.sh && rm -rf .next && ./start.sh` and the same comparison read **DIFF EMPTY at
  8385 nodes**, source unchanged. Read the `now N` count before reading the diff: a zero there
  invalidates the run.

- **`referenceCssDiff.mjs` prints TWO numbers with the word "differences" in them, and the one that
  looks like the answer is not.** Its footer reads *"Reference selectors: 32 · build: 48 ·
  deliberately not ported: 3 · explained differences: 32"*, then a separate `✓`/`✗` verdict line.
  A `grep -Eo 'differences: [0-9]+'` matches the **explained** count — the tally of documented,
  deliberate exceptions — so a family with 32 recorded exceptions and zero real differences reads as
  "32 differences". Measured: that grep reported 11 of 13 families non-zero, including a family
  whose own next line said *"no desktop differences"*, and the false alarm survived a git-bisect
  across four commits before the output was read properly. Key on the verdict line, never on a
  number in the summary.
- **A `prettier --write` glob reaches every file it matches, not the files you edited.** Running it
  over `src/blocks/**/Component.tsx` to tidy a two-line change reformatted **24 unrelated
  components** plus all 12k lines of `globals.css` — 8,715 insertions in one file — because the repo
  is not prettier-clean and nothing enforces it (`pnpm lint` passes either way; the raw edits passed
  it before the formatter ran). The churn buries the actual change and makes the diff unreviewable.
  Same family as the `perl -0pi` bulk-edit trap already recorded, and the fix is the same: read
  `git diff --stat` before believing the edit was confined. Formatting is not exempt from that.
- **A comment is just more text to a regex, in CSS as well as in TypeScript.** Writing the literal
  selector `.vf-on-dark .vf-tc-brand` inside the explanatory comment above the palette rules made
  `richTextColors.int.spec.ts` — which finds that rule with
  `\.vf-on-dark \.vf-tc-<key>[^{]*\{` — match the comment and then run on to the next real rule,
  reading the wrong declarations. One test went red on a change that touched no CSS. Second instance
  of this hazard; the first is the orphan guard's `object.property` form in a JSX comment, already
  in the Invariants table. Re-run the affected guard after editing any comment near one.

- **Never run `pnpm build` while `pnpm dev` is running.** They share `.next`, and the production
  build overwrites what the dev server is serving from. Measured: a hover rule that had just been
  confirmed working (`.audience-card:hover` → `translateY(-6px)`) started computing to `none` on
  every run, while `:hover` still matched and `elementFromPoint` was inside the card — the signature
  of correct CSS that never arrived. Four reproductions in a row made it look like a real,
  deterministic defect in the *test*, not the environment. `./stop.sh && rm -rf .next && ./start.sh`
  restored it, source unchanged. Run `pnpm test` first and `pnpm build` last, then restart dev.
- **Hover measurements need the pointer parked somewhere harmless first.** Playwright's mouse is
  stationary while `scrollIntoViewIfNeeded` moves the page underneath it, so the element you are
  about to measure "at rest" can already be hovered. That read the same transform for rest and hover
  and made a positive control pass while proving nothing. `page.mouse.move(4, 4)` before every
  resting reading.
- **Assert both states of a two-state behaviour, or the guard passes on the degenerate one.** The
  skip-link test checked only "on-screen when focused" (`top >= 0`) — trivially true of an unstyled
  element sitting statically at the top of the page, so it went green while the link was visibly
  broken on every page. Adding the other half — offscreen *before* focus — is what makes it fail.
  Same shape as the orphan-field guard: a check that only looks at the "working" end of a behaviour
  cannot distinguish working from absent.
- **Read the DOM after the page has settled, and pick a control that arrives on the same schedule.**
  A link audit that checked fragments at `domcontentloaded` reported **65 dead anchors**. All 65 were
  false positives: `ArticleToc` assigns article heading ids on mount, and other sections stream in.
  The control used — `#main-content` — is in the root layout and present in the first byte, so it
  passed in exactly the runs that were wrong. Re-checked with `waitUntil: 'load'` and polling:
  **0 dead of 202**. Prefer `waitForFunction` over a fixed delay; a fixed delay is wrong in both
  directions — too short then, flaky under load later.
- **A stale Turbopack build will fake a guard's proof, not just a feature.** Deleting
  `scroll-padding-top` and re-running its test reported PASS — the guard looked incapable of failing.
  The dev server had not recompiled. Confirm the break is *live in the browser*
  (`getComputedStyle`) before believing a proof run, exactly as you would for the fix itself.
  **It also fakes the fix's absence.** A correct heading-id converter served `<h2>` with no id
  through every reload and cache-buster query; `rm -rf .next` and a restart, source unchanged, and
  the ids appeared. Four occurrences now, in three sittings — two where it hid a working change and
  two where it hid a deliberate break. Treat "my edit did nothing" as a stale build first and a bad
  edit second, and re-prove *both* directions after restarting.
- **A link crawl cannot see a page nothing links to.** `/posts` was advertised in the pages sitemap
  and returned 404 — a leftover default from the Payload template. No page links to it, so crawling
  from links found nothing; the sitemap-driven test found it immediately. Enumerate from the
  sitemaps, not from the link graph.
- **Run a new guard against something that is deliberately fine before trusting it.** Proving a guard
  goes red on a real defect is only half the job; the other half is proving it stays green on a
  lookalike. The first heading-wrap guard compared each title's natural width against the nearest
  `.container` and reported `/services` as broken — that header is `display: grid`
  (`.svc-admin-split`), so its title correctly occupies a 620px track of a 1132px container. Acting
  on that would have "fixed" a section that was right. The rewrite states the fault causally
  (neutralise the header's own `max-width`; if a two-line title collapses to one, the header did it
  to itself), which exempts every legitimate case without an allowlist. **Prefer a guard that
  measures cause over one that compares numbers** — the numeric version needs an exception list, and
  an exception list is where the next false positive hides.
- **A break that stays green is a result worth recording, not a failure of the exercise.** Widening
  the testimonial fix to `.vf-card:hover` did not fail its guard, and should not have: the gateway
  card's own unlayered `:hover` is declared later at equal specificity, so nothing regressed. Write
  down what each attempted break *did*, including the ones that did nothing, or the next person
  re-derives it — and knows which failure the guard actually covers.
- **`page.goto(url + '#frag')` when the page is already on `url` is a *same-document* navigation.**
  No request is made; the browser scrolls the document it already has, fully hydrated. A test that
  reads the TOC on a page and then "navigates" to one of its fragments is therefore measuring the
  hydrated page, not a fresh load — it went green against the unfixed code. Give every state its own
  `browser.newPage()`.
- **`javaScriptEnabled: false` is the strongest available proof that server HTML is doing the work,
  but `waitForFunction` does not work in it.** Playwright implements in-page polling with a script
  the page runs; `page.evaluate` still works, because that goes over CDP. So poll from Node with
  repeated `evaluate` calls. Related: `document.fonts.status` is `'loading' | 'loaded'` — there is no
  `'complete'`, and a settle predicate that waits for one never fires, then silently reads whatever
  was on screen when the timeout hit.
- **`parseFloat('auto')` is `NaN`, and `NaN` fails every comparison silently.** Deleting
  `scroll-padding-top` to prove the deep-link guard red made it fail — with *"no article heading sits
  below the fold"*, because the candidate filter compared against `NaN`. True, and it named nothing.
  Where a computed style can be a keyword, assert it is a usable number **as its own precondition**,
  with the raw string in the message.
- **A break that behaves differently from the way you wrote it up is the finding.** The deep-link
  guard's comment claimed that restoring `ArticleToc`'s mount loop would sneak past the browser
  measurement, so the server-HTML and no-JavaScript checks were what caught it. Measured, it does
  not: an id assigned on mount produces no jump at all, so every step goes red. The comment now says
  what happened, and gives the checks' real justification (breadth, and foreclosing a *future* JS
  corrector). Run your break; do not narrate it.
- **The design reference declares most rules twice, and the copy that renders is the page's inline
  `<style>`, not the linked sheet.** `assets/css/styles.css` loads first; each page then redeclares
  what it needs in a `<style>` block at equal specificity, which therefore wins. Porting from the
  shared sheet gives you a value the reference does not render: `.page-hero h1` was "aligned" from
  800 to 700 that way, on 59 pages, and the change was written up in `verify-website-design-diff.md`
  §5 as a *correction*, which is what stopped anyone re-checking it. Two further consequences —
  a browser reading of the reference over `file://` only measures the inline half, because the
  sheet is linked root-absolute (`/assets/css/styles.css`) and silently fails to load, so anything
  from the shared sheet reads as an unstyled default; and a guard should compare against the value
  parsed out of the reference *page*, never a number copied into the test, or the port's mistake
  just moves into the assertion. The sweep for others is done: parsing all three sources and
  diffing every declaration found **exactly two** cases, `.page-hero h1` and `.contact-form`
  padding — don't redo it from scratch.
- **A dev-push failure takes the whole local site down, and the error names the wrong culprit.**
  Narrowing a select's options narrows a Postgres **enum**, and `pushDevSchema` runs inside
  `getPayload()` — so `ALTER TABLE … SET DATA TYPE` failing with `22P02 enum_in` makes *every* page
  500 with a `generateStaticParams` stack trace, not an obvious config error. The cause is rows
  still holding a removed value, and **`_pages_v` is where they hide**: `pages.hero_type` was clean
  (59 pageHero, 2 homeHero) while `_pages_v.version_hero_type` held **62 `lowImpact`** rows of
  template-era history. Count both tables before removing any select option. The failure is atomic —
  the enum and all 481 rows were intact afterwards — but until the config is reverted nothing serves.
- **A declaration diff is blind to a property neither side declares.** `referenceCssDiff.mjs`
  reported **zero** for the events family while four headings rendered at `font-weight: 400` against
  the reference's 700. The reference omits the weight and inherits the browser's `h2 { bold }`; the
  `@layer base` block at the top of `globals.css` resets `h1…h6` to `font-weight: unset`, which for
  an inherited property means *inherit*, so a faithful port of that omission takes the body's 400
  instead. Identical stylesheets, different rendering, nothing for the diff to see. Whenever a port
  relies on the reference's defaults, **measure the inherited properties in the browser** — weight,
  size, colour, alignment — because that is exactly where a clean diff lies.
- **A structural match is not a visual match, and reporting one as the other is how a whole page
  ships wrong.** `/events` was rebuilt, verified, and reported as matching the reference. The check
  compared the `h1` string and the list of `h2` headings — it found four slide titles out of four and
  stopped. Never measured: hero alignment, type scale (60.8px/800 against the reference's 52.8/700),
  section background, card design, and every slide *body*, which were paraphrases from the showcase fixture
  (`seedShowcase.ts`, since deleted — that authoring now lives in the per-page modules under
  `src/endpoints/seed/`).
  Three rounds of "you missed something" followed, each finding another by eye. Spotting differences
  does not converge; enumerating them does. `node tests/visual/referenceCssDiff.mjs <family>` parses
  every declaration on both sides and prints a count that has to reach zero — and it caught two things
  no amount of looking had: a `::before` drawing a 24px dash before an eyebrow the reference hides, and
  a literal `20px` the radius codemod had rewritten to `var(--radius)` (0.5rem here, 8px there) despite
  those codemods being documented as value-preserving.
- **A harness silently covers less than it claims.** `computedSnapshot.mjs` listed two routes that do
  not exist (`/about-verify`, `/legal/privacy-policy`); both 404, `capture` never checked status, so
  it banked the not-found page as a baseline **twice** — 178 nodes each, an identical count, which is
  the only reason it was noticed — while two real pages went unmeasured. It now refuses any non-200.
  Whenever a checker takes a list of inputs, assert the inputs resolve; a tool that quietly measures
  the wrong thing reads exactly like a tool that found nothing wrong.
- **Before deleting an `!important`, find out which rule it was beating.** One was removed from
  `.svc-admin-split .vf-section-header__subtitle` on the reasoning that the scoped rule already
  outranked `.section-subtitle`. True, and irrelevant: the competitor was
  `.vf-section-header--centered .vf-section-header__subtitle { margin-inline: auto }` — **equal
  specificity, declared 1,600 lines later**, so it won on order. The intro paragraph moved 326px in
  from the left at every width. `SectionHeader` always emits that modifier, which is why the sibling
  `margin-inline`/`max-width` rules in the same block carry `!important` too.
  **`computedSnapshot.mjs` reported the page as unchanged**, because it measured `marginTop`/
  `marginBottom` and no horizontal spacing, padding or position at all — the element's width never
  moved, so a pure sideways shift was outside the instrument. It now records `marginLeft`/`Right`,
  `paddingLeft`/`Right` and `textAlign`; proven by re-introducing the break, which takes it from 0
  changed nodes to 2. Related: `referenceCssDiff.mjs` used to compare `!important` as part of a
  value, so `margin: 0 !important` read as differing from `margin: 0` — which is what made deleting
  it look like closing a gap. It strips the flag now, since it models declarations and not the
  cascade.
- **A comparison tool's skip list is load-bearing, and "verified equal in the browser" expires.**
  `referenceCssDiff.mjs` excluded `margin` and `margin-bottom` from comparison for any selector
  checked under a rename, with a comment saying they were set elsewhere in our cascade and confirmed
  equal. They were not: the reference gives `.admin-header` and `.reporting-header`
  `margin-bottom: 48px`, ours measured **0px and 16px**, and the cards sat flush against the intro
  text on a page the tool had just reported as **zero**. Removing those two from the skip surfaced 11
  real spacing differences on `/services` and one on `events`. The events one was a genuine false
  positive — `margin: 0 0 24px` against `margin-bottom: 24px` — which is now fixed properly, by
  expanding box shorthands into longhands rather than by adding an exception. Two rules follow:
  spacing is precisely what a reader expects a declaration diff to catch, so it must never be
  skipped; and a skip whose justification is a past measurement needs that measurement re-run, not
  re-read.
- **A tool that treats `@layer` like `@media` is blind to whatever is inside it.** `referenceCssDiff.mjs`
  collected `@layer` rules into the media bucket, which it never compares — so every rule in
  `@layer components` (`.vf-section`, `.vf-split__icon`, …) was reported as **absent from the build**
  while sitting in the file. A cascade layer is not a conditional group: its rules apply at every
  viewport, they only lose priority ties. Fixed; the events family still read zero afterwards, so
  nothing had been resting on it. The general shape: when a checker buckets rules by at-rule, check
  which at-rules are *conditional* and which merely reorder.
- **The reference does not always render what the reference declares.** `/services` has
  `<i class="ph-duotone ph-activity">` above a heading, with CSS for it — and draws nothing, because
  `ph-activity` is not in Phosphor's duotone set. Measured: `width: 0, height: 0`, `::before` content
  `none`, while a sibling `.reporting-card-icon i` on the same page resolves to a real 24px glyph, so
  the webfont had loaded and only the name was wrong. Ours drew one because Phosphor **React** has
  `activity`. Before porting or removing something on the strength of a screenshot, check whether the
  reference is *expressing* an intent it failed to execute — and say which of the two you are matching.
- **`.prose` has two owners, and each one hides a different half of the bug.** The reference uses a
  plain `.prose` class, ported at `globals.css:4192–4208`; `@tailwindcss/typography` is also enabled
  (`globals.css:25`) and owns the same name. Measured on the event detail page: the body computed
  `max-width: 594.648px` (65ch) and `font-size: 16px` against the reference's **1132px / 18px** — our
  port declares neither property, so the plugin's won unopposed. The legal pages had the same 16px.
  The trap is the obvious fix: our port declares no `font-weight` either, so **every heading and every
  `<strong>` on those pages was getting its weight from the plugin**, and simply dropping the class
  takes the bold with it (`@layer base` resets `h1…h6` to `font-weight: unset` → 400). The event page
  now uses its own `.event-body` scope with weights declared explicitly, as `.art-body` does. Two more
  headings were found at 400 the same way — `.event-presenters__heading` and
  `.art-attachments__heading`, the latter live on the article page too. **When a class name is shared
  with a plugin, read the computed value; the source file cannot tell you who won.**
- **"Visually inert" is not "unchanged", and only the snapshot knows the difference.** A new variant's
  whole claim was that it moves no other page. `.vf-split__media--placeholder { flex-direction:
  column; gap: 12px }` was written unscoped on the reasoning that stacking a *single* child does
  nothing — which is true, and it still moved `row-gap` from `normal` to `12px` on six boxes across
  `/`, `/about`, `/services` and `/ime`. Gating it on `:has(.vf-split__placeholder-icon)` took the
  compare down to the one intended route plus the usual `/in-the-loop` scroll-reveal frame. Reason
  about the *selector's* reach, not the rendering's; "it looks the same" is not the claim being made
  when you say a default changed nothing.
- **A two-state control proven on a page that lacks the content proves nothing.** The dot-bullet
  variant was first verified on `/services`: the modifier appeared, and "the default ticks are gone"
  passed. Both were true and worthless — only `reporting-services` and `/style-guide` have any
  bullets at all, so the tick count was zero before the change too. Re-pointed at `/style-guide`,
  where it goes **5 → 0 → 5**, the assertion has content. (**`/style-guide` was removed on
  2026-08-20**, so `reporting-services` is now the only page with bullets and the only place this
  can be proven; the lesson stands, the second control does not.) This is the positive-control rule again in
  its most seductive form: the check *did* find the page, *did* find the section, and still measured
  an empty set. Assert a non-zero count in the "before" state, or the "after" state means nothing.
- **The reference's `:first-child` is rarely our `:first-child`.** Its rows sit in a dedicated
  `.rs-services-rows` wrapper; ours are siblings of the section header inside `.vf-section__inner`,
  so `:first-child` matches the *header* and the first row keeps the rule it was supposed to lose.
  `:first-of-type` fails identically — both are `div`. The working form is the adjacent sibling:
  `.vf-section-header + .vf-split`. Whenever a ported rule depends on position, diff the two DOM
  shapes before trusting the selector; the CSS is valid either way and simply matches nothing.
- **A shared "tidy the last child" rule will close a gap the reference is relying on.**
  `.vf-split__body p:last-child { margin-bottom: 0 }` exists to stop trailing space. On a row whose
  body is a *single* paragraph, that paragraph is both first and last — so the reference's 20px
  below the description, which is what separates it from the "When to Request" label, computed to
  **0px**. The fix is to not re-declare the zeroing inside the scope that needs the gap. Before
  porting a spacing value, check whether a `:last-child`/`:only-child` rule upstream will eat it.
- **Map every rule that contributes a declaration, not the one that looks equivalent.**
  `referenceCssDiff.mjs` reported `line-height: 1.75` against the reference's `1.8` while the browser
  correctly measured `1.8`. Not a CSS bug — an `IMPLEMENTED_AS` gap: the reference puts colour, size,
  line-height and margin on one element, ours splits them between a body wrapper and the paragraphs
  inside it, and only the paragraph rule had been listed. The list form exists precisely for this;
  omit a contributing rule and the tool reports a difference that is not there, which trains you to
  distrust it. Cross-check any single reported difference against `getComputedStyle` before changing
  CSS to satisfy the tool.
- **The orphan-field guard is blind to any field whose name is common across configs.** It joins every
  consumer file into ONE haystack and asks whether `readsField(haystack, name)` matches — deliberately,
  because scoping per collection produced false positives wherever a consumer reaches data through a
  helper. The cost is that a field called `icon` can never be reported: **27 files** in `src/blocks`,
  `src/components` and `src/heros` contain a `.icon` property read, so the pattern is satisfied no
  matter what. Measured consequence: `Accreditations.icon` was declared, described in the admin as
  driving "the profile chips", and read by **nothing** — the specialist profile hardcoded `seal-check`
  — and the guard was green throughout. The same hole covers `title`, `description`, `link` and any
  other shared name. When adding a field with a common name, check its consumer by hand; the suite
  will not do it for you.
- **A blanket property skip in a comparison tool is not a reason, it is an unexamined habit — and
  `color` was one.** `referenceCssDiff.mjs` skipped `position`, `z-index`, `overflow` and **`color`**
  for every aliased selector. That is how a *reported* defect survived a family reading zero: the
  /ime "What's Included" label renders brand blue in the reference and rendered `rgb(34,34,34)` here.
  Worse, the skip sat directly above a comment narrating the identical lesson about `margin` — which
  had been removed from that same list after hiding 11 real spacing gaps. Deleting `color` surfaced
  **five** more across three families: one real (the /services placeholder caption, still
  50%-translucent primary against an opaque reference literal) and four token-resolution artefacts,
  each then measured in the browser before being excused. If a checker excludes a property, the
  exclusion needs a per-case reason in `EXPLAINED` with a measurement, never a global list.
- **A `null` in `IMPLEMENTED_AS` deletes a selector from the comparison, so its justification has to
  be true.** `'.ime-format-included-text span': null` carried the comment *"no rule of its own on
  either side; both inherit body type"*. The reference declares three properties on it, and ours
  declared none — the detail descriptions rendered at **18px/30.6px against 12.8px/19.84px**, which is
  why those cards ran far taller than the reference's. The tool cannot check a claim like that; only
  reading the reference can. Treat every `null` mapping as an assertion needing evidence.
- **A BEM parent class can be absent while all its children are present, and the page still looks
  right.** `/contact`'s portal card renders correctly, and `.ct-portal-card` — the *bare* class —
  never reaches the DOM at all; only `__head`, `__label`, `__text`, `__btn` and `__features` do. So
  the three rules scoped to `.ct-page .ct-portal-card` (globals.css 9182, 9201, 9202) are dead, and
  were invisible because a *separate* live rule (`.ct-enquiry-grid .ct-portal-card__btn`) already
  supplies the same treatment. Checking for `ct-portal-card` with a substring grep says "present" —
  every child class contains it. Split the class attribute into a set and test membership, and keep a
  child class as the positive control. Note the fix is not simply to add the parent class: the dead
  rule sets `margin: 12px 0 4px` where the live one sets `margin-top: 12px`, so restoring it would
  move the page.
- **A page-scoped `cssClass` is stored data, so CSS written against one is unreachable until a repair
  puts the class in the database.** `/specialists/join-expert-panel` had a complete, correct port of its
  enquiry band — the 1fr 1.5fr grid, the left-aligned intro, the form promoted to a card — hung off four
  `vf-join-eoi*` classes that a seed fixture set and `authorPage` never delivered. Measured: **zero**
  `cssClass` rows for that page, no `vf-join-eoi*` class in the served HTML, and ~110 lines of dead CSS
  while the page shipped centred and uncarded. One of the five selectors was single-hyphen against a
  BEM double-underscore fixture and could not have matched even with the data present. This is the
  strongest argument for the "prefer a block variant over a page-scoped class" rule above: a **field
  travels with the block**, and cannot be silently absent. When you do find CSS that renders nothing,
  check whether its hook is stored data before assuming the selector is wrong.
- **A form-builder `fields` override REPLACES arrays, it does not extend them.** The plugin merges with
  `deepMergeWithSourceArrays`, whose documented behaviour is *"arrays in the target are replaced by the
  source's"*. Passing `{ fields: [placeholderField] }` to `formBuilderPlugin({ fields: { text: … } })`
  would wipe each block's real fields — name, label, width, required — and leave only the addition.
  Append inside `formOverrides.fields` instead, where you can map over the built blocks without
  restating anything the plugin already defines.
- **A diff family's zero is scoped to its `match` regex, not to the page it is named after.** The `ime`
  family matches `/^\.ime-format/` and `jme` matches `/^\.jme-process/`. Both read zero for months while
  a *second* section on each of those same two pages — the `.ime-claim-*` and `.jme-faq-*` accordions —
  was covered by nothing at all, and there was no Information Centre family in existence. So "the `ime`
  family is zero" was repeatedly read as "the /ime page is right". Measured once the families existed:
  15 and 13 reference selectors respectively, absent from the build. Before trusting a family, print the
  reference selectors it actually collected and check that against the sections on the page; a checker
  that silently measures a subset reads exactly like one that found nothing wrong.
- **A `var()` with a fallback renders correctly and is opaque to a declaration diff.**
  `border-top: 1px solid var(--vf-faq-rule, #e2e8f0)` computes to the reference's literal in every case
  where nothing sets the custom property, and still reports as differing forever. Where a default exists
  to be compared, declare the literal and let the variants override it — the CSS is simpler *and*
  checkable. The same applies to shorthands: a variant that sets only `border-color` cannot close a
  reference `border-top`, so the variant declares the whole shorthand.
- **A structural difference is not automatically a visual one — but only enumeration can tell you which.**
  The reference hangs its accordion hairlines off the list's `border-top` plus every item's
  `border-bottom`; ours off every item's `border-top` plus `:last-child`. That reads as four differing
  declarations. Walking the DOM and collecting every border with a non-zero width settled it: 10 rules on
  both sides on /ime, one colour, spanning an identical 763px; 6 on both on /jme, same colour, identical
  440px. Count the rendered artefacts before either "fixing" a construction or excusing it — and note
  that the reference used *both* constructions across its own pages, so some family must carry the note.
- **A page-scoped `cssClass` can fail the same way twice on the same page, directly beneath the
  comment warning about it.** `/specialists/join-expert-panel` had its enquiry band rebuilt as block
  fields precisely because four `.vf-join-eoi*` classes never reached the database — and the block
  immediately below that write-up was hung off `.vf-join-benefits`, which never reached it either.
  Measured: **65** `cssClass` rows sitewide, **zero** for that page, so ~50 lines of correct CSS were
  dead and the cards rendered the bare `.service-card` — icon tile, left-aligned text, the
  neo-brutalist diagonal hover — against a reference that is centred, plainly iconed and gently
  lifted. The user reported three separate faults; there was one cause. A sitewide audit
  (`pages_texts.path LIKE '%cssClass%'` against every class the fixtures set) found it was the last
  one. **When a fix "does nothing", check whether its hook is stored data before re-reading the CSS**
  — and note the audit needs both lists sorted, since `comm` on unsorted input silently reports
  garbage (caught here only because the positive control `ct-page` failed).
- **Before porting a value the reference declares, count how many of its 108 pages declare it.**
  `/specialists/join-expert-panel` sets `.section-title { font-weight: 800 }` in its inline block;
  every other reference page renders the shared sheet's 700, which is what globals.css declares.
  Changing the global to close a one-page diff is the `.page-hero h1` mistake — that one moved 59
  pages and was written up as a *correction*, which is what stopped anyone re-checking it. One
  `grep` over all pages answers it; here it returned exactly one file, so the fix was a block field
  (`headingWeight`) rather than a global edit.
- **A diff family that reads zero may be measuring almost none of its page.** The
  `join-expert-panel` family matched only the enquiry form — **9 of that page's 46 reference
  selectors** — and read zero for months while the section above it shipped unstyled. This is the
  `match`-regex trap already recorded, now with a second instance on a different page, so treat
  "family X is zero" as a claim about a regex and never about a page. Print the selectors a family
  collects and check them against the sections that exist.
- **A control has to be the thing you meant to test.** Checking that the new `headingWeight` field
  had not leaked, `/for-clients`' first `.section-title` measured **800** — apparently a site-wide
  leak. It was not: that heading is a `.vf-split__title` inside `.vf-client-overview`, which has
  carried its own 800 since it was ported, and `document.querySelectorAll('.vf-headings--heavy')`
  returned **0** on that page. A control selected by `querySelector` position rather than by the
  property under test will eventually select something with its own reason to differ.
- **A declaration diff cannot see which BRANCH of a component renders.** The reference's
  `.event-list-calendar*` rules (`events.css:749-806`) are **dead in the reference** — leftovers its
  JS never uses, since it draws a blue "Event Photo" placeholder on every row. We ported them
  faithfully, which made every declaration match, so the `events` family read zero across **119**
  selectors while the pages rendered a completely different panel from the reference. A family's
  zero says the rules agree; it says nothing about which rule the markup reaches for. Where a
  component picks between two treatments, the guard has to be a rendered-DOM assertion.
- **A computed-style comparison only covers the properties you thought to list.** After unifying the
  events date glyph, a 10-property check reported the hub and the listing rows **identical** — and a
  screenshot showed "20 AUG" on one and "20 Aug" on the other. `.event-card-media` sets
  `text-transform: uppercase` and `letter-spacing: 0.1em`, both of which **inherit**, and
  `.cal-day`/`.cal-month` redeclare neither, so the difference lived entirely outside the list.
  Measured 56.0px against 47.5px for the same month. Same family as the `font-weight: unset` trap:
  when a ported element sits inside a differently-styled parent, enumerate the *inherited*
  properties — `text-transform`, `letter-spacing`, `font-weight`, `color`, `line-height`,
  `text-align` — not just the ones either rule declares.
- **`computedSnapshot`'s `ROUTES` is a claim about coverage, and it was wrong about `/events`.** It
  listed `/events` but neither `/events/upcoming-events` nor `/events/past-events` — the two pages
  whose rows a reader would assume it covered. Both added before capturing the baseline, per the
  rule already recorded; a route added afterwards has nothing to compare against and reads as clean.
  Worth noting their rows render **client-side**, so `curl | grep` finds zero `.event-list-row` on a
  page that has eight — `networkidle` plus the harness's settle does capture them (verified: 90
  article nodes), but any check on these pages must drive a browser.
- **An invalid `sizes` attribute fails by making the browser fetch the LARGEST candidate, and
  nothing anywhere says so.** `ImageMedia` emitted `(max-width: 1920px) 3840w, …`; `w` is a **srcset**
  descriptor and is not a valid `sizes` length, so the browser discarded the entire list, fell back to
  the `100vw` default and assumed every image spanned the viewport. No error, no console warning, no
  layout symptom — images were merely several times too big. Measured: a **1440×1651** file into a
  **320×367** box on a 4669 KB page. The list was also ordered widest-first, and `sizes` is
  first-match-wins, so the 1920 entry would have won at every viewport even with a valid unit. Read
  the attribute the browser actually receives, and compare `naturalWidth` against the rendered box.
- **A component that already applies a focal `object-position` must only ever be handed a WIDTH-ONLY
  derivative.** Payload's `square` and `og` sizes CROP — measured, `square` turns a 5246×6016 original
  into 500×**500**, aspect 0.872 → 1.0 — while our person cards crop again in CSS from the editor's
  focal point. Handing over a pre-cropped file crops twice and shifts every face on the site, and it
  would pass any byte or ratio check while doing so. The width-only ladder
  (`thumbnail`/`small`/`medium`/`large`/`xlarge`) preserves aspect exactly.
- **"Which derivative do I serve" has a fallback case that is the MAJORITY, not an edge.** Payload
  only generates a size smaller than the source, so a modest upload has **none**. Three of the four
  photos on `/about/meet-the-team` are 300×300 originals with zero derivatives; a helper that assumed
  `sizes.small` exists would have broken the common case while fixing the rare one. Prove both states
  in a single reading — the sized and the unsized rendering side by side — because a check pointed
  only at the big photo says nothing about the four beside it.
- **A rounded derivative is not the same aspect ratio as its original.** Payload rounds
  1359 × (600/4267) to **191**, so the logo's generated size is 0.07% wider than the source. With CSS
  setting a height and `width: auto`, the rendered logo moved 182.094px → 182.188px — 63 nodes in the
  computed snapshot, and the only layout movement from an image-sizing pass. Harmless here, but it
  means "sizes preserve the aspect ratio" is *approximately* true, and a comment claiming it exactly
  is wrong.
- **`object-fit: cover` on a Next `<Image>` does nothing unless the image is in `fill` mode.** Eight
  photographs sat in their tiles with a band of background showing beneath — box 530×398, image
  530×354 — while `getComputedStyle` reported `object-fit: cover` on the element the entire time.
  Without `fill`, Next emits width/height attributes and the browser sizes by the image's own aspect
  ratio; a `h-full` utility class never gets to apply. And `fill` positions absolutely, so the
  container needs `position: relative` — `.vf-split__media` was `static`, and adding `fill` alone
  would have anchored the photo to an ancestor further up and appeared to change nothing. Two blocks
  already had it right (`WhyVerify`, `LeadershipSpotlight`), which is the fastest way to tell the two
  states apart: compare against a call site that works rather than reading the CSS again.
- **A seed step that writes a page's layout BEFORE that page's authoring module runs silently
  disables the fixture — and only on a fresh install.** `seedVerify` used to place the contact form
  itself, guarded on `isPlaceholderLayout`. It ran ~12 seconds before `seedInfoBooking`, replaced the
  scaffold placeholder with a lone `formBlock`, and so made `isUnauthored` false: the real fixture
  logged *"contact already authored, skipping"* against a database ninety seconds old. Measured on a
  clean reseed — **/contact ended with 1 block instead of 13**, no portal card, no contact details,
  no map, **zero `cssClass` rows**, which in turn left `repairPortalEnquiry` with no
  `ct-portal-card__btn` anchor and made *it* a silent no-op too. An incrementally-grown database hides
  all of this, because the page was authored before the ordering existed; `links.e2e.spec.ts` caught
  it only after a wipe. **The box is a fresh install, so this would have shipped.** The pattern occurs
  three times and only one was a bug: `for-claimants` already worked around it with
  `authorPageReplace`, and `specialist-availability` is benign because the early build and the fixture
  are the same single block — so check whether the two layouts actually differ before "fixing" the
  next one.
- **A dev schema push that has already SUCCEEDED can retry and fail forever, and the symptom is a
  hanging page, not an error.** Adding an `iconField` creates a Postgres enum; the push created it,
  then a later push retried `CREATE TYPE … AS ENUM(…)` and died on *"type already exists"*, so
  `getPayload()` never settled and every request hung — `curl` returned nothing, and the only visible
  message in `.dev.log` was the unrelated pre-existing `instrumentation.ts` Edge Runtime warning. It
  reads exactly like a component you have just broken. **Check the database before believing drift**:
  here all four columns and both enums (live *and* `_pages_v`) were already present and correctly
  typed, so there was nothing to repair — `./stop.sh && rm -rf .next && ./start.sh` cleared it,
  source unchanged. Distinct from the destructive-DDL prompt already recorded: that one waits on
  input, this one loops on a redundant statement.
- **An OG image is served through the `og` derivative, which CROPS — so a wide logo cannot be the
  social image.** `generateMeta` reads `media.sizes.og.url`, and that size is `1200×630, crop:
  'center'`. Pointing the field at the 4267×1359 logo scaled it to 1978px wide and centre-cropped to
  1200, **losing 39% of the width**: the rendered derivative reads "VERI" over "MEDICO-LEGAL SOL"
  with the shield sliced in half. Nothing warns, and the field reads as set. Supply a source already
  at 1200×630 — the crop is then a no-op — and check the *derivative*, not the upload. Transparency
  is the second half: a PNG with alpha is composited by each platform onto its own, usually dark,
  background, which would have hidden the grey strapline entirely.
- **`sharp`'s `flatten()` is applied to the INPUT, before `composite()`, whatever order you call them
  in.** Building the share card as `sharp({create}).composite([logo]).flatten({background}).png()`
  produced a file that looked perfect and was still RGBA — `channels: 3` on the canvas does not help
  either, because compositing an RGBA overlay promotes it back to 4. The fix is a second pass:
  composite `.toBuffer()`, then `sharp(buffer).flatten(...)`. Read the colour type out of the PNG
  header (byte 25; 4 or 6 means alpha) rather than trusting that a white-looking image is opaque.
- **A regex bulk edit across a fixture file reaches further than the page you are editing.** Adding
  one field to five rows via `perl -0pi -e` matched **13** — every row in `seedServices.ts` with the
  same two-line preamble, including `/services`, which must not have it. It was caught by reading
  `git diff` before moving on, which is the only reason it did not ship. Count the matches and name
  the line numbers before accepting a bulk edit to seeded content; the fixtures for several pages
  live in one file and look alike by design.

- **`computedSnapshot.mjs` reports one differing node on two routes with the code unchanged.** Measured
  2026-08-20: three captures of the same tree, and `.vf-section__inner.container` on
  `/information-centre/for-clients` and `/for-claimants` flips `marginLeft`/`marginRight` between
  `0px` and the used `130px` — same node count, same `width`, direction reversing between runs. Probed
  directly at rest it is never `0px` (6 containers, 3 loads, both pages), so it is transient during the
  harness's own scroll-and-settle. Different signature from the `matrix(…)`/`opacity` reveal frames
  already recorded, and worth knowing before chasing it: **a one-node diff of that shape is noise**.
  Establish it the same way — capture twice without changing anything and diff the two; doing exactly
  that during the /contact note move reproduced the `/for-clients` node flipping back on identical
  code. **`/about` shows it too** — seen once, same node shape and the same `130px`↔`0px` pair — so
  the route list here is the set observed, not a closed one.

- **A comment that names a removed field in `object.property` form re-arms the orphan guard's blind
  spot.** `readsField` (`adminControls.int.spec.ts`) deliberately matches member access rather than a
  bare word, and it does not know what a comment is — so writing *"`labels.roleLabel` went with it"* in
  the very JSX comment explaining the removal made the field look consumed. Measured: re-adding
  `roleLabel` to `TeamSettings` with nothing rendering it **passed**. Reworded to avoid the dot form,
  the same break fails and names the field. The guard's own header warns that a comment can satisfy a
  bare-word match; this is the same hazard surviving the fix that was supposed to close it. Write
  removed fields as prose ("the Role label in Team Settings"), and re-run the break after editing any
  comment near a guard.

- **One field name serving two purposes in one component makes the orphan guard blind to both.**
  `PeopleGrid` reads `department` twice: the block's own filter (which documents it) and each team
  member's `department` (which groups them). Deleting the filter read entirely still **passed** —
  `readsField` only asks whether *something* in that file reads a property of that name. Measured; it
  is the common-name hole CLAUDE.md already records for `icon` and `title`, now in a form where both
  reads live in the same file. The filter was proven by hand instead, which is the only way: setting
  it to Client Support took Meet the Team from four groups to one of four cards, and unsetting it
  restored all four. When a block field shares a name with the record field it filters on, check it in
  the browser and do not trust the suite.

- **A carousel that recovers only in `transitionend` has no recovery once clicks outrun the
  transition.** `SlideCarousel` tracked an unbounded `pos` and snapped the clone back only when
  `onTransitionEnd` saw exactly `count + 1` or `0`. Rapid clicks keep restarting the 0.55s transform,
  so the event does not fire until the LAST click settles — by then `pos` is past the end and matches
  neither branch. Measured on `/events`: 8 fast clicks left the track at `translateX(-9702px)`,
  position 9 of a 6-card track, with **no slide in the viewport**. The tell is that it reads as a
  rendering bug: the dots kept highlighting, because the active dot is computed with modulo, so it
  looked like a working carousel that had lost its content. Bound the position at the point of
  *change*; a recovery keyed on exact values is not a bound. `FeaturedArticles` was unaffected — it
  advances with `(c + 1) % count`.
- **Playwright's `click()` waits for the element to be stable, so a "rapid click" test is not rapid.**
  The regression spec for the carousel above was written first and **passed against the broken
  component** — inside a track under a 0.55s transform transition, actionability checks made each
  click wait out the animation, so the burst arrived slower than the bug needs. `{ force: true }`
  skips those checks and it went red immediately, naming the exact position. Same family as the
  probes already recorded here: a check that quietly does something gentler than the thing you meant
  to test reads exactly like a check that found nothing wrong.

### CSS token tooling

`tests/visual/` holds five Node scripts that `pnpm test` does **not** run (the two codemods share
a bullet):

- `node tests/visual/computedSnapshot.mjs capture|compare baseline` — computed-style snapshot
  gate against a running `:3000`, keyed by structural index path rather than class name (class
  names are what the migrations change). Token replacements are value-preserving by
  construction, so the expected diff is empty; any diff is a real bug, not a tolerance.
  It measures **39** properties over **21** routes — `width`/`height`/`gridTemplateColumns`/
  `transform` are in that set, which is what makes it catch a reflow and not just a repaint, but
  that is still a subset of the **27** URLs in the pages sitemap, and it never triggers `:hover`.
  All three numbers re-counted 2026-08-21 (`grep -c '<loc>' ` over `/pages-sitemap.xml`, and the
  arrays themselves); they had drifted to "40 over 18" here and "18 of 28" in the file's own
  comment, while the list held 21 — so re-count rather than quoting these. Capture immediately before a change and compare immediately after;
  baselines are gitignored because any content change invalidates them. `capture` refuses a non-200 — it used to bank the 404 page as a
  baseline for two routes that do not exist.
- `node tests/visual/tokenise.mjs <4a|4b|4c|4d> [--dry]` and
  `node tests/visual/tokeniseShape.mjs <radius|gradient> [--dry]` — one-shot codemods over
  `globals.css` (colour literals → `var()`/`color-mix()`, radius/gradient literals → tokens).
  Their carve-outs are deliberate and documented in the file headers.
- `node tests/visual/referenceCssDiff.mjs <family> [--verbose]` — diffs every CSS declaration the
  design reference makes for a selector family against `globals.css`, and exits non-zero until the
  count is zero. **Thirteen families**: `events`, `services`, `ime`, `jme`, `admin-services`,
  `reporting-services`, `specialist-profile`, `for-clients`, `faq-claimants`, `faq-clients`,
  `ime-claims`, `jme-faq`, `join-expert-panel`; all read zero, so any non-zero is something you just did. Resolves each side's
  `:root` **separately** (both define `--radius`, and they disagree — 8px there, 0.5rem here),
  compares font tokens by *name* because the brand typeface is a deliberate deviation, and merges
  base+override rules where we implement a bespoke reference selector through a shared component.
  Three lists are deliberate exceptions and must stay honest: `NOT_PORTED` (with a reason each),
  `IMPLEMENTED_AS`, and `EXPLAINED` (per-declaration, for differences that cannot close — an
  editor-controlled spacing preset against the reference's literal, `stroke` on a filled Phosphor
  icon). **A zero is necessary, not sufficient** — it proves a rule is in the file, not that it
  reached the page. Always confirm with `getComputedStyle`.

  Two failure modes of the tool itself, both seen: **a mapping that lists only the closest-looking
  selector under-reports**, because our scoped rules split across a wrapper and its children while the
  reference declares everything on one element — that produced a phantom `line-height` difference the
  browser disagreed with, and the fix is the list form of `IMPLEMENTED_AS`, not a CSS edit. And **an
  exception entry ages**: `NOT_PORTED`/`EXPLAINED` reasons that cite a past measurement need the
  measurement re-run, not re-read. A skip justified by "verified equal in the browser" was once false
  and hid 11 real spacing gaps.
- `node tests/visual/findFalseHover.mjs [--verbose]` — finds hover effects on elements nothing can
  click. Parses every `:hover` rule in `globals.css` **from disk** (never `document.styleSheets`,
  which throws cross-sheet and reports zero for everything), takes the compound that actually bears
  the pseudo-class — `.card:hover .title` → `.card` — and reports matches that are not interactive,
  contain nothing interactive and sit inside nothing interactive. Rules that *neutralise* a hover
  (`.vf-hover-none .vf-card:hover { transform: none }`, the editor's "no hover effect" option) are
  skipped, or the tool would tell you to delete the fix. Routes come from the sitemaps, not a
  hand-written list. **Candidates, not a verdict** — a row highlighted for readability is legitimate.
  Baseline 2026-08-23: 15 before the portal-tile fix, **14** after.
- `node tests/visual/findDeadCss.mjs` — emits **candidates, not a verdict**. It has already
  produced false positives that would each have broken a live page; read the header's caveats
  before deleting any selector.

### Content model

`payload.config.ts` registers taxonomy lookups before the content that references them. The
specialist data layer is a 4-axis taxonomy — `specialties` (+ `specialty-categories`),
`claim-types`, `assessment-types`, `areas-of-expertise` — with `accreditations`, `locations`,
`departments` (the teams staff are grouped into, replacing a four-value select) and
`streams` alongside. Content collections: Pages, Posts, Media, Categories, Users, Specialists,
Team, Events, AvailabilitySessions, Services, Resources, Offices, Testimonials. Directory blocks
(`SpecialistDirectory`, `SpecialtyDirectory`, `EventsExplorer`) filter on those taxonomies, so new
filter axes are added as collections, not as hardcoded option lists.

Globals: Header, Footer, SiteSettings, SpecialistAvailability, SpecialistProfile, ArticleSettings,
EventsSettings, TeamSettings, CustomStyles, DesignSystem.

**Admin labels deliberately follow the site, not the slug** — `posts` shows as **Articles**,
`categories` as **Topics**, `areas-of-expertise` as **Assessment Areas**. The sidebar groups are
Publishing / Reference / Taxonomy / People / Availability / Media / System / Forms / Page settings /
Site / Design; every group holds either records or settings, never both. See `ADMIN-GUIDE.md`. Page-level and section-level copy lives
in globals rather than in components.

**Event timing** is two separate questions, resolved by one helper
(`src/utilities/eventTiming.ts`) that both the detail page and the events listing call:

- `isPast` — from `date`, compared **start-of-day**, so an event stays "Upcoming" for the whole of
  the day it is held. Drives the status badge, the "Event Recap" heading and the listing's
  upcoming/past split.
- `registrationOpen` — from the editable `registrationClosesAt`, falling back to the event start
  when empty. Drives the CTA ("Register Your Interest" vs "Contact Us") and nothing else.

They are allowed to disagree: an event can be under way, or have finished this morning, and still be
taking expressions of interest. Before this, one boolean compared against the *start* time drove
both, so an all-day seminar read "Past Event / Contact Us" from 9am — and the listing (which already
compared start-of-day) disagreed with the detail page about the same event. `now` is a parameter so
the statically-rendered listing can pass the browser's clock instead of a build-time "today".

### Caching and revalidation

Globals are read through `getCachedGlobal(slug, depth)`, tagged `global_<slug>`; the matching
`afterChange` hook calls `revalidateGlobal(slug)` (or a per-global hook for Header/Footer).
Collections with a detail page (Pages, Posts, Specialists, Team, Events, AvailabilitySessions)
have their own `hooks/revalidate<Name>.ts` targeting the path built by `routes.ts` — these also
purge the old path when a published doc moves, and the relevant `<name>-sitemap` tag. Pages
additionally purge `global_header`/`global_footer` on structural changes, because the nav is read
through `unstable_cache` and `revalidatePath` alone won't refresh it.
**All of these go through `src/utilities/safeRevalidate.ts`, never `next/cache` directly** — see the
Invariants table for what an unguarded call did to the admin's Create view. On top of that, most content
collections also run the shared `revalidateSiteOnChange`/`revalidateSiteOnDelete`
(`src/utilities/revalidateSite.ts`), because their docs also surface inside blocks, directories and
archives across arbitrary pages; that hook does `revalidatePath('/', 'layout')` — cheap, because
Next regenerates lazily. Seeding sets `context.disableRevalidate` to avoid a revalidation storm;
respect that flag in any new hook.

### Design reference

`.design-reference/` holds the static HTML target for the redesign, and
`verify-website-design-diff.md` is the running log of target-vs-build gaps. Consult both when
implementing visual work.
