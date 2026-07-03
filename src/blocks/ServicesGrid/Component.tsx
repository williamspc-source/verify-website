import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { ServicesGridBlock as Props, Service } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type CardData = { id: string; icon?: string | null; title: string; description?: string | null; href?: string | null }

const Card: React.FC<CardData & { className?: string }> = ({ icon, title, description, href, className }) => {
  const inner = (
    <>
      {icon ? (
        <div className="service-icon vf-card__icon">
          <Icon name={icon} />
        </div>
      ) : null}
      <h3 className="service-title vf-card__title">{title}</h3>
      {description ? <p className="service-desc">{description}</p> : null}
    </>
  )
  return href ? (
    <Link href={href} className={cn('service-card vf-card', className)}>
      {inner}
    </Link>
  ) : (
    <div className={cn('service-card vf-card', className)}>{inner}</div>
  )
}

export const ServicesGridBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    source = 'auto',
    category,
    services,
    columns,
    limit,
    linkToService,
    servicePathPrefix,
    cssClass,
    elementClasses,
    motion,
    containerWidth,
    hoverEffect,
    bare,
  } = props

  const cols = Number(columns) || 3
  const prefix = (servicePathPrefix || '/services').replace(/\/$/, '')
  const hrefFor = (s: Service) => (linkToService && s.slug ? `${prefix}/${s.slug}` : null)

  let cards: CardData[] = []
  if (source === 'manual') {
    cards = (services || [])
      .filter((s): s is Service => typeof s === 'object')
      .map((s) => ({ id: String(s.id), icon: s.icon, title: s.title, description: s.shortDescription, href: hrefFor(s) }))
  } else {
    const payload = await getPayload({ config: configPromise })
    const where: Where = {}
    if (category) where.category = { equals: category }
    const res = await payload.find({
      collection: 'services',
      depth: 0,
      limit: limit || 12,
      sort: 'order',
      ...(category ? { where } : {}),
    })
    cards = res.docs.map((s) => ({
      id: String(s.id),
      icon: s.icon,
      title: s.title,
      description: s.shortDescription,
      href: hrefFor(s),
    }))
  }

  if (cards.length === 0) return null

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-services-grid', toClassName(cssClass))}
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
      <div className="services-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {cards.map((c) => (
          <Card key={c.id} {...c} className={toClassName(elementClasses?.card)} />
        ))}
      </div>
    </Section>
  )
}
