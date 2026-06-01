import Tab from '@/components/Tab';
import { useRecentTabs } from '@/hooks/useRecentTabs';
import { rootFile } from '@/data/navigation';

import styles from '@/styles/Tabsbar.module.css';

const Tabsbar = () => {
  const { tabs, closeTab } = useRecentTabs();

  return (
    <div className={styles.tabs}>
      {/* Main.cpp always visible */}
      <div key={rootFile.name} className={styles.tabItem}>
        <Tab icon={rootFile.icon} filename={rootFile.name} path={rootFile.path} />
      </div>

      {/* Recent tabs */}
      {tabs.map(tab => (
        <div
          key={`recent-${tab.path}`}
          className={styles.tabItem}
        >
          <div className={styles.recentTab}>
            <Tab icon={tab.icon} filename={tab.name} path={tab.path} />
            <button
              className={styles.closeTab}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.path);
              }}
              aria-label={`Close ${tab.name}`}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tabsbar;
