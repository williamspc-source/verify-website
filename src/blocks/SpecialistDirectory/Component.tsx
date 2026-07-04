import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { SpecialistDirectoryBlock as Props, Specialist } from '@/payload-types'

import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

import { DirectoryClient, type DirectorySpecialist } from './DirectoryClient'

const mediaUrl = (m: unknown): string | null =>
  m && typeof m === 'object' && 'url' in m ? ((m as { url?: string | null }).url ?? null) : null

// depth 1 populates relationships to objects; guard for the un-populated
// number/string form just in case.
const relTitles = (rels: unknown): string[] =>
  Array.isArray(rels)
    ? rels
        .map((r) =>
          r && typeof r === 'object' && 'title' in r ? (r as { title?: string | null }).title : null,
        )
        .filter((t): t is string => Boolean(t))
    : []

const specialtyTitle = (s: Specialist['specialty']): string | null =>
  s && typeof s === 'object' ? (s.title ?? null) : null

export const SpecialistDirectoryBlock: React.FC<Props & { bare?: boolean }> = async (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    enableSearch,
    enableSpecialty,
    enableLocation,
    enableAccreditation,
    sortBy,
    searchPlaceholder,
    countTemplate,
    specialtyLabel,
    locationLabel,
    accreditationLabel,
    emptyHeading,
    emptyBody,
    cardCtaLabel,
    cssClass,
    bare,
  } = props

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'specialists',
    depth: 1,
    limit: 500,
    sort: sortBy === 'firstName' ? 'firstName' : 'lastName',
    where: { _status: { equals: 'published' } },
  })

  const specialists: DirectorySpecialist[] = docs.map((s) => ({
    id: String(s.id),
    name: s.title,
    position: s.position ?? null,
    slug: s.slug ?? null,
    photoUrl: mediaUrl(s.photo),
    specialty: specialtyTitle(s.specialty),
    locations: relTitles(s.locations),
    accreditations: relTitles(s.accreditations),
  }))

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-specialist-directory', toClassName(cssClass))}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />

      <DirectoryClient
        specialists={specialists}
        enableSearch={enableSearch ?? true}
        enableSpecialty={enableSpecialty ?? true}
        enableLocation={enableLocation ?? true}
        enableAccreditation={enableAccreditation ?? true}
        searchPlaceholder={searchPlaceholder ?? 'Search by name…'}
        countTemplate={countTemplate ?? '{count} specialists'}
        specialtyLabel={specialtyLabel ?? 'Specialty'}
        locationLabel={locationLabel ?? 'Location'}
        accreditationLabel={accreditationLabel ?? 'Accreditation'}
        emptyHeading={emptyHeading ?? 'No specialists found'}
        emptyBody={emptyBody ?? 'Try adjusting your filters.'}
        cardCtaLabel={cardCtaLabel ?? 'View Profile'}
      />
    </Section>
  )
}
