import { useEffect } from 'react';
import { useUIState } from '@/contexts/UIStateContext';
import { projects } from '@/data/projects';

const PortfolioStatsModal = () => {
  const { setStatsModalOpen } = useUIState();

  // Calculate metrics from data
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => !p.title.includes('Under Development')
  ).length;
  const activeProjects = projects.filter(
    (p) => p.title.includes('Under Development')
  ).length;
  const hardwareProjects = projects.filter(
    (p) => p.category === 'HARDWARE_MODULES'
  ).length;
  const softwareProjects = projects.filter(
    (p) => p.category === 'SOFTWARE_SYSTEMS'
  ).length;
  const communityProjects = projects.filter(
    (p) => p.category === 'COMMUNITY_PROJECT'
  ).length;
  const ragastraProjects = projects.filter(
    (p) => p.category === 'RAGASTRA_PROJECT'
  ).length;
  const publicationsCount = 9;
  const certificatesCount = 13;

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStatsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setStatsModalOpen]);

  const handleOverlayClick = () => {
    setStatsModalOpen(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: 'var(--explorer-bg)',
          border: '1px solid var(--explorer-border)',
          borderRadius: '4px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-color)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
        onClick={handleModalClick}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--explorer-border)',
            backgroundColor: '#252526',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            Portfolio Statistics
          </span>
          <button
            onClick={() => setStatsModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-color)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = '#ffffff')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-color)')
            }
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                lineHeight: '1.6',
              }}
            >
              <span style={{ color: '#9cdcfe' }}>TOTAL_PROJECTS</span>
              <span style={{ color: '#ce9178' }}> = {totalProjects}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>COMPLETED</span>
              <span style={{ color: '#ce9178' }}> = {completedProjects}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>IN_DEVELOPMENT</span>
              <span style={{ color: '#ce9178' }}> = {activeProjects}</span>
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--explorer-border)',
                margin: '8px 0',
              }}
            ></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>HARDWARE_MODULES</span>
              <span style={{ color: '#ce9178' }}> = {hardwareProjects}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>SOFTWARE_SYSTEMS</span>
              <span style={{ color: '#ce9178' }}> = {softwareProjects}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>ARCEUS_LABS</span>
              <span style={{ color: '#ce9178' }}> = {communityProjects}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>RAGASTRA</span>
              <span style={{ color: '#ce9178' }}> = {ragastraProjects}</span>
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--explorer-border)',
                margin: '8px 0',
              }}
            ></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>PUBLICATIONS</span>
              <span style={{ color: '#ce9178' }}> = {publicationsCount}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: '1.6' }}>
              <span style={{ color: '#9cdcfe' }}>CERTIFICATES</span>
              <span style={{ color: '#ce9178' }}> = {certificatesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStatsModal;
