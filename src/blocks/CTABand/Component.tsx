import React from 'react'

import type { CTABandBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Section } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

// Always a dark gradient band (mirrors the design reference's `.about-cta`).
export const CTABandBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  text,
  links,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  bare,
}) => {
  if (!heading) return null

  return (
    <Section
      background="primary"
      className={cn('vf-cta-band', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      bare={bare}
    >
      <div className="vf-cta-band__content">
        {eyebrow ? <p className="vf-cta-band__eyebrow section-label">{eyebrow}</p> : null}
        <h2 className={cn('vf-cta-band__heading', toClassName(elementClasses?.heading))}>
          {accentText(heading)}
        </h2>
        {text ? <p className="vf-cta-band__text">{text}</p> : null}

        {Array.isArray(links) && links.length > 0 ? (
          <div className="vf-cta-band__actions">
            {links.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="inline"
                className={cn('btn', i === 0 ? 'btn-white' : 'btn-outline', toClassName(elementClasses?.button))}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
