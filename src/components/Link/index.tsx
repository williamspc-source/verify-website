import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Icon } from '@/components/Icon'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  icon?: string | null
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | 'enquiry' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    icon,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const iconEl = icon ? <Icon name={icon} className="size-4" /> : null

  // "Open enquiry form" action: no navigation — a button carrying the
  // data-enquiry-panel hook the site-wide enquiry drawer listens for.
  if (type === 'enquiry') {
    const content = (
      <>
        {iconEl}
        {label}
        {children}
      </>
    )
    if (appearance === 'inline') {
      return (
        <button type="button" data-enquiry-panel className={cn(className)}>
          {content}
        </button>
      )
    }
    return (
      <Button className={className} size={sizeFromProps} variant={appearance} data-enquiry-panel>
        {content}
      </Button>
    )
  }

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
        {iconEl}
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {iconEl}
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
