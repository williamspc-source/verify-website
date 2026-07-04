import React from 'react'

import type { MissionPillarsBlock as Props } from '@/payload-types'

import { Section, type SectionBackground } from '@/components/Section'
import { accentText } from '@/utilities/accentText'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

// Dark full-bleed mission panel: centered header + a 2-up grid of light-blue
// pillar cards, each auto-numbered 01..NN from its index. All copy is editable.
export const MissionPillarsBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  background,
  pillars,
  containerWidth,
  motion,
  cssClass,
  anchorId,
  bare,
}) => {
  const hasPillars = Array.isArray(pillars) && pillars.length > 0
  if (!hasPillars && !eyebrow && !heading && !subheading) return null

  return (
    <Section
      background={(background as SectionBackground) || 'dark'}
      bare={bare}
      className={cn('mv-mission-panel', toClassName(cssClass))}
      containerWidth={containerWidth}
      motion={motion}
      id={anchorId || undefined}
    >
      {eyebrow || heading || subheading ? (
        <div className="mv-mission-header">
          {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
          {heading ? <h2 className="section-title">{accentText(heading)}</h2> : null}
          {subheading ? <p className="mv-mission-statement">{subheading}</p> : null}
        </div>
      ) : null}

      {hasPillars ? (
        <div className="mv-pillars">
          {pillars!.map((pillar, i) => (
            <div key={i} className="mv-pillar">
              <div className="mv-pillar-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="mv-pillar-text">{pillar.text}</div>
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  )
}
