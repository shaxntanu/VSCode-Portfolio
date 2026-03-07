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
    // Set default theme to Ayu Dark
    const theme = localStorage.getItem('theme') || 'ayu-dark';
    document.documentElement.setAttribute('data-theme', theme);
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'ayu-dark');
    }

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
