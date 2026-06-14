import { TerminalEntry } from './Terminal';
import styles from '@/styles/Terminal.module.css';

interface TerminalOutputProps {
  entries: TerminalEntry[];
}

const TerminalOutput = ({ entries }: TerminalOutputProps) => {
  return (
    <div className={styles.content}>
      {entries.map((entry, index) => (
        <div key={index} className={`${styles.entry} ${styles[entry.type]}`}>
          {entry.type === 'input' && (
            <div className={styles.inputLine}>
              <span className={styles.prompt}>shantanu@portfolio:~$</span>
              <span className={styles.command}>{entry.content}</span>
            </div>
          )}
          {entry.type === 'output' && (
            <div className={styles.outputLine}>
              {Array.isArray(entry.content) ? (
                entry.content.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))
              ) : (
                <div>{entry.content}</div>
              )}
            </div>
          )}
          {entry.type === 'error' && (
            <div className={styles.errorLine}>
              {Array.isArray(entry.content) ? (
                entry.content.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))
              ) : (
                <div>{entry.content}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TerminalOutput;
