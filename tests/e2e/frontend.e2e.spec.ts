import { test, expect } from '@playwright/test'

/**
 * These assertions used to read:
 *
 *   await expect(page).toHaveTitle(/Payload Website Template/)
 *   await expect(page.locator('h1').first()).toHaveText('Payload Website Template')
 *
 * — the unmodified template's, against a site that has been rebranded for months.
 * So `pnpm test:e2e` was red before anyone touched it, which is the same as
 * having no e2e suite at all: a run that is always failing carries no signal, and
 * nobody looks at the output.
 *
 * They now assert things that are true of THIS site and that would break if the
 * homepage stopped rendering: the brand in the title, exactly one h1, and a
 * header and footer that actually rendered.
 */
test.describe('Frontend', () => {
  test('homepage renders the VERIFY site', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status(), 'homepage should return 200').toBe(200)

    await expect(page).toHaveTitle(/VERIFY/i)

    // Exactly one h1 — more than one is an accessibility and SEO defect, and it
    // is how a duplicated hero shows up.
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).not.toBeEmpty()

    // `.site-nav`, not `<header>`: the site renders its masthead as
    // `<nav class="site-nav">` with no `<header>` landmark anywhere on the page.
    // Asserting on `<header>` fails, which is how that was found. The `<main>`
    // landmark that was missing alongside it now exists and has its own test below.
    await expect(page.locator('nav.site-nav').first()).toBeVisible()
    await expect(page.locator('footer.site-footer').first()).toBeVisible()
  })

  /**
   * The main landmark and its skip link.
   *
   * Before this existed, `grep '<main'` returned zero hits site-wide and there was
   * no skip link, so a keyboard or screen-reader user traversed the entire nav on
   * every page — a standard axe/Lighthouse failure.
   *
   * `/search` is in the list deliberately: it is the one route with no `<article>`
   * of its own, so it is what would break first if the landmark were ever moved
   * out of the root layout onto the individual pages.
   *
   * Proven red by deleting the `<main>` wrapper in
   * `src/app/(frontend)/layout.tsx` — a guard that has never failed is not
   * evidence.
   */
  for (const path of ['/', '/search']) {
    test(`${path} has one main landmark reachable by a skip link`, async ({ page }) => {
      await page.goto(path)

      const main = page.locator('main#main-content')
      await expect(main, 'exactly one main landmark').toHaveCount(1)

      // The link must target the landmark, and be the FIRST thing Tab reaches —
      // a skip link placed after the nav skips nothing.
      const skip = page.locator('a.skip-link')
      await expect(skip).toHaveCount(1)
      await expect(skip).toHaveAttribute('href', '#main-content')
      await expect(skip, 'skip link must not be empty').not.toBeEmpty()

      // Offscreen until focused, on-screen once focused. Both halves are asserted
      // on the rendered position rather than on a class name.
      //
      // The first version of this test only checked the focused half, with
      // `top >= 0`. That is trivially true of an *unstyled* link sitting statically
      // at the top of the page — so it passed while the stylesheet was not
      // reaching the browser at all and "Skip to content" was rendering as visible
      // body text above the nav on every page. Asserting the hidden half is what
      // makes this catch a missing rule.
      const top = () => skip.evaluate((el) => el.getBoundingClientRect().top)
      expect(await top(), 'skip link must be offscreen until focused').toBeLessThan(0)

      await page.keyboard.press('Tab')
      await expect(skip, 'skip link should be the first focusable element').toBeFocused()

      // It slides in over ~0.28s, so poll rather than reading at t+0.
      await expect
        .poll(top, { message: 'skip link should slide on-screen while focused', timeout: 4000 })
        .toBeGreaterThanOrEqual(0)
    })
  }

  test('the enquiry drawer opens and can be submitted', async ({ page }) => {
    await page.goto('/')

    const trigger = page.locator('[data-enquiry-panel]').first()
    // Not every page carries a trigger; if the homepage does not, that is itself
    // worth knowing, so assert rather than skip.
    await expect(trigger, 'homepage should have at least one enquiry CTA').toBeVisible()

    await trigger.click()
    const panel = page.locator('.enquiry-panel')
    await expect(panel).toHaveClass(/is-open/)

    // The drawer disables Send until it has confirmed which form it posts into.
    // A permanently-disabled button means site-wide lead capture is dead — the
    // exact failure this suite exists to catch.
    const submit = panel.locator('button[type="submit"]')
    await expect(submit, 'Send should become enabled once the form resolves').toBeEnabled({
      timeout: 10_000,
    })
    await expect(panel).not.toContainText('temporarily unavailable')
  })

  test('a legacy /posts/<slug> URL does not 404 outright', async ({ page }) => {
    // Either it redirects to the article, or the Redirects collection handles it,
    // or it is a genuine 404 for a slug that does not exist. What it must never do
    // is 500.
    const response = await page.goto('/posts/does-not-exist-abc123')
    expect([404, 200, 301, 302, 307, 308]).toContain(response?.status() ?? 0)
  })
})
