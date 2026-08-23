/**
 * Finds hover effects on things that are not clickable.
 *
 *   node tests/visual/findFalseHover.mjs [--verbose]
 *
 * A hover response is a promise. If an element brightens, lifts or changes colour
 * under the pointer, a visitor reads it as something to click — and if nothing
 * happens when they do, the page has lied to them. That is the same family as
 * every other defect this repo guards against: it looks like it works, so nobody
 * reports it.
 *
 * ── What prompted it ────────────────────────────────────────────────────────
 * The "Online Booking Portal" band ends in three tiles — Specialist Availability,
 * Download CV, Sample Redacted Report — that brightened on hover and did nothing.
 * They are plain `<div>`s here AND in the design reference, which declares
 * `.portal-opt4-tile:hover` on a non-interactive element. So a faithful port
 * inherited the reference's own mistake, on 26 specialist profiles plus three
 * pages, and it took someone noticing by eye.
 *
 * ── READ BEFORE CHANGING ANYTHING ───────────────────────────────────────────
 * The output is a list of CANDIDATES, not a verdict — the same warning
 * findDeadCss.mjs carries, for the same reason. Legitimate non-interactive
 * hovers exist: a table row highlighted for readability, a tooltip trigger, an
 * element whose hover is driven by a parent that IS interactive. Read each one
 * before deciding.
 *
 * ── How it decides ──────────────────────────────────────────────────────────
 * The CSS is parsed from disk, never through `document.styleSheets`: cross-sheet
 * access throws in the page and a try/catch around it reports zero matches for
 * EVERY selector, including ones plainly applied.
 *
 * For each rule containing `:hover` it finds the compound that actually bears the
 * pseudo-class — in `.card:hover .title` the hovered element is `.card`, not
 * `.title` — and queries that. A match is reported only when the element is not
 * interactive, contains no interactive descendant, and sits inside no interactive
 * ancestor. That last pair matters: a card that lifts on hover with a link inside
 * it is a correct, common pattern, and flagging it would bury the real findings.
 */
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const CSS = 'src/app/(frontend)/globals.css'
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const VERBOSE = process.argv.includes('--verbose')

/** Anything a visitor can legitimately expect to respond to a pointer. */
const INTERACTIVE = 'a[href], button, input, select, textarea, label, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [tabindex], [onclick], [contenteditable]'

// ── 1. Every selector in globals.css that reacts to hover ───────────────────
// Comments are stripped first. Without this a rule preceded by an explanatory
// `/* … */` carries the whole comment into its selector, which then matches
// nothing and reports as a selector that never rendered — or worse, prints a
// paragraph of prose where a selector should be. Seen on `.vf-card--banded`.
const css = readFileSync(CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]

/**
 * The element a rule actually hovers.
 *
 * Walks compounds left to right and stops at the one carrying `:hover`, so
 * `.card:hover .title` yields `.card`. `:hover` is stripped from that compound
 * and any other pseudo-element dropped, leaving something queryable.
 */
const hoverTarget = (selector) => {
  const parts = selector.trim().split(/\s+|(?=>)|(?<=>)/).filter(Boolean)
  const out = []
  for (const part of parts) {
    out.push(part)
    if (part.includes(':hover')) {
      const target = out.join(' ').replace(/:hover/g, '').replace(/::[a-z-]+/g, '').trim()
      return target.replace(/>\s*$/, '').trim() || null
    }
  }
  return null
}

/**
 * Does this rule REMOVE a hover response rather than add one?
 *
 * `.vf-hover-none .vf-card:hover { transform: none; box-shadow: none }` is the
 * editor's "no hover effect" option — it exists to kill an affordance, and
 * reporting it would be telling someone to delete the fix. A rule counts as
 * neutralising when every value it sets is an off switch.
 */
const NEUTRAL = /^(none|0|0px|unset|initial|inherit|transparent|scalex\(0\)|translatey\(0(px)?\)|revert)$/
const neutralises = (body) => {
  const decls = body
    .split(';')
    .map((d) => d.split(':').slice(1).join(':').trim().toLowerCase())
    .filter(Boolean)
  return decls.length > 0 && decls.every((v) => NEUTRAL.test(v))
}

const targets = new Map() // queryable selector → the rules that produced it
for (const [, rawSelector, body] of rules) {
  if (!rawSelector.includes(':hover')) continue
  if (neutralises(body)) continue
  for (const selector of rawSelector.split(',')) {
    if (!selector.includes(':hover')) continue
    const target = hoverTarget(selector)
    if (!target) continue
    // An element type that is interactive by definition needs no checking.
    if (/^(a|button|input|select|textarea|summary|label)\b/.test(target)) continue
    if (!targets.has(target)) targets.set(target, new Set())
    targets.get(target).add(`${selector.trim()} { ${body.trim().slice(0, 90)} }`)
  }
}

