import { useState, useEffect } from 'react';

const FULL = 'Welcome to my library';
const TYPING_SPEED = 95;

const TypedTitle = () => {
  const [visible, setVisible] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeout: NodeJS.Timeout;

    const typeNext = () => {
      if (index < FULL.length) {
        setVisible(FULL.slice(0, index + 1));
        index++;
        timeout = setTimeout(typeNext, TYPING_SPEED);
      } else {
        setIsComplete(true);
      }
    };

    timeout = setTimeout(typeNext, TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <h1 
      aria-label={FULL}
      className="typed-title"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: '3rem',
        fontWeight: 400,
        margin: 0,
        position: 'relative',
      }}
    >
      <span aria-hidden="true">{visible}</span>
      {isComplete && (
        <span 
          className="caret"
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            marginLeft: '2px',
            backgroundColor: 'currentColor',
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </h1>
  );
};

export default TypedTitle;
