import Tab from '@/components/Tab';
import { useFolderContext } from '@/contexts/FolderContext';
import { useRecentTabs } from '@/hooks/useRecentTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { rootFile, portfolioFiles, navFolders } from '@/data/navigation';

import styles from '@/styles/Tabsbar.module.css';

const tabVariants = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -15 },
};

const Tabsbar = () => {
  const { 
    portfolioOpen, 
    developmentOpen, 
    skillsOpen, 
    careerOpen, 
    researchOpen, 
    resumeOpen 
  } = useFolderContext();
  const { tabs, closeTab } = useRecentTabs();

  // Get the appropriate open state for each folder
  const getFolderOpen = (folderId: string) => {
    switch (folderId) {
      case 'development':
        return developmentOpen;
      case 'skills':
        return skillsOpen;
      case 'career':
        return careerOpen;
      case 'research':
        return researchOpen;
      case 'resume':
        return resumeOpen;
      default:
        return false;
    }
  };

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

      {/* Portfolio folder files */}
      <AnimatePresence>
        {portfolioOpen && (
          <>
            {portfolioFiles.map((file) => (
              <motion.div
                key={file.name}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={styles.tabItem}
              >
                <Tab icon={file.icon} filename={file.name} path={file.path} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Dynamic folder files */}
      <AnimatePresence>
        {portfolioOpen && navFolders.map((folder) => {
          const folderOpen = getFolderOpen(folder.id);
          return folderOpen ? folder.files.map((file) => (
            <motion.div
              key={file.name}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon={file.icon} filename={file.name} path={file.path} />
            </motion.div>
          )) : null;
        })}
      </AnimatePresence>

      {/* Recent tabs */}
      <AnimatePresence>
        {tabs.filter(tab => {
          const alreadyShown = [
            '/',
            ...(portfolioOpen ? portfolioFiles.map(f => f.path) : []),
            ...(portfolioOpen && developmentOpen ? navFolders.find(f => f.id === 'development')?.files.map(f => f.path) ?? [] : []),
            ...(portfolioOpen && skillsOpen ? navFolders.find(f => f.id === 'skills')?.files.map(f => f.path) ?? [] : []),
            ...(portfolioOpen && careerOpen ? navFolders.find(f => f.id === 'career')?.files.map(f => f.path) ?? [] : []),
            ...(portfolioOpen && researchOpen ? navFolders.find(f => f.id === 'research')?.files.map(f => f.path) ?? [] : []),
            ...(portfolioOpen && resumeOpen ? navFolders.find(f => f.id === 'resume')?.files.map(f => f.path) ?? [] : []),
          ];
          return !alreadyShown.includes(tab.path);
        }).map(tab => (
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
