import Head from '@/components/Head';
import styles from '@/styles/KeysprintPage.module.css';
import { useState, useEffect } from 'react';

interface PersonalBest {
  wpm: number;
  acc: number;
  timestamp: number;
  raw?: number;
  consistency?: number;
}

interface MonkeyTypeStats {
  personalBests?: {
    time?: {
      '15'?: PersonalBest[];
      '30'?: PersonalBest[];
      '60'?: PersonalBest[];
      '120'?: PersonalBest[];
    };
  };
  typingStats?: {
    completedTests: number;
    startedTests: number;
    timeTyping: number;
  };
}

const KeysprintPage = () => {
  const [stats, setStats] = useState<MonkeyTypeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/monkeytype');
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Failed to fetch data');
          return;
        }
        
        setStats(data);
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
    return `${hours}h ${minutes}m`;
  };

  const getBestWpm = (timeMode: '15' | '30' | '60' | '120'): PersonalBest | null => {
    const tests = stats?.personalBests?.time?.[timeMode];
    if (!tests || tests.length === 0) return null;
    return tests.reduce((best, test) => (test.wpm > best.wpm ? test : best), tests[0]);
  };

  // Get all personal bests for the graph
  const getGraphData = () => {
    const modes = ['15', '30', '60', '120'] as const;
    return modes.map(mode => {
      const best = getBestWpm(mode);
      return {
        mode,
        wpm: best?.wpm || 0,
        acc: best?.acc || 0,
      };
    });
  };

  const graphData = getGraphData();
  const maxWpm = Math.max(...graphData.map(d => d.wpm), 100);

  return (
    <>
      <Head title="Keysprint Stats" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.comment}># </span>
            KEYSPRINT_STATS
          </h1>
          <p className={styles.subtitle}>MonkeyType Performance Metrics</p>
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

        {stats && !loading && !error && (
          <div className={styles.content}>
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
                  {graphData.map((data) => (
                    <div key={data.mode} className={styles.barContainer}>
                      <div 
                        className={styles.bar}
                        style={{ height: `${(data.wpm / maxWpm) * 100}%` }}
                      >
                        <span className={styles.barValue}>{Math.round(data.wpm)}</span>
                      </div>
                      <span className={styles.barLabel}>{data.mode}s</span>
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
                {(['15', '30', '60', '120'] as const).map((time) => {
                  const best = getBestWpm(time);
                  return (
                    <div key={time} className={styles.statCard}>
                      <span className={styles.statLabel}>{time}s</span>
                      {best ? (
                        <>
                          <span className={styles.statValue}>{Math.round(best.wpm)}</span>
                          <span className={styles.statUnit}>WPM</span>
                          <span className={styles.statAcc}>{best.acc.toFixed(1)}% acc</span>
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
            {stats.typingStats && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.keyword}>const</span> TYPING_STATS
                </h2>
                <div className={styles.envBlock}>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>TESTS_COMPLETED</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>{stats.typingStats.completedTests}</span>
                  </div>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>TESTS_STARTED</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>{stats.typingStats.startedTests}</span>
                  </div>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>TIME_TYPING</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>{formatTime(stats.typingStats.timeTyping)}</span>
                  </div>
                  <div className={styles.envLine}>
                    <span className={styles.envKey}>COMPLETION_RATE</span>
                    <span className={styles.envEquals}>=</span>
                    <span className={styles.envValue}>
                      {((stats.typingStats.completedTests / stats.typingStats.startedTests) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.footer}>
              <span className={styles.comment}># Data fetched from MonkeyType API</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KeysprintPage;
