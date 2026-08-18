import {describe, it, expect, vi, beforeEach} from 'vitest';
import {ref} from 'vue';

const partialText = ref('');
const startListening = vi.fn(async () => {});
const stopListening = vi.fn(async () => '');
vi.mock('./useSpeechToText.js', () => ({
  useSpeechToText: () => ({partialText, startListening, stopListening}),
}));

const translateToEnglish = vi.fn(async () => ({
  englishSentence: 'Where are your shoes?',
  ipa: '/x/',
  explanation: 'vi',
}));
vi.mock('./useGeminiTranslate.js', () => ({translateToEnglish}));

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

beforeEach(() => {
  vi.resetModules();
  partialText.value = '';
  apiKey.value = 'test-key';
  startListening.mockClear();
  stopListening.mockReset().mockResolvedValue('');
  translateToEnglish.mockClear();
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
    expect(startListening).not.toHaveBeenCalled();
    expect(status.value).toBe('idle');
  });

  it('shares recording state across separate useSpeakSession() callers', async () => {
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const fromNav = useSpeakSession();
    const fromSpeakView = useSpeakSession();

    await fromNav.handlePressStart();

    expect(fromSpeakView.status.value).toBe('recording');
  });

  it('shows a retry-able error when nothing was transcribed', async () => {
    stopListening.mockResolvedValue('   ');
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, status, errorMessage} =
      useSpeakSession();

    await handlePressStart();
    await handlePressEnd();

    expect(status.value).toBe('error');
    expect(errorMessage.value).toMatch(/Didn't catch that/);
    expect(translateToEnglish).not.toHaveBeenCalled();
  });

  it('translates the transcript and records history on a successful hold', async () => {
    stopListening.mockResolvedValue('xin chào');
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, status, result} =
      useSpeakSession();

    await handlePressStart();
    await handlePressEnd();

    expect(status.value).toBe('result');
    expect(result.value.englishSentence).toBe('Where are your shoes?');
    expect(addEntry).toHaveBeenCalledWith(
      expect.objectContaining({vietnameseText: 'xin chào'}),
    );
  });
});
