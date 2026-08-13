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

Measured **2026-08-14**, checked-in baseline (`src/migrations/20260705_105320_baseline.json`) against
the local `verify_cms` schema:

| | Baseline | Now | Change |
|---|---|---|---|
| Columns | 3207 | 3335 | **+133, −5** |
| Tables | 301 | 303 | **+2** |
| Indexes | 946 | 1266 | +320 |

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
