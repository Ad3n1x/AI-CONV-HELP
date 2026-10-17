# AI Conversation Helper — Product Plan

## Product definition
A lightweight conversation-understanding and reply-coaching tool. Users paste a message exchange or upload a screenshot, choose context and a communication goal, then receive grounded wording observations, multiple plausible readings, and editable reply ideas.

## Problem
People can get stuck interpreting ambiguous messages or composing a response that is clear, kind, and true to their own intent. Many generators jump straight to a reply without helping users separate literal evidence from assumptions.

## Product principles
1. **No mind-reading claims.** Never assert that a person is attracted, lying, manipulative, or disengaged based on a short message.
2. **Evidence before interpretation.** Separate observable wording from possible explanations.
3. **User agency.** Provide alternatives users can edit; never send messages automatically.
4. **Privacy by choice.** Local heuristic mode does not send text to the app's API. AI mode is opt-in and sends the excerpt/context to the configured provider.
5. **Honest AI label.** Show whether results came from local heuristics or the AI endpoint.
6. **No retention by default.** The app does not store conversation content in a database or intentionally log request content.

## Current implementation
- Responsive static frontend in HTML, CSS, and vanilla JavaScript.
- Browser-side OCR with Tesseract.js for PNG/JPG/WEBP.
- Local heuristic analysis and reply templates.
- Optional serverless endpoint at `/api/analyze`.
- Server-side OpenAI-compatible Chat Completions request, configured with `OPENAI_API_KEY` and optional `OPENAI_MODEL`.
- Structured output validation, input size limits, timeout, error handling, and basic in-memory request throttling.
- Explicit checkbox consent before remote analysis.
- No user account, database, or automatic message sending.

## Deployment
Deploy the repository to Vercel and add `OPENAI_API_KEY` under Project Settings → Environment Variables. Optionally set `OPENAI_MODEL`; the default is `gpt-4o-mini`. Never expose the key in frontend code. Configure provider usage limits and stronger platform-level abuse controls before public promotion.

## Privacy and safety notes
- Remove names and sensitive details when they are not necessary.
- The app does not save chat content, but remote AI mode sends the excerpt to the configured AI provider, whose own terms and data policies apply.
- In-memory throttling is best-effort only in serverless environments; it is not a substitute for platform-level rate limiting.
- Interpretations are possibilities, not facts. Explicit boundaries should be respected.
- AI suggestions can be wrong and should be reviewed before use.

## Next steps
1. Deploy and configure the server-side key.
2. Verify live AI mode with non-sensitive examples and test failure paths.
3. Add automated tests and stronger abuse controls.
4. Run opt-in usability testing and refine suggestions based on actual usefulness.
5. Only then promote the app as a public AI-powered product.
