import { VscLinkExternal } from 'react-icons/vsc';
import { SiMedium } from 'react-icons/si';
import { mediumArticles, mediumArticleGroups } from '@/data/journal';
import styles from '@/styles/ResearchPage.module.css';

const JournalPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Journal</h1>
      <p className={styles.pageSubtitle}>
        Personal reflections, observations, and open-source contributions.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Medium Articles</h2>
        {mediumArticleGroups.map((group) => {
          const groupArticles = mediumArticles.filter((article) => article.category === group.category);
          if (groupArticles.length === 0) return null;

          return (
            <section key={group.category} className={styles.articleGroup}>
              <h3 className={styles.articleGroupTitle}>{group.title}</h3>
              <div className={`${styles.grid} ${styles.mediumArticles}`}>
                {groupArticles.map((article) => (
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
                      <h4 className={styles.cardTitle}>{article.title}</h4>
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
            </section>
          );
        })}
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
