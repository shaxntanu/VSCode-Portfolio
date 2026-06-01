/**
 * useMinimapScroll Hook
 * Manages scroll synchronization between main editor and minimap
 * Uses requestAnimationFrame for 60fps performance
 */

import { useEffect, useRef, useCallback, useState } from 'react';

export interface ScrollState {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export const useMinimapScroll = (containerId: string = 'main-editor') => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });

  const rafRef = useRef<number | null>(null);
  const lastStateRef = useRef<ScrollState>(scrollState);
  const isDraggingRef = useRef(false);

  // Update scroll state using RAF for performance
  const updateScrollState = useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const newState: ScrollState = {
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight,
    };

    // Only update if values changed
    if (
      newState.scrollTop !== lastStateRef.current.scrollTop ||
      newState.scrollHeight !== lastStateRef.current.scrollHeight ||
      newState.clientHeight !== lastStateRef.current.clientHeight
    ) {
      lastStateRef.current = newState;
      setScrollState(newState);
    }
  }, [containerId]);

  // Scroll event handler with RAF batching
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateScrollState);
  }, [updateScrollState]);

  // Attach scroll listener
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initial state
    updateScrollState();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerId, handleScroll, updateScrollState]);

  // Scroll to position
  const scrollToPosition = useCallback((percent: number) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const targetScroll = (percent / 100) * maxScroll;
    container.scrollTop = Math.max(0, Math.min(targetScroll, maxScroll));
  }, [containerId]);

  // Calculate viewport metrics
  const getViewportMetrics = useCallback(() => {
    const viewportHeightPercent = scrollState.scrollHeight > 0
      ? (scrollState.clientHeight / scrollState.scrollHeight) * 100
      : 20;

    const viewportTopPercent = scrollState.scrollHeight > scrollState.clientHeight
      ? (scrollState.scrollTop / (scrollState.scrollHeight - scrollState.clientHeight)) * (100 - viewportHeightPercent)
      : 0;

    return {
      heightPercent: Math.min(viewportHeightPercent, 100),
      topPercent: Math.max(0, Math.min(viewportTopPercent, 100)),
    };
  }, [scrollState]);

  return {
    scrollState,
    scrollToPosition,
    getViewportMetrics,
    isDraggingRef,
  };
};
