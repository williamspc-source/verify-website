import type { Payload, PayloadRequest } from 'payload'
import { readFileSync } from 'fs'
import path from 'path'

/* =====================================================================
   Non-destructive scaffold seed for the VERIFY site.

   Unlike the template `seed` (endpoints/seed), this does NOT wipe any
   collections. It creates the nested page tree (idempotently, by slug)
   and populates the Header + Footer globals so every nav link resolves.

   The data-driven section landings (specialists, the-waiting-room,
   events) are created as plain placeholder pages for now; later they
   gain a list/archive block rather than a new route.
   ===================================================================== */

// ── Minimal Lexical helpers (matches endpoints/seed/home-static.ts) ──
const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const heading = (text: string, tag: 'h1' | 'h2' = 'h1') => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const richText = (children: unknown[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const heroFor = (title: string) => ({
  type: 'lowImpact' as const,
  richText: richText([heading(title, 'h1')]),
})

const placeholderLayout = (title: string) => [
  {
    blockType: 'content' as const,
    columns: [
      {
        size: 'full' as const,
        enableLink: false,
        richText: richText([
          paragraph(`The “${title}” page is scaffolded and ready for content.`),
        ]),
      },
    ],
  },
]

// ── Page tree (parent-first order so parents exist before children) ──
type PageNode = { slug: string; title: string; parent?: string }

const PAGE_TREE: PageNode[] = [
  { slug: 'home', title: 'Home' },
  { slug: 'contact', title: 'Contact Us' },

  { slug: 'about', title: 'About VERIFY' },
  { slug: 'meet-the-team', title: 'Meet the Team', parent: 'about' },

  { slug: 'services', title: 'Our Services' },
  { slug: 'educational-services', title: 'Educational Services', parent: 'services' },
  { slug: 'medico-legal', title: 'Medico-Legal Services', parent: 'services' },
  { slug: 'ime', title: 'Independent Medical Examination (IME)', parent: 'medico-legal' },
  { slug: 'jme', title: 'Joint Medical Examination (JME)', parent: 'medico-legal' },
  { slug: 'reporting-services', title: 'Other Reporting Services', parent: 'medico-legal' },
  { slug: 'admin-services', title: 'Administrative Services', parent: 'medico-legal' },

  { slug: 'specialists', title: 'Specialists' },

  { slug: 'information-centre', title: 'Information Centre' },
  { slug: 'for-clients', title: 'For Clients', parent: 'information-centre' },
  { slug: 'for-claimants', title: 'For Claimants', parent: 'information-centre' },

  { slug: 'the-waiting-room', title: 'The Waiting Room' },
  { slug: 'events', title: 'Events & Seminars' },

  { slug: 'legal', title: 'Legal' },
  { slug: 'privacy-policy', title: 'Privacy Policy', parent: 'legal' },
  { slug: 'terms-conditions', title: 'Terms & Conditions', parent: 'legal' },
]

const LINKEDIN = 'https://www.linkedin.com/company/verify-medico-legal-solutions/'
const FACEBOOK = 'https://www.facebook.com/profile.php?id=100066385885275'

export const seedVerify = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding VERIFY scaffold (non-destructive)…')

  const idBySlug = new Map<string, number | string>()

  // Create (or reuse) every page, parents first.
  for (const node of PAGE_TREE) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: node.slug } },
      limit: 1,
      depth: 0,
      req,
    })

    if (existing.docs[0]) {
      idBySlug.set(node.slug, existing.docs[0].id)
      payload.logger.info(`— Page exists, skipping: /${node.slug}`)
      continue
    }

    const parentId = node.parent ? idBySlug.get(node.parent) : undefined

    const created = await payload.create({
      collection: 'pages',
      depth: 0,
      req,
      context: { disableRevalidate: true },
      data: {
        title: node.title,
        slug: node.slug,
        _status: 'published',
        hero: heroFor(node.title),
        layout: placeholderLayout(node.title),
        ...(parentId ? { parent: parentId } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })

    idBySlug.set(node.slug, created.id)
    payload.logger.info(`— Created page: /${node.slug}`)
  }

  // ── Link helpers ──
  const pageLink = (slug: string, label: string) => ({
    link: {
      type: 'reference' as const,
      reference: { relationTo: 'pages' as const, value: idBySlug.get(slug)! },
      label,
      url: null,
      newTab: false,
    },
  })

  // ── Header global ──
  await payload.updateGlobal({
    slug: 'header',
    depth: 0,
    req,
    context: { disableRevalidate: true },
    data: {
      navItems: [
        {
          ...pageLink('about', 'About Us'),
          subItems: [
            pageLink('about', 'About VERIFY'),
            pageLink('meet-the-team', 'Meet the Team'),
          ],
        },
        {
          ...pageLink('services', 'Services'),
          subItems: [
            {
              ...pageLink('medico-legal', 'Medico-Legal Services'),
              subSubItems: [
                pageLink('ime', 'Independent Medical Examination (IME)'),
                pageLink('jme', 'Joint Medical Examination (JME)'),
                pageLink('reporting-services', 'Other Reporting Services'),
                pageLink('admin-services', 'Administrative Services'),
              ],
            },
            pageLink('educational-services', 'Educational Services'),
          ],
        },
        {
          ...pageLink('information-centre', 'Information Centre'),
          subItems: [
            pageLink('information-centre', 'Overview & FAQs'),
            pageLink('for-clients', 'For Clients'),
            pageLink('for-claimants', 'For Claimants'),
          ],
        },
        pageLink('specialists', 'Specialists'),
        pageLink('the-waiting-room', 'The Waiting Room'),
        pageLink('events', 'Events & Seminars'),
        pageLink('contact', 'Contact Us'),
      ],
      cta: {
        enabled: true,
        link: pageLink('contact', 'Book an Appointment').link,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })
  payload.logger.info('— Populated header global')

  // ── Footer global ──
  await payload.updateGlobal({
    slug: 'footer',
    depth: 0,
    req,
    context: { disableRevalidate: true },
    data: {
      tagline: 'Ensuring Accuracy, Empowering Justice',
      columns: [
        {
          title: 'Key Pages',
          links: [
            pageLink('home', 'Home'),
            pageLink('about', 'About VERIFY'),
            pageLink('services', 'Our Services'),
            pageLink('specialists', 'Specialists'),
            pageLink('information-centre', 'Information Centre'),
            pageLink('the-waiting-room', 'The Waiting Room'),
            pageLink('events', 'Events & Seminars'),
            pageLink('contact', 'Contact us'),
          ],
        },
      ],
      contact: {
        phone: '07 3356 0469',
        phoneHref: 'tel:0733560469',
        email: 'admin@vmls.com.au',
        address: 'Level 18, 127 Creek Street\nBrisbane QLD 4000',
      },
      hours: [{ days: 'Monday to Friday', time: '08:30 – 17:00' }],
      social: [
        { platform: 'linkedin', url: LINKEDIN },
        { platform: 'facebook', url: FACEBOOK },
      ],
      legalLinks: [
        pageLink('privacy-policy', 'Privacy Policy'),
        pageLink('terms-conditions', 'Terms & Conditions'),
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })
  payload.logger.info('— Populated footer global')

  // ── Branding: upload logo + favicon to Media, populate Site Settings ──
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, req })

    if (settings?.logo) {
      payload.logger.info('— Site settings already has a logo, skipping branding seed')
    } else {
      const publicDir = path.resolve(process.cwd(), 'public')
      const logoFile = readFileSync(path.join(publicDir, 'verify-logo.png'))
      const faviconFile = readFileSync(path.join(publicDir, 'favicon.png'))

      const logoDoc = await payload.create({
        collection: 'media',
        req,
        data: { alt: 'VERIFY Medico-Legal Solutions logo' },
        file: {
          name: 'verify-logo.png',
          data: logoFile,
          mimetype: 'image/png',
          size: logoFile.length,
        },
      })

      const faviconDoc = await payload.create({
        collection: 'media',
        req,
        data: { alt: 'VERIFY shield' },
        file: {
          name: 'verify-favicon.png',
          data: faviconFile,
          mimetype: 'image/png',
          size: faviconFile.length,
        },
      })

      await payload.updateGlobal({
        slug: 'site-settings',
        depth: 0,
        req,
        context: { disableRevalidate: true },
        data: {
          siteName: 'VERIFY Medico-Legal Solutions',
          logo: logoDoc.id,
          favicon: faviconDoc.id,
          colors: {
            primary: '#1c75bc',
            primaryStrong: '#155fa0',
            text: '#414042',
            mutedText: '#737373',
            accent: '#cbe5fa',
            border: '#c6c6c6',
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      })

      payload.logger.info('— Uploaded logo + favicon and populated site settings')
    }
  } catch (e) {
    payload.logger.error({ err: e, message: 'Branding seed skipped (public asset files missing?)' })
  }

  payload.logger.info('VERIFY scaffold seed complete.')
}
