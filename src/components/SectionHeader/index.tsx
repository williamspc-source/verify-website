import { cn } from '@/utilities/ui'
import { accentText } from '@/utilities/accentText'
import React from 'react'

type SectionHeaderProps = {
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  align?: 'left' | 'center' | null
  showDivider?: boolean | null
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  titleClassName?: string
}

/**
 * Shared section heading using the ported design-reference classes
 * (`section-label` / `section-title` / `divider` / `section-subtitle`).
 *
 * There is deliberately no `onDark` prop. Dark and primary Sections already
 * carry `.vf-on-dark` (see `components/Section`), and globals.css re-points the
 * text tokens from there — so the colours flip on their own. This component used
 * to hardcode `#8bb9dd` / `#fff` / `rgba(255,255,255,.75)` inline, which
 * outranked those rules and meant the four "on dark" colour fields in Site
 * Settings had no effect on any section header anywhere on the site.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  showDivider = false,
  as: Heading = 'h2',
  className,
  titleClassName,
}) => {
  if (!eyebrow && !title && !subtitle) return null
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'vf-section-header',
        centered && 'text-center vf-section-header--centered',
        className,
      )}
    >
      {eyebrow ? <p className="vf-section-header__eyebrow section-label">{eyebrow}</p> : null}

      {showDivider && centered ? <div className="divider" /> : null}

      {title ? (
        <Heading className={cn('vf-section-header__title section-title', titleClassName)}>
          {accentText(title)}
        </Heading>
      ) : null}

      {subtitle ? (
        <p className="vf-section-header__subtitle section-subtitle">{subtitle}</p>
      ) : null}
    </div>
  )
}
