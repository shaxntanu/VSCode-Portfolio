import { VscClose, VscFile } from 'react-icons/vsc';
import styles from '@/styles/SoftwareInfoPopup.module.css';

interface LightModeInfoPopupProps {
  onClose: () => void;
}

const LightModeInfoPopup = ({ onClose }: LightModeInfoPopupProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconTitle}>
            <VscFile className={styles.fileIcon} />
            <span>README.md</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <VscClose />
          </button>
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.section}>About Light Mode</h2>
          
          <p className={styles.paragraph}>
            Light Mode is a faithful replica of the VS Code Light+ theme, designed to provide the same clean, high-contrast IDE experience in a light color scheme. Every component—from the editor and explorer to the status bar and command palette—has been carefully adapted to match the visual hierarchy and aesthetics of a professional light IDE.
          </p>
          
          <p className={styles.paragraph}>
            This implementation maintains the portfolio's original structure and functionality while offering an alternative visual experience. All dark themes remain available and can be restored at any time through the Settings page.
          </p>
          
          <div className={styles.divider}></div>
          
          <p className={styles.footnote}>
            Light Mode is currently in beta. If you notice any visual inconsistencies or contrast issues, please switch back to Dark Mode and report the issue.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.okBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightModeInfoPopup;
