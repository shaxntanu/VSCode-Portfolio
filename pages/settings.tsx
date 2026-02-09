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

      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Themes</h2>
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
