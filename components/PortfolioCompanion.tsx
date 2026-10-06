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

// Enhanced gaze configuration from Sunee's interaction system
const GAZE_CONFIG = {
  enabled: true,
  throttleMs: 200,           // Throttle mousemove evaluations (rAF loop eases between them)
  easeFactor: 0.16,          // Per-frame easing (0..1, higher = snappier)
  steadyMs: 1400,            // After cursor still this long, look away (idle)
  blink: {
    minMs: 2600,
    maxMs: 6200,
    durationMs: 170
  }
};

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
  
  // Mouse tracking state (wrapper movement - REQUIRED layer)
  const mouseStateRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    lastMoveAt: Date.now()
  });

  // Enhanced eye gaze live-tracking state with blink management
  const gazeStateRef = useRef({
    on: false,
    armed: false,
    lastEval: 0,
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

    // Stop gaze work when message shows (will re-arm on next move)
    const gaze = gazeStateRef.current;
    if (gaze) {
      if (gazeFrameRef.current) {
        cancelAnimationFrame(gazeFrameRef.current);
        gazeFrameRef.current = null;
      }
      gaze.on = false;
      gaze.armed = false;
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
  useEffect(() => {
    if (zenMode || liteMode) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const element = avatarContainerRef.current;
    if (!element) return;

    const EASE_FACTOR = 0.14;
    const STEADY_MS = 1800;
    const MAX_TRANSLATE_X = 26;
    const MAX_TRANSLATE_Y = 18;
    const MAX_ROTATE_X = 8;
    const MAX_ROTATE_Y = 10;

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

      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDist));
      const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDist));

      mouseStateRef.current.targetX = normalizedX;
      mouseStateRef.current.targetY = normalizedY;
      mouseStateRef.current.lastMoveAt = now;
    };

    // Animation loop
    const animateTracking = () => {
      const now = Date.now();
      const state = mouseStateRef.current;
      const timeSinceMove = now - state.lastMoveAt;

      if (timeSinceMove > STEADY_MS) {
        state.targetX = 0;
        state.targetY = 0;
      }

      state.currentX += (state.targetX - state.currentX) * EASE_FACTOR;
      state.currentY += (state.targetY - state.currentY) * EASE_FACTOR;

      const translateX = state.currentX * MAX_TRANSLATE_X;
      const translateY = state.currentY * MAX_TRANSLATE_Y;
      const rotateX = state.currentY * MAX_ROTATE_X;
      const rotateY = state.currentX * MAX_ROTATE_Y;

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
      element.style.transform = '';
    };
  }, [zenMode, liteMode]);

  // Enhanced eye-gaze tracking with improved throttling and blinking from Sunee
  useEffect(() => {
    if (zenMode || liteMode) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!GAZE_CONFIG.enabled) return;

    const neutral = byteAvatarDefinition.expressions['neutral'] as unknown as {
      head: { x: number; y: number; z: number }
      eyes: {
        spacing: number
        left: { width: number; height: number; x: number; y: number; angle: number }
        right: { width: number; height: number; x: number; y: number; angle: number }
      }
    };
    const slot = byteAvatarDefinition.expressions['gaze-live'] as unknown as {
      head: { x: number; y: number; z: number }
      eyes: {
        spacing: number
        left: { width: number; height: number; x: number; y: number; angle: number }
        right: { width: number; height: number; x: number; y: number; angle: number }
      }
    };

    const nLeft = { ...neutral.eyes.left };
    const nRight = { ...neutral.eyes.right };
    const nSpacing = neutral.eyes.spacing;

    const GAZE_YAW = 24;
    const GAZE_PITCH = 18;
    const GAZE_ROLL = 16;

    type Vec = [number, number];
    type Guide = {
      dir: Vec
      head: { x: number; y: number; z: number }
      left: { width: number; height: number; x: number; y: number; angle: number }
      right: { width: number; height: number; x: number; y: number; angle: number }
      spacing: number
    };

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
    };

    const blink = GAZE_CONFIG.blink;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    const randBetween = (min: number, max: number) =>
      Math.floor(min + Math.random() * (max - min));

    const suppressed = () =>
      Boolean(messageRef.current) || moodRef.current !== 'idle';

    const state = gazeStateRef.current;

    const writePose = (
      t: number,
      mixes: Record<string, number> | null,
      blinking: boolean
    ) => {
      const blend = { hx: 0, hy: 0, hz: 0, wL: 0, hL: 0, xL: 0, yL: 0, aL: 0, wR: 0, hR: 0, xR: 0, yR: 0, aR: 0, sp: 0 };
      let total = 0;

      if (mixes) {
        for (const guideKey of Object.keys(guides)) {
          const weight = mixes[guideKey];
          if (weight <= 0) continue;
          total += weight;
          const guide = guides[guideKey];
          const l = guide.left;
          const r = guide.right;
          blend.hx += weight * guide.head.x;
          blend.hy += weight * guide.head.y;
          blend.hz += weight * guide.head.z;
          blend.wL += weight * l.width;
          blend.hL += weight * l.height;
          blend.xL += weight * l.x;
          blend.yL += weight * l.y;
          blend.aL += weight * l.angle;
          blend.wR += weight * r.width;
          blend.hR += weight * r.height;
          blend.xR += weight * r.x;
          blend.yR += weight * r.y;
          blend.aR += weight * r.angle;
          blend.sp += weight * guide.spacing;
        }
        if (total > 0) {
          const inv = 1 / total;
          for (const key of Object.keys(blend)) {
            blend[key as keyof typeof blend] *= inv;
          }
        }
      }

      const hasBlend = total > 0;
      slot.head.x = lerp(neutral.head.x, blend.hx, t);
      slot.head.y = lerp(neutral.head.y, blend.hy, t);
      slot.head.z = lerp(neutral.head.z, blend.hz, t);
      slot.eyes.left.width = lerp(nLeft.width, blend.wL, t * Number(hasBlend));
      slot.eyes.left.height = lerp(nLeft.height, blend.hL, t * Number(hasBlend));
      slot.eyes.left.x = lerp(nLeft.x, blend.xL, t * Number(hasBlend));
      slot.eyes.left.y = lerp(nLeft.y, blend.yL, t * Number(hasBlend));
      slot.eyes.left.angle = lerp(nLeft.angle, blend.aL, t * Number(hasBlend));
      slot.eyes.right.width = lerp(nRight.width, blend.wR, t * Number(hasBlend));
      slot.eyes.right.height = lerp(nRight.height, blend.hR, t * Number(hasBlend));
      slot.eyes.right.x = lerp(nRight.x, blend.xR, t * Number(hasBlend));
      slot.eyes.right.y = lerp(nRight.y, blend.yR, t * Number(hasBlend));
      slot.eyes.right.angle = lerp(nRight.angle, blend.aR, t * Number(hasBlend));
      slot.eyes.spacing = lerp(nSpacing, blend.sp, t * Number(hasBlend));

      // Autonomous micro-blink (the gaze hold disables the animation blink)
      if (blinking) {
        const progress =
          (performance.now() - (state.blinkUntil - blink.durationMs)) /
          blink.durationMs;
        const dip = Math.sin(Math.PI * clamp(progress, 0, 1));
        slot.eyes.left.height = lerp(slot.eyes.left.height, 14, dip);
        slot.eyes.right.height = lerp(slot.eyes.right.height, 14, dip);
      }
    };

    const start = () => {
      if (state.on) return;
      state.on = true;

      const tick = () => {
        gazeFrameRef.current = requestAnimationFrame(tick);
        const now = performance.now();
        const suppressed_ = suppressed();
        const active =
          !suppressed_ && state.armed && now - state.lastMoveAt <= GAZE_CONFIG.steadyMs;

        const wantU = active
          ? clamp(state.targetX / (window.innerWidth / 2), -1, 1)
          : 0;
        const wantV = active
          ? clamp(state.targetY / (window.innerHeight / 2), -1, 1)
          : 0;
        const wantT = active ? clamp(Math.hypot(wantU, wantV), 0, 1) : 0;

        state.u += (wantU - state.u) * GAZE_CONFIG.easeFactor;
        state.v += (wantV - state.v) * GAZE_CONFIG.easeFactor;
        state.t += (wantT - state.t) * GAZE_CONFIG.easeFactor;

        // Autonomous micro-blink
        if (now >= state.nextBlinkAt) {
          state.nextBlinkAt =
            now + randBetween(blink.minMs, blink.maxMs);
          state.blinkUntil = now + blink.durationMs;
        }
        const blinking = now < state.blinkUntil;

        // Converged on neutral: may resume idle loop
        if (
          state.t < 0.015 &&
          Math.abs(state.u) < 0.02 &&
          Math.abs(state.v) < 0.02
        ) {
          writePose(0, null, blinking);
          if (
            !active &&
            !suppressed_ &&
            !messageRef.current &&
            moodRef.current === 'idle'
          ) {
            state.armed = false;
            state.on = false;
            try {
              avatarRef.current?.play?.('idle');
            } catch {}
          }
          return;
        }

        // Angular kernels (blend directions)
        const weights: Record<string, number> = {};
        let weightTotal = 0;
        for (const guideKey of Object.keys(guides)) {
          const guide = guides[guideKey];
          const w = clamp(state.u * guide.dir[0] + state.v * guide.dir[1], 0, 1);
          weights[guideKey] = w;
          weightTotal += w;
        }
        const mixes = weightTotal > 1e-6 ? weights : null;
        writePose(state.t, mixes, blinking);
      };

      gazeFrameRef.current = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (state.on) {
        state.on = false;
        if (gazeFrameRef.current) {
          cancelAnimationFrame(gazeFrameRef.current);
          gazeFrameRef.current = null;
        }
      }
    };

    const onMove = (event: MouseEvent) => {
      const now = performance.now();
      if (now - state.lastEval < GAZE_CONFIG.throttleMs) return;
      state.lastEval = now;
      if (suppressed()) return;

      const host = avatarContainerRef.current;
      if (!host) return;

      const rect = host.getBoundingClientRect();
      state.targetX = event.clientX - (rect.left + rect.width / 2);
      state.targetY = event.clientY - (rect.top + rect.height / 2);
      state.lastMoveAt = now;

      if (!state.armed) {
        state.armed = true;
        try {
          avatarRef.current?.play?.('gaze-follow');
        } catch {}
        start();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      stop();
      // Leave gaze slot neutral for clean idle playback
      try {
        writePose(0, null, false);
      } catch {}
    };
  }, [zenMode, liteMode]);

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
