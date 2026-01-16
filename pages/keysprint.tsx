import Head from '@/components/Head';
import styles from '@/styles/KeysprintPage.module.css';
import { useState, useEffect } from 'react';

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
    xp: number;
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

  // Get all personal bests for the graph
  const getGraphData = () => {
    const modes = ['15', '30', '60', '120'];
    return modes.map(mode => {
      const best = getBestWpm(mode);
      return {
        mode,
        wpm: best?.wpm || 0,
        acc: best?.acc || 0,
      };
    });
  };

  // Generate activity heatmap data (last 52 weeks)
  const getActivityHeatmap = () => {
    const activity = data?.testActivity || data?.profile?.testActivity;
    if (!activity?.testsByDays) return [];
    
    const { testsByDays } = activity;
    const today = new Date();
    const heatmapData: { date: Date; count: number }[] = [];
    
    // testsByDays is an array where index 0 is the most recent day
    for (let i = 0; i < Math.min(testsByDays.length, 365); i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      heatmapData.unshift({
        date,
        count: testsByDays[i] || 0,
      });
    }
    
    return heatmapData;
  };

  const graphData = getGraphData();
  const maxWpm = Math.max(...graphData.map(d => d.wpm), 100);
  const typingStats = getTypingStats();
  const streakData = data?.streak;
  const profile = data?.profile;

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
            {/* Profile & Streak Overview */}
            {(profile || streakData) && (
              <div className={styles.overviewRow}>
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
                {profile?.xp !== undefined && (
                  <div className={styles.xpCard}>
                    <span className={styles.xpLabel}>XP</span>
                    <span className={styles.xpValue}>{profile.xp.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* WPM Graph Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.keyword}>graph</span> WPM_BY_DURATION
              </h2>
              <div className={styles.graphContainer}>
                <div className={styles.graphYAxis}>
                  <span>{Math.round(maxWpm)}</span>
                  <span>{Math.round(maxWpm * 0.5)}</span>
                  <span>0</span>
                </div>
                <div className={styles.graph}>
                  {graphData.map((d) => (
                    <div key={d.mode} className={styles.barContainer}>
                      <div 
                        className={styles.bar}
                        style={{ height: `${(d.wpm / maxWpm) * 100}%` }}
                      >
                        <span className={styles.barValue}>{Math.round(d.wpm)}</span>
                      </div>
                      <span className={styles.barLabel}>{d.mode}s</span>
                    </div>
                  ))}
                </div>
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
                            <span className={styles.statConsistency}>{best.consistency.toFixed(0)}% cons</span>
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
            {(data?.testActivity || profile?.testActivity) && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.keyword}>render</span> TEST_ACTIVITY
                </h2>
                <div className={styles.heatmapContainer}>
                  <div className={styles.heatmap}>
                    {getActivityHeatmap().slice(-84).map((day, i) => (
                      <div
                        key={i}
                        className={styles.heatmapCell}
                        style={{
                          opacity: day.count === 0 ? 0.1 : Math.min(0.3 + (day.count / 20) * 0.7, 1),
                        }}
                        title={`${day.date.toLocaleDateString()}: ${day.count} tests`}
                      />
                    ))}
                  </div>
                  <div className={styles.heatmapLegend}>
                    <span>Less</span>
                    <div className={styles.legendCells}>
                      {[0.1, 0.3, 0.5, 0.7, 1].map((opacity, i) => (
                        <div key={i} className={styles.heatmapCell} style={{ opacity }} />
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
                        : 0}%
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
                      <span className={styles.envValue}>"{profile.details.keyboard}"</span>
                    </div>
                  )}
                  {profile.details.bio && (
                    <div className={styles.envLine}>
                      <span className={styles.envKey}>BIO</span>
                      <span className={styles.envEquals}>=</span>
                      <span className={styles.envValue}>"{profile.details.bio}"</span>
                    </div>
                  )}
                  {profile.details.socialProfiles?.github && (
                    <div className={styles.envLine}>
                      <span className={styles.envKey}>GITHUB</span>
                      <span className={styles.envEquals}>=</span>
                      <span className={styles.envValue}>
                        <a href={`https://github.com/${profile.details.socialProfiles.github}`} target="_blank" rel="noopener noreferrer">
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
                <a href="https://monkeytype.com/profile/shaxntanu" target="_blank" rel="noopener noreferrer">
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