<script setup>
import {ref, computed, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import SvgIcon from '../base/SvgIcon.vue';
import {useAlexLiveCall, convertTextToNaturalSpokenVietnamese} from '../../composables/useAlexLiveCall.js';

const router = useRouter();
const {
  isFullScreen,
  isAudioMuted,
  callState,
  currentTranscript,
  alexResponseText,
  isKeyboardOpen,
  toggleAudioMute,
  minimizeToTopDock,
  stopAlexSpeaking,
  handleSendPrompt,
  startListening,
  stopListeningAndSend,
} = useAlexLiveCall();

const textDraft = ref('');
const textInputRef = ref(null);
const isFeaturesDrawerOpen = ref(false);

const featureShortcuts = [
  {id: 'today', label: 'Bài học hôm nay', sub: 'Lộ trình Daily Mastery & Streak', icon: 'spark', route: '/today-lesson'},
  {id: 'speak', label: 'Luyện nói tiếng Anh', sub: 'Thực hành phát âm & hội thoại AI', icon: 'voice', route: '/speak'},
  {id: 'courses', label: 'Khóa học', sub: 'Kho kiến thức và bài giảng', icon: 'chart', route: '/courses'},
  {id: 'calendar', label: 'Tiến độ 180 ngày', sub: 'Lịch học tập và điểm XP', icon: 'flame', route: '/calendar'},
  {id: 'vault', label: 'Hồ sơ & Vault', sub: 'Dự án, tài chính & nhịp sinh học', icon: 'star', route: '/settings'},
];

const displayResponse = computed(() => {
  return alexResponseText.value || 'Hello Robert! I am Alex, your AI Co-pilot and English Speaking Coach. How can I help you today?';
});

const displayLiveSpeech = computed(() => {
  return currentTranscript.value;
});

function handleOrbClick() {
  if (callState.value === 'speaking') {
    stopAlexSpeaking();
  } else if (callState.value === 'listening') {
    stopListeningAndSend(router);
  } else {
    startListening();
  }
}

function handleNavigateToFeature(route) {
  isFeaturesDrawerOpen.value = false;
  minimizeToTopDock();
  router.push(route);
}

function handleToggleKeyboard() {
  isKeyboardOpen.value = !isKeyboardOpen.value;
  if (isKeyboardOpen.value) {
    nextTick(() => {
      if (textInputRef.value) {
        textInputRef.value.focus();
      }
    });
  }
}

function handleSendText() {
  if (!textDraft.value.trim()) return;
  const prompt = textDraft.value.trim();
  textDraft.value = '';
  isKeyboardOpen.value = false;
  handleSendPrompt(prompt, router);
}
</script>

<template>
  <transition name="call-fade">
    <div v-if="isFullScreen" class="alex-live-call" role="dialog" aria-modal="true">
      <!-- 1. Ambient Background Aura -->
      <div class="alex-live-call__aura" :class="`alex-live-call__aura--${callState}`"></div>

      <!-- 2. Minimalist Top Bar -->
      <header class="alex-live-call__topbar">
        <div class="alex-live-call__identity">
          <div class="alex-live-call__status-dot" :class="`alex-live-call__status-dot--${callState}`"></div>
          <div>
            <h1 class="alex-live-call__title">Alex Live</h1>
            <span class="alex-live-call__subtitle">
              {{ callState === 'listening' ? 'Đang lắng nghe Robert...' : callState === 'thinking' ? 'Đang suy luận giải pháp...' : callState === 'speaking' ? 'Đang trò chuyện (Chạm để ngắt lời)' : 'Sẵn sàng trò chuyện' }}
            </span>
          </div>
        </div>

        <div class="alex-live-call__actions">
          <!-- Sound Mute/Unmute Toggle -->
          <button
            type="button"
            class="alex-live-call__pill-btn"
            :class="{'alex-live-call__pill-btn--active': !isAudioMuted}"
            :title="isAudioMuted ? 'Chạm để bật âm thanh' : 'Chạm để tắt âm thanh'"
            @click="toggleAudioMute"
          >
            <SvgIcon :name="isAudioMuted ? 'volume-x' : 'volume-2'" :size="15" />
            <span>{{ isAudioMuted ? 'Tắt âm' : 'Bật âm' }}</span>
          </button>

          <!-- Minimize Button -->
          <button
            type="button"
            class="alex-live-call__pill-btn alex-live-call__pill-btn--close"
            title="Thu nhỏ về góc trên"
            aria-label="Thu nhỏ"
            @click="minimizeToTopDock"
          >
            <SvgIcon name="close" :size="15" />
          </button>
        </div>
      </header>

      <!-- 3. Center Living Voice Orb (Gemini Live / ChatGPT Voice Aesthetic) -->
      <main class="alex-live-call__stage">
        <div class="alex-live-call__orb-wrap">
          <!-- Dynamic Waveform Pulse Rings -->
          <div class="alex-live-call__ring alex-live-call__ring--1" :class="`alex-live-call__ring--${callState}`"></div>
          <div class="alex-live-call__ring alex-live-call__ring--2" :class="`alex-live-call__ring--${callState}`"></div>
          <div class="alex-live-call__ring alex-live-call__ring--3" :class="`alex-live-call__ring--${callState}`"></div>

          <!-- Main Interactive Voice Orb (Tap to Interrupt / Stop Speaking / Start Listening) -->
          <div
            class="alex-live-call__orb"
            :class="`alex-live-call__orb--${callState}`"
            @click="handleOrbClick"
          >
            <div class="alex-live-call__orb-core">
              <SvgIcon v-if="callState === 'speaking'" name="stop" :size="36" color="#ffffff" />
              <SvgIcon v-else-if="callState === 'thinking'" name="bolt" :size="40" color="#ffffff" />
              <SvgIcon v-else-if="callState === 'listening'" name="voice" :size="40" color="#ffffff" />
              <SvgIcon v-else name="spark" :size="40" color="#ffffff" />
            </div>
          </div>
        </div>

        <!-- Conversational Subtitles (Clean Natural Conversational Prose) -->
        <div class="alex-live-call__subtitles">
          <p class="alex-live-call__spoken-text">
            {{ displayResponse }}
          </p>
          <p v-if="callState === 'listening' && displayLiveSpeech" class="alex-live-call__live-text">
            {{ displayLiveSpeech }}
          </p>

          <!-- Interaction Hint Status -->
          <div class="alex-live-call__interaction-hint">
            <span v-if="callState === 'idle'">Chạm Mic để nói chuyện với Alex</span>
            <span v-else-if="callState === 'listening'">Đang nghe... Chạm lại khi nói xong</span>
            <span v-else-if="callState === 'thinking'">Alex đang phản hồi...</span>
            <span v-else-if="callState === 'speaking'">Alex đang trả lời bằng tiếng Anh • Chạm để ngắt lời</span>
          </div>

          <!-- Explicit Stop Speech Pill When Alex Is Speaking -->
          <button
            v-if="callState === 'speaking'"
            type="button"
            class="alex-live-call__stop-speech-btn"
            @click="stopAlexSpeaking"
          >
            <SvgIcon name="stop" :size="13" color="#ffffff" />
            <span>Dừng nói</span>
          </button>
        </div>
      </main>

      <!-- 4. Bottom Controls Bar -->
      <footer class="alex-live-call__footer">
        <!-- Optional Keyboard Input Drawer -->
        <div v-if="isKeyboardOpen" class="alex-live-call__text-bar">
          <input
            ref="textInputRef"
            v-model="textDraft"
            type="text"
            placeholder="Nhập yêu cầu cho Alex..."
            class="alex-live-call__input"
            @keydown.enter="handleSendText"
          />
          <button
            type="button"
            class="alex-live-call__send-btn"
            :disabled="!textDraft.trim()"
            @click="handleSendText"
          >
            <SvgIcon name="send" :size="16" color="#ffffff" />
          </button>
        </div>

        <div class="alex-live-call__controls">
          <!-- Keyboard toggle button -->
          <button
            type="button"
            class="alex-live-call__ctrl-btn"
            :class="{'alex-live-call__ctrl-btn--active': isKeyboardOpen}"
            title="Soạn tin nhắn dạng text"
            @click="handleToggleKeyboard"
          >
            <SvgIcon name="keyboard" :size="20" />
          </button>

          <!-- Central Living Voice Mic Button -->
          <button
            type="button"
            class="alex-live-call__mic-trigger"
            :class="{
              'alex-live-call__mic-trigger--recording': callState === 'listening',
              'alex-live-call__mic-trigger--speaking': callState === 'speaking',
            }"
            aria-label="Nói chuyện với Alex"
            @click="handleOrbClick"
          >
            <SvgIcon v-if="callState === 'speaking'" name="stop" :size="26" color="#ffffff" />
            <SvgIcon v-else name="voice" :size="28" color="#ffffff" />
          </button>

          <!-- Features Drawer Button (Only shows feature screen list when requested) -->
          <button
            type="button"
            class="alex-live-call__ctrl-btn"
            :class="{'alex-live-call__ctrl-btn--active': isFeaturesDrawerOpen}"
            title="Mở danh sách tính năng"
            @click="isFeaturesDrawerOpen = !isFeaturesDrawerOpen"
          >
            <SvgIcon name="drawer" :size="20" />
          </button>
        </div>
      </footer>

      <!-- 5. Slide-up Feature Screens Sheet (Only visible when user taps Drawer) -->
      <transition name="drawer-slide">
        <div v-if="isFeaturesDrawerOpen" class="alex-live-call__drawer-overlay" @click.self="isFeaturesDrawerOpen = false">
          <div class="alex-live-call__drawer-card">
            <div class="alex-live-call__drawer-header">
              <h3>Mở Màn Hình & Tính Năng</h3>
              <button type="button" class="alex-live-call__drawer-close" @click="isFeaturesDrawerOpen = false">
                <SvgIcon name="close" :size="16" />
              </button>
            </div>
            <p class="alex-live-call__drawer-desc">
              Khi chọn tính năng, Alex sẽ tự động thu nhỏ về góc trên màn hình để tiếp tục hỗ trợ bạn.
            </p>

            <div class="alex-live-call__drawer-list">
              <button
                v-for="item in featureShortcuts"
                :key="item.id"
                type="button"
                class="alex-live-call__drawer-item"
                @click="handleNavigateToFeature(item.route)"
              >
                <div class="alex-live-call__drawer-item-icon">
                  <SvgIcon :name="item.icon" :size="18" color="#ffffff" />
                </div>
                <div class="alex-live-call__drawer-item-info">
                  <div class="alex-live-call__drawer-item-title">{{ item.label }}</div>
                  <div class="alex-live-call__drawer-item-sub">{{ item.sub }}</div>
                </div>
                <SvgIcon name="arrow-right" :size="14" color="rgba(255, 255, 255, 0.4)" />
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.alex-live-call {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #090a16;
  color: #ffffff;
  font-family: var(--font-body, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif);
  user-select: none;
  overflow: hidden;
}

