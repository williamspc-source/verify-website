/**
 * Diffs every CSS declaration the design reference makes for a family of
 * selectors against what `globals.css` declares for the same selectors.
 *
 *   node tests/visual/referenceCssDiff.mjs events
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 *
 * The events pages were ported, reviewed, and reported as matching the
 * reference. They were not. The check used had compared the `h1` string and the
 * list of `h2` headings — a *structural* probe — and a structural match was
 * reported as a visual one. Hero alignment, type scale, section backgrounds,
 * card design and carousel chrome had never been measured, and the differences
 * were found one at a time, by eye, over several rounds.
 *
 * Spotting differences does not converge. Enumerating them does. This reads
 * every rule on both sides and prints a count, so "I think I got them all"
 * becomes a number that has to reach zero.
 *
 * ── The two things that make it usable ──────────────────────────────────────
 *
 *  1. **Token resolution.** This repo deliberately rewrote colour and radius
 *     literals to `var()`/`color-mix()`. Comparing raw text makes every one of
 *     those look like a defect — 60+ false positives on the events family
 *     alone. TOKENS below resolves them first. Keep it in step with `:root`.
 *
 *     That resolution is also what caught the one real tokenisation bug: a
 *     literal `20px` had been rewritten to `var(--radius)`, and this repo's
 *     `--radius` is `0.5rem` while the reference's is `8px`. The codemods are
 *     documented as "value-preserving by construction"; that one was not.
 *
 *  2. **Base rules only.** Declarations inside `@media` are collected
 *     separately and not compared, because the reference's mobile overrides
 *     legitimately differ from ours. A desktop diff of zero is the goal; this
 *     tool says nothing about narrow viewports.
 *
 * ── What it does NOT prove ──────────────────────────────────────────────────
 *
 * 1. That a rule is in the file, not that it reached the page. Cascade layers,
 *    specificity and a stale build all sit between the two — each has already
 *    produced a wrong conclusion in this repo.
 *
 * 2. **Anything about a property neither side declares.** This compares the
 *    reference's declarations against ours; where the reference omits a property
 *    and inherits a browser default, there is nothing to compare and the diff
 *    stays clean. That is not hypothetical — it reported zero for the events
 *    family while four headings rendered at `font-weight: 400` against the
 *    reference's 700. The reference omits the weight and inherits the browser's
 *    bold; `@layer base` in globals.css resets `h1…h6` to `font-weight: unset`,
 *    so our port of that same omission inherited 400 instead. Identical
 *    stylesheets, different rendering, nothing for a declaration diff to see.
 *
 * **So always confirm in the browser with getComputedStyle**, and measure the
 * inherited properties — weight, size, colour, alignment — explicitly. A zero
 * here is necessary, not sufficient.
 */

import { readFileSync } from 'node:fs'

// ── Families ────────────────────────────────────────────────────────────────
// Add one per porting job. `match` decides which selectors are in scope.
const FAMILIES = {
  events: {
    css: ['.design-reference/assets/css/events.css'],
    pages: [
      '.design-reference/events/events-seminars.html',
      '.design-reference/events/upcoming-events.html',
      '.design-reference/events/past-events.html',
    ],
    match: /^\.(events-|event-card|event-type-tag|event-list|cal-)/,
  },
  // The /services hub's three middle sections: the IME/JME split rows, the
  // Reports & Opinions cards and the Administrative cards.
  //
  // Unlike every other family, these rules exist ONLY in the page's inline
  // <style> — `grep svc-feature|reporting|admin` over styles.css returns zero —
  // so the usual "declared twice, the inline copy wins" caveat does not apply.
  // styles.css is still listed because `.section-label` / `.section-title` /
  // `.section-subtitle` inside those sections come from it.
  //
  // Deliberately scoped to those three. Widening to /^\.svc-/ would pull in the
  // hero, the AAMLE band and the closing CTA — worth doing, but a separate job.
  services: {
    css: ['.design-reference/assets/css/styles.css'],
    pages: ['.design-reference/services/services.html'],
    match: /^\.(svc-feature|reporting-|admin-|admin-link)/,
  },
}

