import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

const getScrollRange = (element: HTMLElement) =>
  Math.max(0, element.scrollHeight - element.clientHeight);

const isScrollable = (element: HTMLElement) => {
  const { overflowY } = getComputedStyle(element);
  return (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
    getScrollRange(element) > 1;
};

// Prefer the current page's root scroll area. Picking the largest scroll range
// anywhere in the editor can select an unrelated nested panel (for example,
// the code preview on the home page) and make the global progress bar appear stuck.
const findPageScrollContainer = (): HTMLElement | null => {
  const mainEditor = document.getElementById('main-editor');
  if (!mainEditor) return null;

  const visible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const { display, visibility } = getComputedStyle(element);
    return display !== 'none' && visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  };

  const pageRoots = Array.from(mainEditor.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && !element.classList.contains('jp-matrix'),
  );
  const scrollablePageRoots = pageRoots.filter((element) => visible(element) && isScrollable(element));

  if (scrollablePageRoots.length > 0) {
    return scrollablePageRoots.sort((left, right) => getScrollRange(right) - getScrollRange(left))[0];
  }

  const candidates = [mainEditor, ...Array.from(mainEditor.querySelectorAll<HTMLElement>('*'))]
    .filter((element) => visible(element) && isScrollable(element));

  // Keep only the outermost scrollable areas so a nested widget cannot take
  // over page progress when the page itself has a scrollable root.
  const outermostCandidates = candidates.filter((candidate) => {
    let ancestor = candidate.parentElement;
    while (ancestor && ancestor !== mainEditor) {
      if (candidates.includes(ancestor)) return false;
      ancestor = ancestor.parentElement;
    }
    return true;
  });

  return outermostCandidates.sort((left, right) => getScrollRange(right) - getScrollRange(left))[0] ?? null;
};

export const usePageScrollContainer = () => {
  const router = useRouter();
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const refreshScrollContainer = useCallback(() => {
    const container = findPageScrollContainer();
    if (container !== scrollContainerRef.current) {
      scrollContainerRef.current = container;
      setScrollContainer(container);
    }
    setLayoutVersion((version) => version + 1);
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
    // Resize and media-load changes can make a page scrollable after its first
    // render without changing the outer editor's dimensions.
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(scheduleRefresh)
      : null;
    resizeObserver?.observe(mainEditor);

    const observePageElements = () => {
      if (!resizeObserver) return;
      Array.from(mainEditor.children).forEach((element) => {
        if (element instanceof HTMLElement && !element.classList.contains('jp-matrix')) {
          resizeObserver.observe(element);
        }
      });
    };
    observePageElements();

    const mutationObserver = new MutationObserver(() => {
      observePageElements();
      scheduleRefresh();
    });
    mutationObserver.observe(mainEditor, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: ['class', 'style'],
    });
    mainEditor.addEventListener('load', scheduleRefresh, true);

    const handleRouteChange = () => {
      scheduleRefresh();
      window.setTimeout(scheduleRefresh, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('resize', scheduleRefresh);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('resize', scheduleRefresh);
      mainEditor.removeEventListener('load', scheduleRefresh, true);
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      if (refreshFrame !== null) {
        window.cancelAnimationFrame(refreshFrame);
      }
    };
  }, [refreshScrollContainer, router.events]);

  return { scrollContainer, refreshScrollContainer, layoutVersion };
};
