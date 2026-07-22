/**
 * About Page Content Model
 * Structured description of the about page content for minimap rendering
 */

import { createPortfolioContent } from '../PortfolioContentModel';
import { HeadingNode, ParagraphNode, SectionNode } from '../../types/layout';

/**
 * Generate the structured content model for the about page
 * This is the source of truth for both page and minimap renderers
 */
export function getAboutPageContent() {
  const builder = createPortfolioContent('/about');

  // Main title
  const title: HeadingNode = {
    type: 'heading',
    id: 'about-title',
    x: 0,
    y: 0,
    width: 700,
    height: 48,
    importance: 1,
    level: 1,
    text: '# DATASHEET: Shantanu Maratha',
  };

  // Subtitle (rendered as a paragraph)
  const subtitle: ParagraphNode = {
    type: 'paragraph',
    id: 'about-subtitle',
    x: 0,
    y: 48,
    width: 700,
    height: 24,
    importance: 0.6,
    lineCount: 1,
    hasLinks: false,
  };

  // Section 1: Origin Story
  const section1: SectionNode = {
    type: 'section',
    id: 'section-origin-story',
    x: 0,
    y: 88,
    width: 700,
    height: 0,
    importance: 0.8,
    title: '01. Origin Story',
    children: [
      {
        type: 'heading',
        id: 'section1-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 40,
        importance: 0.9,
        level: 2,
        text: '01. Origin Story',
      },
      {
        type: 'paragraph',
        id: 'section1-p1',
        x: 0,
        y: 56,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section1-p2',
        x: 0,
        y: 120,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section1-p3',
        x: 0,
        y: 184,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
    ],
  };

  // Section 2: Why I Build
  const section2: SectionNode = {
    type: 'section',
    id: 'section-why-build',
    x: 0,
    y: 296,
    width: 700,
    height: 0,
    importance: 0.8,
    title: '02. Why I Build',
    children: [
      {
        type: 'heading',
        id: 'section2-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 40,
        importance: 0.9,
        level: 2,
        text: '02. Why I Build',
      },
      {
        type: 'paragraph',
        id: 'section2-p1',
        x: 0,
        y: 56,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section2-p2',
        x: 0,
        y: 96,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: true,
      },
      {
        type: 'paragraph',
        id: 'section2-p3',
        x: 0,
        y: 160,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
    ],
  };

  // Section 3: Startup Experience
  const section3: SectionNode = {
    type: 'section',
    id: 'section-startup',
    x: 0,
    y: 536,
    width: 700,
    height: 0,
    importance: 0.8,
    title: '03. Startup Experience',
    children: [
      {
        type: 'heading',
        id: 'section3-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 40,
        importance: 0.9,
        level: 2,
        text: '03. Startup Experience',
      },
      {
        type: 'paragraph',
        id: 'section3-p1',
        x: 0,
        y: 56,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: true,
      },
      {
        type: 'paragraph',
        id: 'section3-p2',
        x: 0,
        y: 120,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section3-p3',
        x: 0,
        y: 184,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: true,
      },
      {
        type: 'paragraph',
        id: 'section3-p4',
        x: 0,
        y: 248,
        width: 700,
        height: 48,
        importance: 0.5,
        lineCount: 2,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section3-p5',
        x: 0,
        y: 312,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
    ],
  };

  // Section 4: Offline Mode
  const section4: SectionNode = {
    type: 'section',
    id: 'section-offline',
    x: 0,
    y: 920,
    width: 700,
    height: 0,
    importance: 0.8,
    title: '04. Offline Mode',
    children: [
      {
        type: 'heading',
        id: 'section4-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 40,
        importance: 0.9,
        level: 2,
        text: '04. Offline Mode',
      },
      {
        type: 'paragraph',
        id: 'section4-p1',
        x: 0,
        y: 56,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section4-p2',
        x: 0,
        y: 96,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section4-p3',
        x: 0,
        y: 136,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
    ],
  };

  // Section 5: The Dream Build
  const section5: SectionNode = {
    type: 'section',
    id: 'section-dream',
    x: 0,
    y: 1176,
    width: 700,
    height: 0,
    importance: 0.8,
    title: '05. The Dream Build',
    children: [
      {
        type: 'heading',
        id: 'section5-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 40,
        importance: 0.9,
        level: 2,
        text: '05. The Dream Build',
      },
      {
        type: 'paragraph',
        id: 'section5-p1',
        x: 0,
        y: 56,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section5-p2',
        x: 0,
        y: 96,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section5-p3',
        x: 0,
        y: 136,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
      {
        type: 'paragraph',
        id: 'section5-p4',
        x: 0,
        y: 176,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
    ],
  };

  // Section 6: Map and footer
  const section6: SectionNode = {
    type: 'section',
    id: 'section-map',
    x: 0,
    y: 1432,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Map',
    children: [
      {
        type: 'map',
        id: 'world-map',
        x: 0,
        y: 0,
        width: 700,
        height: 300,
        importance: 0.7,
        aspectRatio: 1,
      },
      {
        type: 'paragraph',
        id: 'proud-text',
        x: 0,
        y: 316,
        width: 700,
        height: 24,
        importance: 0.5,
        lineCount: 1,
        hasLinks: false,
      },
    ],
  };

  // Add all nodes to builder
  builder.addNodes([title, subtitle, section1, section2, section3, section4, section5, section6]);

  return builder.build();
}
