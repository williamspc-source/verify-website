import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/utilities/revalidateGlobal'

// Shared chrome for every team member profile page: the breadcrumb trail and the
// fixed sidebar/section labels. These are identical across all team members, so
// they're edited once here rather than hardcoded in the template.
export const TeamSettings: GlobalConfig = {
  slug: 'team-settings',
  label: 'Team Settings',
  access: { read: () => true },
  admin: {
    group: 'Page settings',
    description: 'Breadcrumb + fixed labels shown on every team member profile page.',
  },
  fields: [
    {
      name: 'labels',
      type: 'group',
      label: 'Fixed labels',
      fields: [
        {
          name: 'breadcrumbSectionLabel',
          type: 'text',
          defaultValue: 'Meet the Team',
          admin: {
            description:
              'Second breadcrumb link (the team index). The first crumb — “Home” — is shared site-wide and lives in Site Settings → Breadcrumbs.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'roleLabel',
              type: 'text',
              defaultValue: 'Role',
              admin: {
                width: '50%',
                description: 'Sidebar label above the member’s role.',
              },
            },
            {
              name: 'qualificationLabel',
              type: 'text',
              defaultValue: 'Qualification',
              admin: {
                width: '50%',
                description: 'Sidebar label above each qualification.',
              },
            },
          ],
        },
        {
          name: 'aboutPrefix',
          type: 'text',
          defaultValue: 'About',
          admin: {
            description: 'Prefix for the bio heading, e.g. “About” in “About Wes”.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal('team-settings')],
  },
}
