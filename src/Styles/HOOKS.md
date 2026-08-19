# Styling the VERIFY site — the complete reference

Everything visual on this site can be changed from the admin. This document tells you where.

> **Looking for what something *is* rather than how it looks?** `ADMIN-GUIDE.md` (repo root) explains
> every item in the admin sidebar — what it holds, where it appears on the site, and what happens if
> you delete one. This file is the styling half.

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
| Centre the service cards (icon + title, equal height) | that Services Grid block → **Card alignment** → Centred |
| Make one AAMLE step's pill stand out | that step → **Badge emphasis** → Highlight |
| Force a line break in a heading | press **Enter** in the heading field (`[[brackets]]` still colour a phrase) |
| Change the muted blue-grey (card link arrows) | Site Settings → Brand colours → **Muted blue-grey** |
| Put a block's heading on its own coloured band | that People Grid block → **Header band** (leave as *Same as the section* for one band) |
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
- Tabs: `.vf-tabs__tablist`, `__tab` (`--active`), `__panel`, `.vf-tabs__tabbar` (the centred pill bar)
- Specialty grid: `.vf-specialty-grid` on the block, `.vf-checklist` on its checklist variant
  (rows are `.claims-list li`, the arrow is `.claim-arrow`, the label `.claim-name`);
  each card-variant tile is a `.vf-card` with `.vf-card__icon` / `.vf-card__title`
- Services grid: `.services-grid`, plus `.vf-cards--center` when **Card alignment** is Centred
- FAQ: `.vf-faq__item`, `__question`, `__question-text`, `__question-icon`, `__answer`, `__list`,
  plus the help card `.vf-faq__help`, `__help-message`, `__help-icon`, `__help-text`,
  `__help-contact`, `__help-contact-item`. Appearance variants appear on the block root:
  `.vf-faq--divided`, `--toggle-chevron`, `--toggle-pill`, `--icon-tile`, `--compact`,
  `--rule-grey`, `--rule-brand`, `--split`
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

> **Linking to a section of another page.** Every link now has a **Jump to section** box under the
> document picker. Type the section's Anchor ID there — without the `#` — and the link lands on that
> section instead of the top of the page. It only appears for *Internal link*, and it is the right
> way to do it: the link still follows the page if the page is ever moved or renamed, which a
> hand-typed address does not. The Appointment Guide's In-Person / Videolink options each have their
> own Anchor ID too, so a link can open the guide *on* one of them.

> **One exception: Testimonials ignores Hover effect → Lift.** Those cards deliberately do not move
> on hover — they highlight by turning their border brand blue, which is what the design calls for.
> The carousel crops tightly to the card, so anything that moved a card cut its top edge off. Glow,
> Zoom, Accent bar and None all still work on that block.

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

### Two-tone sections: a heading band above the content

Some designs put the intro on one colour and the content below it on another —
**About us → Meet the Team** is the example: *"Our People / Experienced, Dedicated & Client-Focused"*
sits on light blue, the team photos on grey.

That is one block, not two. Open the **People Grid** block and you will see two colour pickers:

- **Background** — the band behind the block's content (the photos).
- **Header band** — the band behind the eyebrow, heading and intro paragraph.

Leave **Header band** on *"Same as the section"* and everything sits on one colour, exactly as
before. Pick any other colour and the heading moves onto its own full-width band above the content.

The colours themselves are not set here — they come from **Design System → Section bands**, so
changing *Accent (light blue)* there restyles every accent band on the site at once.

Two things worth knowing:

- If the block has no eyebrow, heading or intro text, **no band appears** however you set this. An
  empty coloured stripe is never rendered.
- Inside a Section or Row, a block already inherits its parent's background, so the setting has no
  effect there.

### Article headings each have a shareable link — and renaming one changes it

