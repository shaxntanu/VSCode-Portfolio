import Image from 'next/image';
import RepoCard from '@/components/RepoCard';
import GitHubCalendar from 'react-github-calendar';
import styles from '@/styles/GithubPage.module.css';
import { Repo, User } from '@/types';
import { useState, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getLanguageColor, formatBytes } from '@/utils/languageColors';

interface LanguageData {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

interface GithubPageProps {
  repos?: Repo[];
  user?: User;
  totalStars?: number;
  totalForks?: number;
  languages?: LanguageData[];
  repositoriesAnalyzed?: number;
  languagesDetected?: number;
}

const GithubPage = ({ 
  repos = [], 
  user, 
  totalStars = 0, 
  totalForks = 0,
  languages = [],
  repositoriesAnalyzed = 0,
  languagesDetected = 0
}: GithubPageProps) => {
  const username = 'shaxntanu';
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | 'last-year'>('last-year');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const calendarTheme = {
    dark: [
      'rgba(255, 255, 255, 0.05)',
      'rgba(0, 212, 255, 0.3)',
      'rgba(0, 212, 255, 0.5)',
      'rgba(0, 212, 255, 0.7)',
      'rgba(0, 212, 255, 1)',
    ],
  };

  // Generate year options (from current year down to 2025 when account started)
  const yearOptions: (number | 'last-year')[] = ['last-year'];
  for (let year = currentYear; year >= 2025; year--) {
    yearOptions.push(year);
  }

  const getYearLabel = (year: number | 'last-year') => {
    return year === 'last-year' ? 'Last 12 Months' : year.toString();
  };

  const handleYearSelect = (year: number | 'last-year') => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 500); // 0.5 second delay
  };

  // Custom tooltip for language chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{data.name}</p>
          <p className={styles.tooltipValue}>
            {data.percentage >= 0.01 
              ? `${data.percentage.toFixed(2)}%` 
              : `${data.percentage.toFixed(4)}%`}
          </p>
          <p className={styles.tooltipBytes}>{formatBytes(data.bytes)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
        {user && (
          <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={120}
                height={120}
                className={styles.avatar}
              />
              <div className={styles.profileInfo}>
                <h1 className={styles.name}>{user.name || user.login}</h1>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className={styles.username}>
                  @{user.login}
                </a>
                {user.bio && <p className={styles.bio}>{user.bio}</p>}
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{user.public_repos}</span>
                <span className={styles.statLabel}>Repositories</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{user.followers}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{user.following}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{totalStars}</span>
                <span className={styles.statLabel}>Total Stars</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{totalForks}</span>
                <span className={styles.statLabel}>Total Forks</span>
              </div>
            </div>

            <div className={styles.contributionSection}>
              <h3 className={styles.sectionTitle}>Contribution Graph</h3>
              <div className={styles.contributionWrapper}>
                <div className={styles.contributionGraph}>
                  <GitHubCalendar 
                    username={username}
                    colorScheme="dark"
                    blockSize={10}
                    blockMargin={3}
                    blockRadius={2}
                    fontSize={12}
                    theme={calendarTheme}
                    year={selectedYear === 'last-year' ? undefined : selectedYear}
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                    labels={{
                      totalCount: selectedYear === 'last-year' 
                        ? '{{count}} contributions in the last 12 months'
                        : `{{count}} contributions in ${selectedYear}`,
                    }}
                  />
                </div>
                <div 
                  className={styles.select}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.selected}>
                    <span>{getYearLabel(selectedYear)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={styles.arrow}>
                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                    </svg>
                  </div>
                  <div className={`${styles.options} ${isDropdownOpen ? styles.optionsOpen : ''}`}>
                    {yearOptions.map((year) => (
                      <div
                        key={year}
                        className={`${styles.option} ${selectedYear === year ? styles.optionSelected : ''}`}
                        onClick={() => handleYearSelect(year)}
                      >
                        {getYearLabel(year)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.reposSection}>
          <h2 className={styles.sectionTitle}>Repositories</h2>
          {repos.length === 0 ? (
            <p>Loading repositories...</p>
          ) : (
            <div className={styles.grid}>
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>

        {/* Language Distribution Section */}
        {languages.length > 0 && (
          <div className={styles.languageSection}>
            <div className={styles.languageHeader}>
              <h2 className={styles.sectionTitle}>Language Distribution</h2>
              <div className={styles.languageMetadata}>
                <div className={styles.metadataItem}>
                  <span className={styles.metadataLabel}>Repositories</span>
                  <span className={styles.metadataValue}>{repositoriesAnalyzed}</span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.metadataLabel}>Languages</span>
                  <span className={styles.metadataValue}>{languagesDetected}</span>
                </div>
              </div>
            </div>
            <p className={styles.sectionSubtitle}>
              Languages detected across my repositories based on GitHub&apos;s language analysis. These percentages represent the distribution of code bytes.
            </p>
            
            {/* Pie Chart */}
            <div className={styles.chartSection}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={languages.slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, percentage } = props;
                      return percentage > 3 ? `${name} ${percentage.toFixed(1)}%` : '';
                    }}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {languages.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Language List */}
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
                    <span className={styles.percentage} title={`Exact: ${language.percentage.toFixed(4)}%`}>
                      {language.percentage >= 0.01 
                        ? `${language.percentage.toFixed(2)}%` 
                        : `${language.percentage.toFixed(4)}%`}
                    </span>
                  </div>
                  <div className={styles.bytes}>{formatBytes(language.bytes)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export async function getStaticProps() {
  const username = 'shaxntanu';
  
  // Allowlist of Arceus-Labs repositories
  const arceusLabsRepos = [
    'Jolt-Locator',
    'The-Ruin-Machine',
    'RFID-Attendance-System',
    'Servo-Light-Switch-Control-ESP8266-and-HC06',
    'esp8266-inductance-meter',
    'Arduino-Electromagnet-Turns-Controller',
  ];
  
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
      fetch(`https://api.github.com/users/${username}`)
    ]);
    
    const repos: Repo[] = await reposRes.json();
    const user: User = await userRes.json();
    
    // Calculate total stars and forks
    const totalStars = Array.isArray(repos) ? repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0) : 0;
    const totalForks = Array.isArray(repos) ? repos.reduce((acc, repo) => acc + (repo.forks || 0), 0) : 0;

    // Fetch language data
    const ownRepos = Array.isArray(repos) ? repos.filter((repo: any) => !repo.fork) : [];
    
    const arceusRepoPromises = arceusLabsRepos.map((repoName) =>
      fetch(`https://api.github.com/repos/Arceus-Labs/${repoName}`).then((res) =>
        res.ok ? res.json() : null
      )
    );

    const arceusRepos = (await Promise.all(arceusRepoPromises)).filter(Boolean);
    const allRepos = [...ownRepos, ...arceusRepos];

    const languagePromises = allRepos.map((repo: any) =>
      fetch(repo.languages_url).then((res) => (res.ok ? res.json() : {}))
    );

    const languageResults = await Promise.all(languagePromises);

    const languageMap = new Map<string, number>();
    let totalBytes = 0;

    languageResults.forEach((languages) => {
      Object.entries(languages).forEach(([language, bytes]) => {
        const currentBytes = languageMap.get(language) || 0;
        languageMap.set(language, currentBytes + (bytes as number));
        totalBytes += bytes as number;
      });
    });

    const languages = Array.from(languageMap.entries())
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalBytes) * 100,
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      props: { 
        title: 'Github',
        ogDescription: 'GitHub stats, contribution graph, and repositories for shaxntanu.',
        repos: Array.isArray(repos) ? repos.slice(0, 10) : [], 
        user: user?.login ? user : null,
        totalStars,
        totalForks,
        languages,
        repositoriesAnalyzed: allRepos.length,
        languagesDetected: languages.length,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return {
      props: { 
        title: 'Github', 
        repos: [], 
        user: null, 
        totalStars: 0, 
        totalForks: 0,
        languages: [],
        repositoriesAnalyzed: 0,
        languagesDetected: 0,
      },
      revalidate: 60,
    };
  }
}

export default GithubPage;
