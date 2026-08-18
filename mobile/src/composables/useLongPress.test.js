import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {createPressGesture} from './useLongPress.js';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('createPressGesture', () => {
  it('does not fire onLongPress and reports a tap when released before the threshold', () => {
    const onLongPress = vi.fn();
    const gesture = createPressGesture({thresholdMs: 250, onLongPress});

    gesture.start();
    vi.advanceTimersByTime(100);
    const wasLongPress = gesture.end();

    expect(onLongPress).not.toHaveBeenCalled();
    expect(wasLongPress).toBe(false);
  });

  it('fires onLongPress and reports a hold once the threshold elapses while still pressed', () => {
    const onLongPress = vi.fn();
    const gesture = createPressGesture({thresholdMs: 250, onLongPress});

    gesture.start();
    vi.advanceTimersByTime(250);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(gesture.end()).toBe(true);
  });

  it('cancel() suppresses a pending long press without reporting a tap', () => {
    const onLongPress = vi.fn();
    const gesture = createPressGesture({thresholdMs: 250, onLongPress});

    gesture.start();
    gesture.cancel();
    vi.advanceTimersByTime(250);

    expect(onLongPress).not.toHaveBeenCalled();
  });
});
