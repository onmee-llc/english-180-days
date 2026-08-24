import {describe, it, expect, beforeEach} from 'vitest';
import {MemoryStore} from './MemoryStore.js';

describe('MemoryStore', () => {
  let memory;

  beforeEach(() => {
    memory = new MemoryStore();
    memory.clear();
  });

  it('initializes with default profile and channels', () => {
    const profile = memory.getProfile();
    expect(profile.name).toBe('Robert');
    const messages = memory.getThreadMessages('companion');
    expect(messages.length).toBe(1);
    expect(messages[0].role).toBe('model');
  });

  it('adds and updates messages in a thread', () => {
    const newMsg = memory.addMessage('companion', {
      role: 'user',
      content: 'Chào bạn',
    });
    expect(newMsg.id).toBeDefined();

    const thread = memory.getThreadMessages('companion');
    expect(thread.length).toBe(2);

    memory.updateMessage('companion', newMsg.id, {content: 'Chào bạn nhé'});
    const updated = memory.getThreadMessages('companion').find((m) => m.id === newMsg.id);
    expect(updated.content).toBe('Chào bạn nhé');
  });

  it('manages tasks list', () => {
    const task = memory.addTask({
      id: 't_test',
      title: 'Học bài 12',
      completed: false,
    });
    expect(memory.getTasks()).toContainEqual(task);

    memory.toggleTask('t_test');
    expect(memory.getTasks().find((t) => t.id === 't_test').completed).toBe(true);

    memory.deleteTask('t_test');
    expect(memory.getTasks().find((t) => t.id === 't_test')).toBeUndefined();
  });

  it('partitions messages by today and archives past days', () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = '2026-08-20';

    // Add yesterday message
    memory.addMessage('companion', {
      role: 'user',
      content: 'Câu hỏi hôm qua',
      timestamp: `${yesterday}T10:00:00.000Z`,
    });

    // Add today message
    memory.addMessage('companion', {
      role: 'user',
      content: 'Câu hỏi hôm nay',
      timestamp: `${today}T11:00:00.000Z`,
    });

    const todayMsgs = memory.getTodayThreadMessages('companion', today);
    expect(todayMsgs.some((m) => m.content === 'Câu hỏi hôm nay')).toBe(true);
    expect(todayMsgs.some((m) => m.content === 'Câu hỏi hôm qua')).toBe(false);

    const archived = memory.getArchivedMessages('companion', today);
    expect(archived.some((m) => m.content === 'Câu hỏi hôm qua')).toBe(true);
    expect(memory.hasPastArchivedMessages('companion', today)).toBe(true);
  });
});
