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
  COMMUNITY_PROJECT: {
    title: '// ',
    titleHighlight: 'ARCEUS_LABS',
    color: '#2196f3', // Blue - Arceus Labs
    link: 'https://arceuslabs.carrd.co',
  },
};

export const projects: Project[] = [
  // 2018
  {
    title: 'Blind Stick',
    description: 'Smart mobility aid with obstacle detection and voice alerts.',
    logo: '/logos/notion_icon.svg',
    link: 'https://crocus-zenobia-863.notion.site/Smart-Blind-Stick-Report-2a01ebfe2064802580bcd52932677de4',
    slug: 'blind-stick',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jul 2018 - Aug 2018',
    year: 2018,
  },
  // 2025
  {
    title: 'Marcus Omega',
    description: 'Philosophical AI chatbot powered by Gemini API.',
    logo: '/logos/marcus_omega.svg',
    link: 'https://glyphthoughts.github.io/Marcus-Landing-Page',
    slug: 'marcus-omega',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Sep 2025',
    year: 2025,
  },
  {
    title: 'VS Code Portfolio',
    description: 'Portfolio website styled as VS Code editor.',
    logo: '/logos/vscode_icon.svg',
    link: 'https://vs-code-portfolio-one.vercel.app',
    slug: 'vs-code-portfolio',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Jul 2025 - Present (Regular Maintenance)',
    year: 2025,
  },
  {
    title: 'Zephyr Station',
    description: 'ESP32-based IoT station for environmental monitoring.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/shaxntanu/Zephyr-Station',
    slug: 'zephyr-station',
    category: 'HARDWARE_MODULES',
    dateRange: 'Aug 2025 - Nov 2025',
    year: 2025,
  },
  {
    title: 'ARC-4 (Under Development)',
    description: 'Coming soon.',
    logo: '/logos/espressif_icon.svg',
    link: '#',
    slug: 'arc-4',
    category: 'HARDWARE_MODULES',
    dateRange: 'Jan 2026',
    year: 2026,
  },
  {
    title: 'ZM Dashboard',
    description: 'Real-time web dashboard for Zephyr Station analytics.',
    logo: '/logos/vercel_icon.svg',
    link: 'https://zephyr-station-dashboard.vercel.app',
    slug: 'zm-dashboard',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Aug 2025 - Dec 2025',
    year: 2025,
  },
  {
    title: 'Jolt Locator',
    description: 'Offline GPS navigation device with compass guidance.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/Jolt-Locator',
    slug: 'jolt-locator',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Nov 2025 - Dec 2025',
    year: 2025,
  },
  {
    title: 'The Ruin Machine',
    description: 'ESP32 device that proves gambling always leads to loss through math.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/The-Ruin-Machine',
    slug: 'the-ruin-machine',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Dec 2025 - Jan 2026',
    year: 2025,
  },
  {
    title: 'TRM Dashboard',
    description: 'Next.js app demonstrating why all betting strategies fail.',
    logo: '/logos/vercel_icon.svg',
    link: 'https://the-ruin-machine-web.vercel.app',
    slug: 'trm-dashboard',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Dec 2025 - Jan 2026',
    year: 2025,
  },
  // 2026
  {
    title: 'Electromagnet Controller',
    description: 'Arduino-based electromagnet turns controller for precise coil winding.',
    logo: '/logos/arduino_icon.svg',
    link: 'https://github.com/Arceus-Labs/Arduino-Electromagnet-Turns-Controller',
    slug: 'electromagnet-controller',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jan 2026 - Feb 2026',
    year: 2026,
  },
  {
    title: 'Inductance Meter',
    description: 'ESP8266-based inductance measurement tool with OLED display using RL time constant method.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/esp8266-inductance-meter',
    slug: 'inductance-meter',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jan 2026 - Jan 2026',
    year: 2026,
  },
  {
    title: 'Servo Light Switch',
    description: 'Bluetooth-controlled servo automation for physical light switches via ESP8266 and HC-06.',
    logo: '/logos/espressif_icon.svg',
    link: 'https://github.com/Arceus-Labs/Servo-Light-Switch-Control-ESP8266-and-HC06',
    slug: 'servo-light-switch',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jan 2026 - Jan 2026',
    year: 2026,
  },
  {
    title: 'RFID Attendance System',
    description: 'Automated attendance tracking system using RFID cards with ESP32 and Arduino integration.',
    logo: ['/logos/arduino_icon.svg', '/logos/espressif_icon.svg'],
    link: 'https://github.com/Arceus-Labs/RFID-Attendance-System',
    slug: 'rfid-attendance-system',
    category: 'COMMUNITY_PROJECT',
    dateRange: 'Jan 2026 - Feb 2026',
    year: 2026,
  },
  {
    title: 'Shape Detection System',
    description: 'OpenCV-based geometric shape detection and recognition.',
    logo: ['/logos/python_icon.svg', '/logos/jupyter_icon.svg'],
    link: 'https://github.com/shaxntanu/Geometrical-Shape-Detection-and-Recognition-using-Python-in-Image-Processing-ELC-TIET-2029-ECE',
    slug: 'shape-detection-system',
    category: 'SOFTWARE_SYSTEMS',
    dateRange: 'Feb 2026 - Feb 2026',
    year: 2026,
  },
];
