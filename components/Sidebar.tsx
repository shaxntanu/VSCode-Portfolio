import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  VscAccount,
  VscSettings,
  VscMail,
  VscGithubAlt,
  VscCode,
  VscFiles,
  VscEdit,
  VscMenu,
} from 'react-icons/vsc';
import { useFolderContext } from '@/contexts/FolderContext';
import { getBadgeForPath, formatBadgeCount } from '@/data/badges';

import styles from '@/styles/Sidebar.module.css';

const sidebarTopItems = [
  { Icon: VscFiles, path: '/' },
  { Icon: VscGithubAlt, path: '/github' },
  { Icon: VscCode, path: '/projects' },
  { Icon: VscEdit, path: '/publications' },
  { Icon: VscMail, path: '/contact' },
];

const sidebarBottomItems = [
  { Icon: VscAccount, path: '/about' },
  { Icon: VscSettings, path: '/settings' },
];

const Sidebar = () => {
  const router = useRouter();
  const { mobileMenuOpen, setMobileMenuOpen } = useFolderContext();
  const [githubRepoCount, setGithubRepoCount] = useState<number>(0);

  useEffect(() => {
    // Fetch GitHub repo count
    const fetchGitHubRepoCount = async () => {
      try {
        const response = await fetch('https://api.github.com/users/shaxntanu');
        const data = await response.json();
        if (data.public_repos) {
          setGithubRepoCount(data.public_repos);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub repo count:', error);
      }
    };

    fetchGitHubRepoCount();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path }) => {
          const badge = getBadgeForPath(path);
          // Use dynamic GitHub count if it's the GitHub path
          const badgeCount = path === '/github' && githubRepoCount > 0 
            ? githubRepoCount 
            : badge?.count || 0;
          
          return (
            <Link href={path} key={path}>
              <div
                className={`${styles.iconContainer} ${
                  router.pathname === path && styles.active
                }`}
              >
                <Icon
                  size={16}
                  fill={
                    router.pathname === path
                      ? 'rgb(225, 228, 232)'
                      : 'rgb(106, 115, 125)'
                  }
                  className={styles.icon}
                />
                {badge && badge.show && badgeCount > 0 && (
                  <span className={styles.badge}>{formatBadgeCount(badgeCount)}</span>
                )}
              </div>
            </Link>
          );
        })}
        <div className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <VscMenu
            size={16}
            fill="rgb(106, 115, 125)"
            className={styles.icon}
          />
        </div>
      </div>
      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map(({ Icon, path }) => (
          <div className={styles.iconContainer} key={path}>
            <Link href={path}>
              <Icon
                fill={
                  router.pathname === path
                    ? 'rgb(225, 228, 232)'
                    : 'rgb(106, 115, 125)'
                }
                className={styles.icon}
              />
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
