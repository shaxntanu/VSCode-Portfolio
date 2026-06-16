import { VscClose, VscFile } from 'react-icons/vsc';
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
            <VscFile className={styles.fileIcon} />
            <span>README.md</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <VscClose />
          </button>
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.section}>Why These Projects?</h2>
          
          <p className={styles.paragraph}>
            The projects in this category were selected because they represent complete software systems, engineering milestones, or products that demonstrate architecture, problem-solving, and end-to-end development.
          </p>
          
          <p className={styles.paragraph}>
            While I occasionally build dashboards and monitoring interfaces for IoT deployments, I consider them supporting tools rather than standalone projects. My primary focus is embedded systems, connected devices, electronics, and system-level engineering.
          </p>
          
          <div className={styles.divider}></div>
          
          <p className={styles.footnote}>
            Many internal dashboards and prototype interfaces are intentionally omitted to keep this portfolio focused on projects with broader engineering significance.
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

export default SoftwareInfoPopup;
