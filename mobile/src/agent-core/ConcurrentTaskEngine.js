/**
 * High-Performance Concurrent Task Engine for Personal AI Agent.
 * Manages parallel background tasks, priority queues, live execution progress,
 * and asynchronous workers without blocking interactive conversation.
 */

export const TASK_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const TASK_PRIORITY = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export class ConcurrentTaskEngine {
  /**
   * @param {Object} options
   * @param {number} [options.maxConcurrent=3]
   */
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 3;
    this.tasks = new Map();
    this.queue = [];
    this.activeWorkers = 0;
    this.listeners = new Set();
  }

  /**
   * Subscribe to task lifecycle updates
   * @param {Function} callback - (task, eventType) => void
   * @returns {Function} unsubscribe
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify(task, eventType) {
    this.listeners.forEach((fn) => {
      try {
        fn(task, eventType);
      } catch (e) {
        console.error('Task listener error:', e);
      }
    });
  }

  /**
   * Dispatch a background task to the concurrency queue.
   * @param {Object} params
   * @param {string} params.title
   * @param {string} [params.type='GENERAL']
   * @param {number} [params.priority=TASK_PRIORITY.MEDIUM]
   * @param {Function} params.executor - async ({updateProgress, signal}) => result
   * @returns {Object} task object
   */
  dispatch({
    title,
    type = 'GENERAL',
    priority = TASK_PRIORITY.MEDIUM,
    executor,
  }) {
    if (typeof executor !== 'function') {
      throw new Error('Task executor must be an async function.');
    }

    const taskId = 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const controller = new AbortController();

    const task = {
      id: taskId,
      title,
      type,
      priority,
      status: TASK_STATUS.QUEUED,
      progress: 0,
      statusMessage: 'Đang xếp hàng chờ xử lý...',
      result: null,
      error: null,
      startTime: null,
      endTime: null,
      durationMs: 0,
      _executor: executor,
      _controller: controller,
    };

    this.tasks.set(taskId, task);
    this.queue.push(task);

    // Sort queue by priority (lower number = higher priority)
    this.queue.sort((a, b) => a.priority - b.priority);

    this._notify(task, 'queued');
    this._processQueue();

    return task;
  }

  /**
   * Get all tasks (both active and finished)
   */
  getTasks() {
    return Array.from(this.tasks.values()).reverse();
  }

  getRunningCount() {
    return this.activeWorkers;
  }

  getQueuedCount() {
    return this.queue.length;
  }

  /**
   * Cancel a task by ID
   */
  cancel(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    if (task.status === TASK_STATUS.QUEUED) {
      this.queue = this.queue.filter((t) => t.id !== taskId);
      task.status = TASK_STATUS.CANCELLED;
      task.statusMessage = 'Đã hủy tác vụ';
      this._notify(task, 'cancelled');
      return true;
    }

    if (task.status === TASK_STATUS.RUNNING) {
      task._controller.abort();
      task.status = TASK_STATUS.CANCELLED;
      task.statusMessage = 'Đã hủy giữa chừng';
      this._notify(task, 'cancelled');
      return true;
    }

    return false;
  }

  /**
   * Process next tasks from the priority queue
   */
  async _processQueue() {
    while (this.activeWorkers < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task || task.status === TASK_STATUS.CANCELLED) continue;

      this.activeWorkers++;
      this._runTask(task);
    }
  }

  async _runTask(task) {
    task.status = TASK_STATUS.RUNNING;
    task.startTime = performance.now();
    task.statusMessage = 'Đang thực thi tác vụ...';
    this._notify(task, 'started');

    const updateProgress = (pct, msg) => {
      if (task.status !== TASK_STATUS.RUNNING) return;
      task.progress = Math.min(100, Math.max(0, Math.round(pct)));
      if (msg) task.statusMessage = msg;
      this._notify(task, 'progress');
    };

    try {
      const res = await task._executor({
        updateProgress,
        signal: task._controller.signal,
      });

      if (task._controller.signal.aborted) {
        task.status = TASK_STATUS.CANCELLED;
        task.statusMessage = 'Đã hủy tác vụ';
      } else {
        task.status = TASK_STATUS.COMPLETED;
        task.progress = 100;
        task.statusMessage = 'Hoàn thành xuất sắc';
        task.result = res;
      }
    } catch (err) {
      if (task._controller.signal.aborted) {
        task.status = TASK_STATUS.CANCELLED;
        task.statusMessage = 'Đã hủy';
      } else {
        task.status = TASK_STATUS.FAILED;
        task.error = err.message || 'Lỗi không xác định';
        task.statusMessage = `Thất bại: ${task.error}`;
      }
    } finally {
      task.endTime = performance.now();
      task.durationMs = Math.round(task.endTime - task.startTime);
      this.activeWorkers--;
      this._notify(task, task.status);
      this._processQueue();
    }
  }
}
