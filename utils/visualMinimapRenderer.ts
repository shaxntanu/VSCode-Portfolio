/**
 * Visual Minimap Renderer
 * Creates a miniature visual representation of page structure
 * Renders cards, sections, images, and layout blocks
 */

export type MinimapElementType =
  | 'project-card'
  | 'research-card'
  | 'section-header'
  | 'timeline-item'
  | 'certificate-card'
  | 'experience-block'
  | 'image-block'
  | 'code-block'
  | 'spacer';

export interface MinimapElement {
  type: MinimapElementType;
  y: number;
  height: number;
  width: number;
  color?: string;
  intensity?: number;
}

export interface VisualPageModel {
  elements: MinimapElement[];
  totalHeight: number;
  pageWidth: number;
  generatedAt: number;
}

const ELEMENT_SELECTORS = {
  'project-card': '[class*="card"]',
  'research-card': '[class*="research"], [class*="paper"]',
  'section-header': 'h1, h2, h3',
  'timeline-item': '[class*="timeline"], [class*="commit"]',
  'certificate-card': '[class*="certificate"], [class*="cert"]',
  'experience-block': '[class*="experience"], [class*="job"]',
  'image-block': 'img',
  'code-block': 'pre, code',
};

const shouldSkipElement = (element: Element): boolean => {
  const skipClasses = [
    'minimap',
    'tabs',
    'sidebar',
    'bottomBar',
    'titlebar',
    'breadcrumbs',
    'viewport',
    'canvas',
  ];

  for (const cls of skipClasses) {
    if (element.classList.contains(cls)) return true;
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

const detectElementType = (element: Element): MinimapElementType | null => {
  const tag = element.tagName.toLowerCase();
  const classList = element.className;

  if (
    classList.includes('card') ||
    classList.includes('project') ||
    classList.includes('repo')
  ) {
    return 'project-card';
  }

  if (
    classList.includes('research') ||
    classList.includes('paper') ||
    classList.includes('publication')
  ) {
    return 'research-card';
  }

  if (['h1', 'h2', 'h3'].includes(tag)) {
    return 'section-header';
  }

  if (
    classList.includes('timeline') ||
    classList.includes('commit') ||
    classList.includes('milestone')
  ) {
    return 'timeline-item';
  }

  if (
    classList.includes('certificate') ||
    classList.includes('cert') ||
    classList.includes('badge')
  ) {
    return 'certificate-card';
  }

  if (
    classList.includes('experience') ||
    classList.includes('job') ||
    classList.includes('position')
  ) {
    return 'experience-block';
  }

  if (tag === 'img') {
    return 'image-block';
  }

  if (tag === 'pre' || tag === 'code') {
    return 'code-block';
  }

  return null;
};

export function analyzeVisualPage(container: HTMLElement): VisualPageModel {
  const elements: MinimapElement[] = [];
  const containerRect = container.getBoundingClientRect();

  // Query all potentially interesting elements
  const allElements = container.querySelectorAll(
    '[class*="card"], h1, h2, h3, img, pre, code, [class*="timeline"], [class*="experience"], [class*="certificate"]'
  );

  allElements.forEach((element) => {
    if (shouldSkipElement(element)) return;

    const type = detectElementType(element);
    if (!type) return;

    const rect = element.getBoundingClientRect();
    if (rect.height < 4 || rect.width < 4) return;

    const y = rect.top - containerRect.top + container.scrollTop;

    elements.push({
      type,
      y,
      height: rect.height,
      width: rect.width,
    });
  });

  elements.sort((a, b) => a.y - b.y);

  return {
    elements,
    totalHeight: container.scrollHeight,
    pageWidth: containerRect.width,
    generatedAt: Date.now(),
  };
}

export function renderVisualMinimap(
  canvas: HTMLCanvasElement,
  model: VisualPageModel,
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

  // Background
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.fillRect(0, 0, W, H);

  if (model.totalHeight === 0) return;

  const scale = H / model.totalHeight;
  const miniWidth = W - 4;

  model.elements.forEach((element) => {
    const y = element.y * scale;
    const h = Math.max(1, element.height * scale);
    const w = (element.width / model.pageWidth) * miniWidth;

    ctx.globalAlpha = 1;

    switch (element.type) {
      case 'section-header':
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(2, y, miniWidth, Math.max(2, h));
        break;

      case 'project-card': {
        // Draw card outline with accent color
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.strokeRect(2, y, miniWidth, h);

        // Draw internal structure
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.3;
        const blockHeight = Math.max(1, h * 0.25);
        ctx.fillRect(4, y + 2, miniWidth - 4, blockHeight);
        ctx.fillRect(4, y + blockHeight + 3, miniWidth - 6, blockHeight * 0.7);
        ctx.fillRect(4, y + blockHeight * 2 + 4, miniWidth - 8, blockHeight * 0.5);
        break;
      }

      case 'research-card': {
        ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
        ctx.fillRect(2, y, miniWidth, h);

        ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
        const lineHeight = 2;
        for (let i = 1; i < 3; i++) {
          ctx.fillRect(4, y + (h / 3) * i, miniWidth - 4, lineHeight);
        }
        break;
      }

      case 'timeline-item': {
        // Draw timeline dot and line
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.7;
        const dotRadius = 2;
        ctx.beginPath();
        ctx.arc(4 + dotRadius, y + h / 2, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting line
        ctx.globalAlpha = 0.3;
        ctx.fillRect(4 + dotRadius + 2, y + h / 2 - 0.5, miniWidth - 8, 1);
        break;
      }

      case 'certificate-card': {
        ctx.fillStyle = 'rgba(200, 150, 255, 0.4)';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(2, y, miniWidth, h);

        ctx.fillStyle = 'rgba(200, 150, 255, 0.3)';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(3, y + 1, miniWidth - 2, Math.max(1, h * 0.3));
        break;
      }

      case 'experience-block': {
        ctx.fillStyle = 'rgba(150, 200, 150, 0.4)';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(2, y, miniWidth, h);

        ctx.fillStyle = 'rgba(150, 200, 150, 0.2)';
        const blockHeight = Math.max(1, h * 0.4);
        ctx.fillRect(4, y + 2, miniWidth - 4, blockHeight);
        break;
      }

      case 'image-block': {
        // Stacked lines to represent image
        ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        const lineHeight = 1.5;
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(2, y + i * (lineHeight + 1), miniWidth, lineHeight);
        }
        break;
      }

      case 'code-block': {
        ctx.fillStyle = 'rgba(78, 201, 176, 0.3)';
        const lineHeight = 1;
        const gap = 0.5;
        const numLines = Math.max(1, Math.floor(h / (lineHeight + gap)));

        for (let i = 0; i < Math.min(numLines, 4); i++) {
          const lineW = W * (0.5 + Math.random() * 0.3);
          ctx.fillRect(3, y + i * (lineHeight + gap), lineW, lineHeight);
        }
        break;
      }

      case 'spacer':
        break;
    }

    ctx.globalAlpha = 1;
  });
}
