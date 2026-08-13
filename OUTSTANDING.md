# Outstanding issues

Things that are known-imperfect and were **deliberately not fixed**, with what each one actually
costs and what fixing it would cost. Written at handover so the next person inherits a register
rather than rediscovering these one at a time.

Every figure here was measured against the repository, not estimated. Where an issue is *not*
currently reachable, that is stated plainly — several of these are traps for a future change rather
than live faults today.

**Keep this file true.** Delete an entry when it is fixed; add one whenever something is knowingly
left undone. A stale register is worse than none, because people trust it.

Related: `CLAUDE.md` → **Invariants** (the rules these were judged against) and
`zsh tests/int/prove-guards.sh` (proves the automated guards can actually fail).

---

## Summary

| # | Issue | Live today? | User impact | Effort | Recommendation |
|---|---|---|---|---|---|
| 1 | Migration not yet created on the box | — | **Blocks deploy** | ~15 min | **Required** |
| 2 | Split-feature image placeholder diverges from reference | Yes | Cosmetic, on temporary content | ~20 min | Optional |

---

## 1. The outstanding migration

Not a code fix. **This blocks deployment** — the box cannot run the new code against the old schema.

**Measured drift**, checked-in baseline (`src/migrations/20260705_105320_baseline.json`) versus the
current schema:

| | Baseline | Now | Change |
|---|---|---|---|
| Columns | 3207 | 3335 | **+131, −3** |
| Tables | 301 | 303 | +2 |
| Indexes | 946 | 1266 | +320 |

Both sides re-measured 2026-08-13: the baseline figures by counting
`20260705_105320_baseline.json`, the current ones from `information_schema` / `pg_indexes` against
`verify_cms`. (An earlier revision of this table said 3329 columns / 1267 indexes; those did not
reconcile with either source and have been replaced rather than adjusted.) The rich-text pass
accounts for 2 of the additions — the two type changes below are *not* column additions and do not
appear in this count.

The additions are ordinary (design-system tokens, brand colours, `events.registration_closes_at`,
`offices.is_primary`, `site_settings.enquiry_form_id`, `site_settings.accessibility_skip_link_label`,
`search.uri`, guest presenters, shadow fields on several blocks, and three extra FK columns on each
`*_rels` table carrying a link).

**The five removals are the part to be deliberate about:**

```
article_settings.labels_breadcrumb_home_label
team_settings.labels_breadcrumb_home_label
specialist_profile.breadcrumb_breadcrumb_current_label
testimonials.author_name          ← added by the homepage redesign
testimonials.avatar_id            ← added by the homepage redesign
```

The first three were consolidated into `site_settings.breadcrumbs_*` (Home label / separator /
landmark name); nothing reads the old columns any more.

The last two came out with the homepage redesign: the testimonial card now matches the design
reference, which attributes quotes by position and organisation only — no personal name, no
portrait. Leaving the fields in place would have left two admin controls that render nothing, which
the orphan-field guard in `adminControls.int.spec.ts` fails on. Locally the six seeded testimonials
had **no** `author_name` and **no** `avatar` set, so nothing was lost here; on the box, check
whether any testimonial carries either before running the migration. The migration will `DROP` them, and **any breadcrumb label
an editor customised on the box is lost** — it does not carry across to the new location
automatically. That was accepted for this deploy because the box's content is being replaced
wholesale. **It will not be acceptable next time**, once the box holds real edits: a future
consolidation like this needs an `UPDATE … SET new = old` in the migration *before* the `DROP`.

**Two column *type* changes were added by the rich-text pass**, and a migration handles them
differently from an add or a drop. Diffed against a `pg_dump` taken immediately before that work,
the entire delta is four lines:

```
pages_blocks_process_steps_steps.description      varchar → jsonb
_pages_v_blocks_process_steps_steps.description   varchar → jsonb
pages_blocks_process_steps.intro_rich             + jsonb
_pages_v_blocks_process_steps.intro_rich          + jsonb
```

A generated `ALTER COLUMN … TYPE jsonb` with no `USING` clause **fails outright** on non-empty
tables (26 live rows, 132 draft-history rows locally), and one with a bare `USING description::jsonb`
is worse — it errors on the first row, because the existing values are plain prose, not JSON. The
migration must carry the same paragraph-splitting `USING` expression used locally. That statement is
checked in verbatim at `src/migrations/REFERENCE-processSteps-richtext.sql` — inert, because
`src/migrations/index.ts` registers migrations explicitly rather than scanning the directory. It
splits on `\n{2,}`, matching `plainTextToLexical`. Paste it into the generated migration; do not
trust the default.

**Step 3 of the procedure below therefore gains a check:** confirm the two `description` type
changes carry a `USING` clause, and that `intro_rich` is an ordinary additive column.

**`migrate:create` will not warn you.** The "Accept warnings and push schema to database?" prompt
exists only in the **dev-push** path (`pushDevSchema.js`), which is what runs during local
development. `migrate:create` writes the SQL silently, `DROP COLUMN`s included. Read the generated
file.

**Procedure, on the box:**

1. `pnpm payload generate:types`
2. `pnpm payload migrate:create <name>`
3. **Open the generated SQL.** Confirm exactly **five** `DROP COLUMN` statements and that they are
   the three breadcrumb labels plus `testimonials.author_name` and `testimonials.avatar_id`.
   Anything else dropping is a mistake — stop and investigate. Then confirm the two
   `description` columns change type **with** a `USING` clause (paste it from
   `REFERENCE-processSteps-richtext.sql`); without one the migration fails on the first row.
4. `pnpm payload migrate`
5. `pnpm build`
6. In the admin, check **Site Settings → Breadcrumbs**. Locally these are `Home` / `›` /
   `Breadcrumb`; set them to whatever the site should use.


---

## 2. The split-feature image placeholder diverges from the reference

`SplitFeature`'s placeholder renders a 48px picture icon above an uppercase 0.72rem label; the
reference is a plain sentence-case 0.85rem label with no icon, plus a radial vignette
(`.design-reference/assets/css/styles.css:749-770`). The gradient is also 145deg where the
reference is 135deg.

**Why it was left.** **Measured:** 16 rows across the site currently set `imagePlaceholder`. Every
one of them is scaffolding waiting for a real photograph — the moment an image is uploaded, none of
this renders at all. Restyling temporary content across 16 places was judged churn, not value.

Note the gradient is a Design System token (`--vf-grad-image-tint`), so the angle is editable
without code.
