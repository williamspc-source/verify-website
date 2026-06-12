import { cn } from '@/utilities/ui'
import React from 'react'

export type SectionBackground = 'white' | 'muted' | 'accent' | 'primary'

// Background → design section banding (defined in globals.css as `.vf-section--*`).
// Mirrors the design reference: white, grey, light-blue gradient, dark-blue gradient.
const bgClasses: Record<SectionBackground, string> = {
  white: 'vf-section--white',
  muted: 'vf-section--muted',
  accent: 'vf-section--accent',
  primary: 'vf-section--primary',
}

const widthClasses: Record<string, string> = {
  normal: 'container',
  narrow: 'container content-narrow',
  wide: 'container max-w-[88rem]',
  full: 'w-full',
}

const motionClass = (motion?: string | null): string | undefined => {
  if (!motion || motion === 'none') return undefined
  if (motion === 'fade-up') return 'vf-motion vf-motion--fade-up'
  if (motion === 'zoom-in') return 'vf-motion vf-motion--zoom-in'
  return 'vf-motion' // fade-in
}

type SectionProps = {
  background?: SectionBackground | null
  /** Wrap children in the standard container. Set false for full-bleed content. */
  container?: boolean
  containerWidth?: string | null
  motion?: string | null
  hoverEffect?: string | null
  className?: string
  innerClassName?: string
  id?: string
  children: React.ReactNode
}

/**
 * Standard section wrapper — consistent vertical rhythm, background variants,
 * optional scroll-reveal motion and card hover treatment, plus the stable
 * `vf-section` style hook. All blocks render through this.
 */
export const Section: React.FC<SectionProps> = ({
  background = 'white',
  container = true,
  containerWidth = 'normal',
  motion = 'none',
  hoverEffect,
  className,
  innerClassName,
  id,
  children,
}) => {
  const hasMotion = Boolean(motion && motion !== 'none')
  const hoverClass = hoverEffect && hoverEffect !== 'none' ? `vf-hover-${hoverEffect}` : undefined

  return (
    <section
      id={id}
      data-vf-motion={hasMotion ? '' : undefined}
      className={cn(
        'vf-section',
        bgClasses[background || 'white'],
        motionClass(motion),
        hoverClass,
        className,
      )}
    >
      {container ? (
        <div className={cn('vf-section__inner', widthClasses[containerWidth || 'normal'], innerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
