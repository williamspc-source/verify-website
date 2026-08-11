/**
 * Phase 5 codemod: border-radius literals → the named radius ladder, and the
 * repeated gradient recipes → their tokens.
 *
 *   node tests/visual/tokeniseShape.mjs <radius|gradient> [--dry]
 *
 * Value-preserving by construction, so `computedSnapshot.mjs compare` must stay
 * empty. Same carve-out rules as tokenise.mjs: never touch a custom-property
 * declaration (those ARE the defaults) or the token-defining :root blocks.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/app/(frontend)/globals.css'

const RADIUS = {
  '0': 'var(--vf-radius-none)',
  '8px': 'var(--vf-radius-sm)',
  '10px': 'var(--vf-radius-chip)',
  '12px': 'var(--vf-radius-card)',
  '14px': 'var(--vf-radius-tile)',
  '16px': 'var(--vf-radius-md)',
  '20px': 'var(--vf-radius-panel)',
  '999px': 'var(--vf-radius-pill)',
  '50%': 'var(--vf-radius-circle)',
}

// Only the recipes that repeat. One-off gradients stay literal — a token used
// once is just indirection, and the escape hatch reaches them anyway.
const GRADIENTS = [
  [/linear-gradient\(145deg,\s*var\(--accent\),\s*var\(--accent-light\)\)/g, 'var(--vf-grad-image-tint)'],
  [/linear-gradient\(145deg,\s*var\(--accent\)\s+0%,\s*var\(--accent-light\)\s+100%\)/g, 'var(--vf-grad-image-tint)'],
  // NOTE: the 135deg variants of this same colour pair are deliberately NOT
  // mapped here. The token is 145deg, so folding them in would silently rotate
  // those gradients by 10 degrees — caught by the computed-style diff.
  [/linear-gradient\(135deg,\s*var\(--primary-deep\)\s+0%,\s*var\(--primary\)\s+100%\)/g, 'var(--vf-grad-deep)'],
  [/linear-gradient\(160deg,\s*var\(--gradient-start\)\s+0%,\s*var\(--primary\)\s+100%\)/g, 'var(--vf-grad-hero)'],
  // Byte-identical to bands already exposed in the admin — reuse rather than
  // minting a second editable copy that could drift from the first.
  [/linear-gradient\(135deg,\s*#eef9ff\s+0%,\s*#e6f4ff\s+48%,\s*#d9efff\s+100%\)/g, 'var(--band-accent)'],
  [/linear-gradient\(135deg,\s*#0d4f85\s+0%,\s*var\(--primary\)\s+100%\)/g, 'var(--band-primary)'],
]

const SKIP_LINE = [/mask-image/i, /^\s*--/]
const SKIP_RULE = [/\.vf-video-embed__ratio\b/, /\.vf-on-dark\b/, /\.vf-on-light\b/]

const lines = readFileSync(FILE, 'utf8').split('\n')

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

const mode = process.argv[2]
const dry = process.argv.includes('--dry')
let count = 0

const out = lines.map((line, i) => {
  if (!editable[i] || SKIP_LINE.some((re) => re.test(line))) return line
  let l = line

  if (mode === 'radius') {
    // Only single-value border-radius declarations. Multi-value shorthands
    // (`12px 12px 0 0`) express a shape, not a scale rung, so they stay literal.
    l = l.replace(/border-radius:\s*([^;}]+)([;}]?)/g, (m, value, tail) => {
      const v = value.trim()
      if (!(v in RADIUS)) return m
      count++
      return `border-radius: ${RADIUS[v]}${tail}`
    })
  } else if (mode === 'gradient') {
    for (const [re, token] of GRADIENTS) {
      l = l.replace(re, () => (count++, token))
    }
  } else {
    console.error('mode must be radius or gradient')
    process.exit(2)
  }
  return l
})

console.log(`${mode}: ${count} replacement(s)${dry ? ' (dry run)' : ''}`)
if (!dry) writeFileSync(FILE, out.join('\n'))
