/**
 * Viewport Renderer
 * Handles rendering the viewport rectangle on the minimap
 * The viewport shows the current scroll position in the document
 */

import { ViewportMetrics } from '../types/layout';

export interface ViewportConfig {
  /**
   * Background color of viewport
   */
  backgroundColor: string;

  /**
   * Border color of viewport
   */
  borderColor: string;

  /**
   * Border width in pixels
   */
  borderWidth: number;

  /**
   * Corner radius in pixels
   */
  borderRadius: number;

  /**
   * Minimum viewport height in pixels
   */
  minHeight: number;
}

const DEFAULT_CONFIG: ViewportConfig = {
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  borderColor: 'rgba(255, 255, 255, 0.12)',
  borderWidth: 1,
  borderRadius: 2,
  minHeight: 20,
};

/**
 * Viewport Renderer class
 * Renders the viewport indicator rectangle
 */
export class ViewportRenderer {
  private config: ViewportConfig;
  private element: HTMLElement | null = null;

  constructor(config: Partial<ViewportConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize viewport element
   */
  init(container: HTMLElement): HTMLElement {
    const viewport = document.createElement('div');
    viewport.className = 'minimap-viewport';
    viewport.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      min-height: ${this.config.minHeight}px;
      background: ${this.config.backgroundColor};
      border: ${this.config.borderWidth}px solid ${this.config.borderColor};
      border-radius: ${this.config.borderRadius}px;
      pointer-events: auto;
      cursor: grab;
      transition: top 0.05s ease-out, background 0.15s ease;
      user-select: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    `;

    // Add hover effect
    viewport.addEventListener('mouseenter', () => {
      viewport.style.background = 'rgba(255, 255, 255, 0.08)';
      viewport.style.borderColor = 'rgba(255, 255, 255, 0.18)';
    });

    viewport.addEventListener('mouseleave', () => {
      viewport.style.background = this.config.backgroundColor;
      viewport.style.borderColor = this.config.borderColor;
    });

    container.appendChild(viewport);
    this.element = viewport;

    return viewport;
  }

  /**
   * Update viewport position and size
   */
  update(metrics: ViewportMetrics): void {
    if (!this.element) return;

    this.element.style.top = `${metrics.top}%`;
    this.element.style.height = `${Math.max(this.config.minHeight, metrics.height)}%`;
  }

  /**
   * Set dragging state
   */
  setDragging(isDragging: boolean): void {
    if (!this.element) return;

    if (isDragging) {
      this.element.style.cursor = 'grabbing';
      this.element.style.background = 'rgba(255, 255, 255, 0.1)';
      this.element.style.borderColor = 'rgba(255, 255, 255, 0.22)';
      this.element.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.3)';
      this.element.classList.add('dragging');
    } else {
      this.element.style.cursor = 'grab';
      this.element.style.background = this.config.backgroundColor;
      this.element.style.borderColor = this.config.borderColor;
      this.element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      this.element.classList.remove('dragging');
    }
  }

  /**
   * Get viewport element
   */
  getElement(): HTMLElement | null {
    return this.element;
  }

  /**
   * Destroy viewport element
   */
  destroy(): void {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    this.element = null;
  }
}

/**
 * Factory function to create a ViewportRenderer
 */
export function createViewportRenderer(config?: Partial<ViewportConfig>): ViewportRenderer {
  return new ViewportRenderer(config);
}
