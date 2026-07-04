import React from 'react'

import type { PortalCtaBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { Section } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

// Dark-blue "Online Booking Portal" CTA band (design reference `.portal-opt4`).
// Always the branded gradient band — the `background="primary"` fallback keeps it
// dark even if the ported `.portal-opt4` CSS ever failed to load. Works full-width
// and nested inside a Row column (via `bare`).
export const PortalCtaBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  tiles,
  links,
  anchorId,
  cssClass,
  bare,
}) => {
  const hasTiles = Array.isArray(tiles) && tiles.length > 0
  const hasLinks = Array.isArray(links) && links.length > 0
  if (!eyebrow && !heading && !subheading && !hasTiles && !hasLinks) return null

  return (
    <Section
      background="primary"
      className={cn('portal-opt4', toClassName(cssClass))}
      id={anchorId || undefined}
      bare={bare}
    >
      <div className="portal-opt4-inner">
        {eyebrow || heading ? (
          <div className="portal-opt4-header">
            {eyebrow ? <div className="portal-opt4-eyebrow">{eyebrow}</div> : null}
            {heading ? <h2 className="opt-heading">{accentText(heading)}</h2> : null}
          </div>
        ) : null}

        {subheading ? <p className="opt-sub">{subheading}</p> : null}

        {hasTiles ? (
          <div className="portal-opt4-tiles">
            {tiles!.map((tile, i) => (
              <div key={i} className="portal-opt4-tile">
                {tile.icon ? (
                  <Icon name={tile.icon} className="portal-opt4-tile-icon" />
                ) : null}
                {tile.label ? (
                  <div className="portal-opt4-tile-label">{tile.label}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {hasLinks ? (
          <div className="opt-actions">
            {links!.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="inline"
                className={i === 0 ? 'opt-btn-white' : 'opt-btn-outline-white'}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
