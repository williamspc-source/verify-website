import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { PeopleGridBlock as Props, Specialist, Team } from '@/payload-types'

import { ExpertsCarousel } from '@/components/ExpertsCarousel'
import { PersonCard, type PersonCardData } from '@/components/PersonCard'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

const DEPARTMENT_LABELS: Record<string, string> = {
  operations: 'Operations',
  'business-development': 'Business Development',
  'reception-bookings': 'Reception & Bookings',
  'quality-assurance': 'Quality Assurance',
}

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

const specialistToCard = (s: Specialist, linkProfiles: boolean): PersonCardData => ({
  name: s.title,
  position: s.position,
  location: s.locations?.[0]?.location ?? null,
  badge: typeof s.specialty === 'object' && s.specialty ? s.specialty.title : null,
  photoUrl: mediaUrl(s.photo),
  href: linkProfiles && s.slug ? `/specialists/${s.slug}` : null,
  tags: (s.qualifications || [])
    .map((q) => q.qualification)
    .filter((q): q is string => Boolean(q))
    .slice(0, 3),
})

const teamToCard = (t: Team, linkProfiles: boolean): PersonCardData => ({
  name: t.title,
  position: t.role,
  location: null,
  badge: t.department ? DEPARTMENT_LABELS[t.department] : null,
  photoUrl: mediaUrl(t.photo),
  href: linkProfiles && t.slug ? `/about/meet-the-team/${t.slug}` : null,
})

export const PeopleGridBlock: React.FC<Props> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    source = 'specialists',
    onlyAdvertised,
    featuredOnly,
    specialty,
    department,
    people,
    layout,
    limit,
    linkProfiles,
    cssClass,
    elementClasses,
    motion,
    containerWidth,
    hoverEffect,
    carouselOptions,
  } = props
  const cardClass = toClassName(elementClasses?.card)
  const co = carouselOptions || {}

  const payload = await getPayload({ config: configPromise })
  const cards: PersonCardData[] = []

  if (source === 'manual') {
    for (const rel of people || []) {
      if (typeof rel.value !== 'object') continue
      if (rel.relationTo === 'specialists') {
        cards.push(specialistToCard(rel.value as Specialist, Boolean(linkProfiles)))
      } else if (rel.relationTo === 'team') {
        cards.push(teamToCard(rel.value as Team, Boolean(linkProfiles)))
      }
    }
  } else if (source === 'team') {
    const where: Where = {}
    if (department) where.department = { equals: department }
    const res = await payload.find({
      collection: 'team',
      depth: 1,
      limit: limit || 12,
      sort: 'order',
      where,
    })
    res.docs.forEach((t) => cards.push(teamToCard(t, Boolean(linkProfiles))))
  } else {
    const and: Where[] = []
    if (onlyAdvertised) and.push({ advertise: { equals: true } })
    if (featuredOnly) and.push({ featured: { equals: true } })
    if (specialty) and.push({ specialty: { equals: typeof specialty === 'object' ? specialty.id : specialty } })
    const res = await payload.find({
      collection: 'specialists',
      depth: 1,
      limit: limit || 8,
      ...(and.length ? { where: { and } } : {}),
    })
    res.docs.forEach((s) => cards.push(specialistToCard(s, Boolean(linkProfiles))))
  }

  if (cards.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-people-grid', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      hoverEffect={hoverEffect}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />

      {layout === 'carousel' ? (
        <ExpertsCarousel
          cards={cards}
          speed={co.speed}
          startDirection={co.direction === 'right' ? 'right' : 'left'}
          showArrows={co.showArrows ?? true}
          cardClassName={cardClass}
        />
      ) : (
        <div className="spec-grid">
          {cards.map((c, i) => (
            <PersonCard key={i} {...c} className={cardClass} />
          ))}
        </div>
      )}
    </Section>
  )
}
