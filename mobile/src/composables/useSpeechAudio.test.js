import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {useSpeechAudio, splitIntoSentences, SPEEDS, getPreferredVoice, playTtsAudio} from './useSpeechAudio.js';

describe('useSpeechAudio', () => {
  let mockUtteranceInstance;
  let mockVoices = [];
  let mockAudioInstance;

  beforeEach(() => {
    mockVoices = [
      {name: 'Google US English', lang: 'en-US'},
      {name: 'Samantha', lang: 'en-US'},
      {name: 'David', lang: 'en-US'},
      {name: 'Google Tiếng Việt Nam', lang: 'vi-VN'},
    ];

    mockUtteranceInstance = {
      text: '',
      lang: '',
      rate: 1,
      pitch: 1,
      voice: null,
      onstart: null,
      onend: null,
      onerror: null,
    };

    mockAudioInstance = {
      src: '',
      playbackRate: 1,
      play: vi.fn().mockResolvedValue(),
      pause: vi.fn(),
      onended: null,
      onerror: null,
    };

    global.Audio = vi.fn().mockImplementation(() => mockAudioInstance);

    global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => {
      mockUtteranceInstance.text = text;
      return mockUtteranceInstance;
    });

    global.window.speechSynthesis = {
      speak: vi.fn().mockImplementation((utt) => {
        if (utt.onstart) utt.onstart();
      }),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue(mockVoices),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('splits text correctly into sentences', () => {
    const text = 'Hello world. This is test 2! Is it working? Yes, indeed.';
    const sentences = splitIntoSentences(text);
    expect(sentences).toEqual([
      'Hello world.',
      'This is test 2!',
      'Is it working?',
      'Yes, indeed.',
    ]);
  });

  it('handles markdown blockquotes when splitting sentences', () => {
    const text = '> I am an engineer. I build backend systems.';
    const sentences = splitIntoSentences(text);
    expect(sentences).toEqual([
      'I am an engineer.',
      'I build backend systems.',
    ]);
  });

  it('sets speed levels properly', () => {
    const {currentSpeed, currentRate, setSpeed} = useSpeechAudio();
    expect(currentSpeed.value).toBe('natural');
    expect(currentRate.value).toBe(1.0);

    setSpeed('very_slow');
    expect(currentSpeed.value).toBe('very_slow');
    expect(currentRate.value).toBe(0.6);

    setSpeed('slow');
    expect(currentSpeed.value).toBe('slow');
    expect(currentRate.value).toBe(0.8);

    setSpeed('natural');
    expect(currentSpeed.value).toBe('natural');
    expect(currentRate.value).toBe(1.0);
  });

  it('selects preferred standard English female voice for learning and English male voice for Alex', () => {
    const enFemaleVoice = getPreferredVoice('en-US', 'female');
    expect(enFemaleVoice).not.toBeNull();
    expect(enFemaleVoice.name).toBe('Samantha');

    const enMaleVoice = getPreferredVoice('en-US', 'male');
    expect(enMaleVoice).not.toBeNull();
    expect(enMaleVoice.name).toBe('David');

    const viVoice = getPreferredVoice('vi-VN', 'male');
    expect(viVoice).not.toBeNull();
    expect(viVoice.lang).toBe('vi-VN');
  });

  it('plays single text with SpeechSynthesis when available', async () => {
    const {playSingleText, isPlaying} = useSpeechAudio();
    playSingleText('scalable architecture');

    expect(isPlaying.value).toBe(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(global.window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('initializes passage and plays sentence directly by index', async () => {
    const {initPassage, playSentence, sentences, currentSentenceIndex, isPlaying} = useSpeechAudio();
    initPassage('Hello world. We build distributed systems.');

    expect(sentences.value.length).toBe(2);
    playSentence(1);

    expect(currentSentenceIndex.value).toBe(1);
    expect(isPlaying.value).toBe(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(global.window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('auto-initializes passage if fallback passage is provided to playSentence', async () => {
    const {playSentence, sentences, currentSentenceIndex, isPlaying} = useSpeechAudio();
    expect(sentences.value.length).toBe(0);

    playSentence(0, 'First test sentence. Second test sentence.');
    expect(sentences.value.length).toBe(2);
    expect(currentSentenceIndex.value).toBe(0);
    expect(isPlaying.value).toBe(true);
  });

  it('stops playback and resets sentence index', () => {
    const {playPassage, stop, isPlaying, currentSentenceIndex} = useSpeechAudio();
    playPassage('First sentence. Second sentence.');

    expect(isPlaying.value).toBe(true);
    expect(currentSentenceIndex.value).toBe(0);

    stop();
    expect(isPlaying.value).toBe(false);
    expect(currentSentenceIndex.value).toBe(-1);
    expect(global.window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it('enqueues and plays sentences via SentenceAudioQueue for real-time sentence streaming', async () => {
    const {createSentenceAudioQueue} = await import('./useSpeechAudio.js');
    const queue = await createSentenceAudioQueue({
      lang: 'en-US',
      gender: 'male',
    });

    queue.enqueue('Hello Robert.');
    queue.enqueue('How are you doing today?');
    queue.close();

    expect(global.window.speechSynthesis.speak).toHaveBeenCalled();
  });
});
