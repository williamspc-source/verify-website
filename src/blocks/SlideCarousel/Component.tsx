'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

import type { SlideCarouselBlock as Props } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText, stripAccent } from '@/utilities/accentText'

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

type Slide = NonNullable<Props['slides']>[number]

const Card: React.FC<{ slide: Slide; label: string; hidden?: boolean; className?: string }> = ({
  slide,
  label,
  hidden,
  className,
}) => {
  const img = mediaUrl(slide.image)
  const pills = (slide.pills || []).filter((p) => p.text)
  return (
    <article
      className={cn('events-offer-card', `offer-${slide.accent || 'seminars'}`, className)}
      aria-hidden={hidden || undefined}
    >
      <div className="events-offer-card-copy">
        <span className="events-offer-slide-label">{label}</span>
        <h3>{slide.title}</h3>
        {slide.body ? <p>{slide.body}</p> : null}
        {pills.length > 0 ? (
          <div className="events-offer-pills">
            {pills.map((p, j) => (
              <span key={j}>{p.text}</span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="events-offer-visual" aria-hidden>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" />
        ) : null}
        {slide.visualLabel ? <span>{slide.visualLabel}</span> : null}
      </div>
    </article>
  )
}

// Faithful port of the design reference's `.events-offer-*` slide carousel:
// one full-width slide at a time, prev/next arrows, dot indicators, a Pause/Play
// toggle, autoplay, pause on hover/focus, and arrow-key nav.
//
// Seamless infinite loop: the track is [cloneOfLast, ...slides, cloneOfFirst];
// real slide k sits at track position k+1. Advancing past the last slide glides
// forward onto the leading clone, then snaps back (no transition) to the real
// first slide — so it always loops forward, never reverses.
export const SlideCarouselBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  autoplay = true,
  interval,
  slides,
  cssClass,
  elementClasses,
}) => {
  // All three Element styles slots were mounted by the shared helper and never
  // read here, so every preset an editor picked for this block was discarded.
  const headingClass = toClassName(elementClasses?.heading)
  const cardClass = toClassName(elementClasses?.card)
  const buttonClass = toClassName(elementClasses?.button)
  const count = slides?.length || 0
  const looped = count > 1
  const base = looped ? 1 : 0 // track position of the first real slide
  const [pos, setPos] = useState(base) // current track position
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false) // manual Pause/Play
  const [hovering, setHovering] = useState(false) // hover/focus pause
  const tick = (interval ?? 5800) || 5800

  const active = looped ? (pos - 1 + count) % count : pos // real slide index (for dots)

  const step = useCallback((dir: 1 | -1) => {
    setAnimate(true)
    setPos((p) => p + dir)
  }, [])

  const goTo = useCallback((realIndex: number) => {
    setAnimate(true)
    setPos(realIndex + (count > 1 ? 1 : 0))
  }, [count])

  // After a no-transition snap, re-enable the transition on the next frame so the
  // following slide animates again.
  useEffect(() => {
    if (animate) return
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
    return () => cancelAnimationFrame(raf)
  }, [animate])

  useEffect(() => {
    if (!autoplay || paused || hovering || count <= 1) return
    const id = window.setInterval(() => {
      setAnimate(true)
      setPos((p) => p + 1)
    }, tick)
    return () => window.clearInterval(id)
  }, [autoplay, paused, hovering, count, tick])

  // When we land on a clone, jump (without animation) to the matching real slide.
  const onTransitionEnd = () => {
    if (!looped) return
    if (pos === count + 1) {
      setAnimate(false)
      setPos(1)
    } else if (pos === 0) {
      setAnimate(false)
      setPos(count)
    }
  }

  if (!slides || count === 0) return null

  // Build the rendered track (with leading/trailing clones when looping).
  const trackSlides: { slide: Slide; key: string; hidden: boolean; realIndex: number }[] = looped
    ? [
        { slide: slides[count - 1], key: 'clone-last', hidden: true, realIndex: count - 1 },
        ...slides.map((slide, i) => ({ slide, key: `s-${i}`, hidden: i !== active, realIndex: i })),
        { slide: slides[0], key: 'clone-first', hidden: true, realIndex: 0 },
      ]
    : slides.map((slide, i) => ({ slide, key: `s-${i}`, hidden: i !== active, realIndex: i }))

  return (
    <section
      aria-label={stripAccent(heading) || 'Carousel'}
      className={cn('events-offer-stage vf-slide-carousel', toClassName(cssClass))}
      data-offer-carousel
    >
      <div className="events-offer-shell">
        <div className="events-offer-toolbar vf-slide-carousel__toolbar">
          <div>
            {eyebrow ? <div className="events-offer-eyebrow">{eyebrow}</div> : null}
            {heading ? <h2 className={headingClass || undefined}>{accentText(heading)}</h2> : null}
          </div>
          {autoplay && count > 1 ? (
            <button
              type="button"
              className={cn('events-offer-toggle vf-slide-carousel__toggle', buttonClass)}
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? 'Play' : 'Pause'}
            </button>
          ) : null}
        </div>

        <div
          className="events-offer-carousel vf-slide-carousel__viewport"
          aria-roledescription="carousel"
          tabIndex={0}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              step(-1)
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              step(1)
            }
          }}
        >
          <div
            className="events-offer-track vf-slide-carousel__track"
            style={{
              transform: `translateX(-${pos * 100}%)`,
              transition: animate ? undefined : 'none',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {trackSlides.map((t) => (
              <Card
                key={t.key}
                slide={t.slide}
                hidden={t.hidden}
                label={`${String(t.realIndex + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`}
                className={cardClass}
              />
            ))}
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                className={cn('events-offer-arrow events-offer-arrow-prev vf-slide-carousel__arrow', buttonClass)}
                aria-label="Previous slide"
                onClick={() => step(-1)}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className={cn('events-offer-arrow events-offer-arrow-next vf-slide-carousel__arrow', buttonClass)}
                aria-label="Next slide"
                onClick={() => step(1)}
              >
                <ChevronRight />
              </button>
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="events-offer-dots vf-slide-carousel__dots" aria-label="Select slide">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(i === active && 'is-active')}
                aria-label={`Show slide ${i + 1}`}
                aria-pressed={i === active}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
