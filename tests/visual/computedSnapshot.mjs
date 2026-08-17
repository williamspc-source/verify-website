/**
 * Computed-style snapshot harness for the CSS token migration.
 *
 * The Phase 4 replacements (hex literal → var(), rgba() → color-mix()) are all
 * value-identical by construction, so the correct result is a **byte-identical
 * computed style**. That makes this a far sharper gate than a pixel diff: any
 * difference at all is a real bug, not a rendering tolerance to argue about.
 *
 * Nodes are keyed by structural index path rather than class name, because class
 * names are exactly what some phases change.
 *
 *   node tests/visual/computedSnapshot.mjs capture baseline
 *   node tests/visual/computedSnapshot.mjs compare baseline
 *
 * Must be run from the repo root so @playwright/test resolves.
 */
import { chromium } from '@playwright/test'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SNAP_DIR = join(HERE, '__snapshots__')
const BASE = process.env.BASE_URL || 'http://localhost:3000'

// Every property a colour/radius/shadow/size replacement could disturb.
const PROPS = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderTopWidth',
  'borderTopStyle',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'boxShadow',
  'outlineColor',
  'outlineWidth',
  'textShadow',
  'fill',
  'stroke',
  'opacity',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'paddingTop',
  'paddingBottom',
  // Horizontal spacing and alignment are here because their absence let a real
  // regression through: deleting a load-bearing `!important` re-centred an intro
  // paragraph 326px in from the left, and this harness reported the page as
  // unchanged — the element's width was identical and nothing it measured moved.
  // A pure sideways shift was outside the instrument.
  'paddingLeft',
  'paddingRight',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'textAlign',
  'gap',
  'filter',
  // Layout properties. These were missing, so the harness returned a clean diff
  // on exactly the changes most likely to break a page: an icon-size preset, a
  // grid column count, a hover transform. A pass without these proved less than
  // it appeared to.
  'width',
  'height',
  'gridTemplateColumns',
  'transform',
]

/**
 * Two of these used to be `/about-verify` and `/legal/privacy-policy`, which are
 * not routes on this site — both 404. The harness does not check status, so it
 * snapshotted the 404 page twice (178 nodes each, an identical count, which is
 * how it was spotted) and reported 14 routes of coverage while measuring 12.
 * `capture` now fails on any non-200 rather than quietly banking a 404 as a
 * baseline.
 */
const ROUTES = [
  '/',
  '/about',
  '/about/meet-the-team',
  '/services',
  '/specialists',
  '/in-the-loop',
  '/events',
  '/contact',
  '/search',
  '/privacy-policy',
  '/information-centre/for-clients',
  '/information-centre/for-claimants',
  '/make-a-booking',
  '/style-guide',
]

/**
 * Chrome serialises a `color-mix()` result as `color(srgb r g b / a)` with 0–1
 * channels, but a plain `rgba()` literal as `rgba(r, g, b, a)` with 0–255. The
 * two describe the identical colour, so comparing the raw strings would report
 * every tokenised declaration as a regression. Fold both into one form first.
 */
const srgbToRgba = (s) =>
  String(s).replace(
    /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/g,
    (_m, r, g, b, a) => {
      const to255 = (v) => Math.round(parseFloat(v) * 255)
      const alpha = a === undefined ? 1 : parseFloat(a)
      const rgb = `${to255(r)}, ${to255(g)}, ${to255(b)}`
      return alpha === 1 ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`
    },
  )

// Alpha channels serialise with varying precision across engines/colour spaces;
// normalise so a 0.141176 vs 0.14 difference doesn't masquerade as a regression.
const normalise = (s) =>
  srgbToRgba(s)
    .replace(/(\d+\.\d{3,})/g, (m) => Number(m).toFixed(3))
    .replace(/\s+/g, ' ')
    .trim()

const capture = async (page, url) => {
  const response = await page.goto(BASE + url, { waitUntil: 'networkidle' })
  // A 404 has a body and computes styles perfectly happily, so without this the
  // harness banks the not-found page as a baseline and reports coverage it does
  // not have. See the note above ROUTES.
  const status = response?.status() ?? 0
  if (status !== 200) throw new Error(`expected 200, got ${status}`)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(400)
  return page.evaluate((props) => {
    // Next injects dev-only nodes (the error overlay portal, the route
    // announcer, hydration scripts) that come and go between runs. They render
    // nothing and would otherwise swamp the diff with false positives.
    const SKIP = new Set([
      'SCRIPT',
      'STYLE',
      'LINK',
      'META',
      'TEMPLATE',
      'TITLE',
      'NEXTJS-PORTAL',
      'NEXT-ROUTE-ANNOUNCER',
    ])
    const out = {}
    const walk = (el, path) => {
      if (SKIP.has(el.tagName)) return
      const cs = getComputedStyle(el)
      out[path] = props.map((p) => cs[p]).join('|')
      let i = 0
      for (const child of el.children) {
        if (SKIP.has(child.tagName)) continue
        walk(child, `${path}>${i++}:${child.tagName}`)
      }
    }
    walk(document.body, 'body')
    return out
  }, PROPS)
}

const run = async () => {
  const [mode, name = 'baseline'] = process.argv.slice(2)
  if (!['capture', 'compare'].includes(mode)) {
    console.error('usage: computedSnapshot.mjs <capture|compare> [name]')
    process.exit(2)
  }
  mkdirSync(SNAP_DIR, { recursive: true })
  const file = join(SNAP_DIR, `${name}.json`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

  const snap = {}
  for (const route of ROUTES) {
    try {
      const r = await capture(page, route)
      for (const [k, v] of Object.entries(r)) snap[`${route} ${k}`] = normalise(v)
    } catch (err) {
      console.error(`  ! ${route}: ${err.message}`)
    }
  }
  await browser.close()

  if (mode === 'capture') {
    writeFileSync(file, JSON.stringify(snap, null, 0))
    console.log(`captured ${Object.keys(snap).length} nodes → ${file}`)
    return
  }

  if (!existsSync(file)) {
    console.error(`no baseline at ${file} — run capture first`)
    process.exit(2)
  }
  // Re-normalise the stored baseline too, so a baseline captured before a
  // normaliser improvement stays comparable. `normalise` is idempotent.
  const base = Object.fromEntries(
    Object.entries(JSON.parse(readFileSync(file, 'utf8'))).map(([k, v]) => [k, normalise(v)]),
  )
  const keys = new Set([...Object.keys(base), ...Object.keys(snap)])
  const diffs = []
  for (const k of keys) {
    if (base[k] !== snap[k]) diffs.push({ k, before: base[k], after: snap[k] })
  }
  console.log(`nodes: baseline ${Object.keys(base).length}, now ${Object.keys(snap).length}`)
  if (!diffs.length) {
    console.log('DIFF EMPTY — computed styles identical')
    return
  }
  console.log(`DIFF: ${diffs.length} node(s) changed`)
  for (const d of diffs.slice(0, 40)) {
    console.log(`\n  ${d.k}`)
    console.log(`    before: ${d.before}`)
    console.log(`    after : ${d.after}`)
  }
  if (diffs.length > 40) console.log(`\n  …and ${diffs.length - 40} more`)
  process.exit(1)
}

run()
