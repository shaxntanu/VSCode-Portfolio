import Image from 'next/image';
import RepoCard from '@/components/RepoCard';
import GitHubCalendar from 'react-github-calendar';
import styles from '@/styles/GithubPage.module.css';
import { Repo, User } from '@/types';
import { useState } from 'react';

interface GithubPageProps {
  repos?: Repo[];
  user?: User;
  totalStars?: number;
  totalForks?: number;
}

const GithubPage = ({ repos = [], user, totalStars = 0, totalForks = 0 }: GithubPageProps) => {
  const username = 'shaxntanu';
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | 'last-year'>('last-year');
  const [totalContributions, setTotalContributions] = useState<number>(0);
  
  const calendarTheme = {
    dark: [
      'rgba(255, 255, 255, 0.05)',
      'rgba(0, 212, 255, 0.3)',
      'rgba(0, 212, 255, 0.5)',
      'rgba(0, 212, 255, 0.7)',
      'rgba(0, 212, 255, 1)',
    ],
  };

  // Generate year options (from current year down to 2024 when account started)
  const yearOptions: number[] = [];
  for (let year = currentYear; year >= 2024; year--) {
    yearOptions.push(year);
  }

  const handleYearSelect = (year: number | 'last-year') => {
    setSelectedYear(year);
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
              <div className={styles.contributionContainer}>
                <div className={styles.contributionHeader}>
                  <h3 className={styles.contributionTitle}>
                    {totalContributions.toLocaleString()} contributions in {selectedYear === 'last-year' ? 'the last year' : selectedYear}
                  </h3>
                  <div className={styles.contributionSettings}>
                    <span className={styles.settingsText}>Contribution settings</span>
                    <svg className={styles.caretIcon} viewBox="0 0 16 16" width="16" height="16">
                      <path fillRule="evenodd" d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path>
                    </svg>
                  </div>
                </div>
                <div className={styles.contributionGraph}>
                  <GitHubCalendar 
                    username={username}
                    colorScheme="dark"
                    blockSize={10}
                    blockMargin={3}
                    blockRadius={2}
                    fontSize={11}
                    theme={calendarTheme}
                    year={selectedYear === 'last-year' ? undefined : selectedYear}
                    hideColorLegend
                    hideTotalCount
                    transformData={(data) => {
                      const total = data.reduce((sum, day) => sum + day.count, 0);
                      setTotalContributions(total);
                      return data;
                    }}
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  />
                </div>
                <div className={styles.contributionFooter}>
                  <div className={styles.legendContainer}>
                    <span className={styles.legendText}>Less</span>
                    <div className={styles.legendSquares}>
                      <span className={`${styles.legendSquare} ${styles.level0}`}></span>
                      <span className={`${styles.legendSquare} ${styles.level1}`}></span>
                      <span className={`${styles.legendSquare} ${styles.level2}`}></span>
                      <span className={`${styles.legendSquare} ${styles.level3}`}></span>
                      <span className={`${styles.legendSquare} ${styles.level4}`}></span>
                    </div>
                    <span className={styles.legendText}>More</span>
                  </div>
                </div>
              </div>
              <div className={styles.yearSelector}>
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    className={`${styles.yearButton} ${selectedYear === year ? styles.yearButtonActive : ''}`}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </button>
                ))}
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

    return {
      props: { 
        title: 'Github', 
        repos: Array.isArray(repos) ? repos.slice(0, 10) : [], 
        user: user?.login ? user : null,
        totalStars,
        totalForks
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return {
      props: { title: 'Github', repos: [], user: null, totalStars: 0, totalForks: 0 },
      revalidate: 60,
    };
  }
}

export default GithubPage;
