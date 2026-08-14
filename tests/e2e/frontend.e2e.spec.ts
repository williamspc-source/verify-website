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

  /**
   * A centred section header must not narrow itself into a line break.
   *
   * `.vf-section-header--centered` used to carry `max-width: var(--vf-measure,
   * 720px)`, inherited from the component's old inline styles and with no
   * counterpart in the design reference, where the same headings get the
   * container's full 1132px. Measured at 1440px it wrapped 10 titles across 8
   * pages, including the homepage's "Comprehensive Medico-Legal Services"
   * (needs 808px) and "Medico-Legal Support, Tailored to You" (798px).
   *
   * The test states that as a causal claim rather than a width comparison: take
   * away the header's OWN `max-width`, and if a title that was on two lines
   * collapses to one, the header did that to itself.
   *
   * Framing it that way is what makes it exempt the legitimate cases without an
   * allowlist, and the first version of this test — natural width vs. the
   * nearest `.container` — got that wrong. It reported `/services` as broken:
   * that header is `display: grid` (`.svc-admin-split`), so its title correctly
   * occupies a 620px track of a 1132px container and neutralising `max-width`
   * changes nothing. Same for a title in a narrow column (the enquiry panel's,
   * the JME FAQ's) and for one that genuinely outruns the full container.
   *
   * The `<br>` skip is load-bearing: `accentText()` turns an editor-typed
   * newline in the heading field into a `<br>`, so two lines there are the
   * editor's decision, not a layout fault.
   *
   * Proven red by restoring `max-width: var(--vf-measure, 720px)` on
   * `.vf-section-header--centered` in `src/app/(frontend)/globals.css` (and
   * `--vf-measure: 720px` in `:root`) — a guard that has never failed is not
   * evidence. With that restored it reports 2 violations on `/`, 1 on `/about`
   * and 2 on `/services/medico-legal/admin-services`, and still none on
   * `/services`.
   */
  for (const path of ['/', '/about', '/services', '/services/medico-legal/admin-services']) {
    test(`${path} centred section headers do not narrow themselves into a wrap`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(path)

      const measured = await page.evaluate(() => {
        const rows: { text: string; before: number; after: number; capped: string }[] = []

        document
          .querySelectorAll<HTMLElement>('.vf-section-header--centered')
          .forEach((header) => {
            const title = header.querySelector<HTMLElement>('.section-title')
            if (!title || title.querySelector('br')) return

            const lineHeight = parseFloat(getComputedStyle(title).lineHeight)
            if (!lineHeight) return
            const lines = () => Math.round(title.getBoundingClientRect().height / lineHeight)

            const before = lines()
            const capped = getComputedStyle(header).maxWidth

            // Neutralise only the header's own max-width, then put it back.
            const inline = header.style.maxWidth
            header.style.maxWidth = 'none'
            const after = lines()
            header.style.maxWidth = inline

            rows.push({ text: title.textContent?.trim().slice(0, 60) ?? '', before, after, capped })
          })

        return rows
      })

      // A positive control. Without it, "no violations" would be vacuously true
      // the moment the selector stopped matching — the shape of failure that made
      // three earlier guards in this repo meaningless.
      expect(
        measured.length,
        'should have found centred section headers to measure',
      ).toBeGreaterThan(0)

      const selfInflicted = measured.filter((m) => m.after < m.before)

      expect(
        selfInflicted,
        `these headers wrapped their own title by capping their width:\n${selfInflicted
          .map((m) => `  "${m.text}" — ${m.before} lines at max-width ${m.capped}, ${m.after} without`)
          .join('\n')}`,
      ).toEqual([])
    })
  }

  /**
   * A testimonial card highlights on hover without moving.
   *
   * `.testimonials-viewport` is `overflow: hidden` and exactly the card's height,
   * so it has no slack at all. The block's `hoverEffect` field defaults to
   * `lift` and the seed never sets it, so Payload stored `lift` by itself and
   * `.vf-hover-lift .vf-card:hover` translated the card up 4px — which put its
   * top edge and rounded corners outside the viewport and cut them off. The
   * design reference gives these cards a colour-only hover.
   *
   * Two clauses beyond "did not move", both load-bearing:
   *
   *  - the border colour must *change*, or "no movement" is also satisfied by a
   *    hover that never registered at all;
   *  - a gateway card, in a section with no clipping ancestor, must still lift —
   *    a positive control that proves `:hover` works in this harness and that
   *    the fix is scoped to testimonials rather than having killed card motion
   *    everywhere.
   *
   * Three deliberate breaks were applied to `src/app/(frontend)/globals.css`,
   * and what each one did is worth recording, including the one that did not
   * fail:
   *
   *  1. Delete `.testimonial-card:hover { transform: none; }` → RED, on the
   *     main assertion: `matrix(1, 0, 0, 1, 0, -4)`.
   *  2. Widen it to `.testimonial-card:hover, .vf-card:hover` → still green,
   *     and correctly so. `.audience-card:hover` is unlayered at the same
   *     (0,2,0) and declared later, so the gateway card kept its lift; nothing
   *     regressed, so nothing should fail. This control detects a hover that is
   *     not registering, not every over-broad selector one could write.
   *  3. Neutralise `.audience-card:hover`'s own `translateY(-6px)`, so hover
   *     becomes undetectable → RED, on the positive control, which is the
   *     scenario it exists for.
   */
  test('a testimonial card highlights on hover without moving', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    // Park the pointer somewhere harmless before every resting reading.
    // `scrollIntoViewIfNeeded` moves the page under a stationary cursor, so a
    // card can end up hovered before it is measured — that is how the first
    // draft of the positive control below read the same transform at rest and
    // on hover, and would have passed no matter what the CSS said.
    const restPointer = () => page.mouse.move(4, 4)

    const settle = async (locator: ReturnType<typeof page.locator>) => {
      await locator.scrollIntoViewIfNeeded()
      await restPointer()
      // Cards animate over `--transition`, and the scroll-reveal has its own
      // 0.6s; read only once both have finished.
      await page.waitForTimeout(900)
    }

    const transformOf = (locator: ReturnType<typeof page.locator>) =>
      locator.evaluate((el) => getComputedStyle(el).transform)

    const card = page.locator('.testimonial-card').first()
    await settle(card)

    const atRest = await card.evaluate((el) => ({
      transform: getComputedStyle(el).transform,
      borderColor: getComputedStyle(el).borderTopColor,
    }))
    expect(atRest.transform, 'a testimonial card should be untransformed at rest').toBe('none')

    await card.hover()
    await page.waitForTimeout(700)

    const hovered = await card.evaluate((el) => {
      const viewport = el.closest('.testimonials-viewport')
      return {
        transform: getComputedStyle(el).transform,
        borderColor: getComputedStyle(el).borderTopColor,
        clippedAbove: viewport
          ? viewport.getBoundingClientRect().top - el.getBoundingClientRect().top
          : 0,
      }
    })

    expect(hovered.transform, 'a testimonial card must not move on hover').toBe('none')
    expect(
      hovered.clippedAbove,
      'a testimonial card must not be clipped by its carousel viewport',
    ).toBeLessThanOrEqual(0)
    expect(hovered.borderColor, 'the hover highlight must still happen').not.toBe(
      atRest.borderColor,
    )

    // Positive control — a card in a section with no clipping ancestor must
    // still move, so "did not move" above cannot be satisfied by a hover that
    // never landed, and the fix is shown to be scoped to testimonials.
    const gateway = page.locator('.vf-gateway-cards .vf-card').first()
    await settle(gateway)
    const gatewayAtRest = await transformOf(gateway)

    await gateway.hover()
    await page.waitForTimeout(700)

    expect(
      await transformOf(gateway),
      'gateway cards should still lift on hover — if this matches their resting transform, hover is not registering and the assertions above prove nothing',
    ).not.toBe(gatewayAtRest)
  })

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

  /**
   * The interior hero title is as bold as the reference renders it.
   *
   * This exists because the opposite was shipped, deliberately, and written up as
   * a correction. `verify-website-design-diff.md` §5 lists `.page-hero h1` weight
   * "800 → 700" among seventeen values "aligned to the reference".
   *
   * **The reference holds this rule twice and the two copies disagree.** The
   * shared sheet (`.design-reference/assets/css/styles.css:2587`) says 700. Every
   * one of the nine reference pages redeclares `.page-hero h1` in an inline
   * `<style>` that loads *after* the `<link>`, at equal specificity, and wins with
   * **800**. The pass read the shared sheet, so its "alignment" moved the build
   * away from what the reference actually renders — on 59 pages plus every event
   * detail page. Tellingly it took the *size* from the inline rule and the weight
   * from the shared one, so it had both copies in front of it.
   *
   * So this guard does not hardcode 800. It reads the expected weight out of the
   * reference page and compares it to what the build computes — the comparison
   * that pass got wrong. A number in a test would have been just as wrong as the
   * number in the CSS, and would have locked the mistake in.
   *
   * Proven red by setting `.page-hero h1` back to 700 in globals.css — confirmed
   * live in the browser with `getComputedStyle` before believing the run, because
   * a stale Turbopack build has faked a proof twice in this repo and hidden a
   * working change twice more. Stays green on `/` and an article page, whose hero
   * titles are 800 by different rules and must not be disturbed.
   */
  test('interior hero titles are as bold as the reference renders them', async ({ page }) => {
    const { readFileSync } = await import('node:fs')

    // Read the weight the reference PAGE declares — not the shared stylesheet,
    // which these pages override. Only the inline <style> is consulted, and only
    // its `.page-hero h1` rule.
    const referenceWeight = (file: string): number | null => {
      const html = readFileSync(`.design-reference/${file}`, 'utf8')
      for (const style of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
        const rule = style[1].match(/\.page-hero\s+h1\s*\{([^}]*)\}/)
        const weight = rule?.[1].match(/font-weight:\s*(\d+)/)
        if (weight) return Number(weight[1])
      }
      return null
    }

    const pairs = [
      ['/information-centre/for-claimants', 'information-centre/for-claimants.html'],
      ['/about', 'about/about-verify.html'],
      ['/specialists/specialist-panel', 'specialists/specialist-panel.html'],
    ] as const

    await page.setViewportSize({ width: 1440, height: 900 })

    for (const [builtPath, referenceFile] of pairs) {
      const expected = referenceWeight(referenceFile)
      // Positive control on the parser. A regex that matched nothing must not
      // read as a pass — that mistake has been made four times in this repo.
      expect(
        expected,
        `no .page-hero h1 font-weight found in ${referenceFile} — the parser is broken, or the reference moved the rule out of its inline <style>`,
      ).not.toBeNull()

      await page.goto(builtPath)
      const actual = await page.evaluate(() => {
        const h1 = document.querySelector<HTMLElement>('.page-hero h1')
        if (!h1) return null
        return { weight: getComputedStyle(h1).fontWeight, text: h1.textContent?.trim().slice(0, 40) }
      })
      expect(actual, `${builtPath} should render a .page-hero h1`).not.toBeNull()
      // Control the other way: a computed weight must be a number. `normal`
      // would mean nothing is setting it, which is the impact-hero fault.
      expect(
        Number(actual!.weight),
        `${builtPath}: computed font-weight is "${actual!.weight}", not a number — nothing is setting it`,
      ).not.toBeNaN()

      expect(
        Number(actual!.weight),
        `${builtPath} "${actual!.text}" renders at ${actual!.weight}; ${referenceFile} renders it at ${expected}`,
      ).toBe(expected)
    }
  })

  /**
   * Meet the Team's intro sits on its own light-blue band, above a grey grid.
   *
   * The reference models this as two sections — `.team-intro` over
   * `.team-grid-section` — and the build had folded the intro into the grid's
   * block, so one block meant one background and the blue band was simply absent.
   * The People Grid block now has a **Header band** control; this asserts the
   * stored value still produces the reference's two bands.
   *
   * Both halves are asserted, and the second is the one that matters. "The intro
   * is blue" is equally satisfied by the whole section going blue, which is the
   * wrong design and was the cheap alternative to this work — so the grid band
   * must also be measured, and must differ.
   *
   * The expected colour is parsed out of the reference page rather than written
   * here as a gradient. `--band-accent` is an editable Design System token, so a
   * literal in this file would go stale the moment someone retunes it, and would
   * be asserting a number rather than the agreement with the reference.
   *
   * Proven red by:
   *   - setting the stored `headerBackground` back to 'default' → one band, the
   *     intro assertion fires;
   *   - setting the grid's own `background` to 'accent' as well → both bands blue,
   *     the "must differ" assertion fires, so it is not vacuous.
   * Each break confirmed live in the browser before believing the run.
   * Stays green on `/` and `/jme`, whose People Grids keep the sentinel and must
   * render exactly one band.
   */
  test('the Meet the Team intro sits on its own band, as the reference has it', async ({
    page,
  }) => {
    const { readFileSync } = await import('node:fs')

    // Read from the page's inline <style>: the reference links its shared sheet
    // root-absolutely, so only the inline half is authoritative here.
    const referenceBackground = (selector: string): string | null => {
      const html = readFileSync('.design-reference/about/meet-the-team.html', 'utf8')
      for (const style of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
        const rule = style[1].match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))
        const background = rule?.[1].match(/background:\s*([^;]+);/)
        if (background) return background[1].trim()
      }
      return null
    }

    // Two colours in, two colours out — a hex the reference declares, as the
    // browser will report it.
    const toRgb = (hex: string): string => {
      const m = hex.trim().match(/^#([0-9a-f]{6})$/i)
      if (!m) return hex.trim()
      const n = parseInt(m[1], 16)
      return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
    }

    const introDeclared = referenceBackground('.team-intro')
    const gridDeclared = referenceBackground('.team-grid-section')
    // Positive control on the parser: a regex that matched nothing must not read
    // as a pass.
    expect(
      introDeclared,
      'no .team-intro background found in the reference page — parser broken, or the rule moved out of its inline <style>',
    ).toBeTruthy()
    expect(gridDeclared, 'no .team-grid-section background found in the reference page').toBeTruthy()

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/about/meet-the-team')

    const bands = await page.evaluate(() => {
      const read = (section: Element | null | undefined) => {
        if (!section) return null
        const cs = getComputedStyle(section)
        return cs.backgroundImage !== 'none' ? cs.backgroundImage : cs.backgroundColor
      }
      const sections = [...document.querySelectorAll('main section')]
      const intro = sections.find((s) =>
        s.querySelector('.section-label')?.textContent?.trim().toLowerCase().startsWith('our people'),
      )
      const grid = sections.find((s) => s.querySelector('.spec-grid, .vf-people-grid__groups'))
      return { intro: read(intro), grid: read(grid) }
    })

    // Control: the page must actually contain both, or every comparison below is
    // comparing null to null.
    expect(bands.intro, 'no section on the page carries the "Our People" eyebrow').toBeTruthy()
    expect(bands.grid, 'no section on the page carries the team grid').toBeTruthy()

    // 1. The intro band is the colour the reference gives `.team-intro`. Compare
    //    on the colour stops, since the browser normalises hex to rgb() and adds
    //    an explicit 100% stop the reference leaves implicit.
    for (const stop of introDeclared!.match(/#[0-9a-f]{6}/gi) ?? []) {
      expect(
        bands.intro,
        `the "Our People" band is ${bands.intro}; the reference declares ${introDeclared}`,
      ).toContain(toRgb(stop))
    }

    // 2. …and the grid band is NOT that colour. Without this, one section painted
    //    entirely blue passes — which is the wrong design, and the shortcut this
    //    work exists to avoid.
    expect(
      bands.grid,
      `the team grid shares the intro's band (${bands.grid}); the reference gives it ${gridDeclared}`,
    ).not.toBe(bands.intro)
    expect(bands.grid, `the team grid band is ${bands.grid}`).toContain(toRgb(gridDeclared!))
  })
})
