import { VscLinkExternal } from 'react-icons/vsc';
import Image from 'next/image';
import { libraryProject, readingList } from '@/data/journal';
import styles from '@/styles/ResearchPage.module.css';

const LibraryPage = () => {
  const childhoodBooks = readingList.filter(book => book.category === 'CHILDHOOD');
  const generalBooks = readingList.filter(book => book.category === 'GENERAL');

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Library</h1>
      <p className={styles.pageSubtitle}>
        Reading history and the Virtual Library Guide project.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Virtual Library Guide</h2>
        <a
          href={libraryProject.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <div className={styles.cardIcon}>
            <Image 
              src="/icons/library.svg" 
              alt="Library" 
              width={28} 
              height={28} 
            />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{libraryProject.title}</h3>
            <p className={styles.cardType} style={{ marginTop: '0.5rem' }}>
              {libraryProject.description}
            </p>
          </div>
          <div className={styles.cardLink}>
            <VscLinkExternal />
          </div>
        </a>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Reading Log</h2>
        
        {childhoodBooks.length > 0 && (
          <>
            <div className={styles.grid}>
              {childhoodBooks.map((book, index) => (
                <div key={index} className={styles.card} style={{ cursor: 'default' }}>
                  <div className={styles.cardIcon}>
                    <Image 
                      src="/icons/library.svg" 
                      alt="Library" 
                      width={28} 
                      height={28} 
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{book.title}</h3>
                    {book.series && (
                      <span className={styles.cardType}>{book.series}</span>
                    )}
                    <div className={styles.cardFooter}>
                      <span className={styles.statusBadge} style={{ 
                        background: 'rgba(255, 152, 0, 0.15)',
                        color: '#FF9800'
                      }}>
                        CHILDHOOD READING
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              margin: '2rem 0' 
            }} />
          </>
        )}

        <div className={styles.grid}>
          {generalBooks.map((book, index) => (
            <div key={index} className={styles.card} style={{ cursor: 'default' }}>
              <div className={styles.cardIcon}>
                <Image 
                  src="/icons/library.svg" 
                  alt="Library" 
                  width={28} 
                  height={28} 
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{book.title}</h3>
                {book.author && (
                  <span className={styles.cardId}>{book.author}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Library',
      ogDescription: 'Reading archive and Virtual Library Guide from shaxntanu.'
    },
  };
}

export default LibraryPage;
