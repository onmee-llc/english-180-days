import {describe, it, expect} from 'vitest';
import {ToolRegistry, createDefaultToolRegistry} from './ToolRegistry.js';

describe('ToolRegistry', () => {
  it('registers and executes custom tools', async () => {
    const registry = new ToolRegistry();
    registry.register({
      name: 'add_numbers',
      description: 'Add two numbers',
      parameters: {
        type: 'object',
        properties: {
          a: {type: 'number'},
          b: {type: 'number'},
        },
        required: ['a', 'b'],
      },
      execute: async ({a, b}) => a + b,
    });

    expect(registry.has('add_numbers')).toBe(true);
    const execution = await registry.execute('add_numbers', {a: 5, b: 7});
    expect(execution.success).toBe(true);
    expect(execution.result).toBe(12);
  });

  it('handles unregistered tools gracefully', async () => {
    const registry = new ToolRegistry();
    const result = await registry.execute('non_existent_tool', {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('is not registered');
  });

  it('creates default built-in tools', async () => {
    const tasks = [];
    const mockTaskStore = {
      getTasks: () => tasks,
      addTask: (t) => tasks.push(t),
      toggleTask: (id) => {
        const t = tasks.find((x) => x.id === id);
        if (t) t.completed = !t.completed;
        return t;
      },
    };

    const registry = createDefaultToolRegistry({taskStore: mockTaskStore});
    expect(registry.has('manage_tasks')).toBe(true);
    expect(registry.has('code_runner')).toBe(true);
    expect(registry.has('mastery_tracker')).toBe(true);

    const taskResult = await registry.execute('manage_tasks', {
      action: 'create',
      title: 'Review System Design',
      category: 'work',
    });

    expect(taskResult.success).toBe(true);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Review System Design');
  });

  it('formats tools into Gemini schema format', () => {
    const registry = createDefaultToolRegistry();
    const geminiTools = registry.toGeminiTools();
    expect(geminiTools.length).toBe(1);
    expect(geminiTools[0].functionDeclarations).toBeDefined();
    expect(geminiTools[0].functionDeclarations.length).toBeGreaterThan(0);
  });
});
