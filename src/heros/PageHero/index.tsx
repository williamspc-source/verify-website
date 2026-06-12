import Link from 'next/link'
import React from 'react'

import type { Page } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export type Crumb = { label?: string | null; url?: string | null }

type PageHeroProps = Page['hero'] & {
  breadcrumbs?: Crumb[] | null
  title?: string | null
}

/** Interior-page hero using the ported `.page-hero` gradient band. */
export const PageHero: React.FC<PageHeroProps> = (props) => {
  const { eyebrow, heading, subtitle, showBreadcrumb, breadcrumbs, title } = props
  const cssClass = (props as { cssClass?: string | string[] | null }).cssClass
  const headingText = heading || title
  const crumbs: Crumb[] = [{ label: 'Home', url: '/' }, ...((breadcrumbs as Crumb[]) || [])]

  return (
    <section className={cn('page-hero vf-page-hero', toClassName(cssClass))}>
      <div className="container">
        {showBreadcrumb && crumbs.length > 1 ? (
          <nav aria-label="Breadcrumb" style={{ marginBottom: 14 }}>
            <ol style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6, fontSize: '0.8rem', color: 'var(--text-mid)', listStyle: 'none' }}>
              {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1
                return (
                  <li key={i} style={{ display: 'flex', gap: 6 }}>
                    {i > 0 ? <span aria-hidden style={{ opacity: 0.5 }}>›</span> : null}
                    {isLast || !c.url ? (
                      <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{c.label}</span>
                    ) : (
                      <Link href={c.url} style={{ color: 'var(--primary)' }}>
                        {c.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <div className="section-label vf-page-hero__eyebrow">{eyebrow}</div> : null}
        {headingText ? <h1 className="vf-page-hero__title">{headingText}</h1> : null}
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  )
}
