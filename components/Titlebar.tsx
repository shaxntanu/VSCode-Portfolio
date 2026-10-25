import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Maximize, Minimize } from 'lucide-react';

import styles from '@/styles/Titlebar.module.css';

const Titlebar = () => {
  const router = useRouter();
  const [liteMode, setLiteMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('Ayu Dark');
  const [isMaximized, setIsMaximized] = useState(false);

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
        'light': 'Light',
      };
      setCurrentTheme(themeNames[theme] || 'Ayu Dark');
    };

    // Check initial fullscreen state
    setIsMaximized(!!document.fullscreenElement);

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsMaximized(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initial load
    updateThemeAndMode();

    // Listen for storage changes (when theme/mode changes in settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'liteMode') {
        updateThemeAndMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event for same-window updates
    const handleCustomUpdate = () => {
      updateThemeAndMode();
    };

    window.addEventListener('themeChanged', handleCustomUpdate);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleCustomUpdate);
    };
  }, []);

  const allPaths = ['/about', '/contact', '/projects', '/techstack', '/github', '/experience'];
  const compactThemeName: Record<string, string> = {
    'GitHub Dark': 'GitHub',
    'Ayu Dark': 'Ayu',
    'Ayu Mirage': 'Mirage',
    'Night Owl': 'Night Owl',
  };

  const handleMaximize = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleMenuClick = (menu: string) => {
    switch (menu) {
      case 'File':
        router.push('/publications');
        break;
      case 'View':
        router.push('/');
        break;
      case 'Go':
        const randomPath = allPaths[Math.floor(Math.random() * allPaths.length)];
        router.push(randomPath);
        break;
      case 'Run':
        router.push('/resume');
        break;
      case 'Terminal':
        router.push('/experience');
        break;
      case 'Help':
        router.push('/contact');
        break;
      default:
        break;
    }
  };

  return (
    <section className={styles.titlebar}>
      <Image
        src="/logos/vscode_icon.svg"
        alt="VSCode Icon"
        height={15}
        width={15}
        className={styles.icon}
      />
      <div className={styles.items}>
        <p onClick={() => handleMenuClick('File')}>File</p>
        <p onClick={() => handleMenuClick('View')}>View</p>
        <p onClick={() => handleMenuClick('Go')}>Go</p>
        <p onClick={() => handleMenuClick('Run')}>Run</p>
        <p onClick={() => handleMenuClick('Terminal')}>Terminal</p>
        <p onClick={() => handleMenuClick('Help')}>Help</p>
      </div>
      <div className={styles.title}>
        <span className={styles.titleName}>
          <span className={styles.fullTitleName}>Shantanu - Visual Studio Code</span>
          <span className={styles.compactTitleName}>Shantanu - VS Code</span>
        </span>
        <button
          type="button"
          className={styles.themeIndicator}
          onClick={() => router.push('/settings')}
          aria-label={`Open settings. Current theme: ${currentTheme}`}
          title={`Open settings — current theme: ${currentTheme}`}
        >
          <span className={styles.fullIndicator}>[{currentTheme}]</span>
          <span className={styles.compactIndicator}>[{compactThemeName[currentTheme] || currentTheme}]</span>
        </button>
        <button
          type="button"
          className={styles.modeIndicator}
          onClick={() => router.push('/settings')}
          aria-label={`Open settings. Current mode: ${liteMode ? 'Lite Mode' : 'Full Mode'}`}
          title={`Open settings — current mode: ${liteMode ? 'Lite Mode' : 'Full Mode'}`}
        >
          <span className={styles.fullIndicator}>[{liteMode ? 'Lite Mode' : 'Full Mode'}]</span>
          <span className={styles.compactIndicator}>[{liteMode ? 'Lite' : 'Full'}]</span>
        </button>
      </div>
      <div className={styles.windowButtons}>
        <button 
          className={styles.maximize} 
          onClick={handleMaximize}
          title={isMaximized ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isMaximized ? (
            <Minimize size={8} />
          ) : (
            <Maximize size={8} />
          )}
        </button>
      </div>
    </section>
  );
};

export default Titlebar;
