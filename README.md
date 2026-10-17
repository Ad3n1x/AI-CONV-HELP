# AI Conversation Helper

A responsive conversation-understanding and reply-coaching prototype by AD3N1X.

## What it does
- Paste a chat excerpt or upload a PNG, JPG, or WEBP screenshot.
- Extract screenshot text in the browser with Tesseract.js.
- Choose relationship context, communication goal, and reply style.
- Review observable wording cues and several possible interpretations.
- Generate three editable reply templates and copy the one you choose.

## Important: current implementation
This is an **early, browser-only MVP**. The current analysis is based on simple text heuristics and reply templates. It is **not connected to a generative AI model**, and it cannot reliably determine a person's feelings, attraction, honesty, personality, or intent. Do not treat its suggestions as facts.

There is no account, no automatic message sending, and no backend storage in this version. Screenshot OCR loads Tesseract.js from a CDN when first used, so an internet connection is needed to download that library. The OCR step itself runs in the browser.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser, or serve the folder with a static development server.
3. Paste a conversation or upload a screenshot and select **Analyse conversation**.

## Privacy
Only paste content you are comfortable processing in your browser. Remove names, phone numbers, and other personal details when they are not needed. This build does not transmit conversation text to a custom backend.

## Roadmap
The next major milestone is an optional server-side language-model integration with clear consent, request limits, safe output rendering, error handling, and no conversation retention by default. Provider secrets must never be embedded in frontend JavaScript.

## Files
- `index.html` — app structure
- `styles.css` — responsive visual design
- `app.js` — local analysis, OCR workflow, and reply coaching
- `PROJECT_PLAN.md` — product scope and roadmap
- `TODO.md` — implementation checklist
