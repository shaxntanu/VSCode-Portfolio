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
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" className={styles.leetcodeLogo} style={{ display: 'block' }}>
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="#ffa116" d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z" />
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
