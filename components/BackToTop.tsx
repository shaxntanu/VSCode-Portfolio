import { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/BackToTop.module.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  const handleScroll = useCallback(() => {
    const container = getScrollContainer();
    const scrollTop = getScrollTop(container);

    // Show button after scrolling down 100px (reduced threshold for internal scrolling)
    if (scrollTop > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [getScrollContainer, getScrollTop]);

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

    return () => {
      if (container === window) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        (container as HTMLElement).removeEventListener('scroll', handleScroll);
      }
    };
  }, [getScrollContainer, handleScroll]);

  if (!isVisible) return null;

  return (
    <button
      className={styles.button}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg className={styles.svgIcon} viewBox="0 0 384 512">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-160-160z" />
      </svg>
    </button>
  );
};

export default BackToTop;