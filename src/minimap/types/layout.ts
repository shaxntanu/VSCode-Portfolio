/**
 * Layout Types for VS Code-Style Minimap
 * Defines the structure of content nodes that both page and minimap renderers consume
 */

export type NodeType =
  | 'heading'
  | 'paragraph'
  | 'section'
  | 'project-card'
  | 'experience-card'
  | 'certificate-card'
  | 'research-card'
  | 'timeline-item'
  | 'image-block'
  | 'code-block'
  | 'markdown'
  | 'list-item'
  | 'divider'
  | 'map'
  | 'terminal'
  | 'button'
  | 'gallery'
  | 'statistics'
  | 'footer'
  | 'spacer';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface BaseNode {
  type: NodeType;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  importance: number; // 0-1, affects rendering prominence
  style?: NodeStyle;
  children?: LayoutNode[];
}

export interface NodeStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  opacity?: number;
  fontWeight?: 'normal' | 'bold';
}

export interface HeadingNode extends BaseNode {
  type: 'heading';
  level: HeadingLevel;
  text: string;
}

export interface ParagraphNode extends BaseNode {
  type: 'paragraph';
  lineCount: number;
  hasLinks: boolean;
}

export interface SectionNode extends BaseNode {
  type: 'section';
  title: string;
  children: LayoutNode[];
}

export interface ProjectCardNode extends BaseNode {
  type: 'project-card';
  title: string;
  hasThumbnail: boolean;
  hasDescription: boolean;
  techStackCount: number;
}

export interface ExperienceCardNode extends BaseNode {
  type: 'experience-card';
  title: string;
  company: string;
  timeline: string;
  hasDetails: boolean;
}

export interface CertificateCardNode extends BaseNode {
  type: 'certificate-card';
  title: string;
  issuer: string;
  date: string;
}

export interface ResearchCardNode extends BaseNode {
  type: 'research-card';
  title: string;
  authors: string;
  venue: string;
}

export interface TimelineItemNode extends BaseNode {
  type: 'timeline-item';
  title: string;
  date: string;
  hasDescription: boolean;
}

export interface ImageBlockNode extends BaseNode {
  type: 'image-block';
  aspectRatio: number;
  hasCaption: boolean;
}

export interface CodeBlockNode extends BaseNode {
  type: 'code-block';
  language: string;
  lineCount: number;
}

export interface MarkdownNode extends BaseNode {
  type: 'markdown';
  content: string;
}

export interface ListItemNode extends BaseNode {
  type: 'list-item';
  indentLevel: number;
  hasSubItems: boolean;
}

export interface DividerNode extends BaseNode {
  type: 'divider';
  thickness: number;
}

export interface MapNode extends BaseNode {
  type: 'map';
  aspectRatio: number;
}

export interface TerminalNode extends BaseNode {
  type: 'terminal';
  lineCount: number;
}

export interface ButtonNode extends BaseNode {
  type: 'button';
  label: string;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface GalleryNode extends BaseNode {
  type: 'gallery';
  itemCount: number;
  layout: 'grid' | 'masonry';
}

export interface StatisticsNode extends BaseNode {
  type: 'statistics';
  metricCount: number;
}

export interface FooterNode extends BaseNode {
  type: 'footer';
  content: string;
}

export interface SpacerNode extends BaseNode {
  type: 'spacer';
}

export type LayoutNode =
  | HeadingNode
  | ParagraphNode
  | SectionNode
  | ProjectCardNode
  | ExperienceCardNode
  | CertificateCardNode
  | ResearchCardNode
  | TimelineItemNode
  | ImageBlockNode
  | CodeBlockNode
  | MarkdownNode
  | ListItemNode
  | DividerNode
  | MapNode
  | TerminalNode
  | ButtonNode
  | GalleryNode
  | StatisticsNode
  | FooterNode
  | SpacerNode;

export interface LayoutModel {
  nodes: LayoutNode[];
  totalHeight: number;
  totalWidth: number;
  generatedAt: number;
  version: string;
}

export interface ViewportMetrics {
  top: number; // percentage
  height: number; // percentage
}

export interface RenderContext {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  accentColor: string;
  scale: number;
  totalHeight: number;
}
