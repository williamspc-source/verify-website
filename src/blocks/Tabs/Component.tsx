import React from 'react'

import type { TabsBlockType as Props } from '@/payload-types'

import RichText from '@/components/RichText'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'
import { TabsClient } from './TabsClient'

export const TabsBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  background,
  tabs,
  cssClass,
  elementClasses,
  motion,
  containerWidth,
  tabStyle,
  defaultTab,
}) => {
  if (!tabs || tabs.length === 0) return null

  // RichText is rendered server-side here; the client component only switches.
  const items = tabs.map((tab) => ({
    label: tab.label,
    panel: <RichText data={tab.content} enableGutter={false} />,
  }))

  return (
    <Section
      background={background as SectionBackground}
      className={cn('vf-tabs', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />
      <TabsClient items={items} tabStyle={tabStyle ?? 'pills'} defaultTab={defaultTab ?? 0} />
    </Section>
  )
}
