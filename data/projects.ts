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
  },
  {
    title: 'Blind Stick',
    description:
      'A smart mobility aid engineered to provide independence. Detects knee-level obstacles instantly, alerting users through intuitive buzzers and voice prompts.',
    logo: '/logos/notion_icon.svg',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
    slug: 'blind-stick',
    category: 'HARDWARE_MODULES',
  },
  {
    title: 'Marcus Omega',
    description:
      'A philosophical conversational AI System powered by the Google Gemini API, designed to engage users in deep, context-aware dialectic discussions.',
    logo: '/logos/marcus_omega.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
    category: 'SOFTWARE_SYSTEMS',
  },
  {
    title: 'GlyphThoughts',
    description:
      'A social platform that inspires deep reflection and authentic growth by bridging wisdom, technology, and community.',
    logo: '/logos/glyphthoughts_icon.svg',
    link: 'https://github.com/glyphthoughts',
    slug: 'glyphthoughts',
    category: 'MISC_LABS',
  },
];
