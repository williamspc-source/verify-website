# Styling the VERIFY site — the complete reference

Everything visual on this site can be changed from the admin. This document tells you where.

Start with **§1** if you only read one section: it explains why edits sometimes appear not to
work, and how to guarantee they always do.

---

## 1. How the three layers stack

Styles are applied in three passes. Each one beats the one above it, and **the last one always
wins**:

| # | Layer | Where it comes from | Who edits it |
| --- | --- | --- | --- |
| 1 | Built-in defaults | `globals.css` in the codebase | a developer |
| 2 | `<style id="verify-design-tokens">` | **Site Settings** + **Design System** | you, via admin fields |
| 3 | `<style id="verify-custom-styles">` | **Custom Styles → Global CSS** and presets | you, by writing CSS |

All three are ordinary stylesheets at the same specificity, so plain source order decides.

**This means Global CSS can override anything**, including any token set in Site Settings:

```css
/* Custom Styles → Global CSS — this wins over the Site Settings "Primary" field */
:root { --primary: #b0202a; }
```

> **Historical note, in case you find old advice saying otherwise.** These tokens used to be
> applied as an inline `style` attribute on `<html>`. Inline styles outrank every stylesheet, so
> `:root { … }` written in Global CSS was silently ignored. That is fixed — Global CSS is now a
> genuine, unlimited override layer. If you ever see tokens move back onto `<html style>`, this
> guarantee breaks.

**Order to try things, cheapest first:** a built-in block option → a Design System / Site Settings
field → a Custom Styles preset → Global CSS.

---

## 2. "I want to change X" — where to go

| You want to… | Go to |
| --- | --- |
| Change the brand blue | Site Settings → Brand colours → **Primary** |
| Change body / heading text colour | Site Settings → Brand colours → **Body text (paragraphs)** / **Strong text (headings)** |
| Fix pale text on a dark band | Site Settings → Brand colours → the four **on dark** fields |
| Change the page or card background | Site Settings → Surfaces → **Pure white** (most surfaces) |
| Change error / warning / success colours | Site Settings → **Status & feedback** |
| Change the specialist availability legend | Site Settings → Status & feedback → **Availability** |
| Make the whole site bigger or smaller | Design System → Typography → **Overall size** |
| Change fonts | Design System → **Typography** |
| Round the cards more (or square everything off) | Design System → **Corner rounding** |
| Change section spacing | Design System → **Section spacing** |
| Change the coloured section bands | Design System → **Section bands** |
| Change shadow depth or glow | Design System → **Shadows & glows** |
| Retint every shadow at once | Design System → Shadows & glows → **Shadow colour** |
| Change a gradient's angle | Design System → **Gradients** |
| Speed up / disable hover animations | Design System → Shadows & glows → **Transition** |
| Change one block only | that block's **Custom CSS class(es)** + a Custom Styles preset |
| Change the home hero's band or padding | the Home page → **Hero** tab |
| Anything not listed above | Custom Styles → **Global CSS** |

Every field is optional. **Leave it empty to fall back to the built-in default** — that is always
the safe way to undo a change.

---

## 3. Token reference, grouped by where you edit it

Defaults live in `globals.css :root`. Empty admin field = default.

### Site Settings → Brand colours

**Core brand**
`--primary` · `--primary-strong` · `--foreground` + `--text-dark-base` (Body text) ·
`--muted-foreground` + `--text-mid-base` (Strong text — the DARKER of the two) · `--bg-light-1` + `--accent` ·
`--border-base` + `--input` · `--accent-light` · `--primary-deep`

**On dark** — used automatically wherever text sits on a dark or coloured band
`--text-on-dark` · `--text-muted-on-dark` · `--accent-sky` + `--accent-on-dark` · `--border-on-dark`

**Surfaces**
`--background` (page) · `--card` + `--popover` (cards/panels) ·
`--card-foreground` + `--popover-foreground` · `--white` · `--muted` ·
`--primary-foreground` (text on primary) · `--ring` (focus outline)

**Extended blues** — the ramp the gradients and decorative panels draw from
`--secondary` · `--secondary-foreground` + `--accent-foreground` · `--secondary-bright` ·
`--gradient-start` · `--navy` · `--definition-blue` · `--bg-light-2`

**Status & feedback**
`--success` · `--warning` · `--error` + `--destructive` · `--form-error` ·
`--callout-info` · `--callout-note` · `--callout-success` · `--callout-warning` ·
`--sa-inperson` · `--sa-telehealth` · `--sa-either`

### Design System

