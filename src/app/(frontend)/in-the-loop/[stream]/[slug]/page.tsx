import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
import { CMSLink } from '@/components/Link'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { mediaFocal, focalImgStyle } from '@/utilities/focalPoint'
import { ArticleToc } from './ArticleToc'

import type { ArticleSetting, Category, Post, Stream } from '@/payload-types'

type Args = { params: Promise<{ stream?: string; slug?: string }> }

// "5 May 2026"-style date used across the article chrome.
const fmtDate = (value?: string | null): string =>
  value
    ? new Date(value).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

// Slugify a heading label into a stable anchor id for the table of contents.
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Recursively read the plain text out of a Lexical node.
type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] }
const nodeText = (node: LexNode): string =>
  node.text ?? (Array.isArray(node.children) ? node.children.map(nodeText).join('') : '')

// Build a table of contents from the top-level h2 headings in the post body.
const tocFromContent = (post: Post): { id: string; text: string }[] => {
  if (post.showToc === false) return []
  const children = (post.content?.root?.children as LexNode[] | undefined) ?? []
  return children
    .filter((n) => n.type === 'heading' && n.tag === 'h2')
    .map((n) => {
      const text = nodeText(n).trim()
      return { id: slugify(text), text }
    })
    .filter((i) => i.text)
}

// Resolve the URL for an In-the-Loop post (uses its stream folder when present).
const postHref = (post: Pick<Post, 'slug' | 'stream'>): string => {
  const stream = typeof post.stream === 'object' && post.stream ? post.stream : null
  return stream?.slug ? `/in-the-loop/${stream.slug}/${post.slug}` : `/in-the-loop/${post.slug}`
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'posts',
    draft: false,
    depth: 1,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
  })
  return res.docs
    .filter((d) => d.slug && typeof d.stream === 'object' && (d.stream as Stream)?.slug)
    .map((d) => ({ stream: (d.stream as Stream).slug, slug: d.slug }))
}

