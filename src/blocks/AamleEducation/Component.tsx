import React from 'react'

import type { AamleEducationBlock as Props } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

export const AamleEducationBlock: React.FC<Props & { bare?: boolean }> = ({
  background,
  intro,
  panels,
  sponsor,
  link,
  anchorId,
  cssClass,
  containerWidth,
  motion,
  bare,
}) => {
  const hasIntro = Boolean(intro?.label || intro?.heading || intro?.description)
  const hasPanels = Array.isArray(panels) && panels.length > 0
  const hasSponsor = Boolean(sponsor?.label || sponsor?.description || sponsor?.icon)
  const hasCta = Boolean(link?.label)

  if (!hasIntro && !hasPanels && !hasSponsor && !hasCta) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('aamle-edu', toClassName(cssClass))}
      containerWidth={containerWidth}
      motion={motion}
      bare={bare}
      id={anchorId || undefined}
    >
      {hasIntro ? (
        <div className="aamle-edu-intro">
          <div className="aamle-edu-intro-left">
            {intro?.label ? <span className="aamle-edu-intro-label">{intro.label}</span> : null}
            {intro?.heading ? (
              <h3 className="aamle-edu-intro-heading">{accentText(intro.heading)}</h3>
            ) : null}
          </div>
          <div className="aamle-edu-intro-right">
            {intro?.description ? (
              <RichText
                className="aamle-rich aamle-edu-intro-rich"
                data={intro.description}
                enableGutter={false}
                enableProse={false}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {hasPanels ? (
        <div className="aamle-feature-panels">
          {panels!.map((panel, i) => {
            const list = Array.isArray(panel.list) ? panel.list : []
            return (
              <div key={i} className="aamle-feature-panel">
                <div className="aamle-feature-panel-left">
                  {panel.step ? (
                    <span className="aamle-feature-panel-step">{panel.step}</span>
                  ) : null}
                  {panel.icon ? (
                    <div className="aamle-feature-panel-icon">
                      <Icon name={panel.icon} />
                    </div>
                  ) : null}
                  {panel.title ? (
                    <h4 className="aamle-feature-panel-title">{panel.title}</h4>
                  ) : null}
                  {panel.badge ? (
                    <span
                      className={cn(
                        'aamle-feature-panel-badge',
                        panel.badgeAccent && 'aamle-feature-panel-badge--accent',
                      )}
                    >
                      {panel.badge}
                    </span>
                  ) : null}
                </div>
                <div className="aamle-feature-panel-right">
                  {panel.description ? (
                    <RichText
                      className="aamle-rich aamle-feature-panel-rich"
                      data={panel.description}
                      enableGutter={false}
                      enableProse={false}
                    />
                  ) : null}
                  {list.length > 0 ? (
                    <ul className="aamle-feature-panel-list">
                      {list.map((li, j) => (
                        <li key={j}>{li.item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {hasSponsor ? (
        <div className="aamle-sponsor-soft">
          <div className="aamle-sponsor-soft-left">
            {sponsor?.icon ? (
              <div className="aamle-sponsor-soft-icon-wrap">
                <Icon name={sponsor.icon} />
              </div>
            ) : null}
            <div className="aamle-sponsor-soft-body">
              {sponsor?.label ? (
                <span className="aamle-sponsor-soft-label">{sponsor.label}</span>
              ) : null}
              {sponsor?.description ? (
                <p className="aamle-sponsor-soft-desc">{sponsor.description}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {hasCta ? (
        <div className="services-cta edu-cta-row">
          <CMSLink {...link} appearance="inline" className="btn btn-primary" />
        </div>
      ) : null}
    </Section>
  )
}
