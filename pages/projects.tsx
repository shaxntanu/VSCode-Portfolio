import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const ProjectsPage = () => {
  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>Deployed Solutions</h1>
      <p className={styles.pageSubtitle}>
        A showcase of engineered systems across the hardware-software spectrum. From embedded IoT solutions like Zephyr Station and the Smart Blind Stick, to exploring artificial intelligence with Marcus Omega, these projects demonstrate my ability to build both physical devices and intelligent digital applications.
      </p>

      <div className={styles.container}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Projects' },
  };
}

export default ProjectsPage;
