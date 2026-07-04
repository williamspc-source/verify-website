'use client'
import React, { useId, useState } from 'react'

import { cn } from '@/utilities/ui'

// Icons and rich-text panels are pre-rendered on the server and handed down as
// opaque React nodes (same pattern as TabsClient). This client only owns the
// selected-type + selected-tab state and toggles visibility — no data or
// rich-text rendering happens here.
export type ClientTab = { label: string; iconNode: React.ReactNode; panel: React.ReactNode }
export type ClientType = {
  label: string
  sublabel?: string | null
  iconNode: React.ReactNode
  tabs: ClientTab[]
}

export const GuideClient: React.FC<{ types: ClientType[] }> = ({ types }) => {
  const [typeIdx, setTypeIdx] = useState(0)
  const [tabIdx, setTabIdx] = useState(0)
  const baseId = useId()

  if (!types || types.length === 0) return null

  const activeType = types[Math.min(typeIdx, types.length - 1)]
  const tabs = activeType?.tabs || []
  const activeTab = Math.min(Math.max(tabIdx, 0), Math.max(tabs.length - 1, 0))

  const selectType = (i: number) => {
    setTypeIdx(i)
    setTabIdx(0)
  }

  return (
    <div className="vf-appt">
      {types.length > 1 ? (
        <div className="vf-appt__types" role="tablist" aria-label="Appointment type">
          {types.map((t, i) => {
            const selected = i === Math.min(typeIdx, types.length - 1)
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-type-${i}`}
                onClick={() => selectType(i)}
                className={cn('vf-appt__type', selected && 'vf-appt__type--active')}
              >
                {t.iconNode ? <span className="vf-appt__type-icon">{t.iconNode}</span> : null}
                <span className="vf-appt__type-text">
                  <span className="vf-appt__type-label">{t.label}</span>
                  {t.sublabel ? <span className="vf-appt__type-sub">{t.sublabel}</span> : null}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {tabs.length > 1 ? (
        <div className="vf-appt__tabbar" style={{ textAlign: 'center' }}>
          <div
            className="services-tabs vf-appt__tablist"
            role="tablist"
            aria-label="Sections"
          >
            {tabs.map((tab, i) => {
              const selected = i === activeTab
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${i}`}
                  onClick={() => setTabIdx(i)}
                  className={cn('tab-btn', selected && 'active')}
                >
                  {tab.iconNode ? <span className="tab-icon">{tab.iconNode}</span> : null}
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="vf-appt__panels">
        {tabs.map((tab, i) => (
          <div
            key={i}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            hidden={i !== activeTab}
            className="vf-appt__panel"
          >
            {tab.panel}
          </div>
        ))}
      </div>
    </div>
  )
}
