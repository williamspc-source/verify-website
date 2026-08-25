'use client'
import { FieldLabel, useField } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

import { getClientSideURL } from '@/utilities/getURL'

/**
 * Browse all 1,513 Phosphor icons and choose which ones editors may pick.
 *
 * ## Why it will not draw 1,513 icons at once
 *
 * Every preview is an HTTP request for an SVG. Rendering the whole set would fire
 * 1,513 of them the moment the screen opens, so results are capped and the count
 * is stated — a screen that quietly showed the first 200 would have an admin
 * concluding an icon does not exist.
 *
 * ## Why removal is safe
 *
 * Taking an icon out of this list stops it being OFFERED. It does not touch a
 * page that already uses it, and `IconSelect` still shows an icon the document
 * it is editing already holds. So this screen cannot blank anything.
 */

const VISIBLE_LIMIT = 120

let allNames: string[] | null = null
let inFlight: Promise<string[]> | null = null

const loadNames = (): Promise<string[]> => {
  if (allNames) return Promise.resolve(allNames)
  if (inFlight) return inFlight
  inFlight = fetch(`${getClientSideURL()}/api/icon/phosphor`)
    .then((r) => r.json())
    .then((d) => {
      allNames = (d?.names ?? []) as string[]
      return allNames
    })
    .catch(() => [] as string[])
    .finally(() => {
      inFlight = null
    })
  return inFlight
}

const Preview: React.FC<{ name: string; size?: number }> = ({ name, size = 24 }) => (
  <span
    aria-hidden
    className="vf-icon-select__preview"
    style={{
      width: size,
      height: size,
      flex: `0 0 ${size}px`,
      WebkitMaskImage: `url("${getClientSideURL()}/api/icon/phosphor/${encodeURIComponent(name)}")`,
      maskImage: `url("${getClientSideURL()}/api/icon/phosphor/${encodeURIComponent(name)}")`,
    }}
  />
)

export const IconLibraryPicker: React.FC<{
  path: string
  readOnly?: boolean
  field?: { label?: string; admin?: { description?: string } }
}> = ({ path, readOnly, field }) => {
  const { value, setValue } = useField<string[]>({ path })
  const [names, setNames] = useState<string[]>(allNames ?? [])
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    void loadNames().then((n) => active && setNames(n))
    return () => {
      active = false
    }
  }, [])

  const chosen = useMemo(() => (value ?? []).filter(Boolean), [value])
  const chosenSet = useMemo(() => new Set(chosen), [chosen])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as string[]
    return names.filter((n) => n.includes(q))
  }, [names, query])

  const toggle = (name: string) => {
    if (readOnly) return
    setValue(chosenSet.has(name) ? chosen.filter((n) => n !== name) : [...chosen, name])
  }

  const label = field?.label || 'Icons editors can choose'

  return (
    <div className="field-type vf-icon-library">
      <FieldLabel label={label} path={path} />

      <p className="vf-icon-library__count">
        {chosen.length ? (
          <>
            <strong>{chosen.length.toLocaleString()}</strong> icon{chosen.length === 1 ? '' : 's'} in
            the picker.
          </>
        ) : (
          // The fallback, said plainly. An admin looking at an empty list needs to
          // know editors still have icons, or they will assume they broke it.
          <>
            Empty, so editors are offered the <strong>built-in set</strong>. Add one below and this
            list takes over.
          </>
        )}
      </p>

      {chosen.length ? (
        <div className="vf-icon-select__grid vf-icon-library__chosen">
          {chosen.map((name) => (
            <button
              key={name}
              type="button"
              className="vf-icon-select__option vf-icon-select__option--selected"
              title={`Remove ${name}`}
              onClick={() => toggle(name)}
              disabled={readOnly}
            >
              <Preview name={name} />
              <span>{name.replace(/-/g, ' ')}</span>
            </button>
          ))}
        </div>
      ) : null}

      {!readOnly ? (
        <>
          <input
            type="text"
            className="vf-icon-select__search"
            placeholder={`Search all ${names.length.toLocaleString()} Phosphor icons…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {!query.trim() ? (
            <p className="vf-icon-select__none">
              Type to search — icons are named for what they show, so “document” finds more than
              “LOI”.
            </p>
          ) : matches.length === 0 ? (
            <p className="vf-icon-select__none">Nothing matches “{query}”.</p>
          ) : (
            <>
              <div className="vf-icon-select__grid">
                {matches.slice(0, VISIBLE_LIMIT).map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={chosenSet.has(name) ? `Remove ${name}` : `Add ${name}`}
                    className={`vf-icon-select__option${
                      chosenSet.has(name) ? ' vf-icon-select__option--selected' : ''
                    }`}
                    onClick={() => toggle(name)}
                  >
                    <Preview name={name} />
                    <span>{name.replace(/-/g, ' ')}</span>
                  </button>
                ))}
              </div>
              {matches.length > VISIBLE_LIMIT ? (
                <p className="vf-icon-select__more">
                  Showing {VISIBLE_LIMIT} of {matches.length.toLocaleString()} — keep typing to narrow
                  it down.
                </p>
              ) : null}
            </>
          )}
        </>
      ) : null}

      {field?.admin?.description ? (
        <div className="field-description">{field.admin.description}</div>
      ) : null}
    </div>
  )
}

export default IconLibraryPicker
