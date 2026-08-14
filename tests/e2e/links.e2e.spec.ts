import { test, expect } from '@playwright/test'

/**
 * Site-wide link audit.
 *
 * This exists because "the links all match the design reference" was reported as
 * fact and was not true: one link 404'd, thirty pointed at flat legacy paths that
 * only resolved through a 308, and several went to the wrong section entirely.
 * None of it was measured. This test measures it.
 *
 * It crawls every page in the five sitemaps rather than a hand-kept list, so a
 * new page is covered the day it is published.
 *
 * ## The timing trap this test is built around
 *
 * The first version of this audit read the DOM at `domcontentloaded` and reported
 * **65 dead anchors**. Every one was a false positive. Ids on article headings are
 * assigned by `ArticleToc` on mount, and other sections stream in, so checking
 * early sees a half-built page.
 *
 * The control used at the time — `#main-content` — could not catch it: it lives in
 * the root layout and is in the first byte, so it passed in exactly the runs that
 * were wrong. **A positive control must arrive on the same schedule as the thing
 * being measured.** The fragment test below therefore *polls* for the id rather
 * than reading once after a delay — a fixed delay is wrong in both directions,
 * too short during the audit and flaky under load — and the crawl collects
 * failures rather than asserting per page so one bad route cannot mask the rest.
 */

const LEGACY_PATHS = [
  '/for-clients',
  '/for-claimants',
  '/join-expert-panel',
  '/specialist-panel',
  '/ime',
  '/jme',
  '/meet-the-team',
  '/upcoming-events',
]

const SITEMAPS = ['pages', 'posts', 'specialists', 'team', 'events']

const collectPages = async (baseURL: string): Promise<string[]> => {
  const out = new Set<string>(['/'])
  for (const name of SITEMAPS) {
    const res = await fetch(`${baseURL}/${name}-sitemap.xml`)
    if (!res.ok) continue
    const xml = await res.text()
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) out.add(new URL(m[1]).pathname)
  }
  return [...out].sort()
}

