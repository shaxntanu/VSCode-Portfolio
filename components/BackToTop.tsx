import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '@/styles/BackToTop.module.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);

  // Get the actual scroll container - prioritize internal scroll container
  const getScrollContainer = useCallback((): Window | HTMLElement => {
    const mainEditor = document.getElementById('main-editor');
    // Always use main-editor if it exists, since that's the actual scroll container
    return mainEditor || window;
  }, []);

  // Helper to get scroll position safely
  const getScrollTop = useCallback((container: Window | HTMLElement): number => {
    if (container === window) {
      return window.scrollY;
    }
    return (container as HTMLElement).scrollTop;
  }, []);

  // Helper to scroll to top safely
  const scrollToTopHelper = useCallback((container: Window | HTMLElement) => {
    if (container === window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      (container as HTMLElement).scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Check overlap with Byte companion
  const checkOverlap = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    
    // Byte companion is typically at bottom-right with specific dimensions
    const byteContainer = document.querySelector('[role="complementary"]');
    if (!byteContainer) {
      setOpacity(1);
      return;
    }

    const byteRect = byteContainer.getBoundingClientRect();

    // Check if button overlaps with Byte
    const overlaps = !(
      buttonRect.right < byteRect.left ||
      buttonRect.left > byteRect.right ||
      buttonRect.bottom < byteRect.top ||
      buttonRect.top > byteRect.bottom
    );

    setOpacity(overlaps ? 0.5 : 1);
  }, []);

  const handleScroll = useCallback(() => {
    const container = getScrollContainer();
    const scrollTop = getScrollTop(container);

    // Show button after scrolling down 300px
    if (scrollTop >= 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Check overlap
    checkOverlap();
  }, [getScrollContainer, getScrollTop, checkOverlap]);

  const scrollToTop = useCallback(() => {
    const container = getScrollContainer();
    scrollToTopHelper(container);
  }, [getScrollContainer, scrollToTopHelper]);

  useEffect(() => {
    const container = getScrollContainer();
    
    // Add scroll listener to the actual scroll container
    if (container === window) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      (container as HTMLElement).addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Initial check
    handleScroll();

    // Also check overlap on resize
    const handleResize = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        checkOverlap();
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (container === window) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        (container as HTMLElement).removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [getScrollContainer, handleScroll, checkOverlap]);

  if (!isVisible) return null;

  return (
    <button
      ref={buttonRef}
      className={styles.button}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      style={{ opacity }}
    >
      <svg className={styles.svgIcon} viewBox="0 0 384 512">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-160-160z" />
      </svg>
    </button>
  );
};

export default BackToTop;