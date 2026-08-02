import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { statusBarItems } from '@/data/statusbar';
import { getStatusBarMetrics } from '@/data/telemetry';
import { useUIState } from '@/contexts/UIStateContext';
import { MdZoomOutMap } from 'react-icons/md';
import styles from '@/styles/Bottombar.module.css';

const Bottombar = () => {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState('Ayu Dark');
  const [liteMode, setLiteMode] = useState(true);
  const [buildDate, setBuildDate] = useState('Jun 2026');
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  const { zenMode, setZenMode } = useUIState();
  
  // Telemetry rotation state
  const [telemetryMetrics] = useState(() => getStatusBarMetrics());
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);

  useEffect(() => {
    const updateThemeAndMode = () => {
      const savedLiteMode = localStorage.getItem('liteMode');
      const isLiteMode = savedLiteMode === null ? true : savedLiteMode === 'true';
      setLiteMode(isLiteMode);

      const theme = localStorage.getItem('theme') || 'ayu-dark';
      const themeNames: { [key: string]: string } = {
        'github-dark': 'GitHub Dark',
        'dracula': 'Dracula',
        'ayu-dark': 'Ayu Dark',
        'ayu-mirage': 'Ayu Mirage',
        'nord': 'Nord',
        'night-owl': 'Night Owl',
        'dark-plus': 'Dark+',
        'tokyo-night': 'Tokyo Night',
        'catppuccin': 'Catppuccin',
      };
      setCurrentTheme(themeNames[theme] || 'Ayu Dark');
    };

    updateThemeAndMode();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'liteMode') {
        updateThemeAndMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChanged', updateThemeAndMode);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', updateThemeAndMode);
    };
  }, []);

  // Update build date dynamically
  useEffect(() => {
    const updateBuildDate = () => {
      const buildDateMeta = document.querySelector('meta[name="build-date"]');
      if (buildDateMeta) {
        const date = buildDateMeta.getAttribute('content');
        if (date) {
          setBuildDate(`Updated: ${date}`);
        }
      }
    };

    // Check immediately
    updateBuildDate();

    // Check periodically for updates
    const interval = setInterval(updateBuildDate, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Rotate telemetry metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetricIndex((prev) => (prev + 1) % telemetryMetrics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [telemetryMetrics.length]);

  const leftItems = statusBarItems.filter(item => item.side === 'left').sort((a, b) => a.priority - b.priority);
  const rightItems = statusBarItems.filter(item => item.side === 'right').sort((a, b) => a.priority - b.priority);

  const renderItem = (item: typeof statusBarItems[0]) => {
    const content = (
      <>
        {item.icon && <item.icon className={styles.icon} />}
        <span>{item.text}</span>
      </>
    );

    const className = `${styles.section} ${styles[`priority${item.priority}`]}`;

    if (item.id === 'last-updated') {
      return (
        <div 
          key={item.id} 
          className={className} 
          title={item.tooltip}
          onClick={() => setShowBuildInfo(true)}
          style={{ cursor: 'pointer' }}
        >
          <span>{buildDate}</span>
        </div>
      );
    }

    if (item.link) {
      return (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noreferrer noopener"
          className={className}
          title={item.tooltip}
        >
          {content}
        </a>
      );
    }

    return (
      <div key={item.id} className={className} title={item.tooltip}>
        {content}
      </div>
    );
  };

  // When in zen mode, show only the exit button
  if (zenMode) {
    return (
      <footer className={styles.bottomBar}>
        <div className={styles.container}>
          {leftItems.map(renderItem)}
        </div>
        <div className={styles.container}>
          <button
            className={`${styles.section} ${styles.modeButton}`}
            onClick={() => setZenMode(!zenMode)}
            title="Exit Zen Mode"
          >
            <MdZoomOutMap className={styles.icon} />
            <span>Zen</span>
          </button>
          {rightItems.map(renderItem)}
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer className={styles.bottomBar}>
        <div className={styles.container}>
          {leftItems.map(renderItem)}
          {/* Telemetry metrics with smooth rotation */}
          <div 
            className={`${styles.section} ${styles.telemetry}`}
            title="Portfolio telemetry - Auto-generated from project data"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentMetricIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', width: '100%', textAlign: 'center' }}
              >
                {telemetryMetrics[currentMetricIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className={styles.container}>
          <button
            className={`${styles.section} ${styles.modeButton} ${zenMode ? styles.active : ''}`}
            onClick={() => setZenMode(!zenMode)}
            title={zenMode ? 'Exit Zen Mode' : 'Enter Zen Mode (Hides all UI)'}
          >
            <MdZoomOutMap className={styles.icon} />
            <span>Zen</span>
          </button>
          <div
            className={`${styles.section} ${styles.priority11}`}
            onClick={() => router.push('/settings')}
            title="Click to open Settings"
            style={{ cursor: 'pointer' }}
          >
            <span>[{currentTheme}]</span>
          </div>
          <div
            className={`${styles.section} ${styles.priority12}`}
            onClick={() => router.push('/settings')}
            title="Click to open Settings"
            style={{ cursor: 'pointer' }}
          >
            <span>[{liteMode ? 'Lite Mode' : 'Full Mode'}]</span>
          </div>
          {rightItems.map(renderItem)}
        </div>
      </footer>

      {/* Build Info Modal */}
      <AnimatePresence>
        {showBuildInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modalBackdrop}
              onClick={() => setShowBuildInfo(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className={styles.buildInfoModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Build Information</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowBuildInfo(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.buildInfoRow}>
                  <span className={styles.buildLabel}>Last Updated:</span>
                  <span className={styles.buildValue}>{buildDate.replace('Updated: ', '')}</span>
                </div>
                <div className={styles.buildInfoRow}>
                  <span className={styles.buildLabel}>Deployment Date:</span>
                  <span className={styles.buildValue}>
                    {process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className={styles.buildInfoRow}>
                  <span className={styles.buildLabel}>Deployment Time (IST):</span>
                  <span className={styles.buildValue}>
                    {process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                      timeZone: 'Asia/Kolkata'
                    }) + ' IST'}
                  </span>
                </div>
                <div className={styles.buildInfoRow}>
                  <span className={styles.buildLabel}>Version:</span>
                  <span className={styles.buildValue}>v2.0</span>
                </div>
                <div className={styles.buildInfoRow}>
                  <span className={styles.buildLabel}>Framework:</span>
                  <span className={styles.buildValue}>Next.js 15</span>
                </div>
                <div className={styles.buildInfoRow}>
                  <span className={styles.buildLabel}>Status:</span>
                  <span className={styles.buildValue}>✓ Build Successful</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Bottombar;
