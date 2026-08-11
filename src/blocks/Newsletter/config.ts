import type { Block } from 'payload'

import { anchorIdField, cssClassField } from '@/fields/blockFields'

// Newsletter subscribe band (design ref: .ni-newsletter on the "In the Loop" page).
// A full-bleed dark-gradient CTA with an email capture form. Every label is
// editable, and `form` decides where a signup is actually stored — without it
// the block used to POST to its own page URL and 405, losing every signup while
// showing the visitor no error at all.
export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter Signup', plural: 'Newsletter Signups' },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      // Deliberately NOT `required`, and no `validate` either.
      //
      // A blocking validator here fires on publish (draft saves skip validation),
      // so any page already carrying this block became unpublishable — with the
      // error attached to a collapsed block the editor has to go hunting for.
      // Blocking a publish is the wrong lever: it punishes the person editing an
      // unrelated part of the page.
      //
      // Instead the block states the problem where it matters. With no form
      // chosen the rendered band shows a visible "signups unavailable" notice
      // instead of a heading with nothing beneath it, so the gap is obvious on
      // the page rather than hidden behind a save error. See ./Component.tsx.
      admin: {
        description:
          'Where signups are stored. Create a form with a single "email" field under Forms, then choose it here — submissions appear under Form Submissions, and the form’s Emails tab controls who is notified. Leave this empty and the band will tell visitors that signups are unavailable rather than showing a subscribe box that discards their address.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Stay in the Loop',
      admin: { description: 'Small uppercase label above the heading.' },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Be the First to Know About [[VERIFY & AAMLE Updates]]',
      admin: {
        description:
          'Wrap a word/phrase in [[brackets]] to highlight it in the accent colour, e.g. "Be the First to Know About [[VERIFY & AAMLE Updates]]".',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        'Subscribe to receive new articles from In the Loop, AAMLE industry event invitations, and announcements — delivered directly to your inbox.',
      admin: { description: 'Supporting paragraph beneath the heading.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          defaultValue: 'Enter your email',
          admin: { width: '50%', description: 'Placeholder text inside the email input.' },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Subscribe',
          admin: { width: '50%', description: 'Submit button label.' },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      defaultValue: 'Unsubscribe at any time. We respect your privacy.',
      admin: { description: 'Small print shown below the form.' },
    },
    anchorIdField,
    cssClassField,
  ],
}
