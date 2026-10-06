import { useState } from 'react';
import { Book } from '@/data/journal';
import { books } from '@/data/books';
import TypedTitle from '@/components/TypedTitle';
import Shelf from '@/components/Shelf';
import BookDetail from '@/components/BookDetail';
import LibraryFilter from '@/components/LibraryFilter';
import styles from '@/styles/LibraryPage.module.css';

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
      {/* Background effects */}
      <div className={styles.grain} />
      <div className={styles.warmGradient} />
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.subtitle}>A personal archive</div>
        <div className={styles.titleContainer}>
          <TypedTitle />
        </div>
        <div className={styles.volumeCounter}>{books.length} volumes</div>
      </header>
      
      {/* Filter */}
      <div className={styles.filterSection}>
        <LibraryFilter books={books} onChange={setShownBooks} />
      </div>
      
      {/* Shelf */}
      <div className={styles.shelfWrapper}>
        <div className={styles.shelfContainer}>
          {displayBooks.length > 0 ? (
            <Shelf books={displayBooks} onBookClick={handleBookClick} />
          ) : (
            <div className={styles.emptyState}>
              <h3>No books match</h3>
              <p>Try adjusting your search or genre filter</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Book detail modal */}
      {selectedBook && bookRect && (
        <BookDetail
          book={selectedBook}
          rect={bookRect}
          onClose={handleCloseDetail}
          onNext={displayBooks.length > 1 ? handleNext : undefined}
          onPrevious={displayBooks.length > 1 ? handlePrevious : undefined}
        />
      )}
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
