import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { iconField } from '@/fields/blockFields'
import { revalidateGlobal } from '@/utilities/revalidateGlobal'

// Shared chrome for every "In the Loop" article/resource page: the fixed sidebar
// CTA cards and the static labels — identical across all articles, so edited once
// here rather than per post.
export const ArticleSettings: GlobalConfig = {
  slug: 'article-settings',
  label: 'In the Loop / Article Settings',
  access: { read: () => true },
  admin: {
    group: 'Content',
    description: 'Sidebar CTA cards + fixed labels shown on every In-the-Loop article.',
  },
  fields: [
    {
      name: 'sidebarCards',
      type: 'array',
      label: 'Sidebar CTA cards',
      maxRows: 3,
      admin: { description: 'The fixed cards in the article right rail (e.g. "Have a Question?", "Make a Referral").' },
      fields: [
        iconField(),
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        link({ appearances: false }),
      ],
    },
    {
      name: 'labels',
      type: 'group',
      label: 'Fixed labels',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'related',
              type: 'text',
              defaultValue: 'You Might Also Like',
              admin: { width: '33%' },
            },
            {
              name: 'toc',
              type: 'text',
              defaultValue: 'In This Article',
              admin: { width: '33%' },
            },
            { name: 'topics', type: 'text', defaultValue: 'Topics', admin: { width: '34%' } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal('article-settings')],
  },
}
