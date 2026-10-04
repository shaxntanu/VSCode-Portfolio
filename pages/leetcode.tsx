import styles from '@/styles/LeetCodePage.module.css';
import { LeetCodeStats } from '@/types';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

interface LeetCodePageProps {
  stats?: LeetCodeStats;
  error?: boolean;
}

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LeetCodePage = ({ stats, error = false }: LeetCodePageProps) => {
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

  // Doughnut Chart Data - Difficulty Distribution
  const doughnutData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [displayStats.easySolved, displayStats.mediumSolved, displayStats.hardSolved],
        backgroundColor: ['#00b8a3', '#ffc01e', '#ef4743'],
        borderColor: ['#00b8a3', '#ffc01e', '#ef4743'],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#d4d4d4',
          font: {
            size: 12,
            family: "'Fira Code', monospace",
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#d4d4d4',
        bodyColor: '#d4d4d4',
        borderColor: '#3c3c3c',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Fira Code', monospace",
        },
        titleFont: {
          family: "'Fira Code', monospace",
        },
      },
    },
  };

  // Bar Chart Data - Progress by Difficulty
  const barData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Solved',
        data: [displayStats.easySolved, displayStats.mediumSolved, displayStats.hardSolved],
        backgroundColor: ['rgba(0, 184, 163, 0.8)', 'rgba(255, 192, 30, 0.8)', 'rgba(239, 71, 67, 0.8)'],
        borderColor: ['#00b8a3', '#ffc01e', '#ef4743'],
        borderWidth: 2,
      },
      {
        label: 'Total Available',
        data: [
          stats?.easyTotal || 0,
          stats?.mediumTotal || 0,
          stats?.hardTotal || 0,
        ],
        backgroundColor: ['rgba(0, 184, 163, 0.2)', 'rgba(255, 192, 30, 0.2)', 'rgba(239, 71, 67, 0.2)'],
        borderColor: ['#00b8a3', '#ffc01e', '#ef4743'],
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#d4d4d4',
          font: {
            family: "'Fira Code', monospace",
          },
        },
        grid: {
          color: '#3c3c3c',
        },
      },
      x: {
        ticks: {
          color: '#d4d4d4',
          font: {
            family: "'Fira Code', monospace",
          },
        },
        grid: {
          color: '#3c3c3c',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#d4d4d4',
          font: {
            size: 12,
            family: "'Fira Code', monospace",
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#d4d4d4',
        bodyColor: '#d4d4d4',
        borderColor: '#3c3c3c',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Fira Code', monospace",
        },
        titleFont: {
          family: "'Fira Code', monospace",
        },
      },
    },
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
              Algorithmic problem-solving statistics.
              {stats?.acceptanceRate && (
                <>
                  <br />
                  Acceptance rate: {stats.acceptanceRate.toFixed(1)}%
                </>
              )}
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

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          <div className={styles.chartContainer}>
            <h3 className={styles.sectionTitle}>Difficulty Distribution</h3>
            <div className={styles.chartWrapper}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <h3 className={styles.sectionTitle}>Progress Overview</h3>
            <div className={styles.chartWrapper}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export async function getStaticProps() {
  const { fetchLeetCodeUser } = await import('@/utils/leetcode/client');
  const { normalizeUserData } = await import('@/utils/leetcode/normalize');

  try {
    // Fetch user data
    const userData = await fetchLeetCodeUser();

    let stats: LeetCodeStats | undefined;
    let error = false;

    if (userData) {
      stats = normalizeUserData(userData);
    } else {
      error = true;
    }

    return {
      props: {
        title: 'LeetCode',
        ogDescription: 'LeetCode statistics and problem-solving progress for shaxntanu.',
        stats,
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
