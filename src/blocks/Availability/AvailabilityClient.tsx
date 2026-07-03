'use client'

import React, { useMemo, useState } from 'react'

import { cn } from '@/utilities/ui'

export type AvailabilityChip = {
  id: string
  time: string
  end: string
  type: string
  modeClass: string
}

export type AvailabilityRow = {
  id: string
  name: string
  position?: string | null
  initials: string
  accreditations: string[]
  dates: { date: string; chips: AvailabilityChip[] }[]
}

export type EnquiryConfig = {
  email: string
  subject: string
  bodyIntro: string
  bodyFooter: string
}

type SelectedSession = { spec: string; date: string; time: string; end: string; type: string }

const LEGEND = [
  { cls: 'sa-inperson', label: 'In-person' },
  { cls: 'sa-telehealth', label: 'Telehealth' },
  { cls: 'sa-either', label: 'In-person / Telehealth' },
]

export const AvailabilityClient: React.FC<{
  rows: AvailabilityRow[]
  enquiry: EnquiryConfig
  showLegend?: boolean
}> = ({ rows, enquiry, showLegend = true }) => {
  // id → selected session details, plus the date for grouping the email.
  const [selected, setSelected] = useState<Map<string, SelectedSession>>(new Map())

  const count = selected.size

  const toggle = (chip: AvailabilityChip, specName: string, date: string) => {
    setSelected((prev) => {
      const next = new Map(prev)
      if (next.has(chip.id)) {
        next.delete(chip.id)
      } else {
        next.set(chip.id, { spec: specName, date, time: chip.time, end: chip.end, type: chip.type })
      }
      return next
    })
  }

  const clear = () => setSelected(new Map())

  const sendEnquiry = () => {
    if (selected.size === 0) return

    // Group selected sessions by specialist for a readable email.
    const bySpec = new Map<string, SelectedSession[]>()
    selected.forEach((s) => {
      if (!bySpec.has(s.spec)) bySpec.set(s.spec, [])
      bySpec.get(s.spec)!.push(s)
    })

    const lines: string[] = []
    bySpec.forEach((sessions, spec) => {
      lines.push(`${spec}:`)
      sessions.forEach((s) => lines.push(`  - ${s.date}, ${s.time}-${s.end} (${s.type})`))
      lines.push('')
    })

    const body = `${enquiry.bodyIntro}\n\n${lines.join('\n')}\n${enquiry.bodyFooter}`
    window.location.href = `mailto:${enquiry.email}?subject=${encodeURIComponent(
      enquiry.subject,
    )}&body=${encodeURIComponent(body)}`
  }

  const hasAnySessions = useMemo(() => rows.some((r) => r.dates.length > 0), [rows])

  if (rows.length === 0) return null

  return (
    <div className="sa">
      {showLegend ? (
        <div className="sa-legend" aria-label="Session type colour key">
          {LEGEND.map((l) => (
            <div className="sa-legend-item" key={l.cls}>
              <span className={cn('sa-legend-swatch', l.cls)} />
              <span className="sa-legend-label">{l.label}</span>
            </div>
          ))}
          {hasAnySessions ? (
            <div className="sa-legend-item sa-legend-hint">
              <span className="sa-legend-label">Tap sessions to select, then send us an enquiry.</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="sa-list">
      {rows.map((row) => (
        <div className="sa-row" key={row.id}>
          <div className="sa-spec">
            <div className="avatar-mono" aria-hidden="true">
              {row.initials}
            </div>
            <div className="sa-spec-name">{row.name}</div>
            {row.position ? <div className="sa-spec-title">{row.position}</div> : null}
            {row.accreditations.length > 0 ? (
              <ul className="sa-spec-accred">
                {row.accreditations.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="sa-slots">
            {row.dates.map((d) => (
              <div className="sa-date-group" key={d.date}>
                <div className="sa-date">{d.date}</div>
                <div className="sa-chips">
                  {d.chips.map((chip) => {
                    const isSel = selected.has(chip.id)
                    return (
                      <button
                        type="button"
                        key={chip.id}
                        className={cn('sa-chip', chip.modeClass, isSel && 'is-selected')}
                        aria-pressed={isSel}
                        onClick={() => toggle(chip, row.name, d.date)}
                      >
                        {chip.time} – {chip.end}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>

      <div className={cn('sa-bar', count > 0 && 'active')} role="region" aria-label="Selected sessions">
        <span className="sa-bar-count">
          {count} {count === 1 ? 'session' : 'sessions'} selected
        </span>
        <div className="sa-bar-actions">
          <button type="button" className="sa-bar-clear" onClick={clear}>
            Clear
          </button>
          <button type="button" className="btn btn-primary" onClick={sendEnquiry}>
            Send enquiry
          </button>
        </div>
      </div>
    </div>
  )
}