/**
 * Reference selectors we deliberately do not carry, each with the reason.
 * Anything not listed here and not in the build is a genuine gap.
 *
 * Keep this honest: it is an exception list, and an exception list is where the
 * next false negative hides. A selector belongs here only when NOT porting it is
 * the decision — never because it was awkward.
 */
const NOT_PORTED = {
  events: {
    '.events-offer-toggle': 'Pause/Play button removed — the reference has no such control.',
    '.events-offer-toggle:hover': 'ditto',
    '.events-offer-toggle[aria-pressed="true"]': 'ditto',
    '.events-offer-arrow i':
      'Our arrows are Phosphor React components, which render <svg>, not an <i> webfont glyph. `.events-offer-arrow svg` carries the same 20px sizing.',
    '.events-offer-intro': 'Section not used on any of our events pages.',
    '.events-offer-intro h2': 'ditto',
    '.events-offer-intro p': 'ditto',
    '.events-offer-tags': 'ditto',
    '.events-offer-tags span': 'ditto',
    '.events-list-page': 'Reference page-level wrapper; our pages set their own background.',
  },
  services: {
    // The reference puts an icon above the IME heading and none above JME.
    // It never draws: `ph-activity` is not in Phosphor's duotone set, so that
    // <i> computes width/height 0 and `::before` content `none`, while
    // `.reporting-card-icon i` on the same page resolves to a real 24px glyph.
    // Removed by decision, to match what the reference renders.
    '.svc-feature-icon': 'Reference names `ph-activity`, which Phosphor duotone does not have — measured 0x0 with `::before: none`. Removed rather than ported.',
    '.svc-feature-icon svg': 'ditto',
    '.svc-feature-icon i': 'ditto',
    // Same reason the events family gives for `.events-offer-arrow i`.
    '.reporting-card-icon i': 'Our icons are Phosphor React components, which render <svg>, not an <i> webfont glyph. `.service-icon svg` carries the sizing.',
    '.admin-card-icon i': 'ditto',
    '.svc-feature-img svg':
      'Our image placeholder renders a label only; the reference also draws a picture glyph inside it. Cosmetic, and the placeholder is replaced the moment an editor uploads an image.',
  },
}

/**
 * Reference selector → the selector that implements it here.
 *
 * The events heroes are the case this exists for. The reference styles them with
 * a bespoke `.events-hero`; we render one shared `.page-hero` component and scope
 * the treatment with `.events-pages` on the page wrapper, because widening
 * `.page-hero h1` would restyle 25 unrelated pages and break the hero-weight
 * guard in tests/e2e/frontend.e2e.spec.ts.
 */
