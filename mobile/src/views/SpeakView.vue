<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useSpeakSession} from '../composables/useSpeakSession.js';
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

const showHistory = ref(false);

onMounted(initHistory);

// Leaving the screen mid-recording (bottom nav, back gesture) would otherwise
// leave the mic recording with nothing to ever stop it. Treat it like
// releasing the mic button: finish the turn (stop, transcribe, translate,
// save) in the shared session so the result is there if the user comes back.
onUnmounted(() => {
  if (status.value === 'recording') handlePressEnd();
});
</script>

<template>
  <section class="speak">
    <ScreenHeader
      eyebrow="SPEAK · VI → EN"
      title="Say it in Vietnamese"
      subtitle="Hold the mic, speak naturally — get the English back."
    />

    <div class="speak__stage">
      <Transition name="speak-fade" mode="out-in">
        <p
          v-if="lastVietnameseText"
          key="held"
          class="speak__transcript"
          aria-live="polite"
        >
          {{ lastVietnameseText }}
        </p>
        <p v-else class="speak__transcript speak__transcript--placeholder">
          We'll show what you said once you let go of the mic.
        </p>
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
            status === 'recording' ? 'Listening, let go to translate' : 'Hold to speak'
          "
          @mousedown="handlePressStart"
          @mouseup="handlePressEnd"
          @mouseleave="status === 'recording' && handlePressEnd()"
          @touchstart.prevent="handlePressStart"
          @touchend.prevent="handlePressEnd"
          @touchcancel.prevent="handlePressEnd"
        >
          <span class="speak__mic-bars" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </span>
          <svg
            v-if="status !== 'recording'"
            class="speak__mic-icon"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
            <path d="M19 11a7 7 0 0 1-14 0" />
            <line x1="12" y1="18" x2="12" y2="22" />
          </svg>
        </button>
      </div>

      <p class="speak__mic-label">
        {{
          status === 'recording'
            ? 'Listening… let go to translate'
            : status === 'translating'
              ? 'Working on it…'
              : 'Hold to speak'
        }}
      </p>
    </div>

    <Transition name="speak-pop">
      <div v-if="status === 'error'" class="speak__error" role="alert">
        <p class="speak__error-text">{{ errorMessage }}</p>
        <p v-if="lastVietnameseText" class="speak__error-transcript">
          “{{ lastVietnameseText }}”
        </p>
        <BaseButton variant="outline" tone="coral" @click="retry">
          Try again
        </BaseButton>
      </div>
    </Transition>

    <Transition name="speak-pop">
      <div v-if="status === 'result' && result" class="speak__result">
        <p class="speak__result-label">SAY THIS</p>
        <p class="speak__english">{{ result.englishSentence }}</p>
        <p class="speak__ipa">{{ result.ipa }}</p>
        <p class="speak__explanation">{{ result.explanation }}</p>
      </div>
    </Transition>

    <div class="speak__history-section">
      <button
        type="button"
        class="speak__history-toggle"
        :aria-expanded="showHistory"
        @click="showHistory = !showHistory"
      >
        <span>{{ showHistory ? 'Hide history' : 'Show history' }}</span>
        <span class="speak__history-count">{{ history.length }}</span>
      </button>

      <Transition name="speak-collapse">
        <ul v-if="showHistory" class="speak__history">
          <li
            v-for="(entry, i) in history"
            :key="i"
            class="speak__history-item"
          >
            <span class="speak__history-vi">{{ entry.vietnameseText }}</span>
            <span class="speak__history-en">{{ entry.englishSentence }}</span>
            <span class="speak__history-ipa">{{ entry.ipa }}</span>
          </li>
          <li v-if="!history.length" class="speak__history-empty">
            Nothing translated yet.
          </li>
        </ul>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
/* component: mobile screen · theme: Daily Mastery brand (awenvia DNA — indigo/mint/gold,
 * rounded sans; see mobile/brand/README.md), tokens shared globally via tokens.css.
 * states: mic — default · recording · busy(disabled) · focus-visible
 *         retry/history buttons — default · hover · focus-visible · active
 */

.speak {
  /* Color/spacing/font/motion tokens come from mobile/src/styles/tokens.css
   * (:root, loaded globally in main.js) — no local copy here anymore, so a
   * brand swap only ever needs to happen in one file. */

  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.speak * {
  box-sizing: border-box;
}

/* ---------- stage: transcript + mic ---------- */

.speak__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg) 0;
}

.speak__transcript {
  width: 100%;
  min-height: 3.2em;
  margin: 0;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-size: 1.05rem;
  line-height: 1.5;
  text-align: center;
}

.speak__transcript--placeholder {
  color: var(--color-ink-3);
  font-style: normal;
}

.speak-fade-enter-active,
.speak-fade-leave-active {
  transition:
    opacity var(--dur-med) var(--ease-out),
    transform var(--dur-med) var(--ease-out);
}
.speak-fade-enter-from,
.speak-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* ---------- mic button ---------- */

.speak__mic-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 9.5rem;
  height: 9.5rem;
}

.speak__ring {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-accent-3);
  opacity: 0;
  animation: speak-ring 1.6s var(--ease-out) infinite;
}
.speak__ring--2 {
  animation-delay: 0.5s;
}

