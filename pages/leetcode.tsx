import styles from '@/styles/LeetCodePage.module.css';
import { LeetCodeStats, LeetCodeProblem } from '@/types';

interface LeetCodePageProps {
  stats?: LeetCodeStats;
  recentProblems?: LeetCodeProblem[];
  error?: boolean;
}

const LeetCodePage = ({ stats, recentProblems = [], error = false }: LeetCodePageProps) => {
  const solutionsRepoUrl = 'https://github.com/shaxntanu/leetcode-shaxntanu';

  // Calculate progress percentages
  const easyProgress = stats?.easyTotal && stats.easyTotal > 0
    ? (stats.easySolved / stats.easyTotal) * 100
    : 0;
  const mediumProgress = stats?.mediumTotal && stats.mediumTotal > 0
    ? (stats.mediumSolved / stats.mediumTotal) * 100
    : 0;
  const hardProgress = stats?.hardTotal && stats.hardTotal > 0
    ? (stats.hardSolved / stats.hardTotal) * 100
    : 0;
  const totalProgress = stats?.easyTotal && stats.mediumTotal && stats.hardTotal
    ? ((stats.easySolved + stats.mediumSolved + stats.hardSolved) / 
       (stats.easyTotal + stats.mediumTotal + stats.hardTotal)) * 100
    : 0;

  // Use stats if available, otherwise use empty state
  const displayStats = stats || {
    username: 'shaxntanu',
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  };

  return (
    <div className={styles.container}>
      {/* Error State */}
      {error && (
        <div className={styles.errorBanner}>
          <p>Unable to retrieve LeetCode statistics right now. Please try again later.</p>
        </div>
      )}

      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.logoContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 128 128" className={styles.leetcodeLogo} style={{ display: 'block' }}>
              <path d="M0 0h128v128H0z" fill="none" />
              <path fill="#ffa116" d="M18.87 71.716a1.78 1.78 0 0 1 2.52.005a1.787 1.787 0 0 1-.005 2.524l-3.095 3.09c-2.855 2.852-7.512 2.894-10.415.097L2.3 71.966c-2.838-2.783-3.12-7.235-.45-10.094l4.978-5.33c2.65-2.839 7.536-3.15 10.566-.699l4.522 3.657a1.787 1.787 0 0 1 .267 2.51a1.78 1.78 0 0 1-2.506.268l-4.522-3.657c-1.585-1.281-4.357-1.105-5.724.36l-4.979 5.33c-1.3 1.392-1.157 3.634.34 5.103l5.55 5.44c1.51 1.455 3.95 1.433 5.433-.047z" />
              <path fill="#b3b3b3" d="M11.35 68.624c-.984 0-1.781-.8-1.781-1.785c0-.986.797-1.785 1.781-1.785h13.143a1.784 1.784 0 0 1 0 3.57z" />
              <path d="M13.812 49.063a1.78 1.78 0 0 1 2.518-.084a1.787 1.787 0 0 1 .084 2.524L4.452 64.31c-1.3 1.392-1.157 3.634.34 5.103l5.525 5.417a1.787 1.787 0 1 1 .027 2.525a1.78 1.78 0 0 1-2.52.027L2.3 71.966c-2.838-2.783-3.12-7.235-.45-10.094zm23.06 10.303v11.749q0 .677.481 1.157q.48.48 1.157.48h3.178q.415 0 .71.296a.97.97 0 0 1 .294.71v.021q0 .416-.294.699a.97.97 0 0 1-.71.295H38.51a3.53 3.53 0 0 1-2.587-1.07a3.53 3.53 0 0 1-1.07-2.588V59.366q0-.414.294-.71a.98.98 0 0 1 .7-.283h.032q.404 0 .699.284a.97.97 0 0 1 .295.71zm12.656 5.525a3.8 3.8 0 0 0-2.796 1.158q-1.146 1.157-1.146 2.795q0 .295.043.578l6.912-3.122q-1.179-1.41-3.013-1.409m5.415 1.442a.96.96 0 0 1 .033.764a.96.96 0 0 1-.524.557q-1.53.687-4.018 1.812l-4.007 1.813q1.18 1.506 3.1 1.506a3.84 3.84 0 0 0 2.315-.753a3.86 3.86 0 0 0 1.409-1.9q.24-.677.96-.677a.96.96 0 0 1 .82.426a.94.94 0 0 1 .12.906a5.74 5.74 0 0 1-2.14 2.861a5.82 5.82 0 0 1-3.483 1.125q-2.468 0-4.215-1.747c-1.747-1.747-1.747-2.57-1.747-4.215s.582-3.05 1.747-4.214q1.747-1.747 4.214-1.747a5.8 5.8 0 0 1 3.254.971a5.83 5.83 0 0 1 2.162 2.512m7.873-1.442a3.8 3.8 0 0 0-2.796 1.158q-1.146 1.157-1.146 2.795q0 .295.043.578l6.912-3.122q-1.179-1.41-3.013-1.409zm5.415 1.442a.96.96 0 0 1 .033.764a.96.96 0 0 1-.524.557q-1.53.687-4.018 1.812l-4.007 1.813q1.18 1.506 3.1 1.506a3.84 3.84 0 0 0 2.315-.753a3.86 3.86 0 0 0 1.409-1.9q.24-.677.96-.677a.96.96 0 0 1 .82.426a.94.94 0 0 1 .12.906a5.74 5.74 0 0 1-2.14 2.861a5.82 5.82 0 0 1-3.484 1.125q-2.468 0-4.215-1.747t-1.747-4.215c-.001-2.467.583-3.05 1.747-4.214q1.748-1.747 4.215-1.747q1.78 0 3.254.971a5.83 5.83 0 0 1 2.162 2.512m3.265-7.96q.404 0 .699.284a.97.97 0 0 1 .295.71v3.482h1.965q.404 0 .699.295a.97.97 0 0 1 .295.71v.022q0 .415-.295.699a.96.96 0 0 1-.7.294H72.49v6.803q0 .447.316.764q.317.317.775.317h.874q.404 0 .699.295a.97.97 0 0 1 .295.71v.021q0 .415-.295.699a.96.96 0 0 1-.7.295h-.873a3.02 3.02 0 0 1-2.205-.906a3 3 0 0 1-.907-2.195V59.366q0-.414.295-.71a.98.98 0 0 1 .7-.283zm13.408 0q1.037 0 2.042.251q.753.196.753.96v.033q0 .48-.393.787a.95.95 0 0 1-.851.174a6.2 6.2 0 0 0-1.55-.196q-2.556 0-4.368 1.812t-1.813 4.379q0 2.566 1.813 4.378q1.812 1.802 4.367 1.802q.786 0 1.55-.186a.95.95 0 0 1 .852.175a.94.94 0 0 1 .393.786v.022q0 .775-.753.972a8.4 8.4 0 0 1-2.042.25q-3.395 0-5.798-2.401q-2.402-2.403-2.402-5.798t2.402-5.798q2.403-2.403 5.798-2.402C95.08 64.89a3.8 3.8 0 0 0-2.795 1.158q-1.146 1.157-1.146 2.795q0 1.626 1.146 2.784a3.8 3.8 0 0 0 2.795 1.157q1.638 0 2.785-1.157q1.157-1.157 1.157-2.784a3.8 3.8 0 0 0-1.157-2.795q-1.148-1.158-2.784-1.158zm0-2.041q2.468 0 4.215 1.747q1.747 1.746 1.747 4.214t-1.747 4.215c-1.747 1.747-2.57 1.747-4.215 1.747s-3.05-.582-4.214-1.747q-1.747-1.748-1.747-4.215c0-2.467.582-3.05 1.747-4.214q1.748-1.747 4.214-1.747m13.452 2.041a3.8 3.8 0 0 1-2.795 1.158q-1.146 1.157-1.146 2.795q0 1.626 1.146 2.784a3.8 3.8 0 0 0 2.795 1.157q1.638 0 2.785-1.157q1.157-1.157 1.157-2.784q0-1.626-1.157-2.795a3.8 3.8 0 0 0-2.784-1.158zm4.968-6.518q.405 0 .7.284a.97.97 0 0 1 .294.71v9.477q-.01 2.457-1.758 4.193t-4.204 1.736q-2.468 0-4.214-1.747t-1.747-4.215c0-2.467.582-3.05 1.747-4.214q1.747-1.747 4.214-1.747q2.25 0 3.942 1.495v-4.979q0-.414.295-.71a.97.97 0 0 1 .699-.283zm8.812 6.518a3.8 3.8 0 0 1-2.795 1.158q-1.147 1.157-1.147 2.795q0 1.626 1.147 2.784a3.8 3.8 0 0 0 2.795 1.157q1.638 0 2.785-1.157q1.157-1.157 1.157-2.784q0-1.626-1.157-2.795a3.8 3.8 0 0 0-2.785-1.158zm5.415 1.442a.96.96 0 0 1 .033.764a.96.96 0 0 1-.524.557q-1.529.687-4.018 1.812l-4.007 1.813q1.18 1.506 3.1 1.506a3.84 3.84 0 0 0 2.315-.753a3.86 3.86 0 0 0 1.41-1.9q.24-.677.96-.677a.96.96 0 0 1 .819.426a.94.94 0 0 1 .12.906a5.74 5.74 0 0 1-2.14 2.861a5.82 5.82 0 0 1-3.483 1.125q-2.468 0-4.215-1.747c-1.747-1.747-1.747-2.57-1.747-4.215s.582-3.05 1.747-4.214q1.748-1.747 4.215-1.747q1.779 0 3.253.971a5.83 5.83 0 0 1 2.162 2.512" />
            </svg>
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>leetcode.stats</h1>
            <p className={styles.bio}>
              {stats?.acceptanceRate
                ? `Algorithmic problem-solving statistics. Acceptance rate: ${stats.acceptanceRate.toFixed(1)}%`
                : 'Algorithmic problem-solving statistics and progress tracking.'}
            </p>
          </div>
        </div>

        {/* Stats Grid - Easy/Medium/Hard */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{displayStats.easySolved}</span>
            <span className={styles.statLabel}>Easy</span>
            {stats?.easyTotal && (
              <span className={styles.statSublabel}>{easyProgress.toFixed(1)}%</span>
            )}
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{displayStats.mediumSolved}</span>
            <span className={styles.statLabel}>Medium</span>
            {stats?.mediumTotal && (
              <span className={styles.statSublabel}>{mediumProgress.toFixed(1)}%</span>
            )}
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{displayStats.hardSolved}</span>
            <span className={styles.statLabel}>Hard</span>
            {stats?.hardTotal && (
              <span className={styles.statSublabel}>{hardProgress.toFixed(1)}%</span>
            )}
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{displayStats.totalSolved}</span>
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
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <span className={styles.progressText}>{totalProgress.toFixed(1)}% Complete</span>
          </div>
        </div>

        {/* Activity Heatmap - Placeholder */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionTitle}>Submission Activity</h3>
          <div className={styles.heatmapPlaceholder}>
            <p className={styles.placeholderText}>
              Activity calendar is not available through LeetCode&apos;s GraphQL API.
              Visit your <a href="https://leetcode.com/u/shaxntanu/" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>LeetCode profile</a> for detailed activity.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Problems Section */}
      <div className={styles.problemsSection}>
        <h2 className={styles.sectionTitle}>Latest Solved</h2>
        <div className={styles.problemList}>
          {recentProblems.length > 0 ? (
            recentProblems.map((problem, index) => (
              <div key={index} className={styles.problemItem}>
                <span className={styles.problemTitle}>{problem.title}</span>
                <span className={styles.problemDifficulty}>{problem.difficulty}</span>
              </div>
            ))
          ) : (
            <p className={styles.placeholderText}>
              {error
                ? 'Unable to load recent problems.'
                : 'No recent submissions available.'}
            </p>
          )}
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" className={styles.githubIcon} style={{ display: 'block' }}>
            <path fill="currentColor" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>View Solutions Repository</span>
        </a>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const { fetchLeetCodeUser, fetchRecentSubmissions } = await import('@/utils/leetcode/client');
  const { normalizeUserData, normalizeRecentSubmissions } = await import('@/utils/leetcode/normalize');

  try {
    // Fetch user data
    const userData = await fetchLeetCodeUser();
    const recentData = await fetchRecentSubmissions(10);

    let stats: LeetCodeStats | undefined;
    let recentProblems: LeetCodeProblem[] = [];
    let error = false;

    if (userData) {
      stats = normalizeUserData(userData);
    }

    if (recentData) {
      recentProblems = normalizeRecentSubmissions(recentData);
    }

    if (!userData && !recentData) {
      error = true;
    }

    return {
      props: {
        title: 'LeetCode',
        ogDescription: 'LeetCode statistics and problem-solving progress for shaxntanu.',
        stats,
        recentProblems,
        error,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps for LeetCode page:', error);
    return {
      props: {
        title: 'LeetCode',
        ogDescription: 'LeetCode statistics and problem-solving progress for shaxntanu.',
        error: true,
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}

export default LeetCodePage;
