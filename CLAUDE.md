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
| **Don't cache a value that is already stable.** For a `useSyncExternalStore` snapshot, prefer a naturally-stable computation over a module-level memo. | `startOfDay(Date.now())` already returns the same number all day. Memoising it in a module variable froze "today" for the life of the JS bundle — which outlives a page, since client-side navigation doesn't re-evaluate modules — so a tab open overnight never re-bucketed events. |

## Commands

```bash
pnpm dev                  # http://localhost:3000 (admin at /admin), binds 0.0.0.0
./start.sh / ./stop.sh    # same server backgrounded → .dev.log / .dev.pid (LAN-shareable)
pnpm dev:prod             # clean build + start — needs LOCAL_PROD_REPRO=1 in .env (see Local development)
pnpm lint                 # eslint (pnpm lint:fix to autofix)
pnpm test                 # int + e2e
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

### CSS token tooling

`tests/visual/` holds four Node scripts that `pnpm test` does **not** run:

- `node tests/visual/computedSnapshot.mjs capture|compare baseline` — computed-style snapshot
  gate against a running `:3000`, keyed by structural index path rather than class name (class
  names are what the migrations change). Token replacements are value-preserving by
  construction, so the expected diff is empty; any diff is a real bug, not a tolerance.
- `node tests/visual/tokenise.mjs <4a|4b|4c|4d> [--dry]` and
  `node tests/visual/tokeniseShape.mjs <radius|gradient> [--dry]` — one-shot codemods over
  `globals.css` (colour literals → `var()`/`color-mix()`, radius/gradient literals → tokens).
  Their carve-outs are deliberate and documented in the file headers.
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
