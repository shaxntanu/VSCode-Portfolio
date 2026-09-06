// Avatar runtime for Portfolio Companion
// Renders Freddy from byte.avatar.json definition with proper body geometry
import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import styles from './Avatar.module.css';

interface AvatarDefinition {
  schema: string;
  schemaVersion: number;
  name: string;
  colors: {
    body: string;
    eyes: string;
  };
  body: {
    primary?: {
      type: string;
      width: number;
      height: number;
      depth: number;
      roundness: number;
    };
    nodes?: Array<{
      surface: {
        type: string;
        width: number;
        height: number;
        depth: number;
        roundness: number;
      };
      position: [number, number, number];
      rotation: [number, number, number];
    }>;
  };
  expressions: Record<string, any>;
  expressionOrder: string[];
  animations: Record<string, any>;
  animationOrder: string[];
}

interface AvatarProps {
  definition: AvatarDefinition;
  defaultAnimation?: string;
  autoplay?: boolean;
  size?: number;
  ariaLabel?: string;
  gazeTarget?: { x: number; y: number };
}

export interface AvatarRef {
  play: (animationKey: string) => void;
  stop: () => void;
  setExpression: (expressionKey: string) => void;
}

const Avatar = forwardRef<AvatarRef, AvatarProps>(({
  definition,
  defaultAnimation = 'idle',
  autoplay = true,
  size = 96,
  ariaLabel = 'Avatar',
  gazeTarget
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentAnimationRef = useRef<string>(defaultAnimation);
  const currentExpressionRef = useRef<string>('neutral');
  const animationFrameRef = useRef<number | null>(null);
  const animationStateRef = useRef<{
    stepIndex: number;
    stepStartTime: number;
    isTransitioning: boolean;
  }>({ stepIndex: 0, stepStartTime: Date.now(), isTransitioning: false });
  
  const [blinkState, setBlinkState] = useState({ isBlinking: false, nextBlink: Date.now() + 3000 });

  // Render the avatar on canvas
  const renderAvatar = useCallback((expression: any, blinkAmount = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const scale = size / 320; // Scale to fit in the size

    ctx.save();
    ctx.translate(centerX, centerY);

    // Apply head rotation from expression
    const headRot = expression?.head?.rotation || { x: 0, y: 0, z: 0 };
    const rotX = (headRot.x || 0) * Math.PI / 180;
    const rotY = (headRot.y || 0) * Math.PI / 180;
    const rotZ = (headRot.z || 0) * Math.PI / 180;

    // Simple 2D projection with rotation
    ctx.rotate(rotZ);

    // Render body - primary cube
    if (definition.body.primary) {
      const primary = definition.body.primary;
      ctx.fillStyle = definition.colors.body;
      
      // Draw primary body as a rounded rectangle (simplified cube)
      const w = primary.width * scale * 0.8;
      const h = primary.height * scale * 0.8;
      const radius = Math.min(w, h) * primary.roundness * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(-w/2 + radius, -h/2);
      ctx.lineTo(w/2 - radius, -h/2);
      ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + radius);
      ctx.lineTo(w/2, h/2 - radius);
      ctx.quadraticCurveTo(w/2, h/2, w/2 - radius, h/2);
      ctx.lineTo(-w/2 + radius, h/2);
      ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - radius);
      ctx.lineTo(-w/2, -h/2 + radius);
      ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + radius, -h/2);
      ctx.closePath();
      ctx.fill();
    }

    // Render body nodes
    if (definition.body.nodes) {
      // Sort nodes by Z position for painter's algorithm
      const sortedNodes = [...definition.body.nodes].sort((a, b) => a.position[2] - b.position[2]);
      
      sortedNodes.forEach(node => {
        const surface = node.surface;
        const x = node.position[0] * scale;
        const y = node.position[1] * scale;
        const z = node.position[2] * scale;
        
        // Apply 3D rotation
        const rotatedY = y * Math.cos(rotX) - z * Math.sin(rotX);
        const rotatedZ = y * Math.sin(rotX) + z * Math.cos(rotX);
        const rotatedX = x * Math.cos(rotY) + rotatedZ * Math.sin(rotY);
        const finalZ = -x * Math.sin(rotY) + rotatedZ * Math.cos(rotY);
        
        // Perspective projection
        const perspective = 1 / (1 + finalZ * 0.001);
        const projX = rotatedX * perspective;
        const projY = rotatedY * perspective;
        
        // Darken back nodes
        const brightness = Math.max(0.6, 1 - finalZ * 0.002);
        const color = adjustBrightness(definition.colors.body, brightness);
        
        ctx.fillStyle = color;
        
        if (surface.type === 'sphere') {
          const radius = (surface.width / 2) * scale * perspective;
          ctx.beginPath();
          ctx.arc(projX, projY, radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (surface.type === 'cylinder') {
          // Draw cylinder as ellipse
          const radiusX = (surface.width / 2) * scale * perspective;
          const radiusY = (surface.height / 2) * scale * perspective;
          ctx.beginPath();
          ctx.ellipse(projX, projY, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Render eyes with gaze offset
    const leftEye = expression?.leftEye || {};
    const rightEye = expression?.rightEye || {};
    
    // Apply gaze offset if provided
    const gazeOffsetX = (gazeTarget?.x || 0) * 15 * scale; // Max 15px offset
    const gazeOffsetY = (gazeTarget?.y || 0) * 10 * scale; // Max 10px offset
    
    ctx.fillStyle = definition.colors.eyes;
    
    // Left eye
    drawEye(ctx, {
      x: (leftEye.x || -40) * scale + gazeOffsetX,
      y: (leftEye.y || -20) * scale + gazeOffsetY,
      width: (leftEye.width || 18) * scale,
      height: ((leftEye.height || 40) * (1 - blinkAmount)) * scale,
      angle: (leftEye.angle || 0) * Math.PI / 180
    });
    
    // Right eye
    drawEye(ctx, {
      x: (rightEye.x || 40) * scale + gazeOffsetX,
      y: (rightEye.y || -20) * scale + gazeOffsetY,
      width: (rightEye.width || 18) * scale,
      height: ((rightEye.height || 40) * (1 - blinkAmount)) * scale,
      angle: (rightEye.angle || 0) * Math.PI / 180
    });

    ctx.restore();
  }, [definition.body.primary, definition.body.nodes, definition.colors.body, definition.colors.eyes, size, gazeTarget]);

  const drawEye = (ctx: CanvasRenderingContext2D, eye: any) => {
    ctx.save();
    ctx.translate(eye.x, eye.y);
    ctx.rotate(eye.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, eye.width, eye.height, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const adjustBrightness = (hex: string, factor: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `#${
      Math.round(r * factor).toString(16).padStart(2, '0')}${
      Math.round(g * factor).toString(16).padStart(2, '0')}${
      Math.round(b * factor).toString(16).padStart(2, '0')
    }`;
  };

  // Animation loop
  useEffect(() => {
    if (!autoplay) return;

    let isRunning = true;
    
    const animate = () => {
      if (!isRunning) return;

      // Handle blinking
      const now = Date.now();
      let currentBlink = 0;
      
      if (blinkState.isBlinking) {
        const blinkProgress = (now - (blinkState.nextBlink - 170)) / 170;
        if (blinkProgress >= 1) {
          setBlinkState({ isBlinking: false, nextBlink: now + 2600 + Math.random() * 3600 });
        } else {
          // Sin wave blink
          currentBlink = Math.sin(blinkProgress * Math.PI);
        }
      } else if (now >= blinkState.nextBlink) {
        setBlinkState({ isBlinking: true, nextBlink: now });
      }

      // Get current animation and expression
      const animation = definition.animations[currentAnimationRef.current];
      if (animation && animation.steps) {
        const state = animationStateRef.current;
        const currentStep = animation.steps[state.stepIndex];
        
        if (currentStep) {
          const elapsed = now - state.stepStartTime;
          const transitionTime = currentStep.transitionMs || 0;
          const holdTime = currentStep.holdMs || 0;
          
          if (elapsed < transitionTime + holdTime) {
            // Get expression
            const expr = definition.expressions[currentStep.expression] || definition.expressions.neutral;
            currentExpressionRef.current = currentStep.expression;
            renderAvatar(expr, currentBlink);
          } else {
            // Move to next step
            state.stepIndex = (state.stepIndex + 1) % animation.steps.length;
            state.stepStartTime = now;
          }
        }
      } else {
        // No animation, render neutral
        const expr = definition.expressions[currentExpressionRef.current] || definition.expressions.neutral;
        renderAvatar(expr, currentBlink);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoplay, definition, size, blinkState, renderAvatar, gazeTarget]);

  // Expose control methods
  useImperativeHandle(ref, () => ({
    play: (animationKey: string) => {
      if (definition.animations[animationKey]) {
        currentAnimationRef.current = animationKey;
        animationStateRef.current = {
          stepIndex: 0,
          stepStartTime: Date.now(),
          isTransitioning: false
        };
      }
    },
    stop: () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    },
    setExpression: (expressionKey: string) => {
      if (definition.expressions[expressionKey]) {
        currentExpressionRef.current = expressionKey;
      }
    }
  }));

  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          width: size,
          height: size
        }}
        aria-hidden="true"
      />
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
