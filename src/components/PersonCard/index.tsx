import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

export type PersonCardData = {
  name: string
  position?: string | null
  location?: string | null
  badge?: string | null
  photoUrl?: string | null
  href?: string | null
  /** Qualification pills shown on the expert (marquee) card. */
  tags?: string[] | null
  className?: string
}

export const initialsOf = (name: string) =>
  name
    .replace(/^(Dr|Adj\.?|Adjunct|Professor|Prof\.?|A\/Prof|Mr|Mrs|Ms|Associate)\.?\s+/gi, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')

// Uses the ported design `.spec-card` treatment (accent bar, monogram avatar,
// hover lift + arrow).
export const PersonCard: React.FC<PersonCardData> = ({
  name,
  position,
  location,
  photoUrl,
  href,
  className,
}) => {
  const inner = (
    <>
      <div
        className="vf-person-card__avatar"
        style={{ width: 104, height: 104, borderRadius: '50%', overflow: 'hidden', marginBottom: 18 }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="avatar-mono">{initialsOf(name)}</div>
        )}
      </div>
      <div className="spec-name vf-card__title">{name}</div>
      {position ? <div className="spec-title">{position}</div> : null}
      {location ? <div className="spec-loc">{location}</div> : null}
      {href ? <span className="spec-more">View profile →</span> : null}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn('spec-card vf-card', className)}>
        {inner}
      </Link>
    )
  }
  return <div className={cn('spec-card vf-card', className)}>{inner}</div>
}

// Faithful port of the design `.expert-card` used in the specialists marquee:
// gradient avatar header (full photo when available, monogram fallback),
// specialty badge, role, and qualification tag pills.
export const ExpertCard: React.FC<
  PersonCardData & { ariaHidden?: boolean; tabIndex?: number }
> = ({ name, position, badge, photoUrl, href, tags, className, ariaHidden, tabIndex }) => {
  const inner = (
    <>
      <div className="expert-avatar vf-person-card__avatar">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span aria-hidden>{initialsOf(name)}</span>
        )}
        {badge ? <div className="expert-specialty-badge">{badge}</div> : null}
      </div>
      <div className="expert-info">
        <div className="expert-name vf-card__title">{name}</div>
        {position ? <div className="expert-role">{position}</div> : null}
        {tags && tags.length > 0 ? (
          <div className="expert-tags">
            {tags.map((t, i) => (
              <span key={i} className="expert-tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )

  const shared = { 'aria-hidden': ariaHidden || undefined, tabIndex }
  if (href) {
    return (
      <Link href={href} className={cn('expert-card vf-card', className)} {...shared}>
        {inner}
      </Link>
    )
  }
  return (
    <div className={cn('expert-card vf-card', className)} {...shared}>
      {inner}
    </div>
  )
}
