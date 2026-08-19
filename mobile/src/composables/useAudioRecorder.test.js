import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

// Minimal fake of the browser MediaRecorder — real one isn't available in
// the vitest node environment. Mirrors the event sequence a real
// MediaRecorder fires on stop(): a final 'dataavailable' with the tail
// chunk, then 'stop'.
class FakeMediaRecorder {
  constructor(stream, options) {
    this.stream = stream;
    this.mimeType = options?.mimeType || 'audio/webm';
    this.listeners = {};
  }
  addEventListener(event, cb) {
    (this.listeners[event] ||= []).push(cb);
  }
  start() {}
  stop() {
    this.listeners.dataavailable?.forEach((cb) =>
      cb({data: new Blob(['chunk'], {type: this.mimeType})}),
    );
    this.listeners.stop?.forEach((cb) => cb());
  }
}
FakeMediaRecorder.isTypeSupported = () => true;

const stopTrack = vi.fn();
const getUserMedia = vi.fn(async () => ({
  getTracks: () => [{stop: stopTrack}],
}));

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
  vi.stubGlobal('navigator', {mediaDevices: {getUserMedia}});
  getUserMedia.mockClear();
  stopTrack.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useAudioRecorder', () => {
  it('discards a recording shorter than the minimum duration', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1100); // stop, 100ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    await startRecording();
    const result = await stopRecording();

    expect(result.blob).toBeNull();
    expect(result.reason).toMatch(/100ms/);
    expect(stopTrack).toHaveBeenCalled();
  });

  it('accepts a recording exactly at the minimum duration boundary', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1300); // stop, exactly 300ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    await startRecording();
    const result = await stopRecording();

    expect(result).not.toBeNull();
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it('returns the recorded blob and mimeType once past the minimum duration', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1500); // stop, 500ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    await startRecording();
    const result = await stopRecording();

    expect(result.mimeType).toBe('audio/webm;codecs=opus');
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it('lets a racing stopRecording() wait out a still-starting startRecording()', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1500); // stop, 500ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    const startPromise = startRecording(); // not awaited — simulates a fast tap
    const result = await stopRecording();

    await startPromise;
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it('stops a prior recording before starting a new one if startRecording() is called again', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // first startedAt
    dateSpy.mockReturnValueOnce(1500); // stop, 500ms later (triggers cleanup)
    dateSpy.mockReturnValueOnce(2000); // second startedAt

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording} = useAudioRecorder();

    await startRecording();
    stopTrack.mockClear();

    await startRecording();

    expect(stopTrack).toHaveBeenCalled();
  });
});