| Group | Variables |
| --- | --- |
| Typography | `--font-heading`, `--font-body`, `--font-size-base`, **`--vf-text-scale`** |
| Section spacing | `--space-{compact\|normal\|spacious\|xl}` |
| Column gaps | `--gap-{tight\|normal\|wide}` |
| Heading sizes | `--size-heading-{sm\|md\|lg\|xl\|display}` |
| Text block sizes | `--size-text-{sm\|base\|lg}` |
| Corner rounding | `--vf-radius-{none\|sm\|chip\|card\|tile\|md\|panel\|pill\|circle}`, `--radius` |
| Section bands | `--band-{muted\|accent\|primary\|dark}` |
| Gradients | `--vf-grad-{image-tint\|deep\|hero\|avatar}` |
| Shadows & glows | `--vf-shadow-{color\|color-deep\|xs\|sm\|md\|lg\|xl\|2xl}`, `--vf-glow-{sm\|md\|lg}`, `--vf-shadow-{ring\|inset-highlight\|hard}`, `--transition` |

`--shadow` and `--shadow-lg` still exist and are aliases of `--vf-shadow-sm` / `--vf-shadow-lg`.
Edit those rungs rather than the aliases.

**Overall size** multiplies the root font size. Because nearly all type on this site is sized in
`rem`, one change scales everything proportionally — including the spacing around text, since
Tailwind's spacing scale is also rem-based. Page width is fixed in pixels, so a larger setting
means bigger type in the same column. Layout breakpoints are unaffected by design.

**Shadow colour** tints the whole shadow scale at once and follows Primary unless you override it.
A darker brand colour therefore makes every shadow heavier.

### Not editable from a field
`--chart-1…5` and `--sidebar-*` affect Payload's own admin chrome, not the public site.
Override them in Global CSS if you ever need to.

---

## 4. The `-base` rule (the one that catches people out)

Three tokens exist in two forms:

| Flips inside `.vf-on-dark` | Never flips |
| --- | --- |
| `--text-dark` | `--text-dark-base` |
| `--text-mid` | `--text-mid-base` |
| `--border` | `--border-base` |

**Paint text with the flipping ones. Paint backgrounds and borders with `-base`.**

Get it backwards and you get an invisible element: a surface painted with `var(--text-dark)` turns
white inside a dark band, because that token is *supposed* to become the on-dark text colour there.

- `.vf-on-dark` is added automatically to every `primary` and `dark` Section. Everything inside it
  flips — you never need to restyle a section for a dark background.
- `.vf-on-light` goes on a light surface **inside** a dark band (a white card, a pale panel) to
  restore the light tokens. Without it, text on that card inherits the on-dark palette and can end
  up white-on-white.

---

## 5. Limits of each editing surface

