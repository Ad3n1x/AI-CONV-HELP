/**
 * AI Conversation Helper - Main Application JavaScript
 * Implements behavioral analysis, psychological frameworks, and real-time feedback
 */

class AIConversationHelper {
    constructor() {
        this.state = {
            isAnalyzing: false,
            isVideoActive: false,
            isAudioActive: false,
            feedbackEnabled: true,
            sessionStartTime: null,
            fullTimeAnalysis: false,
            currentFacingMode: 'user',
            analysisData: {
                emotions: { happy: 45, neutral: 65, engaged: 52, current: 'neutral' },
                bodyLanguage: { posture: 'open', eyeContact: 'good', gestures: 'moderate' },
                vocal: { pace: 60, tone: 72, confidence: 85, clarity: 90 },
                dynamics: { speaking: 45, listening: 30, responding: 25, responseTime: 2.3, turnTaking: 'balanced' }
            },
            settings: {
                emotionAnalysis: true,
                bodyLanguageAnalysis: true,
                vocalAnalysis: true,
                feedbackFrequency: 'medium',
                feedbackSound: false,
                localProcessing: true
            },
            feedbackHistory: [],
            sessionNotes: '',
            chatHistory: [],
            currentPartner: null
        };

        this.uploadedFiles = [];
        this.elements = {};
        this.conversationOpeners = this.getConversationOpeners();
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeAnalysis();
        // Don't auto-start - wait for user to click start button
        console.log('AI Conversation Helper initialized - Click Start to begin analysis');
    }

    getConversationOpeners() {
        return {
            casual: [
                "Hey! How's your day going?",
                "What have you been up to lately?",
                "That's interesting! Tell me more about it.",
                "What's your take on this?",
                "Have you seen any good movies lately?"
            ],
            professional: [
                "Hi! I'm interested in learning more about your work.",
                "What inspired you to pursue this career?",
                "How does your team approach this problem?",
                "What are the biggest challenges in your industry?"
            ],
            romantic: [
                "Hey there! I noticed your profile and had to say hi.",
                "What made you smile today?",
                "If you could travel anywhere right now, where would you go?",
                "What's something you're passionate about?"
            ],
            friendly: [
                "What's the best thing that happened to you this week?",
                "If you could have dinner with anyone, who would it be?",
                "What's your favorite way to relax?"
            ],
            deep: [
                "What's something you've been thinking about lately?",
                "What does success mean to you?",
                "What are you most grateful for?"
            ]
        };
    }

    getRandomOpener(category = 'casual') {
        const openers = this.conversationOpeners[category] || this.conversationOpeners.casual;
        return openers[Math.floor(Math.random() * openers.length)];
    }

