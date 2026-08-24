import {describe, it, expect} from 'vitest';
import {ConcurrentTaskEngine, TASK_STATUS, TASK_PRIORITY} from './ConcurrentTaskEngine.js';

describe('ConcurrentTaskEngine', () => {
  it('executes tasks asynchronously with progress updates', async () => {
    const engine = new ConcurrentTaskEngine({maxConcurrent: 2});
    const updates = [];

    engine.subscribe((task, event) => {
      updates.push({id: task.id, status: task.status, event, progress: task.progress});
    });

    const task = engine.dispatch({
      title: 'Analyze Data',
      executor: async ({updateProgress}) => {
        updateProgress(50, 'Halfway there');
        await new Promise((r) => setTimeout(r, 20));
        updateProgress(100, 'Done');
        return {analyzed: 42};
      },
    });

    expect(task.status).toBe(TASK_STATUS.RUNNING);

    await new Promise((r) => setTimeout(r, 60));

    expect(task.status).toBe(TASK_STATUS.COMPLETED);
    expect(task.result).toEqual({analyzed: 42});
    expect(task.durationMs).toBeGreaterThan(0);
    expect(updates.some((u) => u.progress === 50)).toBe(true);
  });

  it('respects concurrency limit and queues extra tasks', async () => {
    const engine = new ConcurrentTaskEngine({maxConcurrent: 1});

    let task1Finished = false;
    let task2Started = false;

    const task1 = engine.dispatch({
      title: 'Task 1',
      executor: async () => {
        await new Promise((r) => setTimeout(r, 40));
        task1Finished = true;
      },
    });

    const task2 = engine.dispatch({
      title: 'Task 2',
      executor: async () => {
        task2Started = true;
      },
    });

    expect(task1.status).toBe(TASK_STATUS.RUNNING);
    expect(task2.status).toBe(TASK_STATUS.QUEUED);
    expect(task2Started).toBe(false);

    await new Promise((r) => setTimeout(r, 80));

    expect(task1Finished).toBe(true);
    expect(task1.status).toBe(TASK_STATUS.COMPLETED);
    expect(task2.status).toBe(TASK_STATUS.COMPLETED);
    expect(task2Started).toBe(true);
  });

  it('supports cancelling a task', async () => {
    const engine = new ConcurrentTaskEngine({maxConcurrent: 2});

    const task = engine.dispatch({
      title: 'Long Job',
      executor: async ({signal}) => {
        await new Promise((r) => setTimeout(r, 100));
        if (signal.aborted) return;
        return 'done';
      },
    });

    expect(task.status).toBe(TASK_STATUS.RUNNING);
    const cancelled = engine.cancel(task.id);
    expect(cancelled).toBe(true);
    expect(task.status).toBe(TASK_STATUS.CANCELLED);
  });
});
