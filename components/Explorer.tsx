import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
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

const cvSystemFiles = [
  {
    name: 'firmware.ino',
    path: '/projects',
    icon: '/logos/arduino_icon.svg',
    external: false,
  },
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
    name: 'experience_log.md',
    path: '/experience',
    icon: '/logos/markdown_icon.svg',
    external: false,
  },
  {
    name: 'whitepapers.pdf',
    path: '/research',
    icon: '/logos/pdf_icon.svg',
    external: false,
  },
  {
    name: 'sysdrive_cv.iso',
    path: '/resume',
    icon: '/logos/iso_icon.svg',
    external: false,
  },
];

const githubFiles = [
  {
    name: 'github.md',
    path: '/github',
    icon: '/logos/markdown_icon.svg',
    external: false,
  },
  {
    name: 'readme.md',
    path: '/readme',
    icon: '/logos/markdown_icon.svg',
    external: false,
  },
];

const miscLogsFiles = [
  {
    name: 'input_latency.py',
    path: '/typing',
    icon: '/logos/python_icon.svg',
    external: false,
  },
];

// Container variants for staggered children
const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

// Item variants for individual files
const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
  },
  closed: {
    opacity: 0,
    y: -8,
  },
};

const Explorer = () => {
  const { portfolioOpen, setPortfolioOpen, cvFolderOpen, setCvFolderOpen, githubFolderOpen, setGithubFolderOpen, miscLogsOpen, setMiscLogsOpen, mobileMenuOpen, setMobileMenuOpen } = useFolderContext();
  const router = useRouter();

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
              <motion.div variants={itemVariants}>
                <div
                  className={styles.folder}
                  onClick={() => setCvFolderOpen(!cvFolderOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={cvFolderOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>CV_SYSTEMFILES</p>
                </div>
                <AnimatePresence initial={false}>
                  {cvFolderOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {cvSystemFiles.map((item) => (
                        <motion.div key={item.name} variants={itemVariants}>
                          {item.external ? (
                            <a href={item.path} target="_blank" rel="noopener noreferrer">
                              <div className={styles.file}>
                                <Image
                                  src={item.icon}
                                  alt={item.name}
                                  height={18}
                                  width={18}
                                />
                                <p>{item.name}</p>
                              </div>
                            </a>
                          ) : (
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
                          )}
                        </motion.div>
                      ))}
                      <motion.div variants={itemVariants}>
                        <div
                          className={styles.nestedFolder}
                          onClick={() => setGithubFolderOpen(!githubFolderOpen)}
                        >
                          <VscChevronRight
                            className={styles.chevron}
                            style={githubFolderOpen ? { transform: 'rotate(90deg)' } : {}}
                          />
                          <p>GITHUB</p>
                        </div>
                        <AnimatePresence initial={false}>
                          {githubFolderOpen && (
                            <motion.div
                              className={styles.doubleNestedFiles}
                              initial="closed"
                              animate="open"
                              exit="closed"
                              variants={containerVariants}
                            >
                              {githubFiles.map((item) => (
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
              </motion.div>
              <motion.div variants={itemVariants}>
                <div
                  className={styles.folder}
                  onClick={() => setMiscLogsOpen(!miscLogsOpen)}
                >
                  <VscChevronRight
                    className={styles.chevron}
                    style={miscLogsOpen ? { transform: 'rotate(90deg)' } : {}}
                  />
                  <p>MISC_LOGS</p>
                </div>
                <AnimatePresence initial={false}>
                  {miscLogsOpen && (
                    <motion.div
                      className={styles.nestedFiles}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={containerVariants}
                    >
                      {miscLogsFiles.map((item) => (
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
