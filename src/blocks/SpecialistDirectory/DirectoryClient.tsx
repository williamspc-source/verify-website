'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { Icon } from '@/components/Icon'
import { initialsOf } from '@/components/PersonCard'
import { accentText } from '@/utilities/accentText'

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
  kicker: string
  heading: string
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
  secondaryCtaLabel: string
  secondaryCtaHref: string
  resetLabel: string
  locationsLabel: string
}

const uniqueSorted = (values: string[]): string[] =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

// Horizontal reference card: a 150×170 rectangular photo (or initials fallback)
// in a left column beside a left-aligned text column, with a two-button action
// row (ghost "View Profile" + solid secondary CTA) as a footer.
const Card: React.FC<{
  data: DirectorySpecialist
  ctaLabel: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  locationsLabel: string
}> = ({ data, ctaLabel, secondaryCtaLabel, secondaryCtaHref, locationsLabel }) => {
  const profileHref = data.slug ? `/specialists/${data.slug}` : null

  return (
    <div className="spec-card">
      <div className="spec-card-top">
        <div className="spec-avatar">
          <div className="spec-avatar-inner">
            {data.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="spec-photo-img" src={data.photoUrl} alt={data.name} loading="lazy" />
            ) : (
              <div className="avatar-mono">{initialsOf(data.name)}</div>
            )}
          </div>
        </div>
        <div className="spec-content">
          <div className="spec-name">{data.name}</div>
          {data.position ? <div className="spec-title">{data.position}</div> : null}
          {data.accreditations.length > 0 ? (
            <div className="spec-accred">{data.accreditations.join('; ')}</div>
          ) : null}
          {data.locations.length > 0 ? (
            <>
              <hr className="spec-divider" />
              <div className="spec-loc-label">{locationsLabel}</div>
              <div className="spec-loc">{data.locations.join(' | ')}</div>
            </>
          ) : null}
        </div>
      </div>
      <div className="spec-card-actions">
        {profileHref ? (
          <Link href={profileHref} className="spec-btn-ghost">
            {ctaLabel}
          </Link>
        ) : null}
        <Link href={secondaryCtaHref} className="spec-btn-solid">
          {secondaryCtaLabel}
        </Link>
      </div>
    </div>
  )
}

export const DirectoryClient: React.FC<Props> = ({
  specialists,
  kicker,
  heading,
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
  secondaryCtaLabel,
  secondaryCtaHref,
  resetLabel,
  locationsLabel,
}) => {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [accreditation, setAccreditation] = useState('')
  const [location, setLocation] = useState('')

  const specialtyOptions = useMemo(
    () => uniqueSorted(specialists.map((s) => s.specialty ?? '')),
    [specialists],
  )
  const accreditationOptions = useMemo(
    () => uniqueSorted(specialists.flatMap((s) => s.accreditations)),
    [specialists],
  )
  const locationOptions = useMemo(
    () => uniqueSorted(specialists.flatMap((s) => s.locations)),
    [specialists],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return specialists.filter((s) => {
      if (q) {
        // Specialty stays in the search index even though it is no longer
        // printed on the card.
        const hay =
          `${s.name} ${s.position ?? ''} ${s.specialty ?? ''} ${s.accreditations.join(' ')} ${s.locations.join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (specialty && s.specialty !== specialty) return false
      if (accreditation && !s.accreditations.includes(accreditation)) return false
      if (location && !s.locations.includes(location)) return false
      return true
    })
  }, [specialists, search, specialty, accreditation, location])

  const isFiltering = Boolean(search || specialty || accreditation || location)

  const total = specialists.length
  const countLabel = (() => {
    const t = countTemplate || ''
    if (t.includes('{count}') || t.includes('{total}')) {
      return t.replace(/\{count\}/g, String(filtered.length)).replace(/\{total\}/g, String(total))
    }
    return `${filtered.length} ${t}`.trim()
  })()

  const resetFilters = () => {
    setSearch('')
    setSpecialty('')
    setAccreditation('')
    setLocation('')
  }

  const showSpecialty = enableSpecialty && specialtyOptions.length > 0
  const showAccreditation = enableAccreditation && accreditationOptions.length > 0
  const showLocation = enableLocation && locationOptions.length > 0

  return (
    <div className="vf-directory specialist-directory">
      <div className="specialist-filter-panel" aria-label="Specialist directory filters">
        <div className="specialist-filter-head">
          <div>
            <div className="specialist-filter-kicker">{kicker}</div>
            <h2>{accentText(heading)}</h2>
          </div>
          {isFiltering ? (
            <div className="specialist-filter-count" aria-live="polite">
              {countLabel}
            </div>
          ) : null}
        </div>

        <form className="specialist-filter-form" onSubmit={(e) => e.preventDefault()}>
          {enableSearch ? (
            <label className="specialist-search-field" htmlFor="specialist-search">
              <span>Search</span>
              <span className="specialist-input-shell">
                <span className="specialist-field-icon" aria-hidden>
                  <Icon name="magnifying-glass" />
                </span>
                <input
                  id="specialist-search"
                  type="search"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                />
              </span>
            </label>
          ) : null}

          {showSpecialty ? (
            <label className="specialist-select-field" htmlFor="specialist-specialty">
              <span>Filter by specialty</span>
              <span className="specialist-select-shell">
                <select
                  id="specialist-specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  <option value="">{specialtyLabel}</option>
                  {specialtyOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          ) : null}

          {showAccreditation ? (
            <label className="specialist-select-field" htmlFor="specialist-accreditation">
              <span>Filter by accreditation</span>
              <span className="specialist-select-shell">
                <select
                  id="specialist-accreditation"
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value)}
                >
                  <option value="">{accreditationLabel}</option>
                  {accreditationOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          ) : null}

          {showLocation ? (
            <label className="specialist-select-field" htmlFor="specialist-location">
              <span>Filter by location</span>
              <span className="specialist-select-shell">
                <select
                  id="specialist-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">{locationLabel}</option>
                  {locationOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          ) : null}

          <button
            type="button"
            className={`specialist-filter-reset${isFiltering ? ' is-active' : ''}`}
            onClick={resetFilters}
          >
            {resetLabel}
          </button>
        </form>
      </div>

      {filtered.length > 0 ? (
        <div className="spec-grid">
          {filtered.map((s) => (
            <Card
              key={s.id}
              data={s}
              ctaLabel={cardCtaLabel}
              secondaryCtaLabel={secondaryCtaLabel}
              secondaryCtaHref={secondaryCtaHref}
              locationsLabel={locationsLabel}
            />
          ))}
        </div>
      ) : (
        <div className="specialist-filter-empty">
          <h3>{emptyHeading}</h3>
          <p>{emptyBody}</p>
        </div>
      )}
    </div>
  )
}
