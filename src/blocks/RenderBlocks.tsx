import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { GatewayCardsBlock } from '@/blocks/GatewayCards/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { StatsBandBlock } from '@/blocks/StatsBand/Component'
import { ProcessStepsBlock } from '@/blocks/ProcessSteps/Component'
import { TabsBlock } from '@/blocks/Tabs/Component'
import { SplitFeatureBlock } from '@/blocks/SplitFeature/Component'
import { CTABandBlock } from '@/blocks/CTABand/Component'
import { SpecialtyGridBlock } from '@/blocks/SpecialtyGrid/Component'
import { PeopleGridBlock } from '@/blocks/PeopleGrid/Component'
import { SlideCarouselBlock } from '@/blocks/SlideCarousel/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  gatewayCards: GatewayCardsBlock,
  featureGrid: FeatureGridBlock,
  statsBand: StatsBandBlock,
  processSteps: ProcessStepsBlock,
  tabs: TabsBlock,
  splitFeature: SplitFeatureBlock,
  ctaBand: CTABandBlock,
  specialtyGrid: SpecialtyGridBlock,
  peopleGrid: PeopleGridBlock,
  slideCarousel: SlideCarouselBlock,
}

// These blocks wrap themselves in <Section> (own padding + full-bleed
// backgrounds), so they must NOT get the legacy `my-16` margin wrapper.
const selfSpaced = new Set([
  'gatewayCards',
  'featureGrid',
  'statsBand',
  'processSteps',
  'tabs',
  'splitFeature',
  'ctaBand',
  'specialtyGrid',
  'peopleGrid',
  'slideCarousel',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const node = (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} disableInnerContainer />
              )
              return selfSpaced.has(blockType) ? (
                <Fragment key={index}>{node}</Fragment>
              ) : (
                <div className="my-16" key={index}>
                  {node}
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
