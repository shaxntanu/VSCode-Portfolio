/**
 * Minimap Content Analyzer - VS Code Architecture
 * Separates content analysis from rendering for performance
 */

export type LineType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'paragraph'
  | 'code'
  | 'list-item'
  | 'blank'
  | 'card-title'
  | 'card-body';

export interface MinimapLine {
  y: number;
  height: number;
  type: LineType;
  indentLevel: number;
  density: number;
}

export interface LineModel {
  lines: MinimapLine[];
  totalHeight: number;
  generatedAt: number;
}

const SKIP_SELECTORS = [
  'nav',
  'footer',
  'script',
  'style',
  'canvas',
  '.minimap',
  '.tabs',
  '.sidebar',
  '.bottomBar',
  '.titlebar',
  '.breadcrumbs',
];

const getIndentLevel = (element: Element): number => {
  let level = 0;
  let parent = element.parentElement;

  while (parent && parent !== document.body) {
    if (
      parent.tagName === 'UL' ||
      parent.tagName === 'OL' ||
      parent.tagName === 'LI' ||
      parent.classList.contains('nested') ||
      parent.classList.contains('indent')
    ) {
      level++;
    }
    parent = parent.parentElement;
  }

  return Math.min(level, 3);
};

const calculateDensity = (
  element: Element,
  rect: DOMRect
): number => {
  const text = element.textContent?.trim() || '';
  const area = rect.width * rect.height;
  if (area === 0) return 0;

  const density = text.length / (area / 100);
  return Math.max(0, Math.min(1, density));
};

const shouldSkipElement = (element: Element): boolean => {
  for (const selector of SKIP_SELECTORS) {
    if (selector.startsWith('.')) {
      if (element.classList.contains(selector.slice(1))) return true;
    } else if (element.tagName.toLowerCase() === selector) {
      return true;
    }
  }

  const style = window.getComputedStyle(element);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return true;
  }

  return false;
};

const getLineType = (element: Element): LineType | null => {
  const tag = element.tagName.toLowerCase();
  const isCard = element.closest('[class*="card"]') !== null;

  if (tag === 'h1') return 'h1';
  if (tag === 'h2') return 'h2';
  if (tag === 'h3') {
    if (isCard) return 'card-title';
    return 'h3';
  }
  if (tag === 'h4' || tag === 'h5' || tag === 'h6') return 'h4';
  if (tag === 'p') {
    if (isCard) return 'card-body';
    return 'paragraph';
  }
  if (tag === 'pre' || tag === 'code') return 'code';
  if (tag === 'li') return 'list-item';

  return null;
};

const splitIntoVisualLines = (
  rect: DOMRect,
  lineType: LineType,
  y: number,
  indentLevel: number,
  density: number
): MinimapLine[] => {
  const style = window.getComputedStyle(
    document.elementFromPoint(rect.left + 1, rect.top + 1) || document.body
  );
  const computedLineHeight = parseFloat(style.lineHeight);
  const lineHeight = isNaN(computedLineHeight) ? 20 : computedLineHeight;

  if (rect.height <= lineHeight * 1.5) {
    return [
      {
        y,
        height: rect.height,
        type: lineType,
        indentLevel,
        density,
      },
    ];
  }

  const lines: MinimapLine[] = [];
  const numLines = Math.floor(rect.height / lineHeight);

  for (let i = 0; i < numLines; i++) {
    lines.push({
      y: y + i * lineHeight,
      height: lineHeight,
      type: lineType,
      indentLevel,
      density,
    });
  }

  return lines;
};

export function analyzeContent(container: HTMLElement): LineModel {
  const lines: MinimapLine[] = [];
  const containerRect = container.getBoundingClientRect();

  const elements = container.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, p, pre, code, li'
  );

  elements.forEach((element) => {
    if (shouldSkipElement(element)) return;

    const lineType = getLineType(element);
    if (!lineType) return;

    const rect = element.getBoundingClientRect();
    if (rect.height < 2 || rect.width < 2) return;

    const y = rect.top - containerRect.top + container.scrollTop;
    const indentLevel = getIndentLevel(element);
    const density = calculateDensity(element, rect);

    if (lineType === 'paragraph' || lineType === 'card-body') {
      const visualLines = splitIntoVisualLines(
        rect,
        lineType,
        y,
        indentLevel,
        density
      );
      lines.push(...visualLines);
    } else {
      lines.push({
        y,
        height: rect.height,
        type: lineType,
        indentLevel,
        density,
      });
    }
  });

  lines.sort((a, b) => a.y - b.y);

  return {
    lines,
    totalHeight: container.scrollHeight,
    generatedAt: Date.now(),
  };
}

export function renderMinimap(
  canvas: HTMLCanvasElement,
  model: LineModel,
  accentColor: string
): void {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.fillRect(0, 0, W, H);

  if (model.totalHeight === 0) return;

  const scale = H / model.totalHeight;

  model.lines.forEach((line) => {
    const y = line.y * scale;
    const h = Math.max(1, line.height * scale);

    ctx.globalAlpha = 1;

    switch (line.type) {
      case 'h1':
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(2, y, W - 4, Math.max(2.5, h));
        break;

      case 'h2':
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.65;
        ctx.fillRect(2, y, W - 6, Math.max(2, h));
        break;

      case 'h3':
      case 'h4':
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.45;
        ctx.fillRect(4, y, W - 8, Math.max(1.5, h));
        break;

      case 'paragraph': {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        const lineHeight = 1;
        const gap = 1;
        const numSubLines = Math.max(1, Math.floor(h / (lineHeight + gap)));

        for (let i = 0; i < numSubLines; i++) {
          const isLast = i === numSubLines - 1;
          const width = isLast ? (W - 6) * 0.6 : W - 6;
          ctx.fillRect(3, y + i * (lineHeight + gap), width, lineHeight);
        }
        break;
      }

      case 'code': {
        ctx.fillStyle = 'rgba(78, 201, 176, 0.45)';
        const lineHeight = 1;
        const gap = 0.5;
        const numSubLines = Math.max(1, Math.floor(h / (lineHeight + gap)));

        for (let i = 0; i < numSubLines; i++) {
          const width = W * (0.7 + Math.random() * 0.25);
          ctx.fillRect(3, y + i * (lineHeight + gap), width, lineHeight);
        }
        break;
      }

      case 'list-item': {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        const lineHeight = 1;
        const gap = 1;
        const numSubLines = Math.max(1, Math.floor(h / (lineHeight + gap)));

        for (let i = 0; i < numSubLines; i++) {
          ctx.fillRect(7, y + i * (lineHeight + gap), W - 10, lineHeight);
        }
        break;
      }

      case 'card-title':
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(3, y, W * 0.7, Math.max(1.5, h));
        break;

      case 'card-body': {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        const lineHeight = 1;
        const gap = 1;
        const numSubLines = Math.max(1, Math.floor(h / (lineHeight + gap)));

        for (let i = 0; i < numSubLines; i++) {
          const isLast = i === numSubLines - 1;
          const width = isLast ? (W - 6) * 0.6 : W - 6;
          ctx.fillRect(3, y + i * (lineHeight + gap), width, lineHeight);
        }
        break;
      }

      case 'blank':
        break;
    }

    ctx.globalAlpha = 1;
  });
}
