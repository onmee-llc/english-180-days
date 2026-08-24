import {describe, it, expect} from 'vitest';
import {LLMClient} from './LLMClient.js';

describe('LLMClient', () => {
  it('initializes with default model and mock mode', () => {
    const client = new LLMClient({mockMode: true});
    expect(client.defaultModel).toBe('gemini-2.5-flash');
    expect(client.mockMode).toBe(true);
  });

  it('streams simulated response in mock mode', async () => {
    const client = new LLMClient({mockMode: true});
    const chunks = [];
    let finalTelemetry = null;

    for await (const chunk of client.stream({prompt: 'Lập kế hoạch hôm nay'})) {
      chunks.push(chunk);
      if (chunk.isFinal) {
        finalTelemetry = chunk.telemetry;
      }
    }

    expect(chunks.length).toBeGreaterThan(1);
    const lastChunk = chunks[chunks.length - 1];
    expect(lastChunk.isFinal).toBe(true);
    expect(lastChunk.accumulated.toLowerCase()).toContain('kế hoạch');
    expect(finalTelemetry).toBeDefined();
    expect(finalTelemetry.totalTokens).toBeGreaterThan(0);
  });

  it('supports abort signal to cancel stream', async () => {
    const client = new LLMClient({mockMode: true});
    const controller = new AbortController();

    const streamPromise = (async () => {
      const chunks = [];
      for await (const chunk of client.stream({
        prompt: 'Hello AI companion',
        signal: controller.signal,
      })) {
        chunks.push(chunk);
        controller.abort();
      }
      return chunks;
    })();

    const result = await streamPromise;
    expect(result.length).toBeLessThan(10);
  });
});
