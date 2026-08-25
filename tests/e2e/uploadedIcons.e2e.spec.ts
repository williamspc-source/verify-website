import { test, expect, type APIRequestContext } from '@playwright/test'

import { iconTestUser } from '../helpers/globalSetup'

/**
 * An uploaded icon behaves like a built-in one.
 *
 * ## Why this has to be a browser test
 *
 * The claim is about a COMPUTED colour, and nothing in the source can settle it.
 * An uploaded icon is a `<span>` painted with `background-color: currentColor`
 * and masked by the artwork's alpha; a built-in is a Phosphor `<svg>` filling
 * from `currentColor`. Two completely different elements that have to end up the
 * same colour on the same band — which only `getComputedStyle` can confirm.
 *
 * It caught two real defects on the way in, neither visible in the source:
 *
 *  · The mask was a `<span>`. globals.css sizes and colours icons through **66**
 *    rules that select `svg` — `.ni-card-img svg { width: 36px }`,
 *    `.img-qa svg { color: … }` — and a span matches none of them, so an upload
 *    rendered at 24px in `rgb(65,64,66)` where the built-in it replaced was 36px
 *    in a tinted blue. It is an empty `<svg>` now, painted entirely by
 *    `background-color: currentColor` through the artwork's alpha.
 *  · The per-icon default colour is published by the layout as
 *    `[data-vf-icon="3"]{color:…}`, and the first version used the raw token — so
 *    on the navy portal band an upload defaulting to Brand blue painted
 *    `rgb(28,117,188)` beside a built-in painting `rgb(147,208,247)`. The dark
 *    re-point is derived from the same palette entry `.vf-tc-*` uses
 *    (`onDarkToken`), and case 2 below is what keeps it that way.
 *
 * ## Why the comparison is measured, not written down
 *
 * Case 1 reads what a BUILT-IN icon is painted on this exact band *before*
 * anything changes, then requires the upload to reproduce it. A hardcoded colour
 * would have to be updated whenever the design changes, and would pass while
 * meaning nothing.
 *
 * ## What it does to the database
 *
 * Uploads one icon and borrows one stream's `icon` field, then puts both back in
 * `finally` — including when an assertion fails, so a red run does not leave the
 * next one measuring the wrong thing.
 *
 * ## Proven red by (invariant 17)
 *
 *  1. drop `background-color: currentColor` from `.vf-icon-mask` in globals.css
 *     → "the upload paints rgba(0, 0, 0, 0) where the built-in it replaced
 *        painted color(srgb 0.109804 0.458824 0.737255 / 0.35)"
 *  2. drop the `entry.onDarkToken` branch from `iconDefaultCss`
 *     → "no on-dark re-point was published — this icon will stay brand blue on a
 *        dark band"
 *  3. stop `Icon` applying `colorClass(...)`
 *     → "the placement colour produced no class"
 *
 * All three were run against the CSS the browser had actually received, because
 * the dev server lags globals.css by ~20s and has faked a PASS here before.
 */

const SERVER = 'http://localhost:3000'

/**
 * Its OWN user, seeded once by `globalSetup` — not the shared `seedTestUser`
 * account, which is deleted and recreated on every use and so cannot be shared
 * across two spec files running in parallel. See `tests/helpers/globalSetup.ts`.
 */
const iconUser = iconTestUser

