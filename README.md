# THE BLIND SPOT

AI-powered decision support tool that helps users identify blind spots in their reasoning.

## Live Demo
[Deployed Application](https://the-blind-spot.vercel.app) *(update after deployment)*

## Features
- **Decision Analysis**: Input your decision context and reasoning
- **Blind Spot Detection**: AI identifies unstated assumptions, overlooked factors, and internal conflicts
- **Critical Questions**: Generates probing questions to deepen your thinking
- **Bias Recognition**: Highlights potential cognitive biases in your reasoning
- **No Decision Making**: The tool helps you think critically—it doesn't decide for you

## Tech Stack
- Vanilla HTML/CSS/JavaScript (no build step)
- Deployed on Vercel/Netlify/GitHub Pages
- Ready for LLM API integration (OpenAI, Anthropic, etc.)

## Project Structure
```
├── index.html      # Main HTML structure
├── styles.css      # Styling with CSS custom properties
├── app.js          # Frontend logic & mock AI analysis
└── README.md       # This file
```

## Local Development
```bash
# Serve locally (any static server)
npx serve .
# or
python -m http.server 8000
# or
php -S localhost:8000
```

## Deployment
### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Deploy from branch (main)

## Integrating Real AI
Replace the `generateMockAnalysis()` function in `app.js` with an API call:

```javascript
async function callAI(title, context, reasoning) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, context, reasoning })
  });
  return response.json();
}
```

## License
MIT