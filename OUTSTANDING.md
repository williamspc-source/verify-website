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
| 1 | Migration not yet created on the box | — | **Blocks deploy** | ~20 min + a careful read | **Required, immediately before the push** |
| 2 | Two e2e specs are flaky under a loaded dev server, and can 500 an unrelated route | Test-only | `pnpm test` fails intermittently on a machine that is otherwise fine, sometimes reporting a page as broken when it is not | ~10 min | Worth doing before handover |
| 3 | Three template hero types render their title at 400 | Latent | An editor who picks one gets a visibly unstyled heading | ~30 min **+ a data migration** | After the deploy, not before |
| 4 | `.contact-form` padding follows the reference's superseded rule | Cosmetic | 12px more padding than one reference page shows | ~5 min | Only if someone confirms which is intended |
| 5 | Light-band breadcrumbs are darker and heavier than the reference | Cosmetic, ~25 pages | A slightly heavier trail than the reference draws | ~10 min + re-baseline | A decision, not a tidy-up — someone should confirm the lighter trail is wanted |
| 6 | Three dead CSS rules on a `.ct-portal-card` class that never reaches the DOM | No | None — a live rule covers it | ~5 min | Fold into the next dead-CSS sweep |
| 7 | `ServicesGrid` can generate links to service pages that do not exist | Latent | An editor who ticks "Link to service page" gets 404s | ~20 min | Before anyone builds a new services grid |
| 8 | The enquiry call-to-action has five different wordings | Cosmetic | Inconsistent button copy; one seed/code disagreement | ~30 min + a repair | With the next copy sweep |

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

**Cost of fixing:** three token values in the light `--bc-*` context (`globals.css:4025-4070`), plus
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

`globals.css` scopes three rules to `.ct-page .ct-portal-card` — lines **9182**, **9201** and
**9202**. The bare class **is not in the served HTML**. Only the children are (`__head`, `__label`,
`__text`, `__btn`, `__features`), and `ct-page` itself is present, so the scoping is fine and only the
parent hook is missing. A substring grep for `ct-portal-card` reports it present, because every child
class contains that string — which is why it went unnoticed.

Nothing is visibly wrong, because a **separate live rule** supplies the same treatment:
`.ct-page .ct-enquiry-grid .ct-portal-card__btn` (line 10737) already sets the button margin and
full-width sizing.

**Why it is not simply "add the missing class":** the dead rule sets `margin: 12px 0 4px` where the
live one sets `margin-top: 12px`. Restoring the parent class would introduce a 4px bottom margin on
every portal-card button group and move the page. The safe fix is to **delete** the three dead rules,
which is a tidy-up with a snapshot re-baseline attached rather than a bug fix — hence recorded rather
than done inside a feature pass.

**Cost:** three lines deleted, one snapshot compare on `/contact` to confirm nothing moves. Worth
folding into the next `findDeadCss.mjs` sweep rather than doing alone.

---

## 7. `ServicesGrid` can generate links to pages that do not exist

The `services` collection has **no public route** — there is no `/services/<slug>` page, and
`LINKABLE_COLLECTIONS` in `routes.ts` excludes it. The service pages a visitor sees are Pages.

But `ServicesGrid` still offers **Link to service page** plus a `servicePathPrefix`, which together
build `<prefix>/<slug>` hrefs. Every seeded grid sets `linkToService: false` and each Service instead
carries a `linkOverride` pointing at a real Page (`seedServiceLinks.ts`), so nothing is broken today.

**The hazard:** an editor who ticks that box on a new grid gets links that 404, and nothing warns
them. The block's own comment still claims the collection drives "the dedicated service pages",
which is stale.

**Cost of fixing:** either drop the two fields and the code path (they have never been used in
anger), or make the grid fall back to `linkOverride` and hide the toggle when no route exists.
Either is a block-config change plus a snapshot compare. Documented in `ADMIN-GUIDE.md` §4 so an
editor is at least told the card needs a Link override.

