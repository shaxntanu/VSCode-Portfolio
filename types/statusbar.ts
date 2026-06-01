export interface StatusBarItem {
  id: string;
  text: string;
  icon?: React.ComponentType<any>;
  tooltip?: string;
  link?: string;
  priority: number; // Lower number = higher priority (shows on mobile)
  side: 'left' | 'right';
}

export interface ActivityBadge {
  path: string;
  count: number;
  show: boolean;
}
