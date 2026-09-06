import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUIState } from '@/contexts/UIStateContext';
import { routeMessages, clickMessages, portfolioFacts, inactivityMessages } from '@/data/companionMessages';
import Avatar from '@/components/Avatar/bible-strong/Avatar.jsx';
import { avatarData } from '@/components/Avatar/freddy.avatar';
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
  const [mood, setMood] = useState<ByteMood>('idle');
  const [liteMode, setLiteMode] = useState(true);

  // Refs for timer management
  const avatarRef = useRef<any>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const mouseTrackingRef = useRef<HTMLDivElement>(null);
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

  messageRef.current = message;

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

  // Mouse tracking - visible physical movement
  useEffect(() => {
    if (zenMode || liteMode) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const EASE_FACTOR = 0.12;
    const STEADY_MS = 1800; // Return to neutral after 1.8s
    const MAX_TRANSLATE_X = 6; // pixels
    const MAX_TRANSLATE_Y = 4; // pixels  
    const MAX_ROTATE_X = 3; // degrees
    const MAX_ROTATE_Y = 5; // degrees

    let lastMouseUpdate = Date.now();
    const THROTTLE_MS = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate < THROTTLE_MS) return;
      lastMouseUpdate = now;

      if (!avatarContainerRef.current) return;
      
      const rect = avatarContainerRef.current.getBoundingClientRect();
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

    // Animation loop - apply visible transform
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
      
      // Calculate transforms
      const translateX = state.currentX * MAX_TRANSLATE_X;
      const translateY = state.currentY * MAX_TRANSLATE_Y;
      const rotateX = -state.currentY * MAX_ROTATE_X; // Inverted for natural feel
      const rotateY = state.currentX * MAX_ROTATE_Y;
      
      // Apply transform to mouse tracking layer
      if (mouseTrackingRef.current) {
        mouseTrackingRef.current.style.transform = `
          translate3d(${translateX}px, ${translateY}px, 0)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      }
      
      mouseAnimFrameRef.current = requestAnimationFrame(animateTracking);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    mouseAnimFrameRef.current = requestAnimationFrame(animateTracking);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseAnimFrameRef.current) {
        cancelAnimationFrame(mouseAnimFrameRef.current);
      }
      // Reset transform
      if (mouseTrackingRef.current) {
        mouseTrackingRef.current.style.transform = '';
      }
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
        <div 
          ref={mouseTrackingRef}
          className={styles.mouseTrackingLayer}
        >
          <div className={styles.avatarWrapper} ref={avatarContainerRef}>
            <Avatar
              ref={avatarRef}
              definition={avatarData as any}
              defaultAnimation="idle"
              autoplay
              size={96}
              ariaLabel="Byte, the portfolio companion"
            />
          </div>
        </div>
      </button>
    </div>
  );
}
