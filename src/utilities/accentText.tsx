import React from 'react'

// The VERIFY design highlights one word/phrase in most headings in a brand
// accent colour (blue on light bands, light-blue on dark). Editors mark that
// span by wrapping it in [[double brackets]] in any heading field, e.g.
// "Meet Our [[Expert Panel]]". At render each marked run becomes a
// <span class="vf-accent"> (see .vf-accent in globals.css), so the two-tone
// heading treatment is fully authorable without code.
export function accentText(input?: string | null): React.ReactNode {
  if (!input) return input ?? null
  if (!input.includes('[[')) return input

  const parts = input.split(/(\[\[[^\]]*\]\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[\[([^\]]*)\]\]$/)
    if (match) {
      return (
        <span key={i} className="vf-accent">
          {match[1]}
        </span>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}
