import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { InlineRichText } from '@/components/RichText/Inline'

/**
 * The inline renderer, checked by looking at the markup it produces.
 *
 * Every failure this component exists to prevent is invisible to a test that
 * does not read the HTML. `<h2><p>Heading</p></h2>` renders, throws nothing, and
 * merely looks wrong; a two-line heading collapsing to one line renders too. So
 * these assertions are all about shape.
 *
 * The breaks, run:
 *
 *  · Remove `disableContainer` → "renders no wrapper div" fails, and the markup
 *    shows the `<div class="payload-richtext">` the upstream component adds
 *    inside the `<h2>`.
 *  · Delete `inlineParagraphConverter` → "a second paragraph becomes a line
 *    break" fails with `<p>` in the output. This is the one that would otherwise
 *    ship: it needs no code change to appear, only the converter being left out.
 */

const state = (...paragraphs: string[]) =>
  ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          { type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
        ],
      })),
    },
  }) as never

const html = (el: React.ReactElement) => renderToStaticMarkup(el)

describe('InlineRichText', () => {
  it('renders the tag the caller asked for, with its classes', () => {
    const out = html(
      <InlineRichText as="h2" className="section-title" data={state('Meet Our Expert Panel')} />,
    )
    expect(out).toContain('<h2')
    expect(out).toContain('section-title')
    expect(out).toContain('Meet Our Expert Panel')
  })

  it('renders no paragraph and no wrapper div inside the heading', () => {
    // The whole point. Both of these render perfectly well and are both wrong.
    const out = html(<InlineRichText as="h2" data={state('Meet Our Expert Panel')} />)
    expect(out).not.toContain('<p')
    expect(out).not.toContain('payload-richtext')
  })

  it('a second paragraph becomes a line break, not a second block', () => {
    // The two-line lockups depend on this: "Ensuring Accuracy," / "Empowering
    // Justice" is one heading on two lines, and was a textarea newline before.
    const out = html(<InlineRichText as="h1" data={state('Ensuring Accuracy,', 'Empowering Justice')} />)
    expect(out).toContain('<br/>')
    expect(out).not.toContain('<p')
    expect(out.indexOf('Ensuring Accuracy,')).toBeLessThan(out.indexOf('Empowering Justice'))
  })

  it('keeps the accent convention working inside rich text', () => {
    const out = html(<InlineRichText as="h2" data={state('Meet Our [[Expert Panel]]')} />)
    expect(out).toContain('vf-accent')
    expect(out).not.toContain('[[')
  })

  it('applies the editor’s colour choice as a class', () => {
    const out = html(<InlineRichText as="h2" colour="brand" data={state('Coloured')} />)
    expect(out).toContain('vf-tc-brand')
  })

  it('adds no colour class for the default choice', () => {
    // Adding the control to a block must move nothing until someone picks.
    const out = html(<InlineRichText as="h2" colour="inherit" data={state('Plain')} />)
    expect(out).not.toContain('vf-tc-')
  })

  it('still renders a plain string, because the conversion runs in waves', () => {
    const out = html(<InlineRichText as="h2" className="section-title" data="Still A String" />)
    expect(out).toContain('<h2')
    expect(out).toContain('Still A String')
  })

  it('honours [[accent]] and newlines in a plain string exactly as before', () => {
    const out = html(<InlineRichText as="h1" data={'Ensuring Accuracy,\nEmpowering [[Justice]]'} />)
    expect(out).toContain('vf-accent')
    expect(out).toContain('<br/>')
  })

  it('renders nothing for an empty field, in both shapes', () => {
    // An empty rich text is a truthy object; a component that rendered it would
    // paint an empty heading band on every page with a blank header.
    expect(html(<InlineRichText as="h2" data={state('')} />)).toBe('')
    expect(html(<InlineRichText as="h2" data="" />)).toBe('')
    expect(html(<InlineRichText as="h2" data={null} />)).toBe('')
  })
})
