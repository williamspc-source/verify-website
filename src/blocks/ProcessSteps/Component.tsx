import { hasRichText } from '@/utilities/lexicalText'
import { InlineRichText } from '@/components/RichText/Inline'
import React from 'react'

import type { ProcessStepsBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Section, type SectionBackground } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { toClassName } from '@/utilities/cssClass'

type Step = NonNullable<Props['steps']>[number]

const num = (i: number, style?: string | null) =>
  style === 'plain' ? String(i + 1) : String(i + 1).padStart(2, '0')

/**
 * A step description is rich text: multiple paragraphs plus bold/italic, which
 * the design reference's third AAMLE panel needs (it bolds an organisation name
 * and italicises a publication title).
 *
 * `enableProse={false}` is not optional — the Tailwind typography plugin is
 * loaded globally, and letting it apply would restyle every paragraph out from
 * under the block's own CSS. `enableGutter={false}` drops the article container.
 *
 * The wrapper `<div>` this adds is why `.aamle-*-rich` targets `> p`; the other
 * three variants style their paragraphs with descendant selectors, so they are
 * unaffected apart from needing their own `> p + p` spacing.
 */
const Body: React.FC<{ data: Step['description']; className?: string }> = ({
  data,
  className,
}) => {
  if (!data) return null
  return (
    <RichText
      data={data}
      className={className}
      enableGutter={false}
      enableProse={false}
    />
  )
}

