import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Titlebar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import Bottombar from '@/components/Bottombar';
import Tabsbar from '@/components/Tabsbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import CommandPalette from '@/components/CommandPalette';
import CommandPaletteShiftP from '@/components/CommandPaletteShiftP';
import Minimap from '@/components/Minimap';
import MobileNotification from '@/components/MobileNotification';
import Terminal from '@/components/Terminal/Terminal';
import ProblemsPanel from '@/components/ProblemsPanel/ProblemsPanel';
import { FolderProvider } from '@/contexts/FolderContext';
import { UIStateProvider, useUIState } from '@/contexts/UIStateContext';

import styles from '@/styles/Layout.module.css';

// Dynamically import Explorer with no SSR
const Explorer = dynamic(() => import('@/components/Explorer'), {
  ssr: false,
});

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [, setScreenKey] = useState(0);
  const { 
    zenMode, 
    focusMode, 
    sidebarVisible, 
    minimapVisible, 
    bottombarVisible,
    setZenMode,
    setFocusMode,
  } = useUIState();

  // Force re-render when screen/DPI changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let currentDPR = window.devicePixelRatio;

    const checkScreenChange = () => {
      if (window.devicePixelRatio !== currentDPR) {
        currentDPR = window.devicePixelRatio;
        setScreenKey((k) => k + 1);
      }
    };

    const mediaQuery = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`
    );

    const handleMediaChange = () => {
      checkScreenChange();
    };

    mediaQuery.addEventListener('change', handleMediaChange);
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

  // Listen for command palette events
  useEffect(() => {
    const handleToggleZenMode = () => setZenMode(!zenMode);
    const handleToggleFocusMode = () => setFocusMode(!focusMode);

    window.addEventListener('toggleZenMode', handleToggleZenMode);
    window.addEventListener('toggleFocusMode', handleToggleFocusMode);

    return () => {
      window.removeEventListener('toggleZenMode', handleToggleZenMode);
      window.removeEventListener('toggleFocusMode', handleToggleFocusMode);
    };
  }, [zenMode, focusMode, setZenMode, setFocusMode]);

  return (
    <>
      {!zenMode && <MobileNotification />}
      {!zenMode && <Titlebar />}
      <div className={`${styles.main} ${zenMode ? styles.zenMode : ''} ${focusMode ? styles.focusMode : ''}`} id="window-container">
        {sidebarVisible && !zenMode && <Sidebar />}
        {sidebarVisible && !zenMode && <Explorer />}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <Tabsbar />
          <Breadcrumbs />
          <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', height: '100%' }}>
            <main id="main-editor" className={styles.content}>
              {children}
              <div className={`${styles.jpMatrix} jp-matrix`}>
                {Array.from({ length: 700 }).map((_, i) => {
                  const chars = ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン','ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ','パ','ピ','プ','ペ','ポ'];
                  return <span key={i}>{chars[i % chars.length]}</span>;
                })}
              </div>
            </main>
            {minimapVisible && !zenMode && !focusMode && <Minimap />}
          </div>
          <Terminal />
          <ProblemsPanel />
        </div>
      </div>
      {!zenMode && bottombarVisible && <Bottombar />}
      <CommandPalette />
      <CommandPaletteShiftP />
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
    </>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <FolderProvider>
      <UIStateProvider>
        <LayoutContent>{children}</LayoutContent>
      </UIStateProvider>
    </FolderProvider>
  );
};

export default Layout;
