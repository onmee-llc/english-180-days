<script setup>
import {ref, computed, onMounted, onUnmounted, nextTick, watch} from 'vue';
import {useRouter} from 'vue-router';
import {AgentRuntime} from '../agent-core/AgentRuntime.js';
import {useApiKey} from '../composables/useApiKey.js';
import {useMasteryPoints, XP_REWARDS} from '../composables/useMasteryPoints.js';
import {useAudioRecorder} from '../composables/useAudioRecorder.js';
import {useProgress} from '../composables/useProgress.js';
import {playTtsAudio, stopTtsAudio} from '../composables/useSpeechAudio.js';
import content from '../content/lessons.json';

import SvgIcon from '../components/base/SvgIcon.vue';
import AgentMessageCard from '../components/agent/AgentMessageCard.vue';
import RobertLifeContextModal from '../components/agent/RobertLifeContextModal.vue';
import '../styles/agent-polaris.css';

const router = useRouter();
const {apiKey, init: initApiKey} = useApiKey();
const {totalXp, currentLevel, addXp} = useMasteryPoints();
const {progress} = useProgress();
const {status: audioStatus, startRecording, stopRecording} = useAudioRecorder();

// --- States ---
const runtime = ref(null);
const briefing = ref(null);
const isLoadingBriefing = ref(false);
const activeMessages = ref([]);
const archivedMessages = ref([]);
const showArchivedHistory = ref(false);
const isStreaming = ref(false);
const messagesContainerRef = ref(null);
const isVaultOpen = ref(false);

// Audio state: Muted by default upon app open
const isAudioMuted = ref(true);
const isPlayingAudio = ref(false);
const activeSpeakingPillar = ref(null);

// Show / Hide Text Input
const isTextInputOpen = ref(false);
const textPromptDraft = ref('');
const textInputRef = ref(null);

// Active Tab in Briefing
const activeBriefingPillarId = ref('work');

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length || 42);
const isRecording = computed(() => audioStatus.value === 'recording');

// Quick prompt suggestions
const quickActionChips = [
  {label: 'Lập kế hoạch hôm nay', prompt: 'Alex, hãy phân tích và lập kế hoạch 3 việc quan trọng nhất hôm nay cho Robert.'},
  {label: 'Báo cáo thị trường', prompt: 'Alex, cập nhật báo cáo thị trường tài chính và xu hướng AI mới nhất.'},
  {label: 'Review Git PRs', prompt: 'Alex, kiểm tra các PRs đang mở và trạng thái code pipeline trên GitHub.'},
  {label: 'Luyện nói tiếng Anh', prompt: 'Alex, hãy cùng Robert thực hành 5 phút nói tiếng Anh chủ đề System Architecture.'},
];

function initRuntime() {
  runtime.value = new AgentRuntime({
    apiKey: apiKey.value,
    contentLessons: content.lessons || [],
    masteryStore: {
      getStats: () => ({xp: totalXp.value, level: currentLevel.value.level, streak: streakCount.value}),
      addXp: (amount, reason) => addXp(amount, reason),
    },
  });

  refreshMessages();
}

function refreshMessages() {
  if (!runtime.value) return;
  const memory = runtime.value.getMemory();
  activeMessages.value = [...memory.getTodayThreadMessages('companion')];
  archivedMessages.value = [...memory.getArchivedMessages('companion')];
  scrollToBottom();
}

async function loadDailyBriefing() {
  if (!runtime.value) return;
  isLoadingBriefing.value = true;
  try {
    const engine = runtime.value.getBriefingEngine();
    briefing.value = await engine.generateBriefing();
  } catch (err) {
    console.error('Failed to load daily briefing:', err);
  } finally {
    isLoadingBriefing.value = false;
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
    }
  });
}

// --- Audio & Voice Actions ---
function toggleAudioMute() {
  isAudioMuted.value = !isAudioMuted.value;
  if (isAudioMuted.value) {
    stopTtsAudio();
    isPlayingAudio.value = false;
  }
}

async function handleVoicePress() {
  if (isRecording.value) {
    await handleStopRecording();
  } else {
    await handleStartRecording();
  }
}

async function handleStartRecording() {
  try {
    await startRecording();
  } catch (err) {
    console.error('Audio record start error:', err);
  }
}

async function handleStopRecording() {
  try {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      handleSendPrompt({
        prompt: 'Tôi vừa gửi một đoạn ghi âm giọng nói. Hãy lắng nghe, tóm tắt và phản hồi hỗ trợ tôi.',
      });
    }
  } catch (err) {
    console.error('Stop audio error:', err);
  }
}

