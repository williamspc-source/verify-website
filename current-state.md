# Current state

**Snapshot: 2026-08-17.** Where the project actually stands — what is working, what is not, and what
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
| `verify-website-design-diff.md` | Design reference vs build, page by page. **Comparison 32 is the latest**; 22 is the last full cross-page audit |
| `REVIEW-CHECKLIST.md` | Every page and block, to tick off during manual review. Working document — it is spent once the review is done |

---

## Stack

Next.js 16.2.6 (App Router) · Payload 3.85.0 (Postgres) · React 19.2.6 · Tailwind 4 · `pnpm`.
One application serves both the public site and `/admin`.

---

## What is working well

**The build is green on every gate.** Measured 2026-08-17, not carried over from an earlier pass:

| Gate | Result |
|---|---|
| `pnpm exec tsc --noEmit` | clean |
| `pnpm lint` | clean — no errors, no warnings, no new suppressions |
| `pnpm test:int` | **131/131**, 6 files |
| `pnpm test:e2e` | **19/19**, 59.2s |

> The e2e run was against the **production** server on `:3000`, and the admin spec that
> `OUTSTANDING.md` §2 reports as intermittent did not flake. That is consistent with §2's diagnosis
> — the failure is a 5s timeout against a cold Turbopack compile — and suggests the flake is
> confined to dev-server runs. One clean run is not proof; do not close §2 on it.

**The content model is complete and populated.** 21 collections, 10 globals, and 113 live URLs
across five sitemaps — 28 pages, 24 posts, 26 specialists, 19 team, 16 events. Nothing is a stub.

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

### 1. The box is out of date and is being rebuilt from scratch

The version deployed on the Proxmox box predates the data layer, the branding work and the whole
redesign. **The decision is to wipe it and do a fresh install rather than migrate.** Nothing in the
live database needs preserving — no editor content, no uploads, no submissions.

**This decision retires the single largest risk in the repo.** `OUTSTANDING.md` §1 describes a
catch-up migration that drops five columns, needs a hand-pasted `USING` clause for two
`varchar → jsonb` conversions, and carries a pre-flight SQL check against live data. All of that
exists *only* to protect data on the current box. With the database discarded, the correct move is
instead:

> Delete `src/migrations/20260705_105320_baseline.{ts,json}`, empty the array in
> `src/migrations/index.ts`, and generate **one fresh baseline** from the current schema.

That produces a single `CREATE TABLE` migration: no drops, no type conversions, no pre-flight, and
nothing to hand-review for data loss. **Do it last**, once the polishing work has stopped changing
fields — a superseded migration file in `src/migrations/` is a trap, because someone will run it.

Current drift, re-measured 2026-08-17 (`verify_cms` against the checked-in baseline):

| | Baseline | Now |
|---|---|---|
| Columns | 3207 | 3386 |
| Tables | 301 | 303 |
| Indexes | 946 | 1266 |

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

The next input is your pass through `REVIEW-CHECKLIST.md`.

### 3. Smaller known items

Each is measured and justified in `OUTSTANDING.md` — do not re-derive them:

- **§2** `admin.e2e.spec.ts` fails intermittently in a full run — a default 5s timeout against a
  cold admin bundle, not an admin fault. Test-only.
- **§3** The three Payload-template hero types render their title at weight 400. No page uses one,
  but the dropdown offers them. Removing them needs a data migration over `_pages_v` history.
- **§4** `.contact-form` padding follows the reference's superseded rule. Needs someone who knows
  the design to say which value is intended.

### 4. Uncommitted in the working tree

Six team photographs are deleted on disk but still tracked:

```
public/assets/images/team/{evie-le,jaynalyn-malijan,jefferson-cortez,
                           kimberly-patente,ricaliza-perlas,zenuel-bermundo}.png
```

Nothing in `src/` references those paths (checked with a positive control), and none of the six
appear in the reference's team roster — so this looks like a deliberate roster change. **But
`Evie Le` is still an author in `src/endpoints/seed/data/posts.ts`.** Resolve the two together:
either commit the deletions and drop the seed reference, or restore the files.

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
