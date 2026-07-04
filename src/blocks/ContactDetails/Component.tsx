import React from 'react'

import type { ContactDetailsBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

// Normalised shape shared by the manual (block-authored) and global-sourced items.
type ContactItem = {
  key: string
  icon?: string | null
  label: string
  value: string
  href?: string | null
  note?: string | null
}

/**
 * Business contact details (phone / email / address / hours). When `useGlobal`
 * is set, the values are pulled from the Footer global's `contact` group + `hours`
 * array (the single source of truth); otherwise the block's own `items` array is
 * rendered. Reuses the design-reference `.contact-*` classes.
 */
export const ContactDetailsBlock: React.FC<Props & { bare?: boolean }> = async ({
  eyebrow,
  heading,
  subheading,
  useGlobal,
  items,
  cssClass,
  containerWidth,
  motion,
  bare,
}) => {
  let contactItems: ContactItem[] = []

  if (useGlobal) {
    const footer = await getCachedGlobal('footer', 1)()
    const c = footer?.contact

    if (c?.phone) {
      contactItems.push({
        key: 'phone',
        icon: 'phone',
        label: 'Phone',
        value: c.phone,
        href: c.phoneHref || `tel:${c.phone.replace(/[^\d+]/g, '')}`,
      })
    }
    if (c?.email) {
      contactItems.push({
        key: 'email',
        icon: 'envelope',
        label: 'Email',
        value: c.email,
        href: `mailto:${c.email}`,
      })
    }
    if (c?.address) {
      contactItems.push({ key: 'address', icon: 'map-pin', label: 'Address', value: c.address })
    }

    const hoursLines = (footer?.hours || [])
      .map((h) => [h?.days, h?.time].filter(Boolean).join(' — '))
      .filter(Boolean)
    if (hoursLines.length > 0) {
      contactItems.push({
        key: 'hours',
        icon: 'clock',
        label: 'Office Hours',
        value: hoursLines.join('\n'),
      })
    }
  } else {
    contactItems = (items || [])
      .filter((i) => i?.label && i?.value)
      .map((i, idx) => ({
        key: i.id || String(idx),
        icon: i.icon,
        label: i.label,
        value: i.value,
        href: i.href,
        note: i.note,
      }))
  }

  if (contactItems.length === 0) return null

  return (
    <Section
      className={cn('vf-contact-details', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />

      <div className="contact-details" style={{ maxWidth: '560px', marginInline: 'auto' }}>
        {contactItems.map(({ key, icon, label, value, href, note }) => (
          <div key={key} className="contact-item">
            {icon ? (
              <span className="contact-icon">
                <Icon name={icon} />
              </span>
            ) : null}
            <div>
              <p className="contact-item-label">{label}</p>
              {href ? (
                <a
                  href={href}
                  className="contact-item-value"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {value}
                </a>
              ) : (
                <p className="contact-item-value" style={{ whiteSpace: 'pre-line' }}>
                  {value}
                </p>
              )}
              {note ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-mid)', marginTop: '2px' }}>
                  {note}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
