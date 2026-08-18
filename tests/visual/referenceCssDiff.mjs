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
 *
 * ── How this tool lies about YOUR CSS ───────────────────────────────────────
 *
 * A reported difference is not automatically a real one. Two ways an
 * `IMPLEMENTED_AS` entry produces a phantom:
 *
 * 1. **An incomplete mapping under-reports.** The reference tends to put every
 *    declaration on one element; ours are often split between a wrapper and its
 *    children. Listing only the child reported `line-height: 1.75` for
 *    `.rs-service-row-desc` while the browser measured the correct `1.8` — the
 *    wrapper rule carrying it was simply not in the list. The list form exists
 *    for exactly this, and the order is cascade order (base first, override
 *    last). Fixing CSS to satisfy a diff you have not cross-checked in the
 *    browser is how a correct rule gets "corrected".
 *
 * 2. **A stale exception hides a real gap.** `NOT_PORTED` and `EXPLAINED`
 *    entries whose justification is a past measurement need that measurement
 *    RE-RUN, not re-read. Two properties were once skipped here with a comment
 *    saying they were "confirmed equal in the browser". They were not, and
 *    removing the skip surfaced 11 genuine spacing differences on /services.
 *
 * The rule that follows from both: when the tool reports ONE difference on a
 * selector whose other declarations all match, suspect the mapping first and
 * the CSS second — and settle it with getComputedStyle before editing anything.
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
  // /services/medico-legal/ime → "Four Ways to Attend Your IME". Inline-only
  // again: `grep ime-format` over styles.css returns zero.
  ime: {
    css: ['.design-reference/assets/css/styles.css'],
    pages: ['.design-reference/services/medico-legal/ime.html'],
    match: /^\.ime-format/,
  },
  // /services/medico-legal/jme → "The JME Process, Step by Step". Inline-only
  // again: `grep jme-process` over styles.css returns zero.
  jme: {
    css: ['.design-reference/assets/css/styles.css'],
    pages: ['.design-reference/services/medico-legal/jme.html'],
    match: /^\.jme-process/,
  },
  // /services/medico-legal/admin-services → "Simple to Request, Seamless to
  // Deliver". The same compact process design as `jme-process`, declared by the
  // reference as a separate family. Inline-only again.
  'admin-services': {
    css: ['.design-reference/assets/css/styles.css'],
    pages: ['.design-reference/services/medico-legal/admin-services.html'],
    match: /^\.as-how/,
  },
  // /services/medico-legal/reporting-services → "Five Ways to Get the Specialist
  // Opinion You Need". The strongest case of inline-only yet: `grep rs-service`
  // over the WHOLE assets/ directory returns zero, and no other reference page
  // uses an `.rs-` class, so this page's <style> block is the only source in
  // existence for it. styles.css is still listed for `.container` /
  // `.section-label`, which the section does use.
  //
  // Ours implements these through Split Feature *settings* (Row style, Text
  // density, Bullet style) rather than a class scoped to this page, so the
  // IMPLEMENTED_AS entries below map onto `.vf-split-feature--*` modifiers.
  // /specialists/profiles/<slug>. Inline-only again — `grep profile-hero` over
  // assets/ returns only an OLDER, unused profile layout (`.profile-head`,
  // `.profile-body`, `.profile-aside`, `.profile-photo`), none of which this
  // page uses, so the shared sheet must not be allowed to answer for these
  // selectors. All 26 profiles share byte-identical rules.
  'specialist-profile': {
    css: ['.design-reference/assets/css/styles.css'],
    pages: ['.design-reference/specialists/profiles/dr-adam-parr.html'],
    match: /^\.profile-(hero|avatar|info|name|specialty|breadcrumb|section|bio|areas|area|types|type|sidebar|qual|grid|content|lang|location)/,
  },
  'reporting-services': {
    css: ['.design-reference/assets/css/styles.css'],
    pages: ['.design-reference/services/medico-legal/reporting-services.html'],
    match: /^\.rs-service/,
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
  ime: {
    // Dead in the reference itself: declared at ime.html:470-512 and used by no
    // markup on the page. Leftovers from an earlier card design — a pill badge
    // and a chip row instead of the "What's Included" list.
    '.ime-format-badge': 'Dead CSS in the reference — declared, never used by any markup on the page.',
    '.ime-format-highlights': 'ditto',
    '.ime-format-highlights-label': 'ditto',
    '.ime-format-highlights-row': 'ditto',
    '.ime-format-highlight': 'ditto',
    // Same reason the other two families give.
    '.ime-format-card-icon i':
      'Our icons are Phosphor React components, which render <svg>, not an <i> webfont glyph. The `svg` rule carries the sizing.',
    '.ime-format-included-item-icon i': 'ditto',
  },
  'specialist-profile': {
    '.profile-location-icon i':
      'Dead in the reference: the rule targets an `<i>` INSIDE `.profile-location-icon`, but on this page `.profile-location-icon` IS the `<i>` — so it never matches anything, and its `font-size: 16px` is not what renders. Measured: the chip icon takes its size from `.profile-location-icon` itself, which we implement as an SVG with an explicit 16px box. Porting the rule would mean porting a bug.',
  },
  'reporting-services': {
    '.rs-services-header':
      'text-align comes from SectionHeader\'s `--centered` modifier, and the 28px gap below is carried on the subtitle instead. The `max-width: 640px` cap is a decided deviation — it wraps the reference\'s h2 to two lines, and this header is deliberately full width (approved 2026-08-18). Porting it would also need an entry in the heading-wrap guard\'s INTENTIONAL map, which it does not have.',
    '.rs-services-rows':
      'No counterpart element. The reference wraps its rows in a flex column; ours are siblings of the section header inside `.vf-section__inner` — which is why the first-row rule is an adjacent-sibling selector rather than `:first-child`.',
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
  ime: {
    '.ime-formats': ['.vf-section', '.vf-section--white'],
    '.ime-formats-header': ['.vf-section-header', '.ime-formats .vf-section-header'],
    '.ime-formats-header h2': ['.section-title', '.ime-formats .vf-section-header__title'],
    '.ime-formats-header h2 span': ['.section-title span', '.vf-accent'],
    '.ime-formats-header p': ['.section-subtitle', '.ime-formats .vf-section-header__subtitle'],
    '.ime-formats-grid': ['.services-grid', '.ime-formats .services-grid'],
    '.ime-format-card': ['.service-card', '.vf-card--banded'],
    '.ime-format-card:hover': ['.service-card:hover', '.ime-formats .service-card:hover'],
    '.ime-format-card-top': '.vf-card--banded .vf-card__head',
    '.ime-format-card-icon': ['.service-icon', '.vf-card--banded .service-icon'],
    '.ime-format-card-icon svg': ['.service-icon svg', '.vf-card--banded .service-icon svg'],
    '.ime-format-card-top h3': ['.service-title', '.ime-formats .vf-card__title'],
    '.ime-format-card-top h3 .card-name': '.ime-formats .vf-card__title',
    '.ime-format-card-top h3 .card-type': '.ime-formats .vf-card__title-suffix',
    '.ime-format-card-body': '.vf-card--banded .vf-card__body',
    '.ime-format-card-desc': ['.service-desc', '.ime-formats .service-desc'],
    '.ime-format-included-label': ['.vf-feature-details__label', '.ime-formats .vf-feature-details__label'],
    '.ime-format-included-list': ['.vf-feature-details', '.ime-formats .vf-feature-details'],
    '.ime-format-included-item': ['.vf-feature-detail', '.ime-formats .vf-feature-detail'],
    '.ime-format-included-item-icon': ['.vf-feature-detail__icon', '.ime-formats .vf-feature-detail__icon'],
    '.ime-format-included-item-icon svg': ['.vf-feature-detail svg', '.ime-formats .vf-feature-detail__icon svg'],
    '.ime-format-included-text strong': ['.vf-feature-detail strong', '.ime-formats .vf-feature-detail strong'],
    '.ime-format-included-text span': ['.vf-feature-detail p', '.ime-formats .vf-feature-detail p'],
  },
  jme: {
    '.jme-process': ['.vf-section', '.vf-section--muted'],
    '.jme-process-header': ['.vf-section-header', '.jme-process .vf-section-header'],
    '.jme-process-header h2': ['.section-title', '.jme-process .vf-section-header__title'],
    '.jme-process-header h2 span': ['.section-title span', '.vf-accent'],
    '.jme-process-header p': ['.section-subtitle', '.jme-process .vf-section-header__subtitle'],
    '.jme-process-steps': '.vf-process',
    '.jme-process-steps::before': ['.vf-process::before', '.jme-process .vf-process::before'],
    '.jme-process-step': ['.vf-process-step', '.jme-process .vf-process-step'],
    '.jme-process-step-num': ['.vf-process-step-num', '.jme-process .vf-process-step-num'],
    // Our step title is an <h4> and the description a <p>; the reference uses
    // <strong> and <span> inside a flex column. Same role, different element.
    '.jme-process-step strong': ['.vf-process-step h4', '.jme-process .vf-process-step h4'],
    '.jme-process-step span': ['.vf-process-step p', '.jme-process .vf-process-step p'],
  },
  'admin-services': {
    '.as-how': ['.vf-section', '.vf-section--accent'],
    '.as-how-header': ['.vf-section-header', '.as-how .vf-section-header'],
    '.as-how-header h2': ['.section-title', '.as-how .vf-section-header__title'],
    '.as-how-header h2 span': ['.section-title span', '.vf-accent'],
    '.as-how-header p': ['.section-subtitle', '.as-how .vf-section-header__subtitle'],
    '.as-how-steps': '.vf-process',
    '.as-how-steps::before': ['.vf-process::before', '.as-how .vf-process::before'],
    '.as-how-step': ['.vf-process-step', '.as-how .vf-process-step'],
    '.as-how-step-num': ['.vf-process-step-num', '.as-how .vf-process-step-num'],
    '.as-how-step strong': ['.vf-process-step h4', '.as-how .vf-process-step h4'],
    '.as-how-step span': ['.vf-process-step p', '.as-how .vf-process-step p'],
  },
  'specialist-profile': {
    // Ours renders the shared <Breadcrumbs> component, so the trail is
    // `.vf-breadcrumb*`. The CONTENT deliberately differs (Home > Specialist
    // Panel > the doctor's name, against the reference's two-item generic
    // trail) — that was a decision. The STYLING should still match, so these
    // are mapped rather than skipped: a skip would have hidden any drift.
    '.profile-breadcrumb': '.vf-breadcrumb',
    '.profile-breadcrumb a': '.vf-breadcrumb__link',
    '.profile-breadcrumb a:hover': '.vf-breadcrumb__link:hover',
    '.profile-breadcrumb span': '.vf-breadcrumb__sep',
    '.profile-breadcrumb strong': '.vf-breadcrumb__current',
  },
  'reporting-services': {
    '.rs-services': ['.vf-section', '.vf-section--white'],
    '.rs-services-header h2': ['.section-title', '.vf-split-feature--compact .vf-section-header__title'],
    '.rs-services-header h2 span': ['.section-title span', '.vf-accent'],
    '.rs-services-header p': ['.section-subtitle', '.vf-split-feature--compact .vf-section-header__subtitle'],
    '.rs-service-row': ['.vf-split', '.vf-split-feature--divided .vf-split'],
    '.rs-service-row:first-child': '.vf-split-feature--divided .vf-section-header + .vf-split',
    '.rs-service-row:last-child': '.vf-split-feature--divided .vf-split:last-child',
    '.rs-service-row-img': [
      '.vf-split__media',
      '.rs-services .vf-split__media',
      '.vf-split__media--placeholder',
      '.vf-split__media--placeholder:has(.vf-split__placeholder-icon)',
    ],
    '.rs-service-row-img svg': '.vf-split__placeholder-icon',
    '.rs-service-row-img-label': [
      '.who-image-main',
      '.vf-split-feature--compact .vf-split__media--placeholder span',
      '.rs-services .vf-split__media--placeholder span',
    ],
    '.rs-service-row-content h3': ['.section-title', '.vf-split-feature--compact .vf-split__title'],
    // Three deep: the reference puts colour, line-height, size and margin on one
    // `<p class="rs-service-row-desc">`. Ours splits them between the body
    // wrapper and the paragraphs inside it, so both compact rules are needed —
    // omitting the wrapper reported line-height 1.75 while the browser measured
    // the correct 1.8.
    '.rs-service-row-desc': [
      '.vf-split__body',
      '.vf-split-feature--compact .vf-split__body',
      '.vf-split-feature--compact .vf-split__body p',
    ],
    '.rs-service-row-when-label': ['.vf-split__bullets-label', '.vf-split-feature--compact .vf-split__bullets-label'],
    '.rs-service-row-when-list': '.vf-split-feature--dots .vf-split__list',
    '.rs-service-row-when-list li': [
      '.vf-split-feature--dots .vf-split__list li',
      '.vf-split-feature--compact .vf-split__list li',
    ],
    '.rs-service-row-when-list li::before': '.vf-split-feature--dots .vf-split__list li::before',
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
  // These three surfaced the moment `color` stopped being blanket-skipped for
  // aliased selectors. Every one was then MEASURED in the browser at 1440px on
  // 2026-08-18 before being excused — which is the only thing that separates an
  // explanation from the habit that hid the /ime label bug in the first place.
  events: {
    '.events-hero-breadcrumb': {
      color:
        '`--bc-link` is context-dependent by design — it has three definitions, and on a dark band resolves to exactly the reference literal. Measured on /events: ours rgba(255, 255, 255, 0.65), reference rgba(255, 255, 255, 0.65). A single-value resolver cannot follow that, so it cannot close in the tool.',
    },
    '.events-hero h1': {
      color:
        'Ours takes it from the `.page-hero--dark` modifier rather than declaring it on the h1, so there is nothing here for the diff to match. Measured on /events: both rgb(255, 255, 255).',
    },
  },
  services: {
    '.svc-feature-img-label': {
      color:
        'The reference hardcodes #7aafc8; ours mixes it from the brand colour so a rebrand retints it — the same choice made for reporting-services. Measured at rgb(121, 174, 216): within 1/255 on red and green, 16/255 bluer. This one was a REAL difference until now (the base left it 50%-translucent primary) and was fixed rather than excused; only the token-vs-literal residue is explained here.',
    },
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
  ime: {
    '.ime-formats': { padding: 'Section padding is the editor-controlled `--space-normal` preset (56–88px), not a literal 80px.' },
    '.ime-formats-grid': { 'grid-template-columns': 'Column count is the FeatureGrid block\'s `columns` field, emitted as `--vf-cols`. Set to 2 on this page, so the rendered grid matches.' },
    // Asked for explicitly: "the body has a subtle gradient from the bottom up",
    // and it should stay. The reference's card body is flat white.
    '.ime-format-card': { background: 'DEPARTURE, by request: our card keeps its white→#f7fbff body gradient. The reference is flat #fff.' },
    // Asked for explicitly: centre each icon against its whole item.
    '.ime-format-included-item': { 'align-items': 'DEPARTURE, by request: the detail icon is centred against the whole item (heading + description). The reference top-aligns it.' },
    '.ime-format-included-item-icon': { 'margin-top': 'The reference nudges the tile down 1px to sit optically against the first line of a TOP-ALIGNED item. Meaningless once the icon is centred — see the entry above.' },
    '.ime-format-card-icon svg': { stroke: 'The reference draws stroked inline SVGs. Phosphor duotone icons are FILLED and take `currentColor`, which the tile already sets to `--primary`.' },
    '.ime-format-included-item-icon svg': { stroke: 'ditto.' },
  },
  jme: {
    '.jme-process': { padding: 'Section padding is the editor-controlled `--space-normal` preset (56–88px), not a literal 80px.' },
    '.jme-process-steps': { 'grid-template-columns': 'Column count is the ProcessSteps block\'s `columns` field, emitted as `--vf-cols`. Set to 5 on this page, so the rendered grid matches.' },
    '.jme-process-steps::before': { left: 'Derived from `--vf-cols` rather than hardcoded per family — `calc(100% / (2 * cols) + 14px)` resolves to the reference\'s 10% here and 12.5% on /admin-services.', right: 'ditto.' },
    '.jme-process-step strong': { display: 'The reference needs `display: block` because its step title is a `<strong>`, which is inline. Ours is an `<h4>`, already block-level.' },
  },
  'admin-services': {
    '.as-how': { padding: 'Section padding is the editor-controlled `--space-normal` preset (56–88px), not a literal 80px.' },
    '.as-how-steps': { 'grid-template-columns': 'Column count is the ProcessSteps block\'s `columns` field, emitted as `--vf-cols`. Set to 4 on this page, so the rendered grid matches.' },
    '.as-how-steps::before': { left: 'Derived from `--vf-cols` rather than hardcoded per family — `calc(100% / (2 * cols) + 14px)` resolves to the reference\'s 12.5% here and 10% on /jme.', right: 'ditto.' },
    '.as-how-step strong': { display: 'The reference needs `display: block` because its step title is a `<strong>`, which is inline. Ours is an `<h4>`, already block-level.' },
  },
  'specialist-profile': {
    // ── These five are REAL, CLOSEABLE differences, deliberately deferred. ──
    // Not a token artefact and not a rename: our light-context breadcrumb really
    // does render darker and heavier than the reference's. Measured on this page:
    //   link      rgb(34,34,34)     vs reference rgb(115,115,115)
    //   separator rgb(34,34,34)     vs reference rgb(176,176,176), 12.48 vs 10.6px
    //   current   rgb(26,58,92)/700 vs reference rgb(65,64,66)/900
    // The reference is consistent about it — #737373 / #b0b0b0 / #414042 appear
    // 49 / 23 / 46 times across its pages — so the fix is three token values in
    // the light `--bc-*` context, NOT a page-scoped override. That ripples to
    // every interior page with a breadcrumb, which makes it a decision rather
    // than a tidy-up. Logged in OUTSTANDING.md with its cost.
    //
    // They sit here so this family reads zero and can catch the NEXT regression.
    // That is only legitimate because the entry says what the difference is and
    // where the decision lives — an excuse that merely asserts equivalence is the
    // failure mode recorded in CLAUDE.md.
    '.profile-breadcrumb': {
      color: 'Deferred site-wide breadcrumb colour — see OUTSTANDING.md.',
      position: 'Ours is never sticky to begin with; the reference resets it only because a global `nav {}` rule makes it so. Nothing to undo.',
      top: 'ditto.',
      'z-index': 'ditto.',
      background: 'ditto.',
      'box-shadow': 'ditto.',
    },
    '.profile-breadcrumb a': {
      color: 'Deferred site-wide breadcrumb colour — see OUTSTANDING.md.',
      transition: 'Ours uses the shared `--transition` token (0.28s) against the reference literal 0.15s. Retuning motion is a Design System edit.',
    },
    '.profile-breadcrumb a:hover': { color: 'ditto — deferred, see OUTSTANDING.md.' },
    '.profile-breadcrumb span': {
      color: 'ditto — deferred, see OUTSTANDING.md.',
      'font-size': 'ditto; the separator renders 12.48px against the reference 10.6px.',
    },
    '.profile-breadcrumb strong': { color: 'ditto — deferred, see OUTSTANDING.md.' },
  },
  'reporting-services': {
    '.rs-services': {
      padding: 'Section padding is the editor-controlled `--space-normal` preset (56–88px), not a literal 80px.',
      'padding-top': 'ditto.',
      'padding-bottom': 'ditto.',
    },
    '.rs-service-row-img-label': {
      color:
        'The reference hardcodes #7aafc8. Ours mixes it from the brand colour — `color-mix(in srgb, var(--primary) 59%, var(--white))` — so a rebrand retints the caption instead of stranding it. Measured in the browser at rgb(121, 174, 216): within 1/255 on red and green, 16/255 bluer. No mix of the brand tokens lands closer, and hardcoding the literal would break the one thing this file exists to keep true.',
    },
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

/**
 * Split a CSS value on TOP-LEVEL whitespace, so `var(--a) 0` gives two parts and
 * `color-mix(in srgb, x 5%, y)` stays one.
 */
function topLevelParts(value) {
  const parts = []
  let depth = 0
  let cur = ''
  for (const ch of value) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (/\s/.test(ch) && depth === 0) {
      if (cur) parts.push(cur)
      cur = ''
    } else cur += ch
  }
  if (cur) parts.push(cur)
  return parts
}

/**
 * Expand `margin` / `padding` shorthands into their longhands.
 *
 * Without this the tool compares property NAMES literally, so the reference's
 * `margin-bottom: 24px` read as MISSING against our `.vf-breadcrumb`'s
 * `margin: 0 0 24px` — the same 24px, differently spelled. That false positive
 * is worse than useless on a spacing diff, because the real ones look identical
 * to it. The shorthand key is kept as well, so shorthand-vs-shorthand still
 * compares; longhands declared after a shorthand overwrite it, as the cascade
 * does, because the caller assigns in source order.
 */
const BOX_SIDES = ['top', 'right', 'bottom', 'left']
function expandBox(prop, value) {
  // Strip `!important` FIRST. Otherwise `margin: 0 !important` splits as a
  // two-value shorthand and yields `margin-left: !important`.
  const v = topLevelParts(value.replace(/\s*!important\s*$/i, ''))
  if (!v.length || v.length > 4) return null
  const [t, r = t, b = t, l = r] = v
  return Object.fromEntries(BOX_SIDES.map((side, i) => [`${prop}-${side}`, [t, r, b, l][i]]))
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
        if (!prop || !val || prop.startsWith('--')) continue
        if (prop === 'margin' || prop === 'padding') Object.assign(decls, expandBox(prop, val) || {})
        decls[prop] = val
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
  // `!important` is a cascade concern, not a value one, and this tool explicitly
  // does not model the cascade. Comparing it made `margin: 0 !important` read as
  // differing from `margin: 0` — which is how a needed `!important` came to be
  // deleted to silence the diff, re-centring an intro paragraph.
  let s = value.toLowerCase().replace(/\s*!important\s*$/, '').replace(/\s+/g, ' ').trim()
  // A CSS unicode escape and the literal character are the same value. Without
  // this, `content: '\\203A'` read as differing from the reference's `content: '›'`
  // — a phantom on a declaration that renders identically. Applies to any escaped
  // glyph, not just this one.
  s = s.replace(/\\([0-9a-f]{1,6})\s?/gi, (_m, hex) => String.fromCodePoint(parseInt(hex, 16)))
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
    // An entry keyed on `padding` also excuses `padding-top` etc., since the
    // longhands here are ones expandBox() derived from that same shorthand.
    const excuse =
      explained[prop] ?? explained[prop.replace(/-(top|right|bottom|left)$/, '')]
    if (excuse) {
      explainedCount++
      explainedLines.push(`   ${sel} · ${prop} — ${excuse}`)
      continue
    }
    // Layout/positioning props that a selector rename genuinely makes
    // meaningless, and which our cascade sets on a theme modifier instead.
    //
    // `margin` and `margin-bottom` USED TO BE IN THIS LIST, on the stated
    // grounds that they were "verified equal in the browser". They were not:
    // the reference gives `.admin-header` and `.reporting-header` a
    // `margin-bottom: 48px`, and ours measured 0px and 16px — the cards sat
    // flush against the intro text. The skip hid a visible gap on a page this
    // tool had just reported as zero. Spacing is exactly what a reader expects a
    // declaration diff to catch, so it is compared now; anything that really is
    // set elsewhere goes in EXPLAINED, with the reason.
    // `color` USED TO BE IN THIS LIST TOO, and it hid a reported defect: the /ime
    // "What's Included" label renders brand blue in the reference and rendered
    // rgb(34,34,34) here, on a page this tool called zero. That is the same
    // failure as the `margin` skip described above, one paragraph later in the
    // same file — a blanket skip is not a reason, it is an unexamined habit.
    // Colour is a first-class thing a reader expects a declaration diff to catch.
    // What remains here is genuinely structural: a selector rename can move where
    // stacking and clipping are declared without changing what renders.
    if (aliased && ['position', 'z-index', 'overflow'].includes(prop)) continue
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
