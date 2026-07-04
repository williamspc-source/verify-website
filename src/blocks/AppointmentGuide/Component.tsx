import React from 'react'

import type { AppointmentGuideBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import RichText from '@/components/RichText'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

import { GuideClient, type ClientType } from './GuideClient'

type ApptType = NonNullable<Props['types']>[number]
type ApptTab = NonNullable<ApptType['tabs']>[number]

const calloutIcon: Record<string, string> = {
  info: 'info',
  note: 'info',
  warning: 'warning',
}

// One tab's content, rendered entirely server-side (rich text included) so the
// client toggle only has to show/hide the finished markup.
const TabPanel: React.FC<{ tab: ApptTab }> = ({ tab }) => {
  const items = tab.items || []
  const cards = tab.highlightCards || []
  const callout = tab.callout

  return (
    <div className="vf-appt__panel-inner">
      {items.length > 0 ? (
        <div className="vf-appt__items">
          {items.map((item, i) => (
            <div key={item.id || i} className="vf-appt__item vf-card">
              {item.icon ? (
                <div className="vf-appt__item-icon vf-card__icon">
                  <Icon name={item.icon} />
                </div>
              ) : null}
              <div className="vf-appt__item-body">
                <h4 className="vf-appt__item-heading">{item.heading}</h4>
                {item.body ? (
                  <RichText
                    data={item.body}
                    enableGutter={false}
                    enableProse={false}
                    className="vf-appt__item-rt"
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {cards.length > 0 ? (
        <div className="vf-appt__cards">
          {cards.map((card, i) => (
            <div key={card.id || i} className="vf-appt__card vf-card">
              <div className="vf-appt__card-head">
                {card.icon ? (
                  <span className="vf-appt__card-icon">
                    <Icon name={card.icon} />
                  </span>
                ) : null}
                <h4 className="vf-appt__card-title">{card.title}</h4>
              </div>
              {card.bullets && card.bullets.length > 0 ? (
                <ul className="vf-appt__bullets">
                  {card.bullets.map((b, j) => (
                    <li key={b.id || j}>{b.text}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {callout?.text ? (
        <div
          className={cn('vf-appt__callout', `vf-appt__callout--${callout.style || 'info'}`)}
          role="note"
        >
          <span className="vf-appt__callout-icon">
            <Icon name={calloutIcon[callout.style || 'info'] || 'info'} />
          </span>
          <p className="vf-appt__callout-text">{callout.text}</p>
        </div>
      ) : null}
    </div>
  )
}

export const AppointmentGuideBlock: React.FC<Props & { bare?: boolean }> = ({
  eyebrow,
  heading,
  subheading,
  types,
  cssClass,
  bare,
}) => {
  if (!types || types.length === 0) return null

  const clientTypes: ClientType[] = types.map((type) => ({
    label: type.label,
    sublabel: type.sublabel,
    iconNode: type.icon ? <Icon name={type.icon} /> : null,
    tabs: (type.tabs || []).map((tab) => ({
      label: tab.label,
      iconNode: tab.icon ? <Icon name={tab.icon} className="size-5" /> : null,
      panel: <TabPanel tab={tab} />,
    })),
  }))

  return (
    <Section
      background="muted"
      className={cn('vf-appointment-guide', toClassName(cssClass))}
      bare={bare}
    >
      <SectionHeader eyebrow={eyebrow} title={heading} subtitle={subheading} align="center" />
      <GuideClient types={clientTypes} />
    </Section>
  )
}
