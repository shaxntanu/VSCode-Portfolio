import Head from '@/components/Head';
import styles from '@/styles/KeysprintPage.module.css';
import { useState, useEffect } from 'react';

interface MonkeyTypeStats {
  personalBests?: {
    time?: {
      '15'?: Array<{ wpm: number; acc: number; timestamp: number }>;
      '30'?: Array<{ wpm: number; acc: number; timestamp: number }>;
      '60'?: Array<{ wpm: number; acc: number; timestamp: number }>;
      '120'?: Array<{ wpm: number; acc: number; timestamp: number }>;
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
        if (!response.ok) {
          throw new Error('Failed to fetch typing stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
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

  const getBestWpm = (timeMode: '15' | '30' | '60' | '120') => {
    const tests = stats?.personalBests?.time?.[timeMode];
    if (!tests || tests.length === 0) return null;
    return tests.reduce((best, test) => (test.wpm > best.wpm ? test : best), tests[0]);
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
          <p className={styles.subtitle}>MonkeyType Performance Metrics</p>
        </div>

        {loading && (
          <div className={styles.loading}>
            <span className={styles.loadingText}>Fetching typing data...</span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠</span>
            <span>{error}</span>
            <p className={styles.errorHint}>Make sure MONKEYTYPE_API_KEY is set in environment variables</p>
          </div>
        )}

        {stats && !loading && (
          <div className={styles.content}>
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
