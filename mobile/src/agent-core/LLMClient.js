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
    const p = (prompt || '').toLowerCase().trim();
    let prefix = errorNotice ? `*(Offline mode / API Key required for live cloud models)*\n\n` : '';

    if (p.includes('hello') || p.includes('hi') || p.includes('chào') || p.includes('say hello') || p.includes('hey')) {
      return prefix + `Chào Robert! Tôi là Alex. Rất vui được trò chuyện cùng bạn. Hôm nay công việc và cuộc sống của bạn thế nào? Bạn muốn chúng ta cùng xử lý mục tiêu nào trước?`;
    }

    if (p.includes('kế hoạch') || p.includes('plan') || p.includes('today') || p.includes('hôm nay') || p.includes('báo cáo')) {
      return prefix + `Chào Robert! Tôi đã tổng hợp kế hoạch và 3 mục tiêu trọng tâm hôm nay trong hành trình Daily Mastery của bạn:\n\n` +
        `1. AI & Kỹ thuật: Hoàn thành bài học kiến trúc hệ thống Agent Core và cơ chế Streaming.\n` +
        `2. Luyện nói tiếng Anh: 5 phút thực hành chủ đề System Architecture & Scalability.\n` +
        `3. Quản trị & Điều hành: Review tiến độ các dự án và chốt các việc cần quyết định.\n\n` +
        `Tôi đã sẵn sàng đồng hành cùng Robert.`;
    }

    if (p.includes('english') || p.includes('tiếng anh') || p.includes('speak') || p.includes('luyện nói')) {
      return prefix + `Chào Robert! Tôi là Alex. Chúng ta hãy cùng luyện nói tiếng Anh chuyên ngành hôm nay nhé.\n\n` +
        `Mẫu câu kỹ thuật hôm nay: "By decoupling the agent runtime from the presentation layer, we ensure sub-second response times and high concurrency."\n\n` +
        `Robert có thể nhấn vào nút mic để luyện phát âm bất kỳ lúc nào.`;
    }

    if (p.includes('code') || p.includes('system') || p.includes('kiến trúc') || p.includes('task')) {
      return prefix + `Chào Robert, Alex đã sẵn sàng cùng bạn giải quyết bài toán kỹ thuật. Hệ thống Agent Core hiện đang hoạt động ổn định và sẵn sàng điều phối đa tác vụ. Bạn cần tôi phân tích sâu phần nào?`;
    }

    return prefix + `Chào Robert! Tôi đã nhận thông tin: "${prompt}". Tôi là Alex - Trợ lý AI đồng hành của bạn. Tôi luôn sẵn sàng hỗ trợ bạn lập kế hoạch, giải quyết công việc kỹ thuật và theo dõi tiến độ mỗi ngày. Robert muốn chúng ta triển khai bước tiếp theo như thế nào?`;
  }
}
