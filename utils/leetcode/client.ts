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
    console.log('Returning cached user data');
    return cached;
  }

  try {
    // Fetch user data using leetcode-query
    // This returns UserProfile type which includes matchedUser and recentSubmissionList
    const userData = await leetcode.user(LEETCODE_USERNAME);
    
    console.log('LeetCode user() response:', JSON.stringify(userData, null, 2));
    
    if (!userData || !userData.matchedUser) {
      console.log('No matched user in response');
      return null;
    }

    // Transform to our response format
    const response: LeetCodeUserResponse = {
      data: {
        matchedUser: {
          username: userData.matchedUser.username || LEETCODE_USERNAME,
          submitStats: {
            acSubmissionNum: (userData.matchedUser.submitStats?.acSubmissionNum || []).map((stat: any) => ({
              difficulty: stat.difficulty as 'All' | 'Easy' | 'Medium' | 'Hard',
              count: stat.count,
              submissions: stat.submissions
            }))
          },
          profile: {
            realName: userData.matchedUser.profile?.realName,
            userAvatar: userData.matchedUser.profile?.userAvatar || '',
            userSlug: userData.matchedUser.username || LEETCODE_USERNAME
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
    console.log('Returning cached submissions');
    return cached;
  }

  try {
    // Fetch user data which includes recent submissions
    const userData = await leetcode.user(LEETCODE_USERNAME);
    
    console.log('User data for submissions:', JSON.stringify(userData?.recentSubmissionList, null, 2));
    
    if (!userData || !userData.recentSubmissionList) {
      console.log('No recent submissions in user response');
      // Return empty array structure instead of null
      return {
        data: {
          recentAcSubmissionList: []
        }
      };
    }

    // The recent_submissions() method returns RecentSubmission[] directly
    // But user() method has recentSubmissionList in the response
    const submissions = userData.recentSubmissionList.slice(0, limit);

    // Transform to our response format
    const response: LeetCodeRecentSubmissionsResponse = {
      data: {
        recentAcSubmissionList: submissions.map((sub: any) => ({
          title: sub.title || '',
          titleSlug: sub.titleSlug || '',
          status: sub.statusDisplay || 'Accepted',
          lang: sub.lang || '',
          // Try to infer difficulty from the title or default to Medium
          difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
          timestamp: sub.timestamp ? parseInt(sub.timestamp) : Date.now()
        }))
      }
    };

    console.log('Normalized submissions:', response);

    // Cache the response
    setCached(CACHE_KEY_SUBMISSIONS, response);
    return response;
  } catch (error) {
    console.error('Error fetching LeetCode recent submissions:', error);
    // Return empty array instead of null
    return {
      data: {
        recentAcSubmissionList: []
      }
    };
  }
}
