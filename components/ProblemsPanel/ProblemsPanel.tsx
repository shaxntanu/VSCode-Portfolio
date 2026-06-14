import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/contexts/UIStateContext';
import styles from '@/styles/ProblemsPanel.module.css';

export interface Problem {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  line?: number;
}

const problems: Problem[] = [
  {
    id: '1',
    type: 'warning',
    message: 'TODO: Touch grass occasionally',
    source: 'lifestyle.ts',
    line: 42,
  },
  {
    id: '2',
    type: 'warning',
    message: 'Coffee dependency exceeds safe threshold',
    source: 'health.ts',
    line: 128,
  },
  {
    id: '3',
    type: 'info',
    message: 'Currently building cool stuff',
    source: 'projects.ts',
    line: 1,
  },
  {
    id: '4',
    type: 'info',
    message: 'Embedded systems obsession detected',
    source: 'mindset.ts',
    line: 99,
  },
];

const ProblemsPanel = () => {
  const { problemsOpen, setProblemsOpen } = useUIState();
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const filtered =
    filterType === 'all' ? problems : problems.filter((p) => p.type === filterType);

  const errorCount = problems.filter((p) => p.type === 'error').length;
  const warningCount = problems.filter((p) => p.type === 'warning').length;
  const infoCount = problems.filter((p) => p.type === 'info').length;

  return (
    <AnimatePresence>
      {problemsOpen && (
        <motion.div
          className={styles.panel}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.header}>
            <span className={styles.title}>Problems</span>
            <button
              className={styles.closeBtn}
              onClick={() => setProblemsOpen(false)}
              aria-label="Close problems panel"
            >
              ✕
            </button>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${filterType === 'all' ? styles.active : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({problems.length})
            </button>
            {errorCount > 0 && (
              <button
                className={`${styles.tab} ${filterType === 'error' ? styles.active : ''}`}
                onClick={() => setFilterType('error')}
              >
                ❌ Errors ({errorCount})
              </button>
            )}
            {warningCount > 0 && (
              <button
                className={`${styles.tab} ${filterType === 'warning' ? styles.active : ''}`}
                onClick={() => setFilterType('warning')}
              >
                ⚠ Warnings ({warningCount})
              </button>
            )}
            {infoCount > 0 && (
              <button
                className={`${styles.tab} ${filterType === 'info' ? styles.active : ''}`}
                onClick={() => setFilterType('info')}
              >
                ℹ Info ({infoCount})
              </button>
            )}
          </div>

          <div className={styles.content}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>No problems found</div>
            ) : (
              filtered.map((problem) => (
                <div
                  key={problem.id}
                  className={`${styles.problem} ${styles[problem.type]}`}
                >
                  <span className={styles.icon}>
                    {problem.type === 'error' && '❌'}
                    {problem.type === 'warning' && '⚠'}
                    {problem.type === 'info' && 'ℹ'}
                  </span>
                  <div className={styles.details}>
                    <div className={styles.message}>{problem.message}</div>
                    <div className={styles.source}>
                      {problem.source}
                      {problem.line && `:${problem.line}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProblemsPanel;
