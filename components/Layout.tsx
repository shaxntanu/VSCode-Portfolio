import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Titlebar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import Bottombar from '@/components/Bottombar';
import Tabsbar from '@/components/Tabsbar';
import MobileNotification from '@/components/MobileNotification';
import { FolderProvider } from '@/contexts/FolderContext';

import styles from '@/styles/Layout.module.css';

// Dynamically import Explorer with no SSR
const Explorer = dynamic(() => import('@/components/Explorer'), {
  ssr: false,
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [, setScreenKey] = useState(0);

  // Force re-render when screen/DPI changes (e.g., moving window between monitors)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let currentDPR = window.devicePixelRatio;

    const checkScreenChange = () => {
      if (window.devicePixelRatio !== currentDPR) {
        currentDPR = window.devicePixelRatio;
        setScreenKey((k) => k + 1);
      }
    };

    // Listen for DPI/resolution changes via matchMedia
    const mediaQuery = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`
    );

    const handleMediaChange = () => {
      checkScreenChange();
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    // Also check on resize as a fallback
    window.addEventListener('resize', checkScreenChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('resize', checkScreenChange);
    };
  }, []);

  useEffect(() => {
    const main = document.getElementById('main-editor');
    if (main) {
      main.scrollTop = 0;
    }
  }, [router.pathname]);

  return (
    <FolderProvider>
      <MobileNotification />
      <Titlebar />
      <div className={styles.main} id="window-container">
        <Sidebar />
        <Explorer />
        <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Tabsbar />
          <main id="main-editor" className={styles.content}>
            {children}
            <div className={`${styles.jpMatrix} jp-matrix`}>
              {Array.from({ length: 700 }).map((_, i) => {
                const chars = ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン','ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ','パ','ピ','プ','ペ','ポ'];
                return <span key={i}>{chars[i % chars.length]}</span>;
              })}
            </div>
          </main>
        </div>
      </div>
      <Bottombar />
      <div id="dock-icon" className={styles.dockIcon} style={{ display: 'none' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="url(#gradient)" />
          <path d="M10 15 L20 10 L30 15 L30 30 L10 30 Z" fill="white" opacity="0.3" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#007ACC" />
              <stop offset="100%" stopColor="#0098FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </FolderProvider>
  );
};

export default Layout;
