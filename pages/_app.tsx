import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';

import Layout from '@/components/Layout';
import Head from '@/components/Head';
import ClickSpark from '@/components/ClickSpark';

import '@/styles/globals.css';
import '@/styles/themes.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [liteMode, setLiteMode] = useState(false);

  useEffect(() => {
    const availableThemes = [
      'github-dark',
      'dracula',
      'ayu-dark',
      'ayu-mirage',
      'nord',
      'night-owl'
    ];

    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    let theme;
    if (!savedTheme) {
      // First time visitor - pick a random theme
      theme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
      localStorage.setItem('theme', theme);
    } else {
      // Returning visitor - use their saved theme
      theme = savedTheme;
    }
    
    document.documentElement.setAttribute('data-theme', theme);

    // Check for lite mode preference - default to true (enabled)
    const savedLiteMode = localStorage.getItem('liteMode');
    const isLiteMode = savedLiteMode === null ? true : savedLiteMode === 'true';
    
    setLiteMode(isLiteMode);
    
    if (isLiteMode) {
      document.documentElement.setAttribute('data-lite-mode', 'true');
      if (savedLiteMode === null) {
        localStorage.setItem('liteMode', 'true');
      }
    }
  }, []);

  const content = (
    <Layout>
      <Head title={`Shantanu | ${pageProps.title}`} />
      <Component {...pageProps} />
    </Layout>
  );

  // Skip ClickSpark in lite mode
  if (liteMode) {
    return (
      <>
        {content}
        <Analytics />
      </>
    );
  }

  return (
    <>
      <ClickSpark
        sparkColor='#fff'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        {content}
      </ClickSpark>
      <Analytics />
    </>
  );
}

export default MyApp;
