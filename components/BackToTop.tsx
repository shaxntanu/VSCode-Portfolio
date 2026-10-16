import { useState, useEffect, useCallback, useRef } from 'react';
import { usePageScrollContainer } from '@/hooks/usePageScrollContainer';
import styles from '@/styles/BackToTop.module.css';

const BackToTop = () => {
  const { scrollContainer, layoutVersion } = usePageScrollContainer();
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!scrollContainer) {
        setIsVisible(false);
        return;
      }

      const scrollTop = scrollContainer.scrollTop;
      setIsVisible(scrollTop >= 150);
    });
  }, [scrollContainer]);

  const scrollToTop = useCallback(() => {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) {
      setIsVisible(false);
      return;
    }

    // Add scroll listener to the discovered container
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollContainer, handleScroll, layoutVersion]);

  return (
    <button
      className={`${styles.button} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg className={styles.svgIcon} viewBox="0 0 384 512">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-160-160z" />
      </svg>
      <span className={styles.label}>Back to Top</span>
    </button>
  );
};

export default BackToTop;
