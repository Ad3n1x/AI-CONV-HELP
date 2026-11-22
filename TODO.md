# Cuewise — Implementation Checklist

## Implemented in the current repository

- [x] Responsive conversation-coaching interface.
- [x] Paste conversation text and upload PNG/JPG/WEBP screenshots.
- [x] Browser-side screenshot OCR with Tesseract.js.
- [x] Local rule-based analysis remains available without an API key.
- [x] Optional server-side AI analysis with explicit consent.
- [x] Configurable Gemini, Groq, OpenRouter and OpenAI provider order.
- [x] Provider fallback when a configured provider fails.
- [x] Server-side input validation and a 20,000-character limit.
- [x] Provider request timeout and bounded output validation.
- [x] Editable reply suggestions and copy action.
- [x] Provider credentials are read from server-side environment variables.
- [x] Product safety rules prohibit mind-reading claims, coercion and boundary evasion.

## Still required before broad public promotion

- [ ] Verify a real production AI request using a non-sensitive sample.
- [ ] Confirm the actual Vercel production project, deployment and serverless route.
- [ ] Add durable/platform-level rate limiting; the current in-memory limit is per serverless instance.
- [ ] Configure and verify provider usage/spending limits.
- [ ] Add automated tests for method validation, missing configuration, provider failover, malformed output, timeout, oversized input and boundary cases.
- [ ] Test mobile browser layouts, keyboard-only operation and screen-reader accessibility.
- [ ] Conduct opt-in usability testing and improve suggestions based on actual usefulness.
- [ ] Review provider terms, data handling and user-facing consent text.

## Known limitations

- Text alone cannot reliably reveal hidden feelings, attraction, honesty, personality or intent.
- Local heuristics may miss sarcasm, slang, cultural context and language variation.
- OCR quality depends on screenshot clarity and language.
- AI output may be wrong and must remain editable and reviewable.
- The application does not store conversation content in its own database, but remote AI mode sends the submitted excerpt/context to the configured provider.
- Per-instance in-memory throttling is not sufficient abuse prevention for a high-traffic service.
- The live frontend URL does not independently prove that production AI configuration and the serverless endpoint are functioning.

## Completion rule

Do not mark production readiness complete until the live provider request, abuse controls, cost limits, accessibility checks and opt-in usability checks have evidence recorded.