@keyframes speak-ring {
  0% {
    transform: scale(0.82);
    opacity: 0.55;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.speak__mic {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 7.5rem;
  height: 7.5rem;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  box-shadow:
    0 5px 0 0 var(--color-accent-deep),
    0 10px 24px -8px color-mix(in oklab, var(--color-accent) 55%, transparent);
  transition:
    transform var(--dur-fast) var(--ease-spring),
    box-shadow var(--dur-fast) var(--ease-spring),
    background-color var(--dur-med) var(--ease-out);
}

.speak__mic:active {
  transform: translateY(3px);
  box-shadow:
    0 2px 0 0 var(--color-accent-deep),
    0 4px 10px -4px color-mix(in oklab, var(--color-accent) 55%, transparent);
}

.speak__mic:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}

.speak__mic--recording {
  background: var(--color-accent-3);
  box-shadow:
    0 5px 0 0 var(--color-accent-3-deep),
    0 10px 24px -8px color-mix(in oklab, var(--color-accent-3) 55%, transparent);
  transform: translateY(2px) scale(1.03);
}

.speak__mic--busy {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: 0 5px 0 0 var(--color-accent-deep);
}

.speak__mic-icon {
  transition: opacity var(--dur-fast) var(--ease-out);
}

.speak__mic-bars {
  display: none;
  align-items: flex-end;
  gap: 4px;
  height: 1.6rem;
}
.speak__mic--recording .speak__mic-bars {
  display: flex;
}
.speak__mic--recording .speak__mic-icon {
  display: none;
}
.speak__mic-bars span {
  width: 4px;
  height: 30%;
  border-radius: 2px;
  background: var(--color-ink);
  animation: speak-bar 0.9s ease-in-out infinite;
}
.speak__mic-bars span:nth-child(1) {
  animation-delay: 0s;
}
.speak__mic-bars span:nth-child(2) {
  animation-delay: 0.12s;
}
.speak__mic-bars span:nth-child(3) {
  animation-delay: 0.24s;
}
.speak__mic-bars span:nth-child(4) {
  animation-delay: 0.36s;
}
.speak__mic-bars span:nth-child(5) {
  animation-delay: 0.48s;
}

@keyframes speak-bar {
  0%,
  100% {
    height: 25%;
  }
  50% {
    height: 90%;
  }
}

.speak__mic-label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-ink-2);
}

/* ---------- error ---------- */

.speak__error {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-accent-3-tint);
}

.speak__error-text {
  margin: 0;
  font-weight: 500;
  color: var(--color-ink);
}

.speak__error-transcript {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.9rem;
}

/* ---------- result card ---------- */

.speak__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-accent-2-tint);
  box-shadow: 0 12px 32px -18px oklch(20% 0.012 250 / 0.25);
}

.speak__result-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-accent-2);
}

.speak__english {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.speak__ipa {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-ink-2);
}

.speak__explanation {
  margin: var(--space-xs) 0 0;
  padding-top: var(--space-sm);
  border-top: 1px solid oklch(20% 0.012 250 / 0.1);
  color: var(--color-ink-2);
  font-size: 0.9rem;
  line-height: 1.55;
}

.speak-pop-enter-active {
  transition:
    opacity var(--dur-slow) var(--ease-snap),
    transform var(--dur-slow) var(--ease-snap);
}
.speak-pop-leave-active {
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}
.speak-pop-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}
.speak-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- history ---------- */

.speak__history-section {
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid oklch(20% 0.012 250 / 0.08);
}

.speak__history-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out);
}
.speak__history-toggle:hover {
  background: var(--color-paper-3);
}
.speak__history-toggle:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.speak__history-count {
  display: inline-grid;
  place-items: center;
  min-width: 1.4em;
  padding: 0 0.35em;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.speak__history {
  list-style: none;
  margin: var(--space-md) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  overflow: hidden;
}

.speak__history-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--space-sm) var(--space-md);
  border-radius: 14px;
  background: var(--color-paper-2);
}

.speak__history-vi {
  font-weight: 500;
  font-size: 0.9rem;
}

.speak__history-en {
  color: var(--color-ink-2);
  font-size: 0.85rem;
}

.speak__history-ipa {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
}

.speak__history-empty {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-ink-3);
  font-size: 0.85rem;
  text-align: center;
}

.speak-collapse-enter-active,
.speak-collapse-leave-active {
  transition:
    opacity var(--dur-med) var(--ease-out),
    transform var(--dur-med) var(--ease-out);
}
.speak-collapse-enter-from,
.speak-collapse-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  .speak__ring {
    animation: none;
    display: none;
  }
  .speak__mic-bars span {
    animation: none;
    height: 60%;
  }
  .speak__mic,
  .speak__mic:active,
  .speak__mic--recording {
    transition: background-color var(--dur-fast) linear;
    transform: none;
  }
  .speak-fade-enter-active,
  .speak-fade-leave-active,
  .speak-pop-enter-active,
  .speak-pop-leave-active,
  .speak-collapse-enter-active,
  .speak-collapse-leave-active {
    transition: opacity 120ms linear !important;
  }
  .speak-fade-enter-from,
  .speak-fade-leave-to,
  .speak-pop-enter-from,
  .speak-pop-leave-to,
  .speak-collapse-enter-from,
  .speak-collapse-leave-to {
    transform: none !important;
  }
}
</style>
