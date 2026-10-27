import ProjectCard from '@/components/ProjectCard';
import { projects, categoryConfig } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const MiniBuildsPage = () => {
  const miniBuildsProjects = projects.filter(project => project.category === 'MINI_BUILDS');
  const config = categoryConfig['MINI_BUILDS'];
  const sections = [
    {
      type: 'ELECTRONICS',
      title: 'ELECTRONICS',
      color: categoryConfig.HARDWARE_MODULES.color,
    },
    {
      type: 'SOFTWARE',
      title: 'SOFTWARE',
      color: categoryConfig.SOFTWARE_SYSTEMS.color,
    },
  ] as const;

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>minibuilds.cfg</h1>
      <p className={styles.pageSubtitle}>
        Small experiments and learning projects, organized into electronics builds and software tools.
      </p>

      {sections.map((section) => {
        const sectionProjects = miniBuildsProjects
          .filter(project => project.miniBuildType === section.type)
          .sort((a, b) => a.year - b.year);
        const sectionConfig = { ...config, color: section.color };

        return (
          <section
            key={section.type}
            className={styles.categorySection}
            aria-labelledby={`mini-builds-${section.type.toLowerCase()}`}
          >
            <div
              className={styles.categoryHeader}
              id={`mini-builds-${section.type.toLowerCase()}`}
              role="heading"
              aria-level={2}
            >
              <span className={styles.comment}>{config.title}</span>
              <span style={{ color: section.color }}>{section.title}</span>
            </div>
            <div className={styles.container}>
              {sectionProjects.map((project) => (
                <div key={project.slug} id={project.slug}>
                  <ProjectCard
                    project={project}
                    categoryConfig={sectionConfig}
                    accented
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Mini Builds',
      ogDescription: 'Small experiments, utilities, and hardware learning projects - ESP32-C3, Arduino, ESP8266, and quick builds.'
    },
  };
}

export default MiniBuildsPage;
