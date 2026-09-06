// Adapts the flat Freddy avatar definition (freddy.avatar.ts, authored for the
// old blob runtime) to the nested schema the vendored @bible-strong/avatar-react
// runtime validates against in bible-strong/validation.js:
//
//   flat headX/headY/headZ        -> expression.head.{x,y,z}
//   flat widthLeft/widthRight/... -> expression.eyes.{left,right}.* + spacing
//   flat eyeMotion/bodyMotion     -> expression.motion.{eyes,body}
//   avatar.surface/bodyNodes      -> body.primary / body.nodes
//   avatar.colors                 -> top-level colors
//
// The runtime's expressionOrder/animationOrder requirements, the reserved
// 'neutral' expression and per-step `expression` (instead of `expressionId`)
// are synthesized here so freddy.avatar.ts stays the single source of truth.
//
// Live gaze tracking (PortfolioCompanion.tsx) mutates the exported
// definition.expressions['gaze-live'] object every frame. This is safe:
// sampleAvatarFrame reads definition.expressions[activeExpression] per paint,
// and Avatar.jsx keeps using the original (unfrozen) definition object.

import { avatarData } from './freddy.avatar'

type FlatExpression = {
  id: string
  headX: number
  headY: number
  headZ: number
  widthLeft: number
  widthRight: number
  heightLeft: number
  heightRight: number
  spacing: number
  positionXLeft: number
  positionXRight: number
  positionYLeft: number
  positionYRight: number
  leftAngle: number
  rightAngle: number
  perspective: number
  eyeMotion: 'none' | 'microSaccades' | 'shake'
  bodyMotion: 'none' | 'slowDrift' | 'shake'
}

const sideEyes = (expression: FlatExpression, suffix: 'Left' | 'Right') => ({
  width: expression[`width${suffix}`],
  height: expression[`height${suffix}`],
  x: expression[`positionX${suffix}`],
  y: expression[`positionY${suffix}`],
  angle: suffix === 'Left' ? expression.leftAngle : expression.rightAngle,
})

const toNestedExpression = (key: string, expression: FlatExpression) => ({
  id: key,
  perspective: expression.perspective,
  head: {
    x: expression.headX,
    y: expression.headY,
    z: expression.headZ,
  },
  motion: {
    eyes: expression.eyeMotion,
    body: expression.bodyMotion,
  },
  eyes: {
    spacing: expression.spacing,
    left: sideEyes(expression, 'Left'),
    right: sideEyes(expression, 'Right'),
  },
})

// Calm, centered baseline for the runtime and the gaze blend. Mirrors Freddy's
// idle eye proportions (expression-08) but with a frontal head, so transitions
// into/out of gaze-follow hold the face shape steady.
const NEUTRAL: FlatExpression = {
  id: 'neutral',
  headX: 0,
  headY: 0,
  headZ: 0,
  widthLeft: 29.5,
  widthRight: 29.5,
  heightLeft: 58.6,
  heightRight: 58.6,
  spacing: 67.3,
  positionXLeft: -0.12,
  positionXRight: -0.12,
  positionYLeft: 2.69,
  positionYRight: 2.69,
  leftAngle: 0,
  rightAngle: 0,
  perspective: 1,
  eyeMotion: 'none',
  bodyMotion: 'none',
}

export const buildBibleStrongDefinition = (source: typeof import('./freddy.avatar').avatarData) => {
  const expressions: Record<string, unknown> = {}
  for (const [key, expression] of Object.entries(source.expressions)) {
    expressions[key] = toNestedExpression(key, expression as unknown as FlatExpression)
  }

  // gaze-live is a per-frame mutated slot (see PortfolioCompanion's gaze
  // effect). It starts from neutral; the runtime never validates it again once
  // the definition is accepted, so live property writes repaint naturally.
  const gazeLive = toNestedExpression('gaze-live', NEUTRAL)
  expressions['gaze-live'] = gazeLive

  const expressionKeys = Object.keys(source.expressions)
  // validation.js semanticErrors requires every expressions key to appear in
  // expressionOrder, so the live gaze slot must be listed here too (last).
  const expressionOrder = ['neutral', ...expressionKeys, 'gaze-live']

  const animations: Record<string, unknown> = {}
  for (const [key, animation] of Object.entries(source.animations)) {
    const animationValue = animation as {
      playbackMode: string
      blink: unknown
      steps: Array<{ expressionId: string; holdMs: number; transitionMs: number; transition: string }>
    }
    animations[key] = {
      ...animationValue,
      steps: animationValue.steps.map(step => ({
        expression: step.expressionId,
        holdMs: step.holdMs,
        transitionMs: step.transitionMs,
        transition: step.transition,
      })),
    }
  }

  // Single-step loop over the live-mutated gaze slot. Blink is driven manually
  // by the gaze effect (it writes eye heights directly), so it is disabled
  // here to avoid the runtime stepping the playback mid-gaze.
  animations['gaze-follow'] = {
    name: 'gaze-follow',
    description: 'Suivi du curseur en direct.',
    playbackMode: 'loop',
    blink: { enabled: false, initialDelayMs: 0, minIntervalMs: 0, maxIntervalMs: 0, durationMs: 0 },
    steps: [
      { expression: 'gaze-live', holdMs: 1200, transitionMs: 420, transition: 'smooth' },
    ],
  }

  const animationOrder = Object.keys(source.animations)
  animationOrder.push('gaze-follow')

  return {
    schema: source.schema,
    schemaVersion: source.schemaVersion,
    version: source.version,
    name: source.avatar.name,
    colors: { ...source.avatar.colors },
    body: {
      primary: { ...source.avatar.surface },
      nodes: source.avatar.bodyNodes.map((node: any) => ({
        id: node.id,
        name: node.name,
        surface: { ...node.surface },
        position: [...(node.position as number[])],
        rotation: [...(node.rotation as number[])],
      })),
    },
    expressions: {
      neutral: toNestedExpression('neutral', NEUTRAL),
      ...expressions,
    },
    expressionOrder,
    animations,
    animationOrder,
  }
}

// Single mutable instance. The Avatar component receives this exact object;
// validation mutates nothing, and the gaze effect writes into
// expressions['gaze-live'], which runtime.js sampleAvatarFrame reads live.
export const byteAvatarDefinition = buildBibleStrongDefinition(avatarData)