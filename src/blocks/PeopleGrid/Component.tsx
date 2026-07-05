import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { PeopleGridBlock as Props, Specialist, Team } from '@/payload-types'

import { ExpertsCarousel } from '@/components/ExpertsCarousel'
import { PersonCard, type PersonCardData } from '@/components/PersonCard'
import { CMSLink } from '@/components/Link'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

const DEPARTMENT_LABELS: Record<string, string> = {
  operations: 'Operations',
  'business-development': 'Business Development',
  'client-support': 'Client Support',
  'quality-assurance': 'Quality Assurance',
}
const DEPARTMENT_ORDER = [
  'operations',
  'business-development',
  'client-support',
  'quality-assurance',
]

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

const firstLocationTitle = (locations: Specialist['locations']): string | null => {
  const first = Array.isArray(locations) ? locations[0] : null
  return first && typeof first === 'object' ? (first.title ?? null) : null
}

// Reference expert cards are deliberately simple: photo, name, specialty role.
// No specialty badge overlay on the photo and no qualification/degree pills
// (those live on the full specialist profile, not the panel card).
const specialistToCard = (s: Specialist, linkProfiles: boolean): PersonCardData => ({
  name: s.title,
  position: s.position,
  location: firstLocationTitle(s.locations),
  photoUrl: mediaUrl(s.photo),
  href: linkProfiles && s.slug ? `/specialists/${s.slug}` : null,
})

// Team members render as rectangular photo cards (full-bleed headshot on top,
// name + role beneath) — the design-reference "Meet the Team" treatment.
const teamToCard = (t: Team, linkProfiles: boolean): PersonCardData => ({
  name: t.title,
  position: t.role,
  location: null,
  photoUrl: mediaUrl(t.photo),
  href: linkProfiles && t.slug ? `/about/team/${t.slug}` : null,
  variant: 'rect',
})

export const PeopleGridBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    source = 'specialists',
    onlyAdvertised,
    featuredOnly,
    specialty,
    location,
    department,
    groupByDepartment,
    people,
    layout,
    limit,
    linkProfiles,
    footerLinks,
    cssClass,
    elementClasses,
    motion,
    containerWidth,
    hoverEffect,
    carouselOptions,
    bare,
  } = props
  const cardClass = toClassName(elementClasses?.card)
  const co = carouselOptions || {}
  const lim = limit === 0 ? 0 : limit || undefined

  const payload = await getPayload({ config: configPromise })
  const cards: PersonCardData[] = []
  let groups: { label: string; cards: PersonCardData[] }[] | null = null

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
      limit: groupByDepartment ? 0 : (lim ?? 12),
      sort: 'order',
      where,
    })
    if (groupByDepartment) {
      const byDept = new Map<string, PersonCardData[]>()
      res.docs.forEach((t) => {
        const d = t.department || 'operations'
        const list = byDept.get(d) ?? []
        list.push(teamToCard(t, Boolean(linkProfiles)))
        byDept.set(d, list)
      })
      groups = DEPARTMENT_ORDER.filter((d) => byDept.has(d)).map((d) => ({
        label: DEPARTMENT_LABELS[d] || d,
        cards: byDept.get(d) as PersonCardData[],
      }))
      groups.forEach((g) => cards.push(...g.cards))
    } else {
      res.docs.forEach((t) => cards.push(teamToCard(t, Boolean(linkProfiles))))
    }
  } else {
    const and: Where[] = []
    if (onlyAdvertised) and.push({ advertise: { equals: true } })
    if (featuredOnly) and.push({ featured: { equals: true } })
    if (specialty) and.push({ specialty: { equals: typeof specialty === 'object' ? specialty.id : specialty } })
    if (location) and.push({ locations: { equals: typeof location === 'object' ? location.id : location } })
    const res = await payload.find({
      collection: 'specialists',
      depth: 1,
      limit: lim ?? 8,
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
      bare={bare}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />

      {groups ? (
        <div className="vf-people-grid__groups">
          {groups.map((g) => (
            <div key={g.label} className="vf-people-grid__group">
              <div className="vf-people-grid__group-label divider-label">{g.label}</div>
              <div className="spec-grid">
                {g.cards.map((c, i) => (
                  <PersonCard key={i} {...c} className={cardClass} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : layout === 'carousel' ? (
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

      {Array.isArray(footerLinks) && footerLinks.length > 0 ? (
        <div className="vf-people-grid__footer experts-cta">
          {footerLinks.map(({ link }, i) => (
            <CMSLink key={i} {...link} className={cn('btn', i === 0 ? 'btn-primary' : 'btn-outline')} />
          ))}
        </div>
      ) : null}
    </Section>
  )
}
