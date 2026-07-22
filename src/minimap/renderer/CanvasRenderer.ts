/**
 * Canvas Renderer
 * Renders the minimap from the compiled layout model
 * Never inspects the DOM - renders purely from structured data
 * Similar to Monaco Editor's glyph rendering
 */

import { LayoutModel, LayoutNode, RenderContext } from '../types/layout';

export interface RendererConfig {
  /**
   * Background color for minimap
   */
  backgroundColor: string;

  /**
   * Default opacity for elements
   */
  defaultOpacity: number;

  /**
   * Minimum visible height in pixels
   */
  minVisibleHeight: number;
}

const DEFAULT_CONFIG: RendererConfig = {
  backgroundColor: 'rgba(0, 0, 0, 0.12)',
  defaultOpacity: 0.7,
  minVisibleHeight: 1,
};

/**
 * Canvas Renderer class
 * Renders layout nodes to canvas without DOM inspection
 */
export class CanvasRenderer {
  private config: RendererConfig;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(config: Partial<RendererConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize canvas context
   */
  private initContext(canvas: HTMLCanvasElement, totalHeight: number = 0): RenderContext {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    this.ctx = ctx;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const scale = rect.height / (canvas.height / dpr);

    return {
      canvas,
      width: rect.width,
      height: rect.height,
      dpr,
      accentColor: this.getAccentColor(),
      scale,
      totalHeight,
    };
  }

  /**
   * Get accent color from CSS variables
   */
  private getAccentColor(): string {
    const computed = getComputedStyle(document.documentElement);
    return computed.getPropertyValue('--accent-color').trim() || '#e6b450';
  }

  /**
   * Clear canvas with background
   */
  private clearCanvas(context: RenderContext): void {
    if (!this.ctx) return;

    const { width, height } = context;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, width, height);
  }

  /**
   * Render a heading node
   */
  private renderHeading(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width, accentColor } = context;
    const level = (node as any).level || 1;

    this.ctx.globalAlpha = 1;

