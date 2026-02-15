import ProjectCard from '@/components/ProjectCard';
import { projects, categoryConfig, ProjectCategory } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const ProjectsPage = () => {
  // Group projects by year first, then by category
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = {};
    }
    if (!acc[project.year][project.category]) {
      acc[project.year][project.category] = [];
    }
    acc[project.year][project.category].push(project);
    return acc;
  }, {} as Record<number, Record<ProjectCategory, typeof projects>>);

  // Get years in descending order
  const years = Object.keys(projectsByYear).map(Number).sort((a, b) => b - a);

  // Define category order
  const categoryOrder: ProjectCategory[] = ['HARDWARE_MODULES', 'SOFTWARE_SYSTEMS', 'MISC_LABS', 'COMMUNITY_PROJECT'];

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>firmware.ino</h1>
      <p className={styles.pageSubtitle}>
        A collection of hardware and software projects spanning embedded systems, IoT devices, and intelligent applications. From environmental monitoring stations and navigation systems to AI-powered chatbots and web dashboards, each project represents hands-on engineering work across the full technology stack.
      </p>

      {years.map((year) => (
        <div key={year}>
          <div className={styles.yearDivider}>
            <span className={styles.yearLabel}>{year}</span>
          </div>
          
          {categoryOrder.map((category) => {
            const categoryProjects = projectsByYear[year][category];
            if (!categoryProjects || categoryProjects.length === 0) return null;
            
            const config = categoryConfig[category];
            
            return (
              <div key={`${year}-${category}`} className={styles.categorySection}>
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
      ))}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Projects' },
  };
}

export default ProjectsPage;
