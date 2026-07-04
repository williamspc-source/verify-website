'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/utilities/ui'

export type RosterPerson = {
  id: string
  name: string
  position: string | null
  slug: string | null
  locations: string[]
}
export type SpecialtyEntry = {
  id: string
  title: string
  description: string | null
  categoryId: string | null
  keyAreas: string[]
  specialists: RosterPerson[]
}
export type Category = { id: string; title: string }

export const SpecialtyClient: React.FC<{
  categories: Category[]
  entries: SpecialtyEntry[]
  showFilterBar: boolean
  showRosters: boolean
  showKeyAreas: boolean
}> = ({ categories, entries, showFilterBar, showRosters, showKeyAreas }) => {
  const [cat, setCat] = useState<string>('all')
  const [open, setOpen] = useState<string | null>(null)

  const visible = cat === 'all' ? entries : entries.filter((e) => e.categoryId === cat)

  return (
    <div className="vf-specialty-directory">
      {showFilterBar && categories.length ? (
        <div className="vf-specialty-filter">
          <button
            type="button"
            className={cn('tab-btn', cat === 'all' && 'active')}
            onClick={() => setCat('all')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={cn('tab-btn', cat === c.id && 'active')}
              onClick={() => setCat(c.id)}
            >
              {c.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="vf-specialty-accordion">
        {visible.map((e) => {
          const isOpen = open === e.id
          return (
            <div key={e.id} className={cn('vf-specialty-item', isOpen && 'is-open')}>
              <button
                type="button"
                className="vf-specialty-item__head"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : e.id)}
              >
                <span className="vf-specialty-item__title">{e.title}</span>
                {showRosters ? (
                  <span className="vf-specialty-item__count">{e.specialists.length}</span>
                ) : null}
                <span className="vf-specialty-item__chevron" aria-hidden>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen ? (
                <div className="vf-specialty-item__body">
                  {e.description ? <p>{e.description}</p> : null}
                  {showKeyAreas && e.keyAreas.length ? (
                    <ul className="vf-tag-list">
                      {e.keyAreas.map((k) => (
                        <li key={k} className="vf-tag">
                          {k}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {showRosters && e.specialists.length ? (
                    <ul className="vf-specialty-roster">
                      {e.specialists.map((p) => (
                        <li key={p.id}>
                          {p.slug ? (
                            <Link href={`/specialists/${p.slug}`}>{p.name}</Link>
                          ) : (
                            <span>{p.name}</span>
                          )}
                          {p.position ? <span className="vf-specialty-roster__role"> — {p.position}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
