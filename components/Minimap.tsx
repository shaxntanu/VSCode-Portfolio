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
    case 'div': return null; // skip generic divs
    case 'span': return null; // skip inline spans
    default: return null;
  }
};

interface ContentElement {
  tag: string;
  topPercent: number;     // position as % of total scrollable height
  heightPercent: number;  // height as % of total scrollable height
  color: string;
  indentLevel: number;    // 0-4, for visual width variation
}

const Minimap = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [elements, setElements] = useState<ContentElement[]>([]);
  const animFrameRef = useRef<number | null>(null);

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

    // Get all content elements that are direct or shallow children
    // Avoid deeply nested elements to prevent duplicates
    const selector = 'h1, h2, h3, h4, h5, h6, p, li, code, pre, a, strong, hr, table, img';
    const domElements = mainEditor.querySelectorAll(selector);

    const scanned: ContentElement[] = [];
    const seen = new Set<Element>();

    domElements.forEach((el) => {
      if (seen.has(el)) return;

      // Skip elements that are children of already-processed parents
      // to avoid deep nesting duplicates (e.g. <strong> inside <p>)
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

      // Position relative to the scrollable content, not the viewport
      const absoluteTop = mainEditor.scrollTop + (rect.top - mainRect.top);
      const elHeight = rect.height;

      if (elHeight < 2) return; // skip zero-height elements

      const color = getElementColor(el.tagName, accentColor);
      if (!color) return;

      // Calculate indent level from heading hierarchy
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

  // Draw the minimap canvas from the scanned elements
  const drawMinimap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw background sections to give depth
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0, 0, W, H);

    elements.forEach((el) => {
      const y = (el.topPercent / 100) * H;
      const h = Math.max(1.5, (el.heightPercent / 100) * H);

      // Width and left position based on element type
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
        // For body text, vary width naturally to look like real content
        // Use a deterministic pseudo-random based on position
        const seed = Math.floor(el.topPercent * 7.3) % 10;
        width = (maxWidth - indent) * (0.5 + (seed / 10) * 0.45);
      }

      ctx.fillStyle = el.color;

      // Draw heading elements as taller bars
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        ctx.fillRect(4 + indent, y, width, Math.max(2.5, h));
      } else if (tag === 'hr') {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(4, y, W - 8, 1);
      } else {
        // Body text: draw multiple thin lines to simulate paragraph lines
        const lineHeight = 2;
        const gap = 1;
        const totalLines = Math.max(1, Math.floor(h / (lineHeight + gap)));
        for (let i = 0; i < totalLines; i++) {
          // Last line of paragraph is shorter (like real text)
          const isLastLine = i === totalLines - 1;
          const lineWidth = isLastLine ? width * 0.6 : width;
          ctx.fillRect(4 + indent, y + i * (lineHeight + gap), lineWidth, lineHeight);
        }
      }
    });
  }, [elements]);

  // Track scroll position
  useEffect(() => {
    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = mainEditor;
      const percent =
        scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      setScrollPercent(percent);
    };

    mainEditor.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEditor.removeEventListener('scroll', handleScroll);
  }, [router.pathname]);

  // Scan content when route changes, with a delay to let the page render
  useEffect(() => {
    if (!shouldShow) return;

    // Initial scan after a brief render delay
    const timer = setTimeout(() => {
      scanContent();
    }, 150);

    // Re-scan after a longer delay for pages with async data
    const timerLong = setTimeout(() => {
      scanContent();
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerLong);
    };
  }, [router.pathname, shouldShow, scanContent]);

  // Set up MutationObserver to re-scan when DOM content changes
  // (covers async loaded content like GitHub data)
  useEffect(() => {
    if (!shouldShow) return;

    const mainEditor = document.getElementById('main-editor');
    if (!mainEditor) return;

    let debounceTimer: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scanContent();
      }, 200);
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

  // Redraw canvas whenever elements change
  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(drawMinimap);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [elements, drawMinimap]);

  // Redraw on theme change (accent color change)
  useEffect(() => {
    const handleThemeChange = () => {
      setTimeout(scanContent, 50);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [scanContent]);

  if (!shouldShow) return null;

  // Calculate viewport indicator height and position
  // viewportHeight as % of total content = clientHeight / scrollHeight
  const mainEditor =
    typeof document !== 'undefined' ? document.getElementById('main-editor') : null;
  const viewportHeightPercent = mainEditor
    ? (mainEditor.clientHeight / mainEditor.scrollHeight) * 100
    : 20;
  const viewportTopPercent = scrollPercent * (100 - viewportHeightPercent);

  return (
    <div className={styles.minimap}>
      <canvas
        ref={canvasRef}
        width={80}
        height={600}
        className={styles.canvas}
      />
      <div
        className={styles.viewport}
        style={{
          top: `${viewportTopPercent}%`,
          height: `${Math.min(viewportHeightPercent, 100 - viewportTopPercent)}%`,
        }}
      />
    </div>
  );
};

export default Minimap;
