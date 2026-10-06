import { VscLinkExternal } from 'react-icons/vsc';
import { SiMedium } from 'react-icons/si';
import { mediumArticles } from '@/data/journal';
import styles from '@/styles/ResearchPage.module.css';

const JournalPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Journal</h1>
      <p className={styles.pageSubtitle}>
        Personal writing, reflections, and things I&apos;ve written along the way.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Medium Articles</h2>
        <div className={styles.grid}>
          {mediumArticles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <SiMedium />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{article.title}</h3>
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
      title: 'Journal',
      ogDescription: 'Personal writing, reflections, and reading exploration from shaxntanu.'
    },
  };
}

export default JournalPage;
