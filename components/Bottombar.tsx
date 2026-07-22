import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { statusBarItems } from '@/data/statusbar';
import { useUIState } from '@/contexts/UIStateContext';
import { MdZoomOutMap } from 'react-icons/md';
import styles from '@/styles/Bottombar.module.css';

const Bottombar = () => {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState('Ayu Dark');
  const [liteMode, setLiteMode] = useState(true);
  const [buildDate, setBuildDate] = useState('Jun 2026');
  const { zenMode, setZenMode } = useUIState();

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
        <div key={item.id} className={className} title={item.tooltip}>
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
    <footer className={styles.bottomBar}>
      <div className={styles.container}>
        {leftItems.map(renderItem)}
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
  );
};

export default Bottombar;
