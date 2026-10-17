# AI Conversation Helper — Product Plan

## Product definition
A lightweight conversation-understanding and reply-coaching tool. A user pastes a message exchange or uploads a chat screenshot, adds context and a communication goal, then receives cautious wording observations, multiple plausible readings, and editable reply ideas.

## Problem
People can get stuck interpreting ambiguous messages or composing a response that is clear, kind, and true to their own intent. Generic message generators often jump straight to a reply without helping users separate literal evidence from assumptions.

## MVP audience
Everyday users who want help with awkward, unclear, tense, or important conversations. Initial use cases include friends, family, school/work messages, relationship communication, apologies, clarification, and respectful boundaries.

## Product principles
1. **No mind-reading claims.** Never assert that a person is attracted, lying, angry, manipulative, or disengaged based on a short message.
2. **Evidence before interpretation.** Separate observable wording cues from possible explanations.
3. **User agency.** Provide alternatives that the user can edit; never send messages automatically.
4. **Privacy first.** Current MVP runs text heuristics in the browser. Screenshot OCR is also run client-side after loading the OCR library. No user account or server storage is included.
5. **Honest AI label.** Current release is a rule-based prototype, not a connected generative AI system. Do not claim LLM-powered analysis until a backend integration is built and tested.

## Current MVP
- Paste conversation text or upload a PNG/JPG/WEBP screenshot.
- Extract text from screenshots using Tesseract.js loaded on demand.
- Choose relationship context, desired outcome, and reply style.
- Display text-pattern cues, cautious interpretations, and three response templates.
- Edit and copy a response; start a fresh analysis.
- Responsive layout for mobile and desktop.

## Architecture
- Static frontend: HTML, CSS, vanilla JavaScript.
- OCR: Tesseract.js CDN, loaded only for screenshot analysis.
- Analysis: transparent local heuristics.
- No API keys, authentication, database, or backend in this stage.

## Next release: real AI integration
- Add a small backend API to call a language model without exposing provider keys.
- Send only the user-submitted excerpt and selected context; state clearly what leaves the browser.
- Ask the model for structured output: observed cues, alternative interpretations, uncertainty, and three replies matching the selected goal/tone.
- Validate model output, escape rendered text, enforce request limits, provide graceful errors, and avoid saving chat content by default.
- Keep a rule-based fallback and mark which mode generated results.
- Add tests and usability checks before promoting the app as production-ready.

## Acceptance criteria
- A user can complete a text-based analysis without a login.
- Screenshot OCR failures show a useful error and leave paste-text available.
- Results never display fabricated confidence percentages or fake response-time metrics.
- Reply options respond to goal and tone settings and remain editable.
- Keyboard interaction and small-screen layout remain usable.
- README clearly states current capabilities, limitations, privacy behaviour, and setup.

## Non-goals for MVP
- Inferring hidden feelings or personality.
- Facial, body-language, or vocal analysis.
- Automatically sending messages or connecting to messaging accounts.
- Persistent storage of private conversations.
