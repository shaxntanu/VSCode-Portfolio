import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e6b450" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shantanu" />
        <link rel="apple-touch-icon" href="/logos/vscode_icon.svg" />
      </Head>
      <body>
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
        <Script
          id="lite-mode-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {
              const savedLiteMode = localStorage.getItem('liteMode');
              const isLiteMode = savedLiteMode === null ? true : savedLiteMode === 'true';
              if (isLiteMode) {
                document.documentElement.setAttribute('data-lite-mode', 'true');
              }
            })();`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
