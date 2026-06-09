import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  let href = url
  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    if (reference.relationTo === 'pages') {
      // Pages are nested (nested-docs): prefer the full breadcrumb path, fall
      // back to the bare slug if breadcrumbs aren't populated in this context.
      const breadcrumbs = (reference.value as { breadcrumbs?: ({ url?: string | null } | null)[] })
        .breadcrumbs
      const nestedUrl =
        Array.isArray(breadcrumbs) && breadcrumbs.length
          ? breadcrumbs[breadcrumbs.length - 1]?.url
          : undefined
      href = nestedUrl || `/${reference.value.slug}`
    } else {
      href = `/${reference.relationTo}/${reference.value.slug}`
    }
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