**Token fields** (Site Settings, Design System) accept any CSS value *except* `<`, `>`, `{`, `}`,
`;`, `\` and comment markers, up to 200 characters. Those characters could break out of the
stylesheet, so they're rejected when you save and the field will tell you. An invalid value is
never rendered — the built-in default is used instead.

**Custom Styles → presets and Global CSS** are unrestricted CSS. Nothing is filtered except the
literal text `</style`, which cannot appear in valid CSS anyway.

**Custom Styles presets** are the only classes an editor can apply to a block: define one, then
pick it from the **Custom CSS class(es)** dropdown. There is no free-text class field by design.

---

## 6. Hook classes

These class names are a **published API**. They are load-bearing — the dead-code sweep treats
everything listed here as live, and they should not be renamed without updating this file.

**Sections** — `.vf-section`, `.vf-section__inner`, `.vf-section-header`,
`.vf-section-header__eyebrow`, `.vf-section-header__title`,
`.vf-section-header__subtitle`, `.vf-section-header--centered`

> The header's rule under the title is plain `.divider`, not
> `.vf-section-header__divider`. That name was documented here for a while and
> never existed; target `.vf-section-header .divider`.

**Block roots** — `.vf-gateway-cards`, `.vf-feature-grid`, `.vf-stats-band`, `.vf-process-steps`,
`.vf-tabs`, `.vf-split-feature`, `.vf-cta-band`, `.vf-specialty-grid`, `.vf-people-grid`,
`.vf-faq`, `.vf-home-hero`, `.vf-callout-block`

**Shared parts** — `.vf-card` (every card/tile/stat/person card — target this for card styling),
`.vf-card__icon`, `.vf-card__title`, `.vf-badge`, `.vf-form-error`

**Components**
- Carousel: `.vf-carousel`, `__viewport`, `__track`, `__arrow` (`--prev`/`--next`)
- Person card: `.vf-team-card`, `__photo`, `__image`, `__name`, `__role`, `__body`, `__link`,
  `__mono`, plus `.vf-person-card__avatar` on the avatar itself. Person cards are also
  `.vf-card`, so `.vf-card` styling reaches them.
- Stats: `.vf-stats-band__stat`, `__number`, `__label`
- Process: `.vf-process-steps__step`, `__number`
- Tabs: `.vf-tabs__tablist`, `__tab` (`--active`), `__panel`
- Specialty grid: `.vf-specialty-grid` on the block, `.vf-checklist` on its checklist variant;
  each tile is a `.vf-card` with `.vf-card__icon` / `.vf-card__title`
- FAQ: `.vf-faq__item`, `__question`, `__answer`
- Callout: `.vf-callout`, `__content`, `__icon`, `__tag`, `__heading`, `__body`, `__links`
- Heroes: the interior hero root is `.page-hero` (with `.page-hero--light|dark|service`);
  its meta row is `.vf-page-hero__meta` / `__meta-item`. Home hero:
  `.vf-home-hero`, `__title`, `__definition`.

> **Removed from this list because nothing emits them.** `.vf-person-card` (the
> root is `.vf-team-card`), `.vf-person-card__name` / `__position` / `__location`
> / `__badge` / `__avatar-img` / `__avatar-initials`, `.vf-specialty-grid__tile`
> / `__label` / `__arrow`, and `.vf-carousel__item` / `__controls` / `__dots` /
> `__dot`. A preset written against any of these silently does nothing.
>
> **Three shipped presets were written against those names and did nothing:**
> *Carousel · Overlay arrows*, *Avatars · Gradient initials* and *Divider · Bold*.
> They are corrected in the seed, but **presets are database rows** — an existing
> site keeps the old CSS until someone opens Globals → Custom Styles and edits
> those three presets by hand. Re-running the seed will not fix them.

**Layout primitives and atoms**
- Section: padding `.vf-section--pt-{none|compact|normal|spacious|xl}` and `--pb-*`;
  bands `.vf-section--{white|muted|accent|accent-solid|primary|dark}`
- Row/Column: `.vf-row`, `.vf-row--gap-{none|tight|normal|wide}`,
  `.vf-row--alignY-{top|center|bottom|stretch}`, `.vf-col`, `.vf-col--span-{1..4}`
- Atoms: `.vf-heading--{sm|md|lg|xl|display}`, `.vf-text--{sm|base|lg}`, `.vf-btn--{sm|lg}`,
  `.vf-image--{full|wide|normal|narrow}`, `.vf-image--rounded-{none|sm|md|full}`,
  `.vf-image--shadow-{none|sm|md|lg|xl}`, `.vf-spacer--{xs|sm|md|lg|xl}`,
  `.vf-divider--{line|dots|gradient}`, `.vf-icon--{sm|md|lg}`,
  `.vf-icon--{primary|accent|muted|inherit}`, `.vf-align-{left|center|right}`
- Effects: `.vf-hover-{lift|glow|zoom|accent-bar}`, `.vf-shadow-{none|xs|sm|md|lg|xl|glow|glow-strong}`
- Nested blocks render in bare mode (`.vf-section-bare`) — no banding or padding, inheriting the
  parent Section's background and width.

---

## 7. Built-in options (no CSS needed)

Every block exposes **Background**, **Container width**, **Motion**, and grid blocks add
**Hover effect** and **Card shadow**. Layout primitives add padding, gap, columns/span and
alignment. The home hero adds background, width and padding. Reach for CSS only after these.

---

## 8. Five-minute recipes

**Rebrand to a different colour**
Site Settings → Brand colours → Primary. Most of the site follows it, including shadows and
gradients. Then check Primary (hover/active) and Deep primary.

**Make everything bigger**
Design System → Typography → Overall size → 110%.

**Square off every corner**
Design System → Corner rounding → set every field to `0`.

**Change the section band gradients**
Design System → Section bands. Any CSS colour or gradient works.

**Turn off all hover animation**
Design System → Shadows & glows → Transition → `0s`.

**Add a webfont**
Custom Styles → Global CSS:
```css
@font-face { font-family: 'Your Font'; src: url('https://…') format('woff2'); font-display: swap; }
```
then Design System → Typography → Heading font → `'Your Font', sans-serif`.

**Restyle one block only**
Custom Styles → add a preset named `quiet-cards`:
```css
.quiet-cards .vf-card { box-shadow: none; border: 1px solid var(--border-base); }
```
then pick **quiet-cards** in that block's *Custom CSS class(es)*.

---

## 9. Tips

- Scope to a block: `.<your-class>.vf-section { … }` or `.<your-class> .vf-card { … }`.
- Use **Element styles** (Heading / Cards / Buttons) to target one part of a block.
- Prefer tokens over literal colours — `var(--primary)` keeps working after a rebrand, `#1c75bc`
  does not.
- If a change seems to do nothing, check §1: something later in the order is overriding it.
  Global CSS always wins.

### A form or signup box is missing from the page — it is not CSS

If the **"Make an Enquiry"** drawer opens but its Send button is greyed out and it says
*"This form is temporarily unavailable"*, nothing is hidden and no styling is at fault. The drawer
does not know which form to put the enquiry in, so it refuses to take one rather than accept an
enquiry it would then discard.

Fix it in **Globals → Site Settings → Enquiry drawer form**: choose the form named **Enquiry**.
The most common cause is that someone renamed that form.

Same for a **newsletter band** that shows a heading and *"Signups are temporarily unavailable"*
instead of an email box: open that block on the page and set its **Form** field. If it shows the
box but nothing is stored, the chosen form is missing a field named `email` — add one under
**Forms**.

Both of these are deliberate. Neither will ever show a working-looking box that throws the
submission away.
