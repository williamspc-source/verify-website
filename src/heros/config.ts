import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { cssClassField } from '@/fields/blockFields'

const isType =
  (...types: string[]) =>
  (_: unknown, siblingData: { type?: string } = {}) =>
    types.includes(siblingData?.type ?? '')

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'pageHero',
      label: 'Type',
      required: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Page hero (interior pages)', value: 'pageHero' },
        { label: 'Home hero (with definition panel)', value: 'homeHero' },
        { label: 'High impact (full-bleed image)', value: 'highImpact' },
        { label: 'Medium impact', value: 'mediumImpact' },
        { label: 'Low impact', value: 'lowImpact' },
      ],
    },
    // ── pageHero / homeHero fields ──
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small uppercase label above the heading.',
        condition: isType('pageHero', 'homeHero'),
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: { condition: isType('pageHero', 'homeHero') },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: { condition: isType('pageHero', 'homeHero') },
    },
    {
      name: 'showBreadcrumb',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the breadcrumb trail above the heading.',
        condition: isType('pageHero'),
      },
    },
    {
      name: 'definition',
      type: 'group',
      label: 'Definition panel',
      admin: {
        description: 'The dictionary-style panel shown beside the home hero.',
        condition: isType('homeHero'),
      },
      fields: [
        { name: 'term', type: 'text', admin: { description: 'e.g. "verify"' } },
        { name: 'pronunciation', type: 'text', admin: { description: 'e.g. "/ˈvɛrɪfʌɪ/ · verb"' } },
        { name: 'text', type: 'textarea', label: 'Definition' },
      ],
    },
    // ── legacy richText heroes ──
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: { condition: isType('highImpact', 'mediumImpact', 'lowImpact') },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image.',
        condition: isType('highImpact', 'mediumImpact', 'homeHero'),
      },
    },
    { ...cssClassField, admin: { ...cssClassField.admin, condition: isType('pageHero', 'homeHero') } } as Field,
  ],
  label: false,
}
