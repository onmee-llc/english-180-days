import {ref, computed} from 'vue';
import {AgentRuntime} from '../agent-core/AgentRuntime.js';
import {playTtsAudio, stopTtsAudio} from './useSpeechAudio.js';
import {useAudioRecorder} from './useAudioRecorder.js';
import {useApiKey} from './useApiKey.js';
import {fastTranscribeAudio} from './useGeminiTranslate.js';

// Global Singleton State for Alex Live Call & Co-Pilot
const isFullScreen = ref(true); // Full screen live call by default upon app open
const isAudioMuted = ref(false); // Unmuted for natural conversational voice interaction
const callState = ref('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
const currentTranscript = ref('');
const alexResponseText = ref('Xin chào Robert! Hôm nay chúng ta cần giải quyết những việc gì?');
const isKeyboardOpen = ref(false);
const runtimeInstance = ref(null);

let speechRecognitionInstance = null;

/**
 * Converts formatted text / markdown into natural, warm, conversational spoken Vietnamese.
 * Strips all robotic markdown tokens, bullet points, numbers, symbols, and code.
 */
export function convertTextToNaturalSpokenVietnamese(text) {
  if (!text) return '';
  return text
    // 1. Remove markdown links [text](url) -> text
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    // 2. Remove code blocks ```...``` and inline `code`
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 3. Remove bold / italic markup **text** -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // 4. Remove headings ### Heading -> Heading
    .replace(/#{1,6}\s*([^\n]+)/g, '$1')
    // 5. Convert numbered/bullet lists "1. Item" or "- Item" into natural spoken sentences
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 6. Remove quotes and brackets
    .replace(/[>~|_#^]/g, ' ')
    // 7. Normalize multiple newlines and spaces to natural conversational pauses
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .replace(/[:;]\s*\./g, '.')
    .replace(/(\.\s*)+/g, '. ')
    .trim();
}

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!RecognitionClass) return null;
  try {
    const recognition = new RecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'vi-VN';
    return recognition;
  } catch (_) {
    return null;
  }
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
    if (!isAudioMuted.value && callState.value === 'idle') {
      speakAlexResponse(alexResponseText.value);
    }
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

    // Convert raw structured text into warm, natural conversational speech
    const naturalSpeech = convertTextToNaturalSpokenVietnamese(text);
    if (!naturalSpeech) {
      callState.value = 'idle';
      return;
    }

    callState.value = 'speaking';
    try {
      await playTtsAudio(
        naturalSpeech,
        1.0,
        () => {
          if (callState.value === 'speaking') {
            callState.value = 'idle';
          }
        },
        () => {
          callState.value = 'idle';
        },
        'vi-VN',
        'male',
      );
    } catch (_) {
      callState.value = 'idle';
    }
  }

  async function handleSendPrompt(promptText, router = null) {
    if (!promptText || !promptText.trim()) return;
    const trimmed = promptText.trim();
    currentTranscript.value = trimmed;
    callState.value = 'thinking';

    // Stop ongoing speech before processing new user turn
    await stopAlexSpeaking();

    // Only minimize and navigate if the user EXPLICITLY requested navigation via specific keywords
    const lower = trimmed.toLowerCase();
    if (router) {
      if (lower.startsWith('mở màn hình bài học') || lower.startsWith('chuyển sang bài học')) {
        minimizeToTopDock();
        router.push('/today-lesson');
        return;
      } else if (lower.startsWith('mở màn hình luyện nói') || lower.startsWith('chuyển sang luyện nói')) {
        minimizeToTopDock();
        router.push('/speak');
        return;
      } else if (lower.startsWith('mở màn hình khóa học') || lower.startsWith('chuyển sang khóa học')) {
        minimizeToTopDock();
        router.push('/courses');
        return;
      } else if (lower.startsWith('mở màn hình cài đặt') || lower.startsWith('mở vault')) {
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

    try {
      await runtimeInstance.value.sendPrompt({
        channelId: 'companion',
        prompt: trimmed,
        onToken: (token, accumulated) => {
          if (accumulated) {
            alexResponseText.value = accumulated;
          }
        },
        onComplete: (msg) => {
          alexResponseText.value = msg.content;
          speakAlexResponse(msg.content);
        },
        onError: () => {
          callState.value = 'idle';
        },
      });
    } catch (_) {
      callState.value = 'idle';
    }
  }

  async function startListening() {
    // If Alex is speaking, immediately interrupt/stop speech
    await stopAlexSpeaking();

    // Engaging in voice talk enables audio response
    isAudioMuted.value = false;
    callState.value = 'listening';
    currentTranscript.value = 'Đang lắng nghe Robert...';

    // 1. Try Web SpeechRecognition for live transcription
    speechRecognitionInstance = getSpeechRecognition();
    if (speechRecognitionInstance) {
      speechRecognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          currentTranscript.value = transcript;
        }
      };
      speechRecognitionInstance.onerror = () => {};
      try {
        speechRecognitionInstance.start();
      } catch (_) {}
    }

    // 2. Also start AudioRecorder for waveform & direct audio capture
    try {
      await startRecording();
    } catch (_) {}
  }

  async function stopListeningAndSend(router = null) {
    if (callState.value !== 'listening') return;
    callState.value = 'thinking';

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
    if (currentTranscript.value && currentTranscript.value !== 'Đang lắng nghe Robert...') {
      capturedText = currentTranscript.value.trim();
    }

    // If Web SpeechRecognition didn't catch text and audio was recorded,
    // transcribe audio with ultra-fast direct Gemini STT (< 300ms)!
    if (!capturedText && recording && recording.blob && recording.blob.size > 200) {
      currentTranscript.value = 'Đang nhận diện giọng nói của Robert...';
      try {
        const effectiveKey = await getEffectiveApiKey();
        if (effectiveKey) {
          const directText = await fastTranscribeAudio(recording.blob, recording.mimeType, effectiveKey);
          if (directText && !directText.toLowerCase().includes('không nhận diện')) {
            capturedText = directText.trim();
            currentTranscript.value = capturedText;
          }
        }
      } catch (sttErr) {
        console.warn('Fast audio STT fallback error:', sttErr);
      }
    }

    // If still no speech detected, prompt Robert
    if (!capturedText) {
      callState.value = 'idle';
      currentTranscript.value = '';
      alexResponseText.value = 'Tôi chưa nghe rõ câu nói của Robert. Bạn có thể bấm lại nút mic hoặc gõ tin nhắn để tôi hỗ trợ nhé.';
      if (!isAudioMuted.value) {
        speakAlexResponse(alexResponseText.value);
      }
      return;
    }

    await handleSendPrompt(capturedText, router);
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
