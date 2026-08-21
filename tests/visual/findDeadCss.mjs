/**
 * Finds CSS class selectors in globals.css that nothing can ever render.
 *
 * Static analysis alone is NOT sufficient here — it produced two false
 * positives that would each have broken a live page (`hero-definition-panel--glow`
 * builds the homepage hero, `vf-ag-note--warning` is a stored select value).
 * Both are constructed from template literals, so the class name never appears
 * verbatim in the source. Hence three independent safety nets:
 *
 *   1. verbatim class strings anywhere in src/
 *   2. a prefix allowlist for template-literal construction
 *   3. a live crawl of every route, unioning the real classList
 *
 * A class must be absent from all three to be considered dead.
 *
 *   node tests/visual/findDeadCss.mjs
 *
 * ── READ BEFORE DELETING ANYTHING ───────────────────────────────────────────
 * The output is a list of CANDIDATES, not a verdict. Two caveats that have
 * already bitten:
 *
 *  1. LIVE_PREFIXES must be kept in sync with every dynamic class construction
 *     in the codebase. Regenerate it with:
 *       grep -rhoE '`[a-z][a-z0-9-]*-\$\{' src --include='*.tsx' --include='*.ts' | sort -u
 *     A prefix missing from that list turns every class under it into a false
 *     positive, and deleting one breaks a page silently.
 *
 *  2. ROUTES must include at least one URL per collection detail template
 *     (specialist profile, team member, article, event, post). Classes used only
 *     on an uncrawled template look dead when they are not.
 *
 * Delete only rules whose selector list is ENTIRELY dead, in a single revertible
 * commit, and re-run `computedSnapshot.mjs compare` afterwards.
 */
import { chromium } from '@playwright/test'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const CSS = 'src/app/(frontend)/globals.css'
const BASE = process.env.BASE_URL || 'http://localhost:3000'

// Every `vf-x--${slug}` / `x-${slug}` shape in the codebase. Anything under one
// of these prefixes is presumed live: the crawl only exercises the option values
// that happen to be seeded, so absence from it proves nothing.
const LIVE_PREFIXES = [
  'page-hero--',
  'hero-definition-panel--',
  'vf-ag-note--',
  'img-',
  'tag-',
  'offer-',
  'block-',
  'card-accent-',
  'faq-',
  'ni-grid-',
  'vf-specialty-panel-',
  'vf-callout--',
  'vf-heading--',
  'vf-text--',
  'vf-icon--',
  'vf-spacer--',
  'vf-image--',
  'vf-divider--',
  'vf-btn--',
  'vf-col--span-',
  'vf-row--gap-',
  'vf-row--alignY-',
  'vf-section--',
  'vf-shadow-',
  'vf-hover-',
  'vf-align-',
  'vf-motion',
]

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue
    const p = join(dir, entry)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.(tsx?|jsx?|md|json)$/.test(entry) && !p.endsWith('globals.css')) out.push(p)
  }
  return out
}

const src = readFileSync(CSS, 'utf8')
const classes = new Set([...src.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]))

const files = walk('src')
const haystack = files.map((f) => readFileSync(f, 'utf8')).join('\n')
// HOOKS.md is a published API for editors' presets — never treat it as dead.
const documented = new Set(
  [...readFileSync('src/Styles/HOOKS.md', 'utf8').matchAll(/[.`]([a-z][\w-]*)/g)].map((m) => m[1]),
)

const ROUTES = [
  '/',
  '/about-verify',
  '/about/meet-the-team',
  '/services',
  '/specialists',
  '/specialists/specialty-list',
  '/specialists/join-expert-panel',
  '/in-the-loop',
  '/events',
  '/contact',
  '/search',
  // `/legal/privacy-policy` was listed here and 404s — the page is at
  // `/privacy-policy`. Same dead-route bug already fixed in computedSnapshot.mjs,
  // and it matters more here: an unreachable page contributes no classes, so every
  // selector unique to it reads as dead. Measured 2026-08-20.
  '/privacy-policy',
  '/information-centre/for-clients',
  '/information-centre/for-claimants',
  '/make-a-booking',
  // One URL per collection detail template — these use classes that appear
  // nowhere else, so omitting them manufactures false positives.
  '/specialists/profiles/dr-bill-donnelly',
  '/about/team/georgia-gowen',
  '/events/event/end-of-year-medico-legal-case-review',
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const rendered = new Set()
for (const route of ROUTES) {
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    const found = await page.evaluate(() =>
      [...document.querySelectorAll('*')].flatMap((e) => [...e.classList]),
    )
    for (const c of found) rendered.add(c)
  } catch (err) {
    console.error(`  ! ${route}: ${err.message}`)
  }
}
await browser.close()

const dead = [...classes]
  .filter((c) => !rendered.has(c))
  .filter((c) => !documented.has(c))
  .filter((c) => !LIVE_PREFIXES.some((p) => c.startsWith(p)))
  .filter((c) => !new RegExp(`['"\`\\s.]${c}['"\`\\s]`).test(haystack))
  .sort()

console.log(`selectors in globals.css: ${classes.size}`)
console.log(`rendered across ${ROUTES.length} routes: ${rendered.size}`)
console.log(`candidates for deletion: ${dead.length}\n`)
console.log(dead.join('\n'))
