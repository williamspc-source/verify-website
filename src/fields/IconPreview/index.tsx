'use client'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import React from 'react'

/**
 * What this icon will actually look like on the site.
 *
 * ## Why this field exists
 *
 * Payload's own upload preview shows the FILE that was uploaded. The site does
 * not render that file — it renders markup `normaliseSvgIcon` reconstructed from
 * it, with the colours stripped so the band can supply them. The two can look
 * completely different: measured on a two-colour test upload, the admin showed
 * navy and hot pink while the page showed one flat shape.
 *
 * An editor cannot be expected to know that, so this shows the real thing:
 * `.vf-icon-mask` pointed at the same route a page uses, on a light swatch and a
 * dark one, because taking the band's colour is the whole point of the treatment.
 *
 * It is also what makes the duotone guess acceptable. A two-colour file has its
 * lighter colour mapped to 20% opacity, and this is where that decision becomes
 * visible — before it reaches a page, not after.
 *
 * ## Why it reads the FORM rather than the document
 *
 * `useFormFields` sees the value as it is now, including the markup a `beforeChange`
 * hook has just written on save. Reading the saved doc would show the previous
 * upload until a reload.
 */
export const IconPreview: React.FC = () => {
  // The id comes from `useDocumentInfo`, NOT from the form: a document's id is
  // not a form field, so `fields.id.value` is always undefined and this rendered
  // its "save first" state on a saved icon.
  const { id } = useDocumentInfo()
  // The markup DOES come from the form, so the preview updates the moment a save
  // rewrites it — reading the saved doc would show the previous upload until a
  // reload. Cast through `unknown`: the form's value type is `string | number`.
  const markup = useFormFields(([fields]) => (fields?.markup?.value ?? '') as unknown as string)

  // Before the first save there is nothing stored to render, and the uploaded
  // file is not a stand-in for it — showing that is the very thing this replaces.
  if (!id || !markup) {
    return (
      <div className="field-type vf-icon-preview">
        <p className="vf-icon-preview__empty">
          Save the icon to see how it will look on the site.
        </p>
      </div>
    )
  }

  // `?v=` on the markup's length, so re-uploading over an existing icon repaints
  // the preview rather than showing the cached previous artwork — the route sets
  // a 300s cache, and the id does not change on a re-upload.
  const url = `/api/icon/upload/${encodeURIComponent(String(id))}?v=${String(markup).length}`

  return (
    <div className="field-type vf-icon-preview">
      <p className="vf-icon-preview__label">On the site</p>
      <div className="vf-icon-preview__swatches">
        {(['light', 'dark'] as const).map((band) => (
          <div key={band} className={`vf-icon-preview__swatch vf-icon-preview__swatch--${band}`}>
            <span
              aria-hidden
              className="vf-icon-select__preview"
              style={{
                width: 44,
                height: 44,
                WebkitMaskImage: `url("${url}")`,
                maskImage: `url("${url}")`,
              }}
            />
            <span>{band === 'light' ? 'Light band' : 'Dark band'}</span>
          </div>
        ))}
      </div>
      <p className="vf-icon-preview__note">
        Icons take the colour of whatever they sit on, so the artwork is stored as shape only.
      </p>
    </div>
  )
}

export default IconPreview
