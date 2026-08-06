import styles from '@/styles/MatrixBackground.module.css';

const MatrixBackground = () => {
  const patterns = 5;
  const columnsPerPattern = 40;

  return (
    <div className={styles.matrixContainer}>
      {Array.from({ length: patterns }).map((_, patternIndex) => (
        <div key={patternIndex} className={styles.matrixPattern}>
          {Array.from({ length: columnsPerPattern }).map((_, columnIndex) => (
            <div key={columnIndex} className={styles.matrixColumn} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MatrixBackground;
