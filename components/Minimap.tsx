import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';

const MINIMAP_PAGES = ['/about', '/experience', '/projects', '/research', '/certificates'];

// Maps element tag names to colors for the minimap visualization
const getElementColor = (tagName: string, accentColor: string): string | null => {
  const tag = tagName.toLowerCase();
  switch (tag) {
    case 'h1': return accentColor;
    case 'h2': return accentColor + 'cc';
    case 'h3': return accentColor + '99';
    case 'h4':
    case 'h5':
    case 'h6': return accentColor + '66';
    case 'p': return 'rgba(255,255,255,0.45)';
    case 'li': return 'rgba(255,255,255,0.35)';
    case 'code':
    case 'pre': return 'rgba(78, 201, 176, 0.7)';
    case 'a': return 'rgba(97, 175, 239, 0.6)';
    case 'strong':
    case 'b': return 'rgba(255, 198, 109, 0.6)';
    case 'hr': return 'rgba(255,255,255,0.15)';
    case 'table': return 'rgba(200, 150, 255, 0.5)';
    case 'img': return 'rgba(130, 200, 130, 0.5)';
    case 'div': return null;
    case 'span': return null;
    default: return null;
  }
};

interface ContentElement {
  tag: string;
  topPercent: number;
  heightPercent: number;
  color: string;
  indentLevel: number;
}

interface ScrollState {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

const Minimap = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const [elements, setElements] = useState<ContentElement[]>([]);
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });
  
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  const shouldShow = MINIMAP_PAGES.includes(router.pathname);

  // Scan DOM and extract element positions
  const scanContent = useCallback(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim() || '#e6b450';

    const scrollHeight = mainEditor.scrollHeight;
    if (scrollHeight === 0) return;

    const selector = 'h1, h2, h3, h4, h5, h6, p, li, code, pre, a, strong, hr, table, img';
    const domElements = mainEditor.querySelectorAll(selector);

    const scanned: ContentElement[] = [];
    const seen = new Set<Element>();

    domElements.forEach((el) => {
      if (seen.has(el)) return;

      let parent = el.parentElement;
      let skipDueToParent = false;
      while (parent && parent !== mainEditor) {
        if (seen.has(parent)) {
          skipDueToParent = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (skipDueToParent) return;

      const rect = el.getBoundingClientRect();
      const mainRect = mainEditor.getBoundingClientRect();

      const absoluteTop = mainEditor.scrollTop + (rect.top - mainRect.top);
      const elHeight = rect.height;

      if (elHeight < 2) return;

      const color = getElementColor(el.tagName, accentColor);
      if (!color) return;

      let indentLevel = 0;
      const tag = el.tagName.toLowerCase();
      if (tag === 'h1') indentLevel = 0;
      else if (tag === 'h2') indentLevel = 1;
      else if (tag === 'h3') indentLevel = 2;
      else if (['h4', 'h5', 'h6'].includes(tag)) indentLevel = 3;
      else if (['p', 'li', 'code', 'pre'].includes(tag)) indentLevel = 2;
      else if (['a', 'strong', 'hr', 'table', 'img'].includes(tag)) indentLevel = 2;

      seen.add(el);

      scanned.push({
        tag,
        topPercent: (absoluteTop / scrollHeight) * 100,
        heightPercent: (elHeight / scrollHeight) * 100,
        color,
        indentLevel,
      });
    });

    setElements(scanned);
  }, []);

  // Draw the minimap canvas
  const drawMinimap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0, 0, W, H);

    elements.forEach((el) => {
      const y = (el.topPercent / 100) * H;
      const h = Math.max(1.5, (el.heightPercent / 100) * H);

      const maxWidth = W - 8;
      const indent = el.indentLevel * 4;
      let width: number;
      const tag = el.tag;

      if (tag === 'h1') {
        width = maxWidth - indent;
      } else if (tag === 'h2') {
        width = (maxWidth - indent) * 0.9;
      } else if (tag === 'h3') {
        width = (maxWidth - indent) * 0.8;
      } else if (tag === 'hr') {
        width = maxWidth * 0.6;
      } else {
        const seed = Math.floor(el.topPercent * 7.3) % 10;
        width = (maxWidth - indent) * (0.5 + (seed / 10) * 0.45);
      }

      ctx.fillStyle = el.color;

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        ctx.fillRect(4 + indent, y, width, Math.max(2.5, h));
      } else if (tag === 'hr') {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(4, y, W - 8, 1);
      } else {
        const lineHeight = 2;
        const gap = 1;
        const totalLines = Math.max(1, Math.floor(h / (lineHeight + gap)));
        for (let i = 0; i < totalLines; i++) {
          const isLastLine = i === totalLines - 1;
          const lineWidth = isLastLine ? width * 0.6 : width;
          ctx.fillRect(4 + indent, y + i * (lineHeight + gap), lineWidth, lineHeight);
        }
      }
    });
  }, [elements]);

  // Update scroll state using requestAnimationFrame for smooth 60fps sync
  const updateScrollState = useCallback(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    const newState: ScrollState = {
      scrollTop: mainEditor.scrollTop,
      scrollHeight: mainEditor.scrollHeight,
      clientHeight: mainEditor.clientHeight,
    };

    setScrollState(newState);
    lastScrollRef.current = newState.scrollTop;
  }, []);

  // Scroll handler using RAF for performance
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateScrollState);
  }, [updateScrollState]);

  // Click to scroll - click anywhere on minimap to jump to that location
  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) return;

    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickPercent = clickY / rect.height;

    const targetScrollTop = clickPercent * (mainEditor.scrollHeight - mainEditor.clientHeight);
    mainEditor.scrollTop = Math.max(0, Math.min(targetScrollTop, mainEditor.scrollHeight - mainEditor.clientHeight));
  }, []);

  // Drag to scroll - drag the viewport rectangle to scroll
  const handleViewportMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!isDraggingRef.current) return;

    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const moveY = e.clientY - rect.top;
      const movePercent = moveY / rect.height;

      const targetScrollTop = movePercent * (mainEditor.scrollHeight - mainEditor.clientHeight);
      mainEditor.scrollTop = Math.max(0, Math.min(targetScrollTop, mainEditor.scrollHeight - mainEditor.clientHeight));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    mainEditor.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEditor.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
      debounceTimer = setTimeout(() => scanContent(), 200);
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

  // Redraw canvas when elements change
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(drawMinimap);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [elements, drawMinimap]);

  // Theme change handler
  useEffect(() => {
    const handleThemeChange = () => {
      setTimeout(scanContent, 50);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [scanContent]);

  if (!shouldShow) return null;

  const viewportHeightPercent = scrollState.scrollHeight > 0
    ? (scrollState.clientHeight / scrollState.scrollHeight) * 100
    : 20;
  const viewportTopPercent = scrollState.scrollHeight > scrollState.clientHeight
    ? (scrollState.scrollTop / (scrollState.scrollHeight - scrollState.clientHeight)) * (100 - viewportHeightPercent)
    : 0;

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
        className={styles.viewport}
        style={{
          top: `${viewportTopPercent}%`,
          height: `${Math.min(viewportHeightPercent, 100 - viewportTopPercent)}%`,
        }}
        onMouseDown={handleViewportMouseDown}
      />
    </div>
  );
};

export default Minimap;
