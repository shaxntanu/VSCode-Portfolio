/**
 * Layout Compiler
 * Transforms PortfolioContent into absolute layout coordinates
 * Similar to a browser layout engine - calculates x, y, width, height for all nodes
 */

import { LayoutNode, LayoutModel, BaseNode } from '../types/layout';
import { PortfolioContent } from '../model/PortfolioContentModel';

export interface CompilerConfig {
  /**
   * Base width for layout calculations
   */
  baseWidth: number;

  /**
   * Default line height for text
   */
  lineHeight: number;

  /**
   * Vertical spacing between elements
   */
  verticalSpacing: number;

  /**
   * Horizontal padding/margin
   */
  horizontalPadding: number;
}

const DEFAULT_CONFIG: CompilerConfig = {
  baseWidth: 700,
  lineHeight: 24,
  verticalSpacing: 16,
  horizontalPadding: 20,
};

/**
 * Layout Compiler class
 * Compiles structured content into absolute layout coordinates
 */
export class LayoutCompiler {
  private config: CompilerConfig;
  private currentY: number = 0;
  private nodeIdCounter: number = 0;

  constructor(config: Partial<CompilerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Reset compiler state
   */
  private reset(): void {
    this.currentY = 0;
    this.nodeIdCounter = 0;
  }

  /**
   * Generate unique node ID
   */
  private generateId(): string {
    return `node-${this.nodeIdCounter++}`;
  }

  /**
   * Calculate height for a heading based on level
   */
  private calculateHeadingHeight(level: number): number {
    const heights = { 1: 48, 2: 40, 3: 32, 4: 28, 5: 24, 6: 20 };
    return heights[level as keyof typeof heights] || 24;
  }

  /**
   * Calculate height for a paragraph based on line count
   */
  private calculateParagraphHeight(lineCount: number): number {
    return lineCount * this.config.lineHeight + (lineCount - 1) * 4;
  }

  /**
   * Calculate height for a card
   */
  private calculateCardHeight(hasThumbnail: boolean, hasDescription: boolean): number {
    let height = 60; // Base height for title
    if (hasThumbnail) height += 120;
    if (hasDescription) height += 80;
    return height;
  }

  /**
   * Compile a single node with layout coordinates
   */
  private compileNode(node: LayoutNode): LayoutNode {
    const baseNode: BaseNode = {
      ...node,
      id: node.id || this.generateId(),
      x: this.config.horizontalPadding,
      y: this.currentY,
      width: this.config.baseWidth - this.config.horizontalPadding * 2,
      importance: node.importance ?? 0.5,
    };

    // Calculate height based on node type
    switch (node.type) {
      case 'heading': {
        const headingNode = node as any;
        baseNode.height = this.calculateHeadingHeight(headingNode.level || 1);
        break;
      }

      case 'paragraph': {
        const paragraphNode = node as any;
        baseNode.height = this.calculateParagraphHeight(paragraphNode.lineCount || 1);
        break;
      }

      case 'project-card': {
        const cardNode = node as any;
        baseNode.height = this.calculateCardHeight(
          cardNode.hasThumbnail || false,
          cardNode.hasDescription || false
        );
        break;
      }

      case 'experience-card':
      case 'certificate-card':
      case 'research-card': {
        baseNode.height = 100;
        break;
      }

      case 'timeline-item': {
        baseNode.height = 80;
        break;
      }

      case 'image-block': {
        const imageNode = node as any;
        baseNode.height = 200 * (imageNode.aspectRatio || 1);
        break;
      }

      case 'code-block': {
        const codeNode = node as any;
        baseNode.height = Math.max(60, (codeNode.lineCount || 1) * 16);
        break;
      }

      case 'list-item': {
        baseNode.height = this.config.lineHeight;
        break;
      }

      case 'divider': {
        baseNode.height = 20;
        break;
      }

      case 'map': {
        baseNode.height = 300;
        break;
      }

      case 'terminal': {
        const terminalNode = node as any;
        baseNode.height = Math.max(100, (terminalNode.lineCount || 1) * 14);
        break;
      }

      case 'button': {
        baseNode.height = 40;
        break;
      }

      case 'gallery': {
        baseNode.height = 250;
        break;
      }

      case 'statistics': {
        baseNode.height = 150;
        break;
      }

      case 'footer': {
        baseNode.height = 60;
        break;
      }

      case 'spacer': {
        baseNode.height = this.config.verticalSpacing;
        break;
      }

      case 'section':
      case 'markdown':
      default: {
        // For container nodes, height will be calculated from children
        baseNode.height = 0;
        break;
      }
    }

    // Compile children recursively
    if (node.children && node.children.length > 0) {
      const compiledChildren = node.children.map(child => this.compileNode(child));
      baseNode.children = compiledChildren;

      // Calculate container height from children
      if (node.type === 'section' || node.type === 'markdown') {
        const lastChild = compiledChildren[compiledChildren.length - 1];
        const firstChild = compiledChildren[0];
        if (lastChild && firstChild) {
          baseNode.height = lastChild.y + lastChild.height - firstChild.y + this.config.verticalSpacing;
        }
      }
    }

    // Advance Y position
    this.currentY += baseNode.height + this.config.verticalSpacing;

    return baseNode as LayoutNode;
  }

  /**
   * Compile PortfolioContent into LayoutModel
   */
  compile(content: PortfolioContent, config?: Partial<CompilerConfig>): LayoutModel {
    // Update config if provided
    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.reset();

    // Compile all nodes
    const compiledNodes = content.nodes.map(node => this.compileNode(node));

    // Calculate total dimensions
    const totalHeight = this.currentY;
    const totalWidth = this.config.baseWidth;

    return {
      nodes: compiledNodes,
      totalHeight,
      totalWidth,
      generatedAt: Date.now(),
      version: content.version,
    };
  }

  /**
   * Recompile layout with new config
   */
  recompile(layout: LayoutModel): LayoutModel {
    // This would require storing the original content
    // For now, return the layout as-is
    return layout;
  }
}

/**
 * Factory function to create a LayoutCompiler
 */
export function createLayoutCompiler(config?: Partial<CompilerConfig>): LayoutCompiler {
  return new LayoutCompiler(config);
}

/**
 * Convenience function to compile content in one call
 */
export function compileLayout(
  content: PortfolioContent,
  config?: Partial<CompilerConfig>
): LayoutModel {
  const compiler = new LayoutCompiler(config);
  return compiler.compile(content);
}
