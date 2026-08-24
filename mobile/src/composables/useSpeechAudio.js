import {ref, computed, onUnmounted, getCurrentInstance} from 'vue';
import {TextToSpeech} from '@capacitor-community/text-to-speech';
import {Capacitor} from '@capacitor/core';

export const SPEEDS = {
  VERY_SLOW: {key: 'very_slow', label: 'Rất chậm', rate: 0.6},
  SLOW: {key: 'slow', label: 'Chậm', rate: 0.8},
  NATURAL: {key: 'natural', label: 'Tự nhiên', rate: 1.0},
};

/**
 * Splits text into individual sentences for step-by-step shadowing.
 */
export function splitIntoSentences(text) {
  if (!text) return [];
  const clean = text
    .replace(/^>\s*/gm, '') // remove markdown blockquote >
    .replace(/\[\d+\]/g, '') // remove footnote references like [1]
    .replace(/\s+/g, ' ')
    .trim();

  // Split by sentence terminators (. ! ? :) followed by space or end of line
  const rawSentences = clean.split(/(?<=[.!?])\s+/);
  return rawSentences
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

/**
 * Detects if text is primarily Vietnamese or English for TTS language selection.
 */
export function detectLanguage(text) {
  if (!text) return 'en-US';
  const viRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
  return viRegex.test(text) ? 'vi-VN' : 'en-US';
}

// Global utterance counter to handle interruptions cleanly
let currentUtteranceId = 0;
let cachedNativeVoices = null;

/**
 * Finds index of native voice on Android/iOS Capacitor TTS
 */
async function findNativeVoiceIndex(lang, gender) {
  if (typeof TextToSpeech === 'undefined' || typeof TextToSpeech.getSupportedVoices !== 'function') {
    return undefined;
  }
  try {
    if (!cachedNativeVoices) {
      const res = await TextToSpeech.getSupportedVoices().catch(() => ({voices: []}));
      cachedNativeVoices = res?.voices || [];
    }

    if (!cachedNativeVoices.length) return undefined;

    if (lang && lang.startsWith('vi')) {
      if (gender === 'male') {
        // Prioritize younger, clearer Vietnamese male voices: vic, vid, nam, male
        const idx = cachedNativeVoices.findIndex((v) => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          const uri = (v.voiceURI || '').toLowerCase();
          const isVi = l.startsWith('vi') || n.includes('viet') || uri.includes('vi-vn');
          const isMale = n.includes('vic') || uri.includes('vic') || n.includes('vid') || uri.includes('vid') || n.includes('male') || n.includes('nam');
          return isVi && isMale;
        });
        if (idx !== -1) return idx;
      }
      const viIdx = cachedNativeVoices.findIndex((v) => (v.lang || '').toLowerCase().startsWith('vi'));
      if (viIdx !== -1) return viIdx;
    }

    if (lang && lang.startsWith('en')) {
      if (gender === 'male') {
        // Prioritize youthful, natural, energetic modern English male voices: guy, aaron, daniel, sfg, iom, tpd, alex, david
        const maleEnIdx = cachedNativeVoices.findIndex((v) => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          const uri = (v.voiceURI || '').toLowerCase();
          const isEn = l === 'en-us' || l.startsWith('en') || uri.includes('en-us');
          const isYouthfulMale = n.includes('guy') || n.includes('aaron') || n.includes('daniel') || n.includes('sfg') || n.includes('iom') || n.includes('tpd') || n.includes('alex') || n.includes('david') || n.includes('mark') || n.includes('male') || uri.includes('sfg') || uri.includes('iom') || uri.includes('tpd');
          return isEn && isYouthfulMale;
        });
        if (maleEnIdx !== -1) return maleEnIdx;
      } else {
        const femaleEnIdx = cachedNativeVoices.findIndex((v) => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          return (l === 'en-us' || l.startsWith('en')) && (n.includes('samantha') || n.includes('female') || n.includes('victoria') || n.includes('karen') || n.includes('google'));
        });
        if (femaleEnIdx !== -1) return femaleEnIdx;
      }
      const anyEnIdx = cachedNativeVoices.findIndex((v) => (v.lang || '').toLowerCase().startsWith('en'));
      if (anyEnIdx !== -1) return anyEnIdx;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Find best voice available in browser (for web fallback)
 */
export function getPreferredVoice(lang = 'en-US', gender = 'female') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    if (lang.startsWith('vi')) {
      if (gender === 'male') {
        const preferredMaleVi = ['Google Tiếng Việt', 'vic', 'vid', 'Nam', 'Male', 'Viet'];
        for (const name of preferredMaleVi) {
          const match = voices.find((v) => {
            const n = (v.name || '').toLowerCase();
            const l = (v.lang || '').toLowerCase();
            return (l.startsWith('vi') || n.includes('vietnam')) && n.includes(name.toLowerCase());
          });
          if (match) return match;
        }
        const anyVi = voices.find((v) => v.lang.startsWith('vi'));
        if (anyVi) return anyVi;
      }
      const anyVi = voices.find((v) => v.lang.startsWith('vi'));
      if (anyVi) return anyVi;
    }

    if (lang.startsWith('en')) {
      if (gender === 'male') {
        // Preferred younger energetic male voices
        const preferredMaleEn = ['Guy', 'Aaron', 'Daniel', 'Alex', 'David', 'Mark', 'Tom', 'George', 'Google US English'];
        for (const name of preferredMaleEn) {
          const match = voices.find((v) => {
            const n = v.name.toLowerCase();
            return n.includes(name.toLowerCase()) && v.lang.startsWith('en') && !n.includes('female') && !n.includes('samantha') && !n.includes('victoria') && !n.includes('karen') && !n.includes('zira') && !n.includes('moira');
          });
          if (match) return match;
        }
        const anyMaleEn = voices.find((v) => v.lang.startsWith('en') && !v.name.toLowerCase().includes('female') && !v.name.toLowerCase().includes('samantha'));
        if (anyMaleEn) return anyMaleEn;
      } else {
        const preferredFemaleEn = ['Samantha', 'Google US English', 'Victoria', 'Karen', 'Zira', 'Moira'];
        for (const name of preferredFemaleEn) {
          const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith('en'));
          if (match) return match;
        }
      }

      const usVoice = voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US');
      if (usVoice) return usVoice;

      const anyEnVoice = voices.find((v) => v.lang.startsWith('en'));
      if (anyEnVoice) return anyEnVoice;
    }

    return voices[0] || null;
  } catch {
    return null;
  }
}

