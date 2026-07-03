import React from 'react'

import type { ButtonBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const ButtonBlock: React.FC<Props> = ({ links, size, align, cssClass }) => {
  if (!Array.isArray(links) || links.length === 0) return null
  return (
    <div
      className={cn(
        'vf-button-group',
        align && align !== 'left' ? `vf-align-${align}` : undefined,
        toClassName(cssClass),
      )}
    >
      {links.map(({ link }, i) => (
        <CMSLink
          key={i}
          {...link}
          appearance="inline"
          className={cn(
            'btn',
            link?.appearance === 'outline' ? 'btn-outline' : 'btn-primary',
            `vf-btn--${size || 'md'}`,
          )}
        />
      ))}
    </div>
  )
}
