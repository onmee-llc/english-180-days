import {GoogleGenAI} from '@google/genai';

export const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * High-performance streaming client for Gemini models with latency telemetry,
 * abort signal support, and resilient offline mock fallback.
 */
export class LLMClient {
  /**
   * @param {Object} config
   * @param {string} [config.apiKey] - Google Gen AI API key
   * @param {string} [config.defaultModel] - Default model identifier
   * @param {boolean} [config.mockMode] - Force mock responses for testing/offline
   */
  constructor(config = {}) {
    this.apiKey = config.apiKey || '';
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.mockMode = config.mockMode ?? false;
    this._client = null;
  }

  setApiKey(key) {
    this.apiKey = key;
    this._client = null;
  }

  getClient() {
    if (this._client) return this._client;
    if (this.apiKey) {
      this._client = new GoogleGenAI({apiKey: this.apiKey});
    }
    return this._client;
  }

  /**
   * Stream tokens from Gemini or Mock Provider with telemetry.
   * @param {Object} params
   * @param {string} [params.prompt]
   * @param {Object} [params.audioPart] - { mimeType: string, data: string }
   * @param {string} [params.systemInstruction]
   * @param {Array<Object>} [params.history] - [{role: 'user'|'model', parts: [{text: ''}]}]
   * @param {string} [params.model]
   * @param {AbortSignal} [params.signal]
   * @param {Array<Object>} [params.tools]
   * @param {string} [params.interactionMode] - 'voice' | 'text'
   * @returns {AsyncGenerator<{text: string, isFinal: boolean, telemetry?: Object}>}
   */
  async *stream({
    prompt,
    audioPart,
    systemInstruction,
    history = [],
    model = this.defaultModel,
    signal,
    tools = [],
    interactionMode = 'text',
  }) {
    const startTime = performance.now();
    let firstTokenTime = null;
    let accumulatedText = '';
    let tokenCountEstimate = 0;
    const isVoice = interactionMode === 'voice' || (systemInstruction && systemInstruction.includes('voice call'));

    // Fallback to mock mode if explicitly enabled or no API key available
    if (this.mockMode || !this.apiKey) {
      yield* this._mockStream({prompt, systemInstruction, signal, startTime, isVoice});
      return;
    }

    try {
      const client = this.getClient();
      const userParts = [];
      if (audioPart && audioPart.data) {
        userParts.push({inlineData: {mimeType: audioPart.mimeType || 'audio/webm', data: audioPart.data}});
      }
      if (prompt) {
        userParts.push({text: prompt});
      } else if (userParts.length > 0) {
        if (isVoice) {
          userParts.push({text: 'Please listen to my speech and reply conversationally in 1-2 spoken sentences as Alex without any markdown or bullet points.'});
        } else {
          userParts.push({text: 'Please listen to my speech, understand what I said, answer me conversationally in natural English as Alex, and add Vietnamese reading notes and speaking tips.'});
        }
      }

      const contents = [
        ...history,
        {role: 'user', parts: userParts.length > 0 ? userParts : [{text: prompt || 'Hello Alex'}]},
      ];

      const config = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (tools && tools.length > 0) {
        config.tools = tools;
      }
      if (isVoice) {
        // Limit max tokens for voice calls to ensure ultra-low latency & conversational brevity
        config.maxOutputTokens = 150;
        config.temperature = 0.7;
      }

      const responseStream = await client.models.generateContentStream({
        model,
        contents,
        config,
      });

      for await (const chunk of responseStream) {
        if (signal?.aborted) {
          throw new DOMException('Aborted by user', 'AbortError');
        }

        const chunkText = chunk.text || '';
        if (chunkText) {
          if (!firstTokenTime) {
            firstTokenTime = performance.now();
          }
          accumulatedText += chunkText;
          tokenCountEstimate += Math.ceil(chunkText.length / 3.5);

          yield {
            text: chunkText,
            accumulated: accumulatedText,
            isFinal: false,
            telemetry: {
              firstTokenMs: Math.round(firstTokenTime - startTime),
              currentTokens: tokenCountEstimate,
              elapsedMs: Math.round(performance.now() - startTime),
            },
          };
        }
      }

      const totalTime = performance.now() - startTime;
      const tokensPerSec = tokenCountEstimate > 0 && totalTime > 0
        ? Math.round((tokenCountEstimate / (totalTime / 1000)))
        : 0;

      yield {
        text: '',
        accumulated: accumulatedText,
        isFinal: true,
        telemetry: {
          firstTokenMs: firstTokenTime ? Math.round(firstTokenTime - startTime) : Math.round(totalTime),
          totalTokens: tokenCountEstimate,
          totalDurationMs: Math.round(totalTime),
          tokensPerSec,
          model,
        },
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      // If network/auth fails, fallback to intelligent assistant response
      console.warn('LLMClient stream failed, using resilient fallback:', err);
      yield* this._mockStream({prompt, systemInstruction, signal, startTime, errorNotice: err.message, isVoice});
    }
  }

  /**
   * Mock streaming generator for tests and offline demonstrations.
   */
  async * _mockStream({prompt, systemInstruction, signal, startTime, errorNotice, isVoice = false}) {
    let responseText = this._generateSimulatedResponse(prompt, systemInstruction, errorNotice, isVoice);
    const words = responseText.split(' ');
    let accumulated = '';
    let firstTokenTime = null;

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) return;
      const word = words[i] + (i === words.length - 1 ? '' : ' ');
      accumulated += word;
      if (!firstTokenTime) firstTokenTime = performance.now();

      // Quick simulated delay (faster in tests)
      await new Promise((r) => setTimeout(r, 10));

      yield {
        text: word,
        accumulated,
        isFinal: false,
        telemetry: {
          firstTokenMs: Math.round(firstTokenTime - startTime),
          currentTokens: Math.ceil(accumulated.length / 3.5),
          elapsedMs: Math.round(performance.now() - startTime),
        },
      };
    }

