# Cuewise — Implementation Checklist

## Delivered in this branch
- [x] Responsive conversation-coaching interface
- [x] Paste text and upload screenshot with browser-side OCR
- [x] Transparent local heuristic mode remains available
- [x] Optional server-side AI analysis endpoint using an environment-provided API key
- [x] Explicit consent checkbox before sending text to the AI endpoint
- [x] Server-side validation for request fields and 20,000-character maximum
- [x] Timeout and useful provider error responses
- [x] Validate and sanitize the shape/length of model output before returning it
- [x] Basic per-instance request throttling
- [x] Keep the provider key out of client-side files
- [x] Document Vercel environment-variable setup and privacy limitations
- [x] Editable replies, copy-to-clipboard, and local fallback when no API route exists

## Required before a public launch
- [ ] Verify the current Vercel production deployment and configure at least one server-side provider key (Gemini is the documented default)
- [ ] Verify a real production AI request with a non-sensitive sample; this has not yet been independently confirmed
- [ ] Add platform-level rate limiting / abuse protection; in-memory serverless throttling is only best-effort
- [ ] Set AI provider usage/spending limits and monitor costs
- [ ] Test mobile browsers, keyboard navigation, and screen readers
- [ ] Add automated tests for request validation, output validation, refusal/boundary cases, and errors
- [ ] Conduct opt-in usability testing to see whether the suggestions genuinely help
- [ ] Review provider terms and data handling before allowing sensitive conversation content

## Known limitations
- Text cannot reliably reveal hidden feelings, attraction, honesty, personality, or intent.
- Local mode is rule-based and may miss sarcasm, slang, context, and language variation.
- OCR quality depends on screenshot clarity and language.
- AI output can be wrong; users should review and edit replies before using them.
- The API route is not active on GitHub Pages; AI mode requires the `/api/analyze` endpoint to be deployed on a serverless host such as Vercel. The live frontend URL alone does not prove that AI mode is configured.
