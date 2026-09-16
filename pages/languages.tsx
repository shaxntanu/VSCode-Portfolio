import { GetStaticProps } from 'next';
import styles from '@/styles/LanguagesPage.module.css';
import { getLanguageColor, formatBytes } from '@/utils/languageColors';

interface LanguageData {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

interface LanguagesPageProps {
  languages: LanguageData[];
  totalBytes: number;
  repositoriesAnalyzed: number;
  languagesDetected: number;
  lastUpdated: string;
}

const LanguagesPage = ({
  languages,
  totalBytes,
  repositoriesAnalyzed,
  languagesDetected,
  lastUpdated,
}: LanguagesPageProps) => {
  if (!languages || languages.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>languages.stats</h1>
        <p className={styles.pageSubtitle}>
          GitHub Language Distribution across analyzed repositories
        </p>
        <div className={styles.empty}>No language statistics available.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>languages.stats</h1>
      <p className={styles.pageSubtitle}>
        GitHub Language Distribution — Languages detected across my repositories based on GitHub's language analysis. These percentages represent the distribution of code bytes, not personal proficiency.
      </p>

      <div className={styles.header}>
        <h2 className={styles.title}>Languages Across My Repositories</h2>
        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Repositories Analyzed</span>
            <span className={styles.metadataValue}>{repositoriesAnalyzed}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Languages Detected</span>
            <span className={styles.metadataValue}>{languagesDetected}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Last Updated</span>
            <span className={styles.metadataValue}>{lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className={styles.languageList}>
        {languages.map((language) => (
          <div key={language.name} className={styles.languageItem}>
            <div className={styles.languageRow}>
              <div
                className={styles.languageIcon}
                style={{ backgroundColor: language.color }}
              />
              <span className={styles.languageName}>{language.name}</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${language.percentage}%`,
                    backgroundColor: language.color,
                  }}
                />
              </div>
              <span className={styles.percentage}>
                {language.percentage.toFixed(1)}%
              </span>
            </div>
            <div className={styles.bytes}>{formatBytes(language.bytes)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const username = 'shaxntanu';
  
  // Allowlist of Arceus-Labs repositories where genuine contribution exists
  const arceusLabsRepos = [
    'Jolt-Locator',
    'The-Ruin-Machine',
    'RFID-Attendance-System',
    'Servo-Light-Switch-Control-ESP8266-and-HC06',
    'esp8266-inductance-meter',
    'Arduino-Electromagnet-Turns-Controller',
  ];

  try {
    // Fetch repos from main account
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`
    );
    
    if (!reposRes.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await reposRes.json();
    
    // Filter out forks
    const ownRepos = Array.isArray(repos) ? repos.filter((repo: any) => !repo.fork) : [];

    // Fetch Arceus-Labs allowlisted repos
    const arceusRepoPromises = arceusLabsRepos.map((repoName) =>
      fetch(`https://api.github.com/repos/Arceus-Labs/${repoName}`).then((res) =>
        res.ok ? res.json() : null
      )
    );

    const arceusRepos = (await Promise.all(arceusRepoPromises)).filter(Boolean);

    // Combine repos
    const allRepos = [...ownRepos, ...arceusRepos];

    // Fetch language data for each repo
    const languagePromises = allRepos.map((repo: any) =>
      fetch(repo.languages_url).then((res) => (res.ok ? res.json() : {}))
    );

    const languageResults = await Promise.all(languagePromises);

    // Aggregate language bytes
    const languageMap = new Map<string, number>();
    let totalBytes = 0;

    languageResults.forEach((languages) => {
      Object.entries(languages).forEach(([language, bytes]) => {
        const currentBytes = languageMap.get(language) || 0;
        languageMap.set(language, currentBytes + (bytes as number));
        totalBytes += bytes as number;
      });
    });

    // Calculate percentages and sort
    const languages: LanguageData[] = Array.from(languageMap.entries())
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalBytes) * 100,
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const lastUpdated = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      props: {
        title: 'Languages',
        ogDescription: 'GitHub language distribution across repositories',
        languages,
        totalBytes,
        repositoriesAnalyzed: allRepos.length,
        languagesDetected: languages.length,
        lastUpdated,
      },
      revalidate: 21600, // 6 hours
    };
  } catch (error) {
    console.error('Error fetching language statistics:', error);
    return {
      props: {
        title: 'Languages',
        languages: [],
        totalBytes: 0,
        repositoriesAnalyzed: 0,
        languagesDetected: 0,
        lastUpdated: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      },
      revalidate: 3600, // 1 hour on error
    };
  }
};

export default LanguagesPage;
