'use client'

import React, { useEffect, useRef, useState } from 'react'

// Keep this identical to the server-side slugify in page.tsx so the ids we
// assign to the rendered <h2> headings line up with the TOC anchor hrefs.
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type TocItem = { id: string; text: string }

type Props = {
  items: TocItem[]
  label: string
}

/**
 * Scroll-spy table of contents for the article page.
 *
 * The article body is rendered by the shared <RichText> converter, whose
 * default heading converter emits <h2> without ids — so on mount we slugify
 * each `.art-body h2` and assign the matching id, then watch those headings
 * with an IntersectionObserver to highlight the active TOC link (mirrors the
 * reference `.art-toc-link.is-active` behaviour + smooth-scroll on click).
 */
export const ArticleToc: React.FC<Props> = ({ items, label }) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!items.length) return

    const body = document.querySelector('.art-body')
    if (!body) return

    const wanted = new Set(items.map((i) => i.id))

    // Assign ids to the body headings so the anchors resolve and the observer
    // has stable targets to watch.
    const headings = Array.from(body.querySelectorAll<HTMLHeadingElement>('h2'))
    const targets: HTMLHeadingElement[] = []
    headings.forEach((h) => {
      const id = h.id || slugify(h.textContent ?? '')
      if (id && wanted.has(id)) {
        if (!h.id) h.id = id
        targets.push(h)
      }
    })

    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId((entry.target as HTMLElement).id)
        })
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
  }

  return (
    <aside ref={navRef} aria-label="Article navigation" className="art-toc">
      <div className="art-toc-label">{label}</div>
      <ul className="art-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={`art-toc-link${item.id === activeId ? ' is-active' : ''}`}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default ArticleToc