Every **Heading 2** in an In the Loop article automatically gets a link of its own, built from the
heading's own words: *"A Simple Pre-Send Check"* becomes
`…/five-common-errors…#a-simple-pre-send-check`. There is nothing to fill in, and the same words
appear in the **In This Article** list down the left of the page.

Two things follow from that:

- **Clicking a contents item now puts that link in the address bar**, so you can copy it straight
  out and send someone to that exact section.
- **Rewording a heading changes its link.** Anyone who saved or shared the old one lands at the top
  of the article instead — the article still opens, nothing 404s, they just have to scroll. Worth a
  thought before renaming a heading in an article you have circulated.

`[[Double brackets]]` work in article headings the same way they do everywhere else, and they are
tidied out of both the contents list and the link — `Preparing the [[Claimant]]` reads
*"Preparing the Claimant"* in the sidebar and links as `#preparing-the-claimant`.

If two headings in one article are worded identically, the second gets `-2` on the end so both stay
reachable.

### An event page's recap is the page — here is everything you can put on one

Open **Events → the event → Details**. Everything below is optional; each surface simply does not
appear until you put something in it.

| Field | What it does on the page |
|---|---|
| **Recap (past events)** | The main write-up, shown once the event date has passed. Formats exactly like an article body — Heading 2, Heading 3, bold, lists, links. |
| **Show "In this recap" contents list** | On by default. Lists the recap's Heading 2s above it, each one a link. Only appears once the recap has **two or more** of them, so a short recap is not given a one-item contents box. |
| **Photo gallery** | Photos from the day, in a grid under the recap. Each can carry a caption. |
| **Downloads / attachments** | Slides, handouts, a recording — one download button each. The **Label** is what the visitor reads; leave it empty and they get the filename. |
| **Image** | Turns the plain hero into a full-width photo hero, the same treatment an article gets. Leave it empty and the hero stays as it is. |
| **Host event page URL** | The event's own page on aamle.com.au. Adds a "View this event on AAMLE" button to the row at the bottom. This is *not* the Registration URL, which usually points at the general seminar menu. |

Recap headings get their own shareable links, exactly as article headings do — see the section
above, including the warning about rewording one you have already circulated.

**Cost and CPD** no longer appear on the event page itself; they read on the event *cards* in
listings instead. The wording of all three ("Free", "CPD eligible", the points template) lives in
**Events Settings → Event page labels**.

**The "this event has now concluded" line is two lines.** A past event with no recap written yet
shows one of them, and which one depends on whether you have attached anything:

- nothing attached → *"…Contact our team for recordings or resources from this session."*
- photos or downloads attached → *"…Photos and resources from the session are below."*

Both are in **Events Settings → Event page labels**. They are separate because the first one, shown
above a Downloads list, tells the visitor to email you for the file they are looking straight at.

**Two buttons that people ask about:**

- The **"Contact Us"** button that replaces "Register" once registrations close goes to
  **Events Settings → Event page labels → Contact page URL** (`/contact` by default). It used to
  reuse the event's registration link, which sent people to a booking page they could no longer use.
- The **AAMLE / VERIFY intro paragraph and the tinted callout** under it are shared by every event
  with that host and live in **Events Settings → AAMLE events / VERIFY events**. Both are rich text,
  so you can bold a name or link out.

### Feature cards can have a tinted header band

**Pages → the page → the Feature Grid block → Card style.** Three choices:

| Card style | What it looks like |
|---|---|
| **Card (bordered)** | The default — a bordered box with a subtle gradient, everything stacked inside it. |
| **Plain (no border)** | No border, no background. For a list of points that should not look like cards. |
| **Banded (tinted header)** | The icon and title sit on a pale blue panel across the top of the card; the description and any "What's Included" details sit below it on the card's own background. |

"Banded" is what `/services/medico-legal/ime` uses for its four assessment formats. Nothing else needs
setting — pick it and the block rearranges itself.

Two things worth knowing about that block generally:

