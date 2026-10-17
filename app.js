/* Cuewise — conversation coaching with transparent local analysis and optional server-side AI. */
(() => {
  const $ = (id) => document.getElementById(id);
  const state = { mode: "text", imageFile: null, extractedText: "", selectedReply: 0, replies: [] };
  const textInput = $("conversationText");
  const analyzeBtn = $("analyzeBtn");
  const toast = $("toast");

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  }
  function setMode(mode) {
    state.mode = mode;
    $("textTab").classList.toggle("active", mode === "text");
    $("imageTab").classList.toggle("active", mode === "image");
    $("textTab").setAttribute("aria-selected", String(mode === "text"));
    $("imageTab").setAttribute("aria-selected", String(mode === "image"));
    $("textPane").classList.toggle("hidden", mode !== "text");
    $("imagePane").classList.toggle("hidden", mode !== "image");
  }
  $("textTab").addEventListener("click", () => setMode("text"));
  $("imageTab").addEventListener("click", () => setMode("image"));
  textInput.addEventListener("input", () => { $("charCount").textContent = textInput.value.length.toLocaleString() + " characters"; });
  $("sampleBtn").addEventListener("click", () => {
    textInput.value = "You: Hey, are we still on for tomorrow?\nThem: I'll let you know.";
    $("charCount").textContent = textInput.value.length.toLocaleString() + " characters";
    $("relationship").value = "friend";
    $("goal").value = "clarify";
    $("context").value = "";
    setMode("text");
    textInput.focus();
    notify("Sample conversation added. Edit it or analyse it as-is.");
  });
  $("dropzone").addEventListener("dragover", (e) => { e.preventDefault(); $("dropzone").classList.add("dragover"); });
  $("dropzone").addEventListener("dragleave", () => $("dropzone").classList.remove("dragover"));
  $("dropzone").addEventListener("drop", (e) => {
    e.preventDefault(); $("dropzone").classList.remove("dragover");
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) useImage(file);
  });
  $("screenshotInput").addEventListener("change", (e) => { if (e.target.files[0]) useImage(e.target.files[0]); });
  $("removeImageBtn").addEventListener("click", clearImage);

  function useImage(file) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { notify("Choose a PNG, JPG or WEBP image."); return; }
    if (file.size > 12 * 1024 * 1024) { notify("Please choose an image under 12 MB."); return; }
    state.imageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      $("imagePreview").src = reader.result;
      $("imagePreviewWrap").classList.remove("hidden");
      $("dropzone").classList.add("hidden");
      $("ocrStatus").textContent = "Screenshot selected. Text extraction begins when you analyse.";
    };
    reader.readAsDataURL(file);
  }
  function clearImage() {
    state.imageFile = null; $("screenshotInput").value = ""; $("imagePreview").removeAttribute("src");
    $("imagePreviewWrap").classList.add("hidden"); $("dropzone").classList.remove("hidden");
    $("ocrStatus").textContent = "Text extraction uses an OCR library loaded when needed. The first load may require internet access.";
  }
  async function extractText(file) {
    $("ocrStatus").textContent = "Loading text recognition… the first run may take a moment.";
    if (!window.Tesseract) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
        script.onload = resolve; script.onerror = () => reject(new Error("Could not load text recognition. Check your connection and try again."));
        document.head.appendChild(script);
      });
    }
    const result = await window.Tesseract.recognize(file, "eng", { logger: (m) => {
      if (m.status === "recognizing text") $("ocrStatus").textContent = "Reading screenshot… " + Math.round((m.progress || 0) * 100) + "%";
    }});
    $("ocrStatus").textContent = "Text extracted in your browser. Check the extracted text before relying on the analysis.";
    return (result.data.text || "").trim();
  }

  function cleanLines(text) {
    return text.split(/\n+/).map(s => s.replace(/^\s*(you|them|me|her|him|they|sender|recipient)\s*:\s*/i, "").trim()).filter(Boolean);
  }
  function analyze(text) {
    const lower = text.toLowerCase();
    const words = lower.match(/[a-z']+/g) || [];
    const lines = cleanLines(text);
    const questionCount = (text.match(/\?/g) || []).length;
    const exclamations = (text.match(/!/g) || []).length;
    const shortLines = lines.filter(line => line.split(/\s+/).length <= 4).length;
    const cues = [];
    const positives = ["thanks", "thank you", "great", "glad", "love", "excited", "awesome", "sounds good", "haha", "lol", "😊", "❤️", "😂"];
    const tension = ["angry", "upset", "disappointed", "hurt", "annoyed", "whatever", "fine.", "leave me alone", "don't care", "not okay", "sorry"];
    const uncertainty = ["maybe", "i guess", "not sure", "we'll see", "i don't know", "idk", "later", "i'll let you know"];
    const boundary = ["stop", "please don't", "need space", "not comfortable", "no thanks", "leave me alone"];
    const countPhrases = (phrases) => phrases.reduce((n, phrase) => n + (lower.includes(phrase) ? 1 : 0), 0);
    const positive = countPhrases(positives), tense = countPhrases(tension), unsure = countPhrases(uncertainty), boundaries = countPhrases(boundary);
    if (questionCount) cues.push(["Questions", questionCount + (questionCount === 1 ? " question" : " questions")]);
    if (positive) cues.push(["Positive wording", "Present"]);
    if (tense) cues.push(["Tension-related wording", "Present"]);
    if (unsure) cues.push(["Uncertainty", "Possible"]);
    if (shortLines >= Math.max(2, Math.ceil(lines.length * .6))) cues.push(["Message style", "Mostly brief"]);
    if (!cues.length) cues.push(["Text pattern", "Not enough clear signals"]);
    const relationship = $("relationship").value;
    const goal = $("goal").value;
    const context = $("context").value.trim();
    let summaryTitle = "The wording leaves room for interpretation";
    let summaryText = "There isn't enough in the text alone to know exactly what the other person intended. Focus on the literal message, the wider context, and what you want to communicate next.";
    if (boundaries) {
      summaryTitle = "A boundary or clear preference may be present";
      summaryText = "Some wording may communicate a limit or preference. The safest response is to take it seriously, avoid pressuring the other person, and ask for clarification only if it is appropriate.";
    } else if (tense > positive) {
      summaryTitle = "There may be tension to address";
      summaryText = "Some wording can be read as frustration or discomfort, but text strips away voice and context. A calm response that acknowledges the concern is usually more useful than arguing over tone.";
    } else if (positive > tense && positive > 0) {
      summaryTitle = "There are some positive wording cues";
      summaryText = "The text includes friendly or appreciative language. That can suggest warmth in this exchange, but it doesn't prove a deeper feeling or guarantee what happens next.";
    } else if (unsure > 0) {
      summaryTitle = "The message sounds noncommittal";
      summaryText = "Phrases like these leave the outcome open. Rather than treating them as a definite yes or no, you can give space or ask a simple, low-pressure clarifying question.";
    } else if (questionCount >= 2) {
      summaryTitle = "The exchange invites a response";
      summaryText = "There are several questions in the text. Answering the main point clearly—and asking one relevant question back if you want to continue—can keep the exchange easy to follow.";
    } else if (lines.length <= 2 || words.length < 18) {
      summaryTitle = "This is a short exchange";
      summaryText = "Short messages carry limited context. Brevity can mean many things, including convenience, distraction, or a naturally concise texting style; it isn't enough to infer interest or mood.";
    }
    const interpretations = [];
    if (boundaries) {
      interpretations.push(["Take the words at face value", "They may be communicating a real limit. Respect it rather than trying to decode a hidden meaning."]);
      interpretations.push(["Context could add nuance", "If the situation is unclear, consider whether a calm clarification is welcome—without pushing for a different answer."]);
    } else if (tense > positive) {
      interpretations.push(["They may be upset about something specific", "Address the actual issue mentioned rather than assuming you know everything they feel."]);
      interpretations.push(["Tone may be missing from the text", "A short or blunt message can read harsher in writing than intended. Avoid escalating based on punctuation alone."]);
      interpretations.push(["They may need time", "A brief, respectful reply and a little space can be better than sending multiple follow-ups."]);
    } else if (unsure) {
      interpretations.push(["They may genuinely not know yet", "The decision or plan might still be unsettled."]);
      interpretations.push(["They may be keeping options open", "The message doesn't commit either way. You can make your own plans rather than waiting indefinitely."]);
      interpretations.push(["There may be context you're missing", "A practical follow-up can clarify the next step without demanding an explanation."]);
    } else {
      interpretations.push(["Read the literal meaning first", "Start with what the message explicitly says before building a story around it."]);
      interpretations.push(["Consider an ordinary explanation", "Timing, distraction, personality, and texting habits can affect how someone writes."]);
      interpretations.push(["Check against the wider pattern", "One message is weak evidence. Repeated behaviour and direct communication provide more context."]);
    }
    if (context) interpretations.push(["Your added context matters", "You noted: “" + context + "”. Use that as context, not as proof of the other person's private thoughts."]);
    return { lines, words, questionCount, exclamations, cues, summaryTitle, summaryText, interpretations: interpretations.slice(0, 4), relationship, goal, lower };
  }

  function makeReplies(data) {
    const goal = data.goal, tone = $("tone").value, relationship = data.relationship;
    const latest = data.lines[data.lines.length - 1] || "";
    const isWork = relationship === "work";
    const direct = {
      continue: ["What’s been the best part of your day so far?", "I get you. Tell me a little more when you feel like it.", "That makes sense. I’m listening—go on."],
      clarify: ["Just so I understand properly, what did you mean by that?", "I might be reading this wrong—could you clarify what you meant?", "No pressure, I just want to make sure I understood you correctly."],
      support: ["That sounds like a lot to deal with. I’m here if you want to talk about it.", "I hear you. You don’t have to figure everything out at once.", "Thanks for telling me. What would feel helpful right now?"],
      boundary: ["I understand your point, but I’m not comfortable with that. I’d rather we do things differently.", "I want us to be able to talk about this, while still respecting each other’s boundaries.", "That doesn’t work for me, but I’m happy to discuss another option."],
      apologize: ["I’ve thought about what happened, and I’m sorry for my part in it. I’ll try to handle it better.", "I can see how that came across. I’m sorry—I didn’t want to make things harder.", "You have a point. I should have handled that differently, and I’m sorry."],
      direct: ["To be clear, this is what I mean: [say your point]. What do you think?", "I’d rather be straightforward than guess. Can we talk about it honestly?", "Here’s where I stand: [your position]. I’m open to hearing your side too."],
      end: ["Thanks for talking this through with me. I’ll leave it here for now—take care.", "I understand. I’ll give you some space. Wishing you well.", "No worries. Thanks for being clear with me."]
    };
    let options = [...(direct[goal] || direct.continue)];
    if (isWork) options = options.map(s => s.replace("What’s been the best part of your day so far?", "Could you share a little more detail when you have a moment?").replace("I’m here if you want to talk about it.", "I’m available if it would help to talk through next steps."));
    if (tone === "brief") options = options.map(s => s.split(/[.!?]/)[0] + ".");
    if (tone === "formal") options = options.map(s => s.replace("I get you.", "I understand.").replace("No worries.", "Understood.").replace("I’m here if you want to talk about it.", "I’m available if you would like to discuss it."));
    if (tone === "playful" && goal === "continue") options = ["Okay, now I need the extended version 😄", "You can’t leave me with that tiny update 😂", "Alright, I’m listening—carry on 👀"];
    if (tone === "warm") options = options.map(s => s.replace("I understand.", "I understand, and I appreciate you telling me."));
    if (tone === "confident" && goal === "clarify") options = ["I want to understand you correctly. What did you mean?", "I’d rather ask than assume—can you clarify?", "I’m open to hearing what you meant, so let’s be direct."];
    if (latest && /thank you|thanks/i.test(latest) && goal === "continue") options = ["You’re welcome 😊", "Anytime. Hope things are going okay.", "Of course—happy to help."];
    if (latest && /sorry/i.test(latest) && goal === "continue") options = ["Thanks for saying that. I appreciate it.", "I hear you. Let's try to move forward from here.", "Thanks for apologising. I’d like us to understand each other better."];
    if (latest && /busy|later|not sure|i'll let you know|we'll see/i.test(latest.toLowerCase()) && goal === "continue") options = ["No worries, let me know when you have a clearer idea.", "All good—take your time.", "Okay, I’ll make other plans for now. Just let me know if things change."];
    return options.map((text, i) => ({ title: ["Low-pressure", "Open and clear", "A different angle"][i], text }));
  }

  function render(data) {
    $("emptyState").classList.add("hidden"); $("results").classList.remove("hidden");
    $("resultState").textContent = data.mode === "ai" ? "AI ANALYSIS READY" : "LOCAL ANALYSIS READY";
    $("summaryTitle").textContent = data.summaryTitle; $("summaryText").textContent = data.summaryText;
    $("signalRow").innerHTML = data.cues.map(([label, value]) => '<span class="signal-chip"><strong>' + escapeHTML(label) + ':</strong> ' + escapeHTML(value) + '</span>').join("");
    $("interpretations").innerHTML = data.interpretations.map((item, i) => '<div class="interpretation"><span class="interpretation-icon">' + (i + 1) + '</span><div><strong>' + escapeHTML(item[0]) + '</strong><p>' + escapeHTML(item[1]) + '</p></div></div>').join("");
    state.replies = Array.isArray(data.replies) && data.replies.length === 3 ? data.replies : makeReplies(data); state.selectedReply = 0;
    $("replyOptions").innerHTML = state.replies.map((reply, i) => '<div class="reply-option ' + (i === 0 ? "selected" : "") + '" role="button" tabindex="0" data-index="' + i + '"><div class="reply-option-head"><strong>' + escapeHTML(reply.title) + '</strong><span>' + (i === 0 ? "RECOMMENDED START" : "OPTION " + (i + 1)) + '</span></div><p>' + escapeHTML(reply.text) + '</p></div>').join("");
    $("editedReply").value = state.replies[0].text;
    $("replyOptions").querySelectorAll(".reply-option").forEach((el) => {
      const select = () => selectReply(Number(el.dataset.index));
      el.addEventListener("click", select);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } });
    });
    $("replyStatus").textContent = "Edit freely before copying.";
  }
  function selectReply(index) {
    state.selectedReply = index;
    $("replyOptions").querySelectorAll(".reply-option").forEach((el, i) => el.classList.toggle("selected", i === index));
    $("editedReply").value = state.replies[index].text;
    $("replyStatus").textContent = "Reply option selected. Edit it if you like.";
  }

  async function requestAI(text) {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        context: $("context").value.trim(),
        relationship: $("relationship").value,
        goal: $("goal").value,
        tone: $("tone").value
      })
    });
    let payload = {};
    try { payload = await response.json(); } catch {}
    if (response.status === 404 || response.status === 405) return null;
    if (!response.ok) throw new Error(payload.error || "AI analysis failed. Please try again.");
    if (payload.mode !== "ai" || !Array.isArray(payload.replies)) throw new Error("The AI service returned an unexpected response.");
    return payload;
  }

  function showExtractedText(text) {
    $("extractedTextScreen").classList.remove("hidden");
    $("extractedTextEditor").value = text;
    $("extractedCharCount").textContent = text.length.toLocaleString() + " characters extracted";
    document.body.classList.add("screen-open");
    $("extractedTextEditor").focus();
  }
  function closeExtractedTextScreen() {
    $("extractedTextScreen").classList.add("hidden");
    document.body.classList.remove("screen-open");
  }
  $("backToScreenshotBtn").addEventListener("click", closeExtractedTextScreen);
  $("extractedTextEditor").addEventListener("input", () => {
    $("extractedCharCount").textContent = $("extractedTextEditor").value.length.toLocaleString() + " characters";
  });
  $("copyExtractedTextBtn").addEventListener("click", async () => {
    const text = $("extractedTextEditor").value;
    try {
      await navigator.clipboard.writeText(text);
      notify("Extracted text copied.");
    } catch {
      $("extractedTextEditor").focus();
      $("extractedTextEditor").select();
      notify("Text selected. Copy it manually.");
    }
  });
  $("continueWithExtractedTextBtn").addEventListener("click", () => {
    const text = $("extractedTextEditor").value.trim();
    if (!text) { notify("Add or extract some text first."); return; }
    textInput.value = text;
    $("charCount").textContent = text.length.toLocaleString() + " characters";
    setMode("text");
    closeExtractedTextScreen();
    analyzeBtn.click();
  });

  analyzeBtn.addEventListener("click", async () => {
    analyzeBtn.disabled = true; analyzeBtn.querySelector("span").textContent = "Working…";
    try {
      let text = textInput.value.trim();
      if (state.mode === "image") {
        if (!state.imageFile) { notify("Choose a screenshot first."); return; }
        text = await extractText(state.imageFile);
        if (!text) { notify("No readable text found. Try a clearer screenshot or paste the text."); return; }
        showExtractedText(text);
        return;
      }
      if (!text) { notify("Paste a conversation or upload a screenshot first."); textInput.focus(); return; }
      if (text.length > 20000) { notify("Please analyse a shorter excerpt (under 20,000 characters)."); return; }
      let result;
      if ($("aiConsent").checked) {
        try {
          result = await requestAI(text);
          if (!result) {
            result = analyze(text);
            notify("AI endpoint not found here; showing local analysis instead.");
          }
        } catch (error) {
          console.error(error);
          notify(error.message || "AI analysis failed. Please try again.");
          return;
        }
      } else {
        result = analyze(text);
      }
      render(result);
      $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error(error); notify(error.message || "Something went wrong while reading the screenshot.");
      $("ocrStatus").textContent = error.message || "Text extraction failed. Try again or paste the text instead.";
    } finally {
      analyzeBtn.disabled = false; analyzeBtn.querySelector("span").textContent = "Analyse conversation";
    }
  });
  $("copyReplyBtn").addEventListener("click", async () => {
    const reply = $("editedReply").value.trim();
    if (!reply) { notify("Write or select a reply first."); return; }
    try {
      await navigator.clipboard.writeText(reply);
      $("replyStatus").textContent = "Copied. Your reply is ready to paste.";
      notify("Reply copied to clipboard.");
    } catch {
      $("editedReply").focus(); $("editedReply").select();
      notify("Clipboard access was blocked. The reply is selected—copy it manually.");
    }
  });
  $("clearBtn").addEventListener("click", () => {
    textInput.value = ""; $("charCount").textContent = "0 characters"; clearImage(); setMode("text");
    $("results").classList.add("hidden"); $("emptyState").classList.remove("hidden"); $("resultState").textContent = "WAITING FOR TEXT";
    $("context").value = ""; $("relationship").value = "friend"; $("goal").value = "continue"; $("tone").value = "natural"; $("aiConsent").checked = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();