import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUIState } from '@/contexts/UIStateContext';
import { routeMessages, clickMessages, portfolioFacts, inactivityMessages, AnimationKey } from '@/data/companionMessages';
import Avatar, { AvatarRef } from '@/components/Avatar/Avatar';
import styles from '@/styles/PortfolioCompanion.module.css';

// Import the avatar definition
import byteDefinition from '@/public/avatar/byte.avatar.json';

type ByteMood = 'neutral' | 'idle' | 'happy' | 'excited' | 'curious' | 'bored' | 'suspicious' | 'angry';

interface Message {
  text: string;
  animation: AnimationKey;
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
const MESSAGE_DISPLAY_MS = 6500;
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
  const [mood, setMood] = useState<ByteMood>('neutral');
  const [liteMode, setLiteMode] = useState(true);

  // Refs for timer management
  const avatarRef = useRef<AvatarRef>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);
  const factTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityCheckRef = useRef<NodeJS.Timeout | null>(null);
  const gazeFrameRef = useRef<number | null>(null);
  const lastActivityRef = useRef(Date.now());
  const lastFactRef = useRef<string | null>(null);
  const lastRouteRef = useRef<string>('');
  const messageRef = useRef<Message | null>(null);
  const currentMessageIdRef = useRef<string>('');
  const boredMessageShownRef = useRef(false);

  messageRef.current = message;

  // Clear all timers - defined first to avoid hoisting issues
  const clearAllTimers = useCallback(() => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    if (factTimerRef.current) clearTimeout(factTimerRef.current);
    if (inactivityCheckRef.current) clearTimeout(inactivityCheckRef.current);
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
        showMessage({
          text: "Hey, I'm Byte. I'll be your guide throughout the portfolio.",
          animation: 'happy',
          priority: MESSAGE_PRIORITY.intro,
          id: 'intro'
        }, 8000);
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

  // Cursor gaze tracking - eyes follow mouse by mutating definition
  useEffect(() => {
    if (zenMode) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const GAZE_EASE_FACTOR = 0.16;
    const GAZE_STEADY_MS = 1400; // Look away if cursor still for 1.4s
    const MAX_EYE_OFFSET_X = 8; // Max pixel offset for eyes horizontally
    const MAX_EYE_OFFSET_Y = 6; // Max pixel offset for eyes vertically

    // Store original neutral eye positions
    const neutral = (byteDefinition as any).expressions.neutral;
    const originalLeftX = neutral.eyes.left.x;
    const originalLeftY = neutral.eyes.left.y;
    const originalRightX = neutral.eyes.right.x;
    const originalRightY = neutral.eyes.right.y;

    const state = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      lastMoveAt: Date.now(),
      isActive: false
    };

    let lastMouseUpdate = Date.now();
    const THROTTLE_MS = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate < THROTTLE_MS) return;
      lastMouseUpdate = now;

      if (!avatarContainerRef.current) return;
      
      const rect = avatarContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Normalize based on distance - whole viewport is gaze field
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      state.targetX = Math.max(-1, Math.min(1, deltaX / maxDist));
      state.targetY = Math.max(-1, Math.min(1, deltaY / maxDist));
      state.lastMoveAt = now;
      state.isActive = true;
    };

    // Gaze animation loop - directly mutate the neutral expression
    const animateGaze = () => {
      const now = Date.now();
      const timeSinceMove = now - state.lastMoveAt;
      
      // If cursor hasn't moved, fade back to neutral
      if (timeSinceMove > GAZE_STEADY_MS) {
        state.targetX = 0;
        state.targetY = 0;
      }
      
      // Ease toward target
      state.currentX += (state.targetX - state.currentX) * GAZE_EASE_FACTOR;
      state.currentY += (state.targetY - state.currentY) * GAZE_EASE_FACTOR;
      
      // Apply to neutral expression (which all animations use as base)
      const offsetX = state.currentX * MAX_EYE_OFFSET_X;
      const offsetY = state.currentY * MAX_EYE_OFFSET_Y;
      
      neutral.eyes.left.x = originalLeftX + offsetX;
      neutral.eyes.left.y = originalLeftY + offsetY;
      neutral.eyes.right.x = originalRightX + offsetX;
      neutral.eyes.right.y = originalRightY + offsetY;
      
      gazeFrameRef.current = requestAnimationFrame(animateGaze);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    gazeFrameRef.current = requestAnimationFrame(animateGaze);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (gazeFrameRef.current) {
        cancelAnimationFrame(gazeFrameRef.current);
      }
      // Restore original eye positions
      neutral.eyes.left.x = originalLeftX;
      neutral.eyes.left.y = originalLeftY;
      neutral.eyes.right.x = originalRightX;
      neutral.eyes.right.y = originalRightY;
    };
  }, [zenMode]);

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
        <div className={styles.avatarWrapper} ref={avatarContainerRef}>
          <Avatar
            ref={avatarRef}
            definition={byteDefinition as any}
            defaultAnimation="idle"
            autoplay
            size={96}
            ariaLabel="Byte, the portfolio companion"
          />
        </div>
      </button>
    </div>
  );
}