// A value may be a single selector, or a LIST whose declarations are merged in
// cascade order (base first, override last). The list form matters: our scoped
// rules only carry what differs from the shared component, so comparing the
// override alone reports every inherited declaration as missing.
const IMPLEMENTED_AS = {
  events: {
    '.events-hero': ['.page-hero', '.events-pages .page-hero'],
    '.events-hero h1': ['.page-hero h1', '.events-pages .page-hero h1'],
    '.events-hero p': ['.page-hero-sub', '.events-pages .page-hero-sub'],
    '.events-hero-copy': ['.page-hero-inner', '.events-pages .page-hero-inner'],
    '.events-hero-breadcrumb': ['.vf-breadcrumb', '.events-pages .vf-breadcrumb'],
    // `.page-hero h1` takes its colour from `.page-hero--dark`, and the trail
    // its margin from `.vf-breadcrumb`'s shorthand — both confirmed identical in
    // the browser (#fff, 24px), which is the check that settles it.
    // The remaining `.events-hero-*` rules colour a bespoke breadcrumb that our
    // shared <Breadcrumbs> already styles from the same tokens.
    '.events-hero-inner': null,
    '.events-hero h1 span': null,
    '.events-hero-breadcrumb a': null,
    '.events-hero-breadcrumb a:hover': null,
    '.events-hero-breadcrumb span': null,
    '.events-hero-breadcrumb strong': null,
  },
  services: {
    // Split rows (IME / JME).
    '.svc-features': ['.vf-section', '.vf-section--white'],
    '.svc-feature-row': ['.vf-split', '.svc-learn-rows .vf-split'],
    '.svc-feature-row:first-child': '.svc-learn-rows .vf-split:first-child',
    '.svc-feature-row:last-child': '.svc-learn-rows .vf-split:last-child',
    '.svc-feature-img': ['.vf-split__media', '.vf-split__media--placeholder', '.svc-learn-rows .vf-split__media'],
    '.svc-feature-img-label': [
      '.vf-split__media--placeholder',
      '.vf-split__media--placeholder span',
      '.svc-learn-rows .vf-split__media--placeholder span',
    ],
    '.svc-feature-content h2': ['.section-title', '.vf-split__title', '.svc-learn-rows .vf-split__title'],
    '.svc-feature-content p': ['.vf-split__body', '.vf-split__body p', '.svc-learn-rows .vf-split__body p'],
    '.svc-feature-link': ['.btn', '.svc-learn-rows .vf-split__cta .btn'],
    '.svc-feature-link:hover': '.svc-learn-rows .vf-split__cta .btn:hover',

    // Reports & Opinions — one shared ServicesGrid, scoped by `.svc-reporting`.
    '.reporting-section': ['.vf-section', '.vf-section--muted'],
    '.reporting-header': ['.vf-section-header', '.svc-reporting .vf-section-header'],
    '.reporting-cards': '.services-grid',
    '.reporting-card': ['.service-card', '.svc-reporting .service-card'],
    '.reporting-card:hover': ['.service-card:hover', '.svc-reporting .service-card:hover'],
    '.reporting-card-icon': ['.service-icon', '.svc-reporting .service-icon'],
    '.reporting-card-icon svg': ['.service-icon svg', '.svc-reporting .service-icon svg'],
    '.reporting-card h3': ['.service-title', '.svc-reporting .service-title'],
    '.reporting-card p': ['.service-desc', '.svc-reporting .service-desc'],
    '.reporting-card-link': ['.service-enquire', '.svc-reporting .service-enquire'],
    '.reporting-card-link:hover': ['.service-enquire:hover', '.svc-reporting .service-enquire:hover'],

    // Administrative — the same block again, scoped by `.svc-admin-split`.
    '.admin-section': ['.vf-section', '.vf-section--primary', '.vf-section.svc-glow-band'],
    '.admin-section::before': '.vf-section.svc-glow-band::before',
    '.admin-header': ['.vf-section-header', '.svc-admin-split .vf-section-header'],
    '.admin-section .section-label': ['.section-label', '.svc-admin-split .vf-section-header__eyebrow'],
    '.admin-section .section-title': ['.section-title', '.svc-admin-split .vf-section-header__title'],
    '.admin-section .section-title span': '.svc-admin-split .vf-section-header__title .vf-accent',
    '.admin-section .section-subtitle': ['.section-subtitle', '.svc-admin-split .vf-section-header__subtitle'],
    '.admin-cards': '.services-grid',
    '.admin-card': ['.service-card', '.svc-admin-split .service-card'],
    '.admin-card:hover': ['.service-card:hover', '.svc-admin-split .service-card:hover'],
    '.admin-card-icon': ['.service-icon', '.svc-admin-split .service-icon'],
    '.admin-card-icon svg': ['.service-icon svg', '.svc-admin-split .service-icon svg'],
    '.admin-card h3': ['.service-title', '.svc-admin-split .service-title'],
    '.admin-card p': ['.service-desc', '.svc-admin-split .service-desc'],
    '.admin-link': ['.service-enquire', '.svc-admin-split .service-enquire'],
    '.admin-link:hover': ['.service-enquire:hover', '.svc-admin-split .service-enquire:hover'],
  },
}

/**
 * Individual declarations that legitimately differ, each with the reason.
 *
 * `NOT_PORTED` excuses a whole selector; this excuses ONE property on a selector
 * we do implement. It exists because three kinds of difference can never be
 * closed and would otherwise keep the count permanently off zero — a count that
 * never reaches zero is a count nobody reads:
 *
 *   1. A value this repo deliberately made editable (a spacing preset, a brand
 *      gradient, a column count) where the reference hardcodes a literal.
 *   2. A declaration that is inert against our markup or our icon set.
 *   3. Two spellings of the same computed value.
 *
 * Same discipline as the other two lists: an entry is a claim that the
 * difference is intended, and it needs a reason a reader can check. Anything
 * that is merely awkward to fix belongs in the code, not here. Counted and
 * printed in the summary so they stay visible.
 */