async function playSpokenBriefing() {
  if (!briefing.value?.spokenScript) return;

  // Unmute automatically if user explicitly requested audio briefing
  if (isAudioMuted.value) {
    isAudioMuted.value = false;
  }

  if (isPlayingAudio.value) {
    stopTtsAudio();
    isPlayingAudio.value = false;
    return;
  }

  isPlayingAudio.value = true;
  await playTtsAudio(
    briefing.value.spokenScript,
    0.95,
    () => {
      isPlayingAudio.value = false;
    },
    () => {
      isPlayingAudio.value = false;
    },
    'vi-VN',
    'male',
  );
}

function handlePlayMessageAudio(text) {
  if (!text) return;
  if (isAudioMuted.value) {
    isAudioMuted.value = false;
  }
  playTtsAudio(text, 0.95, null, null, 'vi-VN', 'male');
}

// --- Text Prompt & Turn Dispatch ---
async function handleSendPrompt({prompt}) {
  const text = prompt || textPromptDraft.value;
  if (!text || !text.trim() || !runtime.value || isStreaming.value) return;

  textPromptDraft.value = '';
  isStreaming.value = true;
  scrollToBottom();

  await runtime.value.sendPrompt({
    channelId: 'companion',
    prompt: text,
    mode: 'stream',
    onToken: () => {
      refreshMessages();
    },
    onComplete: (finalMsg) => {
      isStreaming.value = false;
      refreshMessages();
      addXp(XP_REWARDS.SPEAK_SESSION || 10, 'Tương tác cùng Alex AI');

      // If audio is unmuted, speak back the response
      if (!isAudioMuted.value && finalMsg?.content) {
        handlePlayMessageAudio(finalMsg.content);
      }
    },
    onError: () => {
      isStreaming.value = false;
      refreshMessages();
    },
  });
}

function handleToggleTextInput() {
  isTextInputOpen.value = !isTextInputOpen.value;
  if (isTextInputOpen.value) {
    nextTick(() => {
      if (textInputRef.value) {
        textInputRef.value.focus();
      }
    });
  }
}

function handlePillarAction(prompt) {
  handleSendPrompt({prompt});
}

function handleToggleTask(task) {
  if (!runtime.value) return;
  runtime.value.getMemory().toggleTask(task.id);
  refreshMessages();
}

function handleRunCode(code) {
  if (!runtime.value) return;
  runtime.value.getToolRegistry().execute('code_runner', {code}).then((res) => {
    handleSendPrompt({
      prompt: `Kết quả chạy mã nguồn:\n\`\`\`json\n${JSON.stringify(res.result || res.error, null, 2)}\n\`\`\``,
    });
  });
}

onMounted(async () => {
  await initApiKey();
  initRuntime();
  await loadDailyBriefing();
});

onUnmounted(() => {
  stopTtsAudio();
});
</script>

