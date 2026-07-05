import Link from 'next/link'
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
  const { eyebrow, heading, subtitle, showBreadcrumb, breadcrumbs, title, links } = props
  const cssClass = (props as { cssClass?: string | string[] | null }).cssClass
  const theme = (props as { theme?: string | null }).theme || 'light'
  const align = (props as { align?: string | null }).align || 'left'
  const showShield = Boolean((props as { showShield?: boolean | null }).showShield)
  const metaItems = ((props as { metaItems?: MetaItem[] | null }).metaItems || []).filter(
    (m) => m?.text,
  )
  const heroLinks = ((links as HeroLink[] | null | undefined) || []).filter((l) => l?.link)
  const headingText = heading || title
  const fullCrumbs: Crumb[] = [{ label: 'Home', url: '/' }, ...((breadcrumbs as Crumb[]) || [])]
  // The reference shows a shallow trail — Home › [top section] › [current] — so
  // collapse any deeper ancestor chain (e.g. Home › Services › Medico-Legal › IME)
  // by dropping the middle crumbs. URLs stay fully nested; only the display shortens.
  const crumbs: Crumb[] =
    fullCrumbs.length > 3
      ? [fullCrumbs[0], fullCrumbs[1], fullCrumbs[fullCrumbs.length - 1]]
      : fullCrumbs

  return (
    <section
      className={cn(
        'page-hero',
        `page-hero--${theme}`,
        align === 'center' && 'page-hero--center',
        showShield && 'page-hero--has-shield',
        toClassName(cssClass),
      )}
    >
      <div className="container">
        <div className="page-hero-inner">
          {showBreadcrumb && crumbs.length > 1 ? (
            <nav className="page-hero-breadcrumb" aria-label="Breadcrumb">
              {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1
                return (
                  <React.Fragment key={i}>
                    {i > 0 ? <span aria-hidden>›</span> : null}
                    {isLast || !c.url ? (
                      <strong>{c.label}</strong>
                    ) : (
                      <Link href={c.url}>{c.label}</Link>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
          ) : null}

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
      </div>

      {showShield ? (
        <div className="page-hero-deco" aria-hidden>
          <span className="page-hero-shield" />
        </div>
      ) : null}
    </section>
  )
}
