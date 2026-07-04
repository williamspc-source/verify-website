import React from 'react'

import type { IconListBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { CMSLink } from '@/components/Link'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type Item = NonNullable<Props['items']>[number]

// The item link is now just an optional URL — active only when a URL is set.
const isActiveLink = (link: Item['link']): boolean => Boolean(link?.url)

export const IconListBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  columns,
  items,
  cssClass,
  motion,
  containerWidth,
  bare,
}) => {
  if (!Array.isArray(items) || items.length === 0) return null
  const cols = Number(columns) || 1

  return (
    <Section
      className={cn('vf-icon-list-block', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />

      <ul
        className="vf-icon-list"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: '0.75rem 2rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, i) => {
          const inner = (
            <>
              {item.icon ? (
                <Icon name={item.icon} className="vf-icon-list__icon" />
              ) : null}
              <span className="vf-icon-list__text">{item.text}</span>
            </>
          )

          const rowStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }

          return (
            <li key={item.id || i} className="vf-icon-list__item">
              {isActiveLink(item.link) ? (
                <CMSLink
                  {...item.link}
                  appearance="inline"
                  className="vf-icon-list__inner vf-icon-list__link"
                >
                  <span className="vf-icon-list__inner-content" style={rowStyle}>
                    {inner}
                  </span>
                </CMSLink>
              ) : (
                <div className="vf-icon-list__inner" style={rowStyle}>
                  {inner}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
