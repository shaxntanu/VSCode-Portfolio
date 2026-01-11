import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import Layout from '@/components/Layout';
import Head from '@/components/Head';
import ClickSpark from '@/components/ClickSpark';

import '@/styles/globals.css';
import '@/styles/themes.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'ayu-dark';
    document.documentElement.setAttribute('data-theme', theme);
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'ayu-dark');
    }
  }, []);

  return (
    <>
      <Script
        id="theme-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'ayu-dark';
              document.documentElement.setAttribute('data-theme', theme);
              if (!localStorage.getItem('theme')) {
                localStorage.setItem('theme', 'ayu-dark');
              }
            })();
          `,
        }}
      />
      <ClickSpark
        sparkColor='#fff'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <Layout>
          <Head title={`Shantanu | ${pageProps.title}`} />
          <Component {...pageProps} />
        </Layout>
      </ClickSpark>
    </>
  );
}

export default MyApp;
