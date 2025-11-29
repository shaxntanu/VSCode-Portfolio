import { useState, useEffect } from 'react';
import { VscClose, VscInfo } from 'react-icons/vsc';
import styles from '@/styles/MobileNotification.module.css';

const MobileNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenNotification = localStorage.getItem('hasSeenMobileNotification');
    const isMobile = window.innerWidth <= 768;

    if (!hasSeenNotification && isMobile) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenMobileNotification', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.notification}>
        <div className={styles.header}>
          <div className={styles.iconTitle}>
            <VscInfo className={styles.infoIcon} />
            <span>VS Code Portfolio</span>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <VscClose />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>
            This portfolio is optimized for larger screens like laptops and tablets for the best experience.
          </p>
          <p className={styles.submessage}>
            You can still browse on mobile, but some features may be limited.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.okBtn} onClick={handleClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNotification;
