import type { NextApiRequest, NextApiResponse } from 'next';

const MONKEYTYPE_API = 'https://api.monkeytype.com';
const USERNAME = 'shaxntanu';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.MONKEYTYPE_API_KEY;

  const headers = {
    'Accept': 'application/json',
    ...(apiKey && { 'Authorization': `ApeKey ${apiKey}` }),
  };

  try {
    // Fetch public profile (doesn't require auth)
    const profileResponse = await fetch(`${MONKEYTYPE_API}/users/${USERNAME}/profile`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store', // Don't cache
    });

    // These require API key
    const fetchWithAuth = async (endpoint: string) => {
      if (!apiKey) return null;
      const response = await fetch(`${MONKEYTYPE_API}${endpoint}`, { 
        headers,
        cache: 'no-store', // Don't cache
      });
      if (!response.ok) {
        console.log(`Failed to fetch ${endpoint}:`, response.status);
        return null;
      }
      return response.json();
    };

    const [pbData, statsData, streakData, activityData] = await Promise.all([
      fetchWithAuth('/users/personalBests?mode=time'),
      fetchWithAuth('/users/stats'),
      fetchWithAuth('/users/streak'),
      fetchWithAuth('/users/currentTestActivity'),
    ]);

    const profileData = profileResponse.ok ? await profileResponse.json() : null;

    // Log activity data for debugging
    if (activityData?.data) {
      console.log('Activity data from API:', {
        length: activityData.data.testsByDays?.length,
        lastDay: activityData.data.lastDay,
        first10: activityData.data.testsByDays?.slice(0, 10),
      });
    }
    if (profileData?.data?.testActivity) {
      console.log('Profile activity data:', {
        length: profileData.data.testActivity.testsByDays?.length,
        lastDay: profileData.data.testActivity.lastDay,
        first10: profileData.data.testActivity.testsByDays?.slice(0, 10),
      });
    }

    // Build response with available data
    const responseData: Record<string, unknown> = {};

    if (profileData?.data) {
      responseData.profile = {
        name: profileData.data.name,
        uid: profileData.data.uid,
        xp: profileData.data.xp,
        streak: profileData.data.streak,
        maxStreak: profileData.data.maxStreak,
        details: profileData.data.details,
        personalBests: profileData.data.personalBests,
        typingStats: profileData.data.typingStats,
        testActivity: profileData.data.testActivity,
        allTimeLbs: profileData.data.allTimeLbs,
      };
    }

    if (pbData?.data) {
      responseData.personalBests = pbData.data;
    }

    if (statsData?.data) {
      responseData.typingStats = statsData.data;
    }

    if (streakData?.data) {
      responseData.streak = streakData.data;
    }

    // Prefer authenticated activity data over profile data
    if (activityData?.data) {
      responseData.testActivity = activityData.data;
    }

    if (Object.keys(responseData).length === 0) {
      return res.status(500).json({ error: 'Unable to fetch any data from MonkeyType' });
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('MonkeyType API error:', error);
    res.status(500).json({ error: 'Failed to connect to MonkeyType API' });
  }
}
