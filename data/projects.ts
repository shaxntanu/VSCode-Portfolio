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
    titleHighlight: 'SIDE_QUESTS',
    color: '#2196f3', // Blue - Side Quests
  },
};

export const projects: Project[] = [
  {
    title: 'Zephyr Station',
    description: 'ESP32-based IoT station for environmental monitoring.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station',
    slug: 'zephyr-station',
    category: 'HARDWARE_MODULES',
    dateRange: 'Aug 2025 - Nov 2025',
  },
  {
    title: 'Blind Stick',
    description: 'Smart mobility aid with obstacle detection and voice alerts.',
    logo: '/logos/notion_icon.svg',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
    slug: 'blind-stick',
    category: 'HARDWARE_MODULES',
    dateRange: 'Jul 2018 - Aug 2018',
  },
  {
    title: 'Marcus Omega',
    description: 'Philosophical AI chatbot powered by Gemini API.',
    logo: '/logos/marcus_omega.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Oct 2025',
  },
  {
    title: 'Zephyr Station Dashboard',
    description: 'Real-time web dashboard for Zephyr Station analytics.',
    logo: '/logos/github_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station-Dashboard',
    slug: 'zephyr-station-dashboard',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Aug 2025 - Dec 2025',
  },
  {
    title: 'VS Code Portfolio',
    description: 'Portfolio website styled as VS Code editor.',
    logo: '/logos/vscode_icon.svg',
    link: 'https://vs-code-portfolio-one.vercel.app',
    slug: 'vs-code-portfolio',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Present (Regular Maintenance)',
  },
  {
    title: 'HELIX',
    description: 'Coming Soon',
    logo: '/logos/stmicroelectronics_icon.svg',
    link: '#',
    slug: 'helix',
    category: 'HARDWARE_MODULES',
    dateRange: 'Dec 2025',
  },
  {
    title: 'Jolt Locator',
    description: 'Under Development',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/Jolt-Locator',
    slug: 'jolt-locator',
    category: 'HOBBY_FUN_PROJECTS',
    dateRange: 'Nov 2025 - Jan 2025 Expected',
  },
];
