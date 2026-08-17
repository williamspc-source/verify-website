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
    if (/^@(media|supports|layer)/.test(prelude)) {
      out.push(...parse(body, media ? `${media} and ${prelude}` : prelude))
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
  const lines = []
  for (const [prop, val] of Object.entries(refDecls)) {
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
  `Reference selectors: ${ref.size}   ·   build: ${build.size}   ·   deliberately not ported: ${skipped.length}`,
)
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
