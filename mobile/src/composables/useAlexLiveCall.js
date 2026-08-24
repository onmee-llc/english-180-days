import {ref} from 'vue';
import {AgentRuntime} from '../agent-core/AgentRuntime.js';
import {createSentenceAudioQueue, playTtsAudio, stopTtsAudio, detectLanguage} from './useSpeechAudio.js';
import {useAudioRecorder} from './useAudioRecorder.js';
import {useApiKey} from './useApiKey.js';
import {fastTranscribeAudio} from './useGeminiTranslate.js';

// Global Singleton State for Alex Live Call & Co-Pilot
const isFullScreen = ref(true); // Full screen live call by default upon app open
const isAudioMuted = ref(false); // Unmuted for natural conversational voice interaction
const callState = ref('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
const currentTranscript = ref('');
const alexResponseText = ref('Hello Robert! I am Alex, your AI Co-pilot. How can I help you today?');
const isKeyboardOpen = ref(false);
const runtimeInstance = ref(null);

let speechRecognitionInstance = null;
let silenceTimer = null;
let activeAudioQueue = null;

/**
 * Cleans conversational text for natural spoken dialogue (subtitles & TTS).
 * Strips all markdown markers, code blocks, bullet points, and headers.
 */
export function cleanSpokenDialogue(text) {
  if (!text) return '';
  return text
    // 1. Remove markdown links [text](url) -> text
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    // 2. Remove code blocks ```...``` and inline `code`
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 3. Remove bold / italic markup **text** -> text, *text* -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // 4. Remove headings ### Heading -> Heading
    .replace(/#{1,6}\s*([^\n]+)/g, '$1')
    // 5. Remove bullet markers & numbering (- item, * item, 1. item)
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 6. Remove explicit tip prefixes
    .replace(/💡\s*(?:In natural English|English Speaking Tip|Pronunciation Tip|Natural English Phrasing):?/gi, '')
    // 7. Remove remaining bracketed notes e.g. (kế hoạch), (vi-VN)
    .replace(/\((?:Tiếng Việt|Dịch|Nghĩa là|Bản dịch|Gợi ý)[^)]*\)/gi, '')
    .replace(/[:;]\s*\./g, '.')
    .replace(/[>~|_#^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Backward compatibility alias for existing tests
 */
export const extractSpokenEnglishOnly = cleanSpokenDialogue;
export const convertTextToNaturalSpokenVietnamese = cleanSpokenDialogue;

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!RecognitionClass) return null;
  try {
    const recognition = new RecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    return recognition;
  } catch (_) {
    return null;
  }
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result || '').split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function useAlexLiveCall() {
  const {startRecording, stopRecording} = useAudioRecorder();
  const {apiKey, init: initApiKey} = useApiKey();

  async function getEffectiveApiKey() {
    await initApiKey();
    if (apiKey.value) return apiKey.value;
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('dm_gemini_api_key') || localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  }

  async function initRuntime(providedKey = '', contentLessons = [], masteryStore = null) {
    if (!runtimeInstance.value) {
      const effectiveKey = providedKey || (await getEffectiveApiKey());
      runtimeInstance.value = new AgentRuntime({
        apiKey: effectiveKey,
        contentLessons,
        masteryStore,
      });
    } else if (providedKey) {
      runtimeInstance.value.setApiKey(providedKey);
    }
    return runtimeInstance.value;
  }

  function openFullScreenCall() {
    isFullScreen.value = true;
  }

  function minimizeToTopDock() {
    isFullScreen.value = false;
    stopAlexSpeaking();
  }

  function toggleAudioMute() {
    isAudioMuted.value = !isAudioMuted.value;
    if (isAudioMuted.value) {
      stopAlexSpeaking();
    } else if (callState.value === 'idle') {
      speakAlexResponse(alexResponseText.value);
    }
  }

  async function stopAlexSpeaking() {
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
    if (activeAudioQueue) {
      activeAudioQueue.cancel();
      activeAudioQueue = null;
    }
    try {
      await stopTtsAudio();
    } catch (_) {}
    if (callState.value === 'speaking') {
      callState.value = 'idle';
    }
  }

  async function speakAlexResponse(text) {
    if (isAudioMuted.value || !text) {
      callState.value = 'idle';
      return;
    }

    const spokenText = cleanSpokenDialogue(text);
    if (!spokenText) {
      callState.value = 'idle';
      return;
    }

    callState.value = 'speaking';
    try {
      await playTtsAudio(
        spokenText,
        1.02,
        () => {
          if (callState.value === 'speaking') {
            callState.value = 'idle';
          }
        },
        () => {
          callState.value = 'idle';
        },
        'en-US',
        'male',
      );
    } catch (_) {
      callState.value = 'idle';
    }
  }

  async function handleSendPrompt(promptText, router = null, audioPart = null, interactionMode = 'voice') {
    if (!promptText && !audioPart) return;
    const trimmed = (promptText || '').trim();
    if (trimmed) {
      currentTranscript.value = trimmed;
    }
    callState.value = 'thinking';

    // Stop ongoing speech before processing new turn
    await stopAlexSpeaking();

    // Check for navigation commands
    const lower = trimmed.toLowerCase();
    if (router && trimmed) {
      if (lower.startsWith('mở màn hình bài học') || lower.startsWith('chuyển sang bài học') || lower.includes('open lesson')) {
        minimizeToTopDock();
        router.push('/today-lesson');
        return;
      } else if (lower.startsWith('mở màn hình luyện nói') || lower.startsWith('chuyển sang luyện nói') || lower.includes('open speaking')) {
        minimizeToTopDock();
        router.push('/speak');
        return;
      } else if (lower.startsWith('mở màn hình khóa học') || lower.startsWith('chuyển sang khóa học') || lower.includes('open courses')) {
        minimizeToTopDock();
        router.push('/courses');
        return;
      } else if (lower.startsWith('mở màn hình cài đặt') || lower.startsWith('mở vault') || lower.includes('open settings')) {
        minimizeToTopDock();
        router.push('/settings');
        return;
      }
    }

    const effectiveKey = await getEffectiveApiKey();
    if (!runtimeInstance.value) {
      await initRuntime(effectiveKey);
    } else if (effectiveKey) {
      runtimeInstance.value.setApiKey(effectiveKey);
    }

    if (!effectiveKey) {
      callState.value = 'idle';
      if (interactionMode === 'voice') {
        const noKeyMsg = 'Robert, bạn chưa nhập Gemini API Key trong Cài đặt. Vui lòng mở Cài đặt để nhập key miễn phí và trò chuyện cùng Alex nhé.';
        alexResponseText.value = noKeyMsg;
        if (!isAudioMuted.value) {
          speakAlexResponse(noKeyMsg);
        }
      } else {
        alexResponseText.value = 'Chào Robert! Bạn chưa cấu hình Gemini API Key. Vui lòng vào Cài đặt để nhập API Key miễn phí và kích hoạt trợ lý AI nhé.';
      }
      return;
    }

    // Sentence-streaming buffer setup for Voice Mode (Alex always uses young American male voice)
    let sentenceBuffer = '';
    const isVoice = interactionMode === 'voice';

    if (isVoice && !isAudioMuted.value) {
      activeAudioQueue = await createSentenceAudioQueue({
        lang: 'en-US',
        gender: 'male',
        rate: 1.02,
        onSentenceStart: () => {
          callState.value = 'speaking';
        },
        onComplete: () => {
          if (callState.value === 'speaking') {
            callState.value = 'idle';
          }
        },
        onError: () => {
          if (callState.value === 'speaking') {
            callState.value = 'idle';
          }
        },
      });
    }

    try {
      await runtimeInstance.value.sendPrompt({
        channelId: 'companion',
        prompt: trimmed,
        audioPart,
        interactionMode,
        onToken: (token) => {
          if (token && token.text) {
            sentenceBuffer += token.text;

            // In voice mode, update clean conversational text on screen
            const cleanAcc = cleanSpokenDialogue(token.accumulated);
            alexResponseText.value = cleanAcc;

            // Detect sentence boundary (. ! ? \n) for real-time sentence streaming TTS
            if (isVoice && activeAudioQueue) {
              const match = sentenceBuffer.match(/^(.*?[.!?\n])\s*(.*)$/s);
              if (match) {
                const completeSentence = cleanSpokenDialogue(match[1]);
                sentenceBuffer = match[2] || '';
                if (completeSentence && completeSentence.length > 2) {
                  activeAudioQueue.enqueue(completeSentence);
                }
              }
            }
          }
        },
        onComplete: (msg) => {
          const finalClean = cleanSpokenDialogue(msg.content);
          alexResponseText.value = finalClean;

          if (isVoice && activeAudioQueue) {
            if (sentenceBuffer.trim()) {
              const remaining = cleanSpokenDialogue(sentenceBuffer);
              if (remaining && remaining.length > 1) {
                activeAudioQueue.enqueue(remaining);
              }
            }
            activeAudioQueue.close();
          } else if (!isVoice) {
            callState.value = 'idle';
          }
        },
        onError: () => {
          callState.value = 'idle';
          if (activeAudioQueue) {
            activeAudioQueue.cancel();
            activeAudioQueue = null;
          }
        },
      });
    } catch (_) {
      callState.value = 'idle';
      if (activeAudioQueue) {
        activeAudioQueue.cancel();
        activeAudioQueue = null;
      }
    }
  }

  async function startListening(router = null) {
    // If Alex is speaking, immediately interrupt/stop speech (Instant Barge-In)
    await stopAlexSpeaking();

    // Engaging in voice talk enables audio response
    isAudioMuted.value = false;
    callState.value = 'listening';
    currentTranscript.value = 'Listening to Robert...';

    // 1. Web SpeechRecognition for live real-time transcription if supported
    speechRecognitionInstance = getSpeechRecognition();
    if (speechRecognitionInstance) {
      speechRecognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          currentTranscript.value = transcript;

          // Silence timeout: auto-send after 800ms of user silence
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            stopListeningAndSend(router);
          }, 800);
        }
      };
      speechRecognitionInstance.onerror = () => {};
      try {
        speechRecognitionInstance.start();
      } catch (_) {}
    }

    // 2. High-fidelity audio recorder with Web Audio VAD for auto-send on silence
    try {
      await startRecording({
        onSilence: () => {
          if (callState.value === 'listening') {
            stopListeningAndSend(router);
          }
        },
        silenceTimeoutMs: 1200,
        minSpeechMs: 500,
      });
    } catch (err) {
      console.warn('Audio recorder start error:', err);
    }
  }

  async function stopListeningAndSend(router = null) {
    if (callState.value !== 'listening') return;
    callState.value = 'thinking';

    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }

    if (speechRecognitionInstance) {
      try {
        speechRecognitionInstance.stop();
      } catch (_) {}
      speechRecognitionInstance = null;
    }

    let recording = null;
    try {
      recording = await stopRecording();
    } catch (_) {}

    let capturedText = '';
    if (currentTranscript.value &&
        currentTranscript.value !== 'Đang lắng nghe Robert...' &&
        currentTranscript.value !== 'Listening to Robert...') {
      capturedText = currentTranscript.value.trim();
    }

    // Direct voice turn execution if speech recognition captured text
    if (capturedText) {
      await handleSendPrompt(capturedText, router, null, 'voice');
      return;
    }

    // High accuracy Gemini 2.5 Flash direct audio transcription (works 100% on Android WebView)
    if (recording && recording.blob && recording.blob.size > 200) {
      currentTranscript.value = 'Processing audio...';
      const effectiveKey = await getEffectiveApiKey();
      try {
        const transcribedText = await fastTranscribeAudio(recording.blob, recording.mimeType, effectiveKey);
        if (transcribedText) {
          currentTranscript.value = transcribedText;
          await handleSendPrompt(transcribedText, router, null, 'voice');
          return;
        }
      } catch (err) {
        console.warn('Audio transcription error:', err);
      }
    }

    // If no speech detected at all, prompt Robert
    callState.value = 'idle';
    currentTranscript.value = '';
    const notCatchMsg = 'I did not catch that, Robert. Please tap the mic to speak to Alex.';
    alexResponseText.value = notCatchMsg;
    if (!isAudioMuted.value) {
      speakAlexResponse(notCatchMsg);
    }
  }

  return {
    isFullScreen,
    isAudioMuted,
    callState,
    currentTranscript,
    alexResponseText,
    isKeyboardOpen,
    runtimeInstance,
    initRuntime,
    openFullScreenCall,
    minimizeToTopDock,
    toggleAudioMute,
    stopAlexSpeaking,
    speakAlexResponse,
    handleSendPrompt,
    startListening,
    stopListeningAndSend,
  };
}
