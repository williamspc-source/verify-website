import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { Icon } from '@/components/Icon'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

// Server-rendered accordion using native <details>/<summary> (no client JS).
// `exclusive` uses the native [name] grouping so only one stays open.
export const FAQBlock: React.FC<FAQBlockProps & { id?: string; bare?: boolean }> = (props) => {
  const { eyebrow, heading, subheading, columns, items, cssClass, exclusive, openFirst, helpCard, id, bare } =
    props

  if (!items || items.length === 0) return null
  const groupName = exclusive ? `faq-${id || 'group'}` : undefined
  const help = helpCard as
    | { heading?: string | null; body?: string | null; email?: string | null; phone?: string | null }
    | undefined

  return (
    <div className={cn('vf-faq', bare ? '' : 'container content-narrow', toClassName(cssClass))}>
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />

      <div
        className="vf-faq__list"
        style={
          columns === '2'
            ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }
            : undefined
        }
      >
        {items.map((item, index) => (
          <details
            key={index}
            name={groupName}
            open={openFirst && index === 0}
            className="faq-item vf-faq__item"
          >
            <summary className="vf-faq__question">
              {item.icon ? <Icon name={item.icon} className="size-5" /> : null}
              {item.question}
            </summary>
            <div className="faq-a vf-faq__answer">
              <RichText data={item.answer} enableGutter={false} enableProse={false} />
            </div>
          </details>
        ))}
      </div>

      {help && (help.heading || help.body) ? (
        <div className="vf-faq__help vf-callout vf-callout--info">
          {help.heading ? <p className="vf-faq__help-heading">{help.heading}</p> : null}
          {help.body ? <p>{help.body}</p> : null}
          {help.email || help.phone ? (
            <p className="vf-faq__help-contact">
              {help.email ? <a href={`mailto:${help.email}`}>{help.email}</a> : null}
              {help.email && help.phone ? ' · ' : null}
              {help.phone ? <a href={`tel:${help.phone.replace(/\s+/g, '')}`}>{help.phone}</a> : null}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
