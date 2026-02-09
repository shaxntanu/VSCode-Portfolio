import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/MazeGame.module.css';

const MazeGame = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const cols = 32;
  const rows = 8;

  // Monokai Pro colors
  const colors = ['#FF6188', '#FC9867', '#FFD866', '#A9DC76', '#78DCE8', '#AB9DF2'];

  const generateMaze = () => {
    const svg = svgRef.current;
    if (!svg) {
      console.log('SVG ref not found');
      return;
    }

    console.log('Generating maze...');

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
        const d = isForward ? `M ${x} ${y} l 1 1` : `M ${x + 1} ${y} l -1 1`;

        path.setAttribute('d', d);
        path.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
        path.setAttribute('stroke-width', '0.05');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('opacity', '0.9');

        svg.appendChild(path);
      }
    }

    console.log(`Generated ${rows * cols} paths`);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateMaze();
      setIsGenerating(false);
    }, 50);
  };

  useEffect(() => {
    console.log('MazeGame mounted');
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
        <p className={styles.mazeSubtext}>The classic maze generation oneliner in BASIC</p>
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
        <button onClick={handleGenerate} className={styles.executeButton} disabled={isGenerating}>
          {isGenerating ? 'generating...' : 'execute'}
        </button>
      </div>
    </div>
  );
};

export default MazeGame;
