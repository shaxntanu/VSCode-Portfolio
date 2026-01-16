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
                  <div className={styles.calendarInner}>
                    <div className={styles.dayLabels}>
                      <span></span>
                      <span>Mon</span>
                      <span></span>
                      <span>Wed</span>
                      <span></span>
                      <span>Fri</span>
                      <span></span>
                    </div>
                    <GitHubCalendar 
                      username={username}
                      colorScheme="dark"
                      blockSize={10}
                      blockMargin={3}
                      blockRadius={2}
                      fontSize={12}
                      theme={calendarTheme}
                      year={selectedYear === 'last-year' ? undefined : selectedYear}
                      hideColorLegend
                      hideTotalCount
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                  </div>
                </div>
                <div className={styles.select}>
                  <div className={styles.selected}>
                    <span>{getYearLabel(selectedYear)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={styles.arrow}>
                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                    </svg>
                  </div>
                  <div className={styles.options}>
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
