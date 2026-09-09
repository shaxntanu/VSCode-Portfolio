import ProjectCard from '@/components/ProjectCard';
import { projects, categoryConfig } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const MiniBuildsPage = () => {
  // Filter only MINI_BUILDS projects
  const miniBuildsProjects = projects.filter(project => project.category === 'MINI_BUILDS');
  
  // Sort by year (oldest to newest)
  miniBuildsProjects.sort((a, b) => a.year - b.year);
  
  const config = categoryConfig['MINI_BUILDS'];

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>minibuilds.cfg</h1>
      <p className={styles.pageSubtitle}>
        Quick experiments, utility scripts, and small hardware builds. These are the learning ground projects where ideas are tested before becoming full-scale implementations. From PowerShell utilities to Arduino starter projects and IoT measurement tools.
      </p>

      <div className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <span className={styles.comment}>{config.title}</span>
          <span style={{ color: config.color }}>{config.titleHighlight}</span>
        </div>
        <div className={styles.container}>
          {miniBuildsProjects.map((project) => (
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
      title: 'Mini Builds',
      ogDescription: 'Small experiments, utilities, and hardware learning projects - Arduino, ESP8266, and quick builds.'
    },
  };
}

export default MiniBuildsPage;
