<script setup>
import {ref, computed} from 'vue';
import SvgIcon from '../base/SvgIcon.vue';
import {useAlexLiveCall} from '../../composables/useAlexLiveCall.js';

const {
  isFullScreen,
  isAudioMuted,
  callState,
  openFullScreenCall,
  startListening,
  stopListeningAndSend,
  toggleAudioMute,
} = useAlexLiveCall();
</script>

<template>
  <aside
    v-if="!isFullScreen"
    class="alex-top-dock"
    role="complementary"
    aria-label="Alex Co-Pilot Assistant"
  >
    <div
      class="alex-top-dock__pill"
      :class="`alex-top-dock__pill--${callState}`"
      @click="openFullScreenCall"
    >
      <!-- Glowing Mini Avatar Orb -->
      <div class="alex-top-dock__avatar">
        <span class="alex-top-dock__pulse-dot" :class="`alex-top-dock__pulse-dot--${callState}`"></span>
        <SvgIcon v-if="callState === 'speaking'" name="voice" :size="14" color="#ffffff" />
        <SvgIcon v-else-if="callState === 'thinking'" name="bolt" :size="14" color="#ffffff" />
        <SvgIcon v-else name="spark" :size="14" color="#ffffff" />
      </div>

      <!-- State Text & Soundwave -->
      <div class="alex-top-dock__label-wrap">
        <span class="alex-top-dock__name">Alex</span>
        <span class="alex-top-dock__status">
          {{ callState === 'listening' ? 'Đang nghe' : callState === 'thinking' ? 'Đang nghĩ' : callState === 'speaking' ? 'Đang nói' : 'Trợ lý' }}
        </span>
      </div>

      <!-- Push to Talk Mic on Dock -->
      <button
        type="button"
        class="alex-top-dock__mic-btn"
        :class="{'alex-top-dock__mic-btn--active': callState === 'listening'}"
        title="Nói chuyện với Alex"
        aria-label="Nói chuyện"
        @click.stop="callState === 'listening' ? stopListeningAndSend() : startListening()"
      >
        <SvgIcon name="voice" :size="13" />
      </button>

      <!-- Expand to Fullscreen button -->
      <button
        type="button"
        class="alex-top-dock__expand-btn"
        title="Mở toàn màn hình Call"
        aria-label="Mở toàn màn hình"
        @click.stop="openFullScreenCall"
      >
        <SvgIcon name="drawer" :size="12" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.alex-top-dock {
  position: fixed;
  top: calc(12px + env(safe-area-inset-top));
  right: 14px;
  z-index: 900;
  pointer-events: auto;
}

.alex-top-dock__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px 5px 6px;
  border-radius: var(--radius-pill, 9999px);
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.alex-top-dock__pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.alex-top-dock__pill--listening {
  background: rgba(234, 88, 12, 0.95);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 16px rgba(234, 88, 12, 0.6);
}

.alex-top-dock__pill--speaking {
  background: rgba(139, 92, 246, 0.95);
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.6);
}

.alex-top-dock__avatar {
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-accent, #3d4ee8);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.alex-top-dock__pulse-dot {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid #0f172a;
}

.alex-top-dock__pulse-dot--listening {
  background: #ffffff;
}

.alex-top-dock__label-wrap {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.alex-top-dock__name {
  font-size: var(--text-2xs, 11px);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.alex-top-dock__status {
  font-size: var(--text-3xs, 9px);
  color: rgba(255, 255, 255, 0.65);
}

.alex-top-dock__mic-btn,
.alex-top-dock__expand-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 0;
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.alex-top-dock__mic-btn:hover,
.alex-top-dock__expand-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.alex-top-dock__mic-btn--active {
  background: #ffffff;
  color: #ea580c;
}
</style>
