import { useMemo, useState } from 'react';
import { Book } from '@/data/journal';
import { books } from '@/data/books';
import Shelf from '@/components/Shelf';
import LibraryFilter from '@/components/LibraryFilter';
import styles from '@/styles/ResearchPage.module.css';

const LibraryPage = () => {
  const [shownBooks, setShownBooks] = useState<Book[] | null>(null);

  const highlightedBookIds = useMemo(
    () => shownBooks === null ? null : new Set(shownBooks.map((book) => book.id)),
    [shownBooks]
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Library</h1>
      <p className={styles.pageSubtitle}>
        A personal archive of books and reading exploration.
      </p>

      <div className={styles.section}>
        <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', opacity: 0.6, marginBottom: '24px' }}>
          {books.length} volumes
        </div>
        
        <LibraryFilter books={books} onChange={setShownBooks} />

        {shownBooks !== null && (
          <p role="status" style={{ fontSize: '12px', margin: '0 0 16px', opacity: 0.65, fontFamily: "'Space Mono', monospace" }}>
            {shownBooks.length} matching {shownBooks.length === 1 ? 'volume' : 'volumes'} highlighted; other books stay on the shelf.
          </p>
        )}
        
        {shownBooks?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', opacity: 0.6 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontStyle: 'italic', margin: '0 0 8px 0' }}>
              No books match
            </h3>
            <p>Try adjusting your search or genre filter. All books remain visible on the shelf.</p>
          </div>
        )}

        <Shelf
          books={books}
          onBookClick={() => {}}
          highlightedBookIds={highlightedBookIds}
        />
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
