/**
 * Minimap Content Analyzer - Visual Polish Focus
 * Creates a clean, authentic VS Code-style minimap
 */

export type MinimapMode = 'lite' | 'full';

interface ElementInfo {
  top: number;
  height: number;
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'card';
  level: number;
}

const getCleanElements = (container: HTMLElement): ElementInfo[] => {
  const elements: ElementInfo[] = [];
  const containerRect = container.getBoundingClientRect();
  
  // Only target meaningful structural elements
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const paragraphs = container.querySelectorAll('p');
  const codeBlocks = container.querySelectorAll('pre, code');
  const lists = container.querySelectorAll('li');
  
  const processElements = (nodes: NodeListOf<Element>, type: ElementInfo['type'], level: number = 0) => {
    nodes.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      
      const rect = el.getBoundingClientRect();
      if (rect.height < 2) return;
      
      const top = rect.top - containerRect.top + container.scrollTop;
      
      elements.push({
        top,
        height: rect.height,
        type,
        level: type === 'heading' ? parseInt(el.tagName.charAt(1)) : level,
      });
    });
  };
  
  processElements(headings, 'heading');
  processElements(paragraphs, 'paragraph');
  processElements(codeBlocks, 'code');
  processElements(lists, 'list', 1);
  
  return elements.sort((a, b) => a.top - b.top);
};

export const drawMinimap = (
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  mode: MinimapMode
): void => {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // High-quality rendering setup
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  
  const W = rect.width;
  const H = rect.height;
  
  // Clear with subtle background
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, W, H);
  
  // Calculate scale
  const scrollHeight = container.scrollHeight;
  if (scrollHeight === 0) return;
  
  const scale = H / scrollHeight;
  const elements = getCleanElements(container);
  
  // Get accent color
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-color')
    .trim() || '#e6b450';
  
  // Draw elements with VS Code styling
  elements.forEach((el) => {
    const y = el.top * scale;
    const h = Math.max(1, el.height * scale);
    
    let color: string;
    let width: number;
    let x: number;
    let alpha: number;
    
    switch (el.type) {
      case 'heading':
        // Headings: bright, prominent blocks
        color = accentColor;
        alpha = 0.7 - (el.level * 0.08);
        width = W * (0.95 - el.level * 0.05);
        x = 2;
        
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, width, Math.max(2, Math.min(h, 4)));
        ctx.globalAlpha = 1;
        break;
        
      case 'code':
        // Code: dense, grouped appearance
        color = 'rgba(78, 201, 176, 0.5)';
        width = W * 0.88;
        x = 4;
        
        ctx.fillStyle = color;
        
        // Draw as dense lines
        const codeLineHeight = 1;
        const codeGap = 0.5;
        const codeLines = Math.floor(h / (codeLineHeight + codeGap));
        
        for (let i = 0; i < codeLines; i++) {
          ctx.globalAlpha = 0.4 + Math.random() * 0.2;
          ctx.fillRect(x, y + i * (codeLineHeight + codeGap), width, codeLineHeight);
        }
        ctx.globalAlpha = 1;
        break;
        
      case 'paragraph':
        // Paragraphs: thin, muted lines
        color = 'rgba(255, 255, 255, 0.25)';
        width = W * 0.85;
        x = 3;
        
        ctx.fillStyle = color;
        
        // Draw as thin lines with natural variation
        const lineHeight = 1.5;
        const gap = 1;
        const lines = Math.floor(h / (lineHeight + gap));
        
        for (let i = 0; i < lines; i++) {
          const lineWidth = i === lines - 1 ? width * 0.6 : width;
          ctx.globalAlpha = 0.3;
          ctx.fillRect(x, y + i * (lineHeight + gap), lineWidth, lineHeight);
        }
        ctx.globalAlpha = 1;
        break;
        
      case 'list':
        // Lists: subtle indented lines
        color = 'rgba(255, 255, 255, 0.2)';
        width = W * 0.75;
        x = 6;
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x, y, width, Math.max(1, h));
        ctx.globalAlpha = 1;
        break;
    }
  });
  
  // Add subtle texture overlay for depth
  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
  for (let i = 0; i < H; i += 2) {
    if (Math.random() > 0.5) {
      ctx.fillRect(0, i, W, 1);
    }
  }
};