- The **"What's Included"** list under a card comes from the *Details* rows on each feature. Each row
  takes an icon, a bold heading and a description; leave the list empty and nothing renders.
- The **Columns** field is respected on phones now. It used to be written in a way that overrode every
  screen-size rule, so a two-column grid stayed two-across on a phone no matter what.

### Carousels — what you can change, and what the numbers mean

Two different kinds of carousel, and their speed fields mean different things. Getting this backwards
is the usual reason one ends up too fast.

| Block | Where | Speed field | What the number means |
|---|---|---|---|
| **People Grid** (Layout: Carousel) | Home, JME specialists | **Loop duration (seconds)** | How long the whole strip takes to scroll past **once**. It never stops — it is a continuous ribbon, not slides. **Lower = faster.** The design uses **60**. |
| **Availability** | Make a Booking, Specialist Availability | *(none)* | Same ribbon, fixed at 60 seconds. |
| **Featured Articles Carousel** | In the Loop | **Autoplay interval (ms)** | How long **each slide** is shown before the next one. The design uses **5000** (5 seconds). |
| **Slide Carousel** | Events | **Autoplay interval (ms)** | Same — per slide. The design uses **5800**. |
| **Testimonials** (Layout: Carousel) | Home | *(none)* | Never moves on its own; the arrows are the only way through. |

Both auto-advancing carousels also have **Auto-advance slides** (untick it and it only moves when
someone clicks), **Show prev / next arrows** and **Show dot indicators**.

The ribbon carousels have **Show direction arrows** instead. Those arrows do not step through cards —
they reverse the direction the ribbon travels. All of them pause while the pointer is over them, or
while anything inside has keyboard focus; that is deliberate and not something you can switch off.

Arrows and dots also hide themselves automatically when there is only one item to show, whatever the
tickbox says.

### Step numbers can be `1` or `01`

**Pages → the page → the Process Steps block → Step number style.** The design uses both, so this is
per-section rather than a site-wide setting:

- **Plain — 1, 2, 3** — the JME process, and the Administrative Services "how it works".
- **Padded — 01, 02, 03** — Information for Clients, Information for Claimants.

Changing it affects only the block you are editing.

### Split Feature rows have three looks, mixed and matched

**Pages → the page → the Split Feature block.** Three independent settings near the top. Each one
leaves everything else alone, so you can take any combination.

| Setting | Choices | What changes |
|---|---|---|
| **Row style** | Spaced · **Divided by a rule** | Spaced leaves a gap between rows. Divided draws a hairline rule between them instead, with even padding either side — no rule above the first row. |
| **Text density** | Default · **Compact** | Compact steps the *whole section* down a size: the section heading, the intro, each row's title, its body copy, its bullets and the caption inside an image placeholder. |
| **Bullet style** | Tick icon · **Plain dot** | What marks a bullet that has no icon of its own. |

`/services/medico-legal/reporting-services` is all three at once, and is what the design calls for.

**A bullet with its own icon always keeps it.** Setting Bullet style to Plain dot changes only the
bullets you have *not* given an icon — so you can mark three points with dots and one with a tick,
and no choice you made gets thrown away.

### Image placeholders, and how to replace one

Each Split Feature row can show a pale blue box in place of a photo, so a page can be laid out before
the photography exists. Per row:

- **Show a grey image placeholder** — the tickbox that turns it on.
- **Placeholder label** — the caption inside it, e.g. "Image Placeholder".
- **Placeholder icon** — an optional glyph above the caption. Reporting Services uses the `image`
  one; the /services rows deliberately have none.

**To replace it, just upload an image to that row.** The whole placeholder disappears — box, caption
and glyph together — and the photo takes its place. You do **not** need to untick anything, and
removing the image later brings the placeholder back exactly as it was.


### A specialist's job title, qualification icons and accreditations

**Specialists → the specialist.**

- **Position / title line** is what shows under the name on the profile — "Consultant Spinal Surgeon",
  not the specialty. Leave it empty and the specialty is used instead, so the line is never blank.
