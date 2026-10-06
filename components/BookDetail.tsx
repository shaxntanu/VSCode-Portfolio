import { useState, useEffect, useRef, useCallback } from 'react';
import { Book } from '@/data/journal';
import Image from 'next/image';

const COVER_W = 178;

interface BookDetailProps {
  book: Book;
  rect: { left: number; top: number; width: number; height: number };
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const BookDetail = ({ book, rect, onClose, onNext, onPrevious }: BookDetailProps) => {
  const [out, setOut] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate responsive sizing
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 720;
  const coverHeight = isNarrow 
    ? Math.min(window.innerHeight * 0.42, 400)
    : Math.min(window.innerHeight * 0.6, 480);
  const scale = coverHeight / rect.height;
  const coverW = COVER_W * scale;
  
  // Calculate target position
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  const targetX = (viewportWidth - coverW) / 2;
  const targetY = (viewportHeight - coverHeight) / 2;
  
  const startX = rect.left;
  const startY = rect.top;
  
  const dx = targetX - startX;
  const dy = targetY - startY;
  
  const handleClose = useCallback(() => {
    setOut(false);
    setBackdropVisible(false);
    setDetailsVisible(false);
    
    // Wait for retract animation before closing
    setTimeout(() => {
      onClose();
    }, 900);
  }, [onClose]);
  
  // Animate out on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setOut(true);
    });
    
    return () => cancelAnimationFrame(raf);
  }, []);
  
  // Show backdrop after animation starts
  useEffect(() => {
    if (out) {
      const timer = setTimeout(() => setBackdropVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [out]);
  
  // Show details panel with delay
  useEffect(() => {
    if (backdropVisible) {
      const timer = setTimeout(() => setDetailsVisible(true), 260);
      return () => clearTimeout(timer);
    }
  }, [backdropVisible]);
  
  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, handleClose]);
  
  const faceFont = {
    serif: '"Cormorant Garamond", serif',
    sans: '"Karla", sans-serif',
    mono: '"Space Mono", monospace',
  }[book.face];
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#f5a623' : '#ccc' }}>
          ★
        </span>
      );
    }
    return stars;
  };
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="backdrop"
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(250, 247, 240, 0.7)',
          backdropFilter: 'blur(20px)',
          opacity: backdropVisible ? 1 : 0,
          transition: 'opacity 700ms ease',
          zIndex: 50,
        }}
      />
      
      {/* Book detail */}
      <div
        ref={containerRef}
        className="book-detail"
        style={{
          position: 'fixed',
          left: out ? targetX : startX,
          top: out ? targetY : startY,
          width: coverW,
          height: coverHeight,
          zIndex: 60,
          transform: out
            ? `translate3d(${dx}px, ${dy}px, 0) scale(${scale}) rotateY(-90deg)`
            : `translate3d(0, 0, 0) scale(1) rotateY(-26deg)`,
          transition: 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front cover */}
        <div
          className="detail-cover"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {book.cover ? (
            <Image
              src={book.cover}
              alt={book.title}
              width={coverW}
              height={coverHeight}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: book.spine,
                color: book.ink,
                fontFamily: faceFont,
                fontSize: '18px',
                textAlign: 'center',
              }}
            >
              {book.title}
            </div>
          )}
        </div>
      </div>
      
      {/* Details panel */}
      <div
        className="details-panel"
        style={{
          position: 'fixed',
          left: out ? targetX + coverW + 32 : targetX + coverW + 32,
          top: targetY,
          maxWidth: '400px',
          opacity: detailsVisible ? 1 : 0,
          transform: detailsVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 400ms ease, transform 400ms ease',
          zIndex: 60,
          fontFamily: '"Karla", sans-serif',
          color: '#241f19',
        }}
      >
        {book.recommender ? (
          <div style={{ fontSize: '12px', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '8px', opacity: 0.6 }}>
            Recommended by {book.recommender}
          </div>
        ) : (
          <div style={{ fontSize: '12px', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '8px', opacity: 0.6 }}>
            Finished {book.finished}
          </div>
        )}
        
        <h2 style={{ fontSize: '28px', fontWeight: 500, margin: '0 0 8px 0', fontFamily: faceFont }}>
          {book.title}
        </h2>
        
        <div style={{ fontSize: '16px', marginBottom: '12px', opacity: 0.8 }}>
          {book.author}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          {book.rating > 0 ? renderStars(book.rating) : <span style={{ opacity: 0.6 }}>Unrated</span>}
        </div>
        
        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', opacity: 0.8 }}>
          {book.blurb || 'No description available.'}
        </p>
        
        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
          {book.publisher} · {book.year}
        </div>
        
        {book.genres && book.genres.length > 0 && (
          <div style={{ fontSize: '12px', opacity: 0.6 }}>
            {book.genres.join(', ')}
          </div>
        )}
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {onPrevious && (
            <button
              onClick={onPrevious}
              style={{
                padding: '8px 16px',
                backgroundColor: '#241f19',
                color: '#faf7f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: '"Space Mono", monospace',
                fontSize: '12px',
              }}
            >
              ← Previous
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              style={{
                padding: '8px 16px',
                backgroundColor: '#241f19',
                color: '#faf7f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: '"Space Mono", monospace',
                fontSize: '12px',
              }}
            >
              Next →
            </button>
          )}
          <button
            onClick={handleClose}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#241f19',
              border: '1px solid #241f19',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
