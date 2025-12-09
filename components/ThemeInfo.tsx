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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'ayu-dark';
    setCurrentTheme(savedTheme);

    // Listen for theme changes from other components
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('theme') || 'ayu-dark';
      setCurrentTheme(updatedTheme);
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
    setCurrentTheme(newTheme);
    // Dispatch custom event to notify other ThemeInfo components
    window.dispatchEvent(new Event('themeChange'));
  };

  const isActive = currentTheme === theme;

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={icon}
          alt={name}
          height={80}
          width={80}
          className={styles.themeImage}
        />
      </div>
      <div className={styles.info}>
        <div>
          <h3>{name}</h3>
          <h5>{publisher}</h5>
        </div>
        <button 
          onClick={() => setTheme(theme)}
          className={isActive ? styles.activeButton : ''}
        >
          {isActive ? 'In Use' : 'Set Color Theme'}
        </button>
      </div>
    </div>
  );
};

export default ThemeInfo;
