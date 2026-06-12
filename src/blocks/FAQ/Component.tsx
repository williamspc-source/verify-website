import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

// Server-rendered accordion using native <details>/<summary> (no client JS).
// `exclusive` uses the native [name] grouping so only one stays open.
export const FAQBlock: React.FC<FAQBlockProps & { id?: string }> = (props) => {
  const { heading, items, cssClass, exclusive, id } = props

  if (!items || items.length === 0) return null
  const groupName = exclusive ? `faq-${id || 'group'}` : undefined

  return (
    <div className={cn('vf-faq container content-narrow', toClassName(cssClass))}>
      {heading ? <h2 className="vf-faq__heading section-title" style={{ marginBottom: 24 }}>{heading}</h2> : null}
      <div className="vf-faq__list">
        {items.map((item, index) => (
          <details key={index} name={groupName} className="faq-item vf-faq__item">
            <summary className="vf-faq__question">{item.question}</summary>
            <div className="faq-a vf-faq__answer">
              <RichText data={item.answer} enableGutter={false} enableProse={false} />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
