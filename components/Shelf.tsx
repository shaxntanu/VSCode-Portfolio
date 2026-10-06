import { useState, useEffect, useRef } from 'react';
import { Book } from '@/data/journal';
import BookSpine from './BookSpine';

interface ShelfProps {
  books: Book[];
  onBookClick: (book: Book, index: number) => void;
  justAdded?: string;
}

const Shelf = ({ books, onBookClick, justAdded }: ShelfProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [overflowing, setOverflowing] = useState(false);
  
  // Calculate total shelf width
  const totalWidth = books.reduce((sum, book) => sum + book.width + 2, 0); // 2px gap
  
  // Determine if we need multiple copies for seamless loop
  const needsLoop = totalWidth > 2600;
  const displayBooks = needsLoop ? [...books, ...books, ...books] : books;
  
  // Handle scroll for perspective calculation
  const handleScroll = () => {
    // Perspective calculation happens in getRotation
  };
  
  // Handle horizontal wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  };
  
  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - (containerRef.current?.scrollLeft || 0));
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.clientX - startX;
    containerRef.current.scrollLeft = x;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && containerRef.current) {
        containerRef.current.scrollLeft -= 320;
      } else if (e.key === 'ArrowRight' && containerRef.current) {
        containerRef.current.scrollLeft += 320;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Check if overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const isOverflowing = containerRef.current.scrollWidth > containerRef.current.clientWidth;
        setOverflowing(isOverflowing);
      }
    };
    
    checkOverflow();
    
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [books]);
  
  // Scroll to just added book
  useEffect(() => {
    if (justAdded && containerRef.current) {
      const index = books.findIndex(b => b.id === justAdded);
      if (index !== -1) {
        const bookElement = containerRef.current.children[index] as HTMLElement;
        if (bookElement) {
          bookElement.scrollIntoView({ inline: 'center' });
        }
      }
    }
  }, [justAdded, books]);
  
  // Handle seamless loop wrapping
  useEffect(() => {
    if (!needsLoop || !containerRef.current) return;
    
    const container = containerRef.current;
    const segmentWidth = totalWidth;
    
    const handleScroll = () => {
      const scroll = container.scrollLeft;
      
      // Wrap at segment boundaries
      if (scroll < segmentWidth) {
        container.scrollLeft = scroll + segmentWidth;
      } else if (scroll > segmentWidth * 2) {
        container.scrollLeft = scroll - segmentWidth;
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    
    // Start in the middle segment
    container.scrollLeft = segmentWidth;
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [needsLoop, totalWidth]);
  
  // Calculate perspective rotation for each book
  const getRotation = (index: number) => {
    if (!containerRef.current || !overflowing) return 0;
    
    const bookElement = containerRef.current.children[index] as HTMLElement;
    if (!bookElement) return 0;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const bookRect = bookElement.getBoundingClientRect();
    
    const bookCenter = bookRect.left + bookRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    const distance = bookCenter - containerCenter;
    const maxDistance = containerRect.width / 2;
    const normalized = distance / maxDistance;
    
    // Eased rotation up to ±34 degrees
    const rotation = Math.pow(Math.abs(normalized), 1.35) * Math.sign(normalized) * 34;
    
    return rotation;
  };
  
  return (
    <div className="shelf-container">
      <div
        ref={containerRef}
        className="shelf-scroll"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          gap: '2px',
          alignItems: 'flex-end',
          paddingTop: '64px',
          paddingBottom: '24px',
          overflowX: 'auto',
          overflowY: 'hidden',
          perspective: '1400px',
          perspectiveOrigin: '50% 65%',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          justifyContent: overflowing ? 'flex-start' : 'center',
        }}
      >
        {displayBooks.map((book, index) => {
          const rotation = getRotation(index);
          const isNewlyAdded = book.id === justAdded;
          
          return (
            <div
              key={`${book.id}-${index}`}
              style={{
                '--ry': `${rotation}deg`,
                animation: isNewlyAdded ? 'shelve-in 1100ms cubic-bezier(0.22,1,0.32,1) both' : 'none',
              } as React.CSSProperties}
            >
              <BookSpine
                book={book}
                onClick={() => onBookClick(book, index % books.length)}
              />
            </div>
          );
        })}
      </div>
      
      {/* Edge fade gradients */}
      {overflowing && (
        <>
          <div
            className="edge-fade-left"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '80px',
              background: 'linear-gradient(to right, rgba(250, 247, 240, 1), transparent)',
              pointerEvents: 'none',
            }}
          />
          <div
            className="edge-fade-right"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '80px',
              background: 'linear-gradient(to left, rgba(250, 247, 240, 1), transparent)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      
      {/* Ground shadow */}
      <div
        className="ground-shadow"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
          pointerEvents: 'none',
        }}
      />
      
      <style jsx>{`
        .shelf-scroll::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes shelve-in {
          0% {
            opacity: 0;
            transform: translateX(100px) translateZ(-50px) rotateY(20deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateZ(0) rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Shelf;
