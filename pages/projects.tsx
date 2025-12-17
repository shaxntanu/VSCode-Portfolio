import ProjectCard from '@/components/ProjectCard';
import { projects, categoryConfig, ProjectCategory } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const ProjectsPage = () => {
  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<ProjectCategory, typeof projects>);

  // Define category order
  const categoryOrder: ProjectCategory[] = ['HARDWARE_MODULES', 'SOFTWARE_SYSTEMS', 'MISC_LABS', 'COMMUNITY_PROJECT'];

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>firmware.ino</h1>
      <p className={styles.pageSubtitle}>
        A showcase of engineered systems across the hardware-software spectrum. From embedded IoT solutions like Zephyr Station and the Smart Blind Stick, to exploring artificial intelligence with Marcus Omega, these projects demonstrate my ability to build both physical devices and intelligent digital applications.
      </p>

      {categoryOrder.map((category) => {
        const categoryProjects = groupedProjects[category];
        if (!categoryProjects || categoryProjects.length === 0) return null;
        
        const config = categoryConfig[category];
        
        return (
          <div key={category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <span className={styles.comment}>{config.title}</span>
              {config.link ? (
                <a
                  href={config.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.categoryLink}
                  style={{ color: config.color }}
                >
                  {config.titleHighlight}
                </a>
              ) : (
                <span style={{ color: config.color }}>{config.titleHighlight}</span>
              )}
            </div>
            <div className={styles.container}>
              {categoryProjects.map((project) => (
                <ProjectCard 
                  key={project.slug} 
                  project={project} 
                  categoryConfig={config}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Projects' },
  };
}

export default ProjectsPage;
