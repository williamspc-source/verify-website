import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { CustomCSS } from '@/components/CustomCSS'
import { MotionObserver } from '@/components/Reveal'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { brandColorStyle } from '@/utilities/brandColorStyle'
import { designTokenStyle } from '@/utilities/designTokenStyle'

// VERIFY brand typeface (licensed). One family covers heading + body via its
// full weight range (Museo weights: 100/300/500/700/900/1000). Loaded locally so
// it ships with the build; the .woff files live under ./fonts/museo. Editors can
// still override the font family site-wide via the Design System global.
const museo = localFont({
  src: [
    { path: './fonts/museo/MuseoSansRounded100.woff', weight: '100', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded300.woff', weight: '300', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded500.woff', weight: '400', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded500.woff', weight: '500', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded700.woff', weight: '600', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded700.woff', weight: '700', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded900.woff', weight: '800', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded900.woff', weight: '900', style: 'normal' },
    { path: './fonts/museo/MuseoSansRounded1000.woff', weight: '1000', style: 'normal' },
  ],
  variable: '--font-museo',
  display: 'swap',
})

// Resolves a Site Settings upload field (populated at depth 1) to a media doc.
type MediaLike = { url?: string | null; updatedAt?: string | null; mimeType?: string | null }
const asMedia = (value: unknown): MediaLike | null =>
  value && typeof value === 'object' && 'url' in value ? (value as MediaLike) : null

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getCachedGlobal('site-settings', 1)()
  const designTokens = await getCachedGlobal('design-system', 0)()
  // Brand colours + editable design-system tokens become CSS vars on :root.
  const rootStyle = { ...brandColorStyle(settings?.colors), ...designTokenStyle(designTokens) }

  return (
    <html
      className={cn(museo.variable, GeistMono.variable)}
      lang="en"
      style={rootStyle}
      suppressHydrationWarning
    >
      <body>
        <CustomCSS />
        <MotionObserver />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal('site-settings', 1)()
  const siteName = settings?.siteName || 'VERIFY Medico-Legal Solutions'

  const favicon = asMedia(settings?.favicon)
  const iconHref = favicon?.url
    ? getMediaUrl(favicon.url, favicon.updatedAt)
    : '/favicon.png'
  const appleHref = favicon?.url
    ? getMediaUrl(favicon.url, favicon.updatedAt)
    : '/apple-touch-icon.png'

  const social = asMedia(settings?.socialImage)
  const socialPath =
    (settings?.socialImage as { sizes?: { og?: { url?: string | null } } } | undefined)?.sizes?.og
      ?.url || social?.url
  const ogImages = socialPath ? [{ url: `${getServerSideURL()}${socialPath}` }] : undefined

  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    icons: {
      icon: [{ url: iconHref, ...(favicon?.mimeType ? { type: favicon.mimeType } : {}) }],
      apple: [{ url: appleHref }],
    },
    openGraph: mergeOpenGraph({
      siteName,
      title: siteName,
      ...(ogImages ? { images: ogImages } : {}),
    }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
