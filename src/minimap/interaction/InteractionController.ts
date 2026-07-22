/**
 * Interaction Controller
 * Handles user interactions with the minimap
 * Click to scroll, drag viewport, hover states
 * No rendering code - pure interaction logic
 */

import { ViewportMetrics } from '../types/layout';

export interface InteractionConfig {
  /**
   * Container element ID for the main content
   */
  contentContainerId: string;

  /**
   * Smooth scroll behavior
   */
  smoothScroll: boolean;

  /**
   * Scroll behavior
   */
  scrollBehavior: 'auto' | 'smooth';
}

const DEFAULT_CONFIG: InteractionConfig = {
  contentContainerId: 'main-editor',
  smoothScroll: true,
  scrollBehavior: 'smooth',
};

export type InteractionEventType = 'click' | 'drag-start' | 'drag-move' | 'drag-end' | 'hover';

export interface InteractionEvent {
  type: InteractionEventType;
  target: HTMLElement;
  clientY: number;
  timestamp: number;
}

export type InteractionCallback = (event: InteractionEvent) => void;

/**
 * Interaction Controller class
 * Manages minimap interactions without rendering
 */
export class InteractionController {
  private config: InteractionConfig;
  private isDragging: boolean = false;
  private callbacks: Map<InteractionEventType, Set<InteractionCallback>> = new Map();
  private contentElement: HTMLElement | null = null;

  constructor(config: Partial<InteractionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.contentElement = document.getElementById(this.config.contentContainerId);
  }

  /**
   * Get content element
   */
  private getContentElement(): HTMLElement | null {
    if (!this.contentElement) {
      this.contentElement = document.getElementById(this.config.contentContainerId);
    }
    return this.contentElement;
  }

  /**
   * Register event callback
   */
  on(eventType: InteractionEventType, callback: InteractionCallback): void {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, new Set());
    }
    this.callbacks.get(eventType)!.add(callback);
  }

  /**
   * Unregister event callback
   */
  off(eventType: InteractionEventType, callback: InteractionCallback): void {
    const callbacks = this.callbacks.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit event to all registered callbacks
   */
  private emit(event: InteractionEvent): void {
    const callbacks = this.callbacks.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  /**
   * Handle minimap click - scroll to position
   */
  handleClick(container: HTMLElement, clientY: number): void {
    if (this.isDragging) return;

    const content = this.getContentElement();
    if (!content) return;

    const rect = container.getBoundingClientRect();
    const clickY = clientY - rect.top;
    const clickPct = clickY / rect.height;

    const maxScroll = content.scrollHeight - content.clientHeight;
    const targetScroll = clickPct * maxScroll;

    content.scrollTo({
      top: Math.max(0, Math.min(targetScroll, maxScroll)),
      behavior: this.config.scrollBehavior,
    });

    this.emit({
      type: 'click',
      target: container,
      clientY,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle viewport drag start
   */
  handleDragStart(): void {
    this.isDragging = true;
    this.emit({
      type: 'drag-start',
      target: document.body,
      clientY: 0,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle viewport drag move
   */
  handleDragMove(container: HTMLElement, clientY: number): void {
    if (!this.isDragging) return;

    const content = this.getContentElement();
    if (!content) return;

    const rect = container.getBoundingClientRect();
    const moveY = clientY - rect.top;
    const movePct = moveY / rect.height;

    const maxScroll = content.scrollHeight - content.clientHeight;
    const targetScroll = movePct * maxScroll;

    content.scrollTop = Math.max(0, Math.min(targetScroll, maxScroll));

    this.emit({
      type: 'drag-move',
      target: container,
      clientY,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle viewport drag end
   */
  handleDragEnd(): void {
    this.isDragging = false;
    this.emit({
      type: 'drag-end',
      target: document.body,
      clientY: 0,
      timestamp: Date.now(),
    });
  }

  /**
   * Calculate viewport metrics from scroll state
   */
  calculateViewportMetrics(): ViewportMetrics {
    const content = this.getContentElement();
    if (!content) {
      return { top: 0, height: 20 };
    }

    const { scrollTop, scrollHeight, clientHeight } = content;

    if (scrollHeight <= clientHeight) {
      return { top: 0, height: 100 };
    }

    const viewportH = (clientHeight / scrollHeight) * 100;
    const maxScroll = scrollHeight - clientHeight;
    const scrollRatio = scrollTop / maxScroll;
    const viewportTop = scrollRatio * (100 - viewportH);

    return {
      top: Math.max(0, Math.min(viewportTop, 100 - viewportH)),
      height: Math.min(viewportH, 100),
    };
  }

  /**
   * Scroll to specific percentage of document
   */
  scrollToPercentage(percent: number): void {
    const content = this.getContentElement();
    if (!content) return;

    const maxScroll = content.scrollHeight - content.clientHeight;
    const targetScroll = (percent / 100) * maxScroll;

    content.scrollTo({
      top: Math.max(0, Math.min(targetScroll, maxScroll)),
      behavior: this.config.scrollBehavior,
    });
  }

  /**
   * Check if currently dragging
   */
  getIsDragging(): boolean {
    return this.isDragging;
  }

  /**
   * Set content container ID
   */
  setContentContainerId(id: string): void {
    this.config.contentContainerId = id;
    this.contentElement = document.getElementById(id);
  }

  /**
   * Destroy controller and clean up
   */
  destroy(): void {
    this.callbacks.clear();
    this.contentElement = null;
    this.isDragging = false;
  }
}

/**
 * Factory function to create an InteractionController
 */
export function createInteractionController(config?: Partial<InteractionConfig>): InteractionController {
  return new InteractionController(config);
}
