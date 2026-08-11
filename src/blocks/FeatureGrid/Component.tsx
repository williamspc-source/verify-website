import React from 'react'

import type { FeatureGridBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const FeatureGridBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  background,
  columns,
  cardStyle,
  items,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  hoverEffect,
  shadow,
  bare,
}) => {
  if (!items || items.length === 0) return null
  const cols = Number(columns) || 3

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-feature-grid', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      hoverEffect={hoverEffect}
      shadow={shadow}
      bare={bare}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />

      <div
        className="services-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              'service-card vf-card',
              // 'Plain (no border)' was stored and ignored — the bordered card
              // rendered either way.
              cardStyle === 'plain' && 'vf-card--plain',
              toClassName(elementClasses?.card),
            )}
          >
            {item.icon ? (
              <div className="service-icon vf-card__icon">
                <Icon name={item.icon} />
              </div>
            ) : null}
            <h3 className="service-title vf-card__title">
              {item.title}
              {item.titleSuffix ? (
                <span className="vf-card__title-suffix"> {item.titleSuffix}</span>
              ) : null}
            </h3>
            {item.description ? <p className="service-desc">{item.description}</p> : null}
            {Array.isArray(item.bullets) && item.bullets.length > 0 ? (
              <ul className="vf-feature-bullets">
                {item.bullets.map((b, j) => (
                  <li key={j}>{b.text}</li>
                ))}
              </ul>
            ) : null}
            {item.detailsLabel || (Array.isArray(item.details) && item.details.length > 0) ? (
              <div className="vf-feature-details">
                {item.detailsLabel ? (
                  <div className="vf-feature-details__label">{item.detailsLabel}</div>
                ) : null}
                {Array.isArray(item.details)
                  ? item.details.map((d, j) => (
                      <div key={j} className="vf-feature-detail">
                        {d.icon ? <Icon name={d.icon} className="size-5" /> : null}
                        <div>
                          <strong>{d.title}</strong>
                          {d.description ? <p>{d.description}</p> : null}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  )
}
