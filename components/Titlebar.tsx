import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from '@/styles/Titlebar.module.css';

const Titlebar = () => {
  const router = useRouter();

  const allPaths = ['/about', '/contact', '/projects', '/techstack', '/github', '/experience'];

  const handleMaximize = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleClose = () => {
    if (confirm('Are you sure you want to close this portfolio?')) {
      window.close();
      setTimeout(() => {
        window.location.href = 'about:blank';
      }, 100);
    }
  };

  const handleMenuClick = (menu: string) => {
    switch (menu) {
      case 'File':
        router.push('/research');
        break;
      case 'View':
        router.push('/');
        break;
      case 'Go':
        const randomPath = allPaths[Math.floor(Math.random() * allPaths.length)];
        router.push(randomPath);
        break;
      case 'Run':
        router.push('/resume');
        break;
      case 'Terminal':
        router.push('/experience');
        break;
      case 'Help':
        router.push('/contact');
        break;
      default:
        break;
    }
  };

  return (
    <section className={styles.titlebar}>
      <Image
        src="/logos/vscode_icon.svg"
        alt="VSCode Icon"
        height={15}
        width={15}
        className={styles.icon}
      />
      <div className={styles.items}>
        <p onClick={() => handleMenuClick('File')}>File</p>
        <p onClick={() => handleMenuClick('View')}>View</p>
        <p onClick={() => handleMenuClick('Go')}>Go</p>
        <p onClick={() => handleMenuClick('Run')}>Run</p>
        <p onClick={() => handleMenuClick('Terminal')}>Terminal</p>
        <p onClick={() => handleMenuClick('Help')}>Help</p>
      </div>
      <p className={styles.title}>Shantanu - Visual Studio Code</p>
      <div className={styles.windowButtons}>
        <button 
          className={styles.maximize} 
          onClick={handleMaximize}
          title="Maximize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button 
          className={styles.close} 
          onClick={handleClose}
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Titlebar;