<template>
  <div class="alex-home">
    <!-- 1. Top Executive Bar -->
    <header class="alex-home__topbar">
      <div class="alex-home__topbar-left">
        <span class="alex-home__chip" title="Mastery Level">
          <SvgIcon name="star" :size="13" color="var(--color-warning)" />
          <span>Lv.{{ currentLevel.level }} · {{ totalXp }} XP</span>
        </span>
        <span class="alex-home__chip" title="Chuỗi Streak">
          <SvgIcon name="flame" :size="13" color="var(--color-ember)" />
          <span>{{ streakCount }} ngày</span>
        </span>
      </div>

      <div class="alex-home__topbar-right">
        <!-- Sound Mute/Unmute Toggle Button (Default Muted) -->
        <button
          type="button"
          class="alex-home__audio-btn"
          :class="{'alex-home__audio-btn--active': !isAudioMuted}"
          :title="isAudioMuted ? 'Âm thanh đang tắt (Mặc định). Chạm để bật' : 'Âm thanh đang bật. Chạm để tắt'"
          :aria-label="isAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh'"
          @click="toggleAudioMute"
        >
          <SvgIcon :name="isAudioMuted ? 'volume-x' : 'volume-2'" :size="15" />
          <span class="alex-home__audio-label">{{ isAudioMuted ? 'Tắt âm' : 'Bật âm' }}</span>
        </button>

        <!-- Life Context Vault Button -->
        <button
          type="button"
          class="alex-home__icon-btn"
          title="Hồ sơ cá nhân & Vault của Robert"
          aria-label="Hồ sơ cá nhân"
          @click="isVaultOpen = true"
        >
          <SvgIcon name="star" :size="15" color="var(--color-warning)" />
        </button>

        <button
          type="button"
          class="alex-home__icon-btn"
          title="Mở toàn bộ Agent Workspace"
          aria-label="Agent Workspace"
          @click="$router.push('/agent')"
        >
          <SvgIcon name="drawer" :size="16" />
        </button>
      </div>
    </header>

    <!-- 2. Main Scrollable Container -->
    <main class="alex-home__content">
      <!-- Voice Stage Card -->
      <section class="alex-home__voice-stage">
        <div class="alex-home__voice-avatar-wrap">
          <span
            v-if="isRecording"
            class="alex-home__pulse-ring alex-home__pulse-ring--1"
            aria-hidden="true"
          ></span>
          <span
            v-if="isRecording"
            class="alex-home__pulse-ring alex-home__pulse-ring--2"
            aria-hidden="true"
          ></span>

          <button
            type="button"
            class="alex-home__mic-btn"
            :class="{
              'alex-home__mic-btn--recording': isRecording,
              'alex-home__mic-btn--streaming': isStreaming,
            }"
            :aria-label="isRecording ? 'Đang lắng nghe, chạm để hoàn tất' : 'Chạm để nói chuyện với Alex'"
            @click="handleVoicePress"
          >
            <SvgIcon v-if="!isRecording && !isStreaming" name="mic" :size="30" color="#ffffff" />
            <SvgIcon v-else-if="isRecording" name="stop" :size="24" color="#ffffff" />
            <SvgIcon v-else-if="isStreaming" name="spark" :size="28" color="#ffffff" />
          </button>
        </div>

        <div class="alex-home__voice-text-wrap">
          <h1 class="alex-home__greeting-title">Alex · Trợ lý cá nhân của Robert</h1>
          <p class="alex-home__greeting-sub">
            <span v-if="isRecording" class="alex-home__status-text alex-home__status-text--recording">
              Đang lắng nghe giọng nói của Robert...
            </span>
            <span v-else-if="isStreaming" class="alex-home__status-text alex-home__status-text--streaming">
              Alex đang suy luận và điều phối giải pháp...
            </span>
            <span v-else>
              Mặc định tắt âm. Chạm Mic để trò chuyện hoặc mở bàn phím để gõ.
            </span>
          </p>
        </div>
      </section>

      <!-- 3. Daily Executive Briefing Multi-Pillar Card -->
      <section v-if="briefing" class="alex-home__briefing-card">
        <div class="alex-home__briefing-header">
          <div class="alex-home__briefing-title-wrap">
            <SvgIcon name="bolt" :size="16" color="var(--color-accent)" />
            <span class="alex-home__briefing-title">Báo Cáo Điều Hành Hôm Nay</span>
          </div>
          <button
            type="button"
            class="alex-home__briefing-audio-btn"
            :class="{'alex-home__briefing-audio-btn--playing': isPlayingAudio}"
            title="Nghe Alex đọc tóm tắt báo cáo"
            aria-label="Nghe báo cáo"
            @click="playSpokenBriefing"
          >
            <SvgIcon :name="isPlayingAudio ? 'stop' : 'play'" :size="13" />
            <span>{{ isPlayingAudio ? 'Dừng đọc' : 'Nghe báo cáo' }}</span>
          </button>
        </div>

        <!-- Pillar Navigation Chips -->
        <div class="alex-home__pillar-tabs">
          <button
            v-for="pillar in briefing.pillars"
            :key="pillar.id"
            type="button"
            class="alex-home__pillar-tab"
            :class="{'alex-home__pillar-tab--active': activeBriefingPillarId === pillar.id}"
            @click="activeBriefingPillarId = pillar.id"
          >
            <SvgIcon :name="pillar.icon" :size="13" />
            <span>{{ pillar.title }}</span>
          </button>
        </div>

        <!-- Active Pillar Content -->
        <div
          v-for="pillar in briefing.pillars"
          v-show="activeBriefingPillarId === pillar.id"
          :key="pillar.id"
          class="alex-home__pillar-body"
        >
          <div class="alex-home__pillar-badge-row">
            <span class="alex-home__pillar-badge">{{ pillar.badge }}</span>
            <span class="alex-home__pillar-summary">{{ pillar.summary }}</span>
          </div>

          <ul class="alex-home__pillar-items">
            <li v-for="(item, idx) in pillar.items" :key="idx" class="alex-home__pillar-item" v-html="item"></li>
          </ul>

          <div class="alex-home__pillar-action-row">
            <button
              type="button"
              class="alex-home__pillar-action-btn"
              @click="handlePillarAction(pillar.actionPrompt)"
            >
              <span>Thực hiện cùng Alex</span>
              <SvgIcon name="arrow-right" :size="12" />
            </button>
          </div>
        </div>
      </section>

      <!-- 4. Interactive Conversation Feed -->
      <section ref="messagesContainerRef" class="alex-home__messages-feed">
        <!-- Archived History Collapsible Accordion (Past Days) -->
        <div v-if="archivedMessages.length > 0" class="alex-home__history-accordion">
          <button
            type="button"
            class="alex-home__history-toggle-btn"
            @click="showArchivedHistory = !showArchivedHistory"
          >
            <SvgIcon :name="showArchivedHistory ? 'close' : 'drawer'" :size="13" />
            <span>{{ showArchivedHistory ? 'Ẩn lịch sử ngày trước' : `Xem ${archivedMessages.length} tin nhắn từ các ngày trước` }}</span>
          </button>

          <div v-if="showArchivedHistory" class="alex-home__archived-list">
            <AgentMessageCard
              v-for="msg in archivedMessages"
              :key="msg.id"
              :message="msg"
              @play-audio="handlePlayMessageAudio"
              @toggle-task="handleToggleTask"
              @run-code="handleRunCode"
            />
          </div>
        </div>

        <!-- Today Active Messages -->
        <AgentMessageCard
          v-for="msg in activeMessages"
          :key="msg.id"
          :message="msg"
          @play-audio="handlePlayMessageAudio"
          @toggle-task="handleToggleTask"
          @run-code="handleRunCode"
        />
      </section>
    </main>

    <!-- 5. Show / Hide Text Input & Quick Chips Bar -->
    <footer class="alex-home__footer">
      <!-- Collapsed State: Quick Chips + Expand Keyboard Button -->
      <div v-if="!isTextInputOpen" class="alex-home__collapsed-bar">
        <button
          type="button"
          class="alex-home__type-btn"
          title="Soạn tin nhắn dạng text"
          @click="handleToggleTextInput"
        >
          <SvgIcon name="keyboard" :size="16" color="var(--color-ink-2)" />
          <span>Soạn tin nhắn cho Alex...</span>
        </button>

        <div class="alex-home__quick-chips">
          <button
            v-for="(chip, i) in quickActionChips"
            :key="i"
            type="button"
            class="alex-home__chip-btn"
            @click="handleSendPrompt({prompt: chip.prompt})"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>

      <!-- Expanded State: Full Textarea + Send & Dismiss -->
      <div v-else class="alex-home__expanded-bar">
        <div class="alex-home__input-row">
          <textarea
            ref="textInputRef"
            v-model="textPromptDraft"
            rows="2"
            class="alex-home__textarea"
            placeholder="Nhập yêu cầu, tác vụ hoặc câu hỏi cho Alex..."
            @keydown.enter.exact.prevent="handleSendPrompt({})"
          ></textarea>

          <div class="alex-home__input-controls">
            <button
              type="button"
              class="alex-home__control-btn"
              title="Đóng bàn phím"
              aria-label="Đóng bàn phím"
              @click="isTextInputOpen = false"
            >
              <SvgIcon name="close" :size="16" />
            </button>

            <button
              type="button"
              class="alex-home__send-btn"
              :disabled="!textPromptDraft.trim() || isStreaming"
              title="Gửi tin nhắn"
              aria-label="Gửi tin nhắn"
              @click="handleSendPrompt({})"
            >
              <SvgIcon name="send" :size="16" color="#ffffff" />
            </button>
          </div>
        </div>
      </div>
    </footer>

    <!-- Robert Life Context & Encrypted Vault Modal -->
    <RobertLifeContextModal
      v-if="runtime"
      :is-open="isVaultOpen"
      :memory-store="runtime.getMemory()"
      :decision-journal="runtime.getDecisionJournal()"
      @close="isVaultOpen = false"
      @ask-alex="handleSendPrompt({prompt: $event})"
    />
  </div>
