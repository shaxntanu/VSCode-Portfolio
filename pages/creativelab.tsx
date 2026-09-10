import ProjectCard from '@/components/ProjectCard';
import { projects, categoryConfig } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const CreativeLabPage = () => {
  // Filter only CREATIVE_LAB projects
  const creativeLabProjects = projects.filter(project => project.category === 'CREATIVE_LAB');
  
  // Sort by year (oldest to newest)
  creativeLabProjects.sort((a, b) => a.year - b.year);
  
  const config = categoryConfig['CREATIVE_LAB'];

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>creative.lab</h1>
      <p className={styles.pageSubtitle}>
        Creative experiments and visual work that sits outside the main engineering categories. This is where technical skills meet artistic exploration—real-time rendering, interactive installations, generative art, and experimental audiovisual projects.
      </p>

      <div className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <span className={styles.comment}>// </span>
          <span style={{ color: config.color }}>Creative Lab</span>
        </div>
        <div className={styles.container}>
          {creativeLabProjects.map((project) => (
            <div key={project.slug} id={project.slug}>
              <ProjectCard 
                project={project} 
                categoryConfig={config}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Creative Lab',
      ogDescription: 'Visual experiments, interactive installations, and creative technical projects - where engineering meets art.'
    },
  };
}

export default CreativeLabPage;
