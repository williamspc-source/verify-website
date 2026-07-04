import React from 'react'

import type { ProcessStepsBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const ProcessStepsBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  background,
  columns,
  steps,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  hoverEffect,
  bare,
}) => {
  if (!steps || steps.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-process-steps', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      hoverEffect={hoverEffect}
      bare={bare}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />

      <div className="vf-process" style={{ '--vf-cols': Number(columns) || 3 } as React.CSSProperties}>
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn('vf-process-step vf-process-steps__step', toClassName(elementClasses?.card))}
          >
            <div className="vf-process-step-num vf-process-steps__number">
              {String(i + 1).padStart(2, '0')}
            </div>
            {step.icon ? (
              <div className="vf-process-step-icon vf-card__icon">
                <Icon name={step.icon} />
              </div>
            ) : null}
            {step.badge ? <span className="vf-process-step-badge">{step.badge}</span> : null}
            {step.title ? <h4 className="vf-card__title">{step.title}</h4> : null}
            {step.description ? <p>{step.description}</p> : null}
            {Array.isArray(step.bullets) && step.bullets.length > 0 ? (
              <ul className="vf-process-step-bullets">
                {step.bullets.map((b, j) => (
                  <li key={j}>{b.text}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  )
}