</template>

<style scoped>
.alex-home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

/* 1. Top Bar */
.alex-home__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--color-paper-2);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.alex-home__topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alex-home__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  border: 1px solid var(--color-border);
  font-size: var(--text-2xs);
  font-weight: 600;
  color: var(--color-ink);
}

.alex-home__topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alex-home__audio-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.alex-home__audio-btn--active {
  background: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.alex-home__audio-label {
  font-size: var(--text-2xs);
}

.alex-home__icon-btn {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  cursor: pointer;
}

/* 2. Scrollable Content */
.alex-home__content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  -webkit-overflow-scrolling: touch;
}

/* Voice Stage */
.alex-home__voice-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px;
  background: var(--color-paper-2);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow-card);
}

.alex-home__voice-avatar-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
}

.alex-home__mic-btn {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-pill);
  border: 0;
  background: var(--color-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: var(--color-shadow-glow);
  transition: all var(--dur-fast) var(--ease-spring);
  z-index: 2;
}

.alex-home__mic-btn--recording {
  background: var(--color-accent-3);
  transform: scale(1.08);
}

.alex-home__mic-btn--streaming {
  background: var(--color-paper-dark);
}

.alex-home__pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: var(--radius-pill);
  border: 2px solid var(--color-accent-3);
  animation: alex-pulse 1.4s infinite cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 1;
}