// A deliberately garish two-colour SVG: the mask reads alpha only, so BOTH of
// these colours must be gone from what renders. A file that happened to be the
// right colour already would prove nothing.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M16 2 L28 7 V16 C28 23 22 28 16 30 C10 28 4 23 4 16 V7 Z" fill="#ff00ff"/>
</svg>`

/**
 * `/in-the-loop` cards render their stream's icon in `.ni-card-img`, as the
 * fallback for a post with no hero image. Only the stream that HAS posts appears,
 * so the test asks the API which one that is rather than assuming.
 */
const STREAM_ROUTE = '/in-the-loop'

type Ctx = { api: APIRequestContext; token: string }

const authed = (t: string) => ({ Authorization: `JWT ${t}`, 'Content-Type': 'application/json' })

const login = async (api: APIRequestContext): Promise<string> => {
  const res = await api.post(`${SERVER}/api/users/login`, { data: iconUser })
  expect(res.ok(), 'could not log in to place a test icon').toBeTruthy()
  return (await res.json()).token as string
}

const uploadIcon = async ({ api, token }: Ctx, colour: string): Promise<number> => {
  const res = await api.post(`${SERVER}/api/icons`, {
    headers: { Authorization: `JWT ${token}` },
    multipart: {
      file: { name: 'e2e-icon.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(SVG) },
      _payload: JSON.stringify({ name: 'E2E test icon', colour }),
    },
  })
  const body = await res.json()
  expect(body?.doc?.id, `upload failed: ${JSON.stringify(body?.errors ?? body).slice(0, 300)}`).toBeTruthy()
  return body.doc.id as number
}

/** What the listing's first stream icon is, and what it is painted. */
const readIcon = async (page: import('@playwright/test').Page) => {
  await page.goto(`${SERVER}${STREAM_ROUTE}`, { waitUntil: 'load' })
  return page.evaluate(() => {
    const card = document.querySelector('.ni-card-img')
    // The mask is itself an <svg>, so it is looked for FIRST and the built-in
    // query excludes it — otherwise `tier` reads "builtin" for an upload.
    const mask = card?.querySelector<SVGElement>('.vf-icon-mask') ?? null
    const svg = card?.querySelector<SVGElement>('svg:not(.vf-icon-mask)') ?? null
    const el = (mask ?? svg) as HTMLElement | null
    const box = el?.getBoundingClientRect()
    return {
      tier: mask ? 'upload' : svg ? 'builtin' : 'none',
      painted: mask
        ? getComputedStyle(mask as unknown as Element).backgroundColor
        : svg
          ? getComputedStyle(svg).color
          : null,
      maskImage: mask ? getComputedStyle(mask).maskImage : null,
      size: box ? [Math.round(box.width), Math.round(box.height)] : null,
      // `getAttribute`, not `.className`: the mask is an <svg> element, whose
      // `className` is an SVGAnimatedString rather than a string — `toContain`
      // on one throws "a is not iterable" instead of failing readably.
      classes: mask?.getAttribute('class') ?? null,
      // The layout's published defaults, read from the page itself rather than
      // from the source that generated them.
      publishedCss: document.getElementById('verify-design-tokens')?.textContent ?? '',
    }
  })
}

test.describe('an uploaded icon behaves like a built-in one', () => {
  test('paints the site colour, follows a dark band, and obeys a placement colour', async ({
    page,
    request,
  }) => {
    const token = await login(request)
    const ctx: Ctx = { api: request, token }

    // The stream that actually has posts — it is the only one whose icon appears
    // on the listing, and which that is is content, not something to assume.
    const posts = await (
      await request.get(`${SERVER}/api/posts?limit=1&depth=1&sort=-publishedAt`, {
        headers: authed(token),
      })
    ).json()
    const stream = posts?.docs?.[0]?.stream
    expect(stream?.id, 'no published post with a stream — nothing renders a stream icon').toBeTruthy()
    const originalIcon = stream.icon ?? null

    const setIcon = async (value: string | null) => {
      const res = await request.patch(`${SERVER}/api/streams/${stream.id}`, {
        headers: authed(token),
        data: { icon: value },
      })
      expect(res.ok(), `could not set the stream icon to ${value}`).toBeTruthy()
    }

    // What a BUILT-IN icon is painted on this exact band, measured before
    // anything changes. This is the number the upload has to reproduce, and
    // taking it from the page rather than writing it down is what keeps the test
    // true when the design changes.
    const builtin = await readIcon(page)
    expect(builtin.tier, 'no stream icon on the listing to compare against').toBe('builtin')
    expect(builtin.painted, 'the built-in stream icon is painted nothing').toBeTruthy()

    // `inherit`, so the upload has no colour of its own and must land on exactly
    // the built-in's colour. Any other default would make the comparison a
    // coincidence rather than a proof.
    const iconId = await uploadIcon(ctx, 'inherit')

    try {
      // ── 1. It renders, it is masked, and it takes the band's colour ──
      await setIcon(`upload:${iconId}`)
      const plain = await readIcon(page)

      // Positive control: without this, every assertion below is comparing null
      // to null on a page that rendered no icon (invariant 41).
      expect(plain.tier, `no .vf-icon-mask on ${STREAM_ROUTE} — the upload never reached the page`).toBe('upload')
      expect(plain.size?.[0], 'the uploaded icon has no width').toBeGreaterThan(0)
      expect(plain.maskImage, 'no mask-image, so the element is a solid block of colour').toContain(
        `/api/icon/upload/${iconId}`,
      )

      // The artwork is magenta. If any of it survived, this is not a mask.
      expect(plain.painted, "the upload kept the file's own colour — it is not a mask").not.toBe(
        'rgb(255, 0, 255)',
      )
      expect(
        plain.painted,
        `the upload paints ${plain.painted} where the built-in it replaced painted ${builtin.painted}`,
      ).toBe(builtin.painted)

      // ── 2. A default colour on the RECORD reaches the page, dark rule and all ──
      const patched = await request.patch(`${SERVER}/api/icons/${iconId}`, {
        headers: authed(token),
        data: { colour: 'brand' },
      })
      expect(patched.ok(), 'could not set the icon record colour').toBeTruthy()

      const branded = await readIcon(page)
      expect(
        branded.publishedCss,
        'the layout published no default-colour rule for this icon',
      ).toContain(`[data-vf-icon="${iconId}"]`)
      // The half that was wrong first time round: without the on-dark re-point an
      // icon defaulting to Brand blue keeps painting #1c75bc on a navy band while
      // every built-in beside it turns pale. Derived from the same palette entry
      // `.vf-tc-*` uses, so the two cannot drift.
      expect(
        branded.publishedCss,
        'no on-dark re-point was published — this icon will stay brand blue on a dark band',
      ).toContain(`.vf-on-dark [data-vf-icon="${iconId}"]`)
      expect(branded.publishedCss).toContain('--accent-on-dark')
      expect(branded.painted, 'the record colour did not reach the icon').not.toBe(builtin.painted)

      // ── 3. A colour chosen at the placement beats the record's default ──
      await setIcon(`upload:${iconId}@white`)
      const forced = await readIcon(page)
      expect(forced.classes, 'the placement colour produced no class').toContain('vf-tc-white')
      expect(
        forced.painted,
        `a placement colour did not win: expected rgb(255, 255, 255), got ${forced.painted}`,
      ).toBe('rgb(255, 255, 255)')
    } finally {
      await setIcon(originalIcon)
      await request.delete(`${SERVER}/api/icons/${iconId}`, { headers: authed(token) })
    }
  })
})
