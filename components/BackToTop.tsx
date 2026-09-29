import { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/BackToTop.module.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // Get the actual scroll container
  const getScrollContainer = useCallback(() => {
    const mainEditor = document.getElementById('main-editor');
    return mainEditor || window;
  }, []);

  // Check overlap with page content
  const checkOverlap = useCallback(() => {
    const button = document.querySelector(`.${styles.button}`);
    if (!button) return false;

    const buttonRect = button.getBoundingClientRect();
    const mainEditor = document.getElementById('main-editor');
    
    if (!mainEditor) return false;

    // Get all major content elements
    const contentElements = mainEditor.querySelectorAll('h1, h2, h3, p, div, section, article');
    
    for (const element of contentElements) {
      const rect = element.getBoundingClientRect();
      
      // Check if button overlaps with content
      const isOverlapping = !(
        buttonRect.right < rect.left ||
        buttonRect.left > rect.right ||
        buttonRect.bottom < rect.top ||
        buttonRect.top > rect.bottom
      );

      if (isOverlapping) {
        return true;
      }
    }

    return false;
  }, []);

  const handleScroll = useCallback(() => {
    const container = getScrollContainer();
    const scrollTop = container === window 
      ? window.scrollY 
      : container.scrollTop;

    // Show button after scrolling down 200px
    if (scrollTop > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Check overlap using requestAnimationFrame for performance
    requestAnimationFrame(() => {
      const overlapping = checkOverlap();
      setOpacity(overlapping ? 0.5 : 1);
    });
  }, [getScrollContainer, checkOverlap]);

  const scrollToTop = useCallback(() => {
    const container = getScrollContainer();
    
    if (container === window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [getScrollContainer]);

  useEffect(() => {
    const container = getScrollContainer();
    
    // Add scroll listener to the actual scroll container
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    // Also check overlap on window resize
    const handleResize = () => {
      requestAnimationFrame(() => {
        const overlapping = checkOverlap();
        setIsOverlapping(overlapping);
        setOpacity(overlapping ? 0.5 : 1);
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [getScrollContainer, handleScroll, checkOverlap]);

  if (!isVisible) return null;

  return (
    <button
      className={styles.button}
      onClick={scrollToTop}
      style={{ opacity }}
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