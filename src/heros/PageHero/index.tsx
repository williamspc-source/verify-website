import React from 'react'

import type { Page } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'

export type Crumb = { label?: string | null; url?: string | null }

type MetaItem = { icon?: string | null; text?: string | null; href?: string | null }
type HeroLink = { link?: Record<string, unknown> | null }

type PageHeroProps = Page['hero'] & {
  breadcrumbs?: Crumb[] | null
  title?: string | null
}

/**
 * Interior-page hero — ports the design-reference `.page-hero` band.
 * theme: light | dark (blue gradient) | service (soft blue #cbe5fa).
 */
export const PageHero: React.FC<PageHeroProps> = (props) => {
  const { eyebrow, heading, subtitle, title, links } = props
  const cssClass = (props as { cssClass?: string | string[] | null }).cssClass
  const theme = (props as { theme?: string | null }).theme || 'light'
  const align = (props as { align?: string | null }).align || 'left'
  const showShield = Boolean((props as { showShield?: boolean | null }).showShield)
  const metaItems = ((props as { metaItems?: MetaItem[] | null }).metaItems || []).filter(
    (m) => m?.text,
  )
  const heroLinks = ((links as HeroLink[] | null | undefined) || []).filter((l) => l?.link)
  const headingText = heading || title
  const imagePanel = Boolean((props as { imagePanel?: boolean | null }).imagePanel)
  const imagePanelLabel =
    (props as { imagePanelLabel?: string | null }).imagePanelLabel || 'Company Image Placeholder'
  const scrollHint = (props as { scrollHint?: string | null }).scrollHint

  const inner = (
    <div className="page-hero-inner">
          {eyebrow ? <div className="section-label page-hero-eyebrow">{eyebrow}</div> : null}
          {headingText ? <h1>{accentText(headingText)}</h1> : null}
          {subtitle ? <p className="page-hero-sub">{subtitle}</p> : null}

          {heroLinks.length ? (
            <div className="page-hero-actions">
              {heroLinks.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...(link as Record<string, unknown>)}
                  appearance="inline"
                  className={i === 0 ? 'btn-hero-primary' : 'btn-hero-outline'}
                />
              ))}
            </div>
          ) : null}

          {metaItems.length ? (
            <div className="vf-page-hero__meta">
              {metaItems.map((m, i) => {
                const inner = (
                  <>
                    {m.icon ? <Icon name={m.icon} className="size-5" /> : null}
                    <span>{m.text}</span>
                  </>
                )
                return m.href ? (
                  <a key={i} href={m.href} className="vf-page-hero__meta-item">
                    {inner}
                  </a>
                ) : (
                  <span key={i} className="vf-page-hero__meta-item">
                    {inner}
                  </span>
                )
              })}
            </div>
          ) : null}
    </div>
  )

  return (
    <section
      className={cn(
        'page-hero',
        `page-hero--${theme}`,
        align === 'center' && 'page-hero--center',
        showShield && 'page-hero--has-shield',
        imagePanel && 'page-hero--image-panel',
        toClassName(cssClass),
      )}
    >
      <div className="container">
        {imagePanel ? (
          <div className="ph-grid">
            {inner}
            <div className="ph-card-wrap">
              <div className="ph-company-img">
                <Icon name="image" />
                <span className="ph-card-img-label">{imagePanelLabel}</span>
              </div>
              {scrollHint ? (
                <div className="ph-scroll-hint">
                  <Icon name="arrow-down" />
                  <span>{scrollHint}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          inner
        )}
      </div>

      {showShield ? (
        <div className="page-hero-deco" aria-hidden>
          <span className="page-hero-shield" />
        </div>
      ) : null}
    </section>
  )
}