export default async function InTheLoopArticlePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { stream: streamParam = '', slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/in-the-loop/${streamParam}/${decodedSlug}`

  const post = await queryPostBySlug({ slug: decodedSlug })
  if (!post) return <PayloadRedirects url={url} />

  const settings = (await getCachedGlobal('article-settings', 1)()) as ArticleSetting
  const sidebarCards = Array.isArray(settings?.sidebarCards) ? settings.sidebarCards : []
  const labels = (settings?.labels ?? {}) as Record<string, string | null | undefined>

  const stream = typeof post.stream === 'object' && post.stream ? post.stream : null
  const streamTitle = stream?.title
  const streamSlug = stream?.slug
  // The hub's sticky section ids use short forms for three streams; map so the
  // breadcrumb's "/in-the-loop#<stream>" anchor lands on the right hub section.
  const streamHubAnchor =
    (
      {
        'news-updates': 'news',
        'industry-insights': 'insights',
        'specialist-spotlights': 'spotlights',
      } as Record<string, string>
    )[streamSlug || ''] || streamSlug

  const heroImage = typeof post.heroImage === 'object' ? post.heroImage : null

  // Byline: prefer the free-text author fields, then fall back to a linked
  // Team member / Specialist source.
  const author = post.author ?? {}
  const src =
    author.source && typeof author.source === 'object' && typeof author.source.value === 'object'
      ? (author.source.value as unknown as Record<string, unknown>)
      : null
  const authorName = author.name || (src?.title as string) || (src?.name as string) || ''
  const authorRole = author.role || (src?.role as string) || (src?.position as string) || ''
  const authorBio = author.bio || (typeof src?.bio === 'string' ? (src.bio as string) : '') || ''
  // Author avatar: a per-post uploaded photo overrides the linked person's
  // profile photo (Team member / Specialist via `author.source`); when neither
  // exists we keep the placeholder icon.
  const authorPhoto =
    (author.photo && typeof author.photo === 'object' && author.photo) ||
    (src && typeof src.photo === 'object' && src.photo) ||
    null
  const authorFocal = mediaFocal(authorPhoto)

  const toc = tocFromContent(post)

  const related = Array.isArray(post.relatedPosts)
    ? post.relatedPosts.filter((p): p is Post => typeof p === 'object' && p !== null)
    : []

  const tags = Array.isArray(post.categories)
    ? post.categories
        .filter((c): c is Category => typeof c === 'object' && c !== null)
        .map((c) => c.title)
        .filter((t): t is string => Boolean(t))
    : []

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="art-hero">
        {heroImage ? (
          <Media
            resource={heroImage}
            className="art-hero__media"
            imgClassName="art-hero__img"
          />
        ) : null}
        <div className="art-hero-overlay" />
        <div className="art-hero-content">
          <div className="container">
            {streamTitle ? (
              <div className="art-hero-tag">
                {stream?.icon ? <Icon name={stream.icon} className="size-3" /> : null}
                {streamTitle}
              </div>
            ) : null}
            <h1 className="art-hero-title">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* ── Meta bar ──────────────────────────────────────── */}
      <div className="art-meta-bar">
        <div className="container">
          <div className="art-meta-inner">
            <nav aria-label="Breadcrumb" className="art-breadcrumb">
              <a href="/">{labels.breadcrumbHomeLabel || 'Home'}</a>
              <span className="art-breadcrumb-sep">›</span>
              <a href="/in-the-loop">{labels.breadcrumbSectionLabel || 'In the Loop'}</a>
              {streamTitle ? (
                <>
                  <span className="art-breadcrumb-sep">›</span>
                  <a href={streamSlug ? `/in-the-loop#${streamHubAnchor}` : '/in-the-loop'}>
                    {streamTitle}
                  </a>
                </>
              ) : null}
            </nav>
            <div className="art-meta-right">
              {authorName ? (
                <div className="art-meta-author">
                  {labels.bylinePrefix || 'By '}
                  <strong>{authorName}</strong>
                  {authorRole ? `, ${authorRole}` : ''}
                </div>
              ) : null}
              {post.publishedAt ? (
                <div className="art-meta-date">{fmtDate(post.publishedAt)}</div>
              ) : null}
              {post.readTime ? (
                <div className="art-meta-read">
                  {post.readTime} {labels.minReadSuffix || 'min read'}
                </div>
              ) : null}
              <div className="art-share-btns">
                <a
                  aria-label={labels.shareLinkedinLabel || 'Share on LinkedIn'}
                  className="art-share-btn"
                  href="https://www.linkedin.com/sharing/share-offsite/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  in
                </a>
                <a
                  aria-label={labels.shareCopyLabel || 'Copy link'}
                  className="art-share-btn"
                  href={url}
                >
                  <Icon name="link" className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-column layout ───────────────────────────────── */}
      <div className="container">
        <div className="art-layout">
          {/* LEFT: table of contents (scroll-spy client component) */}
          {toc.length ? (
            <ArticleToc items={toc} label={labels.toc || 'In This Article'} />
          ) : (
            <aside aria-hidden className="art-toc" />
          )}

          {/* CENTRE: article body */}
          <article className="art-body">
            <RichText data={post.content} enableGutter={false} enableProse={false} />

            {tags.length ? (
              <div className="art-tags-footer">
                <span className="art-tags-label">{labels.topics || 'Topics'}:</span>
                {tags.map((tag) => (
                  <span key={tag} className="art-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {authorName ? (
              <div className="art-author-card">
                <div className="art-author-avatar">
                  {authorFocal.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={authorFocal.url}
                      alt={authorName}
                      style={focalImgStyle(authorFocal.focus, authorFocal.zoom, {
                        width: '100%',
                        height: '100%',
                      })}
                    />
                  ) : (
                    <Icon name="user" className="size-6" weight="light" />
                  )}
                </div>
                <div>
                  <div className="art-author-name">{authorName}</div>
                  {authorRole ? <div className="art-author-role">{authorRole}</div> : null}
                  {authorBio ? <div className="art-author-bio">{authorBio}</div> : null}
                </div>
              </div>
            ) : null}
          </article>

          {/* RIGHT: sidebar */}
          <aside className="art-sidebar">
            {related.length ? (
              <div className="art-related-section">
                <div className="art-related-label">{labels.related || 'You Might Also Like'}</div>
                <div className="art-related-list">
                  {related.map((rp) => {
                    const rpStream =
                      typeof rp.stream === 'object' && rp.stream ? rp.stream : null
                    return (
                      <a key={rp.id} className="art-related-item" href={postHref(rp)}>
                        {rpStream?.title ? (
                          <span className="art-related-tag">{rpStream.title}</span>
                        ) : null}
                        <span className="art-related-title">{rp.title}</span>
                        {rp.publishedAt ? (
                          <span className="art-related-date">{fmtDate(rp.publishedAt)}</span>
                        ) : null}
                      </a>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {sidebarCards.map((card, i) => {
              const dark = i === 0
              return (
                <div key={card.id ?? i} className={dark ? 'art-cta-card' : 'art-cta-card-2'}>
                  {dark && card.icon ? (
                    <div className="art-cta-card-icon">
                      <Icon name={card.icon} className="size-6" weight="regular" />
                    </div>
                  ) : null}
                  <h4>{card.heading}</h4>
                  {card.body ? <p>{card.body}</p> : null}
                  <CMSLink
                    className={dark ? 'art-cta-btn' : 'art-cta-btn-2'}
                    type={card.link?.type}
                    reference={card.link?.reference}
                    url={card.link?.url}
                    label={card.link?.label}
                    newTab={card.link?.newTab}
                  />
                </div>
              )
            })}
          </aside>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: post as never })
}

// The [stream] segment is only for the URL folder — the post is looked up by slug.
const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
