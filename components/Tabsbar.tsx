import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import Tab from '@/components/Tab';
import { useRecentTabs } from '@/hooks/useRecentTabs';
import { rootFile } from '@/data/navigation';

import styles from '@/styles/Tabsbar.module.css';

const Tabsbar = () => {
  const { tabs, closeTab } = useRecentTabs();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Update scroll button states
  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtStart = container.scrollLeft <= 1;
      const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1;
      
      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  }, []);

  // Scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll to active tab when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeTabElement = scrollContainerRef.current?.querySelector(`[data-tab-path="${router.pathname}"]`);
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [router.pathname]);

  // Initialize scroll state and add scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollState();
      
      const handleScroll = () => {
        updateScrollState();
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      
      // Also update on resize
      const handleResize = () => updateScrollState();
      window.addEventListener('resize', handleResize);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [updateScrollState, tabs]);

  return (
    <div className={styles.tabsContainer}>
      {/* Left scroll button */}
      <button
        className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll tabs left"
      >
        <VscChevronLeft />
      </button>

      {/* Left shadow */}
      <div className={`${styles.leftShadow} ${canScrollLeft ? styles.visible : ''}`} />

      {/* Tabs scroll container */}
      <div ref={scrollContainerRef} className={styles.tabs}>
        {/* Main.cpp always visible */}
        <div
          key={rootFile.name}
          className={styles.tabItem}
          data-tab-path={rootFile.path}
        >
          <Tab icon={rootFile.icon} filename={rootFile.name} path={rootFile.path} />
        </div>

        {/* Recent tabs */}
        {tabs.map(tab => (
          <div
            key={`recent-${tab.path}`}
            className={styles.tabItem}
            data-tab-path={tab.path}
          >
            <div className={styles.recentTab}>
              <Tab icon={tab.icon} filename={tab.name} path={tab.path} />
              <button
                className={styles.closeTab}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.path);
                }}
                aria-label={`Close ${tab.name}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right shadow */}
      <div className={`${styles.rightShadow} ${canScrollRight ? styles.visible : ''}`} />

      {/* Right scroll button */}
      <button
        className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll tabs right"
      >
        <VscChevronRight />
      </button>
    </div>
  );
};

export default Tabsbar;
