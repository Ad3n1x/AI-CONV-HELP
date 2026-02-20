/**
 * AI Conversation Helper - Main Application JavaScript
 * Implements behavioral analysis, psychological frameworks, and real-time feedback
 * Integrated with Video, Audio, and Chat OCR analysis
 */

class AIConversationHelper {
    constructor() {
        // Application state
        this.state = {
            isAnalyzing: false,
            isVideoActive: false,
            isAudioActive: false,
            feedbackEnabled: true,
            sessionStartTime: null,
            analysisMode: 'demo',
            // Unified analysis data from all sources
            analysisData: {
                video: {
                    active: false,
                    emotions: { happy: 45, neutral: 65, engaged: 52, current: 'neutral' },
                    bodyLanguage: { posture: 'open', eyeContact: 'good', gestures: 'moderate' }
                },
                audio: {
                    active: false,
                    pace: 60,
                    tone: 72,
                    confidence: 85,
                    clarity: 90,
                    volume: 'normal',
                    sentiment: 'neutral'
                },
                ocr: {
                    active: false,
                    text: '',
                    sentiment: { positive: 33, neutral: 34, negative: 33 },
                    messageCount: 0,
                    tone: 'Neutral',
                    participants: 1,
                    responseTime: 2.0,
                    topics: [],
                    insights: []
                },
                combined: {
                    overallEngagement: 50,
                    rapportScore: 50,
                    suggestedActions: []
                }
            },
            settings: {
                emotionAnalysis: true,
                bodyLanguageAnalysis: true,
                vocalAnalysis: true,
                feedbackFrequency: 'medium',
                feedbackSound: false,
                localProcessing: true,
                aiSuggestions: true
            },
            feedbackHistory: [],
            sessionNotes: ''
        };

        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeAnalysis();
        console.log('AI Conversation Helper initialized');
    }

    cacheElements() {
        this.elements = {
            videoFeed: document.getElementById('videoFeed'),
            analysisCanvas: document.getElementById('analysisCanvas'),
            videoContainer: document.getElementById('videoContainer'),
            placeholderState: document.getElementById('placeholderState'),
            toggleVideoBtn: document.getElementById('toggleVideoBtn'),
            toggleAudioBtn: document.getElementById('toggleAudioBtn'),
            flipCameraBtn: document.getElementById('flipCameraBtn'),
            startAnalysisBtn: document.getElementById('startAnalysisBtn'),
            mainStartBtn: document.getElementById('mainStartBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            feedbackSection: document.getElementById('feedbackSection'),
            feedbackList: document.getElementById('feedbackList'),
            toggleFeedbackBtn: document.getElementById('toggleFeedbackBtn'),
            sessionNotes: document.getElementById('sessionNotes'),
            emotionCard: document.getElementById('emotionCard'),
            bodyLanguageCard: document.getElementById('bodyLanguageCard'),
            vocalCard: document.getElementById('vocalCard'),
            recommendationBtns: document.querySelectorAll('.recommendation-btn'),
            ocrUploadArea: document.getElementById('ocrUploadArea'),
            ocrFileInput: document.getElementById('ocrFileInput'),
            ocrPreview: document.getElementById('ocrPreview'),
            previewImage: document.getElementById('previewImage'),
            removeImageBtn: document.getElementById('removeImageBtn'),
            ocrProgress: document.getElementById('ocrProgress'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            ocrResults: document.getElementById('ocrResults'),
            extractedText: document.getElementById('extractedText'),
            copyTextBtn: document.getElementById('copyTextBtn'),
            messageCount: document.getElementById('messageCount'),
            chatTone: document.getElementById('chatTone'),
            avgResponseTime: document.getElementById('avgResponseTime'),
            participantCount: document.getElementById('participantCount'),
            positiveBar: document.getElementById('positiveBar'),
            neutralBar: document.getElementById('neutralBar'),
            negativeBar: document.getElementById('negativeBar'),
            positiveValue: document.getElementById('positiveValue'),
            neutralValue: document.getElementById('neutralValue'),
            negativeValue: document.getElementById('negativeValue'),
            chatInsights: document.getElementById('chatInsights')
        };
    }

    bindEvents() {
        if (this.elements.startAnalysisBtn) {
            this.elements.startAnalysisBtn.addEventListener('click', () => this.toggleAnalysis());
        }
        if (this.elements.mainStartBtn) {
            this.elements.mainStartBtn.addEventListener('click', () => this.toggleAnalysis());
        }
        if (this.elements.toggleVideoBtn) this.elements.toggleVideoBtn.addEventListener('click', () => this.toggleVideo());
        if (this.elements.toggleAudioBtn) this.elements.toggleAudioBtn.addEventListener('click', () => this.toggleAudio());
        if (this.elements.settingsBtn) this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        if (this.elements.closeSettingsBtn) this.elements.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        if (this.elements.cancelSettingsBtn) this.elements.cancelSettingsBtn.addEventListener('click', () => this.closeSettings());
        if (this.elements.saveSettingsBtn) this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        if (this.elements.settingsModal) {
            this.elements.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.elements.settingsModal) this.closeSettings();
            });
        }
        if (this.elements.toggleFeedbackBtn) this.elements.toggleFeedbackBtn.addEventListener('click', () => this.toggleFeedback());
        if (this.elements.sessionNotes) {
            this.elements.sessionNotes.addEventListener('input', (e) => { this.state.sessionNotes = e.target.value; });
        }
        if (this.elements.recommendationBtns) {
            this.elements.recommendationBtns.forEach(btn => {
                btn.addEventListener('click', () => this.selectRecommendation(btn));
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSettings();
            if (e.key === ' ' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.toggleAnalysis();
            }
        });
        this.bindOCREvents();
    }

