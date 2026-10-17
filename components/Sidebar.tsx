import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  { Icon: VscFiles, path: '/', label: 'Home' },
  { Icon: VscGithubAlt, path: '/github', label: 'GitHub' },
  { Icon: VscCode, path: '/projects', label: 'Projects' },
  { Icon: VscEdit, path: '/publications', label: 'Publications' },
  { Icon: VscMail, path: '/contact', label: 'Contact' },
];

const sidebarBottomItems = [
  { Icon: VscAccount, path: '/about', label: 'About' },
  { Icon: VscSettings, path: '/settings', label: 'Settings' },
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
    <nav className={styles.sidebar} aria-label="Primary navigation">
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path, label }) => {
          const badge = getBadgeForPath(path);
          // Use dynamic GitHub count if it's the GitHub path
          const badgeCount = path === '/github' && githubRepoCount > 0 
            ? githubRepoCount 
            : badge?.count || 0;
          
          return (
            <Link
              href={path}
              key={path}
              aria-label={label}
              aria-current={router.pathname === path ? 'page' : undefined}
              title={label}
            >
              <div
                className={`${styles.iconContainer} ${
                  router.pathname === path ? styles.active : ''
                }`}
              >
                {path === '/' ? (
                  <Image
                    src="/icons/files_green.svg"
                    alt="Explorer"
                    width={16}
                    height={16}
                    className={styles.icon}
                  />
                ) : (
                  <Icon
                    size={16}
                    fill={
                      router.pathname === path
                        ? 'rgb(225, 228, 232)'
                        : 'rgb(106, 115, 125)'
                    }
                    className={styles.icon}
                  />
                )}
                <span className={styles.navLabel}>{label}</span>
                {badge && badge.show && badgeCount > 0 && (
                  <span className={styles.badge}>{formatBadgeCount(badgeCount)}</span>
                )}
              </div>
            </Link>
          );
        })}
        <button
          className={styles.mobileMenuBtn}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          title="All pages"
        >
          <VscMenu
            size={16}
            className={styles.icon}
          />
          <span className={styles.menuLabel}>Menu</span>
        </button>
      </div>
      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map(({ Icon, path, label }) => (
          <div className={`${styles.iconContainer} ${router.pathname === path ? styles.active : ''}`} key={path}>
            <Link href={path} aria-label={label} title={label} aria-current={router.pathname === path ? 'page' : undefined}>
              <Icon className={styles.icon} />
              <span className={styles.navLabel}>{label}</span>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
