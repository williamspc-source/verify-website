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
  headingWeight,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  bare,
  rowStyle,
  density,
  bulletStyle,
}) => {
  // Compared against the opt-in value, never the default, so a block stored
  // before these fields existed (all three null) renders exactly as it did.
  const divided = rowStyle === 'divided'
  const compact = density === 'compact'
  const dotBullets = bulletStyle === 'dot'

  if (!rows || rows.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn(
        'vf-split-feature',
        divided && 'vf-split-feature--divided',
        compact && 'vf-split-feature--compact',
        dotBullets && 'vf-split-feature--dots',
        headingWeight === 'heavy' && 'vf-headings--heavy',
        toClassName(cssClass),
      )}
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
        const placeholderIcon = (row as { placeholderIcon?: string | null }).placeholderIcon
        // A placeholder keeps the two-column layout (reference grey box) even with
        // no real image; only rows with neither image nor placeholder go full-width.
        const twoColumn = hasImage || placeholder

        const anchorId = (row as { anchorId?: string | null }).anchorId || undefined

        return (
          <div
            key={i}
            id={anchorId}
            className={cn('vf-split', !twoColumn && 'vf-split--solo', twoColumn && !imageLeft && 'vf-split--reverse')}
          >
            {hasImage ? (
              <div className="vf-split__media">
                <Media
                  resource={row.image}
                  fill
                  pictureClassName="absolute inset-0"
                  imgClassName="object-cover"
                />
              </div>
            ) : placeholder ? (
              /* This branch runs only when there is no image, which is what makes
                 an upload replace the placeholder outright — glyph and label with
                 it. `/services` leaves `placeholderIcon` unset, because that
                 reference's empty-photo box is the label alone (styles.css:749-770,
                 the treatment `.who-image-main` shares); reporting-services draws
                 one, so it is a per-row choice rather than a fixed design. */
              <div className="vf-split__media vf-split__media--placeholder" aria-hidden>
                {placeholderIcon ? (
                  <Icon name={placeholderIcon} className="vf-split__placeholder-icon" />
                ) : null}
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
                  {/* `dot` replaces only the *default* tick. A bullet the editor
                      gave an icon keeps it either way — hiding a chosen icon with
                      CSS would discard the choice silently, and the CSS drops the
                      dot for exactly these rows so the two never double up. */}
                  {row.bullets.map((b, j) => (
                    <li key={j}>
                      {b.icon ? (
                        <Icon name={b.icon} className="vf-split__check size-5" />
                      ) : dotBullets ? null : (
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
