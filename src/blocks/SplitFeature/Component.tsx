import { Check } from 'lucide-react'
import React from 'react'

import type { SplitFeatureBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Section, type SectionBackground } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const SplitFeatureBlock: React.FC<Props & { bare?: boolean }> = ({
  background,
  rows,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  bare,
}) => {
  if (!rows || rows.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-split-feature', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      bare={bare}
    >
      {rows.map((row, i) => {
        const side = row.imageSide === 'auto' || !row.imageSide ? (i % 2 === 0 ? 'left' : 'right') : row.imageSide
        const imageLeft = side === 'left'
        const hasImage = row.image && typeof row.image === 'object'

        return (
          <div
            key={i}
            className={cn('vf-split', !hasImage && 'vf-split--solo', hasImage && !imageLeft && 'vf-split--reverse')}
          >
            {hasImage ? (
              <div className="vf-split__media">
                <Media resource={row.image} imgClassName="w-full h-full object-cover" />
              </div>
            ) : null}

            <div className="vf-split__content">
              {row.eyebrow ? <div className="section-label">{row.eyebrow}</div> : null}
              <h3 className={cn('section-title vf-split__title', toClassName(elementClasses?.heading))}>
                {row.title}
              </h3>
              {row.body ? (
                <div className="vf-split__body">
                  <RichText data={row.body} enableGutter={false} enableProse={false} />
                </div>
              ) : null}

              {row.bullets && row.bullets.length > 0 ? (
                <ul className="vf-split__list">
                  {row.bullets.map((b, j) => (
                    <li key={j}>
                      <Check className="vf-split__check size-5" aria-hidden />
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {row.link?.label ? (
                <div className="vf-split__cta">
                  <CMSLink
                    {...row.link}
                    appearance="inline"
                    className={cn('btn btn-primary', toClassName(elementClasses?.button))}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </Section>
  )
}
