import { useState, useEffect } from 'react';
import styles from '@/styles/ResumePage.module.css';

const RESUME_PDF_URL = 'https://shaxntanu.github.io/LaTeX-Resume-Shantanu/resume.pdf';
const GITHUB_API_URL = 'https://api.github.com/repos/shaxntanu/LaTeX-Resume-Shantanu/commits/main';

const ResumePage = () => {
  const [lastUpdated, setLastUpdated] = useState('Loading...');

  useEffect(() => {
    // Fetch last commit date from GitHub
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(GITHUB_API_URL);
        const data = await response.json();
        const commitDate = new Date(data.commit.committer.date);
        
        // Format to DD/MM/YYYY
        const day = String(commitDate.getDate()).padStart(2, '0');
        const month = String(commitDate.getMonth() + 1).padStart(2, '0');
        const year = commitDate.getFullYear();
        
        setLastUpdated(`${day}/${month}/${year}`);
      } catch (error) {
        console.error('Failed to fetch last updated date:', error);
        setLastUpdated('UNKNOWN');
      }
    };

    fetchLastUpdated();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(RESUME_PDF_URL);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Shantanu_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link
      window.open(RESUME_PDF_URL, '_blank');
    }
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
            <span className={styles.typingText}>SYSTEM_PDF_LOADED: Shantanu_Resume_Classic (v2.4)</span>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>File Size:</span>
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
              <span className={styles.infoLabel}>Source:</span>
              <a 
                href="https://github.com/shaxntanu/LaTeX-Resume-Shantanu" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.infoLink}
              >
                GITHUB_REPO
              </a>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Build:</span>
              <span className={styles.statusMounted}>AUTOMATED</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Last Updated:</span>
              <span className={styles.infoValue}>{lastUpdated}</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Checksum:</span>
              <span className={styles.infoValue}>SHA256:OK</span>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.actionSection}>
            <button className={styles.button} onClick={handleDownload}>
              <span className={styles.shadow}></span>
              <span className={styles.edge}></span>
              <div className={styles.front}>
                <span>[ INITIATE DOWNLOAD SEQUENCE ]</span>
              </div>
            </button>
          </div>

          <hr className={styles.divider} />

          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <span className={styles.previewLabel}>[ PREVIEW MODE ]</span>
            </div>
            <iframe
              src={RESUME_PDF_URL}
              className={styles.pdfPreview}
              title="Resume Preview"
            />
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
