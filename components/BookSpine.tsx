import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Book } from '@/data/journal';

interface BookSpineProps {
  book: Book;
  onClick: () => void;
}

const BookSpine = ({ book, onClick }: BookSpineProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowCard(true);
    
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCardPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // 90ms leave grace to prevent flicker
    leaveTimerRef.current = setTimeout(() => {
      setShowCard(false);
    }, 90);
  };

  const handleClick = () => {
    onClick();
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const pull = isHovered ? 96 : 0;
  const lift = isHovered ? -26 : 0;
  const currentLean = isHovered ? 0 : book.lean;

  const faceFont = {
    serif: "'Cormorant Garamond', serif",
    sans: "'Karla', sans-serif",
    mono: "'Space Mono', monospace",
  }[book.face];

  const metadataCard = showCard && (
    createPortal(
      <div
        className="book-metadata-card"
        style={{
          position: 'fixed',
          top: cardPosition.top - 56,
          left: cardPosition.left - 124,
          width: '248px',
          zIndex: 100,
          backgroundColor: 'rgba(250, 247, 240, 0.95)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          fontFamily: "'Karla', sans-serif",
          color: '#241f19',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 500, marginBottom: '4px', fontFamily: faceFont }}>
          {book.title}
        </div>
        <div style={{ fontSize: '15px', marginBottom: '8px', opacity: 0.8 }}>
          {book.author}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '4px' }}>
          {book.year} · {book.publisher}
        </div>
        {book.genres && book.genres.length > 0 && (
          <div style={{ fontSize: '14px', opacity: 0.6 }}>
            {book.genres.join(', ')}
          </div>
        )}
      </div>,
      document.body
    )
  );

  return (
    <>
      <button
        ref={buttonRef}
        className="book-spine-button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-book-id={book.id}
        style={{
          position: 'relative',
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          zIndex: isHovered ? 40 : 1,
          outline: 'none',
        }}
      >
        <span
          className="book-spine-inner"
          style={{
            display: 'block',
            transformStyle: 'preserve-3d',
            transform: `rotateY(var(--ry, 0deg)) rotateZ(${currentLean}deg) translateZ(${pull + book.depth}px) translateY(${lift}px)`,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            width: `${book.width}px`,
            height: `${book.height}px`,
            position: 'relative',
          }}
        >
          {/* Spine face */}
          <div
            className="spine-face"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: book.spine,
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            {/* Cover wraparound effect */}
            {book.cover && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '20px',
                  height: '100%',
                  backgroundImage: `url(${book.cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'left center',
                  opacity: 0.8,
                }}
              />
            )}
            
            {/* Band accent */}
            {book.band && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: book.band,
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: book.band,
              }}
            />
            
            {/* Title */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
                color: book.ink,
                fontFamily: faceFont,
                fontSize: book.width >= 44 ? '14px' : '11px',
                fontWeight: book.caps ? 700 : 400,
                textTransform: book.caps ? 'uppercase' : 'none',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                maxWidth: book.height - 20,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {book.title}
            </div>
            
            {/* Author (only on wider spines) */}
            {book.width >= 44 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-90deg)',
                  color: book.ink,
                  fontFamily: faceFont,
                  fontSize: '10px',
                  opacity: 0.8,
                  whiteSpace: 'nowrap',
                }}
              >
                {book.author}
              </div>
            )}
            
            {/* Publisher mark (only on wider spines) */}
            {book.width >= 30 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: book.ink,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '8px',
                  opacity: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {book.publisher.slice(0, 12)}
              </div>
            )}
            
            {/* Edge wear */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent 30%)',
                opacity: book.wear,
                pointerEvents: 'none',
              }}
            />
            
            {/* Inset highlight */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent 10%, transparent 90%, rgba(0,0,0,0.1))',
                pointerEvents: 'none',
              }}
            />
          </div>
        </span>
      </button>
      {metadataCard}
    </>
  );
};

export default BookSpine;
