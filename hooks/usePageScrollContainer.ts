import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

// Reusable function to find the actual page scroll container
const findPageScrollContainer = (): HTMLElement | null => {
  const mainEditor = document.getElementById('main-editor');
  if (!mainEditor) return null;

  // First check if main-editor itself is scrollable
  if (mainEditor.scrollHeight > mainEditor.clientHeight) {
    return mainEditor;
  }

  // Otherwise, find the scrollable descendant with the largest vertical scroll range
  let bestCandidate: HTMLElement | null = null;
  let maxScrollRange = 0;

  const allElements = mainEditor.querySelectorAll('*');
  allElements.forEach((el: any) => {
    const computed = getComputedStyle(el);
    const overflowY = computed.overflowY;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    const scrollRange = scrollHeight - clientHeight;

    // Only consider elements with meaningful vertical scroll
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      scrollRange > maxScrollRange &&
      scrollRange > 50 // Minimum meaningful scroll range
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
    if (container && container !== scrollContainerRef.current) {
      scrollContainerRef.current = container;
      setScrollContainer(container);
    }
  }, []);

  useEffect(() => {
    // Initial discovery
    refreshScrollContainer();

    // Re-discover on route change
    const handleRouteChange = () => {
      setTimeout(() => {
        refreshScrollContainer();
      }, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [refreshScrollContainer, router]);

  return { scrollContainer, refreshScrollContainer };
};
