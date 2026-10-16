import { useEffect, useCallback, useRef } from 'react';
import { usePageScrollContainer } from '@/hooks/usePageScrollContainer';
import styles from '@/styles/ScrollProgress.module.css';

const ScrollProgress = () => {
  const { scrollContainer, layoutVersion } = usePageScrollContainer();
  const rafRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (!scrollContainer) {
      document.documentElement.style.setProperty('--scroll-progress', '0%');
      return;
    }

    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    document.documentElement.style.setProperty('--scroll-progress', `${clampedProgress * 100}%`);
  }, [scrollContainer]);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    if (!scrollContainer) {
      updateProgress();
      return;
    }

    // Add scroll listener
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    updateProgress();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollContainer, handleScroll, updateProgress, layoutVersion]);

  return <div className={styles.progressBar} />;
};

export default ScrollProgress;
