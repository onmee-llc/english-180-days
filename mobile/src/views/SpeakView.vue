<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useSpeakSession} from '../composables/useSpeakSession.js';
import {useMasteryPoints, XP_REWARDS} from '../composables/useMasteryPoints.js';
import {playTtsAudio, stopTtsAudio} from '../composables/useSpeechAudio.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';

const {
  status,
  errorMessage,
  lastVietnameseText,
  result,
  history,
  initHistory,
  handlePressStart,
  handlePressEnd,
  retry,
} = useSpeakSession();

const {addXp} = useMasteryPoints();

const showHistory = ref(false);
const isPlayingAudio = ref(false);
const copied = ref(false);
const recordSeconds = ref(0);
let recordTimer = null;
let pressStartTime = 0;

const formattedRecordTime = computed(() => {
  const mins = Math.floor(recordSeconds.value / 60);
  const secs = recordSeconds.value % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

function startTimer() {
  recordSeconds.value = 0;
  clearInterval(recordTimer);
  recordTimer = setInterval(() => {
    recordSeconds.value += 1;
  }, 1000);
}

function stopTimer() {
  clearInterval(recordTimer);
}

async function onMicPointerDown(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  if (status.value === 'recording') {
    stopTimer();
    await handlePressEnd();
    addXp(XP_REWARDS.SPEAK_SESSION, 'Luyện nói câu tự do');
    return;
  }

  if (status.value === 'translating') return;

  pressStartTime = Date.now();
  startTimer();
  await handlePressStart();
}

async function onMicPointerUp(e) {
  if (status.value !== 'recording') return;

  const duration = Date.now() - pressStartTime;
  if (duration >= 350) {
    stopTimer();
    await handlePressEnd();
    addXp(XP_REWARDS.SPEAK_SESSION, 'Luyện nói câu tự do');
  }
}

async function stopAndTranslateNow() {
  stopTimer();
  await handlePressEnd();
  addXp(XP_REWARDS.SPEAK_SESSION, 'Luyện nói câu tự do');
}

async function playPronunciation(text) {
  if (!text) return;
  isPlayingAudio.value = true;
  await playTtsAudio(
    text,
    0.88,
    () => {
      isPlayingAudio.value = false;
    },
    () => {
      isPlayingAudio.value = false;
    },
  );
}

async function copyEnglish(text) {
  if (!text || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (_) {}
}

onMounted(initHistory);

onUnmounted(() => {
  stopTimer();
  stopTtsAudio();
  if (status.value === 'recording') {
    handlePressEnd();
  }
});
</script>

<template>
  <section class="speak">
    <ScreenHeader
      eyebrow="SPEAK · VI → EN"
      title="Luyện nói cùng AI"
      subtitle="Chạm hoặc nhấn giữ mic để nói tiếng Việt. AI sẽ lắng nghe và chuyển đổi sang tiếng Anh chuẩn tự nhiên."
    />

    <!-- Stage: Live transcription & Mic button -->
    <div class="speak__stage">
      <Transition name="speak-fade" mode="out-in">
        <div
          v-if="lastVietnameseText"
          key="held"
          class="speak__transcript"
          aria-live="polite"
        >
          <span class="speak__transcript-tag">Nội dung bạn vừa nói:</span>
          <p class="speak__transcript-text">“{{ lastVietnameseText }}”</p>
        </div>
        <div v-else class="speak__transcript speak__transcript--placeholder">
          <p class="speak__transcript-text">
            Chạm vào mic để nói, chạm lần nữa để chuyển đổi sang tiếng Anh.
          </p>
        </div>
      </Transition>

      <div class="speak__mic-wrap">
        <span
          v-if="status === 'recording'"
          class="speak__ring speak__ring--1"
          aria-hidden="true"
        ></span>
        <span
          v-if="status === 'recording'"
          class="speak__ring speak__ring--2"
          aria-hidden="true"
        ></span>

        <button
          type="button"
          class="speak__mic"
          :class="{
            'speak__mic--recording': status === 'recording',
            'speak__mic--busy': status === 'translating',
          }"
          :disabled="status === 'translating'"
          :aria-label="
            status === 'recording'
              ? 'Đang lắng nghe, chạm để hoàn tất & dịch'
              : 'Chạm hoặc nhấn giữ để nói'
          "
          @pointerdown="onMicPointerDown"
          @pointerup="onMicPointerUp"
        >
          <!-- Pulsing Soundwave Bars -->
          <span class="speak__mic-bars" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </span>

          <!-- Idle Mic SVG Icon -->
          <svg
            v-if="status !== 'recording' && status !== 'translating'"
            class="speak__mic-icon"
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>

          <!-- Translating Spinner -->
          <svg
            v-if="status === 'translating'"
            class="speak__spinner"
            viewBox="0 0 24 24"
            width="34"
            height="34"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="12" />
          </svg>
        </button>
      </div>

      <div class="speak__mic-status">
        <div v-if="status === 'recording'" class="speak__recording-box">
          <p class="speak__mic-label speak__mic-label--recording">
            Đang thu âm ({{ formattedRecordTime }})
          </p>
          <button
            type="button"
            class="speak__stop-btn"
            title="Dừng & Dịch ngay"
            aria-label="Dừng thu âm và dịch"
            @click="stopAndTranslateNow"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
            <span>Dừng & Dịch</span>
          </button>
        </div>
        <p v-else-if="status === 'translating'" class="speak__mic-label speak__mic-label--busy">
          AI đang lắng nghe & chuyển đổi câu...
        </p>
        <p v-else class="speak__mic-label">
          Chạm vào Mic để bắt đầu nói
        </p>
      </div>
    </div>

    <!-- Error State -->
    <Transition name="speak-pop">
      <div v-if="status === 'error'" class="speak__error" role="alert">
        <div class="speak__error-header">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span class="speak__error-title">Thông báo</span>
        </div>
        <p class="speak__error-text">{{ errorMessage }}</p>
        <p v-if="lastVietnameseText" class="speak__error-transcript">
          “{{ lastVietnameseText }}”
        </p>
        <BaseButton variant="outline" tone="coral" class="speak__error-retry" @click="retry">
          Thử lại
        </BaseButton>
      </div>
    </Transition>

    <!-- Result Card with Pronunciation Player -->
    <Transition name="speak-pop">
      <div v-if="status === 'result' && result" class="speak__result">
        <!-- Spoken Vietnamese Source -->
        <div class="speak__source-box">
          <div class="speak__source-header">
            <span class="speak__source-tag">🗣️ Bạn đã nói:</span>
          </div>
          <p class="speak__source-text">“{{ result.vietnameseText }}”</p>
        </div>

        <!-- English Translation Result -->
        <div class="speak__result-top">
          <span class="speak__result-badge">🇬🇧 BẢN DỊCH TIẾNG ANH</span>
          <div class="speak__result-actions">
            <button
              type="button"
              class="speak__action-icon-btn"
              :class="{'speak__action-icon-btn--active': copied}"
              :title="copied ? 'Đã sao chép' : 'Sao chép câu tiếng Anh'"
              :aria-label="copied ? 'Đã sao chép' : 'Sao chép'"
              @click="copyEnglish(result.englishSentence)"
            >
              <svg v-if="!copied" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent-2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            <button
              type="button"
              class="speak__action-icon-btn speak__action-icon-btn--primary"
              :class="{'speak__action-icon-btn--playing': isPlayingAudio}"
              aria-label="Nghe phát âm tiếng Anh"
              title="Nghe phát âm"
              @click="playPronunciation(result.englishSentence)"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>
        </div>

        <div class="speak__sentence-row">
          <p class="speak__english">{{ result.englishSentence }}</p>
        </div>

        <div v-if="result.ipa" class="speak__ipa-wrap">
          <span class="speak__ipa-label">Phiên âm:</span>
          <span class="speak__ipa">{{ result.ipa }}</span>
        </div>

        <div v-if="result.explanation" class="speak__explanation-box">
          <div class="speak__explanation-header">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span class="speak__explanation-title">Giải thích ngữ cảnh & cách dùng:</span>
          </div>
          <p class="speak__explanation">{{ result.explanation }}</p>
        </div>
      </div>
    </Transition>

    <!-- History Section -->
    <div class="speak__history-section">
      <BaseButton
        variant="ghost"
        :aria-expanded="showHistory"
        class="speak__history-toggle"
        @click="showHistory = !showHistory"
      >
        <div class="speak__history-toggle-left">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Lịch sử các câu đã dịch</span>
          <span class="speak__history-count">{{ history.length }}</span>
        </div>
        <svg class="speak__history-chevron" :class="{'speak__history-chevron--open': showHistory}" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </BaseButton>

      <Transition name="speak-collapse">
        <ul v-if="showHistory" class="speak__history">
          <li
            v-for="(entry, i) in history"
            :key="i"
            class="speak__history-item"
          >
            <div class="speak__history-header">
              <span class="speak__history-vi">“{{ entry.vietnameseText }}”</span>
              <button
                type="button"
                class="speak__history-audio-btn"
                title="Nghe phát âm"
                @click="playPronunciation(entry.englishSentence)"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>
            <p class="speak__history-en">{{ entry.englishSentence }}</p>
          </li>
        </ul>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.speak {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6.5rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.speak__prompts {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.speak__prompts-header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.speak__prompts-icon {
  stroke: var(--color-accent);
}

.speak__prompts-title {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-ink-2);
}

.speak__prompts-list {
  display: flex;
  gap: var(--space-2xs);
  overflow-x: auto;
  padding-bottom: 0.3rem;
  scrollbar-width: none;
}
.speak__prompts-list::-webkit-scrollbar {
  display: none;
}

.speak__prompt-chip {
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  white-space: nowrap;
}

.speak__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.speak__transcript {
  min-height: 3.5rem;
  width: 100%;
  text-align: center;
}

.speak__transcript-tag {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent);
}

.speak__transcript-text {
  margin: 0.2rem 0 0;
  font-size: var(--text-sm);
  color: var(--color-ink);
}

.speak__mic-wrap {
  position: relative;
  width: 6rem;
  height: 6rem;
  display: grid;
  place-items: center;
}

.speak__mic {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: var(--radius-pill);
  border: 0;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 20px -4px rgba(61, 78, 232, 0.45);
  transition: all var(--dur-fast) var(--ease-spring);
}

.speak__mic--recording {
  background: var(--color-accent-3);
  transform: scale(1.06);
}

.speak__mic-bars {
  display: none;
}

.speak__mic-status {
  text-align: center;
}

.speak__recording-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.speak__mic-label {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink-2);
}

.speak__mic-label--recording {
  color: var(--color-accent-3);
  font-weight: 700;
}

.speak__stop-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-pill);
  border: 0;
  background: var(--color-accent-3);
  color: var(--color-on-accent);
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
}

