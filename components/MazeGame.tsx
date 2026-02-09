import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/MazeGame.module.css';

const MazeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const playerPosRef = useRef({ x: 1, y: 1 });
  const cellSize = 30;

  // Maze layout: 0 = wall, 1 = path, 2 = start, 3 = end
  const maze = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const drawMaze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get computed styles for colors
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim() || '#007acc';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = maze[y][x];
        
        if (cell === 0) {
          // Wall
          ctx.fillStyle = accentColor;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else if (cell === 2) {
          // Start
          ctx.fillStyle = '#2ecc71';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else if (cell === 3) {
          // End
          ctx.fillStyle = '#e74c3c';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else {
          // Path
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Draw player
    const { x, y } = playerPosRef.current;
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(
      x * cellSize + cellSize / 2,
      y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const movePlayer = (dx: number, dy: number) => {
    if (gameWon) return;

    const newX = playerPosRef.current.x + dx;
    const newY = playerPosRef.current.y + dy;

    // Check if move is valid
    if (
      newY >= 0 &&
      newY < maze.length &&
      newX >= 0 &&
      newX < maze[0].length &&
      maze[newY][newX] !== 0
    ) {
      playerPosRef.current = { x: newX, y: newY };
      setMoves((prev) => prev + 1);

      // Check if reached end
      if (maze[newY][newX] === 3) {
        setGameWon(true);
      }

      drawMaze();
    }
  };

  const resetGame = () => {
    playerPosRef.current = { x: 1, y: 1 };
    setGameWon(false);
    setMoves(0);
    drawMaze();
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      drawMaze();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameWon]);

  return (
    <div className={styles.mazeContainer}>
      <div className={styles.mazeHeader}>
        <h2 className={styles.mazeTitle}>Maze Challenge</h2>
        <p className={styles.mazeInstructions}>
          Use arrow keys or WASD to navigate from <span className={styles.green}>green</span> to <span className={styles.red}>red</span>
        </p>
      </div>
      
      <div className={styles.mazeWrapper}>
        <canvas
          ref={canvasRef}
          width={maze[0].length * cellSize}
          height={maze.length * cellSize}
          className={styles.mazeCanvas}
        />
      </div>

      <div className={styles.mazeStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Moves:</span>
          <span className={styles.statValue}>{moves}</span>
        </div>
        {gameWon && (
          <div className={styles.winMessage}>
            🎉 You won in {moves} moves!
          </div>
        )}
        <button onClick={resetGame} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default MazeGame;
