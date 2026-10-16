import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

// Reusable function to find the actual page scroll container
const findPageScrollContainer = (): HTMLElement | null => {
  const mainEditor = document.getElementById('main-editor');
  if (!mainEditor) return null;

  let bestCandidate: HTMLElement | null = null;
  let maxScrollRange = 0;
  const candidates = [mainEditor, ...Array.from(mainEditor.querySelectorAll<HTMLElement>('*'))];

  candidates.forEach((el) => {
    const computed = getComputedStyle(el);
    const overflowY = computed.overflowY;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    const scrollRange = scrollHeight - clientHeight;

    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      scrollRange > maxScrollRange &&
      scrollRange > 1
    ) {
      maxScrollRange = scrollRange;
      bestCandidate = el;
    }
  });

  return bestCandidate;
};

export const usePageScrollContainer = () => {
  const router = useRouter();
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const refreshScrollContainer = useCallback(() => {
    const container = findPageScrollContainer();
    if (container !== scrollContainerRef.current) {
      scrollContainerRef.current = container;
      setScrollContainer(container);
    }
  }, []);

  useEffect(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    let refreshFrame: number | null = null;
    const scheduleRefresh = () => {
      if (refreshFrame !== null) return;
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = null;
        refreshScrollContainer();
      });
    };

    refreshScrollContainer();

    // Pages such as KeySprint become scrollable after their API data loads.
    const mutationObserver = new MutationObserver(scheduleRefresh);
    mutationObserver.observe(mainEditor, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    const handleRouteChange = () => {
      scheduleRefresh();
      window.setTimeout(scheduleRefresh, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('resize', scheduleRefresh);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('resize', scheduleRefresh);
      mutationObserver.disconnect();
      if (refreshFrame !== null) {
        window.cancelAnimationFrame(refreshFrame);
      }
    };
  }, [refreshScrollContainer, router.events]);

  return { scrollContainer, refreshScrollContainer };
};
