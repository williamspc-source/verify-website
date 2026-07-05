import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { CollectionSlug } from 'payload'
import type { SpecialtyGridBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type TileData = { id: string; icon?: string | null; label: string; href?: string | null; className?: string }

const Tile: React.FC<TileData> = ({ icon, label, href, className }) => {
  const inner = (
    <>
      <div className="specialty-card-icon vf-card__icon">
        <Icon name={icon} className="size-6" />
      </div>
      <span className="specialty-card-name vf-card__title">{label}</span>
      {href ? <span className="specialty-card-link">View experts →</span> : null}
    </>
  )
  return href ? (
    <Link href={href} className={cn('specialty-card vf-card', className)}>
      {inner}
    </Link>
  ) : (
    <div className={cn('specialty-card vf-card', className)}>{inner}</div>
  )
}

export const SpecialtyGridBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    source = 'auto',
    taxonomy,
    variant,
    defaultIcon,
    linkToDirectory,
    directoryPath,
    items,
    cssClass,
    elementClasses,
    motion,
    containerWidth,
    hoverEffect,
    bare,
  } = props

  let tiles: TileData[] = []
  if (source === 'manual') {
    tiles = (items || []).map((item, i) => ({
      id: `m-${i}`,
      icon: item.icon,
      label: item.label,
      href: item.link?.url ?? null,
    }))
  } else {
    const collection = (taxonomy || 'specialties') as CollectionSlug
    const payload = await getPayload({ config: configPromise })
    // claim-types & specialties carry an explicit display `order`; other
    // taxonomies fall back to alphabetical.
    const sort = collection === 'claim-types' || collection === 'specialties' ? 'order' : 'title'
    const res = await payload.find({ collection, limit: 100, sort })
    tiles = res.docs.map((s: { id: string | number; title: string; slug?: string | null; icon?: string | null }) => ({
      id: String(s.id),
      icon: s.icon || defaultIcon || 'stethoscope',
      label: s.title,
      href:
        linkToDirectory && s.slug && collection === 'specialties'
          ? `${directoryPath || '/specialists'}?specialty=${s.slug}`
          : null,
    }))
  }

  if (tiles.length === 0) return null

  const isChecklist = variant === 'checklist'

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-specialty-grid', toClassName(cssClass))}
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
      {isChecklist ? (
        <ul className="claims-list vf-checklist">
          {tiles.map((t) => (
            <li key={t.id}>
              <span className="claim-arrow" aria-hidden>
                →
              </span>
              <span className="claim-name">{t.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="specialty-grid">
          {tiles.map((t) => (
            <Tile key={t.id} {...t} className={toClassName(elementClasses?.card)} />
          ))}
        </div>
      )}
    </Section>
  )
}
