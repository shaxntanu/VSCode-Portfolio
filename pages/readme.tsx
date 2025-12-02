import Head from '@/components/Head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from '@/styles/ReadmePage.module.css';

interface ReadmePageProps {
  readme?: string;
}

const ReadmePage = ({ readme }: ReadmePageProps) => {
  // Remove <br/> tags from the readme content
  const cleanedReadme = readme?.replace(/<br\s*\/?>/gi, '') || '';

  return (
    <>
      <Head title="README" />
      <div className={styles.container}>
        <h1 className={styles.title}>GitHub Profile README</h1>
        {readme ? (
          <div className={styles.readmeContent}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {cleanedReadme}
            </ReactMarkdown>
          </div>
        ) : (
          <p className={styles.error}>Failed to load README. Make sure you have a README in your shaxntanu/shaxntanu repository.</p>
        )}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const username = 'shaxntanu';
  
  try {
    const readmeRes = await fetch(`https://api.github.com/repos/${username}/${username}/readme`, {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    });
    
    const readme = readmeRes.ok ? await readmeRes.text() : null;

    return {
      props: { 
        title: 'README', 
        readme
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching README:', error);
    return {
      props: { title: 'README', readme: null },
      revalidate: 60,
    };
  }
}

export default ReadmePage;
