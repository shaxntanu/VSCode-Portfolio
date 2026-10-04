import { LeetCode } from 'leetcode-query';
import { getCached, setCached } from './cache';
import type {
  LeetCodeUserResponse,
  LeetCodeRecentSubmissionsResponse,
} from './types';

const LEETCODE_USERNAME = 'shaxntanu';
const CACHE_KEY_USER = 'leetcode_user_data';
const CACHE_KEY_SUBMISSIONS = 'leetcode_recent_submissions';

// Initialize LeetCode client
const leetcode = new LeetCode();

/**
 * Fetch user profile and solving statistics from LeetCode
 * Uses server-side caching to avoid repeated API calls
 */
export async function fetchLeetCodeUser(): Promise<LeetCodeUserResponse | null> {
  // Check cache first
  const cached = getCached<LeetCodeUserResponse>(CACHE_KEY_USER);
  if (cached) {
    return cached;
  }

  try {
    // Fetch user data using leetcode-query
    const userData = await leetcode.user(LEETCODE_USERNAME);
    
    if (!userData) {
      return null;
    }

    // The leetcode-query library returns data with the structure we need
    // Transform to our response format for consistency
    const response: LeetCodeUserResponse = {
      data: {
        matchedUser: {
          username: userData.matchedUser?.username || LEETCODE_USERNAME,
          submitStats: {
            acSubmissionNum: (userData.matchedUser?.submitStats?.acSubmissionNum || []).map((stat: any) => ({
              difficulty: stat.difficulty as 'All' | 'Easy' | 'Medium' | 'Hard',
              count: stat.count,
              submissions: stat.submissions
            }))
          },
          profile: {
            realName: userData.matchedUser?.profile?.realName,
            userAvatar: userData.matchedUser?.profile?.userAvatar || '',
            userSlug: userData.matchedUser?.username || LEETCODE_USERNAME
          }
        }
      }
    };

    // Cache the response
    setCached(CACHE_KEY_USER, response);
    return response;
  } catch (error) {
    console.error('Error fetching LeetCode user data:', error);
    return null;
  }
}

/**
 * Fetch recent submissions from LeetCode
 * Uses server-side caching to avoid repeated API calls
 */
export async function fetchRecentSubmissions(limit: number = 10): Promise<LeetCodeRecentSubmissionsResponse | null> {
  // Check cache first
  const cached = getCached<LeetCodeRecentSubmissionsResponse>(CACHE_KEY_SUBMISSIONS);
  if (cached) {
    return cached;
  }

  try {
    // Fetch recent submissions using leetcode-query
    // The library returns an object with recentSubmissions array
    const submissionsData = await leetcode.recent_submissions(LEETCODE_USERNAME, limit);
    
    if (!submissionsData || !submissionsData.recentSubmissions) {
      return null;
    }

    const submissions = submissionsData.recentSubmissions;

    // Transform to our response format
    const response: LeetCodeRecentSubmissionsResponse = {
      data: {
        recentAcSubmissionList: submissions.map((sub: any) => ({
          title: sub.title || '',
          titleSlug: sub.titleSlug || '',
          status: sub.statusDisplay || 'Accepted',
          lang: sub.lang || '',
          difficulty: (sub.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
          timestamp: sub.timestamp ? parseInt(sub.timestamp) : Date.now()
        }))
      }
    };

    // Cache the response
    setCached(CACHE_KEY_SUBMISSIONS, response);
    return response;
  } catch (error) {
    console.error('Error fetching LeetCode recent submissions:', error);
    return null;
  }
}
