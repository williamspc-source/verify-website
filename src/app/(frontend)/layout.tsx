import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Montserrat, Open_Sans } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
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

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-open-sans',
  display: 'swap',
})

// Resolves a Site Settings upload field (populated at depth 1) to a media doc.
type MediaLike = { url?: string | null; updatedAt?: string | null; mimeType?: string | null }
const asMedia = (value: unknown): MediaLike | null =>
  value && typeof value === 'object' && 'url' in value ? (value as MediaLike) : null

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getCachedGlobal('site-settings', 1)()
  const brandStyle = brandColorStyle(settings?.colors)

  return (
    <html
      className={cn(montserrat.variable, openSans.variable, GeistMono.variable)}
      lang="en"
      style={brandStyle}
      suppressHydrationWarning
    >
      <body>
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
