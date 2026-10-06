import { useState } from 'react';
import { Book } from '@/data/journal';
import { books } from '@/data/books';
import TypedTitle from '@/components/TypedTitle';
import Shelf from '@/components/Shelf';
import BookDetail from '@/components/BookDetail';
import LibraryFilter from '@/components/LibraryFilter';
import styles from '@/styles/ResearchPage.module.css';

const LibraryPage = () => {
  const [shownBooks, setShownBooks] = useState<Book[] | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookRect, setBookRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleBookClick = (book: Book, index: number) => {
    // Get the book's position from the DOM
    const bookElement = document.querySelector(`[data-book-id="${book.id}"]`) as HTMLElement;
    if (bookElement) {
      const rect = bookElement.getBoundingClientRect();
      setBookRect(rect);
    }
    
    setSelectedBook(book);
    setSelectedIndex(index);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
    setBookRect(null);
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex !== null && shownBooks) {
      const nextIndex = (selectedIndex + 1) % shownBooks.length;
      const nextBook = shownBooks[nextIndex];
      
      // Get position of next book
      const bookElement = document.querySelector(`[data-book-id="${nextBook.id}"]`) as HTMLElement;
      if (bookElement) {
        const rect = bookElement.getBoundingClientRect();
        setBookRect(rect);
      }
      
      setSelectedBook(nextBook);
      setSelectedIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && shownBooks) {
      const prevIndex = (selectedIndex - 1 + shownBooks.length) % shownBooks.length;
      const prevBook = shownBooks[prevIndex];
      
      // Get position of previous book
      const bookElement = document.querySelector(`[data-book-id="${prevBook.id}"]`) as HTMLElement;
      if (bookElement) {
        const rect = bookElement.getBoundingClientRect();
        setBookRect(rect);
      }
      
      setSelectedBook(prevBook);
      setSelectedIndex(prevIndex);
    }
  };

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
          <Shelf books={displayBooks} onBookClick={handleBookClick} />
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', opacity: 0.6 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontStyle: 'italic', margin: '0 0 8px 0' }}>
              No books match
            </h3>
            <p>Try adjusting your search or genre filter</p>
          </div>
        )}
      </div>
      
      {selectedBook && bookRect && (
        <BookDetail
          book={selectedBook}
          rect={bookRect}
          onClose={handleCloseDetail}
          onNext={displayBooks.length > 1 ? handleNext : undefined}
          onPrevious={displayBooks.length > 1 ? handlePrevious : undefined}
        />
      )}
      
      <div className={`${styles.jpMatrix} jp-matrix`}>
        {Array.from({ length: 700 }).map((_, i) => {
          const chars = ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン','ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ','パ','ピ','プ','ペ','ポ'];
          return <span key={i}>{chars[i % chars.length]}</span>;
        })}
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