- **Qualifications** is a list, and each row has its **own icon**. The defaults follow the design: a
  graduation cap for a degree, a medal for a fellowship, a certificate for a certificate or diploma.
  Add a row and leave the icon empty and it picks the right one from the wording — set one and your
  choice always wins.
- **Accreditations** are records shared between specialists (Specialists → Accreditations), and each
  one carries its own icon too. They all use the seal-check tick by default, which is what the design
  calls for; change it on the accreditation and it changes everywhere that accreditation appears.


### Card styles on a Feature Grid, and what makes service cards centre

**Pages → the page → the Feature Grid block → Card style.** There are now five:

| Card style | What it looks like |
|---|---|
| **Card (bordered)** | The default — a bordered box with a subtle gradient. |
| **Plain (no border)** | No border, no background. For points that should not look like cards. |
| **Banded (tinted header)** | Icon and title on a pale blue panel across the top. |
| **Soft** | Flat white, a wider corner, a soft blue shadow, and a gentle lift on hover instead of the bolder shift. The support cards on **Information for Clients** use this. |
| **Benefit (plain icon, centred)** | Centred, with a large plain blue icon instead of an icon tile, and the description justified. The **Why Join VERIFY** cards on *Join the Expert Panel* use this. It also drops to two columns at 960px and one at 640px, rather than the shared 1024px breakpoint. |

### Making a section's heading heavier

**Pages → the page → the block → Heading weight**, on a Feature Grid or a Split Feature. **Default**
matches every other heading on the site; **Heavy** is a bolder cut. Only *Join the Expert Panel*
uses it — the design reference makes that one page's headings heavier than the rest, and this field
is how that stays confined to that page instead of re-weighting all of them.

Separately, on a **Services Grid**, the **Card alignment** field is what turns the cards into centred
tiles — icon centred above a centred title, all cards the same height. Left is the default and gives
you a normal left-aligned card. The homepage and Information for Clients both use **Centred**; if a
services grid ever looks unexpectedly ragged next to those, this is the field to check.

### The FAQ accordion — six settings, and every one leaves the others alone

**Pages → the page → the FAQ block.** The block has always drawn each question in its own outlined
white box. The design reference draws a flat list instead, so both are now available, along with the
pieces that vary between them. **Leave any of these blank and nothing changes** — an untouched FAQ
looks exactly as it always has.

| Setting | Choices | What changes |
|---|---|---|
| **Item style** | Card · **Divided** | Card keeps each question in its own outlined box with a gap between. Divided drops the boxes for a flat list separated by hairline rules. |
| **Toggle style** | Plus / minus · **Chevron** · **Pill** | The open/close marker at the end of each question. Chevron is a thin arrow that turns as it opens; Pill sets the + and − in a filled circle that inverts to white-on-blue. |
| **Icon style** | Inline · **Tile** | Only matters if a question has an icon. Tile sets it in a rounded tinted square and indents the answer so it lines up under the question text. |
| **Density** | Comfortable · **Compact** | Compact tightens the row height and steps the question, answer and section heading down a size. |
| **Rule colour** | Light · Grey · **Brand tinted** | Only appears when Item style is Divided. Brand tinted suits an accordion sitting on a coloured band. |
| **Content width** | Narrow · Normal · Wide · Full | Leave blank for the narrow column the block has always used. |

Where each is used: **Information for Clients** and **Information for Claimants** are Divided +
Chevron; the **IME** page's claim-types list is Divided + Pill + Tile + Compact on brand-tinted rules;
the **JME** FAQ is Divided + Pill + Compact. The **Style Guide** is deliberately left on Card, so the
default look stays visible somewhere.

> **"Only one open at a time" is a separate tickbox, and it is worth a thought.** Untick it and a
> reader can leave several answers open to compare them — which is what the reference does on both
> Information Centre pages. Tick it and opening one closes the last, which suits a short list where
> the whole set should stay on screen. Both Information Centre pages are now unticked; IME and JME
> stay ticked.

