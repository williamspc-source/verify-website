import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type HomeHeroProps = Page['hero']

/** Homepage hero using the ported `.hero` layout + definition panel. */
export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  const { eyebrow, heading, subtitle, links, media } = props
  const definition = (props as { definition?: { term?: string | null; pronunciation?: string | null; text?: string | null } }).definition
  const cssClass = (props as { cssClass?: string | string[] | null }).cssClass
  const hasDefinition = Boolean(definition?.term || definition?.text)

  return (
    <section
      className={cn('vf-home-hero', toClassName(cssClass))}
      style={{ background: 'linear-gradient(135deg,#eef9ff 0%,#e6f4ff 48%,#d9efff 100%)', padding: '80px 0' }}
    >
      <div className="container">
        <div className="hero-layout">
          <div>
            {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
            {heading ? <h1 className="hero-heading vf-home-hero__title">{heading}</h1> : null}
            {subtitle ? <p className="hero-subtext">{subtitle}</p> : null}
            {Array.isArray(links) && links.length > 0 ? (
              <div className="hero-cta-row">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} {...link} appearance="inline" className={cn('btn', i === 0 ? 'btn-primary' : 'btn-outline')} />
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {hasDefinition ? (
              <div className="hero-panel hero-definition-panel vf-home-hero__definition">
                <div className="hero-definition-block">
                  {definition?.term ? <div className="hero-def-word">{definition.term}</div> : null}
                  {definition?.pronunciation ? <div className="hero-def-pos">{definition.pronunciation}</div> : null}
                  {definition?.text ? <div className="hero-def-meaning">{definition.text}</div> : null}
                </div>
              </div>
            ) : media && typeof media === 'object' ? (
              <Media resource={media} imgClassName="w-full h-auto rounded-2xl object-cover" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
