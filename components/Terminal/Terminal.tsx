import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/contexts/UIStateContext';
import { executeCommand } from '@/utils/terminalCommands';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import styles from '@/styles/Terminal.module.css';

export interface TerminalEntry {
  type: 'input' | 'output' | 'error';
  content: string | string[];
  timestamp: Date;
}

const Terminal = () => {
  const { terminalOpen, setTerminalOpen, terminalHeight, setTerminalHeight } = useUIState();
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      type: 'output',
      content: [
        '╔════════════════════════════════════════════╗',
        '║     SHANTANU\'S PORTFOLIO TERMINAL v1.0    ║',
        '║          Type "help" for commands          ║',
        '╚════════════════════════════════════════════╝',
      ],
      timestamp: new Date(),
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Auto-scroll to bottom when new output appears
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  // Focus input when terminal opens
  useEffect(() => {
    if (terminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [terminalOpen]);

  const handleCommand = (input: string) => {
    if (!input.trim()) return;

    // Add input to entries
    setEntries((prev) => [...prev, { type: 'input', content: input, timestamp: new Date() }]);

    // Add to history
    setHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);

    // Execute command
    const result = executeCommand(input);

    // Handle clear command
    if (result === '___CLEAR___') {
      setEntries([]);
      return;
    }

    // Add output to entries
    setEntries((prev) => [
      ...prev,
      {
        type: 'output',
        content: result,
        timestamp: new Date(),
      },
    ]);
  };

  const handleHistoryNavigate = (direction: 'up' | 'down') => {
    let newIndex = historyIndex;

    if (direction === 'up') {
      newIndex = Math.min(historyIndex + 1, history.length - 1);
    } else {
      newIndex = Math.max(historyIndex - 1, -1);
    }

    setHistoryIndex(newIndex);

    if (inputRef.current) {
      if (newIndex === -1) {
        inputRef.current.value = '';
      } else {
        inputRef.current.value = history[newIndex];
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      isResizing.current = true;
      startYRef.current = e.clientY;
      startHeightRef.current = terminalHeight;
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      const delta = startYRef.current - e.clientY;
      const newHeight = Math.max(100, Math.min(800, startHeightRef.current + delta));
      setTerminalHeight(newHeight);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    if (isResizing.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [terminalHeight, setTerminalHeight]);

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          ref={containerRef}
          className={styles.terminal}
          style={{ height: terminalHeight }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: terminalHeight, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.header}>
            <span className={styles.title}>Terminal</span>
            <button
              className={styles.closeBtn}
              onClick={() => setTerminalOpen(false)}
              aria-label="Close terminal"
            >
              ✕
            </button>
          </div>

          <div className={styles.resizeHandle} />

          <div className={styles.outputArea} ref={outputRef}>
            <TerminalOutput entries={entries} />
          </div>

          <TerminalInput
            ref={inputRef}
            onSubmit={handleCommand}
            onHistoryNavigate={handleHistoryNavigate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;
