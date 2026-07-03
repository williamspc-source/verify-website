import type { GlobalConfig } from 'payload'

import { iconField } from '@/fields/blockFields'
import { revalidateGlobal } from '@/utilities/revalidateGlobal'

// Shared copy for the "Online Booking Portal" CTA band that is byte-identical
// across all Specialist profiles, the Specialist Panel and the Specialty List —
// edited once here rather than per specialist record.
export const SpecialistProfile: GlobalConfig = {
  slug: 'specialist-profile',
  label: 'Specialist Profile',
  access: { read: () => true },
  admin: {
    group: 'People',
    description: 'Shared copy shown on every specialist profile (the booking-portal CTA + labels).',
  },
  fields: [
    {
      name: 'portalCta',
      type: 'group',
      label: 'Booking Portal CTA',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
            { name: 'heading', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'subheading', type: 'textarea' },
        {
          name: 'tiles',
          type: 'array',
          label: 'Feature tiles',
          maxRows: 4,
          fields: [
            iconField(),
            { name: 'label', type: 'text', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enquiryLabel',
              type: 'text',
              defaultValue: 'Send Enquiry',
              admin: { width: '50%' },
            },
            {
              name: 'enquiryEmail',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Optional — defaults to the Site Settings / Footer contact email.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'labels',
      type: 'group',
      label: 'Section labels',
      admin: { description: 'The fixed headings on the profile body (leave default unless rebranding).' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'biography', type: 'text', defaultValue: 'Biography', admin: { width: '50%' } },
            {
              name: 'assessmentAreas',
              type: 'text',
              defaultValue: 'Assessment Areas',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'qualifications',
              type: 'text',
              defaultValue: 'Qualifications',
              admin: { width: '50%' },
            },
            {
              name: 'accreditations',
              type: 'text',
              defaultValue: 'Accreditations',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal('specialist-profile')],
  },
}
