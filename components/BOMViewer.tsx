/**
 * BOM (Bill of Materials) Viewer Component
 * Displays hardware components with detailed specifications
 * VS Code Explorer-style interface
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Component } from '@/types';
import { VscCircuitBoard, VscInfo } from 'react-icons/vsc';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/BOMViewer.module.css';

interface BOMViewerProps {
  components: Component[];
  architecture?: string;
  totalCost?: string;
  isInline?: boolean;
  sortBy?: 'name' | 'interface' | 'voltage';
  setSortBy?: (sort: 'name' | 'interface' | 'voltage') => void;
}

const BOMViewer = ({ 
  components, 
  architecture, 
  totalCost, 
  isInline,
  sortBy: externalSortBy,
  setSortBy: externalSetSortBy
}: BOMViewerProps) => {
  const [internalSortBy, setInternalSortBy] = useState<'name' | 'interface' | 'voltage'>('name');
  const sortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;
  const setSortBy = externalSetSortBy || setInternalSortBy;
  
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If inline mode, render content directly inside card with AnimatePresence
  if (isInline) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="bom-inline"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={styles.inlineContainer}
        >
          <ContentArea 
            components={components}
            architecture={architecture}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Default standalone mode - always show content
  return (
    <div className={styles.bomContainer}>
      <div className={styles.bomHeader}>
        <VscCircuitBoard className={styles.icon} />
        <span className={styles.title}>
          Bill of Materials ({components.length} Components)
          {totalCost && <span className={styles.totalCost}> • Total: {totalCost}</span>}
        </span>
      </div>

      <div className={styles.bomContent} style={{ overflow: 'visible' }}>
        <ContentArea 
          components={components}
          architecture={architecture}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  );
};

// Extracted content component for reuse
const ContentArea = ({ 
  components, 
  architecture, 
  selectedComponent, 
  setSelectedComponent,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery
}: any) => {
  const sortedComponents = [...components].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'interface') return a.interface.localeCompare(b.interface);
    if (sortBy === 'voltage') return a.voltage.localeCompare(b.voltage);
    return 0;
  });

  const filteredComponents = sortedComponents.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.interface.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Architecture Diagram */}
      {architecture && (
        <div className={styles.architectureSection}>
          <div className={styles.sectionTitle}>
            <VscInfo className={styles.sectionIcon} />
            System Architecture
          </div>
          <div className={styles.architectureDiagram}>
            {architecture}
          </div>
        </div>
      )}

      {/* Search and Sort Controls */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'interface' | 'voltage')}
          className={styles.sortSelect}
        >
          <option value="name">Sort by Name</option>
          <option value="interface">Sort by Protocol</option>
          <option value="voltage">Sort by Voltage</option>
        </select>
      </div>

      {/* BOM Table */}
      <div className={styles.tableContainer}>
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th>Component</th>
              <th>Purpose</th>
              <th>Protocol</th>
              <th>Voltage</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponents.map((comp, idx) => (
              <tr
                key={idx}
                className={styles.tableRow}
                onClick={() => setSelectedComponent(comp)}
              >
                <td className={styles.componentName}>{comp.name}</td>
                <td>{comp.role}</td>
                <td>
                  <span className={styles.protocolBadge}>
                    {comp.interface}
                  </span>
                </td>
                <td>{comp.voltage}</td>
                <td className={styles.quantity}>{comp.quantity}</td>
                <td className={styles.price}>{comp.price || 'TBD'}</td>
                <td>
                  <button
                    className={styles.detailsButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComponent(comp);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredComponents.length === 0 && (
          <div className={styles.noResults}>
            No components match your search
          </div>
        )}
      </div>

      {/* Component Detail Drawer - Rendered via Portal */}
      <ComponentDetailDrawer 
        selectedComponent={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </>
  );
};

// Component Detail Drawer - Rendered via Portal to escape stacking contexts
const ComponentDetailDrawer = ({
  selectedComponent,
  onClose
}: {
  selectedComponent: Component | null;
  onClose: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!selectedComponent) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedComponent, onClose]);

  if (!mounted) return null;

  const drawerContent = (
    <AnimatePresence>
      {selectedComponent && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.drawerBackdrop}
            onClick={onClose}
          />
          
          {/* Drawer panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={styles.detailDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h3>{selectedComponent.name}</h3>
              <button
                className={styles.closeDrawer}
                onClick={onClose}
                aria-label="Close drawer"
              >
                ×
              </button>
            </div>
            <div className={styles.drawerContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Role:</span>
                <span className={styles.detailValue}>
                  {selectedComponent.role}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Interface:</span>
                <span className={styles.detailValue}>
                  {selectedComponent.interface}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Voltage:</span>
                <span className={styles.detailValue}>
                  {selectedComponent.voltage}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Quantity:</span>
                <span className={styles.detailValue}>
                  {selectedComponent.quantity}
                </span>
              </div>
              {selectedComponent.price && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span className={styles.detailValue}>
                    {selectedComponent.price}
                  </span>
                </div>
              )}
              {selectedComponent.notes && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Notes:</span>
                  <span className={styles.detailValue}>
                    {selectedComponent.notes}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

export default BOMViewer;
