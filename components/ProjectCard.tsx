import { useState } from 'react';
import Image from 'next/image';
import { VscGithubInverted, VscCircuitBoard } from 'react-icons/vsc';
import { SiVercel, SiNotion } from 'react-icons/si';
import BOMViewer from '@/components/BOMViewer';

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

  const linkIcon = getLinkIcon();
  const reportIcon = getReportIcon();
  
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
        
        {(linkIcon || reportIcon || (project.components && project.components.length > 0)) && (
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
            {project.components && project.components.length > 0 && (
              <>
                <button
                  onClick={() => setBomOpen(!bomOpen)}
                  className={`${styles.iconLink} ${styles.bomButton}`}
                  style={{ color: bomOpen ? categoryConfig.color : 'rgba(255, 255, 255, 0.6)' }}
                  title="View Bill of Materials"
                >
                  <VscCircuitBoard />
                </button>
                
                {/* Sort Dropdown - Custom component matching GithubPage pattern */}
                <div className={styles.sortDropdownContainer} style={{ '--sort-accent': categoryConfig.color } as React.CSSProperties}>
                  <SortDropdown 
                    sortBy={sortBy} 
                    setSortBy={setSortBy}
                    accentColor={categoryConfig.color}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* BOM Dropdown - rendered inline inside card */}
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
      </div>
    </div>
  );
};

export default ProjectCard;

// Custom Sort Dropdown Component for use in ProjectCard
const SortDropdown = ({ 
  sortBy, 
  setSortBy,
  accentColor
}: { 
  sortBy: 'name' | 'interface' | 'voltage';
  setSortBy: (sort: 'name' | 'interface' | 'voltage') => void;
  accentColor?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'interface', label: 'Interface' },
    { value: 'voltage', label: 'Voltage' },
  ];

  const handleSelect = (value: 'name' | 'interface' | 'voltage') => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.cardSortDropdown}>
      <button
        className={styles.cardSortButton}
        onClick={() => setIsOpen(!isOpen)}
        style={isOpen || sortBy !== 'name' ? { color: accentColor } : { color: 'rgba(255, 255, 255, 0.6)' }}
      >
        ⇅
      </button>
      
      {isOpen && (
        <div className={styles.cardSortMenu}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.cardSortOption} ${sortBy === option.value ? styles.cardSortSelected : ''}`}
              onClick={() => handleSelect(option.value as any)}
              style={sortBy === option.value ? { color: accentColor } : {}}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