---

## 8. The enquiry call-to-action has five different wordings

Across the site: **Make an Enquiry** (drawer), **Send Enquiry** (portal CTA), **Send enquiry**
(availability grid, lowercase e), **Enquire →** (service cards, hardcoded and not editable), and
**Contact Us** (nav). On the specialist profile the seed writes `Make an Enquiry` while the code
fallback says `Send Enquiry`, so the two disagree about the same button.

Not wrong, just inconsistent — and it is visitor-facing copy stored in the database, so fixing it
means picking the canonical wording and writing an unconditional repair, not editing a fixture.
Worth doing in the same pass as any other copy sweep.

---

## 1. The outstanding migration

Not a code fix, and not a defect. The local database has been kept in step by the Postgres adapter's
dev push, which runs automatically and writes no migration file. Production does not push — it runs
migrations — so the box cannot serve the new code until a migration exists that takes the **live**
database from the checked-in baseline to the current shape.

### Status: deliberately held until the end

Polishing is still in progress and every further pass may add fields. Generating the migration now
would mean regenerating it later, and a superseded migration file in `src/migrations/` is a trap:
someone will run it.

**So the sequence is: finish the work, then do this once, then push.** Everything below describes
what the migration will contain *as of the last measurement*; the shape of the additions and the
identity of the five drops are settled, but **the counts will move** if more fields land. Re-measure
before you generate — the commands are in the next section.

### Measured drift — and how to re-measure it

Two passes have landed since the table below was measured:

- the **article heading-id** pass added no columns — it changes how rich text is rendered, not what
  is stored;
- the **Meet the Team header band** pass added **2**: `header_background` on
  `pages_blocks_people_grid` and `_pages_v_blocks_people_grid`. Additive, nullable, defaulted to an
  inert sentinel. It changes no enum and drops nothing, so the drop list in §B is untouched.

So the additions are now **+184**, not +182. Re-measure anyway rather than trusting this sentence —
the commands are below.

Measured **2026-08-14** (re-measured after the link pass), checked-in baseline
(`src/migrations/20260705_105320_baseline.json`) against the local `verify_cms` schema:

| | Baseline | Now | Change |
|---|---|---|---|
| Columns | 3207 | 3386 | **+184, −5** |
| Tables | 301 | 303 | **+2** |
| Indexes | 946 | 1266 | +320 |

The link pass added **49** columns to the previous 3335: an optional `anchor` on every stored link
(one column per table that uses the `link()` helper, live + version), plus `anchor_id` on
`appt_guide_types`, `pages_blocks_services_grid` and their version twins. All additive. The header
band pass added the last **2** (`header_background`, live + version). Re-measured 2026-08-14:
3386 current against 3207 baseline is a net 179, which with the five drops is **+184**.

> **Correction.** An earlier revision of this table said "+131, −3" alongside a list of five dropped
> columns — the two disagreed, and the column breakdown was the wrong one. 3207 + 133 − 5 = 3335.
> A revision before that gave 3329 columns / 1267 indexes, which reconciled with neither source.
> These figures are re-derived, not adjusted.

Re-derive both sides with these. Run from the repo root, against the machine's own database:

```bash
PSQL=/opt/homebrew/opt/postgresql@15/bin/psql

# Current
$PSQL -d verify_cms -tAc "select count(*) from information_schema.columns where table_schema='public';"
$PSQL -d verify_cms -tAc "select count(*) from information_schema.tables where table_schema='public' and table_type='BASE TABLE';"
$PSQL -d verify_cms -tAc "select count(*) from pg_indexes where schemaname='public';"

# Baseline
node -e 'const t=Object.values(require("./src/migrations/20260705_105320_baseline.json").tables||{});
console.log("tables",t.length,"columns",t.reduce((n,x)=>n+Object.keys(x.columns||{}).length,0),
"indexes",t.reduce((n,x)=>n+Object.keys(x.indexes||{}).length,0));'
```

