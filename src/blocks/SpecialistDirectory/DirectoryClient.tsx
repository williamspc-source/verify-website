'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { initialsOf } from '@/components/PersonCard'

// Plain, serialisable shape passed down from the server component.
export type DirectorySpecialist = {
  id: string
  name: string
  position: string | null
  slug: string | null
  photoUrl: string | null
  specialty: string | null
  locations: string[]
  accreditations: string[]
}

type Props = {
  specialists: DirectorySpecialist[]
  enableSearch: boolean
  enableSpecialty: boolean
  enableLocation: boolean
  enableAccreditation: boolean
  searchPlaceholder: string
  countTemplate: string
  specialtyLabel: string
  locationLabel: string
  accreditationLabel: string
  emptyHeading: string
  emptyBody: string
  cardCtaLabel: string
}

const uniqueSorted = (values: string[]): string[] =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

const controlStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid var(--border-light)',
  background: 'var(--white)',
  color: 'var(--text-dark)',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  minWidth: 160,
}

const Card: React.FC<{ data: DirectorySpecialist; ctaLabel: string }> = ({ data, ctaLabel }) => {
  const href = data.slug ? `/specialists/${data.slug}` : null

  const inner = (
    <>
      <div
        className="vf-directory-card__avatar"
        style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', marginBottom: 16 }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt={data.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="avatar-mono">{initialsOf(data.name)}</div>
        )}
      </div>

      <div className="spec-name vf-card__title">{data.name}</div>
      {data.position ? <div className="spec-title">{data.position}</div> : null}
      {data.specialty ? (
        <div className="vf-directory-card__specialty" style={{ marginTop: 6, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-mid)' }}>
          {data.specialty}
        </div>
      ) : null}
      {data.locations.length > 0 ? <div className="spec-loc">{data.locations.join(' · ')}</div> : null}
      {data.accreditations.length > 0 ? (
        <div className="expert-tags" style={{ justifyContent: 'center', marginTop: 12 }}>
          {data.accreditations.map((a, i) => (
            <span key={i} className="expert-tag">
              {a}
            </span>
          ))}
        </div>
      ) : null}
      {href ? <span className="spec-more">{ctaLabel} &rarr;</span> : null}
    </>
  )

  return href ? (
    <Link href={href} className="spec-card vf-card">
      {inner}
    </Link>
  ) : (
    <div className="spec-card vf-card">{inner}</div>
  )
}

export const DirectoryClient: React.FC<Props> = ({
  specialists,
  enableSearch,
  enableSpecialty,
  enableLocation,
  enableAccreditation,
  searchPlaceholder,
  countTemplate,
  specialtyLabel,
  locationLabel,
  accreditationLabel,
  emptyHeading,
  emptyBody,
  cardCtaLabel,
}) => {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')
  const [accreditation, setAccreditation] = useState('')

  const specialtyOptions = useMemo(
    () => uniqueSorted(specialists.map((s) => s.specialty ?? '')),
    [specialists],
  )
  const locationOptions = useMemo(
    () => uniqueSorted(specialists.flatMap((s) => s.locations)),
    [specialists],
  )
  const accreditationOptions = useMemo(
    () => uniqueSorted(specialists.flatMap((s) => s.accreditations)),
    [specialists],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return specialists.filter((s) => {
      if (q) {
        const hay = `${s.name} ${s.position ?? ''} ${s.specialty ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (specialty && s.specialty !== specialty) return false
      if (location && !s.locations.includes(location)) return false
      if (accreditation && !s.accreditations.includes(accreditation)) return false
      return true
    })
  }, [specialists, search, specialty, location, accreditation])

  const countLabel = countTemplate.includes('{count}')
    ? countTemplate.replace('{count}', String(filtered.length))
    : `${filtered.length} ${countTemplate}`.trim()

  const showSpecialty = enableSpecialty && specialtyOptions.length > 0
  const showLocation = enableLocation && locationOptions.length > 0
  const showAccreditation = enableAccreditation && accreditationOptions.length > 0

  return (
    <div className="vf-directory">
      <div
        className="vf-directory__filters flex flex-wrap items-center justify-center gap-3"
        style={{ margin: '8px 0 4px' }}
      >
        {enableSearch ? (
          <input
            type="search"
            className="vf-directory__control vf-directory__search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={searchPlaceholder}
            style={{ ...controlStyle, flex: '1 1 220px', maxWidth: 340 }}
          />
        ) : null}

        {showSpecialty ? (
          <select
            className="vf-directory__control"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            aria-label={specialtyLabel}
            style={controlStyle}
          >
            <option value="">{specialtyLabel}</option>
            {specialtyOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : null}

        {showLocation ? (
          <select
            className="vf-directory__control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label={locationLabel}
            style={controlStyle}
          >
            <option value="">{locationLabel}</option>
            {locationOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : null}

        {showAccreditation ? (
          <select
            className="vf-directory__control"
            value={accreditation}
            onChange={(e) => setAccreditation(e.target.value)}
            aria-label={accreditationLabel}
            style={controlStyle}
          >
            <option value="">{accreditationLabel}</option>
            {accreditationOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <p
        className="vf-directory__count"
        style={{ textAlign: 'center', color: 'var(--text-mid)', fontWeight: 600, margin: '18px 0 26px' }}
        aria-live="polite"
      >
        {countLabel}
      </p>

      {filtered.length > 0 ? (
        <div className="spec-grid">
          {filtered.map((s) => (
            <Card key={s.id} data={s} ctaLabel={cardCtaLabel} />
          ))}
        </div>
      ) : (
        <div className="vf-directory__empty" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h3 className="vf-card__title" style={{ marginBottom: 8 }}>
            {emptyHeading}
          </h3>
          <p style={{ color: 'var(--text-mid)' }}>{emptyBody}</p>
        </div>
      )}
    </div>
  )
}