console.log(`hover rules in globals.css: ${rules.filter((r) => r[1].includes(':hover')).length}`)
console.log(`distinct hover targets to check: ${targets.size}\n`)

// ── 2. Routes, enumerated from the sitemaps ─────────────────────────────────
// Never from the link graph: a page nothing links to is invisible to a crawl,
// which is how /posts sat 404ing in the sitemap for months.
// Read the raw XML and take only <loc> contents. The first version of this walked
// `documentElement.textContent`, which concatenates every text node with no
// separator — so each <loc> arrived fused to the <lastmod> after it
// (`/contact2026-08-20T01:34:51.501Z`) and every namespace URL in the document
// came along as a route. Measured: 37 of 64 "routes" 404'd and the audit silently
// covered 27 pages while reporting 64.
const sitemapUrls = async (name, limit) => {
  const res = await fetch(`${BASE}/${name}-sitemap.xml`)
  if (!res.ok) throw new Error(`${name}-sitemap.xml returned HTTP ${res.status}`)
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, '') || '/')
  return [...new Set(urls)].slice(0, limit)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

// Every page, plus a few of each collection template — those carry classes that
// appear nowhere else, and a template left uncrawled hides whatever is unique
// to it.
const routes = [
  ...(await sitemapUrls('pages', 99)),
  ...(await sitemapUrls('specialists', 2)),
  ...(await sitemapUrls('team', 2)),
  ...(await sitemapUrls('events', 2)),
  ...(await sitemapUrls('posts', 2)),
]
console.log(`routes from sitemaps: ${routes.length}\n`)

// ── 3. Which targets render, and whether anything about them is clickable ───
const rendered = new Set()   // target → seen in the DOM at all
const suspect = new Map()    // target → { routes:Set, sample:string }
const skipped = []

for (const route of routes) {
  let response
  try {
    response = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 })
  } catch {
    skipped.push(`${route} (navigation failed)`)
    continue
  }
  // A checker that silently measures the wrong thing reads exactly like one that
  // found nothing wrong. Two routes were once banked as baselines while 404ing.
  if (response?.status() !== 200) {
    skipped.push(`${route} (HTTP ${response?.status()})`)
    continue
  }

  const found = await page.evaluate(
    ({ list, interactive }) => {
      const out = {}
      for (const target of list) {
        let els
        try {
          els = [...document.querySelectorAll(target)]
        } catch {
          continue // a selector this browser will not parse
        }
        if (!els.length) continue
        const bad = els.filter(
          (e) =>
            !e.matches(interactive) &&
            !e.querySelector(interactive) &&
            !e.closest(interactive),
        )
        out[target] = {
          total: els.length,
          bad: bad.length,
          sample: bad[0]
            ? (bad[0].textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60)
            : '',
        }
      }
      return out
    },
    { list: [...targets.keys()], interactive: INTERACTIVE },
  )

  for (const [target, info] of Object.entries(found)) {
    rendered.add(target)
    if (!info.bad) continue
    if (!suspect.has(target)) suspect.set(target, { routes: new Set(), sample: info.sample })
    suspect.get(target).routes.add(route)
  }
}

await browser.close()

// ── 4. Report ───────────────────────────────────────────────────────────────
if (skipped.length) {
  console.log(`skipped ${skipped.length} route(s):`)
  for (const s of skipped) console.log(`  ${s}`)
  console.log()
}

console.log(`targets that rendered anywhere: ${rendered.size} of ${targets.size}`)
console.log(`targets never rendered (nothing to say about them): ${targets.size - rendered.size}\n`)

if (!suspect.size) {
  console.log('No hover effect found on a non-interactive element.')
} else {
  console.log(`${suspect.size} hover target(s) with no clickable element in, on or around them:\n`)
  for (const [target, { routes: where, sample }] of [...suspect].sort()) {
    console.log(`  ${target}`)
    if (sample) console.log(`      text: "${sample}"`)
    console.log(`      on ${where.size} route(s): ${[...where].slice(0, 3).join(', ')}${where.size > 3 ? ' …' : ''}`)
    if (VERBOSE) for (const rule of targets.get(target)) console.log(`      rule: ${rule}`)
    console.log()
  }
  console.log('CANDIDATES, not a verdict — read each before changing it.')
}
