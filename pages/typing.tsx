import Head from '@/components/Head';
import Image from 'next/image';
import styles from '@/styles/TypingPage.module.css';

interface TypingStats {
  testsStarted: number;
  testsCompleted: number;
  completionRate: number;
  timeTyping: string;
}

interface TypingPageProps {
  stats: TypingStats | null;
}

const TypingPage = ({ stats }: TypingPageProps) => {
  const username = 'shaxntanu';

  return (
    <>
      <Head title="Typing Stats" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.comment}># input_latency.py</span>
          </h1>
          <p className={styles.subtitle}>MonkeyType Statistics for @{username}</p>
        </div>

        <div className={styles.codeBlock}>
          <pre className={styles.code}>
            <span className={styles.keyword}>import</span> monkeytype
            {'\n\n'}
            <span className={styles.keyword}>class</span> <span className={styles.className}>TypingStats</span>:
            {'\n'}    <span className={styles.keyword}>def</span> <span className={styles.function}>__init__</span>(<span className={styles.param}>self</span>):
            {'\n'}        <span className={styles.param}>self</span>.username = <span className={styles.string}>&quot;{username}&quot;</span>
            {'\n'}        <span className={styles.param}>self</span>.profile = <span className={styles.string}>&quot;<a href={`https://monkeytype.com/profile/${username}`} target="_blank" rel="noopener noreferrer" className={styles.link}>https://monkeytype.com/profile/{username}</a>&quot;</span>
          </pre>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Image src="/logos/test_started.svg" alt="Tests Started" width={48} height={48} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Tests Started</span>
              <span className={styles.statValue}>{stats?.testsStarted || '---'}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Image src="/logos/test_completed.svg" alt="Tests Completed" width={48} height={48} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Tests Completed</span>
              <span className={styles.statValue}>{stats?.testsCompleted || '---'}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Image src="/logos/completion_rate.svg" alt="Completion Rate" width={48} height={48} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Completion Rate</span>
              <span className={styles.statValue}>{stats?.completionRate ? `${stats.completionRate}%` : '---'}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Image src="/logos/time_typing.svg" alt="Time Typing" width={48} height={48} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Time Typing</span>
              <span className={styles.statValue}>{stats?.timeTyping || '---'}</span>
            </div>
          </div>
        </div>

        <div className={styles.profileLink}>
          <a 
            href={`https://monkeytype.com/profile/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={styles.button}>
              <span className={styles.shadow}></span>
              <span className={styles.edge}></span>
              <div className={styles.front}>
                <span>View Full Profile on MonkeyType →</span>
              </div>
            </button>
          </a>
        </div>

        <div className={styles.note}>
          <span className={styles.comment}># Note: MonkeyType API requires authentication.</span>
          <br />
          <span className={styles.comment}># Visit the profile link above for live stats.</span>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const apiKey = process.env.MONKEYTYPE_API_KEY;
  let stats: TypingStats | null = null;

  if (apiKey) {
    try {
      const statsRes = await fetch('https://api.monkeytype.com/users/stats', {
        headers: { 'Authorization': `ApeKey ${apiKey}` },
      });

      let testsStarted = 0;
      let testsCompleted = 0;
      let completionRate = 0;
      let timeTyping = '---';

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        testsStarted = statsData.data?.startedTests || 0;
        testsCompleted = statsData.data?.completedTests || 0;
        const totalSeconds = statsData.data?.timeTyping || 0;
        
        completionRate = testsStarted > 0 
          ? Math.round((testsCompleted / testsStarted) * 100) 
          : 0;
        
        if (totalSeconds > 0) {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          timeTyping = `${hours}h ${minutes}m`;
        }
      }

      stats = { testsStarted, testsCompleted, completionRate, timeTyping };
    } catch (error) {
      console.error('Error fetching MonkeyType stats:', error);
    }
  }

  return {
    props: {
      title: 'Typing Stats',
      stats,
    },
    revalidate: 3600,
  };
}

export default TypingPage;
