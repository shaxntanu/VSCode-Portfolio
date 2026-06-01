import { ComponentType } from 'react';

export interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: ComponentType<{ size?: number }>;
  category: CommandCategory;
  keywords?: string[];
  action: () => void | Promise<void>;
}

export type CommandCategory = 
  | 'resume'
  | 'contact'
  | 'portfolio'
  | 'workspace'
  | 'theme'
  | 'navigation';

export interface CommandGroup {
  category: CommandCategory;
  commands: Command[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
