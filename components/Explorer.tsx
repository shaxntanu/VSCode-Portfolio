import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { VscChevronRight } from 'react-icons/vsc';
import { SiMedium } from 'react-icons/si';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useFolderContext } from '@/contexts/FolderContext';
import { rootFile, portfolioFiles, navFolders } from '@/data/navigation';

import styles from '@/styles/Explorer.module.css';

const Explorer = () => {
  const { 
    portfolioOpen, 
    setPortfolioOpen, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    folderStates,
    setFolderOpen,
  } = useFolderContext();
  const router = useRouter();

  const allFoldersExpanded = navFolders.every((folder) => folderStates[folder.id]);
  const allExpanded = portfolioOpen && allFoldersExpanded;

  // No animations - instant open/close
  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0 },
    },
    closed: {
      opacity: 0,
      y: 0,
      transition: { duration: 0 },
    },
  };

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (router.pathname !== path) {
      router.push(path, undefined, { scroll: false });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${mobileMenuOpen ? styles.visible : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <div className={`${styles.explorer} ${mobileMenuOpen ? styles.open : ''}`}>
      <p className={styles.title}>Explorer</p>
      <div className={styles.scrollableContent}>
        {/* main.cpp at root level */}
        <Link href={rootFile.path} prefetch={true} onClick={(e) => handleNavigation(e, rootFile.path)}>
          <div className={`${styles.file} ${router.pathname === rootFile.path ? styles.activeFile : ''}`}>
            <Image
              src={rootFile.icon}
              alt={rootFile.name}
              height={18}
              width={18}
            />
            <p>{rootFile.name}</p>
          </div>
        </Link>

        <div
          className={styles.heading}
          onClick={() => setPortfolioOpen(!portfolioOpen)}
        >
          <VscChevronRight
            className={styles.chevron}
            style={portfolioOpen ? { transform: 'rotate(90deg)' } : {}}
          />
          Portfolio
        </div>
        <AnimatePresence initial={false}>
          {portfolioOpen && (
            <LayoutGroup>
            <motion.div
              className={styles.files}
              initial="closed"
              animate="open"
              exit="closed"
              variants={containerVariants}
            >
              {portfolioFiles.map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link href={item.path} prefetch={true} onClick={(e) => handleNavigation(e, item.path)}>
                    <div className={`${styles.file} ${router.pathname === item.path ? styles.activeFile : ''}`}>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        height={18}
                        width={18}
                      />
                      <p>{item.name}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {/* Dynamic Folders */}
              {navFolders.map((folder) => {
                const open = folderStates[folder.id] ?? false;
                return (
                  <motion.div key={folder.id} variants={itemVariants}>
                    <div
                      className={styles.folder}
                      onClick={() => setFolderOpen(folder.id, !open)}
                    >
                      <VscChevronRight
                        className={styles.chevron}
                        style={open ? { transform: 'rotate(90deg)' } : {}}
                      />
                      <p>{folder.label}</p>
                    </div>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          className={styles.nestedFiles}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={containerVariants}
                        >
                          {folder.files.map((item) => (
                            <motion.div key={item.name} variants={itemVariants}>
                              <Link href={item.path} prefetch={true} onClick={(e) => handleNavigation(e, item.path)}>
                                <div className={`${styles.file} ${router.pathname === item.path ? styles.activeFile : ''}`}>
                                  {item.iconType === 'component' ? (
                                    item.icon === 'medium' ? (
                                      <SiMedium />
                                    ) : null
                                  ) : item.iconType === 'svg' ? (
                                    <Image
                                      src={item.icon}
                                      alt={item.name}
                                      height={18}
                                      width={18}
                                    />
                                  ) : (
                                    <Image
                                      src={item.icon}
                                      alt={item.name}
                                      height={18}
                                      width={18}
                                    />
                                  )}
                                  <p>{item.name}</p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

            </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse All Button */}
      <div className={styles.expandButtonWrapper}>
        <button 
          className={styles.expandButton}
          type="button"
          aria-label={allExpanded ? 'Collapse all navigation folders' : 'Expand all navigation folders'}
          onClick={() => {
            const shouldExpand = !allExpanded;
            setPortfolioOpen(shouldExpand);
            navFolders.forEach((folder) => setFolderOpen(folder.id, shouldExpand));
          }}
        >
          <span className={styles.buttonShadow}></span>
          <span className={styles.buttonEdge}></span>
          <div className={styles.buttonFront}>
            <span className={styles.buttonText}>
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </span>
          </div>
        </button>
      </div>
    </div>
    </>
  );
};

export default Explorer;