Counts alone will not tell you whether a **sixth** column has joined the drop list, and that is the
only part of this migration that destroys data. Diff at column level:

```bash
$PSQL -d verify_cms -tAF'|' \
  -c "select table_name||'.'||column_name from information_schema.columns
      where table_schema='public' order by 1;" > /tmp/cols_now.txt

node -e '
const fs = require("fs")
const base = new Set()
for (const t of Object.values(require("./src/migrations/20260705_105320_baseline.json").tables || {}))
  for (const c of Object.values(t.columns || {})) base.add(t.name + "." + c.name)
const now = new Set(fs.readFileSync("/tmp/cols_now.txt", "utf8").trim().split("\n"))
const added   = [...now].filter((k) => !base.has(k)).sort()
const removed = [...base].filter((k) => !now.has(k)).sort()
console.log("ADDED", added.length, "\nREMOVED", removed.length)
console.log(removed.map((r) => "  " + r).join("\n"))
'
```

**If `REMOVED` is anything other than the five columns in §B, stop and find out why.** That is how
the five below were identified, and re-running it is cheaper than discovering a sixth drop on the
live database.

### A. The additions — 133 columns, 2 tables. Ordinary, and safe.

Additive DDL is reversible in practice and carries no data loss. Grouped by what introduced them:

| Area | Count | What |
|---|---|---|
| `site_settings` | 36 | The brand palette (30 `colors_*`), `breadcrumbs_home_label` / `_nav_label` / `_separator`, `accessibility_skip_link_label`, `enquiry_form_id`, `shield_id` |
| `design_system` | 28 | Shadow/glow `effects_*` (15), `radius_*` (8), `gradients_*` (4), `typography_text_scale` |
| Events guest presenters | 13 | `events_guest_presenters` + `_events_v_version_guest_presenters` — **these are the 2 new tables** |
| Card shadow preset | 18 | `shadow` on 9 block tables, ×2 for their version twins |
| Page hero | 10 | `hero_hero_background`, `hero_hero_padding_top` / `_bottom`, `hero_container_width`, `hero_definition_interaction`, ×2 for the version table |
| Nav/footer/article link targets | 9 | 3 FK columns each on `header_rels`, `footer_rels`, `article_settings_rels` (`events_id`, `specialists_id`, `team_id`) |
| Rich text + step controls | 4 | `process_steps.intro_rich` and `process_steps_steps.badge_style`, ×2 |
| Everything else | 15 | `events.registration_closes_at` ×2, `services_grid.card_align` ×2, `newsletter.form_id` ×2, 3 × `specialist_profile.portal_cta_*_label`, 2 label fields each on `article_settings` and `events_settings`, `offices.is_primary`, `search.uri` |

36 + 28 + 13 + 18 + 10 + 9 + 4 + 15 = **133**.

### B. The removals — 5 columns. **This is the irreversible part.**

```
article_settings.labels_breadcrumb_home_label
team_settings.labels_breadcrumb_home_label
specialist_profile.breadcrumb_breadcrumb_current_label
testimonials.author_name          ← added by the homepage redesign
testimonials.avatar_id            ← added by the homepage redesign
```

**The three breadcrumb labels** were consolidated into `site_settings.breadcrumbs_home_label` /
`_separator` / `_nav_label`. Nothing reads the old columns — verified by grep over `src/`, excluding
the generated `payload-types.ts`, with a live field (`Offices.hoursNote`, 3 hits) as a positive
control so a zero result means absent rather than a broken search.

**The migration will not copy the values across.** If an editor customised a breadcrumb label on the
box, it is lost. That was accepted for *this* deploy because the box's content is being replaced
wholesale. **It will not be acceptable next time**: once the box holds real edits, a consolidation
like this needs an `UPDATE … SET new = old` in the migration *before* the `DROP`.

