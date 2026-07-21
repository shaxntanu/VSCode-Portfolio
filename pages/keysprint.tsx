import styles from '@/styles/KeysprintPage.module.css';
import { useState, useEffect } from 'react';
import { Radar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

interface PersonalBest {
  wpm: number;
  acc: number;
  timestamp: number;
  raw?: number;
  consistency?: number;
  difficulty?: string;
  language?: string;
  punctuation?: boolean;
  numbers?: boolean;
  lazyMode?: boolean;
}

interface StreakData {
  lastResultTimestamp: number;
  length: number;
  maxLength: number;
  hourOffset?: number;
}

interface ProfileDetails {
  bio?: string;
  keyboard?: string;
  socialProfiles?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface MonkeyTypeData {
  profile?: {
    name: string;
    uid: string;
    streak: number;
    maxStreak: number;
    details?: ProfileDetails;
    personalBests?: {
      time?: Record<string, PersonalBest[]>;
      words?: Record<string, PersonalBest[]>;
    };
    typingStats?: {
      completedTests: number;
      startedTests: number;
      timeTyping: number;
    };
  };
  personalBests?: {
    time?: Record<string, PersonalBest[]>;
  };
  typingStats?: {
    completedTests: number;
    startedTests: number;
    timeTyping: number;
  };
  streak?: StreakData;
}

const KeysprintPage = () => {
  const [data, setData] = useState<MonkeyTypeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/monkeytype');
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to fetch data');
          return;
        }

        setData(result);
        setError(null);
      } catch {
        setError('Unable to connect to API');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Get personal bests from either authenticated data or public profile
  const getPersonalBests = () => {
    return data?.personalBests?.time || data?.profile?.personalBests?.time;
  };

  // Get typing stats from either source
  const getTypingStats = () => {
    return data?.typingStats || data?.profile?.typingStats;
  };

  const getBestWpm = (timeMode: string): PersonalBest | null => {
    const pbs = getPersonalBests();
    const tests = pbs?.[timeMode];
    if (!tests || tests.length === 0) return null;
    return tests.reduce((best, test) => (test.wpm > best.wpm ? test : best), tests[0]);
  };

  // Get all personal bests for the Radar chart (Performance Overview)
  const getRadarChartData = () => {
    const modes = ['15', '30', '60', '120'];
    const wpmData = modes.map((mode) => {
      const best = getBestWpm(mode);
      return best?.wpm || 0;
    });

    const accData = modes.map((mode) => {
      const best = getBestWpm(mode);
      return best?.acc || 0;
    });

    const consistencyData = modes.map((mode) => {
      const best = getBestWpm(mode);
      return best?.consistency || 0;
    });

    return {
      labels: modes.map((m) => `${m}s Mode`),
      datasets: [
        {
          label: 'WPM',
          data: wpmData,
          backgroundColor: 'rgba(0, 212, 255, 0.2)',
          borderColor: 'rgba(0, 212, 255, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(0, 212, 255, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 212, 255, 1)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Accuracy %',
          data: accData,
          backgroundColor: 'rgba(0, 255, 127, 0.2)',
          borderColor: 'rgba(0, 255, 127, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(0, 255, 127, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 255, 127, 1)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Consistency %',
          data: consistencyData,
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
          borderColor: 'rgba(255, 165, 0, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 165, 0, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 165, 0, 1)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'JetBrains Mono',
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#00d4ff',
        borderColor: 'rgba(0, 212, 255, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            if (label === 'WPM') {
              return `${label}: ${value.toFixed(0)} WPM`;
            }
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: 'rgba(255, 255, 255, 0.5)',
          backdropColor: 'transparent',
          font: {
            family: 'JetBrains Mono',
            size: 10,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          circular: true,
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'JetBrains Mono',
            size: 12,
          },
        },
      },
    },
  };

  // Get completion rate doughnut chart data
  const getCompletionChartData = () => {
    const stats = getTypingStats();
    if (!stats) return null;

    const completed = stats.completedTests;
    const incomplete = stats.startedTests - stats.completedTests;

    return {
      labels: ['Completed', 'Incomplete'],
      datasets: [
        {
          data: [completed, incomplete],
          backgroundColor: [
            'rgba(0, 255, 127, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgba(0, 255, 127, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'JetBrains Mono',
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#00d4ff',
        borderColor: 'rgba(0, 212, 255, 0.5)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Get WPM progression line chart (if we have time-based data)
  const getProgressionChartData = () => {
    const modes = ['15', '30', '60', '120'];
    const wpmData = modes.map((mode) => {
      const best = getBestWpm(mode);
      return best?.wpm || 0;
    });

    return {
      labels: modes.map((m) => `${m}s`),
      datasets: [
        {
          label: 'WPM Performance',
          data: wpmData,
          fill: true,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            return gradient;
          },
          borderColor: 'rgba(0, 212, 255, 1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(0, 212, 255, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
        },
      ],
    };
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#00d4ff',
        borderColor: 'rgba(0, 212, 255, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y} WPM`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: 'JetBrains Mono',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'JetBrains Mono',
          },
        },
      },
    },
  };

  const typingStats = getTypingStats();
  const streakData = data?.streak;
  const profile = data?.profile;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.comment}># </span>
            KEYSPRINT_STATS
          </h1>
          <p className={styles.subtitle}>
            MonkeyType Performance Metrics
            {profile?.name && <span className={styles.username}> • @{profile.name}</span>}
          </p>
        </div>

        {loading && (
          <div className={styles.loading}>
            <span className={styles.loadingText}>Fetching typing data...</span>
          </div>
        )}

        {error && !loading && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {data && !loading && !error && (
          <div className={styles.content}>
            {/* Streak Overview */}
            {streakData && (
              <div className={styles.streakCard}>
                <div className={styles.streakIcon}>🔥</div>
                <div className={styles.streakInfo}>
                  <span className={styles.streakValue}>{streakData.length}</span>
                  <span className={styles.streakLabel}>day streak</span>
                </div>
                <div className={styles.streakMax}>
                  <span className={styles.streakMaxLabel}>max</span>
                  <span className={styles.streakMaxValue}>{streakData.maxLength}</span>
                </div>
              </div>
            )}

            {/* Radar Chart - Performance Overview */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.keyword}>radar</span> PERFORMANCE_OVERVIEW
              </h2>
              <div className={styles.chartContainer}>
                <Radar data={getRadarChartData()} options={radarOptions} />
              </div>
            </div>

            {/* Line Chart - WPM Progression */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.keyword}>graph</span> WPM_PROGRESSION
              </h2>
              <div className={styles.chartContainer}>
                <Line data={getProgressionChartData()} options={lineOptions} />
              </div>
            </div>

            {/* Stats Grid with Doughnut Chart */}
            <div className={styles.chartsRow}>
              {/* Completion Rate Doughnut */}
              {typingStats && getCompletionChartData() && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.keyword}>chart</span> TEST_COMPLETION
                  </h2>
                  <div className={styles.doughnutContainer}>
                    <Doughnut data={getCompletionChartData()!} options={doughnutOptions} />
                  </div>
                </div>
              )}
            </div>

            {/* Personal Bests Cards */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.keyword}>export</span> PERSONAL_BESTS
              </h2>
              <div className={styles.statsGrid}>
                {['15', '30', '60', '120'].map((time) => {
                  const best = getBestWpm(time);
                  return (
                    <div key={time} className={styles.statCard}>
                      <span className={styles.statLabel}>{time}s</span>
                      {best ? (
                        <>
                          <span className={styles.statValue}>{Math.round(best.wpm)}</span>
                          <span className={styles.statUnit}>WPM</span>
                          <span className={styles.statAcc}>{best.acc.toFixed(1)}% acc</span>
                          {best.consistency && (
                            <span className={styles.statConsistency}>
                              {best.consistency.toFixed(0)}% cons
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.statValue}>--</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Typing Stats */}
            {typingStats && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.keyword}>const</span> TYPING_STATS
                </h2>
                <div className={styles.envBlock}>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>TESTS_COMPLETED</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>{typingStats.completedTests.toLocaleString()}</span>
                  </div>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>TESTS_STARTED</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>{typingStats.startedTests.toLocaleString()}</span>
                  </div>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>TIME_TYPING</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>{formatTime(typingStats.timeTyping)}</span>
                  </div>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>COMPLETION_RATE</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>
                      {typingStats.startedTests > 0
                        ? ((typingStats.completedTests / typingStats.startedTests) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Details */}
            {profile?.details && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.keyword}>interface</span> PROFILE
                </h2>
                <div className={styles.envBlock}>
                  {profile.details.keyboard && (
                    <div className={styles.envLine}>
                      <span className={styles.envKey}>KEYBOARD</span>
                      <span className={styles.envEquals}>=</span>
                      <span className={styles.envValue}>
                        &quot;{profile.details.keyboard}&quot;
                      </span>
                    </div>
                  )}
                  {profile.details.bio && (
                    <div className={styles.envLine}>
                      <span className={styles.envKey}>BIO</span>
                      <span className={styles.envEquals}>=</span>
                      <span className={styles.envValue}>&quot;{profile.details.bio}&quot;</span>
                    </div>
                  )}
                  {profile.details.socialProfiles?.github && (
                    <div className={styles.envLine}>
                      <span className={styles.envKey}>GITHUB</span>
                      <span className={styles.envEquals}>=</span>
                      <span className={styles.envValue}>
                        <a
                          href={`https://github.com/${profile.details.socialProfiles.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @{profile.details.socialProfiles.github}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.footer}>
              <span className={styles.comment}>
                # Data from{' '}
                <a
                  href="https://monkeytype.com/profile/shaxntanu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  monkeytype.com/profile/shaxntanu
                </a>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KeysprintPage;

export async function getStaticProps() {
  return {
    props: { title: 'Keysprint' },
  };
}
