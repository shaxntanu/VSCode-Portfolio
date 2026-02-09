import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/MazeGame.module.css';

const MazeGame = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const cols = 32;
  const rows = 8;

  // Monokai Pro colors
  const colors = [
    { name: 'accent1', color: '#FF6188' },
    { name: 'accent2', color: '#FC9867' },
    { name: 'accent3', color: '#FFD866' },
    { name: 'accent4', color: '#A9DC76' },
    { name: 'accent5', color: '#78DCE8' },
    { name: 'accent6', color: '#AB9DF2' },
  ];

  const generateMaze = () => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear existing paths
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Generate random diagonal lines
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Randomly choose forward or backward slash
        const isForward = Math.random() > 0.5;
        const d = isForward 
          ? `M ${x} ${y} l 1 1`  // Forward slash: \
          : `M ${x + 1} ${y} l -1 1`; // Backward slash: /
        
        path.setAttribute('d', d);
        
        // Random color
        const colorObj = colors[Math.floor(Math.random() * colors.length)];
        path.setAttribute('class', `${styles[colorObj.name]} ${styles.mazePath}`);
        path.setAttribute('stroke', colorObj.color);
        
        // Random animation delay and duration
        const delay = Math.random() * 1;
        const duration = 0.1 + Math.random() * 0.3;
        path.style.animationDelay = `${delay}s`;
        path.style.animationDuration = `${duration}s`;
        
        svg.appendChild(path);
      }
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateMaze();
      setIsGenerating(false);
    }, 50);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateMaze();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.mazeContainer}>
      <div className={styles.mazeHeader}>
        <h2 className={styles.mazeTitle}>BASIC Maze Generator</h2>
        <p className={styles.mazeInstructions}>
          <span className={styles.codeText}>10 PRINT CHR$(205.5 + RND(1)); : GOTO 10</span>
        </p>
        <p className={styles.mazeSubtext}>
          The classic maze generation oneliner in BASIC
        </p>
      </div>
      
      <div className={styles.mazeWrapper}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${cols} ${rows}`}
          className={styles.mazeSvg}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div className={styles.mazeStats}>
        <button 
          onClick={handleGenerate} 
          className={styles.executeButton}
          disabled={isGenerating}
        >
          {isGenerating ? 'generating...' : 'execute'}
        </button>
      </div>
    </div>
  );
};

export default MazeGame;
