import { useState } from 'react';
import Image from 'next/image';
import { VscGithubInverted, VscCircuitBoard, VscMortarBoard } from 'react-icons/vsc';
import { SiVercel, SiNotion } from 'react-icons/si';
import { AnimatePresence } from 'framer-motion';
import BOMViewer from '@/components/BOMViewer';
import { getProjectSkills, normalizeSkillName } from '@/utils/skillsMapper';

import { Project, CategoryConfig } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  categoryConfig: CategoryConfig;
}

const ProjectCard = ({ project, categoryConfig }: ProjectCardProps) => {
  const [bomOpen, setBomOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'interface' | 'voltage'>('name');
  const logos = Array.isArray(project.logo) ? project.logo : [project.logo];
  
  // Determine which icon to show based on the link
  const getLinkIcon = () => {
    if (project.link === '#') return null;
    if (project.link.includes('github.com')) return <VscGithubInverted />;
    if (project.link.includes('vercel.app')) return <SiVercel />;
    if (project.link.includes('notion.site')) return <SiNotion />;
    return <VscGithubInverted />; // default
  };

  const getReportIcon = () => {
    if (!project.reportLink) return null;
    if (project.reportLink.includes('notion.site')) return <SiNotion />;
    return <SiNotion />; // default to Notion
  };

  const getCertificateIcon = () => {
    if (!project.certificateLink) return null;
    return <VscMortarBoard />; // Graduation cap icon for certificate
  };

  const linkIcon = getLinkIcon();
  const reportIcon = getReportIcon();
  const certificateIcon = getCertificateIcon();
  
  return (
    <div
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
        
        {/* Skill Tags */}
        {(() => {
          const skills = getProjectSkills(project.slug);
          if (skills.length === 0) return null;
          
          return (
            <div className={styles.skillTags}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className={styles.skillTag}
                  style={{ 
                    backgroundColor: `${skill.color}20`,
                    color: skill.color,
                    borderColor: `${skill.color}40`
                  }}
                  title={`${skill.category} - ${skill.proficiency}`}
                >
                  {normalizeSkillName(skill.name)}
                </span>
              ))}
            </div>
          );
        })()}
        
        {(linkIcon || reportIcon || certificateIcon || (project.components && project.components.length > 0)) && (
          <div className={styles.linkIcons}>
            {linkIcon && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                style={{ color: categoryConfig.color }}
                title={`View on ${project.link.includes('github') ? 'GitHub' : project.link.includes('vercel') ? 'Vercel' : 'Notion'}`}
              >
                {linkIcon}
              </a>
            )}
            {reportIcon && (
              <a
                href={project.reportLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                style={{ color: categoryConfig.color }}
                title="View Technical Report"
              >
                {reportIcon}
              </a>
            )}
            {certificateIcon && (
              <a
                href={project.certificateLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                style={{ color: categoryConfig.color }}
                title="View Certificate"
              >
                {certificateIcon}
              </a>
            )}
            {project.components && project.components.length > 0 && (
              <button
                onClick={() => setBomOpen(!bomOpen)}
                className={`${styles.iconLink} ${styles.bomButton}`}
                style={{ color: bomOpen ? categoryConfig.color : 'rgba(255, 255, 255, 0.6)' }}
                title="View Bill of Materials"
              >
                <VscCircuitBoard />
              </button>
            )}
          </div>
        )}

        {/* BOM Dropdown - toggled by button with closing animation */}
        <AnimatePresence mode="wait">
          {project.components && project.components.length > 0 && bomOpen && (
            <BOMViewer 
              components={project.components} 
              architecture={project.architecture}
              totalCost={project.totalCost}
              isInline={true}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}
        </AnimatePresence>

        {/* Project Badge - College Project or Funded Prototype */}
        {project.fundedPrototype && (
          <div className={styles.fundedBadge}>
            <span className={styles.fundedBadgeText}>
              {project.badgeType === 'college' ? 'College Project' : 'Funded Prototype'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
