import type { CollectionSlug, Payload, PayloadRequest } from 'payload'
import { readdirSync } from 'fs'
import path from 'path'

import { AREAS_OF_EXPERTISE, ASSESSMENT_TYPES, CLAIM_TYPES, SPECIALTIES, type Term } from './data/taxonomy'
import { SPECIALISTS } from './data/specialists'
import { TEAM } from './data/team'
import { EVENTS } from './data/events'
import { SERVICES } from './data/services'
import { TESTIMONIALS } from './data/testimonials'
import { plainTextToLexical } from './data/richText'

type Ctx = { payload: Payload; req: PayloadRequest }

// Blog ("In the Loop") categories — the taxonomy behind posts. Colours map to the
// per-category chip styling in the design reference; all editable in the admin.
const BLOG_CATEGORIES: { title: string; slug: string; color: string }[] = [
  { title: 'News & Updates', slug: 'news-updates', color: '#1c75bc' },
  { title: 'AAMLE Events', slug: 'aamle-events', color: '#2d8fe8' },
  { title: 'Industry Insights', slug: 'industry-insights', color: '#1c75bc' },
  { title: 'Specialist Spotlights', slug: 'specialist-spotlights', color: '#414042' },
  { title: 'Resources', slug: 'resources', color: '#1c75bc' },
  { title: 'Q&A Insights', slug: 'qa-insights', color: '#1c75bc' },
  { title: 'Staff Narratives', slug: 'staff-narratives', color: '#1c75bc' },
]

// "In the Loop" streams — the section an article belongs to (drives its URL folder
// + hub placement). Distinct from the topic-chip categories above.
const STREAMS: { title: string; slug: string; icon: string; order: number }[] = [
  { title: 'Featured', slug: 'featured', icon: 'star', order: 0 },
  { title: 'News & Updates', slug: 'news-updates', icon: 'bell-ringing', order: 1 },
  { title: 'Industry Insights', slug: 'industry-insights', icon: 'chart-bar', order: 2 },
  { title: 'Specialist Spotlights', slug: 'specialist-spotlights', icon: 'user-circle', order: 3 },
  { title: 'QA Insights', slug: 'qa-insights', icon: 'shield-check', order: 4 },
  { title: 'Staff Narratives', slug: 'staff-narratives', icon: 'chats', order: 5 },
  { title: 'Resources', slug: 'resources', icon: 'files', order: 6 },
]

// Specialty groups for the Specialty List filter bar / accordion.
const SPECIALTY_CATEGORIES: { title: string; slug: string; icon: string; order: number }[] = [
  { title: 'Surgery', slug: 'surgery', icon: 'first-aid', order: 0 },
  { title: 'Psychiatry & Psychology', slug: 'psychiatry-psychology', icon: 'brain', order: 1 },
  { title: 'Medicine', slug: 'medicine', icon: 'stethoscope', order: 2 },
  { title: 'Allied Health', slug: 'allied-health', icon: 'handshake', order: 3 },
]

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

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Locations are a free-form taxonomy — seed them from the distinct strings used
// across the specialist data so there's a single source of truth (no drift).
async function upsertLocations(
  { payload, req }: Ctx,
  titles: string[],
): Promise<Map<string, number | string>> {
  const map = new Map<string, number | string>()
  for (const title of titles) {
    const existing = await payload.find({
      collection: 'locations',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs[0]) {
      map.set(title, existing.docs[0].id)
      continue
    }
    const created = await payload.create({
      collection: 'locations',
      depth: 0,
      req,
      context: { disableRevalidate: true },
      data: { title, slug: slugify(title) } as any,
    })
    map.set(title, created.id)
  }
  return map
}

// Accreditations are now a controlled taxonomy (was a free-text array). Seed the
// distinct strings used across the specialist data → Map<label, id>.
async function upsertAccreditations(
  { payload, req }: Ctx,
  labels: string[],
): Promise<Map<string, number | string>> {
  const map = new Map<string, number | string>()
  for (const title of labels) {
    const existing = await payload.find({
      collection: 'accreditations',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs[0]) {
      map.set(title, existing.docs[0].id)
      continue
    }
    const created = await payload.create({
      collection: 'accreditations',
      depth: 0,
      req,
      context: { disableRevalidate: true },
      data: { title, slug: slugify(title) } as any,
    })
    map.set(title, created.id)
  }
  return map
}

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
  const locationMap = await upsertLocations(
    ctx,
    Array.from(new Set(SPECIALISTS.flatMap((s) => s.locations))),
  )
  const accreditationMap = await upsertAccreditations(
    ctx,
    Array.from(new Set(SPECIALISTS.flatMap((s) => s.accreditations))),
  )
  // Specialty categories + In-the-Loop streams (new taxonomies).
  for (const c of SPECIALTY_CATEGORIES) {
    await createIfNew(ctx, 'specialty-categories', c.slug, {
      title: c.title,
      slug: c.slug,
      icon: c.icon,
      order: c.order,
    })
  }
  for (const st of STREAMS) {
    await createIfNew(ctx, 'streams', st.slug, {
      title: st.title,
      slug: st.slug,
      icon: st.icon,
      order: st.order,
    })
  }
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
      locations: s.locations.map((l) => locationMap.get(l)).filter((id) => id != null),
      languages: [{ language: 'English' }],
      qualifications: s.qualifications.map((qualification) => ({ qualification })),
      accreditations: s.accreditations
        .map((a) => accreditationMap.get(a))
        .filter((id): id is number | string => id != null),
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

  // 5) Blog categories ("In the Loop").
  let categoryCount = 0
  for (const c of BLOG_CATEGORIES) {
    const created = await createIfNew(ctx, 'categories', c.slug, {
      title: c.title,
      slug: c.slug,
      color: c.color,
    })
    if (created) categoryCount++
  }
  payload.logger.info(`— Blog categories seeded (${categoryCount} new)`)

  // 6) Services.
  let serviceCount = 0
  for (const s of SERVICES) {
    const created = await createIfNew(ctx, 'services', s.slug, {
      title: s.title,
      slug: s.slug,
      category: s.category,
      icon: s.icon,
      shortDescription: s.shortDescription,
      order: s.order,
    })
    if (created) serviceCount++
  }
  payload.logger.info(`— Services seeded (${serviceCount} new)`)

  // 7) Testimonials (no slug — seed once when the collection is empty).
  const existingTestimonials = await ctx.payload.find({
    collection: 'testimonials',
    limit: 1,
    depth: 0,
    req: ctx.req,
  })
  if (existingTestimonials.totalDocs === 0) {
    for (const t of TESTIMONIALS) {
      await ctx.payload.create({
        collection: 'testimonials',
        depth: 0,
        req: ctx.req,
        context: { disableRevalidate: true },
        data: t as any,
      })
    }
    payload.logger.info(`— Testimonials seeded (${TESTIMONIALS.length} new)`)
  } else {
    payload.logger.info('— Testimonials already exist, skipping')
  }

  // 8) Offices — the head office used by the Contact / For-Claimants location module.
  await createIfNew(ctx, 'offices', 'brisbane', {
    title: 'Brisbane (Head Office)',
    slug: 'brisbane',
    address: 'Level 18, 127 Creek Street\nBrisbane QLD 4000',
    phone: '07 3356 0469',
    email: 'admin@vmls.com.au',
    hours: [{ days: 'Monday – Friday', time: '08:30 – 17:00' }],
    hoursNote:
      'For 7:45am appointments, please be advised that our office is not staffed until 7:30am.',
    order: 0,
  })
  payload.logger.info('— Offices seeded')

  // 9) Backfill specialist + team photos from the design-reference assets.
  await backfillPhotos(ctx)

  payload.logger.info('Data layer seed complete.')
}

// Title-prefix tokens stripped when matching a person to their photo filename.
const NAME_TOKENS = new Set([
  'dr', 'drs', 'adj', 'adjunct', 'prof', 'professor', 'assoc', 'associate', 'a', 'aprof', 'ms',
  'mr', 'mrs', 'mx',
])
const nameKey = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((t) => t && !NAME_TOKENS.has(t))
    .join(' ')

// Uploads a Media doc from disk once; reuses an existing doc by matching alt.
async function getOrCreateMedia(
  { payload, req }: Ctx,
  absPath: string,
  alt: string,
): Promise<number | string | null> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
    depth: 0,
    req,
  })
  if (existing.docs[0]) return existing.docs[0].id
  try {
    const created = await payload.create({
      collection: 'media',
      data: { alt } as any,
      filePath: absPath,
      req,
      context: { disableRevalidate: true },
    })
    return created.id
  } catch (e) {
    payload.logger.warn(`  · media upload failed for ${alt}: ${(e as Error).message}`)
    return null
  }
}

