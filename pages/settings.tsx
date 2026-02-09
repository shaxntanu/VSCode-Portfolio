import { useState, useEffect } from 'react';
import ThemeInfo from '@/components/ThemeInfo';

import styles from '@/styles/SettingsPage.module.css';

const SettingsPage = () => {
  const [liteMode, setLiteMode] = useState(false);

  useEffect(() => {
    const savedLiteMode = localStorage.getItem('liteMode') === 'true';
    setLiteMode(savedLiteMode);
  }, []);

  const toggleLiteMode = () => {
    const newLiteMode = !liteMode;
    setLiteMode(newLiteMode);
    localStorage.setItem('liteMode', String(newLiteMode));
    
    if (newLiteMode) {
      document.documentElement.setAttribute('data-lite-mode', 'true');
    } else {
      document.documentElement.removeAttribute('data-lite-mode');
    }
    
    // Reload to apply changes
    window.location.reload();
  };

  return (
    <div className={styles.layout}>
      <div className={styles.performanceSection}>
        <h2 className={styles.sectionTitle}>Performance</h2>
        <div className={styles.performanceCard}>
          <div className={styles.performanceInfo}>
            <h3>Lite Mode</h3>
            <p>Disable animations and effects for better performance</p>
          </div>
          <button 
            onClick={toggleLiteMode}
            className={`${styles.toggleButton} ${liteMode ? styles.active : ''}`}
          >
            {liteMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className={styles.themesSection}>
        <h2 className={styles.sectionTitle}>Themes</h2>
        <div className={styles.container}>
          <ThemeInfo
            name="GitHub Dark"
            icon="/themes/github-dark.png"
            publisher="GitHub"
            theme="github-dark"
          />
          <ThemeInfo
            name="Dracula"
            icon="/themes/dracula.png"
            publisher="Dracula Theme"
            theme="dracula"
          />
          <ThemeInfo
            name="Ayu Dark"
            icon="/themes/ayu.png"
            publisher="teabyii"
            theme="ayu-dark"
          />
          <ThemeInfo
            name="Ayu Mirage"
            icon="/themes/ayu.png"
            publisher="teabyii"
            theme="ayu-mirage"
          />
          <ThemeInfo
            name="Nord"
            icon="/themes/nord.png"
            publisher="arcticicestudio"
            theme="nord"
          />
          <ThemeInfo
            name="Night Owl"
            icon="/themes/night-owl.png"
            publisher="sarah.drasner"
            theme="night-owl"
          />
          <ThemeInfo
            name="Monokai Pro"
            icon="/themes/monokai.png"
            publisher="monokai"
            theme="monokai-pro"
          />
          <ThemeInfo
            name="One Dark Pro"
            icon="/themes/one-dark.png"
            publisher="zhuangtongfa"
            theme="one-dark-pro"
          />
          <ThemeInfo
            name="Tokyo Night"
            icon="/themes/tokyo-night.png"
            publisher="enkia"
            theme="tokyo-night"
          />
          <ThemeInfo
            name="Gruvbox Dark"
            icon="/themes/gruvbox.png"
            publisher="jdinhlife"
            theme="gruvbox-dark"
          />
          <ThemeInfo
            name="Cobalt2"
            icon="/themes/cobalt2.png"
            publisher="wesbos"
            theme="cobalt2"
          />
          <ThemeInfo
            name="Material Ocean"
            icon="/themes/material.png"
            publisher="Equinusocio"
            theme="material-ocean"
          />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Settings' },
  };
}

export default SettingsPage;
