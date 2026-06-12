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
    group: 'Specialist Availability',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Specialist Availability',
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
      name: 'carouselTitle',
      type: 'text',
      defaultValue: 'Featured specialists',
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
  ],
  hooks: {
    afterChange: [revalidateSpecialistAvailability],
  },
}