> **Side by side** (under Layout) puts the heading and intro in a narrow left column with the
> questions beside them. It replaces a hand-written style class that used to do the same thing on the
> JME page only — so it is now available on any FAQ.

### A fifth section background: Pale blue

**Background** on any Section now offers **Pale blue** alongside White, Light grey, Light blue accent,
Light blue (solid), Primary and Dark. It is the palest of the blues — noticeably lighter than "Light
blue (solid)" — and is what the design reference bands the Claimants FAQ, the contact enquiry panel
and the appointment-guide highlight cards with. Its value is editable like every other band token.

### The enquiry form — a card, and placeholders

**Pages → the page → the Form block.** Two things you can now set that used to need a developer:

| Setting | Choices | What changes |
|---|---|---|
| **Card style** | None · **Card** | Card wraps the whole block — intro heading included — in a white panel with a soft shadow, so the heading sits *inside* the box rather than above it. |

Used on **Contact**, the **homepage** enquiry band and **Join Our Expert Panel**. All three used to
achieve this with a hand-written style class; it is one setting now, so any form can have it.

**Placeholders** are the grey prompt text inside an empty field ("you@company.com", "07 XXXX XXXX").
**Forms → the form → the field → Placeholder.** Every text, email, number and long-text field has one,
and so does a dropdown, where it replaces the default "Select…" line. A placeholder is *not* a default
value — it is never submitted, so it cannot arrive in an enquiry as if the visitor typed it.

### A button that opens a prefilled email

Portal access is by registration only, so two buttons open the visitor's mail app with the whole
enquiry already written — they only fill in the blanks and hit send. **"Email Us to Register"** on
Contact's Online Booking Portal card, and **"Register an Account"** on Make a Booking.

**You edit the message in one place: Site Settings → Booking portal registration email.**

| Field | What it is |
|---|---|
| **Send to** | Where the enquiry arrives. Currently `admin@vmls.com.au`. |
| **Subject** | The subject line the visitor's mail app is given. |
| **Body** | The message itself. Blank lines and spacing are kept exactly as you type them, so the `Full Name:` / `Company/Organisation:` prompts stay on their own lines. |

Both buttons read the same settings, so changing the wording here changes it in both places — you do
not need to find and edit each button.

> **Clearing "Send to" switches the buttons off**, on purpose: they render as plain grey text instead
> of links. An email with no recipient would open an empty compose window and look like it worked, so
> a visibly dead button is the honest outcome. Put an address back and they return.

To put this on another button: **Pages → the page → a Button block → the link → Registration enquiry
email**. It needs no URL — the address and wording come from Site Settings. The option appears only on
Button blocks and the Make a Booking chooser panels, which are the two that know how to build the
email; it is deliberately absent elsewhere rather than offered and silently doing nothing.

### Two-column rows that are not 50/50

**Pages → the page → the Row block → Column ratio.** Leave it unset for equal columns. The other
options — 1 : 1.5, 1.5 : 1, 1 : 2, 2 : 1 — apply to two-column rows only, and stack on mobile like any
other row. The Join Expert Panel enquiry band is 1 : 1.5, a narrow intro beside a wider form.

Beside it, **Gap** gained an **Extra wide** step (72px), which is what the design reference uses
between the columns of those bands — one notch wider than Wide.

### An icon list can be left-aligned

**Pages → the page → the Icon List block → Heading align.** The eyebrow, heading and intro above the
list were always centred, with no way to change it. Leave it unset for centred; choose Left for a list
that sits in a column beside something else, as the Join Expert Panel contact details do.

> **An icon list whose items are links styles itself as a contact list** — brand-blue links, a larger
> icon and tighter spacing. There is no setting for it: adding links is the signal, because that is
> what distinguishes contact details from a row of feature chips.
