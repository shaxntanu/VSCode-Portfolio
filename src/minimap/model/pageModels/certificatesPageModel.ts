/**
 * Certificates Page Content Model
 * Structured description of the certificates page content for minimap rendering
 */

import { createPortfolioContent } from '../PortfolioContentModel';
import { HeadingNode, ParagraphNode, CertificateCardNode, SectionNode } from '../../types/layout';

/**
 * Generate the structured content model for the certificates page
 */
export function getCertificatesPageContent() {
  const builder = createPortfolioContent('/certificates');

  // Main title
  const title: HeadingNode = {
    type: 'heading',
    id: 'certificates-title',
    x: 0,
    y: 0,
    width: 700,
    height: 48,
    importance: 1,
    level: 1,
    text: 'Certificates',
  };

  // Subtitle
  const subtitle: ParagraphNode = {
    type: 'paragraph',
    id: 'certificates-subtitle',
    x: 0,
    y: 64,
    width: 700,
    height: 48,
    importance: 0.6,
    lineCount: 2,
    hasLinks: false,
  };

  // Competition Certificates Section
  const competitionSection: SectionNode = {
    type: 'section',
    id: 'competition-section',
    x: 0,
    y: 128,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Competition Certificates',
    children: [
      {
        type: 'heading' as const,
        id: 'competition-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Competition Certificates',
      },
      {
        type: 'certificate-card' as const,
        id: 'cert-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 100,
        importance: 0.7,
        title: '1st Prize - Ideastorm Prelims',
        issuer: 'E-Summit \'26, IIT Roorkee',
        date: '2025',
      },
      {
        type: 'certificate-card' as const,
        id: 'cert-card-2',
        x: 0,
        y: 164,
        width: 700,
        height: 100,
        importance: 0.7,
        title: 'Hackathon Participant',
        issuer: 'SIH 2024',
        date: '2024',
      },
    ],
  };

  // Course Certificates Section
  const courseSection: SectionNode = {
    type: 'section',
    id: 'course-section',
    x: 0,
    y: 292,
    width: 700,
    height: 0,
    importance: 0.8,
    title: 'Course Certificates',
    children: [
      {
        type: 'heading' as const,
        id: 'course-heading',
        x: 0,
        y: 0,
        width: 700,
        height: 32,
        importance: 0.9,
        level: 2,
        text: 'Course Certificates',
      },
      {
        type: 'certificate-card' as const,
        id: 'course-card-1',
        x: 0,
        y: 48,
        width: 700,
        height: 100,
        importance: 0.7,
        title: 'Embedded Systems',
        issuer: 'Coursera',
        date: '2024',
      },
      {
        type: 'certificate-card' as const,
        id: 'course-card-2',
        x: 0,
        y: 164,
        width: 700,
        height: 100,
        importance: 0.7,
        title: 'IoT Fundamentals',
        issuer: 'NPTEL',
        date: '2024',
      },
      {
        type: 'certificate-card' as const,
        id: 'course-card-3',
        x: 0,
        y: 280,
        width: 700,
        height: 100,
        importance: 0.7,
        title: 'Python for Everybody',
        issuer: 'Coursera',
        date: '2023',
      },
    ],
  };

  builder.addNodes([title, subtitle, competitionSection, courseSection]);

  return builder.build();
}
