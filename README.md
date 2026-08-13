# VERIFY Medico-Legal Solutions — website

Next.js 16 (App Router) + Payload 3 (Postgres), Tailwind 4, `pnpm`.

The public site and the admin are one application. Content is edited at `/admin` and goes live on
save — there is no separate publish step beyond each document's Draft/Published toggle, and no
deploy needed for a content change.

**If you are taking this over and do not write code, read `src/Styles/HOOKS.md`.** It is the
editor's manual: where every colour, font, spacing and corner-rounding control lives, what each one
reaches, and what to do when a change appears not to work. This file is for whoever maintains the
code.

**If you are taking over the code, read [`OUTSTANDING.md`](OUTSTANDING.md) first.** It is the
register of what is knowingly imperfect — measured impact, what fixing each costs, and one item
(the migration) that blocks the next deploy until it is done.

---

## Running it locally

```bash
pnpm install
cp .env.example .env      # then fill in DATABASE_URL and PAYLOAD_SECRET
pnpm dev                  # http://localhost:3000, admin at /admin
```

Requires Postgres. Local development uses a dedicated `verify_cms` database and never touches
production. See `CLAUDE.md` for the full local setup, including the seed endpoint.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on `:3000` (binds `0.0.0.0`) |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm dev:prod` | Build + serve in production mode locally — needs `LOCAL_PROD_REPRO=1` (below) |
| `pnpm lint` | ESLint |
| `pnpm test` | Integration (vitest) + e2e (playwright) |
| `pnpm test:int` | Integration only — includes the admin-control guards below |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after ANY field change |
| `pnpm generate:importmap` | Regenerate the admin import map after adding a custom admin component |
| `pnpm exec tsc --noEmit` | Typecheck (there is no `typecheck` script) |

### Running in production mode locally

`pnpm dev:prod` runs `next start`, which sets `NODE_ENV=production`. The server refuses to start
without `SMTP_HOST`, `NEXT_PUBLIC_SERVER_URL` and `PREVIEW_SECRET` — that check is deliberate, and
it is what stops a deploy from quietly discarding every enquiry notification.

To run it on your own machine anyway, add to your local `.env`:

```
LOCAL_PROD_REPRO=1
```

It disables nothing except the refusal to start, prints a banner on every boot, and every email
is still reported as `[EMAIL NOT SENT]` at error level. **Never set it on the server.**

## Before you deploy

In order. Each step catches something the next one would hide.

> **`pnpm build` goes after the tests, not before them.** `pnpm build` and `pnpm dev` both write
> `.next`, so building while the dev server is up replaces the bundle it is serving — and
> `pnpm test:e2e` reuses that same running server. Do it in the wrong order and e2e runs against a
> half-replaced build. That has already happened here: a hover rule confirmed working minutes
> earlier computed to `none` on four consecutive runs, and it read like a real defect in the test
> rather than a poisoned server. `rm -rf .next` and a restart fixed it with the source untouched.
> If you must build mid-session, `./stop.sh` first and `./start.sh` after.

1. `pnpm exec tsc --noEmit`
2. `pnpm test` — lint, then integration, then e2e. Playwright reuses a dev server on `:3000` and
   starts one if none is up. Includes the admin-control guards and the browser guards below
3. `./stop.sh` (if a dev server is up), then `pnpm build` — must pass without `LOCAL_PROD_REPRO`;
   building needs no deploy secrets
4. `pnpm dev:prod` and click through: submit the enquiry drawer and confirm a row appears under
   **Form Submissions**; open a draft post's **Preview**; check the header and footer nav links
   resolve
5. On the box, after any field change: `pnpm payload generate:types` →
   `pnpm payload migrate:create <name>` → `pnpm payload migrate` → `pnpm build`
6. After any bulk content import or seed: **Admin → System → Search → Reindex**. Search results
   store their own canonical URL (`uri`), written on save — documents that predate a change to
   that logic keep whatever they had, and a result with no `uri` renders unlinked. On the local
   database only 7 of 66 search documents had one until it was reindexed.

## Committing

**Every commit must typecheck on its own**, not merely at the end of the branch. When one pass is
split into several commits, a file touched by more than one of them gets staged in part — and it is
easy to leave a commit whose code refers to something a later commit introduces. `git log` then
holds a revision that does not build, which breaks `git bisect` and any deploy pinned to it.

This has already cost a rewind of two commits here. Check it the cheap way, per commit:

```bash
git worktree add /tmp/wt <sha> && ln -s "$PWD/node_modules" /tmp/wt/node_modules
(cd /tmp/wt && pnpm exec tsc --noEmit)
rm -f /tmp/wt/node_modules && git worktree remove --force /tmp/wt
```

## Deploying

Production builds and migrates on a remote box: commit and push, then the box pulls, builds and
migrates against the live database.

> **Current plan: nothing is pushed until the polishing work is finished.** Commits accumulate on
> `main` locally; the migration is generated once, at the end, against whatever the schema has
> become by then. `OUTSTANDING.md` §1 holds the full detail — what it will add, the **five columns
> it drops**, the two type changes a generated migration gets wrong, and the pre-flight check to run
> on the box before any of it. Read it before you push, not after.

After changing any collection, global or block field:

```bash
pnpm payload generate:types
pnpm payload migrate:create <name>   # answer "create column" unless it is genuinely a rename
pnpm payload migrate
pnpm build
```

**Keep the schema additive.** The only migration in the repo today is the baseline, and it only adds.
A dropped column is irreversible data loss on a live site, and the `migrate:create` prompt that asks
"created or renamed from another column?" is where that happens by accident — choosing *rename*
moves an unrelated column's data into the new field.

The pending migration is the exception, and a deliberate one: it drops five columns whose data has
either moved elsewhere or stopped being rendered. Each is named and justified in `OUTSTANDING.md`
§1, with the SQL to check whether the box actually holds anything in them. **If a generated
migration ever drops a column that file does not list, stop.**

Three environment variables are required in production and the app refuses to boot without them:
`SMTP_HOST`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`. Each fails *silently* rather than loudly
when missing — most dangerously `SMTP_HOST`, whose absence makes Payload fall back to a console mock
that reports every enquiry notification and password-reset email as sent. See `.env.example`.

