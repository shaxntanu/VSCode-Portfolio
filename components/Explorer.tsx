import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { VscChevronRight } from 'react-icons/vsc';
import { motion, AnimatePresence } from 'framer-motion';
import { useFolderContext } from '@/contexts/FolderContext';

import styles from '@/styles/Explorer.module.css';

const explorerItems = [
  {
    name: 'main.cpp',
    path: '/',
    icon: '/logos/cpp_icon.svg',
  },
  {
    name: 'about_datasheet.pdf',
    path: '/about',
    icon: '/logos/pdf_icon.svg',
  },
  {
    name: 'pinout_socials.json',
    path: '/contact',
    icon: '/logos/json_icon.svg',
  },
];

const developmentFiles = [
  {
    name: 'firmware.ino',
    path: '/projects',
    icon: '/logos/arduino_icon.svg',
    external: false,
  },
  {
    name: 'github.md',
    path: '/github',
    icon: '/logos/markdown_icon.svg',
    external: false,
  },
];

const skillsFiles = [
  {
    name: 'sm_techstack.csv',
    path: '/techstack',
    icon: '/logos/csv_icon.svg',
    external: false,
  },
  {
    name: 'skillmatrix.ipynb',
    path: '/skillmatrix',
    icon: '/logos/jupyter_icon.svg',
    external: false,
  },
  {
    name: 'keysprint.env',
    path: '/keysprint',
    icon: '/logos/env_icon.svg',
    external: false,
  },
];

const careerFiles = [
  {
    name: 'experience_log.md',
    path: '/experience',
    icon: '/logos/markdown_icon.svg',
    external: false,
  },
  {
    name: 'upgrades.yaml',
    path: '/certificates',
    icon: '/logos/yaml_icon.svg',
    external: false,
  },
];

const researchFiles = [
  {
    name: 'whitepapers.pdf',
    path: '/research',
    icon: '/logos/pdf_icon.svg',
    external: false,
  },
];

const resumeFiles = [
  {
    name: 'sysdrive_cv.iso',
    path: '/resume',
    icon: '/logos/iso_icon.svg',
    external: false,
  },
];

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
      <div>
        {/* main.cpp at root level */}
        <Link href="/" prefetch={true} onClick={(e) => handleNavigation(e, '/')}>
          <div className={styles.file}>
            <Image
              src="/logos/cpp_icon.svg"
              alt="main.cpp"
              height={18}
              width={18}
            />
            <p>main.cpp</p>
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
            <motion.div
              className={styles.files}
              initial="closed"
              animate="open"
              exit="closed"
              variants={containerVariants}
            >
              {explorerItems.slice(1).map((item) => (
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
              
              {/* DEVELOPMENT Folder */}
              <motion.div variants={itemVariants} layout>
                <div
                  className={styles.folder}
                  onClick={() => setDevelopmentOpen(!developmentOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={developmentOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>DEVELOPMENT</p>
                </div>
                <AnimatePresence initial={false}>
                  {developmentOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {developmentFiles.map((item) => (
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

              {/* SKILLS Folder */}
              <motion.div variants={itemVariants} layout>
                <div
                  className={styles.folder}
                  onClick={() => setSkillsOpen(!skillsOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={skillsOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>SKILLS</p>
                </div>
                <AnimatePresence initial={false}>
                  {skillsOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {skillsFiles.map((item) => (
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

              {/* CAREER Folder */}
              <motion.div variants={itemVariants} layout>
                <div
                  className={styles.folder}
                  onClick={() => setCareerOpen(!careerOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={careerOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>CAREER</p>
                </div>
                <AnimatePresence initial={false}>
                  {careerOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {careerFiles.map((item) => (
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

              {/* RESEARCH Folder */}
              <motion.div variants={itemVariants} layout>
                <div
                  className={styles.folder}
                  onClick={() => setResearchOpen(!researchOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={researchOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>RESEARCH</p>
                </div>
                <AnimatePresence initial={false}>
                  {researchOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {researchFiles.map((item) => (
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

              {/* RESUME Folder */}
              <motion.div variants={itemVariants} layout>
                <div
                  className={styles.folder}
                  onClick={() => setResumeOpen(!resumeOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={resumeOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>RESUME</p>
                </div>
                <AnimatePresence initial={false}>
                  {resumeOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {resumeFiles.map((item) => (
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

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};

export default Explorer;
