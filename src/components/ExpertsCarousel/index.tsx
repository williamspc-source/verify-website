'use client'
import React, { useState } from 'react'

import { ExpertCard, type PersonCardData } from '@/components/PersonCard'
import { cn } from '@/utilities/ui'
import { usePrefersReducedMotion } from '@/utilities/usePrefersReducedMotion'

type Direction = 'left' | 'right'

/**
 * Faithful port of the design reference's `.experts-carousel` — an infinite
 * auto-scrolling marquee of expert cards. The track renders the cards twice
 * (the second pass aria-hidden/non-focusable) so the 30s `translateX(-50%)`
 * keyframe loops seamlessly. Pause-on-hover is pure CSS; the arrows toggle
 * scroll direction. Respects `prefers-reduced-motion` (no animation).
 */
export const ExpertsCarousel: React.FC<{
  cards: PersonCardData[]
  speed?: number | null
  startDirection?: Direction | null
  showArrows?: boolean | null
  className?: string
  cardClassName?: string
}> = ({ cards, speed, startDirection = 'left', showArrows = true, className, cardClassName }) => {
  const [direction, setDirection] = useState<Direction>(startDirection || 'left')

  // `is-ready` is what starts the CSS marquee. Derived from the live media query
  // rather than latched once on mount, so toggling "Reduce motion" in system
  // settings now stops and restarts the animation without a reload.
  const ready = !usePrefersReducedMotion()

  if (!cards || cards.length === 0) return null
  const duration = `${speed || 30}s`

  return (
    <div
      className={cn('experts-carousel vf-carousel', ready && 'is-ready', className)}
      data-direction={direction}
    >
      {showArrows ? (
        <button
          type="button"
          className="experts-carousel-control experts-carousel-control--prev vf-carousel__arrow vf-carousel__arrow--prev"
          aria-label="Scroll specialists right"
          aria-pressed={direction === 'right'}
          onClick={() => setDirection('right')}
        >
          <span aria-hidden>‹</span>
        </button>
      ) : null}

      <div className="experts-carousel-viewport vf-carousel__viewport">
        <div className="experts-grid vf-carousel__track" style={{ animationDuration: duration }}>
          {cards.map((c, i) => (
            <ExpertCard key={`a-${i}`} {...c} className={cardClassName} />
          ))}
          {cards.map((c, i) => (
            <ExpertCard key={`b-${i}`} {...c} className={cardClassName} ariaHidden tabIndex={-1} />
          ))}
        </div>
      </div>

      {showArrows ? (
        <button
          type="button"
          className="experts-carousel-control experts-carousel-control--next vf-carousel__arrow vf-carousel__arrow--next"
          aria-label="Scroll specialists left"
          aria-pressed={direction === 'left'}
          onClick={() => setDirection('left')}
        >
          <span aria-hidden>›</span>
        </button>
      ) : null}
    </div>
  )
}
