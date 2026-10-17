# Cuewise — by AD3N1X

Cuewise is a responsive conversation-understanding and reply-coaching app created by AD3N1X. It helps users separate what a message literally says from assumptions, consider alternatives, and choose a thoughtful reply—not “read minds.”

## Features
- Paste a chat excerpt or upload a PNG, JPG, or WEBP screenshot.
- Extract screenshot text in the browser with Tesseract.js.
- Choose relationship context, communication goal, and reply style.
- Review wording cues and cautious alternative interpretations.
- Generate three editable reply suggestions.
- Use local rule-based analysis without an API key, or opt into server-side AI.

## Multi-provider AI
The server supports Gemini API, Groq, OpenRouter, and OpenAI. It tries providers in the order set in `AI_PROVIDERS`, skipping any provider without a configured key and moving to the next if a request fails.

**Recommended free-first setup:** start with Gemini from Google AI Studio, then optionally configure Groq and/or OpenRouter as fallback providers. Free quotas, model access, and free-model availability can change; verify current limits and terms in each provider dashboard. Free access is not unlimited.

### Configure on Vercel
1. Open your project **Settings → Environment Variables**.
2. Add `GEMINI_API_KEY` using a key created in Google AI Studio.
3. Keep `AI_PROVIDERS=gemini,groq,openrouter,openai` or change the order.
4. Optionally add `GROQ_API_KEY` and/or `OPENROUTER_API_KEY` for fallbacks. You do not need every provider.
5. Set a model override only if needed; see `.env.example`.
6. Redeploy after changing environment variables.
7. In the app, enable **Use AI-powered analysis** and test with non-sensitive sample text.

The default Gemini model is `gemini-3.6-flash` as currently listed in Google's model documentation. If unavailable for your account, set `GEMINI_MODEL` to a currently supported text model from the official Gemini API model list.

**Never put provider keys in `app.js`, `index.html`, or any client-side variable. Never share a key in chat or commit it to GitHub.** Keys belong only in server-side environment settings. A provider processes submitted conversation text under its own service terms and data policies; remove names and sensitive details when possible.

## Privacy and responsible use
AI mode is optional and requires explicit consent in the UI. When enabled, the conversation excerpt and selected context are sent to the configured provider. The app does not create accounts, automatically send messages, or save conversation text to its own database. Provider data terms apply. Text-only cues cannot prove someone's feelings, attraction, honesty, personality, or intent. Treat interpretations as possibilities, not facts, and respect boundaries.

## Reliability
The endpoint validates input, caps text at 20,000 characters, times out requests, validates output shape, and applies best-effort in-memory throttling. Serverless in-memory throttling is not complete abuse prevention; add stronger platform-level rate limits before promoting this as a high-traffic public service.

## Run locally
Open `index.html` in a modern browser or serve the folder with a static development server. Without a deployed `/api/analyze` endpoint, local analysis still works. Screenshot OCR downloads Tesseract.js from a CDN on first use.

## Project files
- `index.html` — interface and consent notice
- `styles.css` — responsive design
- `app.js` — local analysis, OCR, optional API request, and reply editing
- `api/analyze.js` — multi-provider AI endpoint
- `vercel.json` — serverless function configuration
- `.env.example` — environment variable names (no secrets)
- `PROJECT_PLAN.md` — product scope and roadmap
- `TODO.md` — implementation checklist
