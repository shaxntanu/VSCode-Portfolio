/**
 * VS Code-Style Minimap Component
 * Renders a scaled visual representation of page content with interactive navigation
 * Features: click-to-scroll, drag-to-scroll, real-time viewport tracking, 60fps performance
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';
import { analyzePageContent, mergeAdjacentBlocks, MinimapBlock } from '@/utils/minimapContentAnalyzer';
import { useMinimapScroll } from '@/hooks/useMinimapScroll';

const MINIMAP_PAGES = ['/about', '/experience', '/projects', '/publications', '/certificates'];
const CANVAS_WIDTH = 80;
const CANVAS_HEIGHT = 600;

const Minimap = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<MinimapBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { scrollToPosition, getViewportMetrics } = useMinimapScroll('main-editor');
  const shouldShow = MINIMAP_PAGES.includes(router.pathname);

  // Analyze page content and generate minimap blocks
  const scanContent = useCallback(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    const analyzed = analyzePageContent(mainEditor);
    const merged = mergeAdjacentBlocks(analyzed, 1.5);
    setBlocks(merged);
  }, []);

  // Draw minimap canvas
  const drawMinimap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0, 0, W, H);

    // Draw blocks
    blocks.forEach((block) => {
      const y = (block.topPercent / 100) * H;
      const h = Math.max(1, (block.heightPercent / 100) * H);

      const maxWidth = W - 8;
      const indent = block.indentLevel * 3;
      let width: number;

      // Width based on type
      if (block.type === 'heading') {
        width = maxWidth - indent;
      } else if (block.type === 'divider') {
        width = maxWidth * 0.5;
      } else {
        // Vary width for body text
        const seed = Math.floor(block.topPercent * 7.3) % 10;
        width = (maxWidth - indent) * (0.45 + (seed / 10) * 0.4);
      }

      ctx.fillStyle = block.color;

      // Render based on type
      if (block.type === 'heading') {
        // Headings: solid bars
        ctx.fillRect(4 + indent, y, width, Math.max(2, h));
      } else if (block.type === 'divider') {
        // Dividers: thin line
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(4, y, W - 8, 1);
      } else if (block.density === 'high') {
        // Code: dense grouped lines
        const lineHeight = 1.5;
        const gap = 0.5;
        const totalLines = Math.max(2, Math.floor(h / (lineHeight + gap)));
        for (let i = 0; i < totalLines; i++) {
          ctx.fillRect(4 + indent, y + i * (lineHeight + gap), width, lineHeight);
        }
      } else if (block.density === 'medium') {
        // Paragraphs: medium-density lines
        const lineHeight = 2;
        const gap = 1;
        const totalLines = Math.max(1, Math.floor(h / (lineHeight + gap)));
        for (let i = 0; i < totalLines; i++) {
          const isLastLine = i === totalLines - 1;
          const lineWidth = isLastLine ? width * 0.6 : width;
          ctx.fillRect(4 + indent, y + i * (lineHeight + gap), lineWidth, lineHeight);
        }
      } else {
        // Low density: sparse representation
        ctx.fillRect(4 + indent, y, width, Math.max(1.5, h * 0.5));
      }
    });
  }, [blocks]);

  // Click to scroll
  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickPercent = (clickY / rect.height) * 100;

    scrollToPosition(clickPercent);
  }, [isDragging, scrollToPosition]);

  // Drag to scroll
  const handleViewportMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const moveY = e.clientY - rect.top;
      const movePercent = (moveY / rect.height) * 100;

      scrollToPosition(movePercent);
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
  }, [isDragging, scrollToPosition]);

  // Scan content on route change
  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => scanContent(), 150);
    const timerLong = setTimeout(() => scanContent(), 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerLong);
    };
  }, [router.pathname, shouldShow, scanContent]);

  // MutationObserver for async content
  useEffect(() => {
    if (!shouldShow) return;

    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    let debounceTimer: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => scanContent(), 300);
    });

    observer.observe(mainEditor, {
      childList: true,
      subtree: true,
      characterData: false,
      attributes: false,
    });

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
    };
  }, [router.pathname, shouldShow, scanContent]);

  // Redraw canvas when blocks change
  useEffect(() => {
    drawMinimap();
  }, [blocks, drawMinimap]);

  // Theme change handler
  useEffect(() => {
    const handleThemeChange = () => {
      setTimeout(scanContent, 50);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [scanContent]);

  if (!shouldShow) return null;

  const { heightPercent, topPercent } = getViewportMetrics();

  return (
    <div
      ref={containerRef}
      className={styles.minimap}
      onClick={handleMinimapClick}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
      />
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
        style={{
          top: `${topPercent}%`,
          height: `${heightPercent}%`,
        }}
        onMouseDown={handleViewportMouseDown}
      />
    </div>
  );
};

export default Minimap;
