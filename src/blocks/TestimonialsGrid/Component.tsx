import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { TestimonialsGridBlock as Props, Testimonial } from '@/payload-types'

import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { TestimonialsClient, type TestimonialCard } from './TestimonialsClient'

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

const Card: React.FC<{ t: Testimonial; className?: string }> = ({ t, className }) => {
  const rating = Math.max(0, Math.min(5, t.rating ?? 5))
  const avatar = mediaUrl(t.avatar)
  return (
    <div className={cn('testimonial-card vf-card', className)}>
      {rating > 0 ? <div className="stars">{'★'.repeat(rating)}</div> : null}
      <div className="testimonial-quote" aria-hidden="true">
        &ldquo;
      </div>
      <div className="testimonial-text">{t.quote}</div>
      <div className="testimonial-author">
        <div className="testimonial-avatar">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={t.authorName || t.authorRole} />
          ) : (
            <span aria-hidden="true">👤</span>
          )}
        </div>
        <div>
          {t.authorName ? <div className="testimonial-name">{t.authorName}</div> : null}
          <div className="testimonial-role">{t.authorRole}</div>
        </div>
      </div>
    </div>
  )
}

export const TestimonialsGridBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    source = 'auto',
    featuredOnly,
    testimonials,
    columns,
    limit,
    layout,
    carouselOptions,
    cssClass,
    elementClasses,
    motion,
    containerWidth,
    hoverEffect,
    bare,
  } = props

  const cols = Number(columns) || 3
  let docs: Testimonial[] = []

  if (source === 'manual') {
    docs = (testimonials || []).filter((t): t is Testimonial => typeof t === 'object')
  } else {
    const payload = await getPayload({ config: configPromise })
    const where: Where = {}
    if (featuredOnly) where.featured = { equals: true }
    const res = await payload.find({
      collection: 'testimonials',
      depth: 1,
      limit: limit || 6,
      sort: 'order',
      ...(featuredOnly ? { where } : {}),
    })
    docs = res.docs
  }

  if (docs.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-testimonials-grid', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      hoverEffect={hoverEffect}
      bare={bare}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />
      {layout === 'carousel' ? (
        <TestimonialsClient
          cards={docs.map(
            (t): TestimonialCard => ({
              rating: Math.max(0, Math.min(5, t.rating ?? 5)),
              quote: t.quote,
              position: t.authorRole,
              orgLoc: t.org || null,
              name: t.authorName || null,
              avatar: mediaUrl(t.avatar),
            }),
          )}
          visible={(carouselOptions as { visible?: number } | undefined)?.visible || cols}
          showArrows={(carouselOptions as { showArrows?: boolean } | undefined)?.showArrows ?? true}
        />
      ) : (
        <div
          className="testimonials-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {docs.map((t, i) => (
            <Card key={i} t={t} className={toClassName(elementClasses?.card)} />
          ))}
        </div>
      )}
    </Section>
  )
}
