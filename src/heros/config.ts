import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { cssClassField, iconField } from '@/fields/blockFields'

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
      type: 'row',
      admin: { condition: isType('pageHero') },
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          admin: { width: '50%', description: 'Light interior hero, or a dark gradient band.' },
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark (gradient)', value: 'dark' },
          ],
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'left',
          admin: { width: '50%' },
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
        },
      ],
    },
    {
      name: 'showShield',
      type: 'checkbox',
      label: 'Show VERIFY shield watermark',
      admin: {
        description: 'Decorative brand shield behind the hero (uses the Site Settings logo/shield).',
        condition: isType('pageHero', 'homeHero'),
      },
    },
    {
      name: 'metaItems',
      type: 'array',
      label: 'Quick-facts row',
      labels: { singular: 'Item', plural: 'Items' },
      admin: {
        condition: isType('pageHero'),
        description: 'Optional icon + text row under the hero (e.g. phone / email / hours on Contact).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            iconField({ admin: { width: '25%' } }),
            { name: 'text', type: 'text', required: true, admin: { width: '45%' } },
            { name: 'href', type: 'text', admin: { width: '30%' } },
          ],
        },
      ],
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
        {
          name: 'definitionStyle',
          type: 'select',
          defaultValue: 'glow',
          label: 'Panel style',
          admin: { description: 'Visual treatment for the definition panel.' },
          options: [
            { label: 'Glow (light panel, radial glow)', value: 'glow' },
            { label: 'Frame (grey gradient, inner frame)', value: 'frame' },
          ],
        },
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
        description: 'Hero image (background for impact heroes; a side/decorative image on page heroes).',
        condition: isType('highImpact', 'mediumImpact', 'homeHero', 'pageHero'),
      },
    },
    { ...cssClassField, admin: { ...cssClassField.admin, condition: isType('pageHero', 'homeHero') } } as Field,
  ],
  label: false,
}
