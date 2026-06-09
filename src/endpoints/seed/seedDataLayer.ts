import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import { AREAS_OF_EXPERTISE, ASSESSMENT_TYPES, CLAIM_TYPES, SPECIALTIES, type Term } from './data/taxonomy'
import { SPECIALISTS } from './data/specialists'
import { TEAM } from './data/team'
import { EVENTS } from './data/events'
import { plainTextToLexical } from './data/richText'

type Ctx = { payload: Payload; req: PayloadRequest }

/* eslint-disable @typescript-eslint/no-explicit-any */

// Upsert a taxonomy lookup collection (idempotent by slug) → Map<slug, id>.
async function upsertTerms(
  { payload, req }: Ctx,
  collection: CollectionSlug,
  terms: Term[],
): Promise<Map<string, number | string>> {
  const map = new Map<string, number | string>()
  for (const term of terms) {
    // Idempotent by title (stable) rather than slug, since the slug hook may
    // reformat a provided slug. The map is still keyed by our canonical slug.
    const existing = await payload.find({
      collection,
      where: { title: { equals: term.title } },
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs[0]) {
      map.set(term.slug, existing.docs[0].id)
      continue
    }
    const created = await payload.create({
      collection,
      depth: 0,
      req,
      context: { disableRevalidate: true },
      data: { title: term.title, slug: term.slug } as any,
    })
    map.set(term.slug, created.id)
  }
  return map
}

const resolve = (map: Map<string, number | string>, slugs: string[]) =>
  slugs.map((s) => map.get(s)).filter((id): id is number | string => id != null)

// Create a content doc only if its slug doesn't already exist.
async function createIfNew(
  { payload, req }: Ctx,
  collection: CollectionSlug,
  slug: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    req,
  })
  if (existing.docs[0]) return false
  await payload.create({
    collection,
    depth: 0,
    req,
    context: { disableRevalidate: true },
    data: data as any,
  })
  return true
}

export const seedDataLayer = async (ctx: Ctx): Promise<void> => {
  const { payload } = ctx
  payload.logger.info('Seeding data layer (taxonomy + specialists/team/events)…')

  // 1) Taxonomy lookups first.
  const specialtyMap = await upsertTerms(ctx, 'specialties', SPECIALTIES)
  const claimMap = await upsertTerms(ctx, 'claim-types', CLAIM_TYPES)
  const assessmentMap = await upsertTerms(ctx, 'assessment-types', ASSESSMENT_TYPES)
  const areaMap = await upsertTerms(ctx, 'areas-of-expertise', AREAS_OF_EXPERTISE)
  payload.logger.info('— Taxonomy seeded')

  // 2) Specialists.
  let specialistCount = 0
  for (const s of SPECIALISTS) {
    const created = await createIfNew(ctx, 'specialists', s.slug, {
      title: s.title,
      slug: s.slug,
      lastName: s.lastName,
      position: s.position,
      specialty: specialtyMap.get(s.specialty),
      claimTypes: resolve(claimMap, s.claimTypes),
      assessmentTypes: resolve(assessmentMap, s.assessmentTypes),
      areasOfExpertise: resolve(areaMap, s.areasOfExpertise),
      locations: s.locations.map((location) => ({ location })),
      qualifications: s.qualifications.map((qualification) => ({ qualification })),
      accreditations: s.accreditations.map((accreditation) => ({ accreditation })),
      bio: plainTextToLexical(s.bio),
      _status: 'published',
    })
    if (created) specialistCount++
  }
  payload.logger.info(`— Specialists seeded (${specialistCount} new)`)

  // 3) Team.
  let teamCount = 0
  for (const m of TEAM) {
    const created = await createIfNew(ctx, 'team', m.slug, {
      title: m.title,
      slug: m.slug,
      role: m.role,
      department: m.department,
      order: m.order,
      bio: plainTextToLexical(m.bio),
      _status: 'published',
    })
    if (created) teamCount++
  }
  payload.logger.info(`— Team seeded (${teamCount} new)`)

  // 4) Events.
  let eventCount = 0
  for (const e of EVENTS) {
    const created = await createIfNew(ctx, 'events', e.slug, {
      title: e.title,
      slug: e.slug,
      eventType: e.eventType,
      date: new Date(e.date).toISOString(),
      timeLabel: e.timeLabel,
      location: e.location,
      host: e.host,
      registrationUrl: e.registrationUrl || undefined,
      excerpt: e.excerpt,
      _status: 'published',
    })
    if (created) eventCount++
  }
  payload.logger.info(`— Events seeded (${eventCount} new)`)

  payload.logger.info('Data layer seed complete.')
}