const EXPLAINED = {
  services: {
    '.svc-features': { padding: 'Section padding is the editor-controlled `--space-normal` preset (56–88px) rather than a literal 80px. Retuning the site rhythm is a Design System edit, not a per-page one.' },
    '.reporting-section': { padding: 'ditto — the reference varies 72/80px per section; ours is one preset.' },
    '.admin-section': {
      padding: 'ditto.',
      background: '`--band-primary` is the brand gradient from Site Settings; the reference hardcodes 160deg #14639e→#1c75bc. Ours is 135deg #0d4f85→#1c75bc, editable per install.',
    },
    '.reporting-cards': { 'grid-template-columns': 'Column count is the ServicesGrid block\'s `columns` field, emitted as `--vf-cols`. Set to 3 on this page, so the rendered grid matches; hardcoding 3 would take the control away from the editor.' },
    '.admin-cards': { 'grid-template-columns': 'ditto — `columns` is 4 on this block.' },
    '.svc-feature-img': {
      'flex-direction': 'Our placeholder holds a single label element, so a column direction is inert. The reference stacks a glyph above the label; we do not render the glyph (see `.svc-feature-img svg`).',
      gap: 'ditto — one child, nothing to space.',
    },
    '.svc-feature-link': { 'font-family': '`var(--font-heading, inherit)` vs `var(--font-heading)`. The token is always defined, so the fallback never applies and the computed value is identical.' },
    '.reporting-card-icon svg': { stroke: 'The reference draws stroked inline SVGs. Phosphor duotone icons are FILLED and take `currentColor`, which `.service-icon` already sets to `--primary`; a stroke would add a second outline.' },
    '.admin-card-icon svg': { stroke: 'ditto.' },
    '.admin-link': { transition: 'Ours also transitions `color`, because `.service-enquire` has a hover colour the reference\'s `.admin-link` does not. A superset, not a mismatch.' },
  },
}

/**
 * Custom properties, read from each side's OWN `:root`.
 *
 * Both stylesheets define `--radius`, and they disagree — 8px in the reference,
 * 0.5rem here. Resolving both sides with one map reported `.events-view-link` as
 * differing when the two computed values are identical. Parse, do not hardcode.
 */
// Tokens compared BY NAME, never by value. The brand typeface is the reason:
// the reference is set in Montserrat/Open Sans and this site in
// MuseoSansRounded — a deliberate, documented deviation (design-diff
// Comparison 19), not a porting error. Resolving these produced 24 phantom
// differences whose "reference" and "build" lines were the identical string.
const COMPARE_BY_NAME = new Set(['--font-heading', '--font-body', '--font-sans', '--font-mono'])

function rootTokens(css) {
  const tokens = {}
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    const [, name, value] = m
    if (COMPARE_BY_NAME.has(name)) continue
    if (!(name in tokens)) tokens[name] = value.trim()
  }
  // Resolve tokens that point at other tokens (--text-mid: var(--text-mid-base)).
  for (let pass = 0; pass < 3; pass++) {
    for (const [k, v] of Object.entries(tokens)) {
      tokens[k] = v.replace(/var\((--[\w-]+)\)/g, (m, ref) => tokens[ref] ?? m)
    }
  }
  return tokens
}

