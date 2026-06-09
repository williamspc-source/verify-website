'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type SubItem = NonNullable<NavItem['subItems']>[number]

/**
 * Renders the (up to) three-level nav menu from the Header global.
 * Desktop dropdowns are CSS-hover driven; the mobile drawer expands the same
 * markup inline (see the .site-nav.nav-open rules in globals.css).
 */
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <ul className="nav-links">
      {navItems.map((item, i) => {
        const subItems: SubItem[] = item.subItems || []
        const hasDropdown = subItems.length > 0

        return (
          <li key={i}>
            <CMSLink
              {...item.link}
              appearance="inline"
              className={cn('nav-top', hasDropdown && 'nav-caret')}
            />

            {hasDropdown ? (
              <div className="nav-dropdown">
                {subItems.map((sub, j) => {
                  const subSubItems = sub.subSubItems || []

                  if (subSubItems.length > 0) {
                    return (
                      <div className="has-submenu" key={j}>
                        <CMSLink {...sub.link} appearance="inline" />
                        <div className="sub-dropdown">
                          {subSubItems.map((subSub, k) => (
                            <CMSLink key={k} {...subSub.link} appearance="inline" />
                          ))}
                        </div>
                      </div>
                    )
                  }

                  return <CMSLink key={j} {...sub.link} appearance="inline" />
                })}
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
