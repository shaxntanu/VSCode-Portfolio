import { useState } from 'react';
import { VscInfo } from 'react-icons/vsc';
import ProjectCard from '@/components/ProjectCard';
import SoftwareInfoPopup from '@/components/SoftwareInfoPopup';
import { projects, categoryConfig, ProjectCategory } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

const ProjectsPage = () => {
  const [showSoftwareInfo, setShowSoftwareInfo] = useState(false);

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<ProjectCategory, typeof projects>);

  // Sort projects within each category by year (oldest to newest)
  Object.keys(groupedProjects).forEach((category) => {
    groupedProjects[category as ProjectCategory].sort((a, b) => a.year - b.year);
  });

  // Define category order: Hardware first, then Arceus Labs, then Ragastra, then Software
  const categoryOrder: ProjectCategory[] = ['HARDWARE_MODULES', 'COMMUNITY_PROJECT', 'RAGASTRA_PROJECT', 'SOFTWARE_SYSTEMS', 'MISC_LABS'];

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>firmware.ino</h1>
      <p className={styles.pageSubtitle}>
        A collection of hardware and software projects spanning embedded systems, IoT devices, and intelligent applications. From environmental monitoring stations and navigation systems to AI-powered chatbots and web dashboards, each project represents hands-on engineering work across the full technology stack.
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
              {category === 'SOFTWARE_SYSTEMS' && (
                <button
                  className={styles.infoButton}
                  onClick={() => setShowSoftwareInfo(true)}
                  aria-label="Software projects info"
                  title="Click for more info"
                >
                  <VscInfo />
                  <span className={styles.infoText}>AI-Assisted</span>
                </button>
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
      
      {showSoftwareInfo && <SoftwareInfoPopup onClose={() => setShowSoftwareInfo(false)} />}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Projects' },
  };
}

export default ProjectsPage;
