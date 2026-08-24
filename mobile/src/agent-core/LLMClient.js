import {GoogleGenAI} from '@google/genai';

export const DEFAULT_MODEL = 'gemini-2.5-flash';

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
   * @param {string} params.prompt
   * @param {string} [params.systemInstruction]
   * @param {Array<Object>} [params.history] - [{role: 'user'|'model', parts: [{text: ''}]}]
   * @param {string} [params.model]
   * @param {AbortSignal} [params.signal]
   * @param {Array<Object>} [params.tools]
   * @returns {AsyncGenerator<{text: string, isFinal: boolean, telemetry?: Object}>}
   */
  async *stream({
    prompt,
    systemInstruction,
    history = [],
    model = this.defaultModel,
    signal,
    tools = [],
  }) {
    const startTime = performance.now();
    let firstTokenTime = null;
    let accumulatedText = '';
    let tokenCountEstimate = 0;

    // Fallback to mock mode if explicitly enabled or no API key available
    if (this.mockMode || !this.apiKey) {
      yield* this._mockStream({prompt, systemInstruction, signal, startTime});
      return;
    }

    try {
      const client = this.getClient();
      const contents = [
        ...history,
        {role: 'user', parts: [{text: prompt}]},
      ];

      const config = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (tools && tools.length > 0) {
        config.tools = tools;
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
      yield* this._mockStream({prompt, systemInstruction, signal, startTime, errorNotice: err.message});
    }
  }

  /**
   * Mock streaming generator for tests and offline demonstrations.
   */
  async * _mockStream({prompt, systemInstruction, signal, startTime, errorNotice}) {
    let responseText = this._generateSimulatedResponse(prompt, systemInstruction, errorNotice);
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

  _generateSimulatedResponse(prompt, systemInstruction, errorNotice) {
    const p = prompt.toLowerCase();
    let prefix = errorNotice ? `*(Offline mode / API Key required for live cloud models)*\n\n` : '';

    if (p.includes('kế hoạch') || p.includes('plan') || p.includes('today') || p.includes('hôm nay')) {
      return prefix + `Chào Robert! Tôi là Alex. Tôi đã phân tích kế hoạch và mục tiêu hôm nay trong chương trình Daily Mastery 180 ngày:\n\n` +
        `### [Mục Tiêu Trọng Tâm Hôm Nay]\n` +
        `1. **AI / LLM Track:** Hoàn thành bài học kiến trúc Agent Core và cơ chế Streaming SSE.\n` +
        `2. **English Practice:** Luyện nói 5 phút về chủ đề *System Architecture & Scalability*.\n` +
        `3. **Finance & Execution:** Review danh mục đầu tư và chốt tiến độ sprint tuần.\n\n` +
        `Tôi đã sẵn sàng hỗ trợ Robert thực hiện các bước trên.`;
    }

    if (p.includes('english') || p.includes('tiếng anh') || p.includes('speak') || p.includes('nói')) {
      return prefix + `Hello Robert! I am Alex, your English Coach. Let's practice speaking and technical English.\n\n` +
        `**Today's Collocation:** *"Decoupled Architecture"* (Kiến trúc phân tách độc lập)\n` +
        `**Sample Sentence:** *"By decoupling the agent runtime from the presentation layer, we ensure sub-second response times and high concurrency."*\n\n` +
        `Robert có thể sử dụng nút ghi âm bên dưới để phát âm và nhận phân tích ngay.`;
    }

    if (p.includes('code') || p.includes('system') || p.includes('kiến trúc') || p.includes('task')) {
      return prefix + `Chào Robert, Alex đây. Tôi sẵn sàng cùng bạn xử lý tác vụ kỹ thuật!\n\n` +
        `\`\`\`javascript\n// Concurrency Engine: Dispatch background task\nconst task = await taskEngine.dispatch({\n  title: 'Audit System Latency',\n  type: 'ANALYSIS',\n  priority: 'HIGH'\n});\n\`\`\`\n\n` +
        `Hệ thống Agent Core hiện đã sẵn sàng điều phối đa tác vụ song song. Robert cần tôi phân tích sâu phần nào?`;
    }

    return prefix + `Tôi là Alex - Trợ lý AI cá nhân Daily Mastery của Robert. Tôi luôn sẵn sàng cùng bạn lên kế hoạch, giải quyết công việc kỹ thuật, luyện giao tiếp tiếng Anh và theo dõi hành trình 180 ngày hoàn thiện bản thân.\n\nRobert muốn chúng ta bắt đầu với nhiệm vụ nào hôm nay?`;
  }
}
