import Tab from '@/components/Tab';
import { useFolderContext } from '@/contexts/FolderContext';
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
    </div>
  );
};

export default Tabsbar;
