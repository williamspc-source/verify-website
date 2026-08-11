import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

/**
 * Admin dashboard orientation.
 *
 * This was the stock Payload template welcome text, which told the reader to
 * "modify your collections and add more fields", linked to the Payload docs, and
 * said changes require committing and pushing to trigger a redeployment. None of
 * that is true here — content edits go live on save via the revalidation hooks —
 * and none of it is actionable by someone who does not write code. It is the
 * first screen after login, so it should orient rather than mislead.
 */
const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>VERIFY Medico-Legal Solutions — content admin</h4>
      </Banner>

      <p>
        {'Everything on the public site is edited from here. Changes go live as soon as you '}
        <strong>Save</strong>
        {' — there is no publishing step beyond the Draft/Published toggle, and no deployment to run.'}
      </p>

      <ul className={`${baseClass}__instructions`}>
        <li>
          <strong>Page content</strong> — <em>Pages</em>. Each page is built from blocks you can add,
          reorder and remove. A page&apos;s web address comes from its <em>Parent</em>, so changing
          the parent changes the URL.
        </li>
        <li>
          <strong>Articles</strong> — <em>Posts</em>. Every article needs a <em>Stream</em>; that is
          what gives it a web address. Do not delete a stream that still has articles in it.
        </li>
        <li>
          <strong>People and panels</strong> — <em>Specialists</em>, <em>Team</em>, <em>Events</em>.
          Saving one as a draft hides it from the site.
        </li>
        <li>
          <strong>Wording that appears on many pages</strong> — the <em>Globals</em> section
          (Header, Footer, Site Settings, and the per-area settings groups).
        </li>
        <li>
          <strong>Colours, fonts, spacing and corners</strong> — <em>Globals → Site Settings</em>{' '}
          (brand colours) and <em>Globals → Design System</em> (everything else). One change there
          re-themes the whole site.
        </li>
        <li>
          <strong>Enquiries and form submissions</strong> — <em>Forms → Form Submissions</em>. Who
          gets notified is set per form, on that form&apos;s <em>Emails</em> tab.
        </li>
      </ul>

      <p>
        {'For anything the fields above cannot reach, see '}
        <strong>Globals → Custom Styles</strong>
        {', and the full styling reference kept alongside the code in '}
        <code>src/Styles/HOOKS.md</code>
        {'. If something needs a code change, that is a developer task — note what you need and pass it on.'}
      </p>
    </div>
  )
}

export default BeforeDashboard
