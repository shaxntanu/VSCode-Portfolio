/**
 * Projects Page Content Model
 * Structured description of the projects page content for minimap rendering
 */

import { createPortfolioContent } from '../PortfolioContentModel';
import { HeadingNode, ParagraphNode, ProjectCardNode, SectionNode } from '../../types/layout';

/**
 * Generate the structured content model for the projects page
 */
export function getProjectsPageContent() {
  const builder = createPortfolioContent('/projects');

  // Main title
  const title: HeadingNode = {
    type: 'heading',
    id: 'projects-title',
    x: 0,
    y: 0,
    width: 700,
    height: 48,
    importance: 1,
    level: 1,
    text: 'firmware.ino',
  };

  // Subtitle
  const subtitle: ParagraphNode = {
    type: 'paragraph',
    id: 'projects-subtitle',
    x: 0,
    y: 64,
    width: 700,
    height: 72,
    importance: 0.6,
    lineCount: 3,
    hasLinks: false,
  };

  // Hardware Modules Section
  const hardwareSection: SectionNode = {
    type: 'section',
    id: 'hardware-section',
    x: 0,
    y: 152,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Hardware Modules',
    children: [
      {
        type: 'heading' as const,
        id: 'hardware-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Hardware Modules',
      },
      {
        type: 'project-card' as const,
        id: 'hardware-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'Zephyr Station',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 3,
      },
      {
        type: 'project-card' as const,
        id: 'hardware-card-2',
        x: 0,
        y: 264,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'Jolt-Locator',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 2,
      },
      {
        type: 'project-card' as const,
        id: 'hardware-card-3',
        x: 0,
        y: 480,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'Smart Blind Stick',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 2,
      },
    ],
  };

  // Community Projects Section
  const communitySection: SectionNode = {
    type: 'section',
    id: 'community-section',
    x: 0,
    y: 680,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Community Projects',
    children: [
      {
        type: 'heading' as const,
        id: 'community-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Community Projects',
      },
      {
        type: 'project-card' as const,
        id: 'community-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'The-Ruin-Machine',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 2,
      },
    ],
  };

  // Ragastra Projects Section
  const ragastraSection: SectionNode = {
    type: 'section',
    id: 'ragastra-section',
    x: 0,
    y: 928,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Ragastra Projects',
    children: [
      {
        type: 'heading' as const,
        id: 'ragastra-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Ragastra Projects',
      },
      {
        type: 'project-card' as const,
        id: 'ragastra-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'Maglev Mobility System',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 4,
      },
    ],
  };

  // Software Systems Section
  const softwareSection: SectionNode = {
    type: 'section',
    id: 'software-section',
    x: 0,
    y: 1176,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Software Systems',
    children: [
      {
        type: 'heading' as const,
        id: 'software-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Software Systems',
      },
      {
        type: 'project-card' as const,
        id: 'software-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'VSCode Portfolio',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 5,
      },
      {
        type: 'project-card' as const,
        id: 'software-card-2',
        x: 0,
        y: 264,
        width: 700,
        height: 200,
        importance: 0.7,
        title: 'AI Chatbot',
        hasThumbnail: true,
        hasDescription: true,
        techStackCount: 3,
      },
    ],
  };

  builder.addNodes([
    title,
    subtitle,
    hardwareSection,
    communitySection,
    ragastraSection,
    softwareSection,
  ]);

  return builder.build();
}
