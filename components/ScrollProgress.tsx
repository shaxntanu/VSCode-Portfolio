import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ScrollProgress.module.css';

const ScrollProgress = () => {
  const router = useRouter();
  const progressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Get the actual scroll container
  const getScrollContainer = useCallback(() => {
    const mainEditor = document.getElementById('main-editor');
    return mainEditor || window;
  }, []);

  const updateProgress = useCallback(() => {
    const container = getScrollContainer();
    const isWindow = container === window;
    
    const scrollTop = isWindow 
      ? window.scrollY 
      : container.scrollTop;
    const scrollHeight = isWindow 
      ? document.documentElement.scrollHeight 
      : container.scrollHeight;
    const clientHeight = isWindow 
      ? window.innerHeight 
      : container.clientHeight;

    // Calculate progress (0 to 1)
    const progress = scrollHeight > clientHeight 
      ? scrollTop / (scrollHeight - clientHeight)
      : 0;

    // Clamp between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Only update if changed significantly to avoid unnecessary updates
    if (Math.abs(clampedProgress - progressRef.current) > 0.001) {
      progressRef.current = clampedProgress;
      
      // Update CSS variable for efficient rendering
      document.documentElement.style.setProperty('--scroll-progress', `${clampedProgress * 100}%`);
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  }, [getScrollContainer]);

  useEffect(() => {
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(updateProgress);

    // Reset progress on route change
    const handleRouteChange = () => {
      progressRef.current = 0;
      document.documentElement.style.setProperty('--scroll-progress', '0%');
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      router.events.off('routeChangeStart', handleRouteChange);
      // Clean up CSS variable
      document.documentElement.style.removeProperty('--scroll-progress');
    };
  }, [router, updateProgress]);

  return <div className={styles.progressBar} />;
};

export default ScrollProgress;