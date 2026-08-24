import {describe, it, expect, beforeEach} from 'vitest';
import {AgentRuntime} from './AgentRuntime.js';

describe('AgentRuntime', () => {
  let runtime;

  beforeEach(() => {
    runtime = new AgentRuntime({mockMode: true});
    runtime.getMemory().clear();
  });

  it('initializes with memory, tools, and task engine', () => {
    expect(runtime.getMemory()).toBeDefined();
    expect(runtime.getToolRegistry()).toBeDefined();
    expect(runtime.getTaskEngine()).toBeDefined();
  });

  it('processes streaming prompt and updates memory thread', async () => {
    const tokens = [];
    const finalMsg = await runtime.sendPrompt({
      channelId: 'companion',
      prompt: 'Lập kế hoạch công việc hôm nay',
      onToken: (chunk) => tokens.push(chunk.text),
    });

    expect(tokens.length).toBeGreaterThan(0);
    expect(finalMsg).toBeDefined();
    expect(finalMsg.role).toBe('model');
    expect(finalMsg.content.toLowerCase()).toContain('kế hoạch');

    const thread = runtime.getMemory().getThreadMessages('companion');
    expect(thread.length).toBe(3); // Initial welcome + User msg + Model response
  });

  it('handles background execution mode without blocking', async () => {
    const ackMsg = await runtime.sendPrompt({
      channelId: 'engineering',
      prompt: 'Phân tích kiến trúc hệ thống phân tán',
      mode: 'background',
    });

    expect(ackMsg.role).toBe('model');
    expect(ackMsg.actionCards.length).toBe(1);
    expect(ackMsg.actionCards[0].type).toBe('TASK_QUEUED');

    const tasks = runtime.getTaskEngine().getTasks();
    expect(tasks.length).toBe(1);
  });
});
