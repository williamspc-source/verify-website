import React from 'react'

import type { LeadershipSpotlightBlock as Props } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { Section, type SectionBackground } from '@/components/Section'
import { accentText } from '@/utilities/accentText'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const LeadershipSpotlightBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  background,
  photo,
  placeholderIcon,
  name,
  role,
  badge,
  tagline,
  body,
  credentials,
  link,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  anchorId,
  bare,
}) => {
  const creds = Array.isArray(credentials) ? credentials.filter((c) => c?.cred) : []
  const hasPhoto = Boolean(photo && typeof photo === 'object')
  const hasBadge = Boolean(name || role || badge)
  const hasLink = Boolean(link && link.label)
  const hasContent =
    eyebrow || heading || subheading || tagline || body || creds.length > 0 || hasLink || hasBadge

  if (!hasContent && !hasPhoto) return null

  return (
    <Section
      id={anchorId || undefined}
      background={(background as SectionBackground) || 'muted'}
      className={cn('leadership', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      bare={bare}
    >
      <div className="leadership-grid">
        <div className="leadership-image-wrap">
          {hasPhoto ? (
            <div className="leader-img-main leader-img-photo">
              <Media resource={photo} htmlElement={null} fill imgClassName="leadership-photo-img" />
            </div>
          ) : (
            <div className="img-placeholder leader-img-main">
              <Icon name={placeholderIcon || 'user-circle'} className="img-placeholder-icon" />
              {name ? `${name} Photo` : 'Founder Photo Placeholder'}
            </div>
          )}

          {hasBadge ? (
            <div className="leader-badge">
              {badge ? <em className="leader-badge-tag">{badge}</em> : null}
              {name}
              {role ? <span>{role}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="leadership-content">
          {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
          {heading ? (
            <h2 className={cn('section-title', toClassName(elementClasses?.heading))}>
              {accentText(heading)}
            </h2>
          ) : null}
          {subheading ? <p className="leadership-subheading">{subheading}</p> : null}
          {tagline ? <div className="leadership-tagline">{tagline}</div> : null}
          {body ? <RichText data={body} enableGutter={false} enableProse={false} /> : null}
          {creds.length > 0 ? (
            <div className="leader-credentials">
              {creds.map((c, i) => (
                <span key={i} className="leader-cred">
                  {c.cred}
                </span>
              ))}
            </div>
          ) : null}
          {hasLink ? (
            <CMSLink
              {...link}
              appearance="inline"
              className={cn('btn btn-primary', toClassName(elementClasses?.button))}
            />
          ) : null}
        </div>
      </div>
    </Section>
  )
}
