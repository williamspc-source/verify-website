import React from 'react'

import type { SectionNavBlock as Props } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

import { SectionNavClient, type SectionNavItem } from './SectionNavClient'

// Sticky in-page section nav (design ref: `.ni-section-nav`). Rendered as the bare
// reference markup — a full-bleed grey bar with a centred container of pills — NOT
// through the shared <Section>, whose white banding + vertical padding would cover
// the grey bar and hide the light-text tabs (only the active pill stayed visible).
// The scroll-spy (IntersectionObserver + active-state) lives in the client child.
export const SectionNavBlock: React.FC<Props & { bare?: boolean }> = ({ items, sticky, cssClass }) => {
  const navItems: SectionNavItem[] = (items || [])
    .filter((i): i is NonNullable<typeof i> => Boolean(i && i.label && i.anchorId))
    .map((i) => ({ label: i.label!, anchorId: i.anchorId! }))

  if (navItems.length === 0) return null

  const isSticky = sticky !== false

  return (
    <div
      className={cn('ni-section-nav', !isSticky && 'ni-section-nav--static', toClassName(cssClass))}
    >
      <div className="container">
        <SectionNavClient items={navItems} />
      </div>
    </div>
  )
}
