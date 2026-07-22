/**
 * Publications Page Content Model
 * Structured description of the publications page content for minimap rendering
 */

import { createPortfolioContent } from '../PortfolioContentModel';
import { HeadingNode, ParagraphNode, ResearchCardNode, SectionNode } from '../../types/layout';

/**
 * Generate the structured content model for the publications page
 */
export function getPublicationsPageContent() {
  const builder = createPortfolioContent('/publications');

  // Main title
  const title: HeadingNode = {
    type: 'heading',
    id: 'publications-title',
    x: 0,
    y: 0,
    width: 700,
    height: 48,
    importance: 1,
    level: 1,
    text: 'Publications',
  };

  // Subtitle
  const subtitle: ParagraphNode = {
    type: 'paragraph',
    id: 'publications-subtitle',
    x: 0,
    y: 64,
    width: 700,
    height: 48,
    importance: 0.6,
    lineCount: 2,
    hasLinks: false,
  };

  // Research Papers Section
  const researchSection: SectionNode = {
    type: 'section',
    id: 'research-section',
    x: 0,
    y: 128,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Research Papers',
    children: [
      {
        type: 'heading' as const,
        id: 'research-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Research Papers',
      },
      {
        type: 'research-card' as const,
        id: 'research-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 120,
        importance: 0.7,
        title: 'Wireless Power Transfer for Maglev Systems',
        authors: 'Shantanu Maratha et al.',
        venue: 'IEEE Transactions',
      },
      {
        type: 'research-card' as const,
        id: 'research-card-2',
        x: 0,
        y: 184,
        width: 700,
        height: 120,
        importance: 0.7,
        title: 'Environmental Monitoring with IoT',
        authors: 'Shantanu Maratha',
        venue: 'ArXiv Preprint',
      },
    ],
  };

  // Technical Reports Section
  const reportsSection: SectionNode = {
    type: 'section',
    id: 'reports-section',
    x: 0,
    y: 332,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Technical Reports',
    children: [
      {
        type: 'heading' as const,
        id: 'reports-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Technical Reports',
      },
      {
        type: 'research-card' as const,
        id: 'report-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 120,
        importance: 0.7,
        title: 'Smart Blind Stick Implementation',
        authors: 'Shantanu Maratha',
        venue: 'Arceus Labs Technical Report',
      },
    ],
  };

  builder.addNodes([title, subtitle, researchSection, reportsSection]);

  return builder.build();
}
