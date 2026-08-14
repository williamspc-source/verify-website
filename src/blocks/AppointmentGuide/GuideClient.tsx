'use client'
import React, { useEffect, useId, useState } from 'react'

import { cn } from '@/utilities/ui'

// Icons and rich-text panels are pre-rendered on the server and handed down as
// opaque React nodes (same pattern as TabsClient). This client only owns the
// selected-type + selected-tab state and toggles visibility — no data or
// rich-text rendering happens here. Markup + classes mirror the design
// reference's `.ag-*` appointment-guide structure (namespaced `vf-ag-*`).
export type ClientTab = { label: string; iconNode: React.ReactNode; panel: React.ReactNode }
export type ClientType = {
  label: string
  sublabel?: string | null
  anchorId?: string | null
  iconNode: React.ReactNode
  tabs: ClientTab[]
}

export const GuideClient: React.FC<{ types: ClientType[]; selectLabel?: string | null }> = ({
  types,
  selectLabel,
}) => {
  const [typeIdx, setTypeIdx] = useState(0)
  const [tabIdx, setTabIdx] = useState(0)
  const baseId = useId()

  // Deep-linking. Each type carries an editor-set Anchor ID rendered as the id
  // on its button, so `…/for-claimants#videolink-appointment` both scrolls here
  // and *selects that type* — matching the design reference, which puts
  // id="in-person-appointment" / id="videolink-appointment" on its tab buttons.
  //
  // Before this, the guide could not be deep-linked at all: the type was plain
  // `useState(0)` and nothing read the URL, so the homepage's "Videolink
  // Appointment Guide" link had been pointed at the separate YouTube section
  // instead — it went to a video rather than to the guide.
  //
  // The browser cannot do the scroll itself: these ids only exist after this
  // component mounts, so a fresh load with a hash finds nothing. Hence the
  // explicit scrollIntoView, which also honours `html { scroll-padding-top }`.
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return
      const i = types.findIndex((t) => t.anchorId && t.anchorId === hash)
      if (i < 0) return
      setTypeIdx(i)
      setTabIdx(0)
      // Wait for the selection to paint before scrolling to it.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: 'start' })
      })
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [types])

  if (!types || types.length === 0) return null

  const activeTypeIdx = Math.min(typeIdx, types.length - 1)
  const activeType = types[activeTypeIdx]
  const tabs = activeType?.tabs || []
  const activeTab = Math.min(Math.max(tabIdx, 0), Math.max(tabs.length - 1, 0))

  const selectType = (i: number) => {
    setTypeIdx(i)
    setTabIdx(0)
  }

  return (
    <div className="vf-ag">
      {types.length > 1 ? (
        <>
          <p className="vf-ag-select-label">{selectLabel || 'Select your appointment type'}</p>
          <div className="vf-ag-type-toggle" role="tablist" aria-label="Appointment type">
            {types.map((t, i) => {
              const selected = i === activeTypeIdx
              return (
                <button
                  key={i}
                  id={t.anchorId || undefined}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectType(i)}
                  className={cn('vf-ag-type-btn', selected && 'active')}
                >
                  {t.iconNode ? (
                    <span className="vf-ag-type-icon-wrap">{t.iconNode}</span>
                  ) : null}
                  <span className="vf-ag-type-text">
                    <span className="vf-ag-type-btn-label">{t.label}</span>
                    {t.sublabel ? (
                      <span className="vf-ag-type-btn-sub">{t.sublabel}</span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      ) : null}

      <div className="vf-ag-panel">
        {tabs.length > 1 ? (
          <div className="vf-ag-tabs" role="tablist" aria-label="Sections">
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
                  className={cn('vf-ag-tab', selected && 'active')}
                >
                  {tab.iconNode ? (
                    <span className="vf-ag-tab-icon">{tab.iconNode}</span>
                  ) : null}
                  <span className="vf-ag-tab-label">{tab.label}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {tabs.map((tab, i) => (
          <div
            key={i}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            hidden={i !== activeTab}
            className="vf-ag-content"
          >
            {tab.panel}
          </div>
        ))}
      </div>
    </div>
  )
}
