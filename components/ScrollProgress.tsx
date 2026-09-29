import { useEffect, useCallback, useRef } from 'react';
import { usePageScrollContainer } from '@/hooks/usePageScrollContainer';
import styles from '@/styles/ScrollProgress.module.css';

const ScrollProgress = () => {
  const { scrollContainer } = usePageScrollContainer();
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    // Calculate progress (0 to 1)
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Clamp between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));

    // Only update if changed significantly
    if (Math.abs(clampedProgress - progressRef.current) > 0.001) {
      progressRef.current = clampedProgress;
      document.documentElement.style.setProperty('--scroll-progress', `${clampedProgress * 100}%`);
    }
  }, [scrollContainer]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    if (!scrollContainer) return;

    // Add scroll listener
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    updateProgress();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollContainer, handleScroll, updateProgress]);

  return <div className={styles.progressBar} />;
};

export default ScrollProgress;