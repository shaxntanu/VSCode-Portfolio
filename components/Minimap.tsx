/**
 * VS Code-Style Minimap Component
 * Proper architecture: analyze once, render many
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';
import {
  analyzeContent,
  renderMinimap,
  LineModel,
} from '@/utils/minimapContentAnalyzer';

const MINIMAP_PAGES = [
  '/about',
  '/experience',
  '/projects',
  '/publications',
  '/certificates',
];

const Minimap = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const lineModelRef = useRef<LineModel | null>(null);
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [viewportMetrics, setViewportMetrics] = useState({
    top: 0,
    height: 20,
  });
  const [isDragging, setIsDragging] = useState(false);

  const shouldShow = MINIMAP_PAGES.includes(router.pathname);

  const getAccentColor = useCallback((): string => {
    const computed = getComputedStyle(document.documentElement);
    return computed.getPropertyValue('--accent-color').trim() || '#e6b450';
  }, []);

  const updateViewport = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const { scrollTop, scrollHeight, clientHeight } = content;

    if (scrollHeight <= clientHeight) {
      setViewportMetrics({ top: 0, height: 100 });
      return;
    }

    const viewportH = (clientHeight / scrollHeight) * 100;
    const maxScroll = scrollHeight - clientHeight;
    const scrollRatio = scrollTop / maxScroll;
    const viewportTop = scrollRatio * (100 - viewportH);

    setViewportMetrics({
      top: Math.max(0, Math.min(viewportTop, 100 - viewportH)),
      height: Math.min(viewportH, 100),
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateViewport);
  }, [updateViewport]);

  const performAnalysis = useCallback(() => {
    const content = contentRef.current;
    const canvas = canvasRef.current;
    if (!content || !canvas) return;

    const model = analyzeContent(content);
    lineModelRef.current = model;

    const accentColor = getAccentColor();
    renderMinimap(canvas, model, accentColor);
  }, [getAccentColor]);

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      performAnalysis();
    }, 200);
  }, [performAnalysis]);

  const handleThemeChange = useCallback(() => {
    const canvas = canvasRef.current;
    const model = lineModelRef.current;
    if (!canvas || !model) return;

    const accentColor = getAccentColor();
    renderMinimap(canvas, model, accentColor);
  }, [getAccentColor]);

  const handleMinimapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging || !containerRef.current || !contentRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const clickPct = clickY / rect.height;

      const content = contentRef.current;
      const maxScroll = content.scrollHeight - content.clientHeight;
      const targetScroll = clickPct * maxScroll;

      content.scrollTo({
        top: Math.max(0, Math.min(targetScroll, maxScroll)),
        behavior: 'smooth',
      });
    },
    [isDragging]
  );

  const handleViewportMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !contentRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const moveY = e.clientY - rect.top;
      const movePct = moveY / rect.height;

      const content = contentRef.current;
      const maxScroll = content.scrollHeight - content.clientHeight;
      const targetScroll = movePct * maxScroll;

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

  useEffect(() => {
    const content = document.getElementById('main-editor');
    if (!content) return;

    contentRef.current = content;

    content.addEventListener('scroll', handleScroll, { passive: true });
    updateViewport();

    return () => {
      content.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, updateViewport]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(content);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [handleResize]);

  useEffect(() => {
    if (!shouldShow) return;

    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(() => {
      performAnalysis();
    }, 300);

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [router.pathname, shouldShow, performAnalysis]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [handleThemeChange]);

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
