import { useState, useMemo } from 'react';
import { VscSearch, VscClose } from 'react-icons/vsc';
import CircuitCard from '@/components/CircuitCard';
import { circuits, circuitCategories } from '@/data/circuits';

import styles from '@/styles/CircuitsPage.module.css';

const CircuitsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter circuits based on category and search query
  const filteredCircuits = useMemo(() => {
    return circuits.filter((circuit) => {
      // EDUCATIONAL category should include circuits with collegeCourseProject tag
      const matchesCategory = selectedCategory === 'ALL' || 
        circuit.category === selectedCategory ||
        (selectedCategory === 'EDUCATIONAL' && circuit.collegeCourseProject);
      const matchesSearch = searchQuery === '' || 
        circuit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circuit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circuit.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circuit.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circuit.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Sort by year (newest first)
  const sortedCircuits = useMemo(() => {
    return [...filteredCircuits].sort((a, b) => b.year - a.year);
  }, [filteredCircuits]);

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>circuits.sch</h1>
      <p className={styles.pageSubtitle}>
        A curated collection of electronic circuit designs and schematics. From Tinkercad simulations and KiCad PCBs to LTspice analog circuits, 
        this gallery showcases hardware design work across embedded systems, power electronics, sensors, and digital logic. Each circuit includes 
        detailed component information, working principles, and simulation links.
      </p>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <VscSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search circuits by name, platform, technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <VscClose />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        {circuitCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`${styles.categoryButton} ${
              selectedCategory === cat.id ? styles.categoryButtonActive : ''
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className={styles.resultsCount}>
        <span className={styles.comment}>{'// '}</span>
        <span className={styles.countText}>
          {sortedCircuits.length} {sortedCircuits.length === 1 ? 'circuit' : 'circuits'} found
        </span>
      </div>

      {/* Circuits Grid */}
      {sortedCircuits.length > 0 ? (
        <div className={styles.container}>
          {sortedCircuits.map((circuit) => (
            <CircuitCard key={circuit.slug} circuit={circuit} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No circuits found matching your criteria.</p>
          <p className={styles.emptySubtext}>Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Circuits',
      ogDescription: 'Electronic circuit designs and schematics - Tinkercad simulations, KiCad PCBs, analog and digital circuits.'
    },
  };
}

export default CircuitsPage;
