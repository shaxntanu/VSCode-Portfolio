import { Command } from '@/types/commands';
import {
  VscFile,
  VscFileCode,
  VscLink,
  VscMail,
  VscGithubAlt,
  VscSymbolMisc,
  VscCheck,
  VscRefresh,
} from 'react-icons/vsc';
import { MdDownload, MdViewSidebar, MdMap, MdZoomOutMap, MdPalette } from 'react-icons/md';
import { BiTargetLock } from 'react-icons/bi';

// Helper to show notifications
let notificationCallback: ((msg: string, type: string) => void) | null = null;

export const setNotificationCallback = (callback: (msg: string, type: string) => void) => {
  notificationCallback = callback;
};

const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
  if (notificationCallback) {
    notificationCallback(message, type);
  }
};

// Resume Commands
const resumeCommands: Command[] = [
  {
    id: 'resume-view',
    title: 'View Resume',
    description: 'Open resume page',
    icon: VscFile,
    category: 'resume',
    keywords: ['resume', 'cv', 'curriculum', 'vitae'],
    action: () => {
      window.location.href = '/resume';
      notify('Resume opened', 'success');
    },
  },
  {
    id: 'resume-download',
    title: 'Download Resume',
    description: 'Download resume as PDF',
    icon: MdDownload,
    category: 'resume',
    keywords: ['resume', 'download', 'pdf', 'cv'],
    action: async () => {
      try {
        const response = await fetch('/resume.pdf');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Shantanu-Resume.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        notify('✓ Resume downloaded', 'success');
      } catch (error) {
        notify('Failed to download resume', 'error');
      }
    },
  },
  {
    id: 'resume-copy-link',
    title: 'Copy Resume Link',
    description: 'Copy resume URL to clipboard',
    icon: VscLink,
    category: 'resume',
    keywords: ['resume', 'copy', 'link', 'url'],
    action: () => {
      const url = `${window.location.origin}/resume`;
      navigator.clipboard.writeText(url);
      notify('✓ Resume link copied', 'success');
    },
  },
];

// Contact Commands
const contactCommands: Command[] = [
  {
    id: 'contact-email',
    title: 'Send Email',
    description: 'Open email client',
    icon: VscMail,
    category: 'contact',
    keywords: ['email', 'contact', 'mail'],
    action: () => {
      window.location.href = 'mailto:shaxntanu@gmail.com';
      notify('✓ Email client opened', 'success');
    },
  },
  {
    id: 'contact-linkedin',
    title: 'Open LinkedIn',
    description: 'Visit LinkedIn profile',
    icon: VscSymbolMisc,
    category: 'contact',
    keywords: ['linkedin', 'contact', 'social'],
    action: () => {
      window.open('https://linkedin.com/in/shaxntanu', '_blank');
      notify('✓ LinkedIn opened', 'success');
    },
  },
  {
    id: 'contact-github',
    title: 'Open GitHub',
    description: 'Visit GitHub profile',
    icon: VscGithubAlt,
    category: 'contact',
    keywords: ['github', 'contact', 'repositories', 'repos'],
    action: () => {
      window.open('https://github.com/shaxntanu', '_blank');
      notify('✓ GitHub profile opened', 'success');
    },
  },
];

// Portfolio Stats Commands
const portfolioCommands: Command[] = [
  {
    id: 'portfolio-stats',
    title: 'Show Portfolio Statistics',
    description: 'View portfolio metrics and stats',
    icon: VscSymbolMisc,
    category: 'portfolio',
    keywords: ['stats', 'statistics', 'metrics', 'overview'],
    action: () => {
      // This will trigger a modal/panel in the component
      window.dispatchEvent(new CustomEvent('showPortfolioStats'));
      notify('✓ Portfolio stats loaded', 'success');
    },
  },
];

// Workspace Commands
const workspaceCommands: Command[] = [
  {
    id: 'workspace-reload',
    title: 'Reload Workspace',
    description: 'Refresh the portfolio',
    icon: VscRefresh,
    category: 'workspace',
    keywords: ['reload', 'refresh', 'restart'],
    action: () => {
      window.location.reload();
    },
  },
  {
    id: 'workspace-toggle-sidebar',
    title: 'Toggle Sidebar',
    description: 'Show or hide the sidebar',
    icon: MdViewSidebar,
    category: 'workspace',
    keywords: ['sidebar', 'toggle', 'explorer'],
    action: () => {
      window.dispatchEvent(new CustomEvent('toggleSidebar'));
      notify('✓ Sidebar toggled', 'success');
    },
  },
  {
    id: 'workspace-toggle-minimap',
    title: 'Toggle Minimap',
    description: 'Show or hide the minimap',
    icon: MdMap,
    category: 'workspace',
    keywords: ['minimap', 'toggle', 'map'],
    action: () => {
      window.dispatchEvent(new CustomEvent('toggleMinimap'));
      notify('✓ Minimap toggled', 'success');
    },
  },
  {
    id: 'workspace-focus-mode',
    title: 'Focus Mode',
    description: 'Hide explorer and maximize content',
    icon: BiTargetLock,
    category: 'workspace',
    keywords: ['focus', 'mode', 'distraction-free'],
    action: () => {
      window.dispatchEvent(new CustomEvent('focusMode'));
      notify('✓ Focus mode enabled', 'success');
    },
  },
  {
    id: 'workspace-zen-mode',
    title: 'Zen Mode',
    description: 'Hide UI elements for distraction-free viewing',
    icon: MdZoomOutMap,
    category: 'workspace',
    keywords: ['zen', 'mode', 'distraction-free', 'fullscreen'],
    action: () => {
      window.dispatchEvent(new CustomEvent('zenMode'));
      notify('✓ Zen mode enabled', 'success');
    },
  },
];

// Theme Commands
const themeCommands: Command[] = [
  {
    id: 'theme-dark-plus',
    title: 'Switch to Dark+',
    description: 'VS Code Dark+ theme',
    icon: MdPalette,
    category: 'theme',
    keywords: ['theme', 'dark', 'dark+'],
    action: () => {
      document.documentElement.setAttribute('data-theme', 'dark-plus');
      localStorage.setItem('theme', 'dark-plus');
      window.dispatchEvent(new Event('themeChange'));
      notify('✓ Theme changed to Dark+', 'success');
    },
  },
  {
    id: 'theme-github-dark',
    title: 'Switch to GitHub Dark',
    description: 'GitHub Dark theme',
    icon: MdPalette,
    category: 'theme',
    keywords: ['theme', 'github', 'dark'],
    action: () => {
      document.documentElement.setAttribute('data-theme', 'github-dark');
      localStorage.setItem('theme', 'github-dark');
      window.dispatchEvent(new Event('themeChange'));
      notify('✓ Theme changed to GitHub Dark', 'success');
    },
  },
  {
    id: 'theme-dracula',
    title: 'Switch to Dracula',
    description: 'Dracula theme',
    icon: MdPalette,
    category: 'theme',
    keywords: ['theme', 'dracula'],
    action: () => {
      document.documentElement.setAttribute('data-theme', 'dracula');
      localStorage.setItem('theme', 'dracula');
      window.dispatchEvent(new Event('themeChange'));
      notify('✓ Theme changed to Dracula', 'success');
    },
  },
  {
    id: 'theme-tokyo-night',
    title: 'Switch to Tokyo Night',
    description: 'Tokyo Night theme',
    icon: MdPalette,
    category: 'theme',
    keywords: ['theme', 'tokyo', 'night'],
    action: () => {
      document.documentElement.setAttribute('data-theme', 'tokyo-night');
      localStorage.setItem('theme', 'tokyo-night');
      window.dispatchEvent(new Event('themeChange'));
      notify('✓ Theme changed to Tokyo Night', 'success');
    },
  },
  {
    id: 'theme-catppuccin',
    title: 'Switch to Catppuccin',
    description: 'Catppuccin theme',
    icon: MdPalette,
    category: 'theme',
    keywords: ['theme', 'catppuccin'],
    action: () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin');
      localStorage.setItem('theme', 'catppuccin');
      window.dispatchEvent(new Event('themeChange'));
      notify('✓ Theme changed to Catppuccin', 'success');
    },
  },
];

// Navigation Commands
const navigationCommands: Command[] = [
  {
    id: 'nav-home',
    title: 'Go to Home',
    description: 'Navigate to home page',
    icon: VscFileCode,
    category: 'navigation',
    keywords: ['home', 'main', 'index'],
    action: () => {
      window.location.href = '/';
    },
  },
  {
    id: 'nav-about',
    title: 'Go to About',
    description: 'Navigate to about page',
    icon: VscFile,
    category: 'navigation',
    keywords: ['about', 'profile', 'bio'],
    action: () => {
      window.location.href = '/about';
    },
  },
  {
    id: 'nav-projects',
    title: 'Go to Projects',
    description: 'Navigate to projects page',
    icon: VscSymbolMisc,
    category: 'navigation',
    keywords: ['projects', 'portfolio', 'work'],
    action: () => {
      window.location.href = '/projects';
    },
  },
  {
    id: 'nav-publications',
    title: 'Go to Publications',
    description: 'Navigate to publications page',
    icon: VscFile,
    category: 'navigation',
    keywords: ['publications', 'articles', 'papers', 'research'],
    action: () => {
      window.location.href = '/publications';
    },
  },
  {
    id: 'nav-github',
    title: 'Go to GitHub',
    description: 'Navigate to GitHub page',
    icon: VscGithubAlt,
    category: 'navigation',
    keywords: ['github', 'repositories', 'repos'],
    action: () => {
      window.location.href = '/github';
    },
  },
  {
    id: 'nav-contact',
    title: 'Go to Contact',
    description: 'Navigate to contact page',
    icon: VscMail,
    category: 'navigation',
    keywords: ['contact', 'email', 'reach out'],
    action: () => {
      window.location.href = '/contact';
    },
  },
];

// All commands registry
export const allCommands: Command[] = [
  ...resumeCommands,
  ...contactCommands,
  ...portfolioCommands,
  ...workspaceCommands,
  ...themeCommands,
  ...navigationCommands,
];

// Helper function to search commands with fuzzy matching
export const searchCommands = (query: string): Command[] => {
  if (!query.trim()) return allCommands;

  const q = query.toLowerCase();
  
  return allCommands.filter(cmd => {
    const titleMatch = cmd.title.toLowerCase().includes(q);
    const descMatch = cmd.description?.toLowerCase().includes(q);
    const keywordMatch = cmd.keywords?.some(kw => kw.toLowerCase().includes(q));
    
    return titleMatch || descMatch || keywordMatch;
  });
};

// Helper to get commands by category
export const getCommandsByCategory = (category: string): Command[] => {
  return allCommands.filter(cmd => cmd.category === category);
};
