import Image from 'next/image';
import LeetCodeSkeleton from '@/components/LeetCodeSkeleton';
import styles from '@/styles/LeetCodePage.module.css';
import { LeetCodeStats } from '@/types';

const LeetCodePage = () => {
  // Placeholder data for UI development - will be replaced with API data later
  const placeholderStats: LeetCodeStats = {
    username: 'shaxntanu',
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  };

  const solutionsRepoUrl = 'https://github.com/shaxntanu/leetcode-shaxntanu';

  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.logoContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 128 128" className={styles.leetcodeLogo}>
              <path d="M0 0h128v128H0z" fill="none" />
              <path fill="#ffa116" d="M18.87 71.716a1.78 1.78 0 0 1 2.52.005a1.787 1.787 0 0 1-.005 2.524l-3.095 3.09c-2.855 2.852-7.512 2.894-10.415.097L2.3 71.966c-2.838-2.783-3.12-7.235-.45-10.094l4.978-5.33c2.65-2.839 7.536-3.15 10.566-.699l4.522 3.657a1.787 1.787 0 0 1 .267 2.51a1.78 1.78 0 0 1-2.506.268l-4.522-3.657c-1.585-1.281-4.357-1.105-5.724.36l-4.979 5.33c-1.3 1.392-1.157 3.634.34 5.103l5.55 5.44c1.51 1.455 3.95 1.433 5.433-.047z" />
              <path fill="#b3b3b3" d="M11.35 68.624c-.984 0-1.781-.8-1.781-1.785c0-.986.797-1.785 1.781-1.785h13.143a1.784 1.784 0 0 1 0 3.57z" />
              <path d="M13.812 49.063a1.78 1.78 0 0 1 2.518-.084a1.787 1.787 0 0 1 .084 2.524L4.452 64.31c-1.3 1.392-1.157 3.634.34 5.103l5.525 5.417a1.787 1.787 0 1 1 .027 2.525a1.78 1.78 0 0 1-2.52.027L2.3 71.966c-2.838-2.783-3.12-7.235-.45-10.094zm23.06 10.303v11.749q0 .677.481 1.157q.48.48 1.157.48h3.178q.415 0 .71.296a.97.97 0 0 1 .294.71v.021q0 .416-.294.699a.97.97 0 0 1-.71.295H38.51a3.53 3.53 0 0 1-2.587-1.07a3.53 3.53 0 0 1-1.07-2.588V59.366q0-.414.294-.71a.98.98 0 0 1 .7-.283h.032q.404 0 .699.284a.97.97 0 0 1 .295.71zm12.656 5.525a3.8 3.8 0 0 0-2.796 1.158q-1.146 1.157-1.146 2.795q0 .295.043.578l6.912-3.122q-1.179-1.41-3.013-1.409m5.415 1.442a.96.96 0 0 1 .033.764a.96.96 0 0 1-.524.557q-1.53.687-4.018 1.812l-4.007 1.813q1.18 1.506 3.1 1.506a3.84 3.84 0 0 0 2.315-.753a3.86 3.86 0 0 0 1.409-1.9q.24-.677.96-.677a.96.96 0 0 1 .82.426a.94.94 0 0 1 .12.906a5.74 5.74 0 0 1-2.14 2.861a5.82 5.82 0 0 1-3.483 1.125q-2.468 0-4.215-1.747c-1.747-1.747-1.747-2.57-1.747-4.215s.582-3.05 1.747-4.214q1.747-1.747 4.214-1.747a5.8 5.8 0 0 1 3.254.971a5.83 5.83 0 0 1 2.162 2.512m7.873-1.442a3.8 3.8 0 0 0-2.796 1.158q-1.146 1.157-1.146 2.795q0 .295.043.578l6.912-3.122q-1.179-1.41-3.013-1.409zm5.415 1.442a.96.96 0 0 1 .033.764a.96.96 0 0 1-.524.557q-1.53.687-4.018 1.812l-4.007 1.813q1.18 1.506 3.1 1.506a3.84 3.84 0 0 0 2.315-.753a3.86 3.86 0 0 0 1.409-1.9q.24-.677.96-.677a.96.96 0 0 1 .82.426a.94.94 0 0 1 .12.906a5.74 5.74 0 0 1-2.14 2.861a5.82 5.82 0 0 1-3.484 1.125q-2.468 0-4.215-1.747t-1.747-4.215c-.001-2.467.583-3.05 1.747-4.214q1.748-1.747 4.215-1.747q1.78 0 3.254.971a5.83 5.83 0 0 1 2.162 2.512m3.265-7.96q.404 0 .699.284a.97.97 0 0 1 .295.71v3.482h1.965q.404 0 .699.295a.97.97 0 0 1 .295.71v.022q0 .415-.295.699a.96.96 0 0 1-.7.294H72.49v6.803q0 .447.316.764q.317.317.775.317h.874q.404 0 .699.295a.97.97 0 0 1 .295.71v.021q0 .415-.295.699a.96.96 0 0 1-.7.295h-.873a3.02 3.02 0 0 1-2.205-.906a3 3 0 0 1-.907-2.195V59.366q0-.414.295-.71a.98.98 0 0 1 .7-.283zm13.408 0q1.037 0 2.042.251q.753.196.753.96v.033q0 .48-.393.787a.95.95 0 0 1-.851.174a6.2 6.2 0 0 0-1.55-.196q-2.556 0-4.368 1.812t-1.813 4.379q0 2.566 1.813 4.378q1.812 1.802 4.367 1.802q.786 0 1.55-.186a.95.95 0 0 1 .852.175a.94.94 0 0 1 .393.786v.022q0 .775-.753.972a8.4 8.4 0 0 1-2.042.25q-3.395 0-5.798-2.401q-2.402-2.403-2.402-5.798t2.402-5.798q2.403-2.403 5.798-2.402C95.08 64.89a3.8 3.8 0 0 0-2.795 1.158q-1.146 1.157-1.146 2.795q0 1.626 1.146 2.784a3.8 3.8 0 0 0 2.795 1.157q1.638 0 2.785-1.157q1.157-1.157 1.157-2.784a3.8 3.8 0 0 0-1.157-2.795q-1.148-1.158-2.784-1.158zm0-2.041q2.468 0 4.215 1.747q1.747 1.746 1.747 4.214t-1.747 4.215c-1.747 1.747-2.57 1.747-4.215 1.747s-3.05-.582-4.214-1.747q-1.747-1.748-1.747-4.215c0-2.467.582-3.05 1.747-4.214q1.748-1.747 4.214-1.747m13.452 2.041a3.8 3.8 0 0 1-2.795 1.158q-1.146 1.157-1.146 2.795q0 1.626 1.146 2.784a3.8 3.8 0 0 0 2.795 1.157q1.638 0 2.785-1.157q1.157-1.157 1.157-2.784q0-1.626-1.157-2.795a3.8 3.8 0 0 0-2.784-1.158zm4.968-6.518q.405 0 .7.284a.97.97 0 0 1 .294.71v9.477q-.01 2.457-1.758 4.193t-4.204 1.736q-2.468 0-4.214-1.747t-1.747-4.215c0-2.467.582-3.05 1.747-4.214q1.747-1.747 4.214-1.747q2.25 0 3.942 1.495v-4.979q0-.414.295-.71a.97.97 0 0 1 .699-.283zm8.812 6.518a3.8 3.8 0 0 1-2.795 1.158q-1.147 1.157-1.147 2.795q0 1.626 1.147 2.784a3.8 3.8 0 0 0 2.795 1.157q1.638 0 2.785-1.157q1.157-1.157 1.157-2.784q0-1.626-1.157-2.795a3.8 3.8 0 0 0-2.785-1.158zm5.415 1.442a.96.96 0 0 1 .033.764a.96.96 0 0 1-.524.557q-1.529.687-4.018 1.812l-4.007 1.813q1.18 1.506 3.1 1.506a3.84 3.84 0 0 0 2.315-.753a3.86 3.86 0 0 0 1.41-1.9q.24-.677.96-.677a.96.96 0 0 1 .819.426a.94.94 0 0 1 .12.906a5.74 5.74 0 0 1-2.14 2.861a5.82 5.82 0 0 1-3.483 1.125q-2.468 0-4.215-1.747c-1.747-1.747-1.747-2.57-1.747-4.215s.582-3.05 1.747-4.214q1.748-1.747 4.215-1.747q1.779 0 3.253.971a5.83 5.83 0 0 1 2.162 2.512" />
            </svg>
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>leetcode.stats</h1>
            <p className={styles.bio}>Algorithmic problem-solving statistics and progress tracking.</p>
          </div>
        </div>

        {/* Stats Grid - Easy/Medium/Hard */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{placeholderStats.easySolved}</span>
            <span className={styles.statLabel}>Easy</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{placeholderStats.mediumSolved}</span>
            <span className={styles.statLabel}>Medium</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{placeholderStats.hardSolved}</span>
            <span className={styles.statLabel}>Hard</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{placeholderStats.totalSolved}</span>
            <span className={styles.statLabel}>Total Solved</span>
          </div>
        </div>

        {/* Solved Progress */}
        <div className={styles.progressSection}>
          <h3 className={styles.sectionTitle}>Solved Progress</h3>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: '0%' }}
              />
            </div>
            <span className={styles.progressText}>0% Complete</span>
          </div>
        </div>

        {/* Activity Heatmap - Placeholder */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionTitle}>Submission Activity</h3>
          <div className={styles.heatmapPlaceholder}>
            <p className={styles.placeholderText}>Activity heatmap will be populated with LeetCode submission data.</p>
          </div>
        </div>
      </div>

      {/* Recent Problems Section */}
      <div className={styles.problemsSection}>
        <h2 className={styles.sectionTitle}>Latest Solved</h2>
        <div className={styles.problemList}>
          <p className={styles.placeholderText}>Recent problems will appear here after API integration.</p>
        </div>
      </div>

      {/* Solutions Repository Link */}
      <div className={styles.repositorySection}>
        <a 
          href={solutionsRepoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.repoLink}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 128 128" className={styles.githubIcon}>
            <path fill="#fff" d="M64 5.103c-33.347 0-60.398 27.035-60.398 60.398 0 26.682 17.303 49.317 41.297 57.303 3.018.56 4.126-1.31 4.126-2.905 0-1.44-.056-6.197-.082-11.24-16.8 3.653-20.345-7.79-20.345-7.79-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.726.413-3.726 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.555 5.02.542-3.81 2.105-6.562 3.833-8.072-13.41-1.525-27.513-6.705-27.513-29.843 0-6.59 2.36-11.98 6.223-16.21-.622-1.526-2.7-7.672.584-15.98 0 0 5.07-1.623 16.61 6.19 4.82-1.34 9.995-1.34 15.13 0 5.135.002 9.99 1.34 15.13 11.528-7.813 16.59-6.19 16.59-6.19 3.285 8.308 2.206 14.453.584 15.98 3.872 4.23 6.23 9.62 6.23 16.21 0 23.2-14.127 28.3-27.564 29.814 2.17 1.874 3.875 4.435 3.875 7.916 0 5.715-.052 12.35-.082 14.065 0 1.607 1.098 3.487 4.148 2.898 23.98-7.994 41.273-30.622 41.273-57.294C124.398 32.14 97.35 5.104 64 5.104z"/>
          </svg>
          <span>View Solutions Repository</span>
        </a>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {
      title: 'LeetCode',
      ogDescription: 'LeetCode statistics and problem-solving progress for shaxntanu.',
    },
    revalidate: 3600,
  };
}

export default LeetCodePage;
