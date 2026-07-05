import { Check } from 'lucide-react'
import React from 'react'

import type { SplitFeatureBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
import RichText from '@/components/RichText'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

export const SplitFeatureBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
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
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />
      {rows.map((row, i) => {
        const side = row.imageSide === 'auto' || !row.imageSide ? (i % 2 === 0 ? 'left' : 'right') : row.imageSide
        const imageLeft = side === 'left'
        const hasImage = row.image && typeof row.image === 'object'
        const placeholder = Boolean((row as { imagePlaceholder?: boolean }).imagePlaceholder)
        const placeholderLabel = (row as { placeholderLabel?: string | null }).placeholderLabel
        // A placeholder keeps the two-column layout (reference grey box) even with
        // no real image; only rows with neither image nor placeholder go full-width.
        const twoColumn = hasImage || placeholder

        return (
          <div
            key={i}
            className={cn('vf-split', !twoColumn && 'vf-split--solo', twoColumn && !imageLeft && 'vf-split--reverse')}
          >
            {hasImage ? (
              <div className="vf-split__media">
                <Media resource={row.image} imgClassName="w-full h-full object-cover" />
              </div>
            ) : placeholder ? (
              <div className="vf-split__media vf-split__media--placeholder" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="8.5" cy="9.5" r="1.5" />
                  <path d="M21 16l-5-5L5 20" />
                </svg>
                {placeholderLabel ? <span>{placeholderLabel}</span> : null}
              </div>
            ) : null}

            <div className="vf-split__content">
              {row.icon ? (
                <div className="vf-split__icon vf-card__icon">
                  <Icon name={row.icon} />
                </div>
              ) : null}
              {row.eyebrow ? <div className="section-label">{row.eyebrow}</div> : null}
              <h3 className={cn('section-title vf-split__title', toClassName(elementClasses?.heading))}>
                {accentText(row.title)}
              </h3>
              {row.body ? (
                <div className="vf-split__body">
                  <RichText data={row.body} enableGutter={false} enableProse={false} />
                </div>
              ) : null}

              {row.bulletsLabel ? <div className="vf-split__bullets-label">{row.bulletsLabel}</div> : null}
              {row.bullets && row.bullets.length > 0 ? (
                <ul className="vf-split__list">
                  {row.bullets.map((b, j) => (
                    <li key={j}>
                      {b.icon ? (
                        <Icon name={b.icon} className="vf-split__check size-5" />
                      ) : (
                        <Check className="vf-split__check size-5" aria-hidden />
                      )}
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
