import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { VscCircuitBoard, VscEye, VscFileMedia, VscCode, VscCopy, VscCheck } from 'react-icons/vsc';
import { AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import BOMViewer from '@/components/BOMViewer';
import MatrixBackground from '@/components/MatrixBackground';

import { Circuit } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface CircuitCardProps {
  circuit: Circuit;
}

const CircuitCard = ({ circuit }: CircuitCardProps) => {
  const [bomOpen, setBomOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [iframeInteractive, setIframeInteractive] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedCodeVariant, setSelectedCodeVariant] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'interface' | 'voltage'>('name');
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Get the current code to display
  const currentCode = circuit.codeVariants 
    ? circuit.codeVariants[selectedCodeVariant].code 
    : circuit.code;
  
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
      'Verilog': '/logos/verilog_icon.svg',
      'KiCad': '/logos/kicad_icon.svg',
      'LTspice': '/logos/ltspice_icon.svg',
      'Linux': '/logos/linux_icon.svg',
    };
    return iconMap[tech] || '/logos/circuit_icon.svg';
  };

  const categoryColor = getCategoryColor();
  
  // Handle iframe interaction to prevent scroll trapping
  useEffect(() => {
    const container = iframeContainerRef.current;
    if (!container || !embedOpen) return;

    const handlePointerEnter = () => {
      setIframeInteractive(true);
    };

    const handlePointerLeave = () => {
      setIframeInteractive(false);
      // Force blur on the iframe to release any captured events
      const iframe = container.querySelector('iframe');
      if (iframe && document.activeElement === iframe) {
        (iframe as HTMLElement).blur();
      }
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      setIframeInteractive(false);
    };
  }, [embedOpen]);
  
  return (
    <div
      className={styles.card}
      style={{
        '--card-accent-color': categoryColor,
      } as React.CSSProperties}
    >
      <div className={styles.cardGlow}></div>
      
      {/* Logo Wrapper - Fixed to card, not content */}
      <div className={styles.logoWrapper}>
        {circuit.technologies.map((tech, index) => (
          <Image
            key={index}
            src={getTechIcon(tech)}
            alt={`${tech} icon`}
            width={24}
            height={24}
            className={styles.logo}
            priority
            style={{
              width: '24px',
              height: '24px',
              minWidth: '24px',
              minHeight: '24px',
            }}
          />
        ))}
      </div>
      
      <div className={styles.content}>
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
          {circuit.dateRange}
        </p>
        <p className={styles.dateRange} style={{ marginTop: '-0.5rem' }}>
          {circuit.platform} • {circuit.software}
        </p>
        <p className={styles.description}>{circuit.description}</p>
        
        {/* Funded Prototype Badge */}
        {circuit.fundedPrototype && (
          <div className={styles.fundedBadge}>
            <span className={styles.fundedBadgeText}>Funded Prototype</span>
          </div>
        )}
        
        {/* College Course Project Badge */}
        {circuit.collegeCourseProject && (
          <div className={styles.fundedBadge}>
            <span className={styles.fundedBadgeText}>College Course Project</span>
          </div>
        )}
        
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
          {circuit.embedUrl && (
            <button
              onClick={() => {
                setEmbedOpen(!embedOpen);
                if (!embedOpen) {
                  setBomOpen(false);
                  setCodeOpen(false);
                }
              }}
              className={`${styles.iconLink} ${styles.bomButton}`}
              style={{ color: embedOpen ? categoryColor : 'rgba(255, 255, 255, 0.6)' }}
              title="View Embedded Circuit"
            >
              <VscEye />
            </button>
          )}
          {circuit.schematicLink && (
            <a
              href={circuit.schematicLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.iconLink}`}
              style={{ color: categoryColor }}
              title="View Schematic"
            >
              <VscFileMedia />
            </a>
          )}
          {(circuit.code || circuit.codeVariants) && (
            <button
              onClick={() => {
                setCodeOpen(!codeOpen);
                if (!codeOpen) {
                  setBomOpen(false);
                  setEmbedOpen(false);
                }
              }}
              className={`${styles.iconLink} ${styles.bomButton}`}
              style={{ color: codeOpen ? categoryColor : 'rgba(255, 255, 255, 0.6)' }}
              title="View Source Code"
            >
              <VscCode />
            </button>
          )}
          {circuit.components && circuit.components.length > 0 && (
            <button
              onClick={() => {
                setBomOpen(!bomOpen);
                if (!bomOpen) {
                  setEmbedOpen(false);
                  setCodeOpen(false);
                }
              }}
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
              totalCost={circuit.totalCost}
              isInline={true}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}
        </AnimatePresence>

        {/* Embedded Circuit Viewer */}
        <AnimatePresence mode="wait">
          {circuit.embedUrl && embedOpen && (
            <div 
              style={{
                marginTop: '1rem',
                width: '100%',
                border: `2px solid ${categoryColor}`,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                boxShadow: `0 0 20px ${categoryColor}40`,
              }}
            >
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderBottom: `1px solid ${categoryColor}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: categoryColor,
                  }}
                >
                  Circuit Preview
                </span>
                {circuit.hasBuzzer && (
                  <span
                    style={{
                      fontFamily: "'Fira Code', 'Consolas', monospace",
                      fontSize: '0.65rem',
                      color: 'rgba(255, 193, 7, 0.9)',
                      fontStyle: 'italic',
                      flex: '1 1 auto',
                      textAlign: 'center',
                      minWidth: '200px',
                    }}
                  >
                    Note: Buzzer is muted in simulation. Minor changes needed to enable sound.
                  </span>
                )}
                <button
                  onClick={() => setEmbedOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ×
                </button>
              </div>
              <div 
                ref={iframeContainerRef}
                style={{ 
                  width: '100%', 
                  aspectRatio: '450/280',
                  position: 'relative',
                  cursor: iframeInteractive ? 'default' : 'pointer',
                }}
              >
                <iframe
                  src={circuit.embedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginWidth={0}
                  marginHeight={0}
                  scrolling="no"
                  style={{ 
                    display: 'block',
                    pointerEvents: iframeInteractive ? 'auto' : 'none',
                    transition: 'none',
                  }}
                  title={`${circuit.title} embedded circuit`}
                />
                {!iframeInteractive && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'transparent',
                      cursor: 'default',
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Code Viewer */}
        <AnimatePresence mode="wait">
          {(circuit.code || circuit.codeVariants) && codeOpen && (
            <div 
              style={{
                marginTop: '1rem',
                width: '100%',
                border: `2px solid ${categoryColor}`,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                boxShadow: `0 0 20px ${categoryColor}40`,
              }}
            >
              <div
                style={{
                  padding: '0.75rem 3.5rem 0.75rem 0.75rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderBottom: `1px solid ${categoryColor}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  minHeight: '52px',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: categoryColor,
                  }}
                >
                  sketch.ino
                </span>
                
                {/* Code Variant Selector */}
                {circuit.codeVariants && circuit.codeVariants.length > 1 && (
                  <select
                    value={selectedCodeVariant}
                    onChange={(e) => setSelectedCodeVariant(Number(e.target.value))}
                    style={{
                      fontFamily: "'Fira Code', 'Consolas', monospace",
                      fontSize: '0.7rem',
                      padding: '0.35rem 0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: categoryColor,
                      border: `1px solid ${categoryColor}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {circuit.codeVariants.map((variant, index) => (
                      <option key={index} value={index} style={{ backgroundColor: '#1e1e1e' }}>
                        {variant.label}
                      </option>
                    ))}
                  </select>
                )}
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentCode || '');
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className={styles.copyButton}
                  aria-label="Copy code"
                >
                  {codeCopied ? <VscCheck className={styles.checkmark} /> : <VscCopy className={styles.clipboard} />}
                </button>
              </div>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Matrix Background - Only animate if not reduced motion */}
                {!prefersReducedMotion && <MatrixBackground />}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    maxHeight: '400px',
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  className="hide-scrollbar"
                >
                  <SyntaxHighlighter
                    language="cpp"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      backgroundColor: prefersReducedMotion ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                      }
                    }}
                  >
                    {currentCode || ''}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CircuitCard;
