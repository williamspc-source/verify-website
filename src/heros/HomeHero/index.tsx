import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

type HomeHeroProps = Page['hero']

/** Homepage hero using the ported `.hero` layout + definition panel. */
export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  const { eyebrow, heading, subtitle, links, media } = props
  const definition = (props as { definition?: { term?: string | null; pronunciation?: string | null; text?: string | null; definitionStyle?: string | null } }).definition
  const cssClass = (props as { cssClass?: string | string[] | null }).cssClass
  const hasDefinition = Boolean(definition?.term || definition?.text)
  const definitionStyle = definition?.definitionStyle === 'frame' ? 'frame' : 'glow'

  return (
    <section
      className={cn('vf-home-hero', toClassName(cssClass))}
      style={{ background: '#cbe5fa', padding: '80px 0' }}
    >
      <div className="container">
        <div className="hero-layout">
          <div>
            {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
            {heading ? <h1 className="hero-heading vf-home-hero__title">{accentText(heading)}</h1> : null}
            {subtitle ? <p className="hero-subtext">{subtitle}</p> : null}
            {Array.isArray(links) && links.length > 0 ? (
              <div className="hero-cta-row">
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="inline"
                    className={i === 0 ? 'hero-cta-primary' : 'hero-cta-secondary'}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {hasDefinition ? (
              <div className={cn('hero-panel hero-definition-panel', `hero-definition-panel--${definitionStyle}`, 'vf-home-hero__definition')}>
                <div className="definition-seal" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/VERIFY Shield.png" alt="" className="definition-seal-logo" />
                </div>
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
