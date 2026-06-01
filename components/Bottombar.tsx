import { useState, useEffect } from 'react';
import { statusBarItems } from '@/data/statusbar';
import styles from '@/styles/Bottombar.module.css';

const Bottombar = () => {
  const [currentTheme, setCurrentTheme] = useState('Ayu Dark');
  const [liteMode, setLiteMode] = useState(true);

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

  return (
    <footer className={styles.bottomBar}>
      <div className={styles.container}>
        {leftItems.map(renderItem)}
      </div>
      <div className={styles.container}>
        <div className={`${styles.section} ${styles.priority11}`} title="Current Theme">
          <span>[{currentTheme}]</span>
        </div>
        <div className={`${styles.section} ${styles.priority12}`} title="Current Mode">
          <span>[{liteMode ? 'Lite Mode' : 'Full Mode'}]</span>
        </div>
        {rightItems.map(renderItem)}
      </div>
    </footer>
  );
};

export default Bottombar;
