/**
 * One-shot codemod for the CSS token migration (Phase 4).
 *
 * Replaces colour literals in globals.css with the `var()` / `color-mix()` forms
 * that already resolve to the identical computed value, so that editing a brand
 * colour in the admin actually repaints the site. Every substitution here is
 * value-preserving by construction — `computedSnapshot.mjs compare` must report
 * an empty diff afterwards, and any diff is a bug rather than a tolerance.
 *
 *   node tests/visual/tokenise.mjs <4a|4b|4c|4d> [--dry]
 *
 * Carve-outs are deliberate; see SKIP_LINE and the :root handling below.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/app/(frontend)/globals.css'

// Lines we must never touch, with the reason each one exists.
const SKIP_LINE = [
  // #000 here is an alpha MASK channel, not a colour. Tokenising it would let a
  // brand-colour edit erase the carousel's edge fade.
  /mask-image/i,
  // Custom-property declarations are the token defaults themselves. Rewriting a
  // default in terms of another token invites cycles and makes the admin field's
  // placeholder text lie about what the default is.
  /^\s*--/,
]

// Whole rules to leave alone, matched on their selector.
const SKIP_RULE = [
  // Video letterbox: black by definition, not a brand colour.
  /\.vf-video-embed__ratio\b/,
  // These blocks DEFINE the light/dark token indirection. Substituting inside
  // them creates `--text-dark: var(--text-dark)` cycles.
  /\.vf-on-dark\b/,
  /\.vf-on-light\b/,
]

const EXACT_HEX = {
  '#cbe5fa': 'var(--accent)',
  '#1c75bc': 'var(--primary)',
  '#93d0f7': 'var(--accent-light)',
  '#155fa0': 'var(--primary-strong)',
  '#1a3a5c': 'var(--primary-deep)',
  // --text-dark-base, NOT --text-dark: the latter flips to white inside dark
  // bands, so painting a surface with it would make it disappear there.
  '#414042': 'var(--text-dark-base)',
  '#8bb9dd': 'var(--secondary-2)',
  '#f5f6f8': 'var(--band-muted)',
  '#14639e': 'var(--gradient-start)',
  '#c6c6c6': 'var(--border-base)',
  '#222222': 'var(--text-mid-base)',
  '#2d8fe8': 'var(--secondary-bright)',
  '#5ba3d9': 'var(--definition-blue)',
}

/** rgba(R,G,B,A) with an opaque source ≡ color-mix(<colour> A*100%, transparent). */
const mix = (token, alpha) => {
  const pct = Number((parseFloat(alpha) * 100).toFixed(4))
  return `color-mix(in srgb, var(${token}) ${pct}%, transparent)`
}

const src = readFileSync(FILE, 'utf8')
const lines = src.split('\n')

// Track whether we're inside a :root block or a skipped rule.
let depth = 0
let rootDepth = -1
let skipDepth = -1
const editable = lines.map((line) => {
  const opensRoot = /(^|\s):root\s*\{/.test(line)
  const opensSkip = SKIP_RULE.some((re) => re.test(line)) && line.includes('{')
  const before = depth
  depth += (line.match(/\{/g) || []).length
  depth -= (line.match(/\}/g) || []).length
  if (opensRoot && rootDepth < 0) rootDepth = before
  else if (rootDepth >= 0 && depth <= rootDepth) rootDepth = -1
  if (opensSkip && skipDepth < 0) skipDepth = before
  else if (skipDepth >= 0 && depth <= skipDepth) skipDepth = -1
  return !(opensRoot || rootDepth >= 0 || opensSkip || skipDepth >= 0)
})

const phase = process.argv[2]
const dry = process.argv.includes('--dry')
let count = 0

const out = lines.map((line, i) => {
  if (!editable[i]) return line
  if (SKIP_LINE.some((re) => re.test(line))) return line
  let l = line

  if (phase === '4a') {
    l = l.replace(/#fff(?![0-9a-fA-F])/gi, () => (count++, 'var(--white)'))
    l = l.replace(/#ffffff(?![0-9a-fA-F])/gi, () => (count++, 'var(--white)'))
  } else if (phase === '4b') {
    for (const [hex, token] of Object.entries(EXACT_HEX)) {
      l = l.replace(new RegExp(`${hex}(?![0-9a-fA-F])`, 'gi'), () => (count++, token))
    }
  } else if (phase === '4c') {
    l = l.replace(
      /rgba\(\s*28\s*,\s*117\s*,\s*188\s*,\s*([\d.]+)\s*\)/gi,
      (_m, a) => (count++, mix('--primary', a)),
    )
  } else if (phase === '4d') {
    l = l.replace(
      /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/gi,
      (_m, a) => (count++, mix('--white', a)),
    )
  } else {
    console.error('phase must be one of 4a 4b 4c 4d')
    process.exit(2)
  }
  return l
})

console.log(`${phase}: ${count} replacement(s)${dry ? ' (dry run)' : ''}`)
if (!dry) writeFileSync(FILE, out.join('\n'))
