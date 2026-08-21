import { InlineRichText } from '@/components/RichText/Inline'
import React from 'react'

import type { BookingChooserBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { Section } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import {
  applyRegistrationHref,
  getRegistrationEnquiryHref,
  hasRegistrationLink,
} from '@/utilities/registrationEnquiry'

// accent value → design-reference panel modifier class.
const accentClass: Record<string, string> = {
  blue: 'booking-half--light',
  dark: 'booking-half--dark',
}

export const BookingChooserBlock: React.FC<Props & { bare?: boolean }> = async ({
  anchorId,
  halves,
  cssClass,
  bare,
}) => {
  if (!Array.isArray(halves) || halves.length === 0) return null

  // Read once for the whole block, then applied per panel below: awaiting inside
  // the halves map would hand React an array of promises. Skipped entirely when
  // no panel uses a registration link.
  const registrationHref = halves.some((half) => hasRegistrationLink(half?.links))
    ? await getRegistrationEnquiryHref()
    : null

  return (
    <Section
      container={false}
      id={anchorId || undefined}
      className={cn('booking-section', toClassName(cssClass))}
      bare={bare}
    >
      <div className="booking-split">
        {halves.map((half, i) => {
          const modifier = accentClass[half?.accent || 'blue'] || accentClass.blue
          const links = applyRegistrationHref(
            Array.isArray(half?.links) ? half.links : [],
            registrationHref,
          )
          const hasContent =
            half?.icon || half?.eyebrow || half?.title || half?.description || links.length > 0
          if (!hasContent) return null

          return (
            <div key={i} className={cn('booking-half', modifier)}>
              {half.icon ? (
                <span className="booking-half-watermark" aria-hidden="true">
                  <Icon name={half.icon} />
                </span>
              ) : null}

              <div className="booking-half-inner">
                {half.icon ? (
                  <span className="booking-half-icon" aria-hidden="true">
                    <Icon name={half.icon} />
                  </span>
                ) : null}

                <InlineRichText as="div" className="booking-half-eyebrow" data={half.eyebrow} />

                <InlineRichText as="h2" data={half.title} />

                <InlineRichText as="p" className="booking-half-sub" data={half.description} />

                {links.length > 0 ? (
                  <div className="booking-half-actions">
                    {links.map(({ link }, j) => {
                      // Render the link's icon AS A TRAILING ARROW (via children),
                      // matching the design's `.booking-half-cta i` — so strip it
                      // from the props passed to CMSLink (which renders icons leading).
                      const { icon, ...rest } = link || {}
                      return (
                        <CMSLink
                          key={j}
                          {...rest}
                          appearance="inline"
                          className={cn(
                            'booking-half-cta',
                            j > 0 && 'booking-half-cta--outline',
                          )}
                        >
                          {icon ? <Icon name={icon} /> : null}
                        </CMSLink>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
