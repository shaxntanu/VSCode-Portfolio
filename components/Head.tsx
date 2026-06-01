import Head from 'next/head';

interface CustomHeadProps {
  title: string;
  ogImage?: string;
  ogDescription?: string;
}

const CustomHead = ({ title, ogImage, ogDescription }: CustomHeadProps) => {
  const defaultImage = 'https://vs-code-portfolio-one.vercel.app/Portfolio%20Cover%20Image.png';
  const defaultDesc = 'IoT/Embedded Systems Engineer building the physical internet with ESP32, custom PCB design, and end-to-end IoT integration.';
  
  const image = ogImage || defaultImage;
  const description = ogDescription || defaultDesc;

  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keywords"
        content="shantanu maratha, iot engineer, embedded systems, esp32, pcb design, product developer, iot integration, hardware engineer, shantanu portfolio, vscode-portfolio"
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description}
      />
      <meta property="og:image" content={image} />
      <meta property="og:url" content="https://vs-code-portfolio-one.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Shantanu',
};
