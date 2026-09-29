import { useEffect } from 'react';
import styles from '@/styles/LightModeWarningModal.module.css';

interface LightModeWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LightModeWarningModal = ({ isOpen, onConfirm, onCancel }: LightModeWarningModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.icon}>⚠️</div>
        <h2 className={styles.title}>Switching to Light Mode</h2>
        <p className={styles.message}>
          Light Mode will turn on immediately and may feel bright, especially in a dark environment.
          This can be uncomfortable for your eyes.
        </p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Remain in Dark Mode
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Continue to Light Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightModeWarningModal;
