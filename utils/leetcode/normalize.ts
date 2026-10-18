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
  const questionCounts = userData.data.allQuestionsCount || [];
  const getQuestionCount = (difficulty: 'Easy' | 'Medium' | 'Hard') =>
    questionCounts.find(questionCount => questionCount.difficulty === difficulty)?.count;

  const stats: LeetCodeStats = {
    username: matchedUser.username,
    totalSolved: allStat?.count || 0,
    easySolved: easyStat?.count || 0,
    mediumSolved: mediumStat?.count || 0,
    hardSolved: hardStat?.count || 0,
    easyTotal: getQuestionCount('Easy'),
    mediumTotal: getQuestionCount('Medium'),
    hardTotal: getQuestionCount('Hard'),
  };

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
