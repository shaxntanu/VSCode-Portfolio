import { useState, useEffect } from 'react';
import Image from 'next/image';

import styles from '@/styles/ThemeInfo.module.css';

interface ThemeInfoProps {
  icon: string;
  name: string;
  publisher: string;
  theme: string;
}

const ThemeInfo = ({ icon, name, publisher, theme }: ThemeInfoProps) => {
  const [currentTheme, setCurrentTheme] = useState<string>('ayu-dark');
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'ayu-dark';
    setCurrentTheme(savedTheme);

    // Check if currently in light mode
    const lightThemes = ['light', 'light-plus', 'github-light', 'vscode-light'];
    setIsLightMode(lightThemes.includes(savedTheme));

    // Listen for theme changes from other components
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('theme') || 'ayu-dark';
      setCurrentTheme(updatedTheme);
      setIsLightMode(lightThemes.includes(updatedTheme));
    };

    // Custom event for same-tab theme changes
    window.addEventListener('themeChange', handleStorageChange);
    // Storage event for cross-tab changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('themeChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = (newTheme: string) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('savedDarkTheme', newTheme); // Save as the preferred dark theme
    setCurrentTheme(newTheme);
    // Dispatch custom events to notify other components
    window.dispatchEvent(new Event('themeChange'));
    window.dispatchEvent(new Event('themeChanged'));
  };

  const isActive = currentTheme === theme;
  const isDisabled = isLightMode;

  return (
    <div className={`${styles.container} ${isDisabled ? styles.disabled : ''}`}>
      <div className={styles.imageWrapper}>
        <Image
          src={icon}
          alt={name}
          height={80}
          width={80}
          className={styles.themeImage}
          style={{ opacity: isDisabled ? 0.5 : 1 }}
        />
      </div>
      <div className={styles.info}>
        <div>
          <h3 style={{ opacity: isDisabled ? 0.5 : 1 }}>{name}</h3>
          <h5 style={{ opacity: isDisabled ? 0.5 : 1 }}>{publisher}</h5>
        </div>
        <button
          onClick={() => setTheme(theme)}
          className={isActive ? styles.activeButton : ''}
          disabled={isDisabled}
        >
          {isActive ? 'In Use' : 'Set Color Theme'}
        </button>
      </div>
    </div>
  );
};

export default ThemeInfo;
