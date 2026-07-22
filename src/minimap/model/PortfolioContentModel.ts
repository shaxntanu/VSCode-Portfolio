/**
 * Portfolio Content Model
 * Interface that pages implement to expose structured content descriptions
 * This is the source of truth for both page and minimap renderers
 */

import { LayoutNode } from '../types/layout';

export interface PortfolioContent {
  /**
   * Unique identifier for this content
   */
  id: string;

  /**
   * Page route/path
   */
  route: string;

  /**
   * Structured layout nodes describing the page content
   * These nodes contain metadata only, not DOM elements or HTML
   */
  nodes: LayoutNode[];

  /**
   * Version of the content model format
   * Used for migration and compatibility
   */
  version: string;

  /**
   * Timestamp when this content was last updated
   */
  updatedAt: number;
}

/**
 * Builder class for creating PortfolioContent instances
 * Provides a fluent API for constructing content models
 */
export class PortfolioContentBuilder {
  private id: string;
  private route: string;
  private nodes: LayoutNode[] = [];
  private version: string = '1.0.0';

  constructor(route: string) {
    this.route = route;
    this.id = `${route}-${Date.now()}`;
  }

  /**
   * Set the content version
   */
  withVersion(version: string): this {
    this.version = version;
    return this;
  }

  /**
   * Add a layout node
   */
  addNode(node: LayoutNode): this {
    this.nodes.push(node);
    return this;
  }

  /**
   * Add multiple layout nodes
   */
  addNodes(nodes: LayoutNode[]): this {
    this.nodes.push(...nodes);
    return this;
  }

  /**
   * Build the final PortfolioContent
   */
  build(): PortfolioContent {
    return {
      id: this.id,
      route: this.route,
      nodes: this.nodes,
      version: this.version,
      updatedAt: Date.now(),
    };
  }
}

/**
 * Factory function to create a PortfolioContentBuilder
 */
export function createPortfolioContent(route: string): PortfolioContentBuilder {
  return new PortfolioContentBuilder(route);
}

/**
 * Validate a PortfolioContent instance
 * Ensures the content model is well-formed
 */
export function validatePortfolioContent(content: PortfolioContent): boolean {
  if (!content.id || !content.route) {
    return false;
  }

  if (!Array.isArray(content.nodes)) {
    return false;
  }

  if (!content.version) {
    return false;
  }

  if (typeof content.updatedAt !== 'number' || content.updatedAt <= 0) {
    return false;
  }

  // Validate each node has required fields
  for (const node of content.nodes) {
    if (!node.type || !node.id) {
      return false;
    }
    if (typeof node.x !== 'number' || typeof node.y !== 'number') {
      return false;
    }
    if (typeof node.width !== 'number' || typeof node.height !== 'number') {
      return false;
    }
    if (typeof node.importance !== 'number' || node.importance < 0 || node.importance > 1) {
      return false;
    }
  }

  return true;
}