.alex-home__pulse-ring--2 {
  inset: -14px;
  animation-delay: 0.3s;
}

@keyframes alex-pulse {
  0% { transform: scale(0.9); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

.alex-home__voice-text-wrap {
  margin-top: 12px;
}

.alex-home__greeting-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.01em;
}

.alex-home__greeting-sub {
  margin: 4px 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}

.alex-home__status-text--recording {
  color: var(--color-accent-3);
  font-weight: 600;
}

.alex-home__status-text--streaming {
  color: var(--color-accent);
  font-weight: 600;
}

/* 3. Daily Executive Briefing */
.alex-home__briefing-card {
  padding: 14px 16px;
  background: var(--color-paper-2);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow-card);
}

.alex-home__briefing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-hairline);
}

.alex-home__briefing-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.alex-home__briefing-title {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.alex-home__briefing-audio-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.alex-home__briefing-audio-btn--playing {
  background: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.alex-home__pillar-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 10px 0 6px;
  scrollbar-width: none;
}

.alex-home__pillar-tabs::-webkit-scrollbar {
  display: none;
}

.alex-home__pillar-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.alex-home__pillar-tab--active {
  background: var(--color-paper-dark);
  color: #ffffff;
  border-color: var(--color-paper-dark);
}

.alex-home__pillar-body {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alex-home__pillar-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alex-home__pillar-badge {
  font-size: var(--text-2xs);
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  background: var(--color-ember-tint);
  color: var(--color-ember);
}

.alex-home__pillar-summary {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink);
}

.alex-home__pillar-items {
  list-style: disc;
  padding-left: 18px;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alex-home__pillar-item {
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  line-height: 1.45;
}

.alex-home__pillar-action-row {
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
}

.alex-home__pillar-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  font-size: var(--text-2xs);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.alex-home__pillar-action-btn:hover {
  background: var(--color-accent);
  color: #ffffff;
}

/* 4. Messages Feed */
.alex-home__messages-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alex-home__history-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 4px;
}

.alex-home__history-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  border: 1px dashed var(--color-border-strong);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  cursor: pointer;
  align-self: center;
}

.alex-home__archived-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  background: var(--color-paper-3);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  opacity: 0.85;
}

/* 5. Bottom Footer Input & Quick Chips */
.alex-home__footer {
  position: fixed;
  bottom: calc(56px + max(14px, env(safe-area-inset-bottom, 0px)));
  left: 0;
  right: 0;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-border);
  z-index: 90;
}

.alex-home__collapsed-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alex-home__type-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink-3);
  font-size: var(--text-xs);
  text-align: left;
  cursor: pointer;
}

.alex-home__quick-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.alex-home__quick-chips::-webkit-scrollbar {
  display: none;
}

.alex-home__chip-btn {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.alex-home__expanded-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alex-home__input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.alex-home__textarea {
  flex: 1;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border-strong);
  background: var(--color-paper-2);
  padding: 8px 12px;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--color-ink);
  resize: none;
  outline: none;
}

.alex-home__textarea:focus {
  border-color: var(--color-accent);
}

.alex-home__input-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.alex-home__control-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.alex-home__send-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-input);
  border: 0;
  background: var(--color-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.alex-home__send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
