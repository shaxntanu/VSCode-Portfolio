import type { LeetCodeStats, LeetCodeProblem } from '@/types';
import type {
  LeetCodeUserResponse,
  LeetCodeRecentSubmissionsResponse,
  LeetCodeRecentSubmission,
  LeetCodeContestResponse,
} from './types';

/**
 * Normalize LeetCode user data to application-facing LeetCodeStats interface
 */
export function normalizeUserData(userData: LeetCodeUserResponse): LeetCodeStats {
  const { matchedUser } = userData.data;
  const submitStats = matchedUser.submitStats.acSubmissionNum;

  // Extract counts by difficulty
  const allStat = submitStats.find(s => s.difficulty === 'All');
  const easyStat = submitStats.find(s => s.difficulty === 'Easy');
  const mediumStat = submitStats.find(s => s.difficulty === 'Medium');
  const hardStat = submitStats.find(s => s.difficulty === 'Hard');

  // Calculate acceptance rate
  const acceptanceRate = allStat && allStat.submissions > 0
    ? (allStat.count / allStat.submissions) * 100
    : undefined;

  const stats: LeetCodeStats = {
    username: matchedUser.username,
    totalSolved: allStat?.count || 0,
    easySolved: easyStat?.count || 0,
    mediumSolved: mediumStat?.count || 0,
    hardSolved: hardStat?.count || 0,
    // Total counts for each difficulty
    // LeetCode API doesn't provide total questions per difficulty directly
    // These are approximate values based on LeetCode's current problem count
    easyTotal: 800,
    mediumTotal: 1700,
    hardTotal: 700,
  };

  // Only add optional fields if they have values (Next.js doesn't allow undefined in props)
  if (acceptanceRate !== undefined) {
    stats.acceptanceRate = acceptanceRate;
  }

  return stats;
}

/**
 * Normalize recent submissions to LeetCodeProblem interface
 */
export function normalizeRecentSubmissions(
  submissionsData: LeetCodeRecentSubmissionsResponse
): LeetCodeProblem[] {
  if (!submissionsData.data?.recentAcSubmissionList) {
    return [];
  }

  return submissionsData.data.recentAcSubmissionList.map((submission: LeetCodeRecentSubmission) => ({
    title: submission.title,
    difficulty: submission.difficulty,
    titleSlug: submission.titleSlug,
    status: submission.status,
    acceptanceRate: undefined, // Not provided in recent submissions API
    topicTags: undefined, // Not provided in recent submissions API
  }));
}

/**
 * Extract contest rating from contest data
 */
export function extractContestRating(contestData: LeetCodeContestResponse): number | undefined {
  if (!contestData.data?.userContestRanking || contestData.data.userContestRanking.length === 0) {
    return undefined;
  }

  // Get the most recent contest rating
  const latestContest = contestData.data.userContestRanking[0];
  return latestContest.rating;
}

/**
 * Extract contest ranking from contest data
 */
export function extractContestRanking(contestData: LeetCodeContestResponse): number | undefined {
  if (!contestData.data?.userContestRanking || contestData.data.userContestRanking.length === 0) {
    return undefined;
  }

  const latestContest = contestData.data.userContestRanking[0];
  return latestContest.ranking;
}
