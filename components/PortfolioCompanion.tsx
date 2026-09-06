import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUIState } from '@/contexts/UIStateContext';
import { routeMessages, clickMessages, portfolioFacts, inactivityMessages } from '@/data/companionMessages';
import Avatar from '@/components/Avatar/bible-strong/Avatar.jsx';
import { byteAvatarDefinition } from '@/components/Avatar/freddy.bibleStrong';
import styles from '@/styles/PortfolioCompanion.module.css';

type ByteMood = 'idle' | 'happy' | 'excited' | 'curious' | 'bored' | 'suspicious' | 'angry';

interface Message {
  text: string;
  animation: string;
  priority: number;
  id: string;
}

const MESSAGE_PRIORITY = {
  route: 100,
  intro: 90,
  click: 60,
  fact: 50,
  inactivity: 10
};

const INTRO_KEY = 'byte-intro-shown';
const INTRO_DELAY_MS = 2000;
const MESSAGE_DISPLAY_MS = 5000;
const INACTIVITY_BORED_MS = 50000; // 50 seconds
const INACTIVITY_ANGRY_MS = 150000; // 2.5 minutes
const FACT_INTERVAL_MIN_MS = 60000; // 1 minute
const FACT_INTERVAL_MAX_MS = 120000; // 2 minutes