/**
 * Backward compatibility alias for tests and external consumers
 */
export function getPreferredEnglishVoice() {
  return getPreferredVoice('en-US', 'female');
}

/**
 * Stops all ongoing TTS playback across Native TextToSpeech and Web SpeechSynthesis.
 */
export async function stopTtsAudio() {
  currentUtteranceId++;
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.pause();
    }
  } catch {}

  try {
    if (typeof TextToSpeech !== 'undefined' && typeof TextToSpeech.stop === 'function') {
      await TextToSpeech.stop().catch(() => {});
    }
  } catch {}
}

/**
 * Single utterance speaker without stopping global queue (used by SentenceAudioQueue and playTtsAudio)
 */
export async function speakSingleUtterance({
  text,
  rate = 1.02,
  pitch = 1.08,
  lang = 'en-US',
  gender = 'male',
  utteranceId = currentUtteranceId,
  onEnd = null,
  onError = null,
}) {
  if (!text || typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }
  const cleanText = text.trim();
  // Younger, brighter male pitch default
  const effectivePitch = gender === 'male' ? Math.max(pitch, 1.06) : pitch;

  // 1. Check if running in native Capacitor (Android/iOS)
  const isNative = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform && Capacitor.isNativePlatform();
  if (isNative) {
    try {
      const nativeVoiceIndex = await findNativeVoiceIndex(lang, gender);
      const speakOptions = {
        text: cleanText,
        lang: lang || 'en-US',
        rate: Math.min(Math.max(rate, 0.5), 2.0),
        pitch: effectivePitch,
        volume: 1.0,
        category: 'ambient',
      };
      if (typeof nativeVoiceIndex === 'number') {
        speakOptions.voice = nativeVoiceIndex;
      }

      await TextToSpeech.speak(speakOptions);
      if (utteranceId === currentUtteranceId && onEnd) {
        onEnd();
      }
      return;
    } catch (nativeErr) {
      console.warn('Native TextToSpeech plugin error:', nativeErr);
    }
  }

  // 2. Web Speech Synthesis (Standard Browser / Chrome / Safari)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang || 'en-US';
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voice = getPreferredVoice(lang, gender);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (utteranceId === currentUtteranceId && onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        if (event && (event.error === 'canceled' || event.error === 'interrupted')) {
          return;
        }
        if (utteranceId === currentUtteranceId) {
          if (onError) onError(event);
          else if (onEnd) onEnd();
        }
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (synthErr) {
      console.warn('SpeechSynthesis error:', synthErr);
      if (utteranceId === currentUtteranceId) {
        if (onError) onError(synthErr);
        else if (onEnd) onEnd();
      }
    }
  } else {
    if (utteranceId === currentUtteranceId && onEnd) onEnd();
  }
}

