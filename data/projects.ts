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
  HOBBY_FUN_PROJECTS: {
    title: '// ',
    titleHighlight: 'HOBBY_FUN_PROJECTS',
    color: '#2196f3', // Blue - Hobby/Fun
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
      'A philosophical AI chatbot powered by Gemini API for deep, context-aware discussions.',
    logo: '/logos/marcus_omega.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Oct 2025',
  },
  {
    title: 'Zephyr Station Dashboard',
    description:
      'Real-time web dashboard for Zephyr Station with live sensor readings and analytics.',
    logo: '/logos/github_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station-Dashboard',
    slug: 'zephyr-station-dashboard',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Aug 2025 - Dec 2025',
  },
  {
    title: 'VS Code Portfolio',
    description:
      'Portfolio website styled as VS Code with file explorer, tabs, and syntax highlighting.',
    logo: '/logos/vscode_icon.svg',
    link: 'https://vs-code-portfolio-one.vercel.app',
    slug: 'vs-code-portfolio',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Present (Regular Maintenance)',
  },
  {
    title: 'HELIX',
    description: 'Coming Soon',
    logo: '/logos/github_icon.svg',
    link: '#',
    slug: 'helix',
    category: 'HARDWARE_MODULES',
    dateRange: 'Dec 2025',
  },
  {
    title: 'Jolt Locator',
    description:
      'A fun project to locate and track jolts or sudden movements using sensors.',
    logo: '/logos/github_icon.svg',
    link: '#',
    slug: 'jolt-locator',
    category: 'HOBBY_FUN_PROJECTS',
    dateRange: 'TBD',
  },
];