/* Ambient Aura Glow */
.alex-live-call__aura {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  transition: all 0.5s ease;
}

.alex-live-call__aura--listening {
  background: radial-gradient(circle, rgba(234, 88, 12, 0.35) 0%, rgba(249, 115, 22, 0.12) 50%, transparent 70%);
  transform: translate(-50%, -50%) scale(1.2);
}

.alex-live-call__aura--speaking {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%);
  transform: translate(-50%, -50%) scale(1.3);
}

/* 1. Top Bar */
.alex-live-call__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  padding-top: calc(16px + env(safe-area-inset-top));
  z-index: 10;
}

.alex-live-call__identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.alex-live-call__status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.alex-live-call__status-dot--listening {
  background: #ea580c;
  box-shadow: 0 0 10px #ea580c;
  animation: dot-pulse 0.8s infinite alternate;
}

.alex-live-call__status-dot--thinking {
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
  animation: dot-pulse 0.6s infinite alternate;
}

.alex-live-call__status-dot--speaking {
  background: #8b5cf6;
  box-shadow: 0 0 10px #8b5cf6;
  animation: dot-pulse 0.8s infinite alternate;
}

.alex-live-call__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.alex-live-call__subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.alex-live-call__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alex-live-call__pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(12px);
}

.alex-live-call__pill-btn--active {
  background: var(--color-accent, #3d4ee8);
  border-color: var(--color-accent, #3d4ee8);
}

.alex-live-call__pill-btn--close {
  padding: 6px 8px;
}

/* 2. Center Living Voice Stage */
.alex-live-call__stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 28px;
  z-index: 5;
}

.alex-live-call__orb-wrap {
  position: relative;
  width: 220px;
  height: 220px;
  display: grid;
  place-items: center;
}

.alex-live-call__orb {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4338ca 0%, #3d4ee8 50%, #06b6d4 100%);
  display: grid;
  place-items: center;
  box-shadow: 0 0 50px rgba(67, 56, 202, 0.65);
  cursor: pointer;
  z-index: 2;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.alex-live-call__orb--listening {
  background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
  box-shadow: 0 0 65px rgba(234, 88, 12, 0.85);
  transform: scale(1.12);
}

.alex-live-call__orb--thinking {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  box-shadow: 0 0 60px rgba(59, 130, 246, 0.8);
  animation: orb-spin 3s linear infinite;
}

.alex-live-call__orb--speaking {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  box-shadow: 0 0 75px rgba(139, 92, 246, 0.9);
  animation: orb-breathe 1.6s ease-in-out infinite alternate;
}

.alex-live-call__ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(99, 102, 241, 0.2);
  pointer-events: none;
}

.alex-live-call__ring--1 { width: 145px; height: 145px; }
.alex-live-call__ring--2 { width: 180px; height: 180px; }
.alex-live-call__ring--3 { width: 215px; height: 215px; }

.alex-live-call__ring--listening {
  border-color: rgba(234, 88, 12, 0.45);
  animation: wave-expand 1.2s ease-out infinite;
}

.alex-live-call__ring--speaking {
  border-color: rgba(139, 92, 246, 0.45);
  animation: wave-expand 1.5s ease-in-out infinite alternate;
}

.alex-live-call__subtitles {
  max-width: 440px;
  width: 100%;
  text-align: center;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.alex-live-call__spoken-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.alex-live-call__live-text {
  margin: 0;
  font-size: 12px;
  color: #f97316;
  font-weight: 600;
}

.alex-live-call__interaction-hint {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  letter-spacing: 0.2px;
}

.alex-live-call__stop-speech-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.15s ease;
}

.alex-live-call__stop-speech-btn:hover {
  background: rgba(239, 68, 68, 0.4);
}

/* 3. Bottom Controls */
.alex-live-call__footer {
  padding: 16px 20px;
  padding-bottom: calc(36px + max(24px, env(safe-area-inset-bottom, 0px)));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.alex-live-call__text-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 420px;
}

.alex-live-call__input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  outline: none;
  font-size: 13px;
}

