import { useState } from 'react';
import Image from 'next/image';
import { VscCircuitBoard } from 'react-icons/vsc';
import { AnimatePresence } from 'framer-motion';
import BOMViewer from '@/components/BOMViewer';

import { Circuit } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface CircuitCardProps {
  circuit: Circuit;
}

const CircuitCard = ({ circuit }: CircuitCardProps) => {
  const [bomOpen, setBomOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'interface' | 'voltage'>('name');
  
  // Get color based on category
  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      EMBEDDED: '#ff8c50',
      ANALOG: '#2196f3',
      DIGITAL_LOGIC: '#9c27b0',
      SENSORS: '#00dc8c',
      POWER_ELECTRONICS: '#ff5722',
      COMMUNICATION: '#00bcd4',
      PCB: '#4caf50',
      EDUCATIONAL: '#ffc107',
    };
    return colors[circuit.category] || '#a078ff';
  };

  // Get difficulty badge color
  const getDifficultyColor = () => {
    const colors: Record<string, string> = {
      BEGINNER: '#4caf50',
      INTERMEDIATE: '#ff9800',
      ADVANCED: '#f44336',
    };
    return colors[circuit.difficulty] || '#9e9e9e';
  };

  // Get status badge color
  const getStatusColor = () => {
    const colors: Record<string, string> = {
      VERIFIED: '#4caf50',
      IN_PROGRESS: '#ff9800',
      EXPERIMENTAL: '#9c27b0',
    };
    return colors[circuit.status] || '#9e9e9e';
  };

  // Get technology icon path
  const getTechIcon = (tech: string) => {
    const iconMap: Record<string, string> = {
      'Arduino': '/logos/arduino_icon.svg',
      'Tinkercad': '/logos/tinkercad_icon.svg',
      'ESP32': '/logos/espressif_icon.svg',
      'ESP8266': '/logos/espressif_icon.svg',
      'KiCad': '/logos/kicad_icon.svg',
      'LTspice': '/logos/ltspice_icon.svg',
    };
    return iconMap[tech] || '/logos/circuit_icon.svg';
  };

  const categoryColor = getCategoryColor();
  
  return (
    <div
      className={styles.card}
      style={{
        '--card-accent-color': categoryColor,
      } as React.CSSProperties}
    >
      <div className={styles.cardGlow}></div>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          {circuit.technologies.map((tech, index) => (
            <Image
              key={index}
              src={getTechIcon(tech)}
              alt={`${tech} icon`}
              width={24}
              height={24}
              className={styles.logo}
            />
          ))}
        </div>
        <div 
          className={styles.categoryBadge}
          style={{ backgroundColor: categoryColor }}
        >
          {circuit.category.replace('_', ' ')}
        </div>
        <h3 className={styles.title} style={{ color: categoryColor }}>
          {circuit.title}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span 
            style={{ 
              fontSize: '0.65rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: getDifficultyColor(),
              color: '#050505'
            }}
          >
            {circuit.difficulty}
          </span>
          <span 
            style={{ 
              fontSize: '0.65rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: getStatusColor(),
              color: '#050505'
            }}
          >
            {circuit.status}
          </span>
        </div>
        <p className={styles.dateRange}>
          {circuit.platform} • {circuit.software}
        </p>
        <p className={styles.description}>{circuit.description}</p>
        
        <div className={styles.linkIcons}>
          <a
            href={circuit.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: categoryColor,
              color: '#050505',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Open Circuit
          </a>
          {circuit.components && circuit.components.length > 0 && (
            <button
              onClick={() => setBomOpen(!bomOpen)}
              className={`${styles.iconLink} ${styles.bomButton}`}
              style={{ color: bomOpen ? categoryColor : 'rgba(255, 255, 255, 0.6)' }}
              title="View Bill of Materials"
            >
              <VscCircuitBoard />
            </button>
          )}
        </div>

        {/* BOM Dropdown */}
        <AnimatePresence mode="wait">
          {circuit.components && circuit.components.length > 0 && bomOpen && (
            <BOMViewer 
              components={circuit.components} 
              architecture={undefined}
              totalCost={undefined}
              isInline={true}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CircuitCard;
