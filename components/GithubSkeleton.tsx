import Skeleton from './SkeletonLoader';
import styles from '@/styles/GithubSkeleton.module.css';

const GithubSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <Skeleton variant="circular" width={120} height={120} className={styles.avatar} />
          <div className={styles.profileInfo}>
            <Skeleton variant="text" width="200px" height="28px" className={styles.name} />
            <Skeleton variant="text" width="150px" height="20px" className={styles.username} />
            <Skeleton variant="text" width="300px" height="16px" className={styles.bio} />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.statCard}>
              <Skeleton variant="text" width="60px" height="24px" className={styles.statNumber} />
              <Skeleton variant="text" width="80px" height="14px" className={styles.statLabel} />
            </div>
          ))}
        </div>

        {/* Contribution Section */}
        <div className={styles.contributionSection}>
          <Skeleton variant="text" width="180px" height="20px" className={styles.sectionTitle} />
          <div className={styles.contributionWrapper}>
            <div className={styles.contributionGraph}>
              <div className={styles.heatmapGrid}>
                {[...Array(7)].map((_, row) => (
                  <div key={row} className={styles.heatmapRow}>
                    {[...Array(52)].map((_, col) => (
                      <Skeleton
                        key={col}
                        variant="rectangular"
                        width="10px"
                        height="10px"
                        className={styles.heatmapCell}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <Skeleton variant="rectangular" width="120px" height="32px" className={styles.select} />
          </div>
        </div>
      </div>

      {/* Repositories Section */}
      <div className={styles.reposSection}>
        <Skeleton variant="text" width="140px" height="24px" className={styles.sectionTitle} />
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.repoCard}>
              <Skeleton variant="text" width="70%" height="18px" className={styles.repoName} />
              <Skeleton variant="text" width="100%" height="14px" className={styles.repoDesc} />
              <Skeleton variant="text" width="100%" height="14px" className={styles.repoDesc} />
              <div className={styles.repoMeta}>
                <Skeleton variant="text" width="40px" height="12px" />
                <Skeleton variant="text" width="40px" height="12px" />
                <Skeleton variant="text" width="60px" height="12px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Distribution Section */}
      <div className={styles.languageSection}>
        <div className={styles.languageHeader}>
          <Skeleton variant="text" width="180px" height="24px" className={styles.sectionTitle} />
          <div className={styles.languageMetadata}>
            <div className={styles.metadataItem}>
              <Skeleton variant="text" width="60px" height="12px" />
              <Skeleton variant="text" width="30px" height="14px" />
            </div>
            <div className={styles.metadataItem}>
              <Skeleton variant="text" width="50px" height="12px" />
              <Skeleton variant="text" width="30px" height="14px" />
            </div>
          </div>
        </div>
        <Skeleton variant="text" width="100%" height="14px" className={styles.sectionSubtitle} />
        
        {/* Chart Section */}
        <div className={styles.chartSection}>
          <Skeleton variant="circular" width={240} height={240} />
        </div>

        {/* Language List */}
        <div className={styles.languageList}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.languageItem}>
              <div className={styles.languageRow}>
                <Skeleton variant="circular" width={12} height={12} className={styles.languageIcon} />
                <Skeleton variant="text" width="80px" height="14px" className={styles.languageName} />
                <div className={styles.barContainer}>
                  <Skeleton variant="rectangular" width={`${Math.random() * 60 + 20}%`} height={8} className={styles.bar} />
                </div>
                <Skeleton variant="text" width="40px" height="12px" className={styles.percentage} />
              </div>
              <Skeleton variant="text" width="60px" height="12px" className={styles.bytes} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GithubSkeleton;