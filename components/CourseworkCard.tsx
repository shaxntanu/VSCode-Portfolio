import { VscGithubInverted, VscCode } from 'react-icons/vsc';
import { CourseworkItem } from '@/types';
import { useRouter } from 'next/router';

import styles from '@/styles/CourseworkCard.module.css';

interface CourseworkCardProps {
  coursework: CourseworkItem;
}

// Technology color mapping based on existing skill data
const getTechColor = (tech: string): string => {
  const techColors: Record<string, string> = {
    // Languages & Frameworks
    'Python': '#3776ab',
    'Java': '#f89820',
    'Kotlin': '#7f52ff',
    'JavaScript': '#f7df1e',
    'MATLAB': '#e16737',
    'Verilog': '#00dc8c',
    'HDL': '#00dc8c',
    
    // Development Tools
    'Android Studio': '#3ddc84',
    'OpenCV': '#5c3ee8',
    'NumPy': '#013243',
    'Matplotlib': '#11557c',
    'Pandas': '#150458',
    'Jupyter': '#f37626',
    
    // Areas & Technologies
    'Machine Learning': '#ff6b6b',
    'Digital Logic': '#a078ff',
    'Image Processing': '#2196f3',
    'Physics Simulation': '#9c27b0',
    'Data Science': '#ff9800',
    'Linear Programming': '#4caf50',
    'Optimization': '#ff5722',
    'Hardware Design': '#ff8c50',
    'XML': '#ff6600',
    
    // Default
    'default': '#64748b'
  };
  
  return techColors[tech] || techColors['default'];
};

const getYearColor = (year: number): string => {
  const yearColors = {
    1: '#00dc8c', // Green
    2: '#2196f3', // Blue  
    3: '#ff9800', // Orange
    4: '#9c27b0'  // Purple
  };
  return yearColors[year as keyof typeof yearColors] || '#64748b';
};

const CourseworkCard = ({ coursework }: CourseworkCardProps) => {
  const router = useRouter();
  const yearColor = getYearColor(coursework.year);

  const handleProjectReference = () => {
    if (coursework.projectReference) {
      // Navigate to projects page and scroll to the specific project
      router.push(`/projects#${coursework.projectReference}`);
    }
  };

  const renderTechTags = () => {
    // Show only 4 most relevant technologies to keep it clean
    const displayTechs = coursework.technologies.slice(0, 4);
    
    return (
      <div className={styles.techTags}>
        {displayTechs.map((tech, index) => (
          <span
            key={index}
            className={styles.techTag}
            style={{ 
              backgroundColor: `${getTechColor(tech)}20`,
              color: getTechColor(tech),
              borderColor: `${getTechColor(tech)}40`
            }}
          >
            {tech}
          </span>
        ))}
        {coursework.technologies.length > 4 && (
          <span className={styles.techTag} style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}>
            +{coursework.technologies.length - 4}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={styles.card}
      style={{
        '--card-accent-color': yearColor,
      } as React.CSSProperties}
    >
      <div className={styles.cardGlow}></div>
      <div className={styles.content}>
        {/* Year badge */}
        <div 
          className={styles.yearBadge}
          style={{ backgroundColor: yearColor }}
        >
          YEAR {coursework.year}
        </div>
        
        {/* Title */}
        <h3 className={styles.title} style={{ color: yearColor }}>
          {coursework.title}
        </h3>
        
        {/* Type and Subject */}
        <div className={styles.metaInfo}>
          <span className={styles.type}>{coursework.type}</span>
          {coursework.subject && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.subject}>{coursework.subject}</span>
            </>
          )}
        </div>
        
        {/* Area */}
        <p className={styles.area}>{coursework.area}</p>
        
        {/* Description */}
        <p className={styles.description}>{coursework.description}</p>
        
        {/* Technology tags */}
        {renderTechTags()}
        
        {/* Action buttons */}
        <div className={styles.actionButtons}>
          {/* Repository button (primary) */}
          <a
            href={coursework.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
            style={{ 
              backgroundColor: yearColor,
              color: '#050505'
            }}
            title="View Repository"
          >
            <VscGithubInverted />
            VIEW REPOSITORY
          </a>
          
          {/* Project reference button (secondary) */}
          {coursework.projectReference && (
            <button
              onClick={handleProjectReference}
              className={styles.secondaryButton}
              style={{ 
                borderColor: yearColor,
                color: yearColor
              }}
              title="Open Project Page"
            >
              <VscCode />
              OPEN PROJECT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseworkCard;