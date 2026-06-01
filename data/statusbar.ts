import { StatusBarItem } from '@/types/statusbar';
import {
  VscSourceControl,
  VscCheck,
  VscCode,
  VscFileCode,
} from 'react-icons/vsc';
import { SiNextdotjs, SiTypescript } from 'react-icons/si';

export const statusBarItems: StatusBarItem[] = [
  // LEFT SIDE
  {
    id: 'git-branch',
    text: 'main',
    icon: VscSourceControl,
    tooltip: 'Git Branch',
    link: 'https://github.com/shaxntanu/VSCode-Portfolio',
    priority: 1,
    side: 'left',
  },
  {
    id: 'version',
    text: 'v2.0',
    icon: VscCode,
    tooltip: 'Portfolio Version',
    priority: 2,
    side: 'left',
  },
  {
    id: 'build-status',
    text: 'Build Successful',
    icon: VscCheck,
    tooltip: 'Build Status',
    priority: 3,
    side: 'left',
  },
  
  // RIGHT SIDE
  {
    id: 'framework',
    text: 'Next.js 15',
    icon: SiNextdotjs,
    tooltip: 'Framework',
    priority: 4,
    side: 'right',
  },
  {
    id: 'language',
    text: 'TypeScript',
    icon: SiTypescript,
    tooltip: 'Language',
    priority: 5,
    side: 'right',
  },
  {
    id: 'encoding',
    text: 'UTF-8',
    icon: VscFileCode,
    tooltip: 'File Encoding',
    priority: 6,
    side: 'right',
  },
  {
    id: 'indentation',
    text: 'Spaces: 2',
    tooltip: 'Indentation',
    priority: 7,
    side: 'right',
  },
  {
    id: 'status',
    text: 'Portfolio Online',
    tooltip: 'Status',
    priority: 8,
    side: 'right',
  },
  {
    id: 'last-updated',
    text: 'Updated: Jun 2026',
    tooltip: 'Last Updated',
    priority: 9,
    side: 'right',
  },
  {
    id: 'shortcuts',
    text: 'Ctrl+K | Ctrl+Shift+P',
    tooltip: 'Keyboard Shortcuts',
    priority: 10,
    side: 'right',
  },
];
