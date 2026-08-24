<script setup>
import {useRoute, useRouter} from 'vue-router';
import {useSpeakSession} from '../composables/useSpeakSession.js';
import {createPressGesture} from '../composables/useLongPress.js';
import SvgIcon from './base/SvgIcon.vue';
import {useAlexLiveCall} from '../composables/useAlexLiveCall.js';

const route = useRoute();
const router = useRouter();
const {status, handlePressStart, handlePressEnd} = useSpeakSession();
const {openFullScreenCall} = useAlexLiveCall();

const LONG_PRESS_MS = 250;
let suppressNextClick = false;
const gesture = createPressGesture({
  thresholdMs: LONG_PRESS_MS,
  onLongPress: handlePressStart,
});

function handleAlexAiClick(event) {
  event.preventDefault();
  openFullScreenCall();
}

function onPressStart() {
  gesture.start();
}

function onPressEnd() {
  suppressNextClick = gesture.end();
  if (!suppressNextClick) return;
  handlePressEnd().then(() => router.push({name: 'speak'}));
}

function onClick(event, navigate) {
  event.preventDefault();
  if (suppressNextClick) {
    suppressNextClick = false;
    return;
  }
  navigate();
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link to="/" class="bottom-nav__link">
      <SvgIcon name="spark" :size="20" class="bottom-nav__icon" />
      <span class="bottom-nav__label">Hôm nay</span>
    </router-link>

    <button type="button" class="bottom-nav__link" @click="handleAlexAiClick">
      <SvgIcon name="bolt" :size="20" class="bottom-nav__icon" />
      <span class="bottom-nav__label">Alex AI</span>
    </button>

    <router-link to="/courses" class="bottom-nav__link">
      <SvgIcon name="chart" :size="20" class="bottom-nav__icon" />
      <span class="bottom-nav__label">Khóa học</span>
    </router-link>

    <router-link to="/speak" custom v-slot="{navigate, isActive, href}">
      <a
        :href="href"
        class="bottom-nav__link bottom-nav__link--speak"
        :class="{
          'router-link-exact-active': isActive,
          'bottom-nav__link--recording': status === 'recording',
        }"
        @mousedown="onPressStart"
        @mouseup="onPressEnd"
        @touchstart="onPressStart"
        @touchend="onPressEnd"
        @touchcancel="gesture.cancel()"
        @click="onClick($event, navigate)"
      >
        <div class="bottom-nav__speak-icon-wrap">
          <SvgIcon name="voice" :size="20" class="bottom-nav__icon" />
        </div>
        <span class="bottom-nav__label">Luyện nói</span>
      </a>
    </router-link>

    <router-link to="/settings" class="bottom-nav__link">
      <SvgIcon name="gear" :size="20" class="bottom-nav__icon" />
      <span class="bottom-nav__label">Cài đặt</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.5rem calc(14px + max(10px, env(safe-area-inset-bottom, 0px)));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-hairline);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.03);
}

.bottom-nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  min-width: 0;
  min-height: 48px;
  padding: 4px 2px;
  border: 0;
  background: transparent;
  border-radius: var(--radius-input);
  color: var(--color-ink-3);
  text-decoration: none;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) {
  .bottom-nav__link:hover {
    color: var(--color-ink-2);
    background: var(--color-paper-3);
  }
}

.bottom-nav__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.bottom-nav__icon {
  transition: transform var(--dur-fast) var(--ease-out);
}

.bottom-nav__label {
  font-size: var(--text-2xs);
  font-weight: 600;
  white-space: nowrap;
}

.bottom-nav__link.router-link-exact-active {
  color: var(--color-accent);
  background: rgba(61, 78, 232, 0.08);
}

.bottom-nav__link.router-link-exact-active .bottom-nav__icon {
  transform: translateY(-1px);
  color: var(--color-accent);
}

.bottom-nav__link.router-link-exact-active .bottom-nav__label {
  color: var(--color-accent);
  font-weight: 700;
}

.bottom-nav__link--recording {
  color: #fff !important;
  background: var(--color-accent-3) !important;
  animation: bottom-nav-pulse 1s ease infinite;
}

.bottom-nav__link--recording .bottom-nav__icon {
  color: #fff !important;
}

@keyframes bottom-nav-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}
</style>
