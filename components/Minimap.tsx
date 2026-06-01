/**
 * VS Code-Style Minimap Component
 * Renders a scaled visual representation of page content with interactive navigation
 * Features: click-to-scroll, drag-to-scroll, real-time viewport tracking, 60fps performance
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Minimap.module.css';
import { useMinimapScroll } from '@/hooks/useMinimapScroll';

const MINIMAP_PAGES = ['/about', '/experience', '/projects', '/publications', '/certificates'];
const CANVAS_WIDTH = 80;
const CANVAS_HEIGHT = 600;

interface MinimapBlock {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'card' | 'image' | 'divider' | 'chart';
  topPercent: number;
  heightPercent: number;
  color: string;
  density: 'high' | 'medium' | 'low';
  indentLevel: number;
  label?: string;
}

const getElementColor = (tagName: string, accentColor: string): string | null => {
  const tag = tagName.toLowerCase();
  switch (tag) {
    case 'h1': return accentColor;
    case 'h2': return accentColor + 'dd';
    case 'h3': return accentColor + 'bb';
    case 'h4':
    case 'h5':
    case 'h6': return accentColor + '99';
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
    default: return null;
  }
};

const getDensity = (tag: string): 'high' | 'medium' | 'low' => {
  if (['pre', 'code'].includes(tag.toLowerCase())) return 'high';
  if (['p', 'li', 'a'].includes(tag.toLowerCase())) return 'medium';
  return 'low';
};

const getIndentLevel = (tag: string): number => {
  const t = tag.toLowerCase();
  if (t === 'h1') return 0;
  if (t === 'h2') return 1;
  if (t === 'h3') return 2;
  if (['h4', 'h5', 'h6'].includes(t)) return 3;
  return 2;
};

const analyzePageContent = (mainEditor: HTMLElement): MinimapBlock[] => {
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-color')
    .trim() || '#e6b450';

  const scrollHeight = mainEditor.scrollHeight;
  if (scrollHeight === 0) return [];

  const selector = 'h1, h2, h3, h4, h5, h6, p, li, code, pre, a, strong, hr, table, img, .card, [role="article"]';
  const domElements = mainEditor.querySelectorAll(selector);

  const blocks: MinimapBlock[] = [];
  const seen = new Set<Element>();

  const getBlockType = (tag: string): MinimapBlock['type'] => {
    const t = tag.toLowerCase();
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(t)) return 'heading';
    if (t === 'hr') return 'divider';
    if (['code', 'pre'].includes(t)) return 'code';
    if (t === 'li') return 'list';
    if (t === 'img') return 'image';
    if (t === 'table') return 'chart';
    if (t === 'p' || t === 'a' || t === 'strong') return 'paragraph';
    return 'paragraph';
  };

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

    const tag = el.tagName.toLowerCase();
    const color = getElementColor(tag, accentColor);
    if (!color) return;

    const topPercent = (absoluteTop / scrollHeight) * 100;
    const heightPercent = (elHeight / scrollHeight) * 100;

    let label: string | undefined;
    if (['h1', 'h2', 'h3'].includes(tag)) {
      label = el.textContent?.substring(0, 20) || undefined;
    }

    blocks.push({
      type: getBlockType(tag),
      topPercent,
      heightPercent,
      color,
      density: getDensity(tag),
      indentLevel: getIndentLevel(tag),
      label,
    });

    seen.add(el);
  });

  return blocks;
};

const mergeAdjacentBlocks = (blocks: MinimapBlock[], threshold: number = 2): MinimapBlock[] => {
  if (blocks.length === 0) return blocks;

  const merged: MinimapBlock[] = [];
  let current = blocks[0];

  for (let i = 1; i < blocks.length; i++) {
    const next = blocks[i];
    const gap = next.topPercent - (current.topPercent + current.heightPercent);

    if (gap < threshold && current.type === next.type && current.color === next.color) {
      current = {
        ...current,
        heightPercent: next.topPercent + next.heightPercent - current.topPercent,
      };
    } else {
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
};

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