## Guards you should not delete

`tests/int/adminControls.int.spec.ts` fails the build when:

1. a block, collection or global declares a field nothing reads (a control that looks editable and
   is not),
2. a `select` offers an option whose `.vf-*` class no rule defines,
3. a component hardcodes `appearance=` after a `{...spread}` while its config still offers the
   Appearance choice, so the editor's stored value is discarded,
4. a query against a draft-enabled collection has no `overrideAccess` and no `_status` filter,
   leaking unpublished documents onto the public site,
5. `HOOKS.md` documents a style hook class that nothing emits,
6. a cache purge passes a named `cacheLife` profile, which marks the tag stale instead of expiring
   it — the editor's first reload after saving then serves the *previous* value,
7. a brand asset is referenced straight from a CSS rule instead of through a Site Settings token, or
   a block draws an image placeholder without offering an upload to replace it.

These exist because a 2026 audit found ~118 verified cases of exactly those shapes.

**A guard that has never failed is not evidence.** An earlier version of this file justified itself
with "a crude test that runs beats an accurate one that rots", and under that licence three of its
four patterns could not fail on the defect they named — one collected results into an array it never
wrote to, another omitted the only property anything actually violated. The suite reported 94/94 and
meant nothing. Each test now records, in a comment above it, the deliberate break used to prove it
goes red, and `zsh tests/int/prove-guards.sh` applies each in turn and restores the tree.
**If you change a test, re-run that script — all ten cases must report PASS.**

### The browser guards

Three things in `tests/e2e/frontend.e2e.spec.ts` cannot be checked by reading source, because each
is about what the page *computes*, not what the CSS says. Each carries the deliberate break that
proves it red; `prove-guards.sh` drives `pnpm test:int` only, so these are re-proved by hand.

| Guard | Catches |
|---|---|
| The `<main>` landmark and its skip link | The link rendering unstyled — asserted **offscreen before focus** as well as on-screen after, because the on-screen half alone is trivially true of an unstyled element |
| Centred section headers do not narrow themselves into a wrap | A width cap on a heading box breaking a title that its container had room for. Ten headings across eight pages were wrapping this way |
| A testimonial card highlights on hover without moving | A card motion preset firing inside a viewport with no room for it, clipping the card |

Two habits make the difference between these and the guards that rotted:

- **State the fault as a cause, not as a number.** The first version of the heading guard compared
  natural width against the nearest container and flagged `/services`, whose header is deliberately
  a two-column grid. A numeric threshold needs an exception list, and the exception list is where
  the next false positive hides.
- **Carry a positive control in the same test.** The hover guard also hovers a card elsewhere on the
  page and requires *that* one to still move. Without it, "the testimonial did not move" is equally
  satisfied by a hover that never registered — and the whole test passes for the wrong reason.

