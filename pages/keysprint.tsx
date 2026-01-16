import Head from '@/components/Head';
import styles from '@/styles/KeysprintPage.module.css';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

interface TestActivity {
  testsByDays: number[];
  lastDay: number;
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
    testActivity?: TestActivity;
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
  testActivity?: TestActivity;
}

const KeysprintPage = () => {
  const [data, setData] = useState<MonkeyTypeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | 'last-year'>('last-year');

  // Generate year options (from current year down to 2025 when MonkeyType was started)
  const yearOptions: (number | 'last-year')[] = ['last-year'];
  for (let year = currentYear; year >= 2025; year--) {
    yearOptions.push(year);
  }

  const getYearLabel = (year: number | 'last-year') => {
    return year === 'last-year' ? 'Last 12 Months' : year.toString();
  };

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

  // Get all personal bests for the chart
  const getChartData = () => {
    const modes = ['15', '30', '60', '120'];
    const wpmData = modes.map((mode) => {
      const best = getBestWpm(mode);
      return best?.wpm || 0;
    });

    return {
      labels: modes.map((m) => `${m}s`),
      datasets: [
        {
          label: 'WPM',
          data: wpmData,
          backgroundColor: 'rgba(0, 212, 255, 0.6)',
          borderColor: 'rgba(0, 212, 255, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#00d4ff',
        borderColor: 'rgba(0, 212, 255, 0.3)',
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

  // Generate activity heatmap data in GitHub style (weeks x 7 days)
  const getActivityHeatmap = () => {
    const activity = data?.testActivity || data?.profile?.testActivity;
    if (!activity?.testsByDays || !activity?.lastDay) return { weeks: [], totalTests: 0, monthLabels: [] };

    const { testsByDays, lastDay } = activity;
    
    // lastDay is the timestamp for index 0 in testsByDays
    const lastDayDate = new Date(lastDay);
    lastDayDate.setHours(0, 0, 0, 0);
    
    // Get today at start of day in local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Determine date range based on selection
    let startDate: Date;
    let endDate: Date;
    
    if (selectedYear === 'last-year') {
      // Last 12 months from lastDay (most recent data point)
      endDate = new Date(lastDayDate);
      startDate = new Date(lastDayDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      // Specific year - show Jan 1 to Dec 31 (or lastDay if current year)
      startDate = new Date(selectedYear, 0, 1, 0, 0, 0, 0); // Jan 1 at midnight local
      if (selectedYear === currentYear) {
        endDate = new Date(lastDayDate); // Use lastDay as end for current year
      } else if (selectedYear > currentYear) {
        // Future year - shouldn't happen but handle it
        return { weeks: [], totalTests: 0, monthLabels: [] };
      } else {
        endDate = new Date(selectedYear, 11, 31, 0, 0, 0, 0); // Dec 31 at midnight local
      }
    }
    
    // Adjust start to beginning of week (Sunday)
    const startDayOfWeek = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - startDayOfWeek);
    
    // Build the grid from adjustedStart to endDate
    const weeks: Array<Array<{ date: Date; count: number; inRange: boolean } | null>> = [];
    const monthLabels: Array<{ month: string; weekIndex: number }> = [];
    let currentWeek: Array<{ date: Date; count: number; inRange: boolean } | null> = [];
    let totalTests = 0;
    let lastMonth = -1;
    
    const currentDate = new Date(adjustedStart);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    while (currentDate <= endDate || currentWeek.length > 0) {
      // Calculate index: days from currentDate to lastDay
      // Index 0 = lastDay, Index 1 = lastDay - 1 day, etc.
      const timeDiff = lastDayDate.getTime() - currentDate.getTime();
      const dayIndex = Math.round(timeDiff / (1000 * 60 * 60 * 24));
      
      // Check if date is within the selected range
      const inRange = currentDate >= startDate && currentDate <= endDate;
      
      // Get count from testsByDays array
      // testsByDays can contain null for days with no activity
      const rawCount = (dayIndex >= 0 && dayIndex < testsByDays.length) ? testsByDays[dayIndex] : null;
      const count = rawCount ?? 0; // Convert null/undefined to 0
      
      if (inRange) {
        totalTests += count;
      }
      
      // Track month changes for labels
      const currentMonth = currentDate.getMonth();
      if (currentMonth !== lastMonth && inRange && currentDate.getDate() <= 7) {
        monthLabels.push({ month: monthNames[currentMonth], weekIndex: weeks.length });
        lastMonth = currentMonth;
      }
      
      currentWeek.push({
        date: new Date(currentDate),
        count,
        inRange,
      });
      
      // If Saturday, push week and start new one
      if (currentDate.getDay() === 6) {
        weeks.push([...currentWeek]);
        currentWeek = [];
        
        // Stop if we've passed the end date
        if (currentDate > endDate) break;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { weeks, totalTests, monthLabels };
  };

  const typingStats = getTypingStats();
  const streakData = data?.streak;
  const profile = data?.profile;
  const { weeks: heatmapWeeks, totalTests, monthLabels } = getActivityHeatmap();
  
  // Calculate max activity for color scaling
  const maxActivity = Math.max(
    ...heatmapWeeks.flatMap(week => 
      week.filter(day => day !== null && day.inRange).map(day => day!.count)
    ),
    1
  );

  // Get color for heatmap cell - empty cells are very dark, active cells scale with intensity
  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.05)'; // Very dark for no activity
    const intensity = Math.min(0.3 + (count / maxActivity) * 0.7, 1);
    return `rgba(0, 212, 255, ${intensity})`;
  };

  return (
    <>
      <Head title="Keysprint Stats" />
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

            {/* WPM Chart Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.keyword}>graph</span> WPM_BY_DURATION
              </h2>
              <div className={styles.chartContainer}>
                <Bar data={getChartData()} options={chartOptions} />
              </div>
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

            {/* Activity Heatmap */}
            {(data?.testActivity || profile?.testActivity) && heatmapWeeks.length > 0 && (
              <div className={styles.section}>
                <div className={styles.activityHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.keyword}>render</span> TEST_ACTIVITY
                  </h2>
                  <div className={styles.select}>
                    <div className={styles.selected}>
                      <span>{getYearLabel(selectedYear)}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        className={styles.arrow}
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                      </svg>
                    </div>
                    <div className={styles.options}>
                      {yearOptions.map((year) => (
                        <div
                          key={year}
                          className={`${styles.option} ${selectedYear === year ? styles.optionSelected : ''}`}
                          onClick={() => setSelectedYear(year)}
                        >
                          {getYearLabel(year)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.heatmapWrapper}>
                  <div className={styles.heatmapLabels}>
                    <span></span>
                    <span>Mon</span>
                    <span></span>
                    <span>Wed</span>
                    <span></span>
                    <span>Fri</span>
                    <span></span>
                  </div>
                  <div className={styles.heatmapContainer}>
                    <div className={styles.monthLabels}>
                      {monthLabels.map((label, i) => (
                        <span 
                          key={i} 
                          className={styles.monthLabel}
                          style={{ gridColumn: label.weekIndex + 1 }}
                        >
                          {label.month}
                        </span>
                      ))}
                    </div>
                    <div className={styles.heatmap}>
                      {heatmapWeeks.map((week, weekIndex) => (
                        <div key={weekIndex} className={styles.heatmapWeek}>
                          {week.map((day, dayIndex) => (
                            <div
                              key={dayIndex}
                              className={styles.heatmapCell}
                              style={{
                                backgroundColor: day && day.inRange
                                  ? getHeatmapColor(day.count)
                                  : 'transparent',
                              }}
                              title={
                                day && day.inRange
                                  ? `${day.date.toLocaleDateString()}: ${day.count} tests`
                                  : ''
                              }
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.heatmapFooter}>
                  <span className={styles.heatmapTotal}>
                    {totalTests.toLocaleString()} tests {selectedYear === 'last-year' ? 'in the last year' : `in ${selectedYear}`}
                  </span>
                  <div className={styles.heatmapLegend}>
                    <span>Less</span>
                    <div className={styles.legendCells}>
                      {[0.1, 0.3, 0.5, 0.7, 1].map((opacity, i) => (
                        <div
                          key={i}
                          className={styles.heatmapCell}
                          style={{ backgroundColor: `rgba(0, 212, 255, ${opacity})` }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            )}

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