async function backfillPhotos(ctx: Ctx): Promise<void> {
  const { payload, req } = ctx
  const imagesDir = path.join(process.cwd(), 'public', 'assets', 'images')
  const isImg = (f: string) => /\.(png|jpe?g|webp)$/i.test(f)

  // Specialists — filenames are display names ("Dr Andrew Renaut.png"); match by normalised name.
  try {
    const specDir = path.join(imagesDir, 'specialist')
    const specByKey = new Map(
      readdirSync(specDir)
        .filter(isImg)
        .map((f) => [nameKey(f), f] as const),
    )
    let sp = 0
    for (const s of SPECIALISTS) {
      const file = specByKey.get(nameKey(s.title))
      if (!file) continue
      const found = await payload.find({
        collection: 'specialists',
        where: { slug: { equals: s.slug } },
        limit: 1,
        depth: 0,
        req,
      })
      const rec = found.docs[0] as { id: number | string; photo?: unknown } | undefined
      if (!rec || rec.photo) continue
      const mediaId = await getOrCreateMedia(ctx, path.join(specDir, file), s.title)
      if (mediaId) {
        await payload.update({
          collection: 'specialists',
          id: rec.id,
          data: { photo: mediaId } as any,
          req,
          context: { disableRevalidate: true },
        })
        sp++
      }
    }
    payload.logger.info(`— Specialist photos backfilled (${sp})`)
  } catch (e) {
    payload.logger.warn(`— Specialist photo backfill skipped: ${(e as Error).message}`)
  }

  // Team — filenames are slugs ("wes-lerch.png").
  try {
    const teamDir = path.join(imagesDir, 'team')
    const teamFiles = new Set(readdirSync(teamDir).filter(isImg))
    let tp = 0
    for (const m of TEAM) {
      const file = `${m.slug}.png`
      if (!teamFiles.has(file)) continue
      const found = await payload.find({
        collection: 'team',
        where: { slug: { equals: m.slug } },
        limit: 1,
        depth: 0,
        req,
      })
      const rec = found.docs[0] as { id: number | string; photo?: unknown } | undefined
      if (!rec || rec.photo) continue
      const mediaId = await getOrCreateMedia(ctx, path.join(teamDir, file), m.title)
      if (mediaId) {
        await payload.update({
          collection: 'team',
          id: rec.id,
          data: { photo: mediaId } as any,
          req,
          context: { disableRevalidate: true },
        })
        tp++
      }
    }
    payload.logger.info(`— Team photos backfilled (${tp})`)
  } catch (e) {
    payload.logger.warn(`— Team photo backfill skipped: ${(e as Error).message}`)
  }
}
