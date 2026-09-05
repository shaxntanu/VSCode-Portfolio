import { useState, useMemo } from 'react';
import { VscFilter, VscSearch } from 'react-icons/vsc';
import CourseworkCard from '@/components/CourseworkCard';
import { courseworkData, getCourseworkByYear, searchCoursework } from '@/data/coursework';
import { CourseworkYear } from '@/types';

import styles from '@/styles/CourseworkPage.module.css';

type FilterOption = 'ALL' | CourseworkYear;

const CourseworkPage = () => {
  const [selectedYear, setSelectedYear] = useState<FilterOption>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search logic
  const filteredCoursework = useMemo(() => {
    let filtered = getCourseworkByYear(selectedYear);
    
    if (searchQuery.trim()) {
      filtered = searchCoursework(searchQuery.trim()).filter(item =>
        selectedYear === 'ALL' || item.year === selectedYear
      );
    }
    
    return filtered;
  }, [selectedYear, searchQuery]);

  // Group by year for display
  const groupedCoursework = useMemo(() => {
    const groups: Record<CourseworkYear, typeof courseworkData> = {
      1: [],
      2: [],
      3: [],
      4: []
    };

    filteredCoursework.forEach(item => {
      groups[item.year].push(item);
    });

    return groups;
  }, [filteredCoursework]);

  // Get years that have content or should be shown
  const yearsToShow = selectedYear === 'ALL' 
    ? [1, 2, 3, 4] as CourseworkYear[]
    : [selectedYear];

  const getYearLabel = (year: CourseworkYear) => {
    const labels = {
      1: 'YEAR_1',
      2: 'YEAR_2', 
      3: 'YEAR_3',
      4: 'YEAR_4'
    };
    return labels[year];
  };

  const renderEmptyState = (year: CourseworkYear) => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateHeader}>
        <span className={styles.emptyFileName}>{getYearLabel(year)}.log</span>
      </div>
      <div className={styles.emptyStateContent}>
        <p className={styles.emptyStateText}>No entries recorded yet.</p>
        <p className={styles.emptyStateSubtext}>Awaiting future commits...</p>
      </div>
    </div>
  );

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>coursework.log</h1>
      <p className={styles.pageSubtitle}>
        An archive of academic learning and implementation during my engineering degree. 
        From mobile app development and image processing to physics simulations and digital logic design.
      </p>

      {/* Filters and Search */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <VscFilter className={styles.filterIcon} />
          <span className={styles.filterLabel}>Filter:</span>
          {(['ALL', 1, 2, 3, 4] as FilterOption[]).map((year) => (
            <button
              key={year}
              className={`${styles.filterButton} ${selectedYear === year ? styles.active : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year === 'ALL' ? 'ALL' : `YEAR ${year}`}
            </button>
          ))}
        </div>

        <div className={styles.searchContainer}>
          <VscSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search coursework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Coursework Content */}
      {yearsToShow.map((year) => {
        const yearCoursework = groupedCoursework[year];
        const hasContent = yearCoursework.length > 0;

        return (
          <div key={year} className={styles.yearSection}>
            <div className={styles.yearHeader}>
              <span className={styles.comment}>{`// `}</span>
              <span className={styles.yearTitle} style={{ color: '#00dc8c' }}>
                {getYearLabel(year)}
              </span>
              <span className={styles.yearCount}>
                ({hasContent ? `${yearCoursework.length} entries` : 'empty'})
              </span>
            </div>

            {hasContent ? (
              <div className={styles.courseworkGrid}>
                {yearCoursework.map((item) => (
                  <CourseworkCard key={item.id} coursework={item} />
                ))}
              </div>
            ) : (
              renderEmptyState(year)
            )}
          </div>
        );
      })}

      {filteredCoursework.length === 0 && searchQuery.trim() && (
        <div className={styles.noResultsState}>
          <div className={styles.noResultsContent}>
            <VscSearch className={styles.noResultsIcon} />
            <p className={styles.noResultsText}>No coursework found matching &quot;{searchQuery}&quot;</p>
            <p className={styles.noResultsSubtext}>Try adjusting your search terms or filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { 
      title: 'Coursework',
      ogDescription: 'Academic coursework archive - mobile apps, image processing, simulations, AI, optimization, and digital logic design.'
    },
  };
}

export default CourseworkPage;