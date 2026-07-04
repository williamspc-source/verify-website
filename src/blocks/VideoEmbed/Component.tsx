import React from 'react'

import type { VideoEmbedBlock as Props } from '@/payload-types'

import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

// Build the iframe src for the selected provider. YouTube/Vimeo take a bare
// video ID; the "url" provider uses whatever full embed URL the editor pastes.
const buildSrc = (
  provider: Props['provider'],
  videoId?: string | null,
  url?: string | null,
): string | null => {
  if (provider === 'url') return url?.trim() || null
  const id = videoId?.trim()
  if (!id) return null
  if (provider === 'vimeo') return `https://player.vimeo.com/video/${id}`
  return `https://www.youtube.com/embed/${id}`
}

// Per-provider iframe permissions.
const allowFor = (provider: Props['provider']): string =>
  provider === 'vimeo'
    ? 'autoplay; fullscreen; picture-in-picture; clipboard-write'
    : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

export const VideoEmbedBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  provider,
  videoId,
  url,
  videoTitle,
  caption,
  aspect,
  background,
  anchorId,
  cssClass,
  containerWidth,
  motion,
  bare,
}) => {
  const src = buildSrc(provider, videoId, url)
  if (!src) return null

  // Strip [[accent]] markers when falling back to the heading for the a11y title.
  const title = videoTitle || heading?.replace(/\[\[|\]\]/g, '') || 'Video'

  return (
    <Section
      id={anchorId || undefined}
      background={background as SectionBackground}
      className={cn('claimant-video vf-video-embed', toClassName(cssClass))}
      containerWidth={containerWidth}
      motion={motion}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />

      <figure
        className={cn(
          'vf-video-embed__figure',
          aspect === '4:3' ? 'vf-video-embed--4x3' : 'vf-video-embed--16x9',
        )}
      >
        <div className="claimant-video-wrap">
          <div className="vf-video-embed__ratio">
            <iframe
              src={src}
              title={title}
              loading="lazy"
              allow={allowFor(provider)}
              allowFullScreen
            />
          </div>
        </div>
        {caption ? <figcaption className="vf-video-embed__caption">{caption}</figcaption> : null}
      </figure>
    </Section>
  )
}
