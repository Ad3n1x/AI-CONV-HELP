# AI Conversation Helper

A responsive conversation-understanding and reply-coaching app by AD3N1X. The goal is not to “read minds”; it is to help users separate the words on screen from assumptions, consider alternatives, and choose a thoughtful reply.

## Features
- Paste a chat excerpt or upload a PNG, JPG, or WEBP screenshot.
- Extract screenshot text in the browser with Tesseract.js.
- Choose relationship context, communication goal, and reply style.
- Review wording cues and cautious alternative interpretations.
- Generate three editable reply suggestions and copy the one you choose.
- Use local, rule-based analysis without an AI key, or opt into server-side AI analysis when deployed with a configured provider key.

## AI mode and privacy
AI mode is **optional** and requires the user to check the consent box. When enabled on a deployment with the API configured, the conversation excerpt and selected context are sent to the configured AI provider for processing. Remove names, phone numbers, and sensitive details when they are not necessary.

The app does not create accounts, automatically send messages, or save conversation text to its own database. The API does not intentionally log or persist message content. The AI provider processes the request under its own service terms and data policies; review those policies before using the app with sensitive content. Uncheck the consent box to use the local heuristic mode only.

Text-only cues cannot prove someone's feelings, attraction, honesty, personality, or intent. Treat interpretations as possibilities, not facts. Respect explicit boundaries and use direct, respectful communication when appropriate.

## Deploy on Vercel
1. Import `Ad3n1x/AI-CONV-HELP` into a Vercel project.
2. In **Project Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` — your server-side provider API key.
   - `OPENAI_MODEL` — optional; defaults to `gpt-4o-mini`.
3. Redeploy after setting the environment variables.
4. Open the deployed app, enable **Use AI analysis when available**, and test with non-sensitive sample text.

**Never put the provider key in `app.js`, `index.html`, or any client-side environment variable.** The key belongs only in the deployment's server-side environment. API usage may incur charges. Set provider spending limits and monitor usage.

The endpoint includes input validation, a 20,000-character cap, a timeout, output-shape validation, and best-effort in-memory throttling. Serverless in-memory throttling is not a complete abuse-prevention system; configure stronger platform-level rate limits before promoting this as a high-traffic public service.

## Run locally
Open `index.html` in a modern browser or serve the folder with a static development server. Without a deployed `/api/analyze` endpoint, the app can still demonstrate its local analysis mode. Screenshot OCR loads Tesseract.js from a CDN on first use, so an internet connection is needed to download that library.

## Project files
- `index.html` — interface and consent notice
- `styles.css` — responsive design
- `app.js` — local analysis, OCR, optional API request, and reply editing
- `api/analyze.js` — server-side AI endpoint
- `vercel.json` — serverless function configuration
- `.env.example` — names of required environment variables (no secrets)
- `PROJECT_PLAN.md` — product scope and roadmap
- `TODO.md` — implementation checklist
