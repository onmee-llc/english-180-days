import {describe, it, expect, vi, beforeEach} from 'vitest';

const startRecording = vi.fn(async () => {});
const stopRecording = vi.fn(async () => null);
vi.mock('./useAudioRecorder.js', () => ({
  useAudioRecorder: () => ({startRecording, stopRecording}),
}));

const transcribeAndTranslate = vi.fn(async () => ({
  vietnameseText: 'xin chào',
  englishSentence: 'Where are your shoes?',
  ipa: '/x/',
  explanation: 'vi',
}));
vi.mock('./useGeminiTranslate.js', () => ({transcribeAndTranslate}));

const apiKey = {value: 'test-key'};
const initApiKey = vi.fn(async () => {});
vi.mock('./useApiKey.js', () => ({
  useApiKey: () => ({apiKey, init: initApiKey}),
}));

const addEntry = vi.fn(async () => {});
const initHistory = vi.fn(async () => {});
vi.mock('./useTranslateHistory.js', () => ({
  useTranslateHistory: () => ({
    history: {value: []},
    init: initHistory,
    addEntry,
  }),
}));

const push = vi.fn();
vi.mock('vue-router', () => ({useRouter: () => ({push})}));

const fakeRecording = {blob: new Blob(['audio']), mimeType: 'audio/webm'};

beforeEach(() => {
  vi.resetModules();
  apiKey.value = 'test-key';
  startRecording.mockClear();
  stopRecording.mockReset().mockResolvedValue(null);
  transcribeAndTranslate.mockClear();
  initApiKey.mockClear();
  addEntry.mockClear();
  initHistory.mockClear();
  push.mockClear();
});

describe('useSpeakSession', () => {
  it('sends the user to Settings instead of recording when no API key is set', async () => {
    apiKey.value = '';
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, status} = useSpeakSession();

    const started = await handlePressStart();

    expect(started).toBe(false);
    expect(push).toHaveBeenCalledWith({name: 'settings'});
    expect(startRecording).not.toHaveBeenCalled();
    expect(status.value).toBe('idle');
  });

  it('shares recording state across separate useSpeakSession() callers', async () => {
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const fromNav = useSpeakSession();
    const fromSpeakView = useSpeakSession();

    await fromNav.handlePressStart();

    expect(fromSpeakView.status.value).toBe('recording');
  });

  it('shows a retry-able error when nothing was recorded', async () => {
    stopRecording.mockResolvedValue(null);
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, status, errorMessage} =
      useSpeakSession();

    await handlePressStart();
    await handlePressEnd();

    expect(status.value).toBe('error');
    expect(errorMessage.value).toMatch(/Didn't catch that/);
    expect(transcribeAndTranslate).not.toHaveBeenCalled();
  });

  it('transcribes, translates, and records history on a successful hold', async () => {
    stopRecording.mockResolvedValue(fakeRecording);
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {
      handlePressStart,
      handlePressEnd,
      status,
      result,
      lastVietnameseText,
    } = useSpeakSession();

    await handlePressStart();
    await handlePressEnd();

    expect(status.value).toBe('result');
    expect(lastVietnameseText.value).toBe('xin chào');
    expect(result.value.englishSentence).toBe('Where are your shoes?');
    expect(addEntry).toHaveBeenCalledWith(
      expect.objectContaining({vietnameseText: 'xin chào'}),
    );
  });

  it('retries with the same audio instead of asking the user to re-record', async () => {
    stopRecording.mockResolvedValue(fakeRecording);
    transcribeAndTranslate.mockRejectedValueOnce(new Error('network down'));
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, retry, status, result} =
      useSpeakSession();

    await handlePressStart();
    await handlePressEnd();
    expect(status.value).toBe('error');

    await retry();

    expect(status.value).toBe('result');
    expect(result.value.englishSentence).toBe('Where are your shoes?');
    expect(transcribeAndTranslate).toHaveBeenCalledTimes(2);
  });

  it('does not replay a prior successful translation when a second attempt fails', async () => {
    stopRecording.mockResolvedValue(fakeRecording);
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {
      handlePressStart,
      handlePressEnd,
      retry,
      status,
      errorMessage,
      result,
    } = useSpeakSession();

    // First attempt succeeds and leaves a real translation in place.
    await handlePressStart();
    await handlePressEnd();
    expect(status.value).toBe('result');
    expect(transcribeAndTranslate).toHaveBeenCalledTimes(1);

    // Second attempt fails before any new audio is captured.
    stopRecording.mockResolvedValue(null);
    await handlePressStart();
    await handlePressEnd();
    expect(status.value).toBe('error');
    expect(errorMessage.value).toMatch(/Didn't catch that/);

    // Retrying after the second, audio-less failure must not resurrect the
    // first attempt's stale blob/result.
    await retry();

    expect(status.value).toBe('idle');
    expect(result.value).toBe(null);
    expect(transcribeAndTranslate).toHaveBeenCalledTimes(1);
  });
});
