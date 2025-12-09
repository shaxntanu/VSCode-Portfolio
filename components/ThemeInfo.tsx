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
  const [currentTheme, setCurrentTheme] = useState<string>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || '';
    setCurrentTheme(savedTheme);
  }, []);

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setCurrentTheme(theme);
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
