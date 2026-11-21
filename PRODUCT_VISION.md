# Cuewise — Product Vision

**Product direction:** A privacy-conscious conversation reflection and reply-coaching tool.

## Founding problem

People can struggle to interpret ambiguous messages or compose a reply that is clear, respectful and true to their own intention. Many response generators jump directly to a suggested message without separating the words on the screen from assumptions about the sender.

## Core promise

Help a user understand what a conversation literally communicates, consider more than one plausible interpretation, clarify their own communication goal and prepare a thoughtful response they can edit.

## Required workflow

1. Accept pasted conversation text or a supported screenshot.
2. Extract screenshot text locally in the browser where possible and let the user inspect/correct it.
3. Ask for only the context needed to interpret the wording and the user's communication goal.
4. Separate observable wording cues from interpretations.
5. Present multiple plausible readings with explicit uncertainty; never claim certainty about hidden feelings, honesty, personality or intent.
6. Offer distinct, editable replies that match the user's stated communication goal and tone.
7. Let the user decide whether to copy or use a reply. Never send a message automatically.

## Non-negotiable principles

- No mind-reading, diagnosis or personality labelling.
- Evidence before interpretation; quote or identify the actual wording cue that led to an observation.
- No coercion, manipulation, harassment, repeated unwanted contact or advice to evade a stated boundary.
- A request for space or a clear no must be respected.
- Local analysis must remain available without transmitting conversation content.
- Remote AI is optional and requires explicit consent immediately before the content is sent.
- Be clear that the configured AI provider receives the submitted excerpt and context under that provider's terms.
- Do not retain conversation text in an application database or intentionally place it in logs.
- Never imply that provider-side processing is the same as local-only processing.
- Keep suggested messages editable and preserve the user's agency.

## Current implementation baseline

The current `main` branch provides a responsive browser interface, PNG/JPG/WEBP screenshot input with browser-side OCR, local heuristic analysis and optional server-side AI analysis. The API supports Gemini, Groq, OpenRouter and OpenAI through a configurable provider order, validates input and output, applies timeouts and a per-instance in-memory request limit, and returns three editable reply candidates.

The existing README describes the multi-provider implementation accurately. The older `PROJECT_PLAN.md` and `TODO.md` are stale: they still describe the earlier OpenAI-only API. This documentation correction aligns them with the current code; it does not claim that a real production AI request, provider quota, abuse-control setup or usability study has been independently verified.

## Acceptance criteria

- Local analysis works with no API key and does not call the remote endpoint.
- Remote analysis is off by default and cannot run without an explicit user action/consent.
- Provider selection and fallback are visible and failures do not silently fabricate a successful AI result.
- Input length, request timeout and output shape are enforced server-side.
- Outputs contain grounded wording observations, multiple cautious interpretations and exactly three editable reply suggestions.
- Boundary-respecting tests cover explicit requests for space, no-contact boundaries and manipulative/coercive requests.
- Sensitive conversation content is not intentionally stored in the app database or written to request logs.
- Rate limiting suitable for the deployment platform, provider spend limits and operational monitoring are configured before broad public promotion.
- Mobile, keyboard and screen-reader workflows are reviewed.

## Change-control rule

Cuewise is a reflection and writing aid, not a tool for controlling another person. New features must improve clarity, user agency, privacy or response quality without pretending that a short text exchange proves someone's inner state.
