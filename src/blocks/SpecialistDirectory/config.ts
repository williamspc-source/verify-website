import type { Block } from 'payload'

import {
  backgroundField,
  cssClassField,
  sectionHeaderFields,
} from '@/fields/blockFields'

// The interactive Specialist Panel directory: a searchable, filterable listing of
// the Specialists collection (by specialty / location / accreditation) with a live
// result count and empty state. All the visitor-facing copy is editable here; the
// client-side filtering is applied by the block's component over the queried set.
export const SpecialistDirectory: Block = {
  slug: 'specialistDirectory',
  interfaceName: 'SpecialistDirectoryBlock',
  labels: { singular: 'Specialist Directory', plural: 'Specialist Directories' },
  fields: [
    ...sectionHeaderFields,
    backgroundField,
    {
      type: 'collapsible',
      label: 'Filters',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'enableSearch', type: 'checkbox', defaultValue: true, label: 'Search box', admin: { width: '25%' } },
            { name: 'enableSpecialty', type: 'checkbox', defaultValue: true, label: 'Specialty', admin: { width: '25%' } },
            { name: 'enableLocation', type: 'checkbox', defaultValue: true, label: 'Location', admin: { width: '25%' } },
            { name: 'enableAccreditation', type: 'checkbox', defaultValue: true, label: 'Accreditation', admin: { width: '25%' } },
          ],
        },
        {
          name: 'sortBy',
          type: 'select',
          defaultValue: 'lastName',
          admin: { description: 'Directory sort order.' },
          options: [
            { label: 'Surname', value: 'lastName' },
            { label: 'Given name', value: 'firstName' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Copy',
      admin: { initCollapsed: true, description: 'Visitor-facing labels + empty state.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'searchPlaceholder', type: 'text', defaultValue: 'Search by name…', admin: { width: '50%' } },
            { name: 'countTemplate', type: 'text', defaultValue: '{count} specialists', admin: { width: '50%', description: 'Use {count}.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'specialtyLabel', type: 'text', defaultValue: 'Specialty', admin: { width: '33%' } },
            { name: 'locationLabel', type: 'text', defaultValue: 'Location', admin: { width: '33%' } },
            { name: 'accreditationLabel', type: 'text', defaultValue: 'Accreditation', admin: { width: '34%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'emptyHeading', type: 'text', defaultValue: 'No specialists found', admin: { width: '50%' } },
            { name: 'emptyBody', type: 'text', defaultValue: 'Try adjusting your filters.', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'cardCtaLabel', type: 'text', defaultValue: 'View Profile', admin: { width: '50%', description: 'Ghost card button (links to the specialist profile).' } },
            { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Request Availability', admin: { width: '50%', description: 'Solid card button label.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'secondaryCtaHref', type: 'text', defaultValue: '/contact', admin: { width: '50%', description: 'Solid card button link (e.g. /contact).' } },
            { name: 'resetLabel', type: 'text', defaultValue: 'Clear Filters', admin: { width: '50%', description: 'Filter reset button label.' } },
          ],
        },
        { name: 'locationsLabel', type: 'text', defaultValue: 'Consulting Locations', admin: { description: 'Eyebrow label shown above each card’s consulting locations.' } },
      ],
    },
    cssClassField,
  ],
}