/**
 * SentenceAudioQueue manages sentence-streaming playback.
 * Sentences can be enqueued as they arrive from token streaming and will play sequentially.
 */
export class SentenceAudioQueue {
  constructor({
    lang = 'en-US',
    gender = 'male',
    rate = 1.0,
    onSentenceStart = null,
    onComplete = null,
    onError = null,
  } = {}) {
    this.lang = lang;
    this.gender = gender;
    this.rate = rate;
    this.onSentenceStart = onSentenceStart;
    this.onComplete = onComplete;
    this.onError = onError;
    this.queue = [];
    this.isPlaying = false;
    this.isClosed = false;
    this.utteranceId = currentUtteranceId;
  }

  enqueue(sentence) {
    if (this.utteranceId !== currentUtteranceId) return;
    const clean = (sentence || '').trim();
    if (!clean) return;
    this.queue.push(clean);
    if (!this.isPlaying) {
      this._playNext();
    }
  }

  close() {
    this.isClosed = true;
    if (!this.isPlaying && this.queue.length === 0) {
      if (this.onComplete) this.onComplete();
    }
  }

  cancel() {
    this.isClosed = true;
    this.queue = [];
    this.isPlaying = false;
    stopTtsAudio();
  }

  async _playNext() {
    if (this.utteranceId !== currentUtteranceId) {
      this.isPlaying = false;
      return;
    }
    if (this.queue.length === 0) {
      this.isPlaying = false;
      if (this.isClosed && this.onComplete) {
        this.onComplete();
      }
      return;
    }

    this.isPlaying = true;
    const sentence = this.queue.shift();
    if (this.onSentenceStart) {
      this.onSentenceStart(sentence);
    }

    await speakSingleUtterance({
      text: sentence,
      rate: this.rate,
      lang: this.lang,
      gender: this.gender,
      utteranceId: this.utteranceId,
      onEnd: () => {
        if (this.utteranceId === currentUtteranceId) {
          this._playNext();
        }
      },
      onError: (err) => {
        if (this.utteranceId === currentUtteranceId) {
          if (this.onError) this.onError(err);
          this._playNext();
        }
      },
    });
  }
}

/**
 * Starts a new SentenceAudioQueue after stopping any ongoing speech.
 */
export async function createSentenceAudioQueue(options = {}) {
  await stopTtsAudio();
  return new SentenceAudioQueue(options);
}

/**
 * Universal Text-To-Speech function:
 * 1. Uses Native Android/iOS TTS via Capacitor TextToSpeech plugin (100% reliable on mobile).
 * 2. Falls back to Web Speech Synthesis on browsers.
 * - Alex uses Male Voice ('male', pitch 1.0, 'vi-VN' / 'en-US').
 * - English Lessons use standard Native English Female Voice ('female', pitch 1.0, 'en-US').
 */
