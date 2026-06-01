import Tab from '@/components/Tab';
import { useRecentTabs } from '@/hooks/useRecentTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { rootFile } from '@/data/navigation';

import styles from '@/styles/Tabsbar.module.css';

const tabVariants = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -15 },
};

const Tabsbar = () => {
  const { tabs, closeTab } = useRecentTabs();

  return (
    <div className={styles.tabs}>
      {/* Main.cpp always visible */}
      <motion.div
        key={rootFile.name}
        variants={tabVariants}
        initial="initial"
        animate="animate"
        className={styles.tabItem}
      >
        <Tab icon={rootFile.icon} filename={rootFile.name} path={rootFile.path} />
      </motion.div>

      {/* Recent tabs */}
      <AnimatePresence>
        {tabs.map(tab => (
          <motion.div
            key={`recent-${tab.path}`}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Tabsbar;
