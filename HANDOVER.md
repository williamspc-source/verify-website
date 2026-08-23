# Handover — VERIFY Medico-Legal Solutions website

**Read this first if you have just inherited this project.** It assumes you know how to run a
Node app and nothing else about this codebase.

`README.md` is the maintainer's manual and assumes context you do not have yet. This document gets
you from nothing to a running site, and tells you the few things that will otherwise cost you a day.

---

## 1. What this is

A [Next.js 16](https://nextjs.org) site with [Payload 3](https://payloadcms.com) as its CMS, on
Postgres, using `pnpm`. Payload runs **inside** the Next app — there is no separate CMS server. The
public site is `src/app/(frontend)/`, the admin is `src/app/(payload)/`.

Almost nothing is hardcoded. Pages are built from blocks an editor arranges; colours, spacing and
copy come from the database. That is deliberate: the client's staff maintain the site without a
developer, and adding a hardcoded value takes something away from them.

### The other documents, and which to read for what

| File | Read it when |
|---|---|
| `README.md` | You are maintaining the code — running, testing, deploying, where images go |
| `CLAUDE.md` | You are about to change code. **Architecture, invariants, and every measurement trap that has already produced a wrong conclusion here.** The single most valuable file in the repo |
| `ADMIN-GUIDE.md` | Someone asks "what is this thing in the admin sidebar for?" |
| `src/Styles/HOOKS.md` | Someone asks "how do I change how this looks?" |
| `OUTSTANDING.md` | Before assuming something is an oversight. Everything knowingly imperfect, with its measured impact and the cost of fixing it |
| `current-state.md` | You want the status *right now* — what works, what is open |
| `REVIEW-CHECKLIST.md` | You are doing a manual review of every page |
| `verify-website-design-diff.md` | You want the history of a design decision, by numbered `Comparison` |
| `HOMEPAGE-CHANGES.md` | Closed history for the homepage only. Do not append to it |

**The rule that keeps them true:** a change lands in every document it touches, in the same pass. A
stale record is worse than no record, because a reader cannot tell which one is lying.

---

## 2. Standing up a box from nothing

### Prerequisites

Node 20+, `pnpm`, and PostgreSQL 15+.

### Steps

```bash
# 1. A database
createdb verify_cms

# 2. The code
pnpm install

# 3. Configuration — see section 3 before filling this in
cp .env.example .env
$EDITOR .env

# 4. Create the schema. One migration; it only creates tables.
pnpm payload migrate

# 5. Build and run
pnpm build
pnpm start
```

Then open `/admin`. **The first account you create becomes the administrator** — there is no
separate setup step and no default password.

### Content

The site is not much use empty. With `ENABLE_SEED_ENDPOINT=true` in `.env` and a logged-in admin:

```bash
curl -X POST https://your-site/next/seed-verify -H "Cookie: <your admin session cookie>"
```

It is idempotent and non-destructive — safe to run twice — and creates the page tree, taxonomy,
specialists, team, events and settings.

**Then remove `ENABLE_SEED_ENDPOINT` from `.env` and restart.** It rewrites page parents, which
changes live URLs, and overwrites editable copy from code fixtures. It is a scaffolding tool, not an
admin feature.

---

## 3. The environment file

`.env.example` documents every variable, with what breaks when each is wrong. Four matter most:

| Variable | If it is wrong |
|---|---|
| `DATABASE_URL` | Nothing runs |
| `PAYLOAD_SECRET` | Changing it logs every admin user out |
| `NEXT_PUBLIC_SERVER_URL` | Every absolute link, sitemap entry and social preview points at localhost. **No visible error** |
| `PREVIEW_SECRET` | Draft preview links cannot be validated |

**The app refuses to boot** without `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET` or `SMTP_HOST` while
serving. That is deliberate — each of them fails *silently* rather than loudly, and a server that
half-works passes a deploy smoke test. It exits rather than starting.

---

## 4. Email — read this even if you skip everything else

**This install is currently running without email**, via `ALLOW_MISSING_SMTP=1` in `.env`.

### What still works

Enquiries, contact forms and newsletter signups are **captured normally**. They are in the admin
under **Forms → Form Submissions**. Nothing is lost.

### What does not

- **Nobody is emailed when an enquiry arrives.** Someone has to check that list by hand. If the
  client is expecting enquiry emails, they are not getting them.
- **Admin password resets do not work.** The reset appears to send and nothing arrives. An admin
  who forgets their password needs a developer to reset it directly.

### How you know

A boxed banner prints on every boot, and the admin dashboard carries a **red warning on every
login** for as long as mail is unconfigured. Every attempted send is logged at error level as
`[EMAIL NOT SENT]`.

### Turning it on

Two changes in `.env`, then restart:

1. Fill in the `SMTP_*` block — at minimum `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
2. **Delete the `ALLOW_MISSING_SMTP` line.**

Then check **Forms → Forms → *(each form)* → Emails** to confirm who is notified — the addresses are
per form, and are the thing most likely to be wrong after a handover.

> Leaving `ALLOW_MISSING_SMTP` set on the site that takes real enquiries is the single most
> expensive mistake available here. It fails silently by design: the visitor is thanked, the
> submission is stored, and nobody is told.

---

## 5. Deploying a change

```bash
git pull
pnpm install          # only if dependencies changed
pnpm payload migrate  # only if a migration was added
pnpm build
# restart the server
```

**The schema is frozen behind a single baseline migration** (`src/migrations/`). Editing content,
copy, colours or page layouts needs none of this — those are database changes an editor makes, and
they go live on save.

Only a **code** change that adds or alters a collection, global or block *field* needs a migration:

```bash
pnpm payload generate:types
pnpm payload migrate:create <name>
pnpm payload migrate
```

**Keep the schema additive.** A dropped column is irreversible data loss. When `migrate:create` asks
whether a column was "created or renamed from another column", choosing *rename* moves an unrelated
column's data into the new field.

---

## 6. Five things that will otherwise cost you a day

Every one of these has already happened here. `CLAUDE.md` has the full list — it is long because it
is honest, and it is worth reading before your first change.

1. **Never run `pnpm build` while `pnpm dev` is running.** They share `.next`, so the build replaces
   what dev is serving. The symptom is a change that was verified working suddenly not working, four
   runs in a row, looking exactly like a real defect.
2. **A stale `.next` fakes both a fix and a break.** If an edit "does nothing", suspect the build
   before the code: `./stop.sh && rm -rf .next && ./start.sh`. It has hidden a working change *and*
   a deliberate break, twice each.
3. **A destructive schema change hangs the dev push on a prompt you cannot see.** Dropping a column
   leaves the server waiting on *"Accept warnings and push schema to database? (y/N)"* inside a
   backgrounded log. The symptom is requests taking ten minutes with no error. Check `.dev.log` for
   *"Accept warnings"* before assuming the server is merely slow.
4. **Every negative result needs a positive control.** Before believing "not found", make the same
   check find something you know is there. Several confident, wrong "no"s here came from a bad
   search rather than absent code.
5. **Content lives in the database, so editing a seed file changes nothing on an existing install.**
   Corrections need an unconditional repair — see `src/endpoints/seed/seedLinkRepairs.ts` for the
   pattern.

---

## 7. Testing

```bash
pnpm test          # lint → integration → end-to-end, stopping at the first failure
pnpm exec tsc --noEmit
```

The suite is unusually opinionated: every guard records the deliberate break used to prove it fails,
and `zsh tests/int/prove-guards.sh` re-applies each one. **A guard that has never failed is not
evidence** — that is the doctrine, and it exists because a green suite here once proved nothing at
all.

Two specs flake under a loaded dev server (`OUTSTANDING.md` §2). If `admin.e2e.spec.ts` or
`links.e2e.spec.ts` fails in a full run, re-run it alone before believing it.