.speak__error {
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: #fef2f2;
  border: 1px solid var(--color-accent-3);
}

.speak__error-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-accent-3);
  font-weight: 700;
  font-size: var(--text-xs);
}

.speak__error-text {
  margin: 0.2rem 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink);
}

.speak__error-retry {
  margin-top: var(--space-xs);
}

.speak__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  box-shadow: var(--color-shadow-card);
}

.speak__source-box {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-input);
  background: rgba(61, 78, 232, 0.05);
  border-left: 3px solid var(--color-accent);
}

.speak__source-header {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.speak__source-tag {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent);
}

.speak__source-text {
  margin: 0.15rem 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink);
  font-style: italic;
  line-height: 1.4;
}

.speak__result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-2xs);
}

.speak__result-badge {
  font-size: var(--text-2xs);
  font-weight: 800;
  color: var(--color-accent-2);
  letter-spacing: 0.04em;
}

.speak__result-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.speak__action-icon-btn {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  color: var(--color-ink-2);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.speak__action-icon-btn:hover {
  background: var(--color-paper-3);
  color: var(--color-ink);
}

.speak__action-icon-btn--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-color: var(--color-accent);
}

.speak__action-icon-btn--primary:hover {
  background: var(--color-accent-deep, #2f3ec4);
}

.speak__action-icon-btn--playing {
  animation: pulse 1s infinite alternate;
}

.speak__action-icon-btn--active {
  border-color: var(--color-accent-2);
  background: rgba(16, 185, 129, 0.1);
}

.speak__sentence-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-sm);
}

.speak__english {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 700;
  line-height: 1.5;
  color: var(--color-ink);
}

.speak__ipa-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.speak__ipa-label {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-ink-3);
}

.speak__ipa {
  font-size: var(--text-xs);
  color: var(--color-accent);
  font-weight: 600;
}

.speak__explanation-box {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-input);
  background: var(--color-paper);
  border-left: 3px solid var(--color-accent);
}

.speak__explanation-header {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent);
}

.speak__explanation {
  margin: 0.2rem 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  line-height: 1.5;
}

.speak__history-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.speak__history-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.speak__history-toggle-left {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.speak__history-count {
  font-size: var(--text-2xs);
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
}

.speak__history-chevron {
  transition: transform var(--dur-fast) var(--ease-out);
}

.speak__history-chevron--open {
  transform: rotate(180deg);
}

.speak__history {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.speak__history-item {
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-input);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.speak__history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.speak__history-vi {
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  font-style: italic;
}

.speak__history-audio-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--color-accent);
}

.speak__history-en {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink);
}
</style>
