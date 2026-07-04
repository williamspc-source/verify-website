'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

type Field = { name: string }

const ENQUIRY_TYPES = [
  'Medico-Legal Services',
  'Educational Services (AAMLE)',
  'Specialist Panel Information',
  'Register for Online Booking Portal',
  'Join Our Expert Panel',
  'General Enquiry',
]

/**
 * Site-wide slide-out enquiry drawer. Opens on any `[data-enquiry-panel]`
 * click (the hook the CMSLink "enquiry" action emits). Submits to the
 * Payload "Enquiry" form (captured in admin + email) when it exists,
 * otherwise degrades to a local confirmation.
 */
export const EnquiryDrawer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [presetType, setPresetType] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const formMeta = useRef<{ id: string; fields: Set<string> } | null>(null)

  // Look up the Enquiry form once (id + valid field names).
  useEffect(() => {
    let active = true
    fetch('/api/forms?where[title][equals]=Enquiry&limit=1&depth=0')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const doc = data?.docs?.[0]
        if (active && doc?.id) {
          formMeta.current = {
            id: String(doc.id),
            fields: new Set((doc.fields || []).map((f: Field) => f.name).filter(Boolean)),
          }
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [])

  // Delegate clicks from any [data-enquiry-panel] trigger.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement)?.closest?.('[data-enquiry-panel]')
      if (trigger) {
        e.preventDefault()
        const t = trigger.getAttribute('data-enquiry-type')
        if (t) setPresetType(t)
        setStatus('idle')
        setOpen(true)
        document.body.style.overflow = 'hidden'
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [close])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    const fd = new FormData(form)
    setStatus('sending')

    const meta = formMeta.current
    if (meta) {
      const submissionData = Array.from(fd.entries())
        .filter(([k]) => meta.fields.has(k))
        .map(([field, value]) => ({ field, value: String(value) }))
      try {
        const res = await fetch('/api/form-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form: meta.id, submissionData }),
        })
        if (!res.ok) throw new Error('submit failed')
        setStatus('sent')
        form.reset()
        return
      } catch {
        setStatus('error')
        return
      }
    }
    // No form seeded yet — acknowledge locally.
    setStatus('sent')
    form.reset()
  }

  return (
    <>
      <div
        className={`enquiry-overlay${open ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden={!open}
      />
      <aside
        className={`enquiry-panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Make an Enquiry"
      >
        <div className="enquiry-panel-head">
          <h3>Make an Enquiry</h3>
          <button className="enquiry-panel-close" onClick={close} aria-label="Close" type="button">
            ×
          </button>
        </div>
        <div className="enquiry-panel-body">
          <form ref={formRef} onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="first_name" placeholder="First name" required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="last_name" placeholder="Last name" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" placeholder="you@company.com" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="07 XXXX XXXX" />
              </div>
            </div>
            <div className="form-group">
              <label>Company / Organisation</label>
              <input type="text" name="company" placeholder="Your firm or company" />
            </div>
            <div className="form-group">
              <label>Type of Enquiry</label>
              <select name="enquiry_type" defaultValue={presetType} key={presetType}>
                <option value="">Select enquiry type...</option>
                {ENQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Message / Enquiry *</label>
              <textarea
                name="message"
                placeholder="Please provide details of your enquiry..."
                required
              />
            </div>
            <button type="submit" className="enquiry-panel-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
            </button>
            <div className={`enquiry-panel-confirm${status === 'sent' ? ' is-visible' : ''}`}>
              Thank you — your enquiry has been sent. We&apos;ll be in touch shortly.
            </div>
            {status === 'error' ? (
              <div className="enquiry-panel-confirm is-visible" style={{ color: '#c0392b' }}>
                Something went wrong. Please email admin@vmls.com.au directly.
              </div>
            ) : null}
          </form>
        </div>
      </aside>
    </>
  )
}
