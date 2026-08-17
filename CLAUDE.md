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

Six documents describe this repo to someone who was not there. **A change lands in all the ones it
touches, in the same pass, or the set starts lying** — and a reader cannot tell which one is stale.

| File | Holds | Reader |
|---|---|---|
| `CLAUDE.md` | Architecture, invariants, traps | Whoever changes the code |
| `OUTSTANDING.md` | What is knowingly imperfect, and what fixing it costs | Whoever inherits it |
| `README.md` | Running, testing, deploying, and where images go | Whoever maintains it |
| `src/Styles/HOOKS.md` | Every editable control and where it lives | The non-technical editor |
| `HOMEPAGE-CHANGES.md` | Design-reference audit, pass by pass | Whoever asked for the work |
| `current-state.md` | Status *now*: what works, what is open, how to get it onto the box | Whoever is driving the work |

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
| **A component that hardcodes `appearance="inline"` must have `appearances: false` in its config**, or read `.appearance` itself. | `CMSLink` destructures `appearance`, so a literal after `{...link}` wins and the editor's stored choice is discarded. |
| **Queries against draft-enabled collections pass `overrideAccess` explicitly.** The Local API defaults to `overrideAccess: true`. | A legacy `/specialists/<slug>` URL matched *unpublished* specialists and 308'd to a profile that 404s — while its own comment claimed it checked for published ones. |
| **After any collection/global field change:** `pnpm generate:types` locally, `migrate:create` + `migrate` on the box. Dev auto-push hides schema drift. | The checked-in baseline silently fell behind by ~29 FK columns plus several new fields. |
| **A guard that has never failed is not evidence.** Every test in `adminControls.int.spec.ts` records the deliberate break used to prove it goes red. Re-run it if you change the test (`zsh tests/int/prove-guards.sh`). | Three of four guard patterns were structurally incapable of failing — one asserted an array it never wrote to — and "94/94 passing" was reported as proof the work was sound. |
| **A helper takes the narrowest input that answers the question.** Don't accept a wide all-optional shape and return several answers; a caller holding a partial object will get a confident answer to a question it supplied no data for, and TypeScript will not object. | `eventTiming()` accepted `{date?, registrationClosesAt?}` and returned both `isPast` and `registrationOpen`. The events listing passes an `EventItem`, which has no `registrationClosesAt` — it compiled, and a wrong `registrationOpen` sat there waiting to be read. Split out `isEventPast(EventDateInput)`. |
| **A "read this field" check must not count code that *writes* it.** | The orphan-field guard's haystack included `src/endpoints`, where the seed writes `{ hoursNote: '…' }`. That looks identical to a read, so every seeded field appeared consumed — measured: deleting the only renderer of `Offices.hoursNote` still passed. |
| **An in-page anchor link is two halves: the link *and* the target.** Fixing one without the other is invisible. Guarded by `tests/e2e/links.e2e.spec.ts`. | The homepage's Videolink link was corrected to `#videolink-appointment` and the guide still opened on In-Person — the anchor ids had never reached the database, because `seedInfoBooking` early-returns on an authored page. The href looked right in every check that read hrefs. |
| **Content links live in the database, so a seed edit alone fixes nothing.** Pair every link correction with an unconditional repair (`src/endpoints/seed/seedLinkRepairs.ts`, run from `seedVerify`). | The seed had *already* been corrected to canonical paths. Every existing install, the box included, still served the old ones: 30 links across 9 pages on flat legacy paths that only resolved through a 308. |
| **"Has this been written yet?" is answered by `isUnauthored` (`src/endpoints/seed/authored.ts`) — never by counting blocks.** A repair writes only into an *absence*: a missing block, a superseded string, an empty field. Guarded by `tests/int/seedAuthored.int.spec.ts`. | All seven `authorPage` guards asked `layout.length > 2`, which is a proxy for "looks substantial", not "someone wrote this" — so **13 of 27 pages** were rewritten from the fixture on every seed run, discarding editor changes. Proven: the events hero was reworded to `EDITOR WORDING TEST`, the seed re-run, and the fixture wording came back. The correct predicate already existed as `isPlaceholderLayout`, used only by the two pages built outside `authorPage`. |
| **An id a link can target must be in the server HTML, and the id and the link must come from one function** (`src/utilities/headingId.ts`; opt in per `RichText` with `headingIds`). Assigning ids in a `useEffect` is too late for the browser and too late to be worth doing. | Article heading ids were assigned by `ArticleToc` on mount, so a *pasted* `…/article#section` URL found nothing and stayed at the top — the browser resolves a fragment while parsing. Restoring that mount loop as a test break confirmed it: `scrollY 0`, heading still resting at y=972. The two slugify copies (one for the contents hrefs, one for the ids) were also free to drift, and a drifted pair renders perfectly and does nothing. |
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
```

Single test: `pnpm test:int tests/int/api.int.spec.ts -t "name"` ·
`pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "name"`.

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
  section background, card design, and every slide *body*, which were paraphrases from `seedShowcase`.
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

### CSS token tooling

`tests/visual/` holds four Node scripts that `pnpm test` does **not** run:

- `node tests/visual/computedSnapshot.mjs capture|compare baseline` — computed-style snapshot
  gate against a running `:3000`, keyed by structural index path rather than class name (class
  names are what the migrations change). Token replacements are value-preserving by
  construction, so the expected diff is empty; any diff is a real bug, not a tolerance.
  It measures **34** properties over **14** routes — `width`/`height`/`gridTemplateColumns`/
  `transform` are in that set, which is what makes it catch a reflow and not just a repaint, but
  14 routes is 14 of the site's 29 pages and it never triggers `:hover`. Capture immediately
  before a change and compare immediately after; baselines are gitignored because any content
  change invalidates them. `capture` refuses a non-200 — it used to bank the 404 page as a
  baseline for two routes that do not exist.
- `node tests/visual/tokenise.mjs <4a|4b|4c|4d> [--dry]` and
  `node tests/visual/tokeniseShape.mjs <radius|gradient> [--dry]` — one-shot codemods over
  `globals.css` (colour literals → `var()`/`color-mix()`, radius/gradient literals → tokens).
  Their carve-outs are deliberate and documented in the file headers.
- `node tests/visual/referenceCssDiff.mjs <family> [--verbose]` — diffs every CSS declaration the
  design reference makes for a selector family against `globals.css`, and exits non-zero until the
  count is zero. Resolves each side's `:root` **separately** (both define `--radius`, and they
  disagree — 8px there, 0.5rem here), compares font tokens by *name* because the brand typeface is a
  deliberate deviation, and merges base+override rules where we implement a bespoke reference selector
  through a shared component. Two lists are deliberate exceptions and must stay honest: `NOT_PORTED`
  (with a reason each), `IMPLEMENTED_AS`, and `EXPLAINED` (per-declaration, for differences that
  cannot close — an editor-controlled spacing preset against the reference's literal, `stroke` on a
  filled Phosphor icon). **A zero is necessary, not sufficient** — it proves a rule
  is in the file, not that it reached the page. Always confirm with `getComputedStyle`.
- `node tests/visual/findDeadCss.mjs` — emits **candidates, not a verdict**. It has already
  produced false positives that would each have broken a live page; read the header's caveats
  before deleting any selector.

### Content model

`payload.config.ts` registers taxonomy lookups before the content that references them. The
specialist data layer is a 4-axis taxonomy — `specialties` (+ `specialty-categories`),
`claim-types`, `assessment-types`, `areas-of-expertise` — with `accreditations`, `locations` and
`streams` alongside. Content collections: Pages, Posts, Media, Categories, Users, Specialists,
Team, Events, AvailabilitySessions, Services, Resources, Offices, Testimonials. Directory blocks
(`SpecialistDirectory`, `SpecialtyDirectory`, `EventsExplorer`) filter on those taxonomies, so new
filter axes are added as collections, not as hardcoded option lists.

Globals: Header, Footer, SiteSettings, SpecialistAvailability, SpecialistProfile, ArticleSettings,
EventsSettings, TeamSettings, CustomStyles, DesignSystem. Page-level and section-level copy lives
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
through `unstable_cache` and `revalidatePath` alone won't refresh it. On top of that, most content
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
