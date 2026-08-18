import type { GlobalConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { revalidateSpecialistAvailability } from './hooks/revalidateSpecialistAvailability'

// Editable copy + enquiry settings for the Specialist Availability page. The
// slots themselves live in the AvailabilitySessions collection; which
// specialists appear is driven by the per-specialist "advertise" toggle.
export const SpecialistAvailability: GlobalConfig = {
  slug: 'specialist-availability',
  label: 'Specialist Availability',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Page settings',
    description:
      'Wording for the availability page and the prefilled enquiry email its Send button opens. The slots themselves are in Availability Sessions.',
  },
  fields: [
    {
      // Deprecated — the page H1 comes from the page hero, not this field.
      // Hidden (not dropped) to avoid admin confusion; remove via a migration later.
      name: 'heading',
      type: 'text',
      defaultValue: 'Specialist Availability',
      admin: { hidden: true },
    },
    {
      name: 'intro',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: { description: 'Introductory copy shown above the availability list.' },
    },
    {
      name: 'carouselEyebrow',
      type: 'text',
      defaultValue: 'Featured Specialists',
      admin: { description: 'Small label above the carousel heading.' },
    },
    {
      name: 'carouselTitle',
      type: 'text',
      label: 'Carousel heading',
      defaultValue: 'Available This Month',
      admin: {
        description: 'Wrap a word in [[brackets]] to highlight it in the accent colour.',
      },
    },
    {
      name: 'carouselSubtitle',
      type: 'textarea',
      admin: { description: 'Intro paragraph shown under the carousel heading.' },
    },
    {
      type: 'collapsible',
      label: 'Enquiry email',
      admin: {
        initCollapsed: false,
        description:
          'Controls the prefilled email opened when a visitor sends an enquiry. The sessions they selected are inserted between the intro and the sign-off.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'enquiryEmail',
              type: 'text',
              defaultValue: 'admin@vmls.com.au',
              label: 'Send to',
              admin: { width: '50%', description: 'Where the prefilled enquiry email is sent.' },
            },
            {
              name: 'enquirySubject',
              type: 'text',
              defaultValue: 'Specialist Availability Enquiry',
              label: 'Subject',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'enquiryBodyIntro',
          type: 'textarea',
          label: 'Body — intro (before the selected sessions)',
          defaultValue:
            'Hello VERIFY team,\n\nI would like to enquire about the following appointment sessions:',
        },
        {
          name: 'enquiryBodyFooter',
          type: 'textarea',
          label: 'Body — sign-off (after the selected sessions)',
          defaultValue:
            'My name is:\nMy contact number is:\nClaim / referrer details (if any):\n\nThank you.',
        },
      ],
    },
    {
      name: 'labels',
      type: 'group',
      label: 'Availability grid labels',
      admin: {
        description: 'Short UI labels for the interactive availability grid (legend, action bar).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'modeInPersonLabel',
              type: 'text',
              defaultValue: 'In-person',
              admin: { width: '33%', description: 'Label for in-person sessions (legend + chips).' },
            },
            {
              name: 'modeTelehealthLabel',
              type: 'text',
              defaultValue: 'Telehealth',
              admin: { width: '33%', description: 'Label for telehealth sessions (legend + chips).' },
            },
            {
              name: 'modeEitherLabel',
              type: 'text',
              defaultValue: 'In-person / Telehealth',
              admin: {
                width: '34%',
                description: 'Label for sessions offered either way (legend + chips).',
              },
            },
          ],
        },
        {
          name: 'selectionHint',
          type: 'text',
          defaultValue: 'Tap sessions to select, then send us an enquiry.',
          admin: { description: 'Hint shown in the legend when sessions are available to select.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'clearLabel',
              type: 'text',
              defaultValue: 'Clear',
              admin: { width: '50%', description: 'Button that clears the current selection.' },
            },
            {
              name: 'sendEnquiryLabel',
              type: 'text',
              defaultValue: 'Send enquiry',
              admin: { width: '50%', description: 'Button that opens the prefilled enquiry email.' },
            },
          ],
        },
        {
          name: 'sessionsSelectedTemplate',
          type: 'text',
          defaultValue: '{count} {noun} selected',
          admin: {
            description:
              'Selection count in the action bar. Use {count} for the number and {noun} for session/sessions.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSpecialistAvailability],
  },
}
