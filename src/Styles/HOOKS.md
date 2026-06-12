# Custom Styles — hook & token reference

Define presets in **Admin → Globals → Custom Styles**, then apply them by name via the
**Custom CSS class(es)** picker on any block / hero / page (and the per-block **Element styles**
slots: Heading, Cards, Buttons).

Write CSS that targets the stable `vf-*` hook classes below. Brand tokens are available as CSS
variables so styles stay on-brand.

## Brand tokens (CSS variables)
`--primary`, `--primary-strong`, `--primary-foreground`, `--accent`, `--foreground`,
`--muted-foreground`, `--secondary-2`, `--border`, `--background`, `--card`,
`--shadow`, `--shadow-lg`, `--radius`, `--transition`, `--font-heading`, `--font-body`.

## Section hooks (every block renders through Section)
- `.vf-section` — the section element (background, padding live here)
- `.vf-section__inner` — the inner container
- `.vf-section-header`, `.vf-section-header__eyebrow`, `.vf-section-header__title`,
  `.vf-section-header__divider`, `.vf-section-header__subtitle`

## Block root hooks
`.vf-gateway-cards`, `.vf-feature-grid`, `.vf-stats-band`, `.vf-process-steps`, `.vf-tabs`,
`.vf-split-feature`, `.vf-cta-band`, `.vf-specialty-grid`, `.vf-people-grid`, `.vf-faq`,
`.vf-page-hero`, `.vf-home-hero`

## Shared part hooks
- `.vf-card` — every card / tile / stat / person card (target this for card styling)
- `.vf-card__icon` — icon container inside a card
- `.vf-card__title` — card title
- `.vf-badge` — any badge/pill

## Component-specific hooks
- Carousel: `.vf-carousel`, `.vf-carousel__track`, `.vf-carousel__item`,
  `.vf-carousel__controls`, `.vf-carousel__arrow` (`--prev` / `--next`), `.vf-carousel__dots`,
  `.vf-carousel__dot`
- Person card: `.vf-person-card`, `.vf-person-card__avatar`, `.vf-person-card__avatar-img`,
  `.vf-person-card__avatar-initials`, `.vf-person-card__name`, `.vf-person-card__position`,
  `.vf-person-card__location`, `.vf-person-card__badge`
- Stats: `.vf-stats-band__stat`, `.vf-stats-band__number`, `.vf-stats-band__label`
- Process: `.vf-process-steps__step`, `.vf-process-steps__number`
- Tabs: `.vf-tabs__tablist`, `.vf-tabs__tab` (`.vf-tabs__tab--active`), `.vf-tabs__panel`
- Specialty: `.vf-specialty-grid__tile`, `.vf-specialty-grid__label`, `.vf-specialty-grid__arrow`
- FAQ: `.vf-faq__item`, `.vf-faq__question`, `.vf-faq__answer`
- Heroes: `.vf-page-hero__panel`, `.vf-page-hero__title`, `.vf-home-hero__title`,
  `.vf-home-hero__definition`, `.vf-home-hero__definition-term`

## Built-in options (no CSS needed)
Each block also exposes: **Background**, **Container width**, **Motion** (scroll reveal),
**Hover effect** (cards), plus block-specifics (carousel autoplay/loop/per-view/dots, tab style,
FAQ single-open). Use presets for anything beyond these.

## Tips
- Scope to the block: `.<your-class>.vf-section { … }` or `.<your-class> .vf-card { … }`.
- Apply a preset to the whole block via its **Custom CSS class(es)**; to just the heading/cards/
  buttons via **Element styles**.
