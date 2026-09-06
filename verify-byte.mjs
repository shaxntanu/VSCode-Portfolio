// Temporary verification harness for Byte's bible-strong avatar wiring.
// Compiles the real adapter (freddy.bibleStrong.ts) and the real vendored ESM
// runtime (.js) via the installed TypeScript transpiler, then runs the REAL
// validateAvatarDefinition + runtime functions to prove:
//   1. byteAvatarDefinition passes validation
//   2. expressionOrder/animationOrder are complete
//   3. every animation step references a known expression
//   4. 'gaze-follow' plays into the live 'gaze-live' slot
//   5. mutating expressions['gaze-live'] repaints the sampled frame (the exact
//      mechanism PortfolioCompanion's gaze effect relies on)
//   6. the runtime renders real geometry for the definition
// Delete this file before committing.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ts = await import('typescript')
const root = path.dirname(fileURLToPath(import.meta.url))

const transpile = src =>
  ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText

const cache = {}
const createRequire = fromDir => spec => {
  const abs = path.resolve(fromDir, spec)
  for (const candidate of [abs, `${abs}.ts`, `${abs}.js`]) {
    if (!fs.existsSync(candidate)) continue
    if (cache[candidate]) return cache[candidate].exports
    const src = fs.readFileSync(candidate, 'utf8')
    const m = { exports: {} }
    const fn = new Function(
      'module', 'exports', 'require', '__filename', '__dirname',
      transpile(src)
    )
    fn(m, m.exports, createRequire(path.dirname(candidate)), candidate, path.dirname(candidate))
    cache[candidate] = m
    return m.exports
  }
  throw new Error(`Cannot resolve "${spec}" from ${fromDir}`)
}

const dir = path.join(root, 'components', 'Avatar')
const requireAvatar = createRequire(dir)

const {
  byteAvatarDefinition,
} = requireAvatar('./freddy.bibleStrong')

const {
  validateAvatarDefinition,
} = requireAvatar('./bible-strong/validation')
const {
  playAvatarAnimation,
  sampleAvatarFrame,
  createAvatarPlaybackState,
  advanceAvatarPlayback,
} = requireAvatar('./bible-strong/runtime')
const {
  renderAvatarDefinition,
} = requireAvatar('./bible-strong/scene')

const env = { random: Math.random, reduceMotion: false }
const results = []
const check = (name, ok, extra) => results.push({ name, ok: Boolean(ok), extra })

// 1. Validation of the real adapter output.
const v = validateAvatarDefinition(byteAvatarDefinition)
check('validateAvatarDefinition(byteAvatarDefinition).ok', v.ok, v.errors)

// 2. Order completeness (validation.js semanticErrors requires both directions).
const exprKeys = Object.keys(byteAvatarDefinition.expressions)
const animKeys = Object.keys(byteAvatarDefinition.animations)
check(
  'expressionOrder lists every expression key, neutral first',
  byteAvatarDefinition.expressionOrder[0] === 'neutral' &&
    exprKeys.every(k => byteAvatarDefinition.expressionOrder.includes(k)) &&
    byteAvatarDefinition.expressionOrder.every(k => exprKeys.includes(k)),
  { exprCount: exprKeys.length, orderCount: byteAvatarDefinition.expressionOrder.length }
)
check(
  'animationOrder lists every animation key',
  animKeys.every(k => byteAvatarDefinition.animationOrder.includes(k)) &&
    byteAvatarDefinition.animationOrder.every(k => animKeys.includes(k)),
  { animCount: animKeys.length, orderCount: byteAvatarDefinition.animationOrder.length }
)

// 3. Every animation step references a known expression.
const badSteps = animKeys.filter(ak =>
  byteAvatarDefinition.animations[ak].steps.some(s => !exprKeys.includes(s.expression))
)
check('every animation step expression is known', badSteps.length === 0, badSteps)

