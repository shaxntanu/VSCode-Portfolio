import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/BackToTop.module.css';

const BackToTop = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the actual scroll container - #main-editor
  const getScrollContainer = useCallback((): HTMLElement | null => {
    const container = document.getElementById('main-editor');
    console.log('[BackToTop] getScrollContainer:', !!container, container?.id);
    return container;
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const container = getScrollContainer();
      if (!container) {
        console.log('[BackToTop] handleScroll: No container');
        return;
      }

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      const threshold = 150;
      const shouldShow = scrollTop >= threshold;

      console.log('[BackToTop] handleScroll values:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        maxScrollTop,
        threshold,
        shouldShow
      });

      console.log('[BackToTop] element:', container);

      // Show button after scrolling down 150px
      if (scrollTop >= 150) {
        console.log('[BackToTop] Setting isVisible = true');
        setIsVisible(true);
      } else {
        console.log('[BackToTop] Setting isVisible = false');
        setIsVisible(false);
      }
    });
  }, [getScrollContainer]);

  const scrollToTop = useCallback(() => {
    const container = getScrollContainer();
    console.log('[BackToTop] scrollToTop clicked, container:', !!container, container?.id);
    if (container) {
      console.log('[BackToTop] Before scroll, scrollTop:', container.scrollTop);
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      console.log('[BackToTop] Scroll initiated');
    }
  }, [getScrollContainer]);

  useEffect(() => {
    const container = getScrollContainer();
    if (!container) {
      console.log('[BackToTop] useEffect: No container found');
      return;
    }

    console.log('[BackToTop] useEffect: Container found, attaching listener');
    scrollContainerRef.current = container;

    // Log initial state
    console.log('[BackToTop] Initial state:', {
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight
    });

    // Add scroll listener to main-editor
    container.addEventListener('scroll', handleScroll, { passive: true });
    console.log('[BackToTop] Scroll listener attached to', container.id);

    // Initial check
    handleScroll();

    // Reset on route change
    const handleRouteChange = () => {
      console.log('[BackToTop] Route change, resetting visibility');
      setIsVisible(false);
      // Re-attach to new container after route change
      setTimeout(() => {
        const newContainer = getScrollContainer();
        if (newContainer && newContainer !== scrollContainerRef.current) {
          console.log('[BackToTop] Re-attaching to new container');
          if (scrollContainerRef.current) {
            scrollContainerRef.current.removeEventListener('scroll', handleScroll);
          }
          scrollContainerRef.current = newContainer;
          newContainer.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll();
        }
      }, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      console.log('[BackToTop] Cleanup: removing listener');
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      router.events.off('routeChangeComplete', handleRouteChange);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [getScrollContainer, handleScroll, router]);

  console.log('[BackToTop] Render: isVisible =', isVisible, 'className will be:', `${styles.button} ${isVisible ? styles.visible : ''}`);

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
    </button>
  );
};

export default BackToTop;