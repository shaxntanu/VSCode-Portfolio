import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/SourceControl.module.css';

export interface Commit {
  id: string;
  message: string;
  date: Date;
  author: string;
  tags: string[];
  impact: string;
  details?: string;
}

const commits: Commit[] = [
  {
    id: 'commit-1',
    message: 'feat: started embedded systems journey',
    author: 'Shantanu',
    date: new Date('2020-01-15'),
    tags: ['milestone', 'beginning'],
    impact: 'Started learning microcontroller programming with Arduino',
    details: 'Began exploring IoT and embedded systems through Arduino projects.',
  },
  {
    id: 'commit-2',
    message: 'feat: built ARC-4',
    author: 'Shantanu',
    date: new Date('2024-06-20'),
    tags: ['hardware', 'major'],
    impact: 'Advanced IoT platform with real-time capabilities',
    details: 'Developed ARC-4: A comprehensive IoT platform supporting multiple protocols.',
  },
  {
    id: 'commit-3',
    message: 'feat: launched Zephyr Station',
    author: 'Shantanu',
    date: new Date('2024-09-10'),
    tags: ['environmental-monitoring', 'deployed'],
    impact: 'ESP32-based environmental monitoring with cloud integration',
    details: 'Zephyr Station monitors multiple environmental sensors with real-time data streaming.',
  },
  {
    id: 'commit-4',
    message: 'feat: created Aether',
    author: 'Shantanu',
    date: new Date('2025-01-05'),
    tags: ['communication', 'advanced'],
    impact: 'Multi-band communication system with protocol flexibility',
    details: 'Aether enables seamless communication across multiple wireless protocols.',
  },
  {
    id: 'commit-5',
    message: 'feat: published research work',
    author: 'Shantanu',
    date: new Date('2025-02-14'),
    tags: ['research', 'documentation'],
    impact: 'Technical reports and whitepapers on embedded systems',
    details: 'Published comprehensive technical documentation on IoT implementations.',
  },
  {
    id: 'commit-6',
    message: 'feat: joined engineering projects',
    author: 'Shantanu',
    date: new Date('2025-03-01'),
    tags: ['collaboration', 'open-source'],
    impact: 'Contributing to community engineering initiatives',
    details: 'Started contributing to Arceus Labs and Ragastra projects.',
  },
];

interface SourceControlProps {
  onClose?: () => void;
}

const SourceControl = ({ onClose }: SourceControlProps) => {
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);

  return (
    <div className={styles.sourceControl}>
      <div className={styles.header}>
        <span className={styles.title}>Source Control</span>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close source control">
            ✕
          </button>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Commits</span>
          <span className={styles.value}>{commits.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Milestones</span>
          <span className={styles.value}>6</span>
        </div>
      </div>

      <div className={styles.timeline}>
        {commits.map((commit) => (
          <motion.div
            key={commit.id}
            className={styles.commitNode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.dot} />
            <div className={styles.commitContent}>
              <motion.div
                className={styles.commitHeader}
                onClick={() =>
                  setExpandedCommit(expandedCommit === commit.id ? null : commit.id)
                }
                whileHover={{ x: 5 }}
              >
                <span className={styles.message}>{commit.message}</span>
                <span className={styles.date}>
                  {commit.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </motion.div>

              <div className={styles.tags}>
                {commit.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <AnimatePresence>
                {expandedCommit === commit.id && (
                  <motion.div
                    className={styles.expandedDetails}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.impact}>
                      <span className={styles.label}>Impact:</span>
                      <span className={styles.text}>{commit.impact}</span>
                    </div>
                    {commit.details && (
                      <div className={styles.details}>
                        <span className={styles.label}>Details:</span>
                        <span className={styles.text}>{commit.details}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SourceControl;
