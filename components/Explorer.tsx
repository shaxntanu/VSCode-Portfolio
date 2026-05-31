import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { VscChevronRight } from 'react-icons/vsc';
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
    developmentOpen,
    setDevelopmentOpen,
    skillsOpen,
    setSkillsOpen,
    careerOpen,
    setCareerOpen,
    researchOpen,
    setResearchOpen,
    resumeOpen,
    setResumeOpen,
  } = useFolderContext();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Get the appropriate open/set functions for each folder
  const getFolderState = (folderId: string) => {
    switch (folderId) {
      case 'development':
        return { open: developmentOpen, setOpen: setDevelopmentOpen };
      case 'skills':
        return { open: skillsOpen, setOpen: setSkillsOpen };
      case 'career':
        return { open: careerOpen, setOpen: setCareerOpen };
      case 'research':
        return { open: researchOpen, setOpen: setResearchOpen };
      case 'resume':
        return { open: resumeOpen, setOpen: setResumeOpen };
      default:
        return { open: false, setOpen: () => {} };
    }
  };

  // Simplified variants for mobile (no stagger, instant)
  const containerVariants = {
    open: {
      transition: {
        staggerChildren: isMobile ? 0 : 0.03,
        delayChildren: isMobile ? 0 : 0.02,
      },
    },
    closed: {
      transition: {
        staggerChildren: isMobile ? 0 : 0.02,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0.1 : 0.2 },
    },
    closed: {
      opacity: 0,
      y: isMobile ? 0 : -8,
      transition: { duration: isMobile ? 0.1 : 0.2 },
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
          <div className={styles.file}>
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
                    <div className={styles.file}>
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
                const { open, setOpen } = getFolderState(folder.id);
                return (
                  <motion.div key={folder.id} variants={itemVariants}>
                    <div
                      className={styles.folder}
                      onClick={() => setOpen(!open)}
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
                                <div className={styles.file}>
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
          onClick={() => {
            const allExpanded = portfolioOpen && developmentOpen && skillsOpen && careerOpen && researchOpen && resumeOpen;
            if (allExpanded) {
              setPortfolioOpen(false);
              setDevelopmentOpen(false);
              setSkillsOpen(false);
              setCareerOpen(false);
              setResearchOpen(false);
              setResumeOpen(false);
            } else {
              setPortfolioOpen(true);
              setDevelopmentOpen(true);
              setSkillsOpen(true);
              setCareerOpen(true);
              setResearchOpen(true);
              setResumeOpen(true);
            }
          }}
        >
          <span className={styles.buttonShadow}></span>
          <span className={styles.buttonEdge}></span>
          <div className={styles.buttonFront}>
            <span className={styles.buttonText}>
              {portfolioOpen && developmentOpen && skillsOpen && careerOpen && researchOpen && resumeOpen 
                ? 'Collapse All' 
                : 'Expand All'}
            </span>
          </div>
        </button>
      </div>
    </div>
    </>
  );
};

export default Explorer;