.alex-live-call__send-btn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: var(--color-accent, #3d4ee8);
  border: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.alex-live-call__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.alex-live-call__ctrl-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.alex-live-call__ctrl-btn--active {
  background: var(--color-accent, #3d4ee8);
  border-color: var(--color-accent, #3d4ee8);
}

.alex-live-call__mic-trigger {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-accent, #3d4ee8);
  border: 3px solid rgba(255, 255, 255, 0.25);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(61, 78, 232, 0.6);
  transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.alex-live-call__mic-trigger--recording {
  background: #ea580c;
  transform: scale(1.1);
  box-shadow: 0 4px 30px rgba(234, 88, 12, 0.85);
}

.alex-live-call__mic-trigger--speaking {
  background: #dc2626;
  box-shadow: 0 4px 30px rgba(220, 38, 38, 0.85);
}

/* 4. Slide-up Feature Screens Sheet */
.alex-live-call__drawer-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.alex-live-call__drawer-card {
  background: #13172e;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px 24px 0 0;
  padding: 20px 20px calc(24px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 80vh;
  overflow-y: auto;
}

.alex-live-call__drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alex-live-call__drawer-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.alex-live-call__drawer-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 0;
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.alex-live-call__drawer-desc {
  margin: 0 0 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

.alex-live-call__drawer-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alex-live-call__drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.alex-live-call__drawer-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.alex-live-call__drawer-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-accent, #3d4ee8);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.alex-live-call__drawer-item-info {
  flex: 1;
}

.alex-live-call__drawer-item-title {
  font-size: 14px;
  font-weight: 600;
}

.alex-live-call__drawer-item-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 2px;
}

/* Transitions */
.call-fade-enter-active,
.call-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.call-fade-enter-from,
.call-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes orb-breathe {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}

@keyframes wave-expand {
  0% { transform: scale(0.92); opacity: 0.5; }
  100% { transform: scale(1.22); opacity: 0; }
}

@keyframes dot-pulse {
  0% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
