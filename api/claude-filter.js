/**
 * Serverless function to filter TikTok posts using Claude AI
 * This proxies the Claude API call to avoid CORS issues and keep API keys secure
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body - handle both string and pre-parsed object formats
  let posts, city, minRelevanceScore;
  try {
    const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    posts = bodyData.posts;
    city = bodyData.city;
    minRelevanceScore = bodyData.minRelevanceScore;
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  // Log request for debugging
  console.log('claude-filter called with:', {
    postsCount: posts?.length,
    city,
    minRelevanceScore,
    postsType: typeof posts,
    bodyType: typeof req.body,
    bodySize: JSON.stringify(req.body).length
  });

  // Validate inputs
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    console.error('Invalid posts:', { posts, isArray: Array.isArray(posts), type: typeof posts });
    return res.status(400).json({ error: 'No posts provided', debug: { postsType: typeof posts, isArray: Array.isArray(posts), postsLength: posts?.length } });
  }

  if (!city) {
    console.error('No city provided');
    return res.status(400).json({ error: 'City parameter required' });
  }

  // Get Claude API key from environment
  const claudeApiKey = process.env.CLAUDE_API_KEY;
  if (!claudeApiKey) {
    console.error('CLAUDE_API_KEY not set in environment');
    return res.status(500).json({ error: 'API configuration error' });
  }

  try {
    // Prepare post summaries for Claude
    const postSummaries = posts.map((post, index) => ({
      index: index,
      caption: post.desc || post.title || '',
      username: post.author?.unique_id || post.author?.nickname || 'unknown',
      stats: {
        views: post.statistics?.play_count || post.stats?.play_count || 0,
        likes: post.statistics?.digg_count || post.stats?.digg_count || 0
      }
    }));

    const prompt = `You are analyzing TikTok posts from ${city}, Spain to help a traveler understand what people are currently wearing in MARCH.
CRITICAL SEASONAL FILTER: It is currently MARCH 2026. March weather in Spain:
- Barcelona: 9-15°C, cool mornings, layered clothing essential, NOT summer weather
- Madrid: 8-16°C, cool, jacket required, NOT summer weather
- Zaragoza: 7-15°C, cool, layers necessary, NOT summer weather
- Segovia: 6-14°C, cold, winter coat appropriate, NOT summer weather

REJECT any posts showing summer clothing (crop tops, shorts, sleeveless without context) unless explicitly about a warm/sunny exception day. These indicate the video was recorded months ago and are NOT current.

Here are ${postSummaries.length} posts to analyze:
${JSON.stringify(postSummaries, null, 2)}

For each post, determine:
1. Is it relevant to current clothing/fashion/street style/weather in March? (yes/no)
2. Relevance score (0-10, where 10 is highly relevant):
   - 8-10: Shows appropriate March layering, jackets, seasonal wear that matches current conditions
   - 6-7: Relevant but questionable seasonal fit, or generic outfit content
   - <6: Summer clothing, outdated content, not useful for March travel planning
3. Outfit description (what people are wearing)
4. Weather context (if mentioned)
5. Any crowd/location insights

Return ONLY a JSON array with this structure:
[
  {
    "index": 0,
    "relevant": true,
    "score": 8.5,
    "outfit": "Leather jacket with jeans and sneakers, scarf recommended",
    "weather": "Cool morning, clear skies",
    "insights": "Parque del Retiro busy on weekends"
  },
  ...
]

Only include posts with score >= ${minRelevanceScore || 6.5}. Be VERY strict - reject posts with summer clothing or obvious seasonal mismatch. Only include posts showing CURRENT March-appropriate attire.`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 4000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', response.status, errorData);
      return res.status(response.status).json({
        error: `Claude API error: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    const textContent = data.content.find(item => item.type === 'text');

    if (!textContent) {
      return res.status(500).json({ error: 'No text response from Claude' });
    }

    // Parse Claude's response
    let analysisResults;
    try {
      // Remove markdown code blocks if present
      let jsonText = textContent.text.trim();
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisResults = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return res.status(500).json({
        error: 'Failed to parse Claude response',
        details: textContent.text
      });
    }

    // Return filtered results
    res.status(200).json({
      success: true,
      analyses: analysisResults,
      count: analysisResults.length
    });

  } catch (error) {
    console.error('Claude filter error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