export const ProcessStepsBlock: React.FC<Props & { bare?: boolean }> = (props) => {
  const {
    eyebrow,
    heading,
    subheading,
    background,
    columns,
    numberStyle,
    steps,
    cssClass,
    elementClasses,
    motion,
    containerWidth,
    hoverEffect,
    shadow,
    bare,
    image,
    imagePlaceholder,
    placeholderLabel,
    placeholderIcon,
  } = props
  // New fields (regenerate types on deploy); read defensively until then.
  const variant = (props as { variant?: string | null }).variant || 'cards'
  const anchorId = (props as { anchorId?: string | null }).anchorId || undefined
  const introRich = (props as { introRich?: Step['description'] }).introRich

  if (!steps || steps.length === 0) return null

  // ── Two-row connected process (design-reference .our-process): steps split
  // into rows (blue 01–03, then dark ".alt" rows), each with its own connector. ──
  if (variant === 'two-row') {
    const per = Number(columns) || 3
    const rows: Step[][] = []
    for (let i = 0; i < steps.length; i += per) rows.push(steps.slice(i, i + per))
    return (
      <Section
        id={anchorId}
        background={background as SectionBackground}
        className={cn('vf-process-steps our-process', toClassName(cssClass))}
        motion={motion}
        containerWidth={containerWidth}
        bare={bare}
      >
        {hasRichText(eyebrow) || hasRichText(heading) || hasRichText(subheading) ? (
          <div className="process-header">
            <InlineRichText as="div" className="section-label" data={eyebrow} />
            <InlineRichText as="h2" className="section-title" data={heading} />
            <InlineRichText as="p" className="section-subtitle" data={subheading} />
          </div>
        ) : null}
        {rows.map((row, r) => (
          <div
            key={r}
            className={r === 0 ? 'process-steps' : 'process-bottom-row'}
            style={{ gridTemplateColumns: `repeat(${per}, 1fr)` }}
          >
            {row.map((step, j) => {
              const idx = r * per + j
              return (
                <div key={j} className="process-step">
                  <div className={cn('process-step-num', r > 0 && 'alt')}>{num(idx)}</div>
                  {step.icon ? (
                    <div className="process-step-icon">
                      <Icon name={step.icon} />
                    </div>
                  ) : null}
                  {step.title ? <h4>{step.title}</h4> : null}
                  <Body data={step.description} />
                </div>
              )
            })}
          </div>
        ))}
      </Section>
    )
  }

  // ── Claimant step list (design-reference .claimant-process): a left intro
  // column + a compact numbered list on the right. ──
  if (variant === 'claimant') {
    return (
      <Section
        id={anchorId}
        background={background as SectionBackground}
        className={cn('vf-process-steps claimant-process', toClassName(cssClass))}
        motion={motion}
        containerWidth={containerWidth}
        bare={bare}
      >
        <div className="claimant-process-inner">
          <div className="claimant-process-left">
            <InlineRichText as="div" className="section-label" data={eyebrow} />
            <InlineRichText as="h2" className="section-title" data={heading} />
            <InlineRichText as="p" data={subheading} />
            {/* An uploaded photo replaces the placeholder outright — caption and
                glyph with it — which is what lets an editor leave the checkbox
                ticked forever. Same precedence as SplitFeature's media column. */}
            {image && typeof image === 'object' ? (
              <div className="claimant-process-media">
                <Media
                  resource={image}
                  fill
                  pictureClassName="absolute inset-0"
                  imgClassName="object-cover"
                />
              </div>
            ) : imagePlaceholder ? (
              <div className="claimant-process-media claimant-process-media--placeholder" aria-hidden>
                {placeholderIcon ? <Icon name={placeholderIcon} /> : null}
                {placeholderLabel ? <span>{placeholderLabel}</span> : null}
              </div>
            ) : null}
          </div>
          <div className="claimant-steps">
            {steps.map((step, i) => (
              <div key={i} className="claimant-step">
                <div className="claimant-step-num">{num(i, numberStyle)}</div>
                <div className="claimant-step-content">
                  {step.title ? <h3>{step.title}</h3> : null}
                  <Body data={step.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    )
  }

  // ── AAMLE educational feature panels (design-reference home #edu-panel): a
  // 2-column split intro (label + heading left, description right) followed by
  // dark 2-column feature panels — left: big faint step number + icon + title +
  // badge; right: description + bullet list. Reuses the ported `.aamle-*` CSS. ──
  if (variant === 'edu-panels') {
    return (
      <Section
        id={anchorId}
        background={background as SectionBackground}
        className={cn('vf-process-steps aamle-edu-block', toClassName(cssClass))}
        motion={motion}
        containerWidth={containerWidth}
        bare={bare}
      >
        {hasRichText(eyebrow) || hasRichText(heading) || hasRichText(subheading) || introRich ? (
          <div className="aamle-edu-intro">
            <div className="aamle-edu-intro-left">
              <InlineRichText as="span" className="aamle-edu-intro-label" data={eyebrow} />
              <InlineRichText as="h3" className="aamle-edu-intro-heading" data={heading} />
            </div>
            {/* The rich intro wins when set; `subheading` stays as the fallback so
                existing content keeps rendering and the plain field is still usable. */}
            {introRich ? (
              <div className="aamle-edu-intro-right">
                <RichText
                  data={introRich}
                  className="aamle-edu-intro-rich"
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            ) : subheading ? (
              <div className="aamle-edu-intro-right">
                <InlineRichText as="p" className="aamle-edu-intro-desc" data={subheading} />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="aamle-feature-panels">
          {steps.map((step, i) => (
            <div key={i} className="aamle-feature-panel">
              <div className="aamle-feature-panel-left">
                <span className="aamle-feature-panel-step">{num(i, numberStyle)}</span>
                {step.icon ? (
                  <div className="aamle-feature-panel-icon">
                    <Icon name={step.icon} />
                  </div>
                ) : null}
                {step.title ? <h4 className="aamle-feature-panel-title">{step.title}</h4> : null}
                {step.badge ? (
                  <span
                    className={cn(
                      'aamle-feature-panel-badge',
                      step.badgeStyle === 'accent' && 'aamle-feature-panel-badge--accent',
                    )}
                  >
                    {step.badge}
                  </span>
                ) : null}
              </div>
              <div className="aamle-feature-panel-right">
                <Body data={step.description} className="aamle-feature-panel-rich" />
                {Array.isArray(step.bullets) && step.bullets.length > 0 ? (
                  <ul className="aamle-feature-panel-list">
                    {step.bullets.map((b, j) => (
                      <li key={j}>{b.text}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>
    )
  }

  // ── Default: numbered card grid. ──
  return (
    <Section
      id={anchorId}
      background={background as SectionBackground}
      className={cn('vf-process-steps', toClassName(cssClass))}
      motion={motion}
      containerWidth={containerWidth}
      hoverEffect={hoverEffect}
      shadow={shadow}
      bare={bare}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        subtitle={subheading}
        align="center"
        titleClassName={toClassName(elementClasses?.heading)}
      />

      <div className="vf-process" style={{ '--vf-cols': Number(columns) || 3 } as React.CSSProperties}>
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn('vf-process-step vf-process-steps__step', toClassName(elementClasses?.card))}
          >
            <div className="vf-process-step-num vf-process-steps__number">{num(i, numberStyle)}</div>
            {step.icon ? (
              <div className="vf-process-step-icon vf-card__icon">
                <Icon name={step.icon} />
              </div>
            ) : null}
            {step.badge ? <span className="vf-process-step-badge">{step.badge}</span> : null}
            {step.title ? <h4 className="vf-card__title">{step.title}</h4> : null}
            <Body data={step.description} />
            {Array.isArray(step.bullets) && step.bullets.length > 0 ? (
              <ul className="vf-process-step-bullets">
                {step.bullets.map((b, j) => (
                  <li key={j}>{b.text}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  )
}
