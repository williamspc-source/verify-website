import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import { iconOptions } from '@/components/Icon'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  // When true, the whole link is optional — reference/url/label are not required,
  // so a row/card can render no CTA at all (reference pages with no button).
  optional?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  optional = false,
  overrides = {},
} = {}) => {
  const req = !optional
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
              {
                label: 'Open enquiry form',
                value: 'enquiry',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      label: 'Document to link to',
      // Specialists / Team / Events are linkable so an editor never has to type
      // a path by hand. A hand-typed path bypasses src/utilities/routes.ts and
      // silently 404s the day a prefix moves — which has already happened once.
      relationTo: ['pages', 'posts', 'specialists', 'team', 'events'],
      required: req,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
        description:
          'You can link to a draft. The link will 404 for visitors until that document is published.',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: req,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: req,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  linkResult.fields.push({
    name: 'icon',
    type: 'select',
    options: iconOptions,
    admin: {
      description: 'Optional leading icon shown before the label.',
    },
  })

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