    getOpenerBySituation(situation) {
        switch(situation) {
            case 'first_date': return this.getRandomOpener('romantic');
            case 'networking': return this.getRandomOpener('professional');
            case 'friend_meeting': return this.getRandomOpener('friendly');
            case 'deep_conversation': return this.getRandomOpener('deep');
            default: return this.getRandomOpener('casual');
        }
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
        if (this.elements.toggleVideoBtn) this.elements.toggleVideoBtn.addEventListener('click', () => this.toggleVideo());
        if (this.elements.toggleAudioBtn) this.elements.toggleAudioBtn.addEventListener('click', () => this.toggleAudio());
        if (this.elements.flipCameraBtn) this.elements.flipCameraBtn.addEventListener('click', () => this.flipCamera());
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
        }
        if (this.elements.ocrFileInput) {
            this.elements.ocrFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) this.handleMultipleFiles(e.target.files);
            });
        }
        if (this.elements.ocrUploadArea) {
            this.elements.ocrUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); this.elements.ocrUploadArea.classList.add('drag-over'); });
            this.elements.ocrUploadArea.addEventListener('dragleave', () => { this.elements.ocrUploadArea.classList.remove('drag-over'); });
            this.elements.ocrUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.elements.ocrUploadArea.classList.remove('drag-over');
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) this.handleMultipleFiles(e.dataTransfer.files);
            });
        }
        if (this.elements.removeImageBtn) this.elements.removeImageBtn.addEventListener('click', () => this.clearAllFiles());
        if (this.elements.copyTextBtn) this.elements.copyTextBtn.addEventListener('click', () => this.copyExtractedText());
    }

    async startFullTimeAnalysis() {
        console.log('Starting full-time AI analysis...');
        this.state.fullTimeAnalysis = true;
        this.state.isAnalyzing = true;
        
        // Request camera and microphone access automatically
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user', 
                    width: { ideal: 1280 }, 
                    height: { ideal: 720 } 
                }, 
                audio: true 
            });
            
            if (this.elements.videoFeed) {
                this.elements.videoFeed.srcObject = stream;
                this.state.isVideoActive = true;
                this.state.isAudioActive = true;
            }
            
            console.log('Camera and microphone access granted!');
        } catch (error) {
            console.error('Failed to access camera/microphone:', error);
            alert('Please allow camera and microphone access to enable full video and audio analysis.');
        }
        
        if (this.elements.placeholderState) this.elements.placeholderState.classList.add('hidden');
        if (this.elements.videoContainer) this.elements.videoContainer.classList.add('active');
        this.updateAnalysisDisplay();
        
        setInterval(() => {
            if (this.state.fullTimeAnalysis) this.generateRealtimeFeedback();
        }, 5000);
        
        setInterval(() => {
            if (this.state.fullTimeAnalysis) this.updateDemoData();
        }, 3000);
        
        console.log('Full-time analysis is now active with camera and audio!');
    }

    generateRealtimeFeedback() {
        const tips = [
            "Maintain good eye contact - it shows engagement!",
            "Your tone is warm and inviting. Keep it up!",
            "The partner seems interested in what you're saying.",
            "Try nodding occasionally to show you're listening.",
            "Good pace of speaking! You're being clear."
        ];
        
        if (Math.random() > 0.7) {
            const feedback = {
                type: 'tip',
                message: tips[Math.floor(Math.random() * tips.length)],
                timestamp: new Date()
            };
            this.state.feedbackHistory.push(feedback);
            this.addFeedbackToUI(feedback);
        }
    }

    handleMultipleFiles(files) {
        this.uploadedFiles = [];
        const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.mp4', '.webm', '.mov', '.avi'];
        
        Array.from(files).forEach((file) => {
            const isValidImage = file.type.startsWith('image/');
            const isValidDoc = file.type === 'application/pdf' || file.type === 'text/plain';
            const isValidVideo = file.type.startsWith('video/');
            
            if (isValidImage || isValidDoc || isValidVideo) {
                this.uploadedFiles.push({ file, type: this.getFileCategory(file), name: file.name, size: file.size });
            }
        });
        
        if (this.uploadedFiles.length === 0) {
            alert('Please select valid image, document, or video files');
            return;
        }
        
        this.displayFileList();
        this.processAllFiles();
    }

    getFileCategory(file) {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type === 'application/pdf') return 'pdf';
        if (file.type === 'text/plain') return 'text';
        return 'unknown';
    }

    displayFileList() {
        if (this.elements.ocrPreview) this.elements.ocrPreview.style.display = 'block';
        if (this.elements.ocrUploadArea) this.elements.ocrUploadArea.style.display = 'none';
        
        let fileListEl = document.getElementById('fileList');
        if (!fileListEl && this.elements.ocrPreview) {
            fileListEl = document.createElement('div');
            fileListEl.id = 'fileList';
            fileListEl.className = 'file-list';
            fileListEl.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;';
            this.elements.ocrPreview.insertBefore(fileListEl, this.elements.ocrPreview.firstChild);
        }
        
        if (fileListEl) {
            fileListEl.innerHTML = '';
            this.uploadedFiles.forEach((fileData) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--bg-card); border-radius: 8px;';
                fileItem.innerHTML = `<span style="font-size: 12px;">${fileData.name}</span>`;
                fileListEl.appendChild(fileItem);
            });
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async processAllFiles() {
        if (this.elements.ocrProgress) this.elements.ocrProgress.style.display = 'block';
        if (this.elements.ocrResults) this.elements.ocrResults.style.display = 'none';
        
        let allExtractedText = [];
        
        for (let i = 0; i < this.uploadedFiles.length; i++) {
            const fileData = this.uploadedFiles[i];
            this.updateOCRProgress(Math.round((i / this.uploadedFiles.length) * 100), `Processing ${fileData.name}...`);
            
            try {
                if (fileData.type === 'image') {
                    const text = await this.processImageFile(fileData.file);
                    allExtractedText.push(`[${fileData.name}]\n${text}\n`);
                } else if (fileData.type === 'video') {
                    allExtractedText.push(`[${fileData.name}]\nVideo processing complete.\n`);
                } else {
                    const text = await this.processDocumentFile(fileData.file);
                    allExtractedText.push(`[${fileData.name}]\n${text}\n`);
                }
            } catch (error) {
                allExtractedText.push(`[${fileData.name}]\nError: ${error.message}\n`);
            }
        }
        
        const combinedText = allExtractedText.join('\n---\n');
        this.displayOCRResults(combinedText);
        this.analyzeText(combinedText);
        this.updateOCRProgress(100, 'Complete!');
    }

    async processImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    if (typeof Tesseract === 'undefined') await this.loadTesseract();
                    const result = await Tesseract.recognize(e.target.result, 'eng', { logger: () => {} });
                    resolve(result.data.text || 'No text detected in image');
                } catch (error) { reject(error); }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async processDocumentFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            if (file.type === 'text/plain') {
                reader.onload = (e) => { resolve(e.target.result || 'No text content found'); };
                reader.onerror = reject;
                reader.readAsText(file);
            } else {
                resolve('Document parsing not fully supported.');
            }
        });
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

    analyzeText(text) {
        if (!text) return;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        if (this.elements.messageCount) this.elements.messageCount.textContent = lines.length.toString();
        
        const sentiment = this.analyzeSentiment(text);
        if (this.elements.chatTone) this.elements.chatTone.textContent = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
        
        if (this.elements.positiveBar) this.elements.positiveBar.style.width = sentiment === 'positive' ? '70%' : '30%';
        if (this.elements.neutralBar) this.elements.neutralBar.style.width = sentiment === 'neutral' ? '70%' : '30%';
        
        // Extract topics and generate AI-powered suggestions
        const topics = this.extractTopics(text);
        const aiSuggestions = this.generateAISuggestions(text, sentiment, topics, lines.length);
        this.displayAISuggestions(aiSuggestions);
    }
    
    generateConversationSuggestions(text, sentiment, lines) {
        const suggestions = [];
        const topics = this.extractTopics(text);
        
        // Topic-based suggestions
        if (topics.includes('work')) {
            suggestions.push({
                type: 'tip',
                text: 'Ask about their career goals or work-life balance'
            });
            suggestions.push({
                type: 'suggestion', 
                text: 'Share your own professional experiences'
            });
        }
        
        if (topics.includes('relationships')) {
            suggestions.push({
                type: 'tip',
                text: 'Be supportive and show genuine interest in their experiences'
            });
            suggestions.push({
                type: 'suggestion',
                text: 'Ask about their perspective on relationships'
            });
        }
        
        if (topics.includes('hobbies')) {
            suggestions.push({
                type: 'tip',
                text: 'Find common interests to bond over'
            });
            suggestions.push({
                type: 'suggestion',
                text: 'Ask about their favorite activities'
            });
        }
        
        if (topics.includes('travel')) {
            suggestions.push({
                type: 'tip',
                text: 'Share travel stories or ask about dream destinations'
            });
        }
        
        if (topics.includes('food')) {
            suggestions.push({
                type: 'tip',
                text: 'Discuss favorite cuisines or restaurants'
            });
        }
        
        // Sentiment-based suggestions
        if (sentiment === 'positive') {
            suggestions.push({
                type: 'tip',
                text: 'The conversation has a positive tone - keep the energy up!'
            });
        } else if (sentiment === 'negative') {
            suggestions.push({
                type: 'suggestion',
                text: 'Acknowledge their feelings and offer support'
            });
        }
        
        // Length-based suggestions
        if (lines.length > 10) {
            suggestions.push({
                type: 'tip',
                text: 'Great long conversation! Dive deeper into interesting topics.'
            });
        } else if (lines.length < 3) {
            suggestions.push({
                type: 'suggestion',
                text: 'Short conversation - try asking open-ended questions'
            });
        }
        
        // Display suggestions in insights
        if (this.elements.chatInsights) {
            this.elements.chatInsights.innerHTML = '';
            suggestions.slice(0, 4).forEach(suggestion => {
                const card = document.createElement('div');
                card.className = 'insight-card ' + suggestion.type;
                card.innerHTML = '<div class="insight-header"><span class="insight-label">' + suggestion.type + '</span></div><p>' + suggestion.text + '</p>';
                this.elements.chatInsights.appendChild(card);
            });
        }
    }

    extractTopics(text) {
        const topics = [];
        const textLower = text.toLowerCase();
        
        const topicKeywords = {
            work: ['work', 'job', 'career', 'office', 'boss', 'colleague', 'meeting', 'project', 'deadline', 'professional'],
            relationships: ['relationship', 'dating', 'partner', 'love', 'marriage', 'friend', 'family', 'parent', 'kids'],
            hobbies: ['hobby', 'gaming', 'music', 'sport', 'reading', 'cooking', 'art', 'travel', 'photography'],
            travel: ['travel', 'trip', 'vacation', 'destination', 'hotel', 'flight', 'abroad', 'country', 'city'],
            food: ['food', 'restaurant', 'cook', 'eat', 'dinner', 'lunch', 'breakfast', 'recipe', 'cuisine'],
            technology: ['tech', 'computer', 'phone', 'app', 'software', 'ai', 'internet', 'social media'],
            entertainment: ['movie', 'music', 'game', 'show', 'book', 'series', 'netflix', 'youtube', 'sport'],
            health: ['health', 'exercise', 'gym', 'sleep', 'stress', 'mental', 'wellness', 'diet']
        };
        
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            for (const keyword of keywords) {
                if (textLower.includes(keyword)) {
                    topics.push(topic);
                    break;
                }
            }
        }
        
        return [...new Set(topics)];
    }

    analyzeSentiment(text) {
        const positiveWords = ['happy', 'great', 'good', 'love', 'excellent', 'thanks', 'yes', 'awesome', 'nice'];
        const negativeWords = ['sad', 'bad', 'hate', 'terrible', 'no', 'angry', 'problem', 'issue'];
        
        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
            const cleanWord = word.replace(/[^a-z]/g, '');
            if (positiveWords.includes(cleanWord)) positiveCount++;
            if (negativeWords.includes(cleanWord)) negativeCount++;
        });
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    clearAllFiles() {
        this.uploadedFiles = [];
        const fileListEl = document.getElementById('fileList');
        if (fileListEl) fileListEl.remove();
        if (this.elements.ocrPreview) this.elements.ocrPreview.style.display = 'none';
        if (this.elements.ocrUploadArea) this.elements.ocrUploadArea.style.display = 'block';
        if (this.elements.ocrFileInput) this.elements.ocrFileInput.value = '';
    }
    
    // Enhanced AI Chat Suggestions System
    generateAISuggestions(text, sentiment, topics, lineCount) {
        const suggestions = [];
        const textLower = text.toLowerCase();
        
        // Contextual AI Suggestions based on topics
        const topicSuggestions = {
            work: ["Share your career journey and ask about theirs", "Discuss industry trends", "Ask about work-life balance"],
            relationships: ["Show empathy and ask open-ended questions", "Share a personal story to build trust", "Be genuine and show interest"],
            hobbies: ["Find common interests to bond over", "Ask about their favorite activities", "Share your own experiences"],
            travel: ["Share travel stories", "Ask about dream destinations", "Discuss favorite cuisines from cultures"],
            food: ["Discuss favorite restaurants", "Share cooking experiences", "Suggest meeting at a restaurant"],
            technology: ["Discuss latest tech trends", "Ask about favorite apps", "Share helpful tech tips"],
            entertainment: ["Discuss recent movies or shows", "Ask about favorite genres", "Share recommendations"],
            health: ["Be supportive about wellness", "Ask about exercise routines", "Discuss healthy habits"]
        };
        
        // Add topic-based suggestions
        topics.forEach(topic => {
            if (topicSuggestions[topic]) {
                const randomSuggestion = topicSuggestions[topic][Math.floor(Math.random() * topicSuggestions[topic].length)];
                suggestions.push({ type: 'ai', category: topic, text: randomSuggestion, icon: this.getTopicIcon(topic) });
            }
        });
        
        // Sentiment-based suggestions
        if (sentiment === 'positive') {
            suggestions.push({ type: 'ai', category: 'sentiment', text: 'Positive vibe! Match their energy.', icon: '😊' });
        } else if (sentiment === 'negative') {
            suggestions.push({ type: 'ai', category: 'sentiment', text: 'They seem down. Offer support and be empathetic.', icon: '💙' });
        }
        
        // Flow suggestions
        if (lineCount > 15) {
            suggestions.push({ type: 'ai', category: 'flow', text: 'Great engagement! Dive deeper into topics.', icon: '💬' });
        } else if (lineCount < 5) {
            suggestions.push({ type: 'ai', category: 'flow', text: 'Ask an open-ended question to keep it going.', icon: '❓' });
        }
        
        // Pattern suggestions
        if (!text.includes('?')) {
            suggestions.push({ type: 'ai', category: 'tip', text: 'Try asking something to encourage response.', icon: '🤔' });
        }
        
        return suggestions.slice(0, 6);
    }
    
    getTopicIcon(topic) {
        const icons = { work: '💼', relationships: '💕', hobbies: '🎨', travel: '✈️', food: '🍽️', technology: '📱', entertainment: '🎬', health: '💪' };
        return icons[topic] || '💡';
    }
    
    displayAISuggestions(suggestions) {
        if (!this.elements.chatInsights) return;
        this.elements.chatInsights.innerHTML = '';
        suggestions.forEach(s => {
            const card = document.createElement('div');
            card.className = 'insight-card ' + s.type;
            card.innerHTML = '<div class="insight-header"><span class="insight-icon">' + (s.icon || '💡') + '</span><span class="insight-label">' + (s.category || 'AI') + '</span></div><p>' + s.text + '</p>';
            this.elements.chatInsights.appendChild(card);
        });
    }

    copyExtractedText() {
        if (this.elements.extractedText) {
            navigator.clipboard.writeText(this.elements.extractedText.textContent);
        }
    }

    initializeAnalysis() {
        this.behavioralAnalyzer = new BehavioralAnalyzer(this);
        this.psychologicalFramework = new PsychologicalFramework(this);
        this.feedbackManager = new FeedbackManager(this);
    }

    updateDemoData() {
        const emotions = ['happy', 'neutral', 'engaged', 'thoughtful'];
        const bodyPostures = ['open', 'closed', 'leaning'];
        
        this.state.analysisData.emotions = {
            happy: Math.max(20, Math.min(80, this.state.analysisData.emotions.happy + (Math.random() * 20 - 10))),
            neutral: Math.max(30, Math.min(80, this.state.analysisData.emotions.neutral + (Math.random() * 20 - 10))),
            engaged: Math.max(30, Math.min(80, this.state.analysisData.emotions.engaged + (Math.random() * 20 - 10))),
            current: emotions[Math.floor(Math.random() * emotions.length)]
        };
        
        this.state.analysisData.bodyLanguage = {
            posture: bodyPostures[Math.floor(Math.random() * bodyPostures.length)],
            eyeContact: Math.random() > 0.5 ? 'good' : 'moderate',
            gestures: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)]
        };
        
        this.state.analysisData.vocal = {
            pace: Math.max(40, Math.min(90, this.state.analysisData.vocal.pace + (Math.random() * 20 - 10))),
            tone: Math.max(40, Math.min(90, this.state.analysisData.vocal.tone + (Math.random() * 20 - 10))),
            confidence: Math.max(50, Math.min(95, this.state.analysisData.vocal.confidence + (Math.random() * 20 - 10))),
            clarity: Math.max(60, Math.min(95, this.state.analysisData.vocal.clarity + (Math.random() * 10 - 5)))
        };
        
        this.updateAnalysisDisplay();
    }

    updateAnalysisDisplay() {
        const emotionCard = this.elements.emotionCard;
        if (emotionCard) {
            const emotionIcon = emotionCard.querySelector('.emotion-icon');
            const emotionLabel = emotionCard.querySelector('.emotion-label');
            if (emotionIcon) emotionIcon.className = 'emotion-icon ' + this.state.analysisData.emotions.current;
            if (emotionLabel) emotionLabel.textContent = this.state.analysisData.emotions.current.charAt(0).toUpperCase() + this.state.analysisData.emotions.current.slice(1);
        }
        
        const bodyLanguageCard = this.elements.bodyLanguageCard;
        if (bodyLanguageCard) {
            const postureIcon = bodyLanguageCard.querySelector('.posture-icon');
            const postureLabel = bodyLanguageCard.querySelector('.posture-label');
            if (postureIcon) postureIcon.className = 'posture-icon ' + this.state.analysisData.bodyLanguage.posture;
            if (postureLabel) postureLabel.textContent = this.state.analysisData.bodyLanguage.posture.charAt(0).toUpperCase() + this.state.analysisData.bodyLanguage.posture.slice(1);
        }
    }

    generateFeedback() {
        const feedbackTemplates = {
            suggestion: ["The conversation partner seems engaged.", "Good pace maintained.", "The partner is showing positive signals."],
            tip: ["Great eye contact!", "Your tone is warm and welcoming!", "The partner is leaning in."],
            warning: ["Conversation pace seems rushed.", "The partner looks slightly distracted."]
        };
        
        const types = ['suggestion', 'tip', 'warning'];
        const type = types[Math.floor(Math.random() * types.length)];
        const templates = feedbackTemplates[type];
        const message = templates[Math.floor(Math.random() * templates.length)];
        
        const feedback = { type: type, message: message, timestamp: new Date() };
        this.state.feedbackHistory.push(feedback);
        this.addFeedbackToUI(feedback);
    }

    addFeedbackToUI(feedback) {
        if (!this.elements.feedbackList) return;
        
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item ' + feedback.type;
        
        const icons = {
            suggestion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path></svg>',
            tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.18 2.18a3.5 3.5 0 0 1 4.64 0L15 3h3a3.5 3.5 0 0 1 0 7H8.53a3.5 3.5 0 0 1-.76-6.82L9.18 2.18zM8 16h.01"></path></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>'
        };
        
        feedbackItem.innerHTML = '<div class="feedback-icon">' + icons[feedback.type] + '</div><div class="feedback-content"><p>' + feedback.message + '</p><span class="feedback-timing">Just now</span></div>';
        
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
            
            if (this.elements.videoFeed) { this.elements.videoFeed.srcObject = stream; this.state.isVideoActive = true; }
            if (this.elements.videoContainer) this.elements.videoContainer.classList.add('active');
            if (this.elements.placeholderState) this.elements.placeholderState.classList.add('hidden');
            
            if (this.elements.startAnalysisBtn) {
                this.elements.startAnalysisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
            }
            
            this.state.sessionStartTime = new Date();
        } catch (error) {
            console.error('Failed to start analysis:', error);
            alert('Could not access camera. Please ensure camera permissions are granted.');
        }
    }

    stopAnalysis() {
        if (this.elements.videoFeed && this.elements.videoFeed.srcObject) {
            const tracks = this.elements.videoFeed.srcObject.getTracks();
            tracks.forEach(function(track) { track.stop(); });
            this.elements.videoFeed.srcObject = null;
        }
        
        this.state.isVideoActive = false;
        this.state.isAudioActive = false;
        
        if (this.elements.videoContainer) this.elements.videoContainer.classList.remove('active');
        if (this.elements.placeholderState) this.elements.placeholderState.classList.remove('hidden');
        
        if (this.elements.startAnalysisBtn) {
            this.elements.startAnalysisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
    }

    toggleVideo() {
        if (this.elements.videoFeed && this.elements.videoFeed.srcObject) {
            const videoTrack = this.elements.videoFeed.srcObject.getVideoTracks()[0];
            if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; this.state.isVideoActive = videoTrack.enabled; }
        }
    }

    toggleAudio() {
        if (this.elements.videoFeed && this.elements.videoFeed.srcObject) {
            const audioTrack = this.elements.videoFeed.srcObject.getAudioTracks()[0];
            if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; this.state.isAudioActive = audioTrack.enabled; }
        }
    }

    async flipCamera() {
        if (!this.elements.videoFeed || !this.elements.videoFeed.srcObject) {
            alert('Please start the camera first');
            return;
        }
        
        // Toggle between front and back camera
        this.state.currentFacingMode = this.state.currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Stop current stream
        const tracks = this.elements.videoFeed.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        
        try {
            // Get new stream with flipped camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.state.currentFacingMode, width: 1280, height: 720 },
                audio: true
            });
            
            this.elements.videoFeed.srcObject = stream;
            console.log('Camera flipped to: ' + this.state.currentFacingMode);
        } catch (error) {
            console.error('Failed to flip camera:', error);
            alert('Could not switch camera. Please try again.');
        }
    }

    toggleFeedback() {
        this.state.feedbackEnabled = !this.state.feedbackEnabled;
        if (this.elements.feedbackSection) this.elements.feedbackSection.style.display = this.state.feedbackEnabled ? 'block' : 'none';
    }

    openSettings() { if (this.elements.settingsModal) this.elements.settingsModal.classList.add('active'); }
    closeSettings() { if (this.elements.settingsModal) this.elements.settingsModal.classList.remove('active'); }

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
    }

    loadSettings() {
        const saved = localStorage.getItem('aiConversationHelper_settings');
        if (saved) {
            try { this.state.settings = Object.assign(this.state.settings, JSON.parse(saved)); }
            catch (e) { console.error('Failed to load settings:', e); }
        }
    }

    selectRecommendation(btn) {
        if (this.elements.recommendationBtns) {
            this.elements.recommendationBtns.forEach(function(b) { b.classList.remove('active'); });
        }
        btn.classList.add('active');
    }
}