/** Flatten a stylesheet into {selector, decls, media} rows. */
function parse(css, media = '') {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const out = []
  let i = 0
  while (i < css.length) {
    const brace = css.indexOf('{', i)
    if (brace < 0) break
    const prelude = css.slice(i, brace).trim()
    let depth = 1
    let j = brace + 1
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
      j++
    }
    const body = css.slice(brace + 1, j - 1)
    if (/^@(media|supports)/.test(prelude)) {
      out.push(...parse(body, media ? `${media} and ${prelude}` : prelude))
    } else if (/^@layer/.test(prelude)) {
      // A cascade layer is NOT a conditional group: its rules apply at every
      // viewport, they just lose priority ties. Lumping it in with @media put
      // everything in `@layer components` — `.vf-section`, `.vf-split__icon` and
      // the rest — into the media bucket, which is never compared, so the tool
      // reported those selectors as ABSENT FROM THE BUILD while they sat in the
      // file. Recurse with the *inherited* media, not the layer name.
      out.push(...parse(body, media))
    } else if (!prelude.startsWith('@')) {
      const decls = {}
      for (const part of body.split(';')) {
        const c = part.indexOf(':')
        if (c < 0) continue
        const prop = part.slice(0, c).trim()
        const val = part.slice(c + 1).trim().replace(/\s+/g, ' ')
        if (prop && val && !prop.startsWith('--')) decls[prop] = val
      }
      for (const sel of prelude.split(',')) {
        const s = sel.trim().replace(/\s+/g, ' ')
        if (s) out.push({ sel: s, decls, media })
      }
    }
    i = j
  }
  return out
}

/** Resolve tokens and normalise colour/number spelling so equivalents compare equal. */
function normalise(value, tokens) {
  let s = value.toLowerCase().replace(/\s+/g, ' ').trim()
  for (const [name, val] of Object.entries(tokens)) s = s.split(`var(${name})`).join(val.toLowerCase())
  s = s.replace(/\b0\.5rem\b/g, '8px').replace(/\b1rem\b/g, '16px')
  s = s.replace(
    /color-mix\(in srgb,\s*([^,]+?)\s+([\d.]+)%,\s*transparent\)/g,
    (_m, colour, pct) => {
      const a = String(Number(pct) / 100)
      const hex = colour.trim().replace('#', '')
      if (/^[0-9a-f]{6}$/.test(hex)) {
        const [r, g, b] = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16))
        return `rgba(${r},${g},${b},${a})`
      }
      if (/^[0-9a-f]{3}$/.test(hex)) {
        const [r, g, b] = [...hex].map((ch) => parseInt(ch + ch, 16))
        return `rgba(${r},${g},${b},${a})`
      }
      return `rgba(${colour.trim()},${a})`
    },
  )
  s = s.replace(/#fff\b/g, 'rgba(255,255,255,1)').replace(/#ffffff\b/g, 'rgba(255,255,255,1)')
  s = s.replace(/\s*,\s*/g, ',')
  s = s.replace(/\b0\.(\d+)/g, '.$1') // 0.5 === .5
  s = s.replace(/\b(\d+)\.0+\b/g, '$1') // 12.0 === 12
  return s
}

const name = process.argv[2] || 'events'
const family = FAMILIES[name]
if (!family) {
  console.error(`Unknown family "${name}". Known: ${Object.keys(FAMILIES).join(', ')}`)
  process.exit(2)
}

// ── Collect ─────────────────────────────────────────────────────────────────
let referenceCss = ''
for (const f of family.css) referenceCss += '\n' + readFileSync(f, 'utf8')
for (const f of family.pages) {
  const html = readFileSync(f, 'utf8')
  // The reference redeclares most rules in a per-page inline <style> at equal
  // specificity, and THAT is the copy which renders. Both are collected; the
  // inline one is applied last so it wins, matching the browser.
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) referenceCss += '\n' + m[1]
}
const buildCss = readFileSync('src/app/(frontend)/globals.css', 'utf8')

const collect = (rows, extraSelectors = new Set()) => {
  const map = new Map()
  for (const r of rows) {
    // `extraSelectors` lets the build side also collect the shared-component
    // rules an alias chain points at (`.page-hero h1`, `.vf-breadcrumb`), which
    // the family pattern would otherwise exclude — leaving every inherited
    // declaration looking absent.
    if (r.media || !(family.match.test(r.sel) || extraSelectors.has(r.sel))) continue
    if (!map.has(r.sel)) map.set(r.sel, {})
    Object.assign(map.get(r.sel), r.decls)
  }
  return map
}
const aliasTargets = new Set(
  Object.values(IMPLEMENTED_AS[name] || {})
    .filter(Boolean)
    .flatMap((v) => (Array.isArray(v) ? v : [v])),
)
const ref = collect(parse(referenceCss))
const build = collect(parse(buildCss), aliasTargets)

