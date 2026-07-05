import type { CollectionConfig, Field } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FAQ } from '../../blocks/FAQ/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { GatewayCards } from '../../blocks/GatewayCards/config'
import { FeatureGrid } from '../../blocks/FeatureGrid/config'
import { StatsBand } from '../../blocks/StatsBand/config'
import { ProcessSteps } from '../../blocks/ProcessSteps/config'
import { TabsBlock } from '../../blocks/Tabs/config'
import { SplitFeature } from '../../blocks/SplitFeature/config'
import { CTABand } from '../../blocks/CTABand/config'
import { SpecialtyGrid } from '../../blocks/SpecialtyGrid/config'
import { PeopleGrid } from '../../blocks/PeopleGrid/config'
import { ServicesGrid } from '../../blocks/ServicesGrid/config'
import { TestimonialsGrid } from '../../blocks/TestimonialsGrid/config'
import { Availability } from '../../blocks/Availability/config'
import { SlideCarousel } from '../../blocks/SlideCarousel/config'
import { Callout } from '../../blocks/Callout/config'
import { ContactDetails } from '../../blocks/ContactDetails/config'
import { IconList } from '../../blocks/IconList/config'
import { MapEmbed } from '../../blocks/MapEmbed/config'
import { ResourcesGrid } from '../../blocks/ResourcesGrid/config'
import { SpecialistDirectory } from '../../blocks/SpecialistDirectory/config'
import { SpecialtyDirectory } from '../../blocks/SpecialtyDirectory/config'
import { AppointmentGuide } from '../../blocks/AppointmentGuide/config'
import { AamleEducation } from '../../blocks/AamleEducation/config'
import { MissionPillars } from '../../blocks/MissionPillars/config'
import { ValueCards } from '../../blocks/ValueCards/config'
import { WhyVerify } from '../../blocks/WhyVerify/config'
import { LeadershipSpotlight } from '../../blocks/LeadershipSpotlight/config'
import { AudiencePathways } from '../../blocks/AudiencePathways/config'
import { BookingChooser } from '../../blocks/BookingChooser/config'
import { CostGrid } from '../../blocks/CostGrid/config'
import { PortalCta } from '../../blocks/PortalCta/config'
import { Newsletter } from '../../blocks/Newsletter/config'
import { VideoEmbed } from '../../blocks/VideoEmbed/config'
import { SectionNav } from '../../blocks/SectionNav/config'
import { FeaturedArticles } from '../../blocks/FeaturedArticles/config'
import { EventsExplorer } from '../../blocks/EventsExplorer/config'
import { Section } from '../../blocks/Section/config'
import { Row } from '../../blocks/Row/config'
import { hero } from '@/heros/config'
import { cssClassField } from '@/fields/blockFields'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// Full nested URL for a page from its nested-docs breadcrumbs (used for preview).
const breadcrumbPath = (data: Record<string, unknown> | undefined): string | undefined => {
  const breadcrumbs = data?.breadcrumbs as { url?: string | null }[] | undefined
  if (Array.isArray(breadcrumbs) && breadcrumbs.length) {
    return breadcrumbs[breadcrumbs.length - 1]?.url ?? undefined
  }
  return undefined
}

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          path: breadcrumbPath(data),
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        path: breadcrumbPath(data),
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                // Layout primitives (compose freeform layouts; nest atoms inside)
                Section,
                Row,
                // Rich blocks
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                FAQ,
                GatewayCards,
                FeatureGrid,
                StatsBand,
                ProcessSteps,
                TabsBlock,
                SplitFeature,
                CTABand,
                SpecialtyGrid,
                PeopleGrid,
                ServicesGrid,
                TestimonialsGrid,
                Availability,
                SlideCarousel,
                // New design-reference blocks
                SpecialistDirectory,
                SpecialtyDirectory,
                ResourcesGrid,
                AppointmentGuide,
                MapEmbed,
                ContactDetails,
                IconList,
                Callout,
                // Bespoke design-reference section blocks
                AamleEducation,
                MissionPillars,
                ValueCards,
                WhyVerify,
                LeadershipSpotlight,
                AudiencePathways,
                BookingChooser,
                CostGrid,
                PortalCta,
                Newsletter,
                VideoEmbed,
                SectionNav,
                FeaturedArticles,
                EventsExplorer,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    { ...cssClassField, admin: { ...cssClassField.admin, position: 'sidebar' } } as Field,
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