**The two testimonial columns** came out with the homepage redesign. The card now matches the design
reference, which attributes quotes by position and organisation only — no personal name, no
portrait. Leaving the fields in place would have left two admin controls that render nothing, which
the orphan-field guard fails on. Locally all six seeded testimonials had neither set, so nothing was
lost here.

**Pre-flight check on the box, before you migrate.** Locally these columns are already gone, so this
can only be answered there:

```sql
SELECT id, author_name, avatar_id FROM testimonials
WHERE author_name IS NOT NULL OR avatar_id IS NOT NULL;

SELECT labels_breadcrumb_home_label FROM article_settings;
SELECT labels_breadcrumb_home_label FROM team_settings;
SELECT breadcrumb_breadcrumb_current_label FROM specialist_profile;
```

Anything non-null is about to be deleted. Copy it somewhere first, or add the `UPDATE` to the
migration.

### C. Two type changes — the part a generated migration gets **wrong**

| Column | Baseline | Now |
|---|---|---|
| `pages_blocks_process_steps_steps.description` | `varchar` | `jsonb` |
| `_pages_v_blocks_process_steps_steps.description` | `varchar` | `jsonb` |

(`intro_rich` on the same two block tables is an ordinary additive `jsonb` column — no conversion.)

Both tables hold data: **26 live rows** and **150 draft-history rows** locally as of 2026-08-14.
That matters because:

- a generated `ALTER COLUMN … TYPE jsonb` with **no** `USING` clause fails outright on a non-empty
  table;
- one with a bare `USING description::jsonb` is worse — it errors on the first row, because the
  existing values are plain prose, not JSON.

The migration must carry the paragraph-splitting `USING` expression used locally. It is checked in
verbatim at **`src/migrations/REFERENCE-processSteps-richtext.sql`** — inert, because
`src/migrations/index.ts` registers migrations explicitly rather than scanning the directory. It
defines a `pg_temp.to_lexical(text)` helper that splits on `\n{2,}` and wraps each paragraph as a
Lexical node, matching `plainTextToLexical` exactly, then applies it to both tables. Paste it into
the generated migration. **Do not trust the default.**

Inline `**bold**` / `*italic*` is deliberately not parsed by that function; no existing row contains
a marker (checked), and the seed is the path that introduces them.

### `migrate:create` will not warn you

The *"Accept warnings and push schema to database? (y/N)"* prompt exists only in the **dev-push**
path (`pushDevSchema.js`), which is what runs during local development. `migrate:create` writes the
SQL silently, `DROP COLUMN`s included. **Read the generated file.**

### The procedure, on the box

1. Run the **pre-flight check** in §B. Deal with anything non-null before going further.
2. `pnpm payload generate:types`
3. `pnpm payload migrate:create <name>`
4. **Open the generated SQL and read all of it.** Confirm:
   - exactly **five** `DROP COLUMN` statements, and they are the five in §B. Anything else dropping
     is a mistake — stop and investigate;
   - the two `description` columns change type **with** the `USING` clause pasted from
     `REFERENCE-processSteps-richtext.sql`;
   - `intro_rich` is a plain additive column with no conversion.
5. `pnpm payload migrate`
6. `pnpm build`

### After it runs

- **Admin → Site Settings → Breadcrumbs.** The three consolidated labels start empty on the box; set
  them (locally they are `Home` / `›` / `Breadcrumb`).
- **Open a page with a Process Steps block** and confirm the step descriptions render as paragraphs
  rather than as raw JSON or as nothing. That is the conversion's only visible proof.
- **Admin → System → Search → Reindex**, per `README.md` → *Before you deploy*.
- Check a testimonial card, the header/footer nav, and one interior page hero — those cover the
  three largest groups of added columns.

### If it goes wrong

Payload migrations run in a transaction, so a failure inside step 5 rolls back and the database is
untouched — the usual failure is the missing `USING` clause, which surfaces as an error on the first
`process_steps` row and changes nothing.

What is **not** recoverable is a successful migration that dropped a column you had not checked.
Take a `pg_dump` before step 5. That is the whole safety net for §B.