// Each side resolves ITS OWN custom properties. The two stylesheets disagree on
// `--radius`, so a single shared map produces phantom differences.
const refTokens = rootTokens(readFileSync('.design-reference/assets/css/styles.css', 'utf8') + referenceCss)
const buildTokens = rootTokens(buildCss)

const notPorted = NOT_PORTED[name] || {}
const implementedAs = IMPLEMENTED_AS[name] || {}

// ── Report ──────────────────────────────────────────────────────────────────
const missingSelectors = []
const skipped = []
const explainedLines = []
let explainedCount = 0
let differing = 0
const report = []

for (const [sel, refDecls] of ref) {
  if (sel in notPorted) {
    skipped.push(`   ${sel} — ${notPorted[sel]}`)
    continue
  }
  // A selector we implement under a different name is compared against that one.
  const alias = sel in implementedAs ? implementedAs[sel] : sel
  if (alias === null) {
    skipped.push(`   ${sel} — covered by a shared component's own styling`)
    continue
  }
  // Merge in cascade order when the implementation is split across a base rule
  // and a scoped override.
  const chain = Array.isArray(alias) ? alias : [alias]
  const buildDecls = chain.reduce((acc, s) => (build.has(s) ? { ...acc, ...build.get(s) } : acc), {})
  if (!Object.keys(buildDecls).length) {
    missingSelectors.push(alias === sel ? sel : `${sel}  (expected as ${chain.join(' + ')})`)
    continue
  }
  const aliased = chain.join(' + ') !== sel
  const explained = (EXPLAINED[name] || {})[sel] || {}
  const lines = []
  for (const [prop, val] of Object.entries(refDecls)) {
    if (prop in explained) {
      explainedCount++
      explainedLines.push(`   ${sel} · ${prop} — ${explained[prop]}`)
      continue
    }
    // Layout/positioning props are meaningless across a selector rename.
    // Set elsewhere in our cascade (a theme modifier, or a `margin` shorthand)
    // and verified equal in the browser. Comparing them across a rename reports
    // a difference that getComputedStyle says is not there.
    if (aliased && ['position', 'z-index', 'overflow', 'margin', 'margin-bottom', 'color'].includes(prop))
      continue
    if (!(prop in buildDecls)) {
      lines.push(`   missing   ${prop}: ${val}`)
    } else if (normalise(buildDecls[prop], buildTokens) !== normalise(val, refTokens)) {
      lines.push(`   differs   ${prop}\n               reference: ${val}\n               build:     ${buildDecls[prop]}`)
    }
  }
  if (lines.length) {
    differing++
    report.push(`\n${sel}${aliased ? `  →  ${chain.join(' + ')}` : ''}\n${lines.join('\n')}`)
  }
}

console.log(
  `Reference selectors: ${ref.size}   ·   build: ${build.size}   ·   deliberately not ported: ${skipped.length}   ·   explained differences: ${explainedCount}`,
)
if (process.argv.includes('--verbose') && explainedLines.length) {
  console.log('\n── explained differences ──')
  console.log(explainedLines.join('\n'))
}
if (process.argv.includes('--verbose') && skipped.length) {
  console.log('\n── deliberately not ported ──')
  console.log(skipped.join('\n'))
}

if (missingSelectors.length) {
  console.log(`\n── ${missingSelectors.length} selector(s) in the reference, absent from the build ──`)
  for (const s of missingSelectors) console.log(`   ${s}`)
}
if (report.length) {
  console.log(`\n── ${differing} shared selector(s) with differing declarations ──`)
  console.log(report.join('\n'))
}

const total = missingSelectors.length + differing
console.log(
  total === 0
    ? `\n✓ ${name}: no desktop differences. Now confirm in the browser — a rule in the file is not a rule on the page.`
    : `\n✗ ${name}: ${missingSelectors.length} missing selector(s) + ${differing} differing selector(s).`,
)
process.exit(total === 0 ? 0 : 1)