test.describe('Links', () => {
  test.describe.configure({ mode: 'serial', timeout: 600_000 })

  test('every internal link resolves, and no link uses a redirecting legacy path', async ({
    page,
    baseURL,
  }) => {
    const base = baseURL!
    const pages = await collectPages(base)
    expect(pages.length, 'sitemaps should yield pages to crawl').toBeGreaterThan(20)

    type Found = { page: string; href: string; text: string }
    const links: Found[] = []
    // Collect rather than assert per page, so one bad route does not hide the
    // rest — and so the failure message lists every offender at once.
    const unrenderable: string[] = []
    for (const path of pages) {
      const res = await page.goto(base + path, { waitUntil: 'domcontentloaded' })
      if ((res?.status() ?? 500) >= 400) {
        unrenderable.push(`${path} → ${res?.status() ?? 'ERR'}`)
        continue
      }
      const found = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => ({
          href: a.getAttribute('href') || '',
          text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        })),
      )
      found.forEach((f) => links.push({ page: path, ...f }))
    }
    // A page in a sitemap that does not render is a 404 promised to search
    // engines. Nothing need link to it for that to be true, so a link crawl
    // alone cannot find it — this is the check that caught `/posts`.
    expect(
      unrenderable,
      `pages listed in a sitemap that do not render:\n  ${unrenderable.join('\n  ')}`,
    ).toEqual([])
    expect(links.length, 'should have found links to check').toBeGreaterThan(1000)

    const internal = [
      ...new Set(
        links
          .map((l) => l.href)
          .filter((h) => h && !/^(https?:|mailto:|tel:|javascript:)/.test(h)),
      ),
    ]

    // 1. Every internal destination must be a 200 in its own right. A 3xx counts
    //    as a failure: the project reserves permanent redirects for destinations
    //    that can never change, and an in-app navigation through one can drop the
    //    #fragment — which is what made anchored links land in the wrong place.
    const broken: string[] = []
    for (const href of internal) {
      const [path] = href.split('#')
      if (!path) continue
      const res = await fetch(base + path, { redirect: 'manual' })
      if (res.status !== 200) broken.push(`${path} → ${res.status} ${res.headers.get('location') ?? ''}`)
    }
    expect(broken, `internal links that do not return 200:\n  ${broken.join('\n  ')}`).toEqual([])

    // 2. No content link may use one of the flat legacy paths.
    const legacy = [
      ...new Set(
        links
          .filter((l) => LEGACY_PATHS.includes(l.href.split('#')[0]))
          .map((l) => `${l.page}  "${l.text}" → ${l.href}`),
      ),
    ]
    expect(legacy, `links still on a legacy path:\n  ${legacy.join('\n  ')}`).toEqual([])
  })

  test('every #fragment link has a target on the page it points at', async ({ page, baseURL }) => {
    const base = baseURL!
    const pages = await collectPages(base)

    const wanted = new Map<string, Set<string>>()
    for (const path of pages) {
      await page.goto(base + path, { waitUntil: 'domcontentloaded' })
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || ''),
      )
      for (const href of hrefs) {
        if (!href || /^(https?:|mailto:|tel:)/.test(href)) continue
        const [p, frag] = href.split('#')
        if (!frag) continue
        const target = p || path
        if (!wanted.has(target)) wanted.set(target, new Set())
        wanted.get(target)!.add(frag)
      }
    }
    expect(wanted.size, 'should have found fragment links to check').toBeGreaterThan(5)

    const dead: string[] = []
    for (const [target, frags] of wanted) {
      const res = await page.goto(base + target, { waitUntil: 'load' })
      if (!res || res.status() >= 400) {
        frags.forEach((f) => dead.push(`${target}#${f} (page ${res?.status() ?? 'ERR'})`))
        continue
      }
      // Poll rather than read once after a fixed delay. A single timed read is
      // what produced 65 false positives during the audit, and a fixed delay is
      // also flaky the other way: under load the page can still be settling when
      // the timer fires. Waiting for the condition removes the timing dependence
      // in both directions — only a genuine absence survives the full timeout.
      const list = [...frags]
      let missing: string[] = []
      try {
        await page.waitForFunction(
          (ids) => ids.every((id) => !!document.getElementById(id)),
          list,
          { timeout: 8000 },
        )
      } catch {
        missing = await page.evaluate(
          (ids) => ids.filter((id) => !document.getElementById(id)),
          list,
        )
      }
      missing.forEach((f) => dead.push(`${target}#${f}`))
    }

    expect(dead, `links pointing at an id that does not exist:\n  ${dead.join('\n  ')}`).toEqual([])
  })

  /**
   * The four faults that prompted this suite, asserted on behaviour rather than on
   * the href — an href can be right while the page still does the wrong thing,
   * which is exactly what happened with the appointment guide: the link was
   * corrected and the guide still opened on In-Person because the anchor ids had
   * never reached the database.
   *
   * Proven red by reverting any one of: the `scroll-padding-top` on `html`, the
   * hash handling in `AppointmentGuide/GuideClient.tsx`, or the corresponding
   * entry in `src/endpoints/seed/seedLinkRepairs.ts`.
   */
  test('the homepage gateway and service links land where they say', async ({ page, baseURL }) => {
    const base = baseURL!
    await page.setViewportSize({ width: 1440, height: 900 })

    // Videolink must select the Videolink type, not merely scroll somewhere.
    await page.goto(`${base}/information-centre/for-claimants#videolink-appointment`, {
      waitUntil: 'load',
    })
    await page.waitForTimeout(1800)
    const guide = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('.vf-ag-type-btn')]
      const sel = btns.find((b) => b.getAttribute('aria-selected') === 'true')
      return {
        selected: sel?.querySelector('.vf-ag-type-btn-label')?.textContent?.trim() ?? null,
        top: sel ? Math.round(sel.getBoundingClientRect().top) : null,
        navH: Math.round(document.querySelector('nav.site-nav')!.getBoundingClientRect().height),
        scrolled: Math.round(window.scrollY),
      }
    })
    expect(guide.selected, 'deep link should select the Videolink type').toBe(
      'Videolink Appointment',
    )
    expect(guide.scrolled, 'should have scrolled to the guide').toBeGreaterThan(200)
    expect(guide.top!, 'the toggle must clear the sticky nav').toBeGreaterThanOrEqual(guide.navH)

    // Anchored service links must put the TITLE below the nav, not behind it.
    for (const [path, id] of [
      ['/services/medico-legal/reporting-services', 'file-review'],
      ['/services/medico-legal/reporting-services', 'expert-evidence'],
      ['/services/medico-legal/admin-services', 'surrogate-assessment'],
    ] as const) {
      await page.goto(`${base}${path}#${id}`, { waitUntil: 'load' })
      await page.waitForTimeout(1600)
      const r = await page.evaluate((anchor) => {
        const el = document.getElementById(anchor)!
        const t =
          el.querySelector('.as-accordion-trigger-title') ?? el.querySelector('h1,h2,h3,h4')
        return {
          navH: Math.round(document.querySelector('nav.site-nav')!.getBoundingClientRect().height),
          titleTop: t ? Math.round(t.getBoundingClientRect().top) : null,
          title: t?.textContent?.trim().slice(0, 40) ?? null,
        }
      }, id)
      expect(r.titleTop, `#${id} should have a title to land on`).not.toBeNull()
      expect(
        r.titleTop!,
        `#${id}: "${r.title}" is behind the ${r.navH}px sticky nav at y=${r.titleTop}`,
      ).toBeGreaterThanOrEqual(r.navH)
    }
  })
})
