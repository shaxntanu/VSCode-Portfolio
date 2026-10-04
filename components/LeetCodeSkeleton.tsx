import Skeleton from './SkeletonLoader';
import styles from '@/styles/LeetCodeSkeleton.module.css';

const LeetCodeSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <Skeleton variant="circular" width={80} height={80} className={styles.logo} />
          <div className={styles.profileInfo}>
            <Skeleton variant="text" width="200px" height="28px" className={styles.name} />
            <Skeleton variant="text" width="300px" height="16px" className={styles.bio} />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.statCard}>
              <Skeleton variant="text" width="60px" height="24px" className={styles.statNumber} />
              <Skeleton variant="text" width="60px" height="14px" className={styles.statLabel} />
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className={styles.progressSection}>
          <Skeleton variant="text" width="160px" height="20px" className={styles.sectionTitle} />
          <div className={styles.progressContainer}>
            <Skeleton variant="rectangular" width="100%" height="20px" className={styles.progressBar} />
            <Skeleton variant="text" width="60px" height="14px" className={styles.progressText} />
          </div>
        </div>

        {/* Activity Section */}
        <div className={styles.activitySection}>
          <Skeleton variant="text" width="180px" height="20px" className={styles.sectionTitle} />
          <div className={styles.heatmapPlaceholder}>
            <Skeleton variant="rectangular" width="100%" height="120px" />
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div className={styles.problemsSection}>
        <Skeleton variant="text" width="140px" height="24px" className={styles.sectionTitle} />
        <div className={styles.problemList}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.problemItem}>
              <Skeleton variant="text" width="70%" height="16px" className={styles.problemTitle} />
              <Skeleton variant="text" width="80px" height="12px" className={styles.problemDifficulty} />
            </div>
          ))}
        </div>
      </div>

      {/* Repository Section */}
      <div className={styles.repositorySection}>
        <Skeleton variant="rectangular" width="200px" height="40px" className={styles.repoLink} />
      </div>
    </div>
  );
};

export default LeetCodeSkeleton;
