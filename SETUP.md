# Spain Social Feed Widget - Setup & Deployment Guide

## Overview
Single-page HTML widget that searches TikTok for outfit/weather posts and filters them with Claude AI.

**Live Demo:** spain2026-widgets.vercel.app/spain-social-feed.html

## Current Features
- ✅ 4 city tabs (Barcelona, Zaragoza, Segovia, Madrid)
- ✅ Multi-hashtag search per city
- ✅ Claude AI filtering for outfit relevance
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Mock data for testing without API
- ✅ Post cards with engagement stats and AI analysis

## Local Testing

### Option 1: Mock Data Only (No API Keys Needed)
Open directly in browser:
```
file:///path/to/spain-social-feed.html
```
Click any city tab → "Load Posts" to see mock data filtered by Claude.

### Option 2: With Real API Keys
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API keys to `.env.local`:
   ```
   SCRAPECREATORS_API_KEY=your_key_here
   CLAUDE_API_KEY=your_key_here
   ```

3. Open browser console and set the keys:
   ```javascript
   window.SCRAPECREATORS_API_KEY = 'your_key_here';
   window.CLAUDE_API_KEY = 'your_key_here';
   ```

4. Reload the page and click "Load Posts"

## Production Deployment (Vercel)

### Step 1: Set Environment Variables
In Vercel dashboard for `iberia722/spain2026-widgets`:

```
SCRAPECREATORS_API_KEY = [your_key]
CLAUDE_API_KEY = [your_key]
```

### Step 2: Create API Proxy Functions (CORS Fix)
The widget makes direct API calls from the browser, which will fail due to CORS. Create Vercel serverless functions to proxy the requests.

**Create `api/tiktok-search.js`:**
```javascript
export default async function handler(req, res) {
  const { keyword, count } = req.query;
  const apiKey = process.env.SCRAPECREATORS_API_KEY;

  try {
    // TODO: Confirm correct ScrapeCreators endpoint
    const response = await fetch('https://api.scrapecreators.com/v1/tiktok/search?keyword=' + encodeURIComponent(keyword) + '&count=' + count, {
      headers: { 'x-api-key': apiKey }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**Create `api/claude-filter.js`:**
```javascript
export default async function handler(req, res) {
  const { posts, city, minScore } = req.body;
  const apiKey = process.env.CLAUDE_API_KEY;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Filter these TikTok posts from ${city} for outfit relevance...` // Your prompt
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Step 3: Update Widget to Use API Proxies
In `spain-social-feed.html`, update `searchTikTokByHashtag()` and `filterPostsWithClaude()` to call your Vercel API endpoints instead of external APIs.

## Known Issues
1. **ScrapeCreators API Endpoint** — The `/v1/tiktok/search` endpoint returns 404. Need to confirm correct endpoint with ScrapeCreators.
2. **CORS** — Browser cannot directly call external APIs. Use Vercel serverless functions as proxies.
3. **Rate Limiting** — TikTok APIs may have strict rate limits. Consider caching or batching requests.

## API Keys Required
- **Claude (Anthropic)**: https://console.anthropic.com
- **ScrapeCreators**: Check your account dashboard

## Files
- `spain-social-feed.html` — Main widget (no hardcoded keys)
- `.env.example` — Template for environment variables
- `SETUP.md` — This file
- `api/` — Vercel serverless functions (to be created)

## Security
- ✅ No API keys committed to GitHub
- ✅ Keys stored in Vercel environment variables
- ✅ API calls proxied through Vercel for CORS safety
- ⚠️ NEVER paste real keys into the browser console in production

## Next Steps
1. **Confirm ScrapeCreators endpoint** — Ask support for correct API documentation
2. **Test with mock data** — Verify Claude filtering works
3. **Create Vercel API proxies** — Fix CORS and hide API keys
4. **Deploy to Vercel** — Push to GitHub, Vercel auto-deploys
5. **Monitor and iterate** — Check logs, adjust search queries, improve filters