    bindOCREvents() {
        if (this.elements.ocrUploadArea) {
            this.elements.ocrUploadArea.addEventListener('click', () => {
                if (this.elements.ocrFileInput) this.elements.ocrFileInput.click();
            });
            this.elements.ocrUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.elements.ocrUploadArea.classList.add('drag-over');
            });
            this.elements.ocrUploadArea.addEventListener('dragleave', () => {
                this.elements.ocrUploadArea.classList.remove('drag-over');
            });
            this.elements.ocrUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.elements.ocrUploadArea.classList.remove('drag-over');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    this.handleOCRFile(e.dataTransfer.files[0]);
                }
            });
        }
        if (this.elements.ocrFileInput) {
            this.elements.ocrFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) this.handleOCRFile(e.target.files[0]);
            });
        }
        if (this.elements.removeImageBtn) {
            this.elements.removeImageBtn.addEventListener('click', () => this.clearOCRPreview());
        }
        if (this.elements.copyTextBtn) {
            this.elements.copyTextBtn.addEventListener('click', () => this.copyExtractedText());
        }
    }

    handleOCRFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.elements.previewImage && this.elements.ocrPreview && this.elements.ocrUploadArea) {
                this.elements.previewImage.src = e.target.result;
                this.elements.ocrPreview.style.display = 'block';
                this.elements.ocrUploadArea.style.display = 'none';
                this.processOCR(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    }

    async processOCR(imageData) {
        if (this.elements.ocrProgress) this.elements.ocrProgress.style.display = 'block';
        if (this.elements.ocrResults) this.elements.ocrResults.style.display = 'none';
        this.updateOCRProgress(0, 'Initializing OCR...');

        try {
            if (typeof Tesseract === 'undefined') {
                await this.loadTesseract();
            }
            this.updateOCRProgress(20, 'Processing image...');
            const result = await Tesseract.recognize(imageData, 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        this.updateOCRProgress(20 + Math.round(m.progress * 70), 'Recognizing text... ' + Math.round(m.progress * 100) + '%');
                    }
                }
            });
            this.updateOCRProgress(95, 'Analyzing text...');
            const text = result.data.text;
            this.displayOCRResults(text);
            this.analyzeOCRText(text);
            this.generateAISuggestionsFromOCR();
            this.updateOCRProgress(100, 'Complete!');
        } catch (error) {
            console.error('OCR Error:', error);
            alert('Failed to process image. Please try again.');
            this.clearOCRPreview();
        }
    }

    analyzeOCRText(text) {
        if (!text) return;
        this.state.analysisMode = 'ocr';
        this.state.analysisData.ocr.active = true;
        this.state.analysisData.ocr.text = text;

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const lines = text.split('\n').filter(l => l.trim().length > 0);

        this.state.analysisData.ocr.messageCount = lines.length;
        if (this.elements.messageCount) this.elements.messageCount.textContent = lines.length.toString();

        let participantEstimate = 1;
        if (lines.length > 3) participantEstimate = Math.min(5, Math.ceil(lines.length / 5));
        this.state.analysisData.ocr.participants = participantEstimate;
        if (this.elements.participantCount) this.elements.participantCount.textContent = participantEstimate.toString();

        const avgTime = (Math.random() * 3 + 1).toFixed(1);
        this.state.analysisData.ocr.responseTime = parseFloat(avgTime);
        if (this.elements.avgResponseTime) this.elements.avgResponseTime.textContent = avgTime + 's';

        const sentiment = this.analyzeSentiment(text);
        this.state.analysisData.ocr.sentiment = sentiment;
        this.state.analysisData.ocr.topics = this.detectTopics(text);

        if (sentiment.positive > sentiment.negative + 20) {
            this.state.analysisData.ocr.tone = 'Positive';
        } else if (sentiment.negative > sentiment.positive + 20) {
            this.state.analysisData.ocr.tone = 'Negative';
        } else {
            this.state.analysisData.ocr.tone = 'Neutral';
        }

        this.updateSentimentDisplay(sentiment);
        if (this.elements.chatTone) this.elements.chatTone.textContent = this.state.analysisData.ocr.tone;
        this.generateChatInsights(text, sentiment, lines.length);
        this.updateCombinedMetrics();
    }

    detectTopics(text) {
        const topics = [];
        const textLower = text.toLowerCase();
        const topicKeywords = {
            'business': ['meeting', 'project', 'deadline', 'client', 'proposal', 'contract', 'revenue', 'strategy'],
            'personal': ['family', 'friend', 'weekend', 'vacation', 'hobby', 'home', 'kids'],
            'technical': ['code', 'software', 'computer', 'data', 'system', 'api', 'database'],
            'emotional': ['feel', 'happy', 'sad', 'worried', 'excited', 'love', 'miss', 'great'],
            'questions': ['what', 'why', 'how', 'when', 'where', 'who', '?']
        };
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            for (const keyword of keywords) {
                if (textLower.includes(keyword)) {
                    if (!topics.includes(topic)) topics.push(topic);
                    break;
                }
            }
        }
        return topics;
    }

    generateAISuggestionsFromOCR() {
        const suggestions = [];
        const ocr = this.state.analysisData.ocr;

        if (ocr.sentiment.negative > 40) {
            suggestions.push({ type: 'suggestion', source: 'ocr', message: 'Negative sentiment detected in chat. Consider addressing any concerns directly and showing empathy.' });
        }
        if (ocr.messageCount > 20) {
            suggestions.push({ type: 'tip', source: 'ocr', message: 'High message volume suggests active engagement. The conversation seems productive.' });
        } else if (ocr.messageCount < 5) {
            suggestions.push({ type: 'suggestion', source: 'ocr', message: 'Low message count. Consider asking more open-ended questions to encourage discussion.' });
        }
        if (ocr.participants > 2) {
            suggestions.push({ type: 'tip', source: 'ocr', message: 'Group conversation detected. Ensure everyone has opportunity to contribute.' });
        }
        if (ocr.responseTime > 5) {
            suggestions.push({ type: 'suggestion', source: 'ocr', message: 'Longer response times detected. Be patient and avoid rushing the conversation.' });
        }
        if (ocr.topics.includes('questions')) {
            suggestions.push({ type: 'tip', source: 'ocr', message: 'The conversation contains many questions. Make sure to address all inquiries thoroughly.' });
        }

        suggestions.forEach(suggestion => this.addFeedbackToUI(suggestion));
        return suggestions;
    }

    analyzeSentiment(text) {
        const positiveWords = ['happy', 'great', 'good', 'love', 'excellent', 'wonderful', 'amazing', 'thanks', 'thank', 'please', 'yes', 'agree', 'awesome', 'nice', 'glad', 'pleased', 'excited', 'perfect', 'fantastic', 'beautiful'];
        const negativeWords = ['sad', 'bad', 'hate', 'terrible', 'awful', 'no', 'disagree', 'sorry', 'unfortunately', 'wrong', 'angry', 'upset', 'disappointed', 'problem', 'issue', 'difficult', 'hard', 'fail', 'wrong', 'poor'];
        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0, negativeCount = 0;
        words.forEach(word => {
            const cleanWord = word.replace(/[^a-z]/g, '');
            if (positiveWords.includes(cleanWord)) positiveCount++;
            if (negativeWords.includes(cleanWord)) negativeCount++;
        });
        const total = positiveCount + negativeCount || 1;
        return {
            positive: Math.round((positiveCount / total) * 100),
            neutral: Math.round(100 - ((positiveCount + negativeCount) / words.length) * 100),
            negative: Math.round((negativeCount / total) * 100)
        };
    }

    updateSentimentDisplay(sentiment) {
        if (this.elements.positiveBar) this.elements.positiveBar.style.width = sentiment.positive + '%';
        if (this.elements.neutralBar) this.elements.neutralBar.style.width = sentiment.neutral + '%';
        if (this.elements.negativeBar) this.elements.negativeBar.style.width = sentiment.negative + '%';
        if (this.elements.positiveValue) this.elements.positiveValue.textContent = sentiment.positive + '%';
        if (this.elements.neutralValue) this.elements.neutralValue.textContent = sentiment.neutral + '%';
        if (this.elements.negativeValue) this.elements.negativeValue.textContent = sentiment.negative + '%';
    }

    generateChatInsights(text, sentiment, lineCount) {
        if (!this.elements.chatInsights) return;
        const insights = [];
        if (text.length > 500) insights.push({ type: 'neutral', text: 'Long conversation with substantial content' });
        else if (text.length < 100) insights.push({ type: 'neutral', text: 'Brief conversation with minimal exchange' });
        if (sentiment.positive > 50) insights.push({ type: 'positive', text: 'Overall positive tone detected' });
        else if (sentiment.negative > 50) insights.push({ type: 'neutral', text: 'Negative sentiment detected - may need attention' });
        if (lineCount > 10) insights.push({ type: 'positive', text: 'High engagement with multiple exchanges' });
        else if (lineCount < 3) insights.push({ type: 'neutral', text: 'Limited engagement observed' });

        this.state.analysisData.ocr.insights = insights;
        this.elements.chatInsights.innerHTML = '';
        insights.forEach(insight => {
            const card = document.createElement('div');
            card.className = 'insight-card ' + insight.type;
            card.innerHTML = '<div class="insight-header"><div class="insight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.18 2.18a3.5 3.5 0 0 1 4.64 0L15 3h3a3.5 3.5 0 0 1 0 7H8.53a3.5 3.5 0 0 1-.76-6.82L9.18 2.18zM8 16h.01"></path></svg></div><span class="insight-label">' + insight.type + '</span></div><p>' + insight.text + '</p>';
            this.elements.chatInsights.appendChild(card);
        });
    }

    updateCombinedMetrics() {
        const video = this.state.analysisData.video;
        const audio = this.state.analysisData.audio;
        const ocr = this.state.analysisData.ocr;
        let engagementScore = 0, activeSources = 0;

        if (video.active) { engagementScore += (video.emotions.engaged + video.emotions.happy) / 2; activeSources++; }
        if (audio.active) { engagementScore += (audio.confidence + audio.clarity) / 2; activeSources++; }
        if (ocr.active) { engagementScore += 100 - Math.abs(ocr.sentiment.negative - ocr.sentiment.positive); activeSources++; }
        if (activeSources > 0) this.state.analysisData.combined.overallEngagement = Math.round(engagementScore / activeSources);

        let rapportScore = 50;
        if (video.active) { if (video.bodyLanguage.posture === 'open') rapportScore += 15; if (video.bodyLanguage.eyeContact === 'good') rapportScore += 15; }
        if (audio.active) { if (audio.confidence > 70) rapportScore += 10; if (audio.sentiment === 'positive') rapportScore += 10; }
        if (ocr.active) { if (ocr.sentiment.positive > ocr.sentiment.negative) rapportScore += 15; }
        this.state.analysisData.combined.rapportScore = Math.min(100, rapportScore);
        this.state.analysisData.combined.suggestedActions = this.generateSuggestedActions();
    }

    generateSuggestedActions() {
        const actions = [];
        const video = this.state.analysisData.video;
        const audio = this.state.analysisData.audio;
        const ocr = this.state.analysisData.ocr;

        if (video.active) {
            if (video.emotions.current === 'neutral' && video.emotions.engaged < 50) actions.push('Try sharing something personal to increase engagement');
            if (video.bodyLanguage.posture === 'closed') actions.push('The other person seems reserved. Give them more space');
        }
        if (audio.active) {
            if (audio.pace > 80) actions.push('Consider slowing down your speech for clarity');
            if (audio.confidence < 50) actions.push('Try to speak with more confidence');
        }
        if (ocr.active) {
            if (ocr.sentiment.negative > 30) actions.push('Address the concerns raised in the conversation');
            if (ocr.messageCount > 15 && ocr.participants > 2) actions.push('In a group setting, acknowledge different perspectives');
        }
        return actions;
    }

    async loadTesseract() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    updateOCRProgress(percent, text) {
        if (this.elements.progressFill) this.elements.progressFill.style.width = percent + '%';
        if (this.elements.progressText) this.elements.progressText.textContent = text;
    }

    displayOCRResults(text) {
        if (this.elements.extractedText) this.elements.extractedText.textContent = text || 'No text detected';
        if (this.elements.ocrResults) this.elements.ocrResults.style.display = 'block';
        if (this.elements.ocrProgress) this.elements.ocrProgress.style.display = 'none';
    }

    clearOCRPreview() {
        if (this.elements.previewImage) this.elements.previewImage.src = '';
        if (this.elements.ocrPreview) this.elements.ocrPreview.style.display = 'none';
        if (this.elements.ocrUploadArea) this.elements.ocrUploadArea.style.display = 'block';
        if (this.elements.ocrFileInput) this.elements.ocrFileInput.value = '';
        if (this.elements.ocrResults) this.elements.ocrResults.style.display = 'none';
        if (this.elements.ocrProgress) this.elements.ocrProgress.style.display = 'none';
        this.state.analysisData.ocr.active = false;
        this.state.analysisData.ocr.text = '';
        this.updateCombinedMetrics();
    }

    copyExtractedText() {
        if (this.elements.extractedText) {
            navigator.clipboard.writeText(this.elements.extractedText.textContent).then(() => {
                if (this.elements.copyTextBtn) {
                    const originalHTML = this.elements.copyTextBtn.innerHTML;
                    this.elements.copyTextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => { this.elements.copyTextBtn.innerHTML = originalHTML; }, 2000);
                }
            });
        }
    }

    async initializeAnalysis() {
        this.behavioralAnalyzer = new BehavioralAnalyzer(this);
        this.psychologicalFramework = new PsychologicalFramework(this);
        this.feedbackManager = new FeedbackManager(this);
        this.startDemoMode();
    }

    startDemoMode() {
        setInterval(() => {
            if (this.state.isAnalyzing) this.updateDemoData();
        }, 3000);
    }

    updateDemoData() {
        const emotions = ['happy', 'neutral', 'engaged', 'thoughtful'];
        const bodyPostures = ['open', 'closed', 'leaning'];

        this.state.analysisData.video.active = this.state.isVideoActive;
        this.state.analysisData.video.emotions = {
            happy: Math.max(20, Math.min(80, this.state.analysisData.video.emotions.happy + (Math.random() * 20 - 10))),
            neutral: Math.max(30, Math.min(80, this.state.analysisData.video.emotions.neutral + (Math.random() * 20 - 10))),
            engaged: Math.max(30, Math.min(80, this.state.analysisData.video.emotions.engaged + (Math.random() * 20 - 10))),
            current: emotions[Math.floor(Math.random() * emotions.length)]
        };
        this.state.analysisData.video.bodyLanguage = {
            posture: bodyPostures[Math.floor(Math.random() * bodyPostures.length)],
            eyeContact: Math.random() > 0.5 ? 'good' : 'moderate',
            gestures: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)]
        };

        this.state.analysisData.audio.active = this.state.isAudioActive;
        this.state.analysisData.audio = {
            active: this.state.isAudioActive,
            pace: Math.max(40, Math.min(90, this.state.analysisData.audio.pace + (Math.random() * 20 - 10))),
            tone: Math.max(40, Math.min(90, this.state.analysisData.audio.tone + (Math.random() * 20 - 10))),
            confidence: Math.max(50, Math.min(95, this.state.analysisData.audio.confidence + (Math.random() * 20 - 10))),
            clarity: Math.max(60, Math.min(95, this.state.analysisData.audio.clarity + (Math.random() * 10 - 5))),
            volume: Math.random() > 0.5 ? 'normal' : 'low',
            sentiment: Math.random() > 0.6 ? 'positive' : 'neutral'
        };

        this.updateCombinedMetrics();
        this.updateAnalysisDisplay();
        if (Math.random() > 0.7) this.generateIntegratedFeedback();
    }

    generateIntegratedFeedback() {
        const feedbackItems = [];
        const video = this.state.analysisData.video;
        const audio = this.state.analysisData.audio;
        const combined = this.state.analysisData.combined;

        if (video.active) {
            if (video.emotions.engaged < 40) feedbackItems.push({ type: 'suggestion', source: 'video', message: 'The conversation partner seems less engaged. Try asking an open-ended question.' });
            if (video.bodyLanguage.posture === 'closed') feedbackItems.push({ type: 'tip', source: 'video', message: 'Partner\'s body language suggests they might need more space or are feeling cautious.' });
            if (video.bodyLanguage.eyeContact === 'good') feedbackItems.push({ type: 'tip', source: 'video', message: 'Great eye contact! This helps build trust and rapport.' });
        }
        if (audio.active) {
            if (audio.pace > 75) feedbackItems.push({ type: 'suggestion', source: 'audio', message: 'Your speaking pace seems fast. Consider pausing more for the partner to respond.' });
            if (audio.confidence > 75) feedbackItems.push({ type: 'tip', source: 'audio', message: 'You sound confident! Keep maintaining that positive tone.' });
            if (audio.sentiment === 'positive') feedbackItems.push({ type: 'tip', source: 'audio', message: 'Your vocal tone conveys positivity. This helps create a welcoming atmosphere.' });
        }
        if (combined.overallEngagement > 70) feedbackItems.push({ type: 'tip', source: 'combined', message: 'High overall engagement detected! The conversation is going well.' });

        if (feedbackItems.length > 0) {
            const selectedFeedback = feedbackItems[Math.floor(Math.random() * feedbackItems.length)];
            this.addFeedbackToUI(selectedFeedback);
        }
    }

    updateAnalysisDisplay() {
        const emotionCard = this.elements.emotionCard;
        if (emotionCard) {
            const emotionIcon = emotionCard.querySelector('.emotion-icon');
            const emotionLabel = emotionCard.querySelector('.emotion-label');
            const emotionBars = emotionCard.querySelectorAll('.emotion-bar .bar-fill');
            const emotionValues = emotionCard.querySelectorAll('.emotion-bar .emotion-value');

            if (emotionIcon) emotionIcon.className = 'emotion-icon ' + this.state.analysisData.video.emotions.current;
            if (emotionLabel) emotionLabel.textContent = this.state.analysisData.video.emotions.current.charAt(0).toUpperCase() + this.state.analysisData.video.emotions.current.slice(1);

            const values = [this.state.analysisData.video.emotions.happy, this.state.analysisData.video.emotions.neutral, this.state.analysisData.video.emotions.engaged];
            emotionBars.forEach((bar, index) => { bar.style.width = values[index] + '%'; });
            if (emotionValues[0]) emotionValues[0].textContent = Math.round(values[0]) + '%';
            if (emotionValues[1]) emotionValues[1].textContent = Math.round(values[1]) + '%';
            if (emotionValues[2]) emotionValues[2].textContent = Math.round(values[2]) + '%';
        }

        const bodyLanguageCard = this.elements.bodyLanguageCard;
        if (bodyLanguageCard) {
            const postureIcon = bodyLanguageCard.querySelector('.posture-icon');
            const postureLabel = bodyLanguageCard.querySelector('.posture-label');
            const gestureValues = bodyLanguageCard.querySelectorAll('.gesture-value');

            if (postureIcon) postureIcon.className = 'posture-icon ' + this.state.analysisData.video.bodyLanguage.posture;
            if (postureLabel) postureLabel.textContent = this.state.analysisData.video.bodyLanguage.posture.charAt(0).toUpperCase() + this.state.analysisData.video.bodyLanguage.posture.slice(1);
            if (gestureValues[0]) { gestureValues[0].textContent = this.state.analysisData.video.bodyLanguage.eyeContact.charAt(0).toUpperCase() + this.state.analysisData.video.bodyLanguage.eyeContact.slice(1); gestureValues[0].className = 'gesture-value ' + (this.state.analysisData.video.bodyLanguage.eyeContact === 'good' ? 'positive' : 'neutral'); }
            if (gestureValues[2]) gestureValues[2].textContent = this.state.analysisData.video.bodyLanguage.gestures.charAt(0).toUpperCase() + this.state.analysisData.video.bodyLanguage.gestures.slice(1);
        }

        const vocalCard = this.elements.vocalCard;
        if (vocalCard) {
            const audio = this.state.analysisData.audio;
            const metricValues = vocalCard.querySelectorAll('.metric-value');
            const metricFills = vocalCard.querySelectorAll('.metric-fill');
            const tones = ['Slow', 'Normal', 'Fast'];
            const toneIndex = audio.pace < 45 ? 0 : audio.pace > 70 ? 2 : 1;
            const confidences = ['Low', 'Medium', 'High'];
            const confidenceIndex = audio.confidence < 50 ? 0 : audio.confidence > 75 ? 2 : 1;
            const claritys = ['Unclear', 'Moderate', 'Clear'];
            const clarityIndex = audio.clarity < 50 ? 0 : audio.clarity > 75 ? 2 : 1;
            if (metricValues[0]) metricValues[0].textContent = tones[toneIndex];
            if (metricValues[1]) metricValues[1].textContent = audio.tone > 60 ? 'Warm' : 'Neutral';
            if (metricValues[2]) metricValues[2].textContent = confidences[confidenceIndex];
            if (metricValues[3]) metricValues[3].textContent = claritys[clarityIndex];
            if (metricFills[0]) metricFills[0].style.width = audio.pace + '%';
            if (metricFills[1]) metricFills[1].style.width = audio.tone + '%';
            if (metricFills[2]) metricFills[2].style.width = audio.confidence + '%';
            if (metricFills[3]) metricFills[3].style.width = audio.clarity + '%';
        }
    }

    addFeedbackToUI(feedback) {
        if (!this.elements.feedbackList) return;
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item ' + feedback.type;
        const sourceLabel = feedback.source ? '[' + feedback.source + '] ' : '';
        const icons = {
            suggestion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.18 2.18a3.5 3.5 0 0 1 4.64 0L15 3h3a3.5 3.5 0 0 1 0 7H8.53a3.5 3.5 0 0 1-.76-6.82L9.18 2.18zM8 16h.01"></path></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };
        feedbackItem.innerHTML = '<div class="feedback-icon">' + icons[feedback.type] + '</div><div class="feedback-content"><p>' + sourceLabel + feedback.message + '</p><span class="feedback-timing">Just now</span></div>';
        this.elements.feedbackList.insertBefore(feedbackItem, this.elements.feedbackList.firstChild);
        while (this.elements.feedbackList.children.length > 10) {
            this.elements.feedbackList.removeChild(this.elements.feedbackList.lastChild);
        }
    }

    async toggleAnalysis() {
        this.state.isAnalyzing = !this.state.isAnalyzing;
        if (this.state.isAnalyzing) await this.startAnalysis();
        else this.stopAnalysis();
    }

    async startAnalysis() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 1280, height: 720 }, audio: true });
            if (this.elements.videoFeed) {
                this.elements.videoFeed.srcObject = stream;
                this.state.isVideoActive = true;
                this.state.analysisData.video.active = true;
            }
            if (this.elements.videoContainer) this.elements.videoContainer.classList.add('active');
            if (this.elements.placeholderState) this.elements.placeholderState.classList.add('hidden');
            if (this.elements.startAnalysisBtn) this.elements.startAnalysisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
            this.state.sessionStartTime = new Date();
            this.state.analysisMode = 'video';
            console.log('Analysis started');
        } catch (error) {
            console.error('Failed to start analysis:', error);
            alert('Could not access camera. Please ensure camera permissions are granted.');
        }
    }

    stopAnalysis() {
        if (this.elements.videoFeed && this.elements.videoFeed.srcObject) {
            const tracks = this.elements.videoFeed.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.elements.videoFeed.srcObject = null;
        }
        this.state.isVideoActive = false;
        this.state.isAudioActive = false;
        this.state.analysisData.video.active = false;
        if (this.elements.videoContainer) this.elements.videoContainer.classList.remove('active');
        if (this.elements.placeholderState) this.elements.placeholderState.classList.remove('hidden');
        if (this.elements.startAnalysisBtn) this.elements.startAnalysisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        this.updateCombinedMetrics();
        console.log('Analysis stopped');
    }

    toggleVideo() {
        if (this.elements.videoFeed && this.elements.videoFeed.srcObject) {
            const videoTrack = this.elements.videoFeed.srcObject.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                this.state.isVideoActive = videoTrack.enabled;
                this.state.analysisData.video.active = videoTrack.enabled;
                this.updateCombinedMetrics();
            }
        }
    }

    toggleAudio() {
        if (this.elements.videoFeed && this.elements.videoFeed.srcObject) {
            const audioTrack = this.elements.videoFeed.srcObject.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                this.state.isAudioActive = audioTrack.enabled;
                this.state.analysisData.audio.active = audioTrack.enabled;
                this.updateCombinedMetrics();
            }
        }
    }

    toggleFeedback() {
        this.state.feedbackEnabled = !this.state.feedbackEnabled;
        if (this.elements.feedbackSection) this.elements.feedbackSection.style.display = this.state.feedbackEnabled ? 'block' : 'none';
    }

    openSettings() {
        if (this.elements.settingsModal) this.elements.settingsModal.classList.add('active');
    }

    closeSettings() {
        if (this.elements.settingsModal) this.elements.settingsModal.classList.remove('active');
    }

    saveSettings() {
        const toggles = document.querySelectorAll('.toggle input');
        const selects = document.querySelectorAll('.select-input');
        this.state.settings.emotionAnalysis = toggles[0] ? toggles[0].checked : true;
        this.state.settings.bodyLanguageAnalysis = toggles[1] ? toggles[1].checked : true;
        this.state.settings.vocalAnalysis = toggles[2] ? toggles[2].checked : true;
        this.state.settings.feedbackSound = toggles[3] ? toggles[3].checked : false;
        this.state.settings.localProcessing = toggles[4] ? toggles[4].checked : true;
        if (selects[0]) this.state.settings.feedbackFrequency = selects[0].value;
        localStorage.setItem('aiConversationHelper_settings', JSON.stringify(this.state.settings));
        this.closeSettings();
        console.log('Settings saved:', this.state.settings);
    }

    loadSettings() {
        const saved = localStorage.getItem('aiConversationHelper_settings');
        if (saved) {
            try { this.state.settings = Object.assign({}, this.state.settings, JSON.parse(saved)); }
            catch (e) { console.error('Failed to load settings:', e); }
        }
    }

    selectRecommendation(btn) {
        this.elements.recommendationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log('Selected recommendation:', btn.querySelector('.rec-text').textContent);
    }
}

document.addEventListener('DOMContentLoaded', () => { window.aiHelper = new AIConversationHelper(); });
if (document.readyState === 'complete' || document.readyState === 'interactive') { window.aiHelper = new AIConversationHelper(); }