    switch (level) {
      case 1:
        this.ctx.fillStyle = accentColor;
        this.ctx.globalAlpha = 0.85;
        this.ctx.fillRect(2, y, width - 4, Math.max(2.5, h));
        break;

      case 2:
        this.ctx.fillStyle = accentColor;
        this.ctx.globalAlpha = 0.65;
        this.ctx.fillRect(2, y, width - 6, Math.max(2, h));
        break;

      case 3:
      case 4:
      case 5:
      case 6:
        this.ctx.fillStyle = accentColor;
        this.ctx.globalAlpha = 0.45;
        this.ctx.fillRect(4, y, width - 8, Math.max(1.5, h));
        break;
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render a paragraph node
   */
  private renderParagraph(node: LayoutNode, context: RenderContext, y: number, _h: number): void {
    if (!this.ctx) return;

    const { width } = context;
    const lineCount = (node as any).lineCount || 1;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    const lineHeight = 1;
    const gap = 1;

    for (let i = 0; i < lineCount; i++) {
      const isLast = i === lineCount - 1;
      const lineWidth = isLast ? (width - 6) * 0.6 : width - 6;
      this.ctx.fillRect(3, y + i * (lineHeight + gap), lineWidth, lineHeight);
    }
  }

  /**
   * Render a project card node
   */
  private renderProjectCard(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width, accentColor } = context;
    const hasThumbnail = (node as any).hasThumbnail || false;
    const hasDescription = (node as any).hasDescription || false;

    // Draw card outline
    this.ctx.strokeStyle = accentColor;
    this.ctx.globalAlpha = 0.5;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(2, y, width - 4, h);

    // Draw internal structure
    this.ctx.fillStyle = accentColor;
    this.ctx.globalAlpha = 0.3;
    const blockHeight = Math.max(1, h * 0.25);
    this.ctx.fillRect(4, y + 2, width - 4, blockHeight);

    if (hasThumbnail) {
      this.ctx.fillRect(4, y + blockHeight + 3, width - 6, blockHeight * 0.7);
    }

    if (hasDescription) {
      this.ctx.fillRect(4, y + blockHeight * (hasThumbnail ? 2 : 1) + 4, width - 8, blockHeight * 0.5);
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render an experience card node
   */
  private renderExperienceCard(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(150, 200, 150, 0.4)';
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillRect(2, y, width - 4, h);

    this.ctx.fillStyle = 'rgba(150, 200, 150, 0.2)';
    const blockHeight = Math.max(1, h * 0.4);
    this.ctx.fillRect(4, y + 2, width - 4, blockHeight);

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render a certificate card node
   */
  private renderCertificateCard(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(200, 150, 255, 0.4)';
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillRect(2, y, width - 4, h);

    this.ctx.fillStyle = 'rgba(200, 150, 255, 0.3)';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(3, y + 1, width - 2, Math.max(1, h * 0.3));

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render a research card node
   */
  private renderResearchCard(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
    this.ctx.fillRect(2, y, width - 4, h);

    this.ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
    const lineHeight = 2;
    for (let i = 1; i < 3; i++) {
      this.ctx.fillRect(4, y + (h / 3) * i, width - 4, lineHeight);
    }
  }

  /**
   * Render a timeline item node
   */
  private renderTimelineItem(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width, accentColor } = context;

    // Draw timeline dot
    this.ctx.fillStyle = accentColor;
    this.ctx.globalAlpha = 0.7;
    const dotRadius = 2;
    this.ctx.beginPath();
    this.ctx.arc(4 + dotRadius, y + h / 2, dotRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw connecting line
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillRect(4 + dotRadius + 2, y + h / 2 - 0.5, width - 8, 1);

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render an image block node
   */
  private renderImageBlock(node: LayoutNode, context: RenderContext, y: number, _h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    const lineHeight = 1.5;
    for (let i = 0; i < 3; i++) {
      this.ctx.fillRect(2, y + i * (lineHeight + 1), width - 4, lineHeight);
    }
  }

  /**
   * Render a code block node
   */
  private renderCodeBlock(node: LayoutNode, context: RenderContext, y: number, _h: number): void {
    if (!this.ctx) return;

    const { width } = context;
    const lineCount = (node as any).lineCount || 1;

    this.ctx.fillStyle = 'rgba(78, 201, 176, 0.45)';
    const lineHeight = 1;
    const gap = 0.5;

    for (let i = 0; i < Math.min(lineCount, 4); i++) {
      const lineWidth = width * (0.7 + Math.random() * 0.25);
      this.ctx.fillRect(3, y + i * (lineHeight + gap), lineWidth, lineHeight);
    }
  }

  /**
   * Render a list item node
   */
  private renderListItem(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;
    const indentLevel = (node as any).indentLevel || 0;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    const indent = 7 + indentLevel * 8;
    this.ctx.fillRect(indent, y, width - indent - 4, h);
  }

  /**
   * Render a divider node
   */
  private renderDivider(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(2, y + h / 2, width - 4, 1);
  }

  /**
   * Render a map node
   */
  private renderMap(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
    this.ctx.fillRect(2, y, width - 4, h);

    // Draw grid lines to represent map
    this.ctx.strokeStyle = 'rgba(100, 150, 200, 0.1)';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(2, y + (h / 3) * i);
      this.ctx.lineTo(width - 2, y + (h / 3) * i);
      this.ctx.stroke();
    }
  }

  /**
   * Render a terminal node
   */
  private renderTerminal(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;
    const lineCount = (node as any).lineCount || 1;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(2, y, width - 4, h);

    this.ctx.fillStyle = 'rgba(78, 201, 176, 0.4)';
    const lineHeight = 1;
    for (let i = 0; i < Math.min(lineCount, 3); i++) {
      const lineWidth = width * (0.6 + Math.random() * 0.3);
      this.ctx.fillRect(4, y + 4 + i * (lineHeight + 2), lineWidth, lineHeight);
    }
  }

  /**
   * Render a button node
   */
  private renderButton(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width, accentColor } = context;

    this.ctx.fillStyle = accentColor;
    this.ctx.globalAlpha = 0.4;
    
    // Draw pill shape
    const radius = h / 2;
    this.ctx.beginPath();
    this.ctx.roundRect(2, y, width - 4, h, radius);
    this.ctx.fill();

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render a gallery node
   */
  private renderGallery(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;
    const itemCount = (node as any).itemCount || 4;

    this.ctx.fillStyle = 'rgba(200, 200, 200, 0.25)';
    const itemWidth = (width - 8) / Math.min(itemCount, 4);
    const gap = 2;

    for (let i = 0; i < Math.min(itemCount, 4); i++) {
      this.ctx.fillRect(4 + i * (itemWidth + gap), y, itemWidth, h);
    }
  }

  /**
   * Render a statistics node
   */
  private renderStatistics(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;
    const metricCount = (node as any).metricCount || 3;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const barWidth = (width - 8) / metricCount;
    const gap = 2;

    for (let i = 0; i < metricCount; i++) {
      const barHeight = h * (0.4 + Math.random() * 0.4);
      this.ctx.fillRect(4 + i * (barWidth + gap), y + h - barHeight, barWidth, barHeight);
    }
  }

  /**
   * Render a footer node
   */
  private renderFooter(node: LayoutNode, context: RenderContext, y: number, h: number): void {
    if (!this.ctx) return;

    const { width } = context;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(2, y, width - 4, h);
  }

  /**
   * Render a spacer node (no-op)
   */
  private renderSpacer(_node: LayoutNode, _context: RenderContext, _y: number, _h: number): void {
    // Spacer nodes are invisible
  }

  /**
   * Render a single node based on its type
   */
  private renderNode(node: LayoutNode, context: RenderContext): void {
    if (!this.ctx) return;

    const { height, totalHeight } = context;
    const scale = height / totalHeight;

    const y = node.y * scale;
    const h = Math.max(this.config.minVisibleHeight, node.height * scale);

    switch (node.type) {
      case 'heading':
        this.renderHeading(node, context, y, h);
        break;

      case 'paragraph':
        this.renderParagraph(node, context, y, h);
        break;

      case 'project-card':
        this.renderProjectCard(node, context, y, h);
        break;

      case 'experience-card':
        this.renderExperienceCard(node, context, y, h);
        break;

      case 'certificate-card':
        this.renderCertificateCard(node, context, y, h);
        break;

      case 'research-card':
        this.renderResearchCard(node, context, y, h);
        break;

      case 'timeline-item':
        this.renderTimelineItem(node, context, y, h);
        break;

      case 'image-block':
        this.renderImageBlock(node, context, y, h);
        break;

      case 'code-block':
        this.renderCodeBlock(node, context, y, h);
        break;

      case 'list-item':
        this.renderListItem(node, context, y, h);
        break;

      case 'divider':
        this.renderDivider(node, context, y, h);
        break;

      case 'map':
        this.renderMap(node, context, y, h);
        break;

      case 'terminal':
        this.renderTerminal(node, context, y, h);
        break;

      case 'button':
        this.renderButton(node, context, y, h);
        break;

      case 'gallery':
        this.renderGallery(node, context, y, h);
        break;

      case 'statistics':
        this.renderStatistics(node, context, y, h);
        break;

      case 'footer':
        this.renderFooter(node, context, y, h);
        break;

      case 'spacer':
        this.renderSpacer(node, context, y, h);
        break;

      case 'section':
      case 'markdown':
        // Container nodes - render children instead
        if (node.children) {
          node.children.forEach(child => this.renderNode(child, context));
        }
        break;

      default:
        // Unknown node type - skip
        break;
    }
  }

  /**
   * Render the entire layout model to canvas
   */
  render(canvas: HTMLCanvasElement, model: LayoutModel): void {
    const context = this.initContext(canvas, model.totalHeight);

    this.clearCanvas(context);

    if (model.totalHeight === 0) return;

    // Render all nodes
    model.nodes.forEach(node => this.renderNode(node, context));
  }

  /**
   * Re-render with new accent color (theme change)
   */
  rerender(canvas: HTMLCanvasElement, model: LayoutModel): void {
    this.render(canvas, model);
  }
}

/**
 * Factory function to create a CanvasRenderer
 */
export function createCanvasRenderer(config?: Partial<RendererConfig>): CanvasRenderer {
  return new CanvasRenderer(config);
}

/**
 * Convenience function to render in one call
 */
export function renderMinimap(
  canvas: HTMLCanvasElement,
  model: LayoutModel,
  config?: Partial<RendererConfig>
): void {
  const renderer = new CanvasRenderer(config);
  renderer.render(canvas, model);
}
