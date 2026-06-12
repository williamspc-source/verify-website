'use client'
import { FieldLabel, ReactSelect, useField } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import { getClientSideURL } from '@/utilities/getURL'

type Option = { label: string; value: string }

type Props = {
  path: string
  field?: { label?: string; admin?: { description?: string } }
}

/**
 * Strict multi-select of class names defined in the Custom Styles global. Editors
 * can ONLY pick defined presets (no free text). Stores a string[] of class names.
 */
export const CssClassSelect: React.FC<Props> = ({ path, field }) => {
  const { value, setValue } = useField<string[]>({ path })
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    let active = true
    fetch(`${getClientSideURL()}/api/globals/custom-styles?depth=0`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        const presets = (data?.presets || []) as { name?: string; label?: string }[]
        setOptions(
          presets
            .filter((p) => p.name)
            .map((p) => ({ label: p.label || (p.name as string), value: p.name as string })),
        )
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const selected: Option[] = (value || []).map(
    (v) => options.find((o) => o.value === v) || { label: v, value: v },
  )

  const label = field?.label || 'Custom CSS class(es)'
  const description = field?.admin?.description

  return (
    <div className="field-type">
      <FieldLabel label={label} path={path} />
      <ReactSelect
        isMulti
        isClearable
        options={options}
        value={selected}
        noOptionsMessage={() => 'No presets defined yet (Globals → Custom Styles)'}
        onChange={(opt: unknown) => {
          const arr = Array.isArray(opt) ? (opt as Option[]) : opt ? [opt as Option] : []
          setValue(arr.map((o) => o.value))
        }}
      />
      {description ? <div className="field-description">{description}</div> : null}
    </div>
  )
}