`pnpm lint` runs as part of `pnpm test`. It is enforced, not advisory: it had been crashing on an
obsolete config shim and so had never run at all, which is how ten React Compiler errors — two of
them real bugs (a `prefers-reduced-motion` check that never reacted, and a directory filter that
overwrote the visitor's own selection) — sat unnoticed.

Those ten were fixed by changing the code, not by suppressing the rules, and **there is now no
`react-hooks/*` disable anywhere in `src/`**. The last three lived in `useClickableCard.ts` and were
removed by fixing the dependency arrays they were hiding — two of them concealed real omissions. The
remaining `eslint-disable` comments in `src/` are `@next/next/no-img-element` (deliberate `<img>`
use) and `@typescript-eslint/no-explicit-any` (seed fixtures). Reach for a code change before a
disable — these rules have already earned their keep.

When one fails, wire the control up; if it genuinely should not be wired, add it to the allowlist
**with a reason**.

`tests/visual/computedSnapshot.mjs` captures computed styles across the site so a CSS change can be
diffed. It measures 34 properties, including `width`, `height`, `grid-template-columns` and
`transform` — which is what lets it catch a layout change and not just a repaint. Two real limits
remain: it never triggers `:hover`, and it visits 14 routes, not all 29 pages, so a clean run says
nothing about the rest.

> This paragraph used to claim those four layout properties were **absent**. They had been added
> after the harness returned a falsely clean diff on exactly the changes most likely to break a page
> (see the comment at `computedSnapshot.mjs:27`), and the warning here was never updated — so it
> argued against trusting the one gate that catches a wrap or a reflow. Two of the 14 routes were
> also dead (`/about-verify`, `/legal/privacy-policy`): both 404, and the harness snapshotted the
> not-found page twice — 178 nodes each — while `/about` and `/privacy-policy` went unmeasured.
> `capture` now refuses any non-200.

## Images and where to upload them

**The site ships before its photography does.** Every image slot is empty and showing a placeholder,
and every one of them is fillable from `/admin` — no code change, no deploy. This is the map.

Nothing here is hardcoded: where a bundled file appears (the logo, the shield), it is a *fallback*
that only shows while the corresponding field is empty. Two guards in
`tests/int/adminControls.int.spec.ts` keep it that way — one fails the build if a brand asset is
referenced straight from CSS, the other if a block draws a placeholder without offering an upload.

### Site-wide — **Admin → Globals → Site Settings**

| Field | Where it appears | If left empty |
| --- | --- | --- |
| Logo | Header, and the footer if no footer logo is set | Bundled VERIFY wordmark |
| Footer logo | Footer only | Falls back to Logo, then the bundled wordmark |
| Favicon | Browser tab | `public/favicon.png` |
| Social image | Link previews when a page is shared | No preview image |
| Shield / seal mark | Home hero watermark, the mark behind **every** interior page hero, and the Contact page's portal cards | Bundled VERIFY shield |

### People and content — **Admin → Collections**

| Collection | Field | If left empty |
| --- | --- | --- |
| Specialists | Photo (also CV, Sample report) | The person's initials on a plain avatar |
| Team | Photo | The person's initials on a plain avatar |
| Services | Photo | In the accordion layout, a blue gradient tile with the service icon and “Image Placeholder” |
| Events | Image | Card renders without an image |
| Posts | Hero image, Author photo | Article header renders with no image behind it |
| Resources | File | The resource has nothing to download |

### Inside a page — **Admin → Pages → *page* → Layout**

Add or open the block, then use its upload field.

| Block | Field | If left empty |
| --- | --- | --- |
| Split Feature | Row → Image | Grey placeholder box, if that row's "Show a grey image placeholder" is ticked; otherwise the row goes full width |
| Why VERIFY | Image | Labelled gradient box |
| AAMLE Education | Image | Labelled gradient box, if the row's placeholder is ticked |
| Leadership Spotlight | Photo | Labelled box with a person icon |
| FAQ | Item → Image | Split layout only, and only the **first** item that has one is used; with none, the FAQ renders full width |
| Slide Carousel · Image · Media | Image / Media | Nothing renders for that slide or block |
| Page hero (Hero tab) | Media | Hero renders without an image panel |

### Two things worth knowing before you start

- **Uploading always wins.** If a block shows a placeholder and you attach an image, the image
  replaces it — you never need to untick anything first. The placeholder toggles only decide what
  happens while the slot is still *empty*.
- **Fix a bad crop with the focal point, not a new file.** Uploads live in the **Media** collection,
  which stores alt text plus a focal point and zoom. If a portrait crops through someone's face,
  open the image in Media and move the focal point — every place that image is used re-crops around
  it.

## Architecture

`CLAUDE.md` (checked in, at the repo root) is the maintained architecture reference: routing and the
nested-docs URL model, the block system, the three-layer styling/token pipeline, the content model,
and caching/revalidation. Start there before changing anything structural.

Two things worth knowing up front:

- **`src/utilities/routes.ts` is the single source of truth for document URLs.** Never interpolate a
  path inline — hand-built paths have historically disagreed with the real routes.
- **CSS cascade layers decide which styles win.** The admin-selectable `.vf-*` presets and the ported
  design-reference CSS are in different layers, and unlayered rules beat layered ones regardless of
  specificity. This is the single most common reason an admin control appears to do nothing.
