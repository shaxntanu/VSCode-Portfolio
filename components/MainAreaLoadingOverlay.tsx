import styles from '@/styles/MainAreaLoadingOverlay.module.css';

// Loader artwork adapted from Uiverse.io by Vosoone.
const MainAreaLoadingOverlay = ({ isVisible }: { isVisible: boolean }) => (
  <div
    className={`${styles.overlay} ${isVisible ? styles.visible : styles.hidden}`}
    role="status"
    aria-label="Loading section content"
    aria-live="polite"
    aria-hidden={!isVisible}
    data-main-loading-overlay
  >
    <div className={styles.loader}>
      <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="main-loader-chip-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--loader-chip-top)" />
            <stop offset="100%" stopColor="var(--loader-chip-bottom)" />
          </linearGradient>
          <linearGradient id="main-loader-text-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--loader-text-top)" />
            <stop offset="100%" stopColor="var(--loader-text-bottom)" />
          </linearGradient>
          <linearGradient id="main-loader-pin-gradient" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--loader-pin-start)" />
            <stop offset="50%" stopColor="var(--loader-pin-mid)" />
            <stop offset="100%" stopColor="var(--loader-pin-end)" />
          </linearGradient>
        </defs>

        <g>
          <path d="M100 100 H200 V210 H326" className={styles.traceBg} />
          <path d="M100 100 H200 V210 H326" className={`${styles.traceFlow} ${styles.purple}`} />
          <path d="M80 180 H180 V230 H326" className={styles.traceBg} />
          <path d="M80 180 H180 V230 H326" className={`${styles.traceFlow} ${styles.blue}`} />
          <path d="M60 260 H150 V250 H326" className={styles.traceBg} />
          <path d="M60 260 H150 V250 H326" className={`${styles.traceFlow} ${styles.yellow}`} />
          <path d="M100 350 H200 V270 H326" className={styles.traceBg} />
          <path d="M100 350 H200 V270 H326" className={`${styles.traceFlow} ${styles.green}`} />
          <path d="M700 90 H560 V210 H474" className={styles.traceBg} />
          <path d="M700 90 H560 V210 H474" className={`${styles.traceFlow} ${styles.blue}`} />
          <path d="M740 160 H580 V230 H474" className={styles.traceBg} />
          <path d="M740 160 H580 V230 H474" className={`${styles.traceFlow} ${styles.green}`} />
          <path d="M720 250 H590 V250 H474" className={styles.traceBg} />
          <path d="M720 250 H590 V250 H474" className={`${styles.traceFlow} ${styles.red}`} />
          <path d="M680 340 H570 V270 H474" className={styles.traceBg} />
          <path d="M680 340 H570 V270 H474" className={`${styles.traceFlow} ${styles.yellow}`} />
        </g>

        <rect x="330" y="190" width="140" height="100" rx="20" ry="20" fill="url(#main-loader-chip-gradient)" stroke="var(--loader-chip-border)" strokeWidth="3" className={styles.chipBody} />
        <g>
          <rect x="322" y="205" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
          <rect x="322" y="225" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
          <rect x="322" y="245" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
          <rect x="322" y="265" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
        </g>
        <g>
          <rect x="470" y="205" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
          <rect x="470" y="225" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
          <rect x="470" y="245" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
          <rect x="470" y="265" width="8" height="10" fill="url(#main-loader-pin-gradient)" rx="2" />
        </g>

        <text x="400" y="240" fontFamily="Arial, sans-serif" fontSize="22" fill="url(#main-loader-text-gradient)" textAnchor="middle" alignmentBaseline="middle">
          Loading
        </text>

        <circle cx="100" cy="100" r="5" fill="var(--loader-node)" />
        <circle cx="80" cy="180" r="5" fill="var(--loader-node)" />
        <circle cx="60" cy="260" r="5" fill="var(--loader-node)" />
        <circle cx="100" cy="350" r="5" fill="var(--loader-node)" />
        <circle cx="700" cy="90" r="5" fill="var(--loader-node)" />
        <circle cx="740" cy="160" r="5" fill="var(--loader-node)" />
        <circle cx="720" cy="250" r="5" fill="var(--loader-node)" />
        <circle cx="680" cy="340" r="5" fill="var(--loader-node)" />
      </svg>
    </div>
  </div>
);

export default MainAreaLoadingOverlay;
