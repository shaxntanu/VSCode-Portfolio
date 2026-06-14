import { projects } from '@/data/projects';

export interface TerminalCommand {
  name: string;
  description: string;
  execute: (args: string[]) => string | string[];
}

const aboutContent = `╔════════════════════════════════════════════════╗
║        SHANTANU - EMBEDDED SYSTEMS ENGINEER    ║
╚════════════════════════════════════════════════╝

Full Name: Shantanu Wable
Location: India (ECE Student)
Focus: IoT, Embedded Systems, Hardware Design

Specialization:
  • Microcontroller Programming (ESP32, Arduino)
  • PCB Design & Schematic Capture (KiCAD)
  • Sensor Integration & Data Acquisition
  • Firmware Development (C/C++)
  • 3D CAD Design (SolidWorks, AutoCAD)

Current Projects:
  • ARC-4 - Advanced IoT Platform
  • NOEMA - Neural Optimization Engine
  • Aether - Multi-band Communication System
  • Zephyr Station - Environmental Monitoring

Philosophy:
  "Build, Break, Learn, Iterate"`;

const resumeContent = `╔════════════════════════════════════════════════╗
║              PROFESSIONAL RESUME               ║
╚════════════════════════════════════════════════╝

EDUCATION:
  Thapar Institute of Engineering & Technology
  B.Tech Electronics & Communication Engineering

EXPERIENCE:
  Founder @ Arceus Labs (2025-Present)
    Leading IoT and embedded systems projects

  Co-founder @ Ragastra (2025-Present)
    Building innovative engineering solutions

  Developer @ Various Startups (2024-2025)
    Full-stack IoT solutions

SKILLS MATRIX:
  ■■■■■■■■■■ Microcontroller Programming (99/100)
  ■■■■■■■■░░ PCB Design (66/100)
  ■■■■■■■■░░ Firmware Development (88/100)
  ■■■■■■■■■░ Circuit Design (85/100)
  ■■■■■░░░░░ Web Development (40/100)

CERTIFICATIONS:
  • MIT x Santander - Generative AI & IoT
  • Google x Santander - AI & Python
  • Formula 1 x Santander - Leadership
  • Multiple Technical Certifications

ACHIEVEMENTS:
  • 18+ Portfolio Projects
  • 10+ GitHub Repositories
  • 4+ Technical Reports Published
  • Active Open Source Contributor`;

const skillsContent = `╔════════════════════════════════════════════════╗
║              TECHNICAL SKILLS                  ║
╚════════════════════════════════════════════════╝

HARDWARE LAYER:
  ✓ ESP32 / Arduino (Advanced)
  ✓ Sensor Integration (Advanced)
  ✓ PCB Design (Intermediate)
  ✓ Communication Protocols - I2C, SPI, UART
  ✓ MQTT / IoT Protocols (Intermediate)
  ✓ CAD Design - SolidWorks, AutoCAD (Intermediate)

FIRMWARE & LOGIC:
  ✓ C / Embedded C (Advanced)
  ✓ C++ Arduino/ESP32 (Intermediate)
  ✓ Assembly (Basic)
  ✓ Real-time Systems

TOOLS & INFRASTRUCTURE:
  ✓ Arduino IDE / Kiro IDE (Advanced)
  ✓ KiCAD (Intermediate)
  ✓ Git / GitHub (Advanced)
  ✓ Tinkercad / Wokwi Simulation (Advanced)
  ✓ Notion / Obsidian Documentation (Advanced)

WEB INTEGRATION:
  ✓ React / Next.js (Intermediate)
  ✓ TypeScript (Intermediate)
  ✓ HTML / CSS / JavaScript (Basic)
  ✓ Vercel Deployment (Advanced)`;

const projectsContent = `╔════════════════════════════════════════════════╗
║              PORTFOLIO PROJECTS                ║
╚════════════════════════════════════════════════╝

${projects
  .map(
    (p) => `
