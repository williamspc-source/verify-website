import React from 'react'

import type { SectionNavBlock as Props } from '@/payload-types'

import { Section } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

import { SectionNavClient, type SectionNavItem } from './SectionNavClient'

// Sticky in-page section nav (design ref: `.ni-section-nav`). Renders through
// <Section> so it accepts `bare` and the standard cssClass hook; the scroll-spy
// (IntersectionObserver + active-state) lives in the client child.
export const SectionNavBlock: React.FC<Props & { bare?: boolean }> = ({
  items,
  sticky,
  cssClass,
  bare,
}) => {
  const navItems: SectionNavItem[] = (items || [])
    .filter((i): i is NonNullable<typeof i> => Boolean(i && i.label && i.anchorId))
    .map((i) => ({ label: i.label!, anchorId: i.anchorId! }))

  if (navItems.length === 0) return null

  const isSticky = sticky !== false

  return (
    <Section
      bare={bare}
      container={false}
      className={cn(
        'ni-section-nav',
        !isSticky && 'ni-section-nav--static',
        toClassName(cssClass),
      )}
    >
      <div className="container">
        <SectionNavClient items={navItems} />
      </div>
    </Section>
  )
}
