import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { MapEmbedBlock as Props, Office } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Icon } from '@/components/Icon'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

// Aspect-ratio presets → CSS. `map` is a tall fixed-height frame.
const RATIOS: Record<string, string> = { '16-9': '16 / 9', '4-3': '4 / 3', '1-1': '1 / 1' }

const tel = (v: string) => `tel:${v.replace(/[^+0-9]/g, '')}`

// Small uppercase panel label, reusing the shared design-reference class.
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="vf-map-embed__label section-label" style={{ marginBottom: '.35rem' }}>
    {children}
  </p>
)

export const MapEmbedBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    kind = 'map',
    office: officeRef,
    embedUrl,
    aspect = '16-9',
    title,
    showOfficeInfo,
    actions,
    cssClass,
    containerWidth,
    motion,
    bare,
  } = props

  // Resolve the office relationship (populated object at depth>0, else id).
  let office: Office | null = null
  if (kind === 'map' && officeRef) {
    if (typeof officeRef === 'object') {
      office = officeRef
    } else {
      try {
        const payload = await getPayload({ config: configPromise })
        office = await payload.findByID({ collection: 'offices', id: officeRef, depth: 0 })
      } catch {
        office = null
      }
    }
  }

  // Derive the iframe src: explicit embedUrl → office's own embed URL → build a
  // Google Maps embed from the office address.
  let src: string | null = embedUrl?.trim() || null
  if (!src && kind === 'map' && office) {
    src = office.mapEmbedUrl?.trim() || null
    if (!src && office.address) {
      const q = encodeURIComponent(office.address.replace(/\s*\n\s*/g, ', ').trim())
      src = `https://www.google.com/maps?q=${q}&output=embed`
    }
  }

  const hasFrame = Boolean(src)
  const hasPanel = Boolean(kind === 'map' && office && showOfficeInfo !== false)
  const showSplit = hasFrame && hasPanel
  const hasActions = Array.isArray(actions) && actions.length > 0

  if (!hasFrame && !hasPanel && !hasActions && !heading && !eyebrow) return null

  const frameStyle: React.CSSProperties =
    aspect === 'map'
      ? { height: 'clamp(360px, 60vh, 620px)' }
      : { aspectRatio: RATIOS[aspect || '16-9'] || '16 / 9' }

  const frame = hasFrame ? (
    <div
      className="vf-map-embed__frame"
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', ...frameStyle }}
    >
      <iframe
        src={src as string}
        title={title || office?.title || 'Embedded map'}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  ) : null

  const panel = hasPanel ? (
    <aside
      className={cn('vf-map-embed__panel', showSplit && 'lg:col-span-1')}
      style={{ display: 'grid', gap: '1.5rem', alignContent: 'start' }}
    >
      {office?.title ? (
        <h3 className="vf-map-embed__panel-title" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {office.title}
        </h3>
      ) : null}

      {office?.address ? (
        <div className="vf-map-embed__info">
          <Label>Address</Label>
          <p style={{ whiteSpace: 'pre-line' }}>{office.address}</p>
        </div>
      ) : null}

      {office?.phone || office?.email ? (
        <div className="vf-map-embed__info">
          <Label>Contact</Label>
          {office?.phone ? (
            <p>
              <a href={tel(office.phone)}>{office.phone}</a>
            </p>
          ) : null}
          {office?.email ? (
            <p>
              <a href={`mailto:${office.email}`}>{office.email}</a>
            </p>
          ) : null}
        </div>
      ) : null}

      {Array.isArray(office?.hours) && office.hours.length > 0 ? (
        <div className="vf-map-embed__info">
          <Label>Opening hours</Label>
          <dl style={{ display: 'grid', gap: '.25rem' }}>
            {office.hours.map((h, i) => (
              <div
                key={h.id || i}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
              >
                <dt>{h.days}</dt>
                <dd style={{ opacity: 0.75 }}>{h.time}</dd>
              </div>
            ))}
          </dl>
          {office.hoursNote ? (
            <p style={{ opacity: 0.7, fontSize: '.875rem', marginTop: '.35rem' }}>{office.hoursNote}</p>
          ) : null}
        </div>
      ) : null}

      {Array.isArray(office?.transport) && office.transport.length > 0 ? (
        <div className="vf-map-embed__info">
          <Label>Getting here</Label>
          <ul style={{ display: 'grid', gap: '.35rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {office.transport.map((t, i) => (
              <li key={t.id || i}>
                {t.href ? (
                  <a href={t.href} rel="noopener noreferrer" target="_blank">
                    {t.label}
                  </a>
                ) : (
                  <span>{t.label}</span>
                )}
                {t.note ? <span style={{ opacity: 0.7 }}> — {t.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {Array.isArray(office?.parking) && office.parking.length > 0 ? (
        <div className="vf-map-embed__info">
          <Label>Parking</Label>
          <ul style={{ display: 'grid', gap: '.6rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {office.parking.map((p, i) => (
              <li key={p.id || i}>
                <span style={{ fontWeight: 600 }}>
                  {p.href ? (
                    <a href={p.href} rel="noopener noreferrer" target="_blank">
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </span>
                {p.address ? <span style={{ opacity: 0.75 }}> — {p.address}</span> : null}
                {p.walkTime || p.heightLimit ? (
                  <span style={{ display: 'block', opacity: 0.7, fontSize: '.875rem' }}>
                    {[p.walkTime, p.heightLimit].filter(Boolean).join(' · ')}
                  </span>
                ) : null}
                {p.note ? (
                  <span style={{ display: 'block', opacity: 0.7, fontSize: '.875rem' }}>{p.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {office?.note ? (
        <p style={{ opacity: 0.8, whiteSpace: 'pre-line' }}>{office.note}</p>
      ) : null}
    </aside>
  ) : null

  return (
    <Section
      className={cn('vf-map-embed', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} />

      {showSplit ? (
        <div className="vf-map-embed__layout grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">{frame}</div>
          {panel}
        </div>
      ) : (
        <>
          {frame}
          {panel}
        </>
      )}

      {hasActions ? (
        <div
          className="vf-map-embed__actions"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '2rem' }}
        >
          {actions!.map(({ link }, i) => {
            if (!link) return null
            const outline = link.appearance === 'outline'
            return (
              <CMSLink
                key={i}
                {...link}
                label={undefined}
                appearance="inline"
                className={cn('btn', outline ? 'btn-outline' : 'btn-primary')}
              >
                <span>{link.label}</span>
              </CMSLink>
            )
          })}
        </div>
      ) : null}
    </Section>
  )
}
