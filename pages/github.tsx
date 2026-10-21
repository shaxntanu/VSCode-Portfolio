import Image from 'next/image';
import RepoCard from '@/components/RepoCard';
import type { Activity } from 'react-activity-calendar';
import ActivityTerrain from '@/components/ActivityTerrain';
import GithubSkeleton from '@/components/GithubSkeleton';
import LanguageTreemap, { type LanguageData, type LanguageRepositoryUsage } from '@/components/LanguageTreemap';
import styles from '@/styles/GithubPage.module.css';
import { Repo, User } from '@/types';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useMainAreaLoading } from '@/contexts/MainAreaLoadingContext';
import { getLanguageColor } from '@/utils/languageColors';

interface ContributionCalendarResponse {
  contributions: Activity[];
  total: Record<string, number> & { lastYear: number };
}

interface LoadedContributionCalendar {
  year: number | 'last-year';
  response: ContributionCalendarResponse;
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
  const [calendarData, setCalendarData] = useState<LoadedContributionCalendar | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useMainAreaLoading('github-contribution-calendar', calendarLoading);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const year = selectedYear === 'last-year' ? 'last' : String(selectedYear);

    setCalendarLoading(true);
    setCalendarError(null);

    const fetchContributions = async () => {
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
          { signal: controller.signal }
        );
        const result = await response.json() as ContributionCalendarResponse;

        if (!response.ok) {
          throw new Error('Unable to fetch GitHub contributions.');
        }
        if (!Array.isArray(result.contributions) || !result.total) {
          throw new Error('GitHub returned invalid contribution data.');
        }

        if (active) setCalendarData({ year: selectedYear, response: result });
      } catch (error) {
        if (!active) return;
        setCalendarData(null);
        setCalendarError(error instanceof Error ? error.message : 'Unable to fetch GitHub contributions.');
      } finally {
        if (active) setCalendarLoading(false);
      }
    };

    fetchContributions();

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedYear, username]);

  const calendarContributions = useMemo(
    () => [...(calendarData?.year === selectedYear ? calendarData.response.contributions : [])]
      .sort((first, second) => first.date.localeCompare(second.date)),
    [calendarData, selectedYear]
  );
  const selectedCalendarData = calendarData?.year === selectedYear
    ? calendarData.response
    : null;
  const activityCounts = useMemo(
    () => calendarContributions.map((activity) => activity.count),
    [calendarContributions]
  );
  const calendarEndDate = calendarContributions.at(-1)?.date
    ?? new Date().toISOString().slice(0, 10);

  // Generate year options (from current year down to 2025 when account started)
  const yearOptions: (number | 'last-year')[] = ['last-year'];
  for (let year = currentYear; year >= 2025; year--) {
    yearOptions.push(year);
  }

  const getYearLabel = (year: number | 'last-year') => {
    return year === 'last-year' ? 'Last 12 Months' : year.toString();
  };

  const handleYearSelect = (year: number | 'last-year') => {
    setIsDropdownOpen(false);
    if (year === selectedYear) return;

    // Start the overlay in the same update as the selection, so the old
    // calendar is never left interactive while the new year is loading.
    setCalendarLoading(true);
    setCalendarError(null);
    setCalendarData(null);
    setSelectedYear(year);
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

  // Show skeleton if no user data is available
  if (!user) {
    return <GithubSkeleton />;
  }

  return (
    <div className={styles.container} inert={calendarLoading} aria-busy={calendarLoading}>
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
                {calendarError ? (
                  <p className={styles.calendarStatus} role="alert">{calendarError}</p>
                ) : selectedCalendarData ? (
                  <ActivityTerrain
                    className={styles.activityTerrain}
                    data={activityCounts}
                    endDate={calendarEndDate}
                    title={getYearLabel(selectedYear)}
                  />
                ) : (
                  <p className={styles.calendarStatus} role="status">
                    {calendarLoading ? 'Loading GitHub contributions…' : 'Contribution data is unavailable.'}
                  </p>
                )}
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
            
            <LanguageTreemap languages={languages} />
          </div>
        )}
    </div>
  );
};

export async function getStaticProps() {
  const username = 'shaxntanu';
  
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

    // Analyze the same public repositories counted in the profile, including forks.
    const profileRepos = Array.isArray(repos) ? repos : [];
    const languagePromises = profileRepos.map(async (repo) => {
      try {
        const response = await fetch(repo.languages_url);
        return response.ok ? response.json() : {};
      } catch {
        return {};
      }
    });

    const languageResults = await Promise.all(languagePromises);

    const languageMap = new Map<string, { bytes: number; repositories: LanguageRepositoryUsage[] }>();
    let totalBytes = 0;

    languageResults.forEach((repositoryLanguages, repoIndex) => {
      const repo = profileRepos[repoIndex];
      Object.entries(repositoryLanguages).forEach(([language, bytes]) => {
        const byteCount = typeof bytes === 'number' && Number.isFinite(bytes) ? bytes : 0;
        if (byteCount <= 0) return;

        const current = languageMap.get(language) || { bytes: 0, repositories: [] };
        current.bytes += byteCount;
        current.repositories.push({
          name: repo.name,
          url: repo.html_url,
          bytes: byteCount,
        });
        languageMap.set(language, current);
        totalBytes += byteCount;
      });
    });

    const languages = Array.from(languageMap.entries())
      .map(([name, languageData]) => ({
        name,
        bytes: languageData.bytes,
        percentage: totalBytes > 0 ? (languageData.bytes / totalBytes) * 100 : 0,
        color: getLanguageColor(name),
        repositories: languageData.repositories.sort((a, b) => b.bytes - a.bytes),
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
        repositoriesAnalyzed: profileRepos.length,
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