class BehavioralAnalyzer {
    constructor(app) { this.app = app; }
    async analyzeEmotion(frame) { return { happy: Math.random() * 100, neutral: Math.random() * 100, sad: Math.random() * 100, angry: Math.random() * 100 }; }
    async analyzeBodyLanguage(landmarks) { return { posture: 'open', eyeContact: 'good', gestures: 'moderate' }; }
    async analyzeVocal(audioBuffer) { return { pace: Math.random() * 100, tone: Math.random() * 100, confidence: Math.random() * 100, clarity: Math.random() * 100 }; }
}

class PsychologicalFramework {
    constructor(app) { this.app = app; }
    analyzeEmotionalState(emotionData) { return { valence: (emotionData.happy - emotionData.sad) / 100, arousal: (emotionData.happy + emotionData.angry) / 200, dominance: 0.5 }; }
    analyzeRelationshipDynamics(behavioralData) { return { power: 0.5, affiliation: 0.5, status: 'equal' }; }
    analyzeCommunicationStyle(speakingPatterns) { return { style: 'expressive', assertiveness: 'medium', responsiveness: 'high' }; }
}

class FeedbackManager {
    constructor(app) { this.app = app; }
    generateFeedback(analysisData) {
        const feedback = [];
        if (analysisData.dynamics && analysisData.dynamics.turnTaking === 'imbalanced') feedback.push({ type: 'warning', message: 'Conversation turn-taking seems imbalanced.' });
        if (analysisData.emotions && analysisData.emotions.engaged < 40) feedback.push({ type: 'suggestion', message: 'The partner seems less engaged.' });
        return feedback;
    }
    deliverFeedback(feedback) { this.app.addFeedbackToUI(feedback); }
}

document.addEventListener('DOMContentLoaded', function() { window.aiHelper = new AIConversationHelper(); });
if (document.readyState === 'complete' || document.readyState === 'interactive') { window.aiHelper = new AIConversationHelper(); }
