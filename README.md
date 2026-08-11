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

1. `pnpm exec tsc --noEmit`
2. `pnpm test:int` — includes the admin-control guards below
3. `pnpm build` — must pass without `LOCAL_PROD_REPRO`; building needs no deploy secrets
4. `pnpm dev:prod` and click through: submit the enquiry drawer and confirm a row appears under
   **Form Submissions**; open a draft post's **Preview**; check the header and footer nav links
   resolve
5. `pnpm test:e2e`
6. On the box, after any field change: `pnpm payload generate:types` →
   `pnpm payload migrate:create <name>` → `pnpm payload migrate` → `pnpm build`
7. After any bulk content import or seed: **Admin → System → Search → Reindex**. Search results
   store their own canonical URL (`uri`), written on save — documents that predate a change to
   that logic keep whatever they had, and a result with no `uri` renders unlinked. On the local
   database only 7 of 66 search documents had one until it was reindexed.

## Deploying

Production builds and migrates on a remote box: commit and push, then the box pulls, builds and
migrates against the live database.

After changing any collection, global or block field:

```bash
pnpm payload generate:types
pnpm payload migrate:create <name>   # answer "create column" unless it is genuinely a rename
pnpm payload migrate
pnpm build
```

**Keep the schema additive.** Every migration so far only adds columns. A dropped column is
irreversible data loss on a live site, and the `migrate:create` prompt that asks "created or renamed
from another column?" is where that happens by accident — choosing *rename* moves an unrelated
column's data into the new field.

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
5. `HOOKS.md` documents a style hook class that nothing emits.

These exist because a 2026 audit found ~118 verified cases of exactly those shapes.

**A guard that has never failed is not evidence.** An earlier version of this file justified itself
with "a crude test that runs beats an accurate one that rots", and under that licence three of its
four patterns could not fail on the defect they named — one collected results into an array it never
wrote to, another omitted the only property anything actually violated. The suite reported 94/94 and
meant nothing. Each test now records, in a comment above it, the deliberate break used to prove it
goes red, and `zsh tests/int/prove-guards.sh` applies all five in turn and restores the tree.
**If you change a test, re-run that script — all five must report PASS.**

`pnpm lint` runs as part of `pnpm test`. It is enforced, not advisory: it had been crashing on an
obsolete config shim and so had never run at all, which is how ten React Compiler errors — two of
them real bugs (a `prefers-reduced-motion` check that never reacted, and a directory filter that
overwrote the visitor's own selection) — sat unnoticed.

Those ten were fixed by changing the code, not by suppressing the rules: **no `react-hooks/*`
disable exists outside `useClickableCard.ts`**, which carries three pre-existing
`exhaustive-deps` ones. The other `eslint-disable` comments in `src/` are `@next/next/no-img-element`
(deliberate `<img>` use) and `@typescript-eslint/no-explicit-any` (seed fixtures). Reach for a code
change before a disable — these rules have already earned their keep.

When one fails, wire the control up; if it genuinely should not be wired, add it to the allowlist
**with a reason**.

`tests/visual/computedSnapshot.mjs` captures computed styles across the site so a CSS change can be
diffed. Note its limits before trusting a clean run: it measures 30 properties that do **not**
include `width`, `height`, `grid-template-columns` or `transform`, and it never triggers `:hover`.

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
