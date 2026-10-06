import { useState } from 'react';
import { Book } from '@/data/journal';
import { books } from '@/data/books';
import TypedTitle from '@/components/TypedTitle';
import Shelf from '@/components/Shelf';
import LibraryFilter from '@/components/LibraryFilter';
import styles from '@/styles/ResearchPage.module.css';

const LibraryPage = () => {
  const [shownBooks, setShownBooks] = useState<Book[] | null>(null);

  const displayBooks = shownBooks || books;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Library</h1>
      <p className={styles.pageSubtitle}>
        A personal archive of books and reading exploration.
      </p>

      <div className={styles.section}>
        <div className={styles.subtitle}>A personal archive</div>
        <div style={{ marginBottom: '16px' }}>
          <TypedTitle />
        </div>
        <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', opacity: 0.6, marginBottom: '24px' }}>
          {books.length} volumes
        </div>
        
        <LibraryFilter books={books} onChange={setShownBooks} />
        
        {displayBooks.length > 0 ? (
          <Shelf books={displayBooks} onBookClick={() => {}} />
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', opacity: 0.6 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontStyle: 'italic', margin: '0 0 8px 0' }}>
              No books match
            </h3>
            <p>Try adjusting your search or genre filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {
      title: 'Library',
      ogDescription: 'A personal virtual library showcasing books and reading history from shaxntanu.',
    },
  };
}

export default LibraryPage;
