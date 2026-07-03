import React from 'react'

import type { HeadingBlock as Props } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { accentText } from '@/utilities/accentText'

export const HeadingBlock: React.FC<Props> = ({ text, level, size, align, cssClass }) => {
  if (!text) return null
  const Tag = (level || 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
  return (
    <Tag
      className={cn(
        'vf-heading',
        `vf-heading--${size || 'lg'}`,
        align && align !== 'left' ? `vf-align-${align}` : undefined,
        toClassName(cssClass),
      )}
    >
      {accentText(text)}
    </Tag>
  )
}
