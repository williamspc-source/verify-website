import { cn } from '@/utilities/ui'
import React from 'react'

type SectionHeaderProps = {
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  align?: 'left' | 'center' | null
  showDivider?: boolean | null
  /** Set true on dark/primary backgrounds to flip text colours. */
  onDark?: boolean
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  titleClassName?: string
}

/**
 * Shared section heading using the ported design-reference classes
 * (`section-label` / `section-title` / `divider` / `section-subtitle`).
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  showDivider = false,
  onDark = false,
  as: Heading = 'h2',
  className,
  titleClassName,
}) => {
  if (!eyebrow && !title && !subtitle) return null
  const centered = align === 'center'

  return (
    <div
      className={cn('vf-section-header', centered && 'text-center', className)}
      style={centered ? { marginInline: 'auto', maxWidth: '720px' } : undefined}
    >
      {eyebrow ? (
        <p
          className="vf-section-header__eyebrow section-label"
          style={onDark ? { color: '#8bb9dd' } : undefined}
        >
          {eyebrow}
        </p>
      ) : null}

      {showDivider && centered ? (
        <div className="divider" style={{ marginInline: 'auto' }} />
      ) : null}

      {title ? (
        <Heading
          className={cn('vf-section-header__title section-title', titleClassName)}
          style={onDark ? { color: '#fff' } : undefined}
        >
          {title}
        </Heading>
      ) : null}

      {subtitle ? (
        <p
          className="vf-section-header__subtitle section-subtitle"
          style={
            centered
              ? { marginInline: 'auto', ...(onDark ? { color: 'rgba(255,255,255,.75)' } : {}) }
              : onDark
                ? { color: 'rgba(255,255,255,.75)' }
                : undefined
          }
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