// 4. 'gaze-follow' resolves and targets the live slot.
const gaze = playAvatarAnimation(byteAvatarDefinition, 'gaze-follow', 0)
check('gaze-follow plays', gaze.ok, gaze.error)
check('gaze-follow first step is gaze-live', gaze.ok && gaze.value.activeExpression === 'gaze-live')

// 5. Live repaint: baseline sample, then mutate the slot and re-sample.
const gazeState = { ...createAvatarPlaybackState(), activeExpression: 'gaze-live' }
const baseline = sampleAvatarFrame(byteAvatarDefinition, gazeState, 1000, env)
check('baseline gaze-live headY is neutral (0)', Math.abs(baseline.expression.headY) < 1e-9, baseline.expression.headY)

byteAvatarDefinition.expressions['gaze-live'].head.y = 20
byteAvatarDefinition.expressions['gaze-live'].eyes.left.angle = -16
byteAvatarDefinition.expressions['gaze-live'].eyes.spacing = 80
const repainted = sampleAvatarFrame(byteAvatarDefinition, gazeState, 1000, env)
check('mutated head.y repaints (20)', Math.abs(repainted.expression.headY - 20) < 1e-6, repainted.expression.headY)
check('mutated left.angle repaints (-16)', Math.abs(repainted.expression.leftAngle - -16) < 1e-6, repainted.expression.leftAngle)
check('mutated spacing repaints (80)', Math.abs(repainted.expression.spacing - 80) < 1e-6, repainted.expression.spacing)

// Restore neutral so the definition stays clean for the build.
byteAvatarDefinition.expressions['gaze-live'] = {
  ...byteAvatarDefinition.expressions['gaze-live'],
  head: { ...byteAvatarDefinition.expressions['gaze-live'].head, y: 0 },
  eyes: {
    ...byteAvatarDefinition.expressions['gaze-live'].eyes,
    spacing: 67.3,
    left: { ...byteAvatarDefinition.expressions['gaze-live'].eyes.left, angle: 0 },
    right: { ...byteAvatarDefinition.expressions['gaze-live'].eyes.right, angle: 0 },
  },
}

// 6. Gaze-follow playback loop advances: transition -> hold -> loop.
let st = gaze.value
st = advanceAvatarPlayback(byteAvatarDefinition, st, 500, env)
check('gaze-follow advances transition->hold', st.phase === 'hold' && st.activeExpression === 'gaze-live', { phase: st.phase })
st = advanceAvatarPlayback(byteAvatarDefinition, st, 500 + 1200, env)
check('gaze-follow loops hold->transition', st.phase === 'transition' && st.activeExpression === 'gaze-live', { phase: st.phase })

// 7. Idle still plays (mood animations unbroken).
const idle = playAvatarAnimation(byteAvatarDefinition, 'idle', 0)
check('idle plays', idle.ok, idle.error)
check('idle first step is expression-00', idle.ok && idle.value.activeExpression === 'expression-00')

// 8. The runtime renders real geometry for neutral and a freddy expression.
const neutralScene = renderAvatarDefinition(byteAvatarDefinition, 'neutral')
check('renderAvatarDefinition(neutral) produces a head path', typeof neutralScene.geometry.headPath === 'string' && neutralScene.geometry.headPath.length > 40, neutralScene.geometry.headPath.slice(0, 60))
const moodScene = renderAvatarDefinition(byteAvatarDefinition, 'expression-02')
check('renderAvatarDefinition(expression-02) produces a head path', typeof moodScene.geometry.headPath === 'string' && moodScene.geometry.headPath.length > 40, moodScene.geometry.headPath.slice(0, 60))

// Report
let pass = 0
for (const r of results) {
  if (r.ok) {
    pass += 1
    console.log(`  PASS  ${r.name}`)
  } else {
    console.log(`  FAIL  ${r.name}`)
    console.log(`        ${JSON.stringify(r.extra) ?? ''}`)
  }
}
console.log(`\n${pass}/${results.length} checks passed`)
process.exit(pass === results.length ? 0 : 1)
