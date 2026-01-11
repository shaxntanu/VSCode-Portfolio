 import Head from 'next/head';

interface CustomHeadProps {
  title: string;
}

const CustomHead = ({ title }: CustomHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Shantanu Maratha is a Product Developer and IoT/Embedded Systems Engineer building the physical internet with ESP32, custom PCB design, and end-to-end IoT integration"
      />
      <meta
        name="keywords"
        content="shantanu maratha, iot engineer, embedded systems, esp32, pcb design, product developer, iot integration, hardware engineer, shantanu portfolio, vscode-portfolio"
      />
      <meta property="og:title" content="Shantanu's Portfolio" />
      <meta
        property="og:description"
        content="IoT/Embedded Systems Engineer building the physical internet with ESP32, custom PCB design, and end-to-end IoT integration."
      />
      <meta property="og:image" content="https://vs-code-portfolio-one.vercel.app/og-image.png" />
      <meta property="og:url" content="https://vs-code-portfolio-one.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Shantanu',
};
