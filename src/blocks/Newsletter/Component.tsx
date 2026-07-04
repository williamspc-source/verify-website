import React from 'react'

import type { NewsletterBlock as Props } from '@/payload-types'

import { Section } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

// Newsletter subscribe band. Reproduces the design-reference `.ni-newsletter`
// gradient CTA with an email capture form. The form is presentational only —
// the input carries name="email" so it can be wired to a submit endpoint later.
export const NewsletterBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  placeholder,
  buttonLabel,
  note,
  anchorId,
  cssClass,
  bare,
}) => {
  if (!heading && !subheading && !eyebrow) return null

  return (
    <Section
      bare={bare}
      id={anchorId || undefined}
      className={cn('ni-newsletter', toClassName(cssClass))}
    >
      {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
      {heading ? <h2>{accentText(heading)}</h2> : null}
      {subheading ? <p>{subheading}</p> : null}

      <form className="ni-subscribe-form" method="post">
        <input
          className="ni-subscribe-input"
          type="email"
          name="email"
          placeholder={placeholder || 'Enter your email'}
          aria-label={placeholder || 'Enter your email'}
        />
        <button className="ni-subscribe-btn" type="submit">
          {buttonLabel || 'Subscribe'}
        </button>
      </form>

      {note ? <p className="ni-subscribe-note">{note}</p> : null}
    </Section>
  )
}
