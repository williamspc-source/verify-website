'use client'

import React, { useId, useState } from 'react'

export type ServicesAccordionItemProps = {
  title: string
  /** Always-visible 16:9 image/placeholder tile rendered above the trigger. */
  media?: React.ReactNode
  /** RichText body revealed when the row expands. */
  body?: React.ReactNode
}

/**
 * A single expandable service row. Mirrors the design reference's
 * `.as-accordion-item` markup: an always-visible image tile, then a button
 * trigger ([aria-expanded]) showing only the service name + "+", then a
 * [hidden] body that reveals the description on expand — so the ported CSS
 * applies verbatim. Only the collapse state lives on the client; the media and
 * body content are server-rendered and passed in as props.
 */
export const ServicesAccordionItem: React.FC<ServicesAccordionItemProps> = ({
  title,
  media,
  body,
}) => {
  const [open, setOpen] = useState(false)
  const bodyId = useId()
  // The tile above is always visible; only a body makes the row collapsible.
  const collapsible = Boolean(body)

  const header = <span className="as-accordion-trigger-title">{title}</span>

  return (
    <div className="as-accordion-item">
      {media}
      {collapsible ? (
        <button
          type="button"
          className="as-accordion-trigger"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((prev) => !prev)}
        >
          {header}
          <span className="as-accordion-icon" aria-hidden="true">
            +
          </span>
        </button>
      ) : (
        <div className="as-accordion-trigger as-accordion-trigger--static">{header}</div>
      )}
      {collapsible ? (
        <div className="as-accordion-body" id={bodyId} hidden={!open}>
          {body}
        </div>
      ) : null}
    </div>
  )
}
