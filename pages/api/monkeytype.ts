import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.MONKEYTYPE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'MonkeyType API key not configured' });
  }

  try {
    // Fetch personal bests
    const pbResponse = await fetch('https://api.monkeytype.com/users/personalBests', {
      headers: {
        'Authorization': `ApeKey ${apiKey}`,
      },
    });

    // Fetch typing stats
    const statsResponse = await fetch('https://api.monkeytype.com/users/stats', {
      headers: {
        'Authorization': `ApeKey ${apiKey}`,
      },
    });

    if (!pbResponse.ok || !statsResponse.ok) {
      throw new Error('Failed to fetch from MonkeyType API');
    }

    const pbData = await pbResponse.json();
    const statsData = await statsResponse.json();

    res.status(200).json({
      personalBests: pbData.data,
      typingStats: statsData.data,
    });
  } catch (error) {
    console.error('MonkeyType API error:', error);
    res.status(500).json({ error: 'Failed to fetch typing stats' });
  }
}
