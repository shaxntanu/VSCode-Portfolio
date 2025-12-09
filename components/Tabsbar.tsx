import Tab from '@/components/Tab';
import { useFolderContext } from '@/contexts/FolderContext';
import { motion, AnimatePresence } from 'framer-motion';

import styles from '@/styles/Tabsbar.module.css';

const tabVariants = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -15 },
};

const Tabsbar = () => {
  const { portfolioOpen, cvFolderOpen, miscLogsOpen } = useFolderContext();

  return (
    <div className={styles.tabs}>
      {/* Main.cpp always visible */}
      <motion.div
        key="main-cpp"
        variants={tabVariants}
        initial="initial"
        animate="animate"
        className={styles.tabItem}
      >
        <Tab icon="/logos/cpp_icon.svg" filename="main.cpp" path="/" />
      </motion.div>

      {/* Portfolio folder files */}
      <AnimatePresence>
        {portfolioOpen && (
          <>
            <motion.div
              key="about-pdf"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/pdf_icon.svg" filename="about_datasheet.pdf" path="/about" />
            </motion.div>
            <motion.div
              key="contact-json"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/json_icon.svg" filename="pinout_socials.json" path="/contact" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CV_SYSTEMFILES folder files */}
      <AnimatePresence>
        {portfolioOpen && cvFolderOpen && (
          <>
            <motion.div
              key="github-md"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/markdown_icon.svg" filename="github.md" path="/github" />
            </motion.div>
            <motion.div
              key="firmware-ino"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/arduino_icon.svg" filename="firmware.ino" path="/projects" />
            </motion.div>
            <motion.div
              key="upgrades-yaml"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/yaml_icon.svg" filename="upgrades.yaml" path="/certificates" />
            </motion.div>
            <motion.div
              key="techstack-csv"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/csv_icon.svg" filename="sm_techstack.csv" path="/techstack" />
            </motion.div>
            <motion.div
              key="skillmatrix-ipynb"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/jupyter_icon.svg" filename="skillmatrix.ipynb" path="/skillmatrix" />
            </motion.div>
            <motion.div
              key="experience-md"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/markdown_icon.svg" filename="experience_log.md" path="/experience" />
            </motion.div>
            <motion.div
              key="research-pdf"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/pdf_icon.svg" filename="whitepapers.pdf" path="/research" />
            </motion.div>
            <motion.div
              key="resume-iso"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.tabItem}
            >
              <Tab icon="/logos/iso_icon.svg" filename="sysdrive_cv.iso" path="/resume" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MISC_LOGS folder files */}
      <AnimatePresence>
        {portfolioOpen && miscLogsOpen && (
          <motion.div
            key="input-latency-py"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={styles.tabItem}
          >
            <Tab icon="/logos/python_icon.svg" filename="input_latency.py" path="/typing" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tabsbar;
