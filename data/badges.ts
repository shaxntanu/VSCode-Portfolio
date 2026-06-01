import { ActivityBadge } from '@/types/statusbar';
import { projects } from './projects';

// Count publications from the publications page data
const publicationsCount = 9; // 8 papers + 1 blog

// Count certificates from certificates page data
const certificatesCount = 13; // Total courses across all categories

// Calculate project count dynamically
const projectsCount = projects.length;

// GitHub repos count - this will be dynamic from the GitHub API
// For now, we'll use a placeholder that can be updated
const githubReposCount = 10;

export const activityBadges: ActivityBadge[] = [
  {
    path: '/',
    count: 0,
    show: false, // Explorer has no badge
  },
  {
    path: '/github',
    count: githubReposCount,
    show: true,
  },
  {
    path: '/projects',
    count: projectsCount,
    show: true,
  },
  {
    path: '/publications',
    count: publicationsCount,
    show: true,
  },
  {
    path: '/contact',
    count: 0,
    show: false, // Contact has no badge
  },
];

// Helper function to get badge for a specific path
export const getBadgeForPath = (path: string): ActivityBadge | undefined => {
  return activityBadges.find(badge => badge.path === path);
};