${p.title.toUpperCase()}
  Category: ${p.category}
  Status: ${p.year === 2026 ? 'In Development' : 'Completed'}
  Date: ${p.dateRange}
  Link: ${p.link}
  Description: ${p.description}
`
  )
  .join('\n')}`;

export const terminalCommands: Record<string, TerminalCommand> = {
  whoami: {
    name: 'whoami',
    description: 'Display user information',
    execute: () => 'Embedded Systems Engineer | IoT Developer | ECE Student | Builder of Aether, Zephyr Station, ARC-4',
  },
  help: {
    name: 'help',
    description: 'List all available commands',
    execute: () =>
      Object.entries(terminalCommands).map((entry) => {
        const [cmd, data] = entry;
        return `  ${cmd.padEnd(15)} - ${data.description}`;
      }),
  },
  ls: {
    name: 'ls',
    description: 'List portfolio directories',
    execute: () => [
      'about/',
      'projects/',
      'experience/',
      'research/',
      'contact/',
      'certificates/',
      'techstack/',
      'skillmatrix/',
    ],
  },
  pwd: {
    name: 'pwd',
    description: 'Print working directory',
    execute: () => '/home/shantanu/portfolio',
  },
  cd: {
    name: 'cd',
    description: 'Change directory',
    execute: (args) => {
      if (args.length === 0) return '/home/shantanu/portfolio';
      return `changed directory to ${args[0]}`;
    },
  },
  cat: {
    name: 'cat',
    description: 'Display file contents',
    execute: (args) => {
      if (args.length === 0) return 'Usage: cat <filename>';
      const file = args[0];
      if (file === 'about.txt') return aboutContent;
      if (file === 'resume.txt') return resumeContent;
      if (file === 'skills.txt') return skillsContent;
      if (file === 'projects.txt') return projectsContent;
      return `cat: ${file}: No such file or directory`;
    },
  },
  github: {
    name: 'github',
    description: 'Open GitHub profile',
    execute: () => {
      if (typeof window !== 'undefined') {
        window.open('https://github.com/shaxntanu', '_blank');
      }
      return 'Opening GitHub profile...';
    },
  },
  clear: {
    name: 'clear',
    description: 'Clear terminal screen',
    execute: () => '___CLEAR___',
  },
  date: {
    name: 'date',
    description: 'Display current date',
    execute: () => new Date().toString(),
  },
  neofetch: {
    name: 'neofetch',
    description: 'Display system information',
    execute: () => `
    ┌─────────────────────────────────────────┐
    │     SHANTANU'S PORTFOLIO SYSTEM         │
    ├─────────────────────────────────────────┤
    │ OS: Portfolio OS (Next.js 15.5.7)       │
    │ Host: VS Code Portfolio v2.0            │
    │ Kernel: TypeScript 5.0                  │
    │ RAM: 8GB (Coffee Cache)                 │
    │ Storage: Infinite (Cloud Native)        │
    │ Projects: 18+                           │
    │ GitHub Stars: 🌟🌟🌟 (Growing)         │
    │ Focus: Embedded Systems & IoT           │
    │ Status: Building Cool Stuff 🚀          │
    └─────────────────────────────────────────┘
    `,
  },
  easteregg: {
    name: 'easteregg',
    description: 'Find a hidden surprise',
    execute: () => [
      '🔓 Easter Egg Unlocked!',
      '',
      '   "The best projects are built with coffee,',
      '    curiosity, and a willingness to debug',
      '    at 3 AM." - Shantanu',
      '',
      '   Current Mood: 🔌 Soldering Projects 🎯',
      '   Next Goal: ⚡ Change the World with IoT',
    ],
  },
};

export const executeCommand = (input: string): string | string[] => {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const [command, ...args] = trimmed.split(' ');
  const cmd = terminalCommands[command.toLowerCase()];

  if (!cmd) {
    return `Command not found: ${command}. Type 'help' for available commands.`;
  }

  return cmd.execute(args);
};
