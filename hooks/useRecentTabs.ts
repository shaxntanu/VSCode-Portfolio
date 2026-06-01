import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { rootFile, portfolioFiles, navFolders } from '@/data/navigation';

export interface RecentTab {
  name: string;
  path: string;
  icon: string;
}

const MAX_TABS = 6;

const allFiles = [
  rootFile,
  ...portfolioFiles,
  ...navFolders.flatMap(f => f.files),
];

export const useRecentTabs = () => {
  const router = useRouter();
  const [tabs, setTabs] = useState<RecentTab[]>([]);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('recentTabs');
      if (stored) setTabs(JSON.parse(stored));
    } catch {
      // Silently fail if sessionStorage is not available
    }
  }, []);

  // Add current route to tabs on navigation
  useEffect(() => {
    const file = allFiles.find(f => f.path === router.pathname);
    if (!file) return;

    setTabs(prev => {
      const exists = prev.find(t => t.path === file.path);
      if (exists) return prev;

      const newTab: RecentTab = {
        name: file.name,
        path: file.path,
        icon: file.icon,
      };

      const updated = [newTab, ...prev].slice(0, MAX_TABS);
      try {
        sessionStorage.setItem('recentTabs', JSON.stringify(updated));
      } catch {
        // Silently fail if sessionStorage is not available
      }
      return updated;
    });
  }, [router.pathname]);

  const closeTab = (path: string) => {
    setTabs(prev => {
      const updated = prev.filter(t => t.path !== path);
      try {
        sessionStorage.setItem('recentTabs', JSON.stringify(updated));
      } catch {
        // Silently fail if sessionStorage is not available
      }
      return updated;
    });
  };

  return { tabs, closeTab };
};
