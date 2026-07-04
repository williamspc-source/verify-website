import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { ResourcesGridBlock as Props, Resource } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type CardData = {
  id: string
  icon?: string | null
  title: string
  description?: string | null
  href?: string | null
  ctaLabel: string
  download: boolean
}

// Resolve a resource's target: uploaded file (download) takes priority over an
// external URL. Relationships are objects at depth > 0; guard for numbers/nulls.
const cardFromResource = (r: Resource): CardData => {
  const file = r.file
  let href: string | null = null
  let download = false
  if (file && typeof file === 'object' && file.url) {
    href = file.url
    download = true
  } else if (r.externalUrl) {
    href = r.externalUrl
  }
  return {
    id: String(r.id),
    icon: r.icon,
    title: r.title,
    description: r.description,
    href,
    ctaLabel: r.ctaLabel || 'Download',
    download,
  }
}

const Card: React.FC<CardData> = ({ icon, title, description, href, ctaLabel, download }) => (
  <div className="service-card vf-card vf-resource-card">
    {icon ? (
      <div className="service-icon vf-card__icon">
        <Icon name={icon} />
      </div>
    ) : null}
    <h3 className="service-title vf-card__title">{title}</h3>
    {description ? <p className="service-desc">{description}</p> : null}
    {href ? (
      <div className="vf-resource-card__cta">
        <a
          className="btn btn-outline vf-resource-card__btn"
          href={href}
          {...(download ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          <Icon name={download ? 'download-simple' : 'arrow-right'} />
          {ctaLabel}
        </a>
      </div>
    ) : null}
  </div>
)

export const ResourcesGridBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    source = 'auto',
    audience,
    resourceType,
    resources,
    columns,
    limit,
    cssClass,
    motion,
    containerWidth,
    hoverEffect,
    bare,
  } = props

  const cols = Number(columns) || 3

  let cards: CardData[] = []
  if (source === 'manual') {
    cards = (resources || [])
      .filter((r): r is Resource => typeof r === 'object' && r !== null)
      .map(cardFromResource)
  } else {
    const payload = await getPayload({ config: configPromise })
    const where: Where = {}
    // 'all' means "Everyone" → no audience restriction.
    if (audience && audience !== 'all') where.audience = { equals: audience }
    if (resourceType) where.resourceType = { equals: resourceType }
    const res = await payload.find({
      collection: 'resources',
      depth: 1,
      limit: limit || 12,
      sort: 'order',
      ...(Object.keys(where).length ? { where } : {}),
    })
    cards = res.docs.map(cardFromResource)
  }

  if (cards.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-resources-grid', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      hoverEffect={hoverEffect}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />
      <div className="services-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {cards.map((c) => (
          <Card key={c.id} {...c} />
        ))}
      </div>
    </Section>
  )
}