export default function PortfolioCompanion() {
  const router = useRouter();
  const { zenMode } = useUIState();
  const [isVisible, setIsVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [mood, setMood] = useState<ByteMood>('idle');
  const [liteMode, setLiteMode] = useState(true);

  // Refs for timer management
  const avatarRef = useRef<any>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<ByteMood>('idle');
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);
  const factTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityCheckRef = useRef<NodeJS.Timeout | null>(null);
  const mouseAnimFrameRef = useRef<number | null>(null);
  const gazeFrameRef = useRef<number | null>(null);
  const lastActivityRef = useRef(Date.now());
  const lastFactRef = useRef<string | null>(null);
  const lastRouteRef = useRef<string>('');
  const messageRef = useRef<Message | null>(null);
  const currentMessageIdRef = useRef<string>('');
  const boredMessageShownRef = useRef(false);
  
  // Mouse tracking state
  const mouseStateRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    lastMoveAt: Date.now()
  });

  // Eye gaze live-tracking state (see the gaze effect below)
  const gazeStateRef = useRef({
    on: false,
    armed: false,
    lastMoveAt: 0,
    targetX: 0,
    targetY: 0,
    u: 0,
    v: 0,
    t: 0,
    nextBlinkAt: 0,
    blinkUntil: 0
  });

  messageRef.current = message;
  moodRef.current = mood;

  // Clear all timers - defined first to avoid hoisting issues
  const clearAllTimers = useCallback(() => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    if (factTimerRef.current) clearTimeout(factTimerRef.current);
    if (inactivityCheckRef.current) clearTimeout(inactivityCheckRef.current);
    if (mouseAnimFrameRef.current) cancelAnimationFrame(mouseAnimFrameRef.current);
    if (gazeFrameRef.current) cancelAnimationFrame(gazeFrameRef.current);
  }, []);

  // Check lite mode
  useEffect(() => {
    const savedLiteMode = localStorage.getItem('liteMode');
    const isLiteMode = savedLiteMode === null ? true : savedLiteMode === 'true';
    setLiteMode(isLiteMode);
  }, []);

  // Hide in zen mode
  useEffect(() => {
    if (zenMode) {
      setIsVisible(false);
      clearAllTimers();
    } else if (!isVisible && !isEntering) {
      setIsVisible(true);
    }
  }, [zenMode, isVisible, isEntering, clearAllTimers]);

  const hideMessage = useCallback(() => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }
    setMessage(null);
    currentMessageIdRef.current = '';
    
    // Return to appropriate mood based on activity
    const idleMs = Date.now() - lastActivityRef.current;
    if (idleMs >= INACTIVITY_ANGRY_MS) {
      setMood('angry');
    } else if (idleMs >= INACTIVITY_BORED_MS) {
      setMood('bored');
    } else {
      setMood('idle');
    }
  }, []);

  const showMessage = useCallback((candidate: Message, durationMs: number = MESSAGE_DISPLAY_MS) => {
    const current = messageRef.current;
    
    // Priority check - route changes always win
    if (current && candidate.priority < current.priority) {
      return false;
    }
    
    // If same priority, check if it's a different message
    if (current && candidate.priority === current.priority && current.id === candidate.id) {
      return false;
    }

    // Clear existing timer
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }

    setMessage(candidate);
    currentMessageIdRef.current = candidate.id;
    
    // Play animation on avatar
    if (avatarRef.current && candidate.animation) {
      avatarRef.current.play(candidate.animation);
    }

    messageTimerRef.current = setTimeout(hideMessage, durationMs);
    return true;
  }, [hideMessage]);

  // Entrance sequence
  useEffect(() => {
    if (zenMode) return;

    const hasShownIntro = sessionStorage.getItem(INTRO_KEY);
    
    // Make visible immediately or after short delay
    const visibilityDelay = hasShownIntro ? 500 : 1000;
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
      setIsEntering(true);
      
      // Remove entering class after animation
      setTimeout(() => {
        setIsEntering(false);
        setMood('idle');
      }, liteMode ? 0 : 600);
    }, visibilityDelay);

    // Show intro if first time
    if (!hasShownIntro) {
      introTimerRef.current = setTimeout(() => {
        sessionStorage.setItem(INTRO_KEY, '1');
        const introText = liteMode 
          ? "Hey, I'm Byte. I'll be your guide throughout the portfolio. Lite mode is enabled—disable it in Settings to see my animations!"
          : "Hey, I'm Byte. I'll be your guide throughout the portfolio.";
        showMessage({
          text: introText,
          animation: 'happy',
          priority: MESSAGE_PRIORITY.intro,
          id: 'intro'
        }, liteMode ? 10000 : 8000);
      }, INTRO_DELAY_MS + visibilityDelay);
    }

    return () => {
      clearTimeout(visibilityTimer);
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, [zenMode, liteMode, showMessage]);

  // Route change reactions - immediate replacement
  useEffect(() => {
    if (zenMode) return;

    const currentPath = router.pathname;
    
    // Don't react on initial load
    if (lastRouteRef.current === '' && currentPath === '/') {
      lastRouteRef.current = currentPath;
      return;
    }

    // Don't react to same route
    if (lastRouteRef.current === currentPath) {
      return;
    }

    lastRouteRef.current = currentPath;
    lastActivityRef.current = Date.now();
    boredMessageShownRef.current = false;
    
    // Reset mood to happy on route change
    setMood('happy');

    const routeConfig = routeMessages[currentPath];
    if (routeConfig) {
      showMessage({
        text: routeConfig.message,
        animation: routeConfig.animation,
        priority: MESSAGE_PRIORITY.route,
        id: `route-${currentPath}`
      }, MESSAGE_DISPLAY_MS);
    }
  }, [router.pathname, zenMode, showMessage]);

  // Random facts scheduler
  useEffect(() => {
    if (zenMode) return;

    const scheduleNextFact = () => {
      const multiplier = liteMode ? 2 : 1;
      const delay = Math.random() * (FACT_INTERVAL_MAX_MS - FACT_INTERVAL_MIN_MS) + FACT_INTERVAL_MIN_MS;
      
      factTimerRef.current = setTimeout(() => {
        if (!messageRef.current && !document.hidden) {
          let fact = portfolioFacts[Math.floor(Math.random() * portfolioFacts.length)];
          
          // Avoid repeating the same fact
          if (portfolioFacts.length > 1) {
            while (fact === lastFactRef.current) {
              fact = portfolioFacts[Math.floor(Math.random() * portfolioFacts.length)];
            }
          }
          
          lastFactRef.current = fact;
          showMessage({
            text: fact,
            animation: 'curious',
            priority: MESSAGE_PRIORITY.fact,
            id: `fact-${fact.substring(0, 20)}`
          }, MESSAGE_DISPLAY_MS);
        }
        
        scheduleNextFact();
      }, delay * multiplier);
    };

    scheduleNextFact();

    return () => {
      if (factTimerRef.current) clearTimeout(factTimerRef.current);
    };
  }, [zenMode, liteMode, showMessage]);

  // Inactivity detection with mood progression
  useEffect(() => {
    if (zenMode) return;

    const checkInactivity = () => {
      const idleMs = Date.now() - lastActivityRef.current;
      
      if (idleMs >= INACTIVITY_ANGRY_MS && mood !== 'angry') {
        setMood('angry');
        
        if (!messageRef.current && avatarRef.current) {
          avatarRef.current.play('angry');
        }
      } else if (idleMs >= INACTIVITY_BORED_MS && mood !== 'bored' && mood !== 'angry') {
        setMood('bored');
        
        // Show bored message only once per bored transition
        if (!boredMessageShownRef.current && !messageRef.current) {
          boredMessageShownRef.current = true;
          showMessage({
            text: inactivityMessages.bored,
            animation: 'bored',
            priority: MESSAGE_PRIORITY.inactivity,
            id: 'bored'
          }, MESSAGE_DISPLAY_MS);
        } else if (!messageRef.current && avatarRef.current) {
          avatarRef.current.play('bored');
        }
      }
      
      // Schedule next check
      inactivityCheckRef.current = setTimeout(checkInactivity, 5000);
    };

    checkInactivity();

    return () => {
      if (inactivityCheckRef.current) clearTimeout(inactivityCheckRef.current);
    };
  }, [zenMode, mood, showMessage]);

  // Activity tracking
  useEffect(() => {
    if (zenMode) return;

    const handleActivity = () => {
      const wasInactive = mood === 'bored' || mood === 'angry';
      lastActivityRef.current = Date.now();
      boredMessageShownRef.current = false;
      
      if (wasInactive) {
        setMood('idle');
        
        // Play happy animation briefly
        if (avatarRef.current && !messageRef.current) {
          avatarRef.current.play('happy');
          setTimeout(() => {
            if (!messageRef.current && avatarRef.current) {
              avatarRef.current.play('idle');
            }
          }, 2000);
        }
      }
    };

    const events = ['click', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [zenMode, mood]);

  // Mouse tracking - visible physical wrapper movement (REQUIRED layer).
  // Transform is applied to avatarContainerRef's element - the same element
  // the rect is measured from - and only that element receives JS transforms,
  // so no other system can overwrite them. The avatarMotionLayer above it adds
  // perspective so the 3D rotations actually render.
  useEffect(() => {
    if (zenMode || liteMode) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Capture the tracking layer once: the same node is measured in the mouse
    // handler and transformed in the rAF loop. A local avoids a stale
    // avatarContainerRef.current read when this cleanup later runs.
    const element = avatarContainerRef.current;
    if (!element) return;

    const EASE_FACTOR = 0.14; // per-frame ease toward the cursor target
    const STEADY_MS = 1800; // Return to neutral after 1.8s
    const MAX_TRANSLATE_X = 26; // pixels - body steps toward the cursor
    const MAX_TRANSLATE_Y = 18; // pixels
    const MAX_ROTATE_X = 8; // degrees - body leans toward the cursor
    const MAX_ROTATE_Y = 10; // degrees

    let lastMouseUpdate = Date.now();
    const THROTTLE_MS = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate < THROTTLE_MS) return;
      lastMouseUpdate = now;

      const rect = element.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;

      // Normalize based on distance
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDist));
      const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDist));

      mouseStateRef.current.targetX = normalizedX;
      mouseStateRef.current.targetY = normalizedY;
      mouseStateRef.current.lastMoveAt = now;
    };

    // Animation loop - apply visible transform to the tracking layer
    const animateTracking = () => {
      const now = Date.now();
      const state = mouseStateRef.current;
      const timeSinceMove = now - state.lastMoveAt;

      // Fade back to neutral if cursor hasn't moved
      if (timeSinceMove > STEADY_MS) {
        state.targetX = 0;
        state.targetY = 0;
      }

      // Smooth interpolation
      state.currentX += (state.targetX - state.currentX) * EASE_FACTOR;
      state.currentY += (state.targetY - state.currentY) * EASE_FACTOR;

      // Calculate transforms. Positive rotateY turns the face toward screen
      // right; positive rotateX nods the face down, so a cursor below the
      // avatar (positive currentY) leans it down toward the cursor.
      const translateX = state.currentX * MAX_TRANSLATE_X;
      const translateY = state.currentY * MAX_TRANSLATE_Y;
      const rotateX = state.currentY * MAX_ROTATE_X;
      const rotateY = state.currentX * MAX_ROTATE_Y;

      // Apply transform to the layer measured in handleMouseMove
      element.style.transform = `
        translate3d(${translateX}px, ${translateY}px, 0)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;

      mouseAnimFrameRef.current = requestAnimationFrame(animateTracking);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    mouseAnimFrameRef.current = requestAnimationFrame(animateTracking);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseAnimFrameRef.current) {
        cancelAnimationFrame(mouseAnimFrameRef.current);
        mouseAnimFrameRef.current = null;
      }
      // Reset transform
      element.style.transform = '';
    };
  }, [zenMode, liteMode]);

  // Optional eye-gaze tracking (ENHANCEMENT layer).
  // Mutates byteAvatarDefinition.expressions['gaze-live'] every frame, which
  // bible-strong/runtime.js's sampleAvatarFrame re-samples live. Durable live
  // repaint is achieved by holding the runtime on a 'gaze-follow' loop over
  // the single 'gaze-live' step (blink disabled, so the frame loop never idles).
  // Independent from the wrapper movement above: a gaze failure never breaks it.
  useEffect(() => {
    if (zenMode || liteMode) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const neutral = byteAvatarDefinition.expressions['neutral'] as unknown as {
      head: { x: number; y: number; z: number }
      eyes: {
        spacing: number
        left: { width: number; height: number; x: number; y: number; angle: number }
        right: { width: number; height: number; x: number; y: number; angle: number }
      }
    }
    const slot = byteAvatarDefinition.expressions['gaze-live'] as unknown as {
      head: { x: number; y: number; z: number }
      eyes: {
        spacing: number
        left: { width: number; height: number; x: number; y: number; angle: number }
        right: { width: number; height: number; x: number; y: number; angle: number }
      }
    }

    // Copy of neutral captured at mount; writePose always lerps from this.
    const nHead = { ...neutral.head }
    const nLeft = { ...neutral.eyes.left }
    const nRight = { ...neutral.eyes.right }
    const nSpacing = neutral.eyes.spacing

    // Four synthesized gaze directions derived parametrically from the neutral
    // head range (covers all screen quadrants with no dependency on editorial
    // glance expressions - and validates cleanly for any data update).
    // head.x/head.y rotate Byte's WHOLE body (poseFromExpression builds the
    // orientation quaternion applied to every rendered point), so YAW/PITCH are
    // the facing amplitudes: the body turns so its face points at the cursor,
    // and the eyes follow inside the same rotation. Values sit at the top of
    // Freddy's editorial range (~20-35 deg) so the turn reads as facing.
    const GAZE_YAW = 24
    const GAZE_PITCH = 18
    const GAZE_ROLL = 16

    type Vec = [number, number]
    type Guide = {
      dir: Vec
      head: { x: number; y: number; z: number }
      left: { width: number; height: number; x: number; y: number; angle: number }
      right: { width: number; height: number; x: number; y: number; angle: number }
      spacing: number
    }
    const guides: Record<string, Guide> = {
      left: {
        dir: [-1, 0],
        head: { x: 0, y: -GAZE_YAW, z: 0 },
        left: { ...nLeft, x: nLeft.x - 1.5, angle: -GAZE_ROLL },
        right: { ...nRight, x: nRight.x - 1.5, angle: GAZE_ROLL },
        spacing: nSpacing,
      },
      right: {
        dir: [1, 0],
        head: { x: 0, y: GAZE_YAW, z: 0 },
        left: { ...nLeft, x: nLeft.x + 1.5, angle: GAZE_ROLL },
        right: { ...nRight, x: nRight.x + 1.5, angle: -GAZE_ROLL },
        spacing: nSpacing,
      },
      up: {
        dir: [0, -1],
        head: { x: -GAZE_PITCH, y: 0, z: 0 },
        left: { ...nLeft, y: nLeft.y - 1.6 },
        right: { ...nRight, y: nRight.y - 1.6 },
        spacing: nSpacing,
      },
      down: {
        dir: [0, 1],
        head: { x: GAZE_PITCH, y: 0, z: 0 },
        left: { ...nLeft, y: nLeft.y + 1.8 },
        right: { ...nRight, y: nRight.y + 1.8 },
        spacing: nSpacing,
      },
    }

    const suppressed = () => Boolean(messageRef.current) || moodRef.current !== 'idle'

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const writePose = (
      weight: number,
      blend: { head: { x: number; y: number; z: number }; left: { width: number; height: number; x: number; y: number; angle: number }; right: { width: number; height: number; x: number; y: number; angle: number }; spacing: number } | null,
      blinking: boolean
    ) => {
      const b = blend ?? { head: nHead, left: nLeft, right: nRight, spacing: nSpacing }
      slot.head.x = lerp(nHead.x, b.head.x, weight)
      slot.head.y = lerp(nHead.y, b.head.y, weight)
      slot.head.z = lerp(nHead.z, b.head.z, weight)
      slot.eyes.spacing = lerp(nSpacing, b.spacing, weight)
      slot.eyes.left.width = lerp(nLeft.width, b.left.width, weight)
      slot.eyes.right.width = lerp(nRight.width, b.right.width, weight)
      const hL = lerp(nLeft.height, b.left.height, weight)
      const hR = lerp(nRight.height, b.right.height, weight)
      // Autonomous micro-blink written directly into eye heights (gaze-follow
      // disables blink playback, so this is the only blink during tracking).
      if (blinking) {
        slot.eyes.left.height = 14
        slot.eyes.right.height = 14
      } else {
        slot.eyes.left.height = hL
        slot.eyes.right.height = hR
      }
      slot.eyes.left.x = lerp(nLeft.x, b.left.x, weight)
      slot.eyes.right.x = lerp(nRight.x, b.right.x, weight)
      slot.eyes.left.y = lerp(nLeft.y, b.left.y, weight)
      slot.eyes.right.y = lerp(nRight.y, b.right.y, weight)
      slot.eyes.left.angle = lerp(nLeft.angle, b.left.angle, weight)
      slot.eyes.right.angle = lerp(nRight.angle, b.right.angle, weight)
    }

    const state = gazeStateRef.current

    const scheduleBlink = (now: number) => {
      const gap = 2600 + Math.random() * 3600
      state.nextBlinkAt = now + gap
    }
    scheduleBlink(Date.now())

    const stop = () => {
      if (state.on) state.on = false
      if (gazeFrameRef.current !== null) {
        cancelAnimationFrame(gazeFrameRef.current)
        gazeFrameRef.current = null
      }
      state.armed = false
    }

    const start = () => {
      if (state.on) return
      state.on = true
      const tick = (now: number) => {
        gazeFrameRef.current = requestAnimationFrame(tick)
        const active = !suppressed() && !(now - state.lastMoveAt > 1800 && Math.hypot(state.u, state.v) < 0.02)
        const wantU = active ? Math.max(-1, Math.min(1, state.targetX / (window.innerWidth / 2 || 1))) : 0
        const wantV = active ? Math.max(-1, Math.min(1, state.targetY / (window.innerHeight / 2 || 1))) : 0
        // Target blend weight grows with radial distance so the gaze reaches
        // corner blends near screen edges and merges smoothly between axes.
        const wantT = active ? Math.min(1, Math.hypot(wantU, wantV) * 0.95 + 0.15) : 0
        state.u += (wantU - state.u) * 0.16
        state.v += (wantV - state.v) * 0.16
        state.t += (wantT - state.t) * 0.16

        const nowAbs = now
        let blinking = false
        if (nowAbs >= state.nextBlinkAt && !state.blinkUntil) {
          state.blinkUntil = nowAbs + 170
          blinking = true
        } else if (state.blinkUntil) {
          if (nowAbs >= state.blinkUntil) {
            state.blinkUntil = 0
            scheduleBlink(nowAbs)
          } else {
            // Eye is held closed for the blink window; scheduleBlink seeds the
            // next one when the window ends.
            const p = (nowAbs - (state.blinkUntil - 170)) / 170
            blinking = p > 0.35 && p < 0.65
          }
        }

        // Angular kernel over the four parametric guides (same recipe the
        // reference Sunee companion uses, tuned for these guide dirs).
        type Blend = Guide
        const dirs: Array<{ key: string; guide: Blend }> = [
          { key: 'left', guide: guides.left },
          { key: 'right', guide: guides.right },
          { key: 'up', guide: guides.up },
          { key: 'down', guide: guides.down },
        ]
        let total = 0
        const weights: Record<string, number> = {}
        for (const { key, guide } of dirs) {
          const w = Math.max(0, state.u * guide.dir[0] + state.v * guide.dir[1])
          weights[key] = w
          total += w
        }
        let blend: Blend | null = null
        if (total > 0.0001 && state.t > 0.01) {
          const hx = dirs.reduce((s, { key, guide }) => s + (weights[key] / total) * guide.head.x, 0)
          const hy = dirs.reduce((s, { key, guide }) => s + (weights[key] / total) * guide.head.y, 0)
          const hz = dirs.reduce((s, { key, guide }) => s + (weights[key] / total) * guide.head.z, 0)
          const wl = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].left.width, 0)
          const wr = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].right.width, 0)
          const hl = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].left.height, 0)
          const hr = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].right.height, 0)
          const xl = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].left.x, 0)
          const xr = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].right.x, 0)
          const yl = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].left.y, 0)
          const yr = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].right.y, 0)
          const al = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].left.angle, 0)
          const ar = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].right.angle, 0)
          const sp = dirs.reduce((s, { key }) => s + (weights[key] / total) * guides[key as keyof typeof guides].spacing, 0)
          blend = {
            dir: [0, 0],
            head: { x: hx, y: hy, z: hz },
            left: { width: wl, height: hl, x: xl, y: yl, angle: al },
            right: { width: wr, height: hr, x: xr, y: yr, angle: ar },
            spacing: sp,
          }
        }

        writePose(state.t, blend ? { head: blend.head, left: blend.left, right: blend.right, spacing: blend.spacing } : null, blinking)

        // Converged back to neutral -> disarm cleanly. Only replay idle if
        // the companion has no visible priority of its own.
        const converged = state.t < 0.015 && Math.abs(state.u) < 0.02 && Math.abs(state.v) < 0.02
        if (converged && !active) {
          writePose(0, null, blinking)
          if (!messageRef.current && moodRef.current === 'idle') {
            stop()
            try { avatarRef.current?.play?.('idle') } catch {}
          } else {
            stop()
          }
        }
      }
      gazeFrameRef.current = requestAnimationFrame(tick)
    }

    const handleMove = (e: MouseEvent) => {
      if (suppressed()) return
      const now = Date.now()
      // Throttle high-frequency mousemoves matching the wrapper's 50 ms rhythm.
      if (now - state.lastMoveAt < 50) return
      const el = avatarContainerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      state.targetX = e.clientX - cx
      state.targetY = e.clientY - cy
      state.lastMoveAt = now
      if (!state.armed) {
        state.armed = true
        try { avatarRef.current?.play?.('gaze-follow') } catch {}
        start()
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      stop()
      // Leave the gaze slot neutral so the next idle playback paints cleanly.
      try { writePose(0, null, false) } catch {}
    }
  }, [zenMode, liteMode])

  // Click interaction
  const handleAvatarClick = useCallback(() => {
    if (zenMode) return;
    
    lastActivityRef.current = Date.now();
    boredMessageShownRef.current = false;
    
    const msg = clickMessages[Math.floor(Math.random() * clickMessages.length)];
    showMessage({
      text: msg,
      animation: 'excited',
      priority: MESSAGE_PRIORITY.click,
      id: `click-${Date.now()}`
    }, MESSAGE_DISPLAY_MS);
  }, [zenMode, showMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  if (zenMode || !isVisible) {
    return null;
  }

  return (
    <div 
      className={`${styles.container} ${isEntering ? styles.entering : ''}`}
      role="complementary"
      aria-label="Portfolio companion"
    >
      {message && (
        <div className={styles.bubble} role="status" aria-live="polite">
          <p className={styles.bubbleText}>{message.text}</p>
          <button
            type="button"
            className={styles.closeButton}
            onClick={hideMessage}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
      
      <button
        type="button"
        className={styles.avatarButton}
        onClick={handleAvatarClick}
        aria-label="Click Byte for a message"
        title="Click for a random message"
      >
        <div className={styles.avatarMotionLayer}>
          <div ref={avatarContainerRef} className={styles.mouseTrackingLayer}>
            <Avatar
              ref={avatarRef}
              definition={byteAvatarDefinition}
              animation={undefined}
              expression={undefined}
              defaultAnimation="idle"
              defaultExpression={undefined}
              autoplay
              size={96}
              className={undefined}
              style={undefined}
              ariaLabel="Byte, the portfolio companion"
              onError={undefined}
              onAnimationEnd={undefined}
              onExpressionChange={undefined}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
