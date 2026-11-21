# Cuewise — Product Plan

## Product definition

Cuewise is a conversation-reflection and reply-coaching tool. A user can paste a conversation or upload a screenshot, choose relevant context and a communication goal, then receive observable wording cues, multiple plausible interpretations and editable reply suggestions.

The product helps a user think through a conversation. It does not establish what another person secretly feels, believes or intends.

## Problem

People can struggle to interpret ambiguous messages or compose a reply that is clear, respectful and faithful to their own intention. Many generators skip the reasoning step and turn a short message into an overconfident conclusion.

## Product principles

1. **No mind-reading claims.** Never assert attraction, dishonesty, manipulation, diagnosis, personality or hidden intent from a short message.
2. **Evidence before interpretation.** Separate the literal wording from possible explanations and show which wording cues support an observation.
3. **Uncertainty is explicit.** Offer alternatives rather than a definitive verdict; do not assign fabricated probabilities.
4. **User agency.** Replies are editable suggestions. The app never sends a message automatically.
5. **Respect boundaries.** Never recommend coercion, harassment, repeated unwanted contact or evading a stated boundary.
6. **Privacy by choice.** Local heuristic mode stays in the browser. Remote AI mode is optional and requires explicit user consent.
7. **Honest provider disclosure.** Identify whether results came from local rules or a remote provider. Remote mode sends the submitted excerpt and selected context to the configured AI provider under that provider's terms.
8. **No application retention by default.** Do not store conversation content in an application database or intentionally place it in request logs.

## Current implementation

- Responsive static frontend in HTML, CSS and vanilla JavaScript.
- Paste text or upload PNG/JPG/WEBP screenshots.
- Browser-side OCR through Tesseract.js.
- Local heuristic analysis and reply templates.
- Optional serverless `/api/analyze` endpoint.
- Configurable server-side provider order: Gemini, Groq, OpenRouter and OpenAI.
- Provider failover when a configured provider fails.
- Input limits, request timeouts, response-shape validation and best-effort per-instance throttling.
- Explicit consent before remote analysis.
- Three editable reply suggestions and local fallback when remote AI is unavailable.

## Provider configuration

- Gemini: `GEMINI_API_KEY`, optional `GEMINI_MODEL`.
- Groq: `GROQ_API_KEY`, optional `GROQ_MODEL`.
- OpenRouter: `OPENROUTER_API_KEY`, optional `OPENROUTER_MODEL`.
- OpenAI: `OPENAI_API_KEY`, optional `OPENAI_MODEL`.
- `AI_PROVIDERS` controls the order, for example `gemini,groq,openrouter,openai`.

Keep all credentials in server-side Vercel environment settings. Never put provider keys in browser code, public build variables, commits or chat messages. Model names, availability, quotas and provider terms can change; verify them in the provider dashboard before relying on them.

## Reliability and privacy boundaries

The current in-memory request limiter is per running serverless instance and is not a complete distributed abuse-control system. Configure platform-level rate limits and provider spending limits before broad promotion. A provider's API acceptance is not proof that an analysis is accurate or useful. AI mode sends submitted text to that provider; users should remove names and unnecessary sensitive details.

## Release gates

- [ ] Confirm the intended Vercel production project and current deployment.
- [ ] Run an authenticated-by-consent, non-sensitive production sample through a configured provider and record the result.
- [ ] Verify provider failure and fallback behavior in automated tests.
- [ ] Add platform-level abuse protection and provider spend limits.
- [ ] Test invalid, empty and oversized input; malformed provider output; timeout; rate limit; and provider outage.
- [ ] Test boundary-respecting output for explicit requests for space or no contact.
- [ ] Test mobile browsers, keyboard navigation and screen readers.
- [ ] Run opt-in usability checks to establish whether users find the alternatives and replies genuinely useful.
- [ ] Review provider data terms and the privacy notice before encouraging users to submit sensitive conversations.

## Deployment

Deploy the static frontend and `/api/analyze` serverless endpoint to Vercel. Configure provider keys only in server-side environment settings. A live frontend URL by itself does not prove that the serverless route or a provider is configured and working.

## Product change rule

New capabilities must improve clarity, user agency, privacy or reply quality. Do not add emotion detection, automatic message sending, relationship verdicts or features that encourage boundary violations.