    const totalTime = performance.now() - startTime;
    const tokens = Math.ceil(accumulated.length / 3.5);

    yield {
      text: '',
      accumulated,
      isFinal: true,
      telemetry: {
        firstTokenMs: Math.round(firstTokenTime ? firstTokenTime - startTime : totalTime),
        totalTokens: tokens,
        totalDurationMs: Math.round(totalTime),
        tokensPerSec: Math.round(tokens / (Math.max(totalTime, 1) / 1000)),
        model: 'simulated-companion-v1',
      },
    };
  }

  _generateSimulatedResponse(prompt, systemInstruction, errorNotice, isVoice = false) {
    const p = (prompt || '').toLowerCase().trim();

    // Voice mode responses: Clean, natural spoken sentences, ZERO markdown or tips
    if (isVoice) {
      if (p.includes('hello') || p.includes('hi') || p.includes('chào') || p.includes('say hello') || p.includes('hey')) {
        return 'Hello Robert! Great to hear from you. How can I help you right now?';
      }
      if (p.includes('kế hoạch') || p.includes('plan') || p.includes('today') || p.includes('hôm nay') || p.includes('báo cáo')) {
        return 'Your top priorities today are completing the Agent Core streaming pipeline and practicing 5 minutes of technical English.';
      }
      if (p.includes('english') || p.includes('tiếng anh') || p.includes('speak') || p.includes('luyện nói')) {
        return 'Let us practice speaking English. Tell me about the system architecture you are working on today.';
      }
      if (p.includes('code') || p.includes('system') || p.includes('kiến trúc') || p.includes('task')) {
        return 'I am ready to analyze system architecture and engineering tasks with you. What module would you like to review?';
      }
      return `Hello Robert! I am listening. Let me know what you would like to work on.`;
    }

    // Text mode responses: Rich, structured layout with tips and formatting
    let prefix = errorNotice ? `*(Offline mode / API Key required for live cloud models)*\n\n` : '';

    if (p.includes('hello') || p.includes('hi') || p.includes('chào') || p.includes('say hello') || p.includes('hey')) {
      return prefix + `Hello Robert! Great to hear from you. I am Alex, your AI Co-pilot and English Speaking Coach.\n\n` +
        `How is your day going? What would you like us to work on today?\n\n` +
        `💡 *English Speaking Tip:* You can say: *"Alex, let's review today's technical priorities."*`;
    }

    if (p.includes('kế hoạch') || p.includes('plan') || p.includes('today') || p.includes('hôm nay') || p.includes('báo cáo')) {
      return prefix + `Hello Robert! Here is your daily plan (kế hoạch) and top 3 priorities for today:\n\n` +
        `1. AI & Engineering: Complete the Agent Core architecture and low-latency streaming pipeline.\n` +
        `2. English Speaking: 5-minute technical discussion on system scalability and decoupled architecture.\n` +
        `3. Strategic Execution: Review project milestones and decision logs.\n\n` +
        `💡 *Natural English Phrasing:* *"Alex, let's break down today's most important milestones."*`;
    }

    if (p.includes('english') || p.includes('tiếng anh') || p.includes('speak') || p.includes('luyện nói')) {
      return prefix + `Hello Robert! I am Alex. Let's practice technical English communication.\n\n` +
        `Today's key collocation: "Decoupled Architecture" (/diːˈkʌpld ˈɑːrkɪtektʃər/).\n` +
        `Sample sentence: "By decoupling the agent runtime from the presentation layer, we ensure sub-second response times and high concurrency."\n\n` +
        `💡 *Pronunciation Tip:* Stress the first syllable in "Decoupled" and "Architecture".`;
    }

    if (p.includes('code') || p.includes('system') || p.includes('kiến trúc') || p.includes('task')) {
      return prefix + `Hi Robert, Alex here. I am ready to dive into system architecture and engineering tasks with you. What specific module would you like to analyze?`;
    }

    return prefix + `Hello Robert! I received your query: "${prompt}".\n\n` +
      `I am Alex, your AI Assistant and English Mentor. I am ready to help you plan, code, and level up your English fluency.\n\n` +
      `💡 *In Natural English:* You can ask me: *"Alex, what is the best strategy to implement this?"*`;
  }
}
