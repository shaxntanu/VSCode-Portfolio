import { useState } from 'react';
import { VscClose, VscInfo } from 'react-icons/vsc';
import styles from '@/styles/SoftwareInfoPopup.module.css';

interface SoftwareInfoPopupProps {
  onClose: () => void;
}

const SoftwareInfoPopup = ({ onClose }: SoftwareInfoPopupProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconTitle}>
            <VscInfo className={styles.infoIcon} />
            <span>Software Projects Info</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <VscClose />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>
            These software projects are made with AI assistance.
          </p>
          <p className={styles.submessage}>
            My primary focus is on electronics and hardware development. I create these software modules for fun and rapid prototyping of IoT dashboards and web interfaces.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.okBtn} onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoftwareInfoPopup;
