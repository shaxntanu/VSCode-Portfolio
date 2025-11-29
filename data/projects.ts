export interface Project {
  title: string;
  description: string;
  logo: string;
  link: string;
  slug: string;
  background?: string;
}

export const projects: Project[] = [
  {
    title: 'Marcus Omega',
    description:
      'A philosophical conversational AI powered by the Google Gemini API, designed to engage users in deep, context-aware dialectic discussions.',
    logo: '/logos/marcus_omega.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
  },
  {
    title: 'Blind Stick',
    description:
      'A smart mobility aid engineered to provide independence. Detects knee-level obstacles instantly, alerting users through intuitive buzzers and voice prompts.',
    logo: '/logos/notion_icon.svg',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
    slug: 'blind-stick',
  },
  {
    title: 'Zephyr Station',
    description:
      'Multi-sensor IoT station tracking air quality, temperature, and pressure using an ESP32.',
    logo: '/logos/github_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station',
    slug: 'zephyr-station',
  },
  {
    title: 'GlyphThoughts',
    description:
      'GlyphThoughts inspires deep reflection and authentic growth by bridging wisdom, technology, and community.',
    logo: '/logos/glyphthoughts_icon.svg',
    link: 'https://github.com/glyphthoughts',
    slug: 'glyphthoughts',
  },
];
