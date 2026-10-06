import { NextApiRequest, NextApiResponse } from 'next';
import { books } from '@/data/books';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { query } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  // Build catalogue string from books
  const catalogue = books
    .map(book => {
      const blurb = book.blurb.slice(0, 160);
      return `${book.id} :: ${book.title} :: ${book.author} :: ${book.year} :: ${book.genres?.join(', ') || ''} :: ${blurb}`;
    })
    .join('\n');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  // If no API key, fall back to client-side filtering
  if (!apiKey) {
    // Return empty array to trigger client-side fallback
    return res.status(200).json({ ids: [] });
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a book search assistant. Given a user's natural-language request, match it against the following catalogue lines and return ONLY a JSON object with an "ids" array containing the matching book IDs, best match first, at most 20 items. Return empty array if nothing fits.

Catalogue:
${catalogue}

Return format: {"ids":["id1","id2"]}`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: 'Too many searches…' });
      }
      if (response.status === 402) {
        return res.status(402).json({ error: 'Search credits exhausted.' });
      }
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return res.status(200).json({ ids: [] });
    }
    
    const parsed = JSON.parse(content);
    const ids = parsed.ids || [];
    
    // Validate returned ids against real book ids
    const validIds = ids.filter((id: string) => books.some(book => book.id === id));
    
    return res.status(200).json({ ids: validIds });
  } catch (error) {
    console.error('AI search error:', error);
    // Return error to trigger client-side fallback
    return res.status(500).json({ error: 'Search failed' });
  }
}
