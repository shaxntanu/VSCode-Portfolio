import { VscLinkExternal } from 'react-icons/vsc';
import { SiMedium } from 'react-icons/si';
import styles from '@/styles/ArticlesPage.module.css';

const articles = [
  {
    id: 'ART-001',
    title: 'How a Robotics Class Shaped My Engineering Journey',
    type: 'Personal Article',
    date: '2024',
    status: 'PUBLISHED',
    link: 'https://medium.com/@shaxntanu/how-a-robotics-class-shaped-my-engineering-journey-19acd8f99bb4',
    description: 'A reflection on how robotics education shaped my path in engineering and IoT development.',
  },
];

const ArticlesPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Articles & Blog</h1>
      <p className={styles.pageSubtitle}>
        Personal articles and blog posts on engineering, robotics, and IoT development.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Published Articles</h2>
        <div className={styles.grid}>
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <SiMedium />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardDescription}>{article.description}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardId}>{article.id}</span>
                  <span className={styles.cardType}>{article.type}</span>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardDate}>{article.date}</span>
                  <span className={styles.statusBadge}>{article.status}</span>
                </div>
              </div>
              <div className={styles.cardLink}>
                <VscLinkExternal />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Articles',
      ogDescription: 'Personal articles and blog posts on engineering, robotics, and IoT development.',
    },
  };
}

export default ArticlesPage;
