import { Project, ProjectCategory, CategoryConfig } from '@/types';

export type { Project, ProjectCategory, CategoryConfig };

export const categoryConfig: Record<ProjectCategory, CategoryConfig> = {
  HARDWARE_MODULES: {
    title: '// ',
    titleHighlight: 'HARDWARE_MODULES',
    color: '#ff8c50', // Red/Orange - Hardware
  },
  SOFTWARE_SYSTEMS: {
    title: '// ',
    titleHighlight: 'SOFTWARE_SYSTEMS',
    color: '#00dc8c', // Blue/Green - Software
  },
  MISC_LABS: {
    title: '// ',
    titleHighlight: 'MISC_LABS',
    color: '#a078ff', // Purple - Misc
  },
  VS_CODE_PORTFOLIO: {
    title: '// ',
    titleHighlight: 'VS_CODE_PORTFOLIO',
    color: '#2196f3', // Blue - VS Code
  },
};

export const projects: Project[] = [
  {
    title: 'Zephyr Station',
    description:
      'Multi-sensor IoT station tracking air quality, temperature, and pressure using an ESP32.',
    logo: '/logos/github_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station',
    slug: 'zephyr-station',
    category: 'HARDWARE_MODULES',
    dateRange: 'Aug 2025 - Nov 2025',
  },
  {
    title: 'Blind Stick',
    description:
      'A smart mobility aid that detects obstacles and alerts users through buzzers and voice prompts.',
    logo: '/logos/notion_icon.svg',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
    slug: 'blind-stick',
    category: 'HARDWARE_MODULES',
    dateRange: 'Jul 2018 - Aug 2018',
  },
  {
    title: 'Marcus Omega',
    description:
      'A philosophical conversational AI System powered by the Google Gemini API, designed to engage users in deep, context-aware dialectic discussions.',
    logo: '/logos/marcus_omega.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Oct 2025',
  },
  {
    title: 'Zephyr Station Dashboard',
    description:
      'A real-time web dashboard for visualizing environmental data from the Zephyr Station IoT device, featuring live sensor readings and historical analytics.',
    logo: '/logos/github_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station-Dashboard',
    slug: 'zephyr-station-dashboard',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Aug 2025 - Dec 2025',
  },

  {
    title: 'HELIX',
    description: 'Coming Soon',
    logo: '/logos/github_icon.svg',
    link: '#',
    slug: 'helix',
    category: 'HARDWARE_MODULES',
    dateRange: 'Coming Soon',
  },
  {
    title: 'VS Code Portfolio',
    description:
      'A developer portfolio website styled as a VS Code editor, featuring an interactive IDE-like interface with file explorer, tabs, and syntax-highlighted content.',
    logo: '/logos/vscode_icon.svg',
    link: 'https://vs-code-portfolio-one.vercel.app',
    slug: 'vs-code-portfolio',
    category: 'VS_CODE_PORTFOLIO',
    dateRange: 'Jul 2025 - Present (Regular Maintenance)',
  },
];
