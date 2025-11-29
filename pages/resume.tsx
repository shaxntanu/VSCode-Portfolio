import styles from '@/styles/ResumePage.module.css';

const ResumePage = () => {
  const handleDownload = () => {
    window.open(
      'https://drive.google.com/file/d/1sLCQ54jk2x6-wUUPy2CTXkO8L1vBljvM/view?usp=sharing',
      '_blank'
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalDots}>
            <span className={`${styles.dot} ${styles.dotRed}`}></span>
            <span className={`${styles.dot} ${styles.dotYellow}`}></span>
            <span className={`${styles.dot} ${styles.dotGreen}`}></span>
          </div>
          <span className={styles.terminalTitle}>sysdrive_cv.iso</span>
        </div>

        <div className={styles.terminalBody}>
          <div className={styles.bootHeader}>
            SYSTEM_PDF_LOADED: Shantanu_Resume_Classic (v2.4)
            <span className={styles.blinkingCursor}></span>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Image Size:</span>
              <span className={styles.infoValue}>53.8 KB (55,156 bytes)</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={styles.statusMounted}>MOUNTED</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Permissions:</span>
              <span className={styles.statusReadOnly}>READ_ONLY + DOWNLOAD</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Format:</span>
              <span className={styles.infoValue}>PDF/ISO-9660</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Checksum:</span>
              <span className={styles.infoValue}>SHA256:OK</span>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.actionSection}>
            <button className={styles.downloadBtn} onClick={handleDownload}>
              [ INITIATE DOWNLOAD SEQUENCE ]
            </button>
          </div>

          <p className={styles.footer}>
            {/* Ready to extract. Click above to access system drive. */}
          </p>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Resume' },
  };
}

export default ResumePage;
