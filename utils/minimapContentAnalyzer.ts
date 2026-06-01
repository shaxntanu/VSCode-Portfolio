/**
 * Minimap Content Analyzer
 * Renders page content onto canvas in two modes:
 * - Lite: Abstract colored blocks representing DOM structure
 * - Full: Actual miniature text mapped to exact positions
 */

export type MinimapMode = 'lite' | 'full';

interface ElementInfo {
  top: number;
  height: number;
  color: string;
  fontSize: string;
  fontFamily: string;
  text: string;
  tag: string;
}

const isElementVisible = (el: Element): boolean => {
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

const getTextElements = (container: HTMLElement): ElementInfo[] => {
  const elements: ElementInfo[] = [];
  const containerRect = container.getBoundingClientRect();
  
  // Target text-containing elements
  const selector = 'p, h1, h2, h3, h4, h5, h6, span, code, pre, li, a, strong, em, div';
  const nodes = container.querySelectorAll(selector);

  nodes.forEach((el) => {
    if (!isElementVisible(el)) return;
    
    const text = el.textContent?.trim();
    if (!text || text.length === 0) return;

    const rect = el.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(el);
    
    // Calculate position relative to container
    const top = rect.top - containerRect.top + container.scrollTop;
    
    elements.push({
      top,
      height: rect.height,
      color: computedStyle.color,
      fontSize: computedStyle.fontSize,
      fontFamily: computedStyle.fontFamily,
      text,
      tag: el.tagName.toLowerCase(),
    });
  });

  return elements;
};

const drawLiteMode = (
  ctx: CanvasRenderingContext2D,
  elements: ElementInfo[],
  scaleRatio: number,
  canvasWidth: number
) => {
  elements.forEach((el) => {
    const y = el.top * scaleRatio;
    const h = Math.max(1, el.height * scaleRatio);
    
    // Determine width based on element type
    let width = canvasWidth - 8;
    let indent = 4;
    
    if (el.tag.startsWith('h')) {
      const level = parseInt(el.tag.charAt(1)) || 1;
      width = (canvasWidth - 8) * (1 - level * 0.1);
      indent = level * 2;
    } else if (['code', 'pre'].includes(el.tag)) {
      width = (canvasWidth - 8) * 0.9;
      indent = 6;
    } else if (el.tag === 'li') {
      width = (canvasWidth - 8) * 0.85;
      indent = 8;
    }
    
    // Parse color and add opacity for lite mode
    ctx.fillStyle = el.color.replace('rgb', 'rgba').replace(')', ', 0.6)');
    
    // Draw block
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.tag)) {
      // Headings: solid bars
      ctx.fillRect(indent, y, width, Math.max(2, h));
    } else if (['code', 'pre'].includes(el.tag)) {
      // Code: dense lines
      const lineHeight = 1.5;
      const gap = 0.5;
      const lines = Math.max(1, Math.floor(h / (lineHeight + gap)));
      for (let i = 0; i < lines; i++) {
        ctx.fillRect(indent, y + i * (lineHeight + gap), width, lineHeight);
      }
    } else {
      // Regular text: medium density lines
      const lineHeight = 2;
      const gap = 1;
      const lines = Math.max(1, Math.floor(h / (lineHeight + gap)));
      for (let i = 0; i < lines; i++) {
        const lineWidth = i === lines - 1 ? width * 0.7 : width;
        ctx.fillRect(indent, y + i * (lineHeight + gap), lineWidth, lineHeight);
      }
    }
  });
};

const drawFullMode = (
  ctx: CanvasRenderingContext2D,
  elements: ElementInfo[],
  scaleRatio: number,
  canvasWidth: number
) => {
  elements.forEach((el) => {
    const y = el.top * scaleRatio;
    const scaledFontSize = Math.max(1, parseFloat(el.fontSize) * scaleRatio);
    
    // Set font
    ctx.font = `${scaledFontSize}px ${el.fontFamily}`;
    ctx.fillStyle = el.color;
    ctx.textBaseline = 'top';
    
    // Calculate indent based on element type
    let x = 4;
    if (el.tag.startsWith('h')) {
      const level = parseInt(el.tag.charAt(1)) || 1;
      x = level * 2;
    } else if (['code', 'pre'].includes(el.tag)) {
      x = 6;
    } else if (el.tag === 'li') {
      x = 8;
    }
    
    // Split text into words and wrap
    const words = el.text.split(/\s+/);
    const maxWidth = canvasWidth - x - 4;
    let currentLine = '';
    let lineY = y;
    const lineHeight = scaledFontSize * 1.2;
    
    words.forEach((word, index) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        // Draw current line
        ctx.fillText(currentLine, x, lineY);
        currentLine = word;
        lineY += lineHeight;
      } else {
        currentLine = testLine;
      }
      
      // Draw last line
      if (index === words.length - 1 && currentLine) {
        ctx.fillText(currentLine, x, lineY);
      }
    });
  });
};

export const drawMinimap = (
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  mode: MinimapMode
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas resolution to match CSS size for crisp rendering
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  
  const canvasWidth = rect.width;
  const canvasHeight = rect.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Calculate scale ratio
  const scrollHeight = container.scrollHeight;
  if (scrollHeight === 0) return;
  
  const scaleRatio = canvasHeight / scrollHeight;
  
  // Get text elements
  const elements = getTextElements(container);
  
  // Render based on mode
  if (mode === 'lite') {
    drawLiteMode(ctx, elements, scaleRatio, canvasWidth);
  } else {
    drawFullMode(ctx, elements, scaleRatio, canvasWidth);
  }
};
