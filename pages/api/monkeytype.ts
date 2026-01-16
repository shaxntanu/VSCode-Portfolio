import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.MONKEYTYPE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Fetch personal bests
    const pbResponse = await fetch('https://api.monkeytype.com/users/personalBests?mode=time', {
      headers: {
        'Authorization': `ApeKey ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    // Fetch typing stats
    const statsResponse = await fetch('https://api.monkeytype.com/users/stats', {
      headers: {
        'Authorization': `ApeKey ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    const pbData = await pbResponse.json();
    const statsData = await statsResponse.json();

    // Log for debugging
    console.log('PB Response status:', pbResponse.status);
    console.log('Stats Response status:', statsResponse.status);

    if (!pbResponse.ok) {
      console.error('PB Error:', pbData);
      return res.status(pbResponse.status).json({ error: pbData.message || 'Failed to fetch personal bests' });
    }

    if (!statsResponse.ok) {
      console.error('Stats Error:', statsData);
      return res.status(statsResponse.status).json({ error: statsData.message || 'Failed to fetch stats' });
    }

    res.status(200).json({
      personalBests: pbData.data,
      typingStats: statsData.data,
    });
  } catch (error) {
    console.error('MonkeyType API error:', error);
    res.status(500).json({ error: 'Failed to connect to MonkeyType API' });
  }
}
