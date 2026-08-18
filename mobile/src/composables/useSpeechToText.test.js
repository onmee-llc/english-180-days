import {describe, it, expect, vi, beforeEach} from 'vitest';

// Android's on-device recognizer ends its native session on its own VAD
// (short pause) even while the user still holds the mic — this mock lets
// tests fire that 'listeningState: stopped' event mid-hold, same as the
// real plugin does, to prove the composable recovers instead of losing
// everything spoken after the silent session death.
const listeners = {};
const start = vi.fn(async () => {});
const stop = vi.fn(async () => {});
const checkPermissions = vi.fn(async () => ({speechRecognition: 'granted'}));
const requestPermissions = vi.fn(async () => ({speechRecognition: 'granted'}));
const addListener = vi.fn(async (event, cb) => {
  (listeners[event] ||= []).push(cb);
  return {
    remove: vi.fn(async () => {
      listeners[event] = listeners[event].filter((fn) => fn !== cb);
    }),
  };
});

function emit(event, data) {
  (listeners[event] || []).forEach((cb) => cb(data));
}

vi.mock('@capacitor-community/speech-recognition', () => ({
  SpeechRecognition: {
    checkPermissions,
    requestPermissions,
    addListener,
    start,
    stop,
  },
}));

beforeEach(() => {
  vi.resetModules();
  Object.keys(listeners).forEach((k) => delete listeners[k]);
  start.mockClear();
  stop.mockClear();
  checkPermissions.mockClear();
  requestPermissions.mockClear();
  addListener.mockClear();
});

describe('useSpeechToText', () => {
  it('carries the transcript forward across a native mid-hold session restart', async () => {
    const {useSpeechToText} = await import('./useSpeechToText.js');
    const {startListening, stopListening} = useSpeechToText();

    await startListening();
    emit('partialResults', {matches: ['xin chào']});

    // Native VAD ends the session on its own while the mic is still held.
    emit('listeningState', {status: 'stopped'});
    // Give the async restart (awaited addListener/start calls) a tick.
    await Promise.resolve();
    await Promise.resolve();

    emit('partialResults', {matches: ['tôi khỏe']});

    const text = await stopListening();

    expect(text).toBe('xin chào tôi khỏe');
    expect(start).toHaveBeenCalledTimes(2);
  });
});
