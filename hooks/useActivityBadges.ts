import { useState, useEffect } from 'react';
import { ActivityBadge } from '@/types';
import { activityBadges } from '@/data/badges';

/**
 * Hook to get activity badges with optional dynamic GitHub repo count
 * @param githubRepoCount - Optional dynamic GitHub repo count from API
 * @returns Array of activity badges
 */
export const useActivityBadges = (githubRepoCount?: number): ActivityBadge[] => {
  const [badges, setBadges] = useState<ActivityBadge[]>(activityBadges);

  useEffect(() => {
    if (githubRepoCount !== undefined) {
      setBadges(prevBadges =>
        prevBadges.map(badge =>
          badge.path === '/github'
            ? { ...badge, count: githubRepoCount }
            : badge
        )
      );
    }
  }, [githubRepoCount]);

  return badges;
};
