/**
 * VS Code-Style Minimap Component
 * Toggleable rendering modes: Lite (blocks) and Full (actual text)
 * Features: click-to-scroll, drag-to-scroll, real-time viewport tracking
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';
import { drawMinimap, MinimapMode } from '@/utils/minimapContentAnalyzer';

const MINIMAP_PAGES = ['/about', '/experience', '/projects', '/publications', '/certificates'];

interface MinimapProps {
  mode?: MinimapMode;
}

const Minimap = ({ mode = 'lite' }: MinimapProps) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [viewportMetrics, setViewportMetrics] = useState({ top: 0, height: 20 });
  
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const shouldShow = MINIMAP_PAGES.includes(router.pathname);

  // Update viewport position based on scroll
  const updateViewport = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const { scrollTop, scrollHeight, clientHeight } = content;
    
    if (scrollHeight <= clientHeight) {
      setViewportMetrics({ top: 0, height: 100 });
      return;
    }

    const viewportHeightPercent = (clientHeight / scrollHeight) * 100;
    const maxScroll = scrollHeight - clientHeight;
    const scrollPercent = scrollTop / maxScroll;
    const viewportTopPercent = scrollPercent * (100 - viewportHeightPercent);

    setViewportMetrics({
      top: Math.max(0, Math.min(viewportTopPercent, 100 - viewportHeightPercent)),
      height: Math.min(viewportHeightPercent, 100),
    });
  }, []);

  // Handle scroll with RAF
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateViewport);
  }, [updateViewport]);

  // Redraw minimap
  const redrawMinimap = useCallback(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    
    if (!canvas || !content) return;
    
    drawMinimap(canvas, content, mode);
  }, [mode]);

  // Debounced redraw
  const debouncedRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTimeout(redrawMinimap, 100);
    });
  }, [redrawMinimap]);

  // Click to scroll
  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !containerRef.current || !contentRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickPercent = clickY / rect.height;

    const content = contentRef.current;
    const maxScroll = content.scrollHeight - content.clientHeight;
    const targetScroll = clickPercent * maxScroll;

    content.scrollTop = Math.max(0, Math.min(targetScroll, maxScroll));
  }, [isDragging]);

  // Drag to scroll
  const handleViewportMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !contentRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const moveY = e.clientY - rect.top;
      const movePercent = moveY / rect.height;

      const content = contentRef.current;
      const maxScroll = content.scrollHeight - content.clientHeight;
      const targetScroll = movePercent * maxScroll;

      content.scrollTop = Math.max(0, Math.min(targetScroll, maxScroll));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Setup content ref and listeners
  useEffect(() => {
    const content = document.getElementById('main-editor');
    if (!content) return;

    contentRef.current = content;

    // Attach scroll listener
    content.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial viewport update
    updateViewport();

    return () => {
      content.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, updateViewport]);

  // ResizeObserver for content changes
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    resizeObserverRef.current = new ResizeObserver(debouncedRedraw);
    resizeObserverRef.current.observe(content);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [debouncedRedraw]);

  // Redraw on route change or mode change
  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(redrawMinimap, 200);
    const timerLong = setTimeout(redrawMinimap, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerLong);
    };
  }, [router.pathname, shouldShow, mode, redrawMinimap]);

  // Window resize listener
  useEffect(() => {
    window.addEventListener('resize', debouncedRedraw);
    return () => window.removeEventListener('resize', debouncedRedraw);
  }, [debouncedRedraw]);

  // Theme change handler
  useEffect(() => {
    const handleThemeChange = () => {
      setTimeout(redrawMinimap, 50);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [redrawMinimap]);

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      className={styles.minimap}
      onClick={handleMinimapClick}
    >
      <canvas
        ref={canvasRef}
        width={80}
        height={600}
        className={styles.canvas}
      />
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
        style={{
          top: `${viewportMetrics.top}%`,
          height: `${viewportMetrics.height}%`,
        }}
        onMouseDown={handleViewportMouseDown}
      />
    </div>
  );
};

export default Minimap;
