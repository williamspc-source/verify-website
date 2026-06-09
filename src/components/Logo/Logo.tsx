import clsx from 'clsx'
import React from 'react'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export type BrandLogo = {
  src: string
  alt: string
  width: number
  height: number
}

// Resolves a Site Settings logo upload (populated at depth 1) to render props.
// Returns null when unset/unpopulated so the component falls back to the file.
export const resolveBrandLogo = (media: unknown): BrandLogo | null => {
  if (media && typeof media === 'object' && 'url' in media) {
    const m = media as {
      url?: string | null
      alt?: string | null
      width?: number | null
      height?: number | null
      updatedAt?: string | null
    }
    if (m.url) {
      return {
        src: getMediaUrl(m.url, m.updatedAt),
        alt: m.alt || 'VERIFY Medico-Legal Solutions',
        width: m.width || 4267,
        height: m.height || 1359,
      }
    }
  }
  return null
}

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  src?: string | null
  alt?: string | null
  width?: number
  height?: number
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    src,
    alt,
    // Intrinsic dimensions of the fallback public/verify-logo.png; overridden
    // by the uploaded media's real dimensions. Visual size comes from the
    // consuming CSS (.nav-logo img / .footer-logo img: height + width:auto).
    width = 4267,
    height = 1359,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={alt || 'VERIFY Medico-Legal Solutions'}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('w-auto', className)}
      src={src || '/verify-logo.png'}
    />
  )
}
