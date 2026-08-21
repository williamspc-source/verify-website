import { expect, test } from '@playwright/test'

/**
 * No page renders a rich-text value as `[object Object]`, and no page dies
 * hydrating one.
 *
 * Both failures happened during the rich-text conversion, and neither is
 * catchable by the compiler, because the components involved declare their own
 * `string` props and the parent hands them a value through a cast:
 *
 *  · `FAQ` joined its help card's heading and body with `.join(' ')`. Rich text
 *    stringifies rather than throwing, so `/information-centre/for-clients`
 *    shipped the literal text "[object Object] [object Object]" beside an info
 *    icon. Nothing failed. It was found by a computed-style snapshot noticing
 *    the paragraph had become one line instead of two.
 *  · `EventsExplorerClient` rendered a converted `intro` straight into JSX. The
 *    server HTML was correct and complete, then hydration threw React error #31
 *    and blanked the page — `/events` went from 425 rendered nodes to 11 while
 *    still returning HTTP 200.
 *
 * So this checks the two things a visitor would actually see, on every route in
 * the sitemap-covered set. It is deliberately cheap: no fixtures, no seeding.
 *
 * Proven red by restoring the `.join(' ')`: **2 of 18 fail**, naming
 * `/information-centre/for-clients` and `/information-centre/for-claimants` —
 * the two pages carrying that help card — while the other 16 stay green. That is
 * the useful shape: it points at the pages, and the message says what happened.
 */

const ROUTES = [
  '/',
  '/about',
  '/about/meet-the-team',
  '/services',
  '/specialists',
  '/in-the-loop',
  '/events',
  '/events/upcoming-events',
  '/events/past-events',
  '/contact',
  '/privacy-policy',
  '/services/medico-legal/ime',
  '/services/medico-legal/jme',
  '/services/medico-legal/reporting-services',
  '/specialists/join-expert-panel',
  '/information-centre/for-clients',
  '/information-centre/for-claimants',
  '/make-a-booking',
]

test.describe('Rich text reaches the page as words', () => {
  for (const route of ROUTES) {
    test(`${route} renders no stringified objects and survives hydration`, async ({ page }) => {
      const pageErrors: string[] = []
      page.on('pageerror', (e) => pageErrors.push(e.message.split('\n')[0]))

      const response = await page.goto(route, { waitUntil: 'networkidle' })
      expect(response?.status(), `${route} should serve`).toBe(200)

      // Hydration must not throw. A page that dies here still returns 200 and
      // still has correct server HTML — the damage only shows in the browser.
      expect(pageErrors, `${route} threw while hydrating`).toEqual([])

      const text = await page.evaluate(() => document.body.innerText)
      expect(text, `${route} rendered a rich-text value as a stringified object`).not.toContain(
        '[object Object]',
      )

      // A positive control: a page that failed to hydrate can end up nearly
      // empty, and an empty page trivially satisfies both checks above.
      const nodes = await page.evaluate(() => document.querySelectorAll('*').length)
      expect(nodes, `${route} rendered almost nothing`).toBeGreaterThan(100)
    })
  }
})
