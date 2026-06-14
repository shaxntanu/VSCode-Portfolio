import { forwardRef } from 'react';
import styles from '@/styles/Terminal.module.css';

interface TerminalInputProps {
  onSubmit: (input: string) => void;
  onHistoryNavigate: (direction: 'up' | 'down') => void;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ onSubmit, onHistoryNavigate }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const input = (e.target as HTMLInputElement).value;
        onSubmit(input);
        (e.target as HTMLInputElement).value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onHistoryNavigate('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onHistoryNavigate('down');
      }
    };

    return (
      <div className={styles.inputWrapper}>
        <span className={styles.prompt}>shantanu@portfolio:~$</span>
        <input
          ref={ref}
          type="text"
          className={styles.input}
          placeholder="Type a command..."
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';

export default TerminalInput;
