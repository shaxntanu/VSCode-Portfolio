import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/MazeGame.module.css';

const MazeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const mazeRef = useRef<number[][]>([]);
  const cellSize = 20;
  const cols = 30;
  const rows = 15;

  // Rainbow colors for the maze
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#FF8FA3', '#6C5CE7', '#00D2FF', '#FFB6B9', '#A8E6CF'
  ];

  const generateMaze = () => {
    // Initialize grid with walls
    const maze: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(1));
    
    // Recursive backtracking maze generation
    const stack: [number, number][] = [];
    const startX = 1;
    const startY = 1;
    
    maze[startY][startX] = 0;
    stack.push([startX, startY]);
    
    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0] // up, right, down, left
    ];
    
    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];
      
      // Shuffle directions
      const shuffled = directions.sort(() => Math.random() - 0.5);
      let found = false;
      
      for (const [dx, dy] of shuffled) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && maze[ny][nx] === 1) {
          maze[ny][nx] = 0;
          maze[y + dy / 2][x + dx / 2] = 0;
          stack.push([nx, ny]);
          found = true;
          break;
        }
      }
      
      if (!found) {
        stack.pop();
      }
    }
    
    // Ensure start and end are open
    maze[1][1] = 2; // Start
    maze[rows - 2][cols - 2] = 3; // End
    
    return maze;
  };

  const drawMaze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maze = mazeRef.current;
    
    // Clear canvas
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze with rainbow colors
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = maze[y][x];
        
        if (cell === 1) {
          // Wall - rainbow colors
          const colorIndex = (x + y) % colors.length;
          ctx.strokeStyle = colors[colorIndex];
          ctx.lineWidth = 2;
          
          // Draw diagonal lines for walls
          ctx.beginPath();
          ctx.moveTo(x * cellSize, y * cellSize);
          ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo((x + 1) * cellSize, y * cellSize);
          ctx.lineTo(x * cellSize, (y + 1) * cellSize);
          ctx.stroke();
        } else if (cell === 2) {
          // Start - green
          ctx.fillStyle = '#2ecc71';
          ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
        } else if (cell === 3) {
          // End - red
          ctx.fillStyle = '#e74c3c';
          ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
        }
      }
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      mazeRef.current = generateMaze();
      drawMaze();
      setIsGenerating(false);
    }, 100);
  };

  useEffect(() => {
    // Generate initial maze
    mazeRef.current = generateMaze();
    setTimeout(() => drawMaze(), 100);
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
        <canvas
          ref={canvasRef}
          width={cols * cellSize}
          height={rows * cellSize}
          className={styles.mazeCanvas}
        />
      </div>

      <div className={styles.mazeStats}>
        <button 
          onClick={handleGenerate} 
          className={styles.executeButton}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'execute'}
        </button>
      </div>
    </div>
  );
};

export default MazeGame;
