import SkillMatrix from '@/components/SkillMatrix';
import styles from '@/styles/SkillMatrixPage.module.css';

const SkillMatrixPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}># skillmatrix.ipynb</h1>
        <p className={styles.subtitle}>Jupyter Notebook: Skill Analysis & Visualization</p>
      </div>

      <SkillMatrix />
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Skill Matrix' },
  };
}

export default SkillMatrixPage;
