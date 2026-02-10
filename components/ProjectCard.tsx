import Image from 'next/image';

import { Project, CategoryConfig } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  categoryConfig: CategoryConfig;
}

const ProjectCard = ({ project, categoryConfig }: ProjectCardProps) => {
  const logos = Array.isArray(project.logo) ? project.logo : [project.logo];
  
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={{
        '--card-accent-color': categoryConfig.color,
      } as React.CSSProperties}
    >
      <div className={styles.cardGlow}></div>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          {logos.map((logo, index) => (
            <Image
              key={index}
              src={logo}
              alt={`${project.title} logo ${index + 1}`}
              width={24}
              height={24}
              className={styles.logo}
            />
          ))}
        </div>
        <div 
          className={styles.categoryBadge}
          style={{ backgroundColor: categoryConfig.color }}
        >
          {project.category.replace('_', ' ')}
        </div>
        <h3 className={styles.title} style={{ color: categoryConfig.color }}>
          {project.title}
        </h3>
        <p className={styles.dateRange}>{project.dateRange}</p>
        <p className={styles.description}>{project.description}</p>
      </div>
    </a>
  );
};

export default ProjectCard;
