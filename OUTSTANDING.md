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
| 1 | No `<main>` landmark, no skip link | **Yes** | Real — accessibility | ~30 min | **Do it** |
| 2 | `useClickableCard` dependency arrays | No | None yet | ~10 min | Do it — cheap |
| 3 | `ExpertsCarousel` latches `startDirection` | Editors only | Live-preview confusion | ~10 min | Do it — cheap |
| 4 | `src/blocks/RelatedPosts/` is orphaned | No | None | ~2 min | Optional |
| 5 | Migration not yet created on the box | — | **Blocks deploy** | ~15 min | **Required** |

---

## 1. No `<main>` landmark and no skip link

**The only item here with end-user impact.**

**Measured.** `grep '<main'` across `src/app` and `src/components` returns **zero hits**, and there
is no skip link anywhere in `src/`. The page does have a navigation landmark
(`<nav class="site-nav">`, `src/Header/Component.client.tsx`) and a contentinfo landmark
(`<footer class="site-footer">`, `src/Footer/Component.tsx`) — but in
`src/app/(frontend)/layout.tsx`, `{children}` sits bare between them with no wrapper.

**Impact.** A keyboard or screen-reader user has no way to jump past the navigation, so they
traverse the full nav on every page. This is a standard axe / Lighthouse failure ("Document does not
have a main landmark"). It matters more here than on a typical brochure site: VERIFY's clients are
insurers, law firms and government bodies, who are exactly the organisations that run accessibility
audits on their suppliers.

**Fix.** In `src/app/(frontend)/layout.tsx`, wrap `{children}` in `<main id="main-content">` and add
a visually-hidden-until-focused skip link as the first element inside `<body>`:

```
<body>                          <body>
  <nav class="site-nav">          <a class="skip-link" href="#main-content">Skip to content</a>
  <article>…</article>    →       <nav class="site-nav">
  <footer>                        <main id="main-content"><article>…</article></main>
</body>                           <footer>
                                </body>
```

**Risk — low, but not zero.** Two things were checked and are safe: `globals.css` contains **no**
`body > *` selectors, and the sticky footer (`body { min-h-[100vh] flex flex-col }` plus
`.site-footer { mt-auto }`) still works with one wrapper element in between.

The real cost is that adding a DOM node shifts every structural index path, so the `postreview`
computed-style baseline (`tests/visual/__snapshots__/`) has to be **recaptured** — which means that
particular check cannot also catch a regression introduced by the same change. Do a manual visual
pass over a few page types (home, a nested service page, an article, the search page) before
recapturing.

---

## 2. `useClickableCard` dependency arrays — three `eslint-disable`s

`src/utilities/useClickableCard.ts` carries three `// eslint-disable-next-line
react-hooks/exhaustive-deps`. They are the only `react-hooks` suppressions left in the codebase.

**Measured, one at a time:**

| Disable | Verdict |
|---|---|
| `handleMouseDown` | **Noise only.** The body reads no reactive values. Its listed deps are `useRef` results (stable, and the rule flags them as pointless) plus a `router` it never uses. Nothing is missing. |
| `handleMouseUp` | **Real omission** — `external`, `newTab` and `scroll` are all props it closes over. Because every listed dep is stable, the callback never changes identity and permanently captures the mount-time values. |
| the `useEffect` | **Real omission** — it omits both handlers, so even a freshly-created `handleMouseUp` would never be re-bound to the DOM. |

**Reachable today: no.** The only caller is `src/components/Card/index.tsx:25`, and it passes `{}` —
so `external`, `newTab` and `scroll` are always their defaults (`false`, `false`, `true`) and can
never change. The hook is otherwise correctly written: the destination is read live from
`link.current.href` at event time, so a card whose target changes still navigates correctly.

**Worth knowing:** the harder half of the precondition is *already true*. `CollectionArchive` keys
its cards by array index, and the search page pushes a new query on every keystroke — so the `Card`
at index 0 stays mounted while its document swaps to an entirely different one. The only thing
standing between this and a live bug is that nobody has yet passed a non-constant option. Wiring
`external` from `doc.uri` is a plausible next edit.

**Fix.** `handleMouseUp` → `[external, newTab, router, scroll]`; the effect →
`[handleMouseDown, handleMouseUp]`; drop the ref deps. All three disables then delete themselves.

**Risk — low.** Behaviour is identical today precisely because those values never change.

---

## 3. `ExpertsCarousel` latches `startDirection`

**Measured.** `src/components/ExpertsCarousel/index.tsx:25` does
`useState<Direction>(startDirection || 'left')`, and nothing reads the prop again afterwards. It is
the only latched prop in the component — `speed`, `showArrows`, `cards` and the reduced-motion flag
are all read during render and update normally.

**Reachable today: in live preview only.** There are two call sites:

- `src/blocks/PeopleGrid/Component.tsx:196` passes the editor-controlled
  `carouselOptions.direction`. **This is the affected one.**
- `src/blocks/Availability/Component.tsx:249` never passes `startDirection` and sets
  `showArrows={false}` — structurally immune.

Production visitors cannot hit it: both blocks are async server components, rendered once per
request. But draft mode mounts `LivePreviewListener`, whose `router.refresh()` reconciles the tree
in place and *deliberately preserves client component state*. Same URL, same block index, same
mounted component — so the new `startDirection` is ignored.

**Impact.** An editor changes People Grid → Carousel options → Start direction, saves, and watches
speed and the arrows update while the scroll direction stays wrong until a hard reload. Nothing is
broken for visitors; what it costs is the editor's trust in live preview, which is the feature
whose entire job is being believable.

**Fix.** Derive with an override — the same pattern already used for the specialty filter in
`src/blocks/SpecialistDirectory/DirectoryClient.tsx`: keep `null` for "editor hasn't clicked an
arrow", fall back to the prop, and let an arrow click take precedence.

**Risk — very low.** The arrows keep working; only the initial value becomes live.

---

## 4. `src/blocks/RelatedPosts/` is an orphaned block

**Measured.** It appears in `RenderBlocks.tsx`, the Pages `layout` array and `nestable.ts` **zero**
times, and nothing outside its own folder imports it. Same situation as the `Pagination` component
already deleted.

**Do not confuse this with the `relatedPosts` field, which is alive and working.** That field is
populated by `src/endpoints/seed/seedDataLayer.ts` and rendered by
`src/app/(frontend)/in-the-loop/[stream]/[slug]/page.tsx:135` using its own markup — not by this
block.

**Impact.** None functionally. The cost is a future maintainer editing the orphaned block expecting
the article page's "You might also like" section to change, and being quietly wrong.

**Fix.** Delete the folder. **Risk — very low**; confirm no imports first, as above.

---

## 5. The outstanding migration

Not a code fix. **This blocks deployment** — the box cannot run the new code against the old schema.

**Measured drift**, checked-in baseline (`src/migrations/20260705_105320_baseline.json`) versus the
current schema:

| | Baseline | Now | Change |
|---|---|---|---|
| Columns | 3207 | 3329 | **+125, −3** |
| Tables | 301 | 303 | +2 |
| Indexes | 946 | 1267 | +321 |

The additions are ordinary (design-system tokens, brand colours, `events.registration_closes_at`,
`offices.is_primary`, `site_settings.enquiry_form_id`, `search.uri`, guest presenters, shadow fields
on several blocks, and three extra FK columns on each `*_rels` table carrying a link).

**The three removals are the part to be deliberate about:**

```
article_settings.labels_breadcrumb_home_label
team_settings.labels_breadcrumb_home_label
specialist_profile.breadcrumb_breadcrumb_current_label
```

These were consolidated into `site_settings.breadcrumbs_*` (Home label / separator / landmark name);
nothing reads the old columns any more. The migration will `DROP` them, and **any breadcrumb label
an editor customised on the box is lost** — it does not carry across to the new location
automatically. That was accepted for this deploy because the box's content is being replaced
wholesale. **It will not be acceptable next time**, once the box holds real edits: a future
consolidation like this needs an `UPDATE … SET new = old` in the migration *before* the `DROP`.

**`migrate:create` will not warn you.** The "Accept warnings and push schema to database?" prompt
exists only in the **dev-push** path (`pushDevSchema.js`), which is what runs during local
development. `migrate:create` writes the SQL silently, `DROP COLUMN`s included. Read the generated
file.

**Procedure, on the box:**

1. `pnpm payload generate:types`
2. `pnpm payload migrate:create <name>`
3. **Open the generated SQL.** Confirm exactly **three** `DROP COLUMN` statements and that all three
   are the breadcrumb labels above. Anything else dropping is a mistake — stop and investigate.
4. `pnpm payload migrate`
5. `pnpm build`
6. In the admin, check **Site Settings → Breadcrumbs**. Locally these are `Home` / `›` /
   `Breadcrumb`; set them to whatever the site should use.
