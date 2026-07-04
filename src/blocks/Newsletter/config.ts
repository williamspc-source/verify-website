import type { Block } from 'payload'

import { anchorIdField, cssClassField } from '@/fields/blockFields'

// Newsletter subscribe band (design ref: .ni-newsletter on the "In the Loop" page).
// A full-bleed dark-gradient CTA with an email capture form. Every label is
// editable; the form itself is presentational (wiring a submit endpoint is
// handled elsewhere).
export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter Signup', plural: 'Newsletter Signups' },
  fields: [
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
