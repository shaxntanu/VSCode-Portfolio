/**
 * Engineering Telemetry System
 * Automatically generates portfolio statistics from project metadata
 * Single source of truth - no hardcoded numbers
 */

import { projects } from './projects';
import type { Project, ProjectCategory } from '@/types';

export interface TelemetryMetrics {
  projects: ProjectMetrics;
  embedded: EmbeddedMetrics;
  development: DevelopmentMetrics;
  skills: SkillsMetrics;
  experience: ExperienceMetrics;
}

export interface ProjectMetrics {
  total: number;
  byCategory: Record<ProjectCategory, number>;
  byYear: Record<number, number>;
  withReports: number;
}

export interface EmbeddedMetrics {
  esp32: number;
  esp8266: number;
  arduino: number;
  totalEmbedded: number;
  protocols: string[];
  protocolCount: Record<string, number>;
}

export interface DevelopmentMetrics {
  githubRepos: number;
  languages: string[];
  languageCount: number;
}

export interface SkillsMetrics {
  frameworks: string[];
  platforms: string[];
  totalSkills: number;
}

export interface ExperienceMetrics {
  yearsBuilding: number;
  organizations: string[];
  organizationCount: number;
}

/**
 * Extract embedded system platforms from project data
 */
function getEmbeddedMetrics(projects: Project[]): EmbeddedMetrics {
  let esp32Count = 0;
  let esp8266Count = 0;
  let arduinoCount = 0;
  const protocols = new Set<string>();
  const protocolCount: Record<string, number> = {};

  projects.forEach((project) => {
    const title = project.title.toLowerCase();
    const desc = project.description.toLowerCase();
    const combined = `${title} ${desc}`;

    // Count platforms
    if (combined.includes('esp32')) esp32Count++;
    if (combined.includes('esp8266')) esp8266Count++;
    if (combined.includes('arduino')) arduinoCount++;

    // Extract protocols (common embedded protocols)
    const protocolPatterns = [
      'i2c', 'uart', 'spi', 'mqtt', 'ble', 'bluetooth', 
      'wifi', 'http', 'tcp', 'udp', 'serial', 'rfid'
    ];

    protocolPatterns.forEach((protocol) => {
      if (combined.includes(protocol)) {
        const displayProtocol = protocol.toUpperCase();
        protocols.add(displayProtocol);
        protocolCount[displayProtocol] = (protocolCount[displayProtocol] || 0) + 1;
      }
    });
  });

  return {
    esp32: esp32Count,
    esp8266: esp8266Count,
    arduino: arduinoCount,
    totalEmbedded: esp32Count + esp8266Count + arduinoCount,
    protocols: Array.from(protocols).sort(),
    protocolCount,
  };
}

/**
 * Generate project metrics
 */
function getProjectMetrics(projects: Project[]): ProjectMetrics {
  const byCategory: Record<ProjectCategory, number> = {
    HARDWARE_MODULES: 0,
    SOFTWARE_SYSTEMS: 0,
    MISC_LABS: 0,
    COMMUNITY_PROJECT: 0,
    RAGASTRA_PROJECT: 0,
  };

  const byYear: Record<number, number> = {};
  let withReports = 0;

  projects.forEach((project) => {
    byCategory[project.category]++;
    byYear[project.year] = (byYear[project.year] || 0) + 1;
    if (project.reportLink) withReports++;
  });

  return {
    total: projects.length,
    byCategory,
    byYear,
    withReports,
  };
}

/**
 * Extract development metrics
 */
function getDevelopmentMetrics(projects: Project[]): DevelopmentMetrics {
  const languages = new Set<string>();

  projects.forEach((project) => {
    const combined = `${project.title} ${project.description}`.toLowerCase();

    // Detect languages from project content
    if (combined.includes('python') || combined.includes('opencv')) languages.add('Python');
    if (combined.includes('c++') || combined.includes('arduino') || combined.includes('esp')) languages.add('C++');
    if (combined.includes('javascript') || combined.includes('typescript') || combined.includes('react')) languages.add('TypeScript');
    if (combined.includes('next.js')) languages.add('JavaScript');
  });

  return {
    githubRepos: projects.length, // All projects have GitHub links
    languages: Array.from(languages).sort(),
    languageCount: languages.size,
  };
}

/**
 * Extract skills metrics
 */
function getSkillsMetrics(projects: Project[]): SkillsMetrics {
  const frameworks = new Set<string>();
  const platforms = new Set<string>();

  projects.forEach((project) => {
    const combined = `${project.title} ${project.description}`.toLowerCase();

    // Frameworks
    if (combined.includes('opencv')) frameworks.add('OpenCV');
    if (combined.includes('react')) frameworks.add('React');
    if (combined.includes('next.js')) frameworks.add('Next.js');
    if (combined.includes('gemini')) frameworks.add('Gemini API');

    // Platforms
    if (combined.includes('esp32')) platforms.add('ESP32');
    if (combined.includes('esp8266')) platforms.add('ESP8266');
    if (combined.includes('arduino')) platforms.add('Arduino');
    if (combined.includes('vercel')) platforms.add('Vercel');
  });

  return {
    frameworks: Array.from(frameworks).sort(),
    platforms: Array.from(platforms).sort(),
    totalSkills: frameworks.size + platforms.size,
  };
}

/**
 * Calculate experience metrics
 */
function getExperienceMetrics(projects: Project[]): ExperienceMetrics {
  const organizations = new Set<string>();

  projects.forEach((project) => {
    if (project.category === 'COMMUNITY_PROJECT') organizations.add('Arceus Labs');
    if (project.category === 'RAGASTRA_PROJECT') organizations.add('Ragastra');
  });

  // Calculate years from earliest to current
  const years = projects.map((p) => p.year);
  const earliestYear = Math.min(...years);
  const currentYear = new Date().getFullYear();
  const yearsBuilding = currentYear - earliestYear;

  return {
    yearsBuilding,
    organizations: Array.from(organizations).sort(),
    organizationCount: organizations.size,
  };
}

/**
 * Main telemetry generator
 * Call this to get all metrics
 */
export function generateTelemetry(): TelemetryMetrics {
  return {
    projects: getProjectMetrics(projects),
    embedded: getEmbeddedMetrics(projects),
    development: getDevelopmentMetrics(projects),
    skills: getSkillsMetrics(projects),
    experience: getExperienceMetrics(projects),
  };
}

/**
 * Get formatted telemetry for status bar
 * Returns rotating metrics suitable for display
 */
export function getStatusBarMetrics(): string[] {
  const telemetry = generateTelemetry();

  return [
    `Projects: ${telemetry.projects.total}`,
    `ESP32: ${telemetry.embedded.esp32}`,
    `ESP8266: ${telemetry.embedded.esp8266}`,
    `Arduino: ${telemetry.embedded.arduino}`,
    `Languages: ${telemetry.development.languageCount}`,
    `Protocols: ${telemetry.embedded.protocols.length}`,
    `Organizations: ${telemetry.experience.organizationCount}`,
    `Years: ${telemetry.experience.yearsBuilding}`,
    `Reports: ${telemetry.projects.withReports}`,
  ];
}
