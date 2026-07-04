import React from 'react'

import type { CalloutBlock as Props } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { Section } from '@/components/Section'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type Variant = NonNullable<Props['style']>

// Self-contained colour tokens per style so the block needs no bespoke CSS — the
// box is themed entirely with inline styles driven by the selected `style`.
const styleTokens: Record<Variant, { accent: string; bg: string; border: string }> = {
  info: { accent: '#2563eb', bg: 'rgba(37, 99, 235, 0.06)', border: 'rgba(37, 99, 235, 0.22)' },
  note: { accent: '#475569', bg: 'rgba(71, 85, 105, 0.06)', border: 'rgba(71, 85, 105, 0.20)' },
  success: { accent: '#16a34a', bg: 'rgba(22, 163, 74, 0.06)', border: 'rgba(22, 163, 74, 0.24)' },
  warning: { accent: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.28)' },
}

// A sensible leading icon per style when the editor hasn't picked one.
const defaultIcon: Record<Variant, string> = {
  info: 'info',
  note: 'info',
  success: 'check-circle',
  warning: 'warning',
}

export const CalloutBlock: React.FC<Props & { bare?: boolean }> = ({
  style,
  icon,
  tag,
  heading,
  body,
  links,
  cssClass,
  bare,
}) => {
  const hasLinks = Array.isArray(links) && links.length > 0
  if (!tag && !heading && !body && !hasLinks) return null

  const variant: Variant = style || 'info'
  const tokens = styleTokens[variant]
  const iconName = icon || defaultIcon[variant]

  return (
    <Section bare={bare} className={cn('vf-callout-block', toClassName(cssClass))}>
      <div
        role="note"
        className="vf-callout flex gap-4 rounded-lg p-5"
        style={{
          background: tokens.bg,
          border: `1px solid ${tokens.border}`,
          borderLeft: `4px solid ${tokens.accent}`,
        }}
      >
        {iconName ? (
          <div className="vf-callout__icon shrink-0" style={{ color: tokens.accent }} aria-hidden>
            <Icon name={iconName} />
          </div>
        ) : null}

        <div className="vf-callout__content min-w-0 flex-1">
          {tag ? (
            <span
              className="vf-callout__tag mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ background: tokens.border, color: tokens.accent }}
            >
              {tag}
            </span>
          ) : null}

          {heading ? (
            <h3 className="vf-callout__heading text-lg font-semibold leading-snug">{heading}</h3>
          ) : null}

          {body ? (
            <RichText className="vf-callout__body mt-1" data={body} enableGutter={false} />
          ) : null}

          {hasLinks ? (
            <div
              className="vf-callout__links mt-4 flex flex-wrap gap-x-5 gap-y-2 font-medium"
              style={{ color: tokens.accent }}
            >
              {links!.map(({ link }, i) => (
                <CMSLink key={i} {...link} className="underline underline-offset-2" />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
