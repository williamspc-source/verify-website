import React from 'react'

import type { FeatureGridBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const FeatureGridBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  background,
  columns,
  items,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  hoverEffect,
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
          <div key={i} className={cn('service-card vf-card', toClassName(elementClasses?.card))}>
            {item.icon ? (
              <div className="service-icon vf-card__icon">
                <Icon name={item.icon} />
              </div>
            ) : null}
            <h3 className="service-title vf-card__title">{item.title}</h3>
            {item.description ? <p className="service-desc">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </Section>
  )
}