export async function playTtsAudio(text, rate = 1.0, onEnd = null, onError = null, lang = 'en-US', gender = 'female') {
  if (!text || typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  await stopTtsAudio();
  const thisId = currentUtteranceId;
  return speakSingleUtterance({
    text,
    rate,
    lang,
    gender,
    utteranceId: thisId,
    onEnd,
    onError,
  });
}

export function useSpeechAudio() {
  const isPlaying = ref(false);
  const isPaused = ref(false);
  const currentSpeed = ref('natural'); // 'very_slow' | 'slow' | 'natural'
  const currentSentenceIndex = ref(-1);
  const isLoopingSentence = ref(false);
  const sentences = ref([]);

  let onCompleteCallback = null;

  const currentRate = computed(() => {
    switch (currentSpeed.value) {
      case 'very_slow':
        return SPEEDS.VERY_SLOW.rate;
      case 'slow':
        return SPEEDS.SLOW.rate;
      case 'natural':
      default:
        return SPEEDS.NATURAL.rate;
    }
  });

  function setSpeed(speedKey) {
    if (SPEEDS[speedKey.toUpperCase()] || Object.values(SPEEDS).some((s) => s.key === speedKey)) {
      currentSpeed.value = speedKey;
    }
  }

  function initPassage(text) {
    if (!text) {
      sentences.value = [];
      return;
    }
    sentences.value = splitIntoSentences(text);
  }

  function playSingleText(text, rateMultiplier = null) {
    if (!text) return;
    const rate = rateMultiplier !== null ? rateMultiplier : currentRate.value;
    isPlaying.value = true;
    isPaused.value = false;

    playTtsAudio(
      text,
      rate,
      () => {
        isPlaying.value = false;
        isPaused.value = false;
      },
      () => {
        isPlaying.value = false;
        isPaused.value = false;
      },
      'en-US',
      'female',
    );
  }

  function playSentenceAtIndex(index) {
    if (index < 0 || index >= sentences.value.length) {
      stop();
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    currentSentenceIndex.value = index;
    isPlaying.value = true;
    isPaused.value = false;

    const text = sentences.value[index];

    playTtsAudio(
      text,
      currentRate.value,
      () => {
        if (isLoopingSentence.value) {
          setTimeout(() => {
            if (isPlaying.value && isLoopingSentence.value) {
              playSentenceAtIndex(index);
            }
          }, 300);
        } else {
          const nextIndex = index + 1;
          if (nextIndex < sentences.value.length) {
            setTimeout(() => {
              if (isPlaying.value) {
                playSentenceAtIndex(nextIndex);
              }
            }, 250);
          } else {
            stop();
            if (onCompleteCallback) onCompleteCallback();
          }
        }
      },
      () => {
        stop();
      },
      'en-US',
      'female',
    );
  }

  function playPassage(text, speed = null) {
    if (speed) currentSpeed.value = speed;
    initPassage(text);
    if (!sentences.value.length) return;
    isLoopingSentence.value = false;
    playSentenceAtIndex(0);
  }

  function playSentence(index, fallbackPassage = null) {
    if (sentences.value.length === 0 && fallbackPassage) {
      initPassage(fallbackPassage);
    }
    isLoopingSentence.value = false;
    playSentenceAtIndex(index);
  }

  function loopSentence(index, fallbackPassage = null) {
    if (sentences.value.length === 0 && fallbackPassage) {
      initPassage(fallbackPassage);
    }
    isLoopingSentence.value = true;
    playSentenceAtIndex(index);
  }

  function nextSentence() {
    if (currentSentenceIndex.value < sentences.value.length - 1) {
      playSentenceAtIndex(currentSentenceIndex.value + 1);
    }
  }

  function prevSentence() {
    if (currentSentenceIndex.value > 0) {
      playSentenceAtIndex(currentSentenceIndex.value - 1);
    }
  }

  function pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {}
    }
    isPaused.value = true;
  }

  function resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }
    isPaused.value = false;
  }

  function stop() {
    currentUtteranceId++;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    try {
      if (typeof TextToSpeech !== 'undefined' && typeof TextToSpeech.stop === 'function') {
        TextToSpeech.stop().catch(() => {});
      }
    } catch {}
    isPlaying.value = false;
    isPaused.value = false;
    currentSentenceIndex.value = -1;
    isLoopingSentence.value = false;
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      stop();
    });
  }

  return {
    isPlaying,
    isPaused,
    currentSpeed,
    currentRate,
    currentSentenceIndex,
    isLoopingSentence,
    sentences,
    initPassage,
    playPassage,
    playSingleText,
    playSentence,
    loopSentence,
    pause,
    resume,
    stop,
    nextSentence,
    prevSentence,
    setSpeed,
  };
}
