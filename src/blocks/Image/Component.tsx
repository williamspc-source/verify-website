import React from 'react'

import type { ImageBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

export const ImageBlock: React.FC<Props> = ({ media, width, rounded, align, caption, cssClass }) => {
  if (!media || typeof media !== 'object') return null
  return (
    <figure
      className={cn(
        'vf-image',
        `vf-image--${width || 'full'}`,
        `vf-image--rounded-${rounded || 'md'}`,
        align && align !== 'left' ? `vf-align-${align}` : undefined,
        toClassName(cssClass),
      )}
    >
      <Media resource={media} imgClassName="vf-image__img" />
      {caption ? <figcaption className="vf-image__caption">{caption}</figcaption> : null}
    </figure>
  )
}
