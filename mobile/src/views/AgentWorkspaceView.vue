<script setup>
import {ref, computed, onMounted, onUnmounted, nextTick, watch} from 'vue';
import {AgentRuntime} from '../agent-core/AgentRuntime.js';
import {AGENT_PERSONAS} from '../agent-core/AgentPersonas.js';
import {useApiKey} from '../composables/useApiKey.js';
import {useMasteryPoints, XP_REWARDS} from '../composables/useMasteryPoints.js';
import {useAudioRecorder} from '../composables/useAudioRecorder.js';
import {useProgress} from '../composables/useProgress.js';
import {playTtsAudio} from '../composables/useSpeechAudio.js';
import content from '../content/lessons.json';

import AgentSidebar from '../components/agent/AgentSidebar.vue';
import AgentMessageCard from '../components/agent/AgentMessageCard.vue';
import AgentPromptBar from '../components/agent/AgentPromptBar.vue';
import AgentContextDrawer from '../components/agent/AgentContextDrawer.vue';
import SvgIcon from '../components/base/SvgIcon.vue';

// Styling
import '../styles/agent-polaris.css';

const {apiKey, init: initApiKey} = useApiKey();
const {totalXp, currentLevel, addXp} = useMasteryPoints();
const {progress} = useProgress();
const {status: audioStatus, startRecording, stopRecording} = useAudioRecorder();

const activeChannelId = ref('companion');
const isSidebarOpen = ref(true);
const isDrawerOpen = ref(false);
const isStreaming = ref(false);
const isRecording = computed(() => audioStatus.value === 'recording');

const messagesContainerRef = ref(null);

// Initialize Agent Core Runtime
const runtime = ref(null);
const activeJobs = ref([]);
const activeMessages = ref([]);
const archivedMessages = ref([]);
const showArchivedHistory = ref(false);

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length);
const currentPersona = computed(() => AGENT_PERSONAS[activeChannelId.value] || AGENT_PERSONAS.companion);
const runningJobsCount = computed(() => activeJobs.value.filter((j) => j.status === 'running' || j.status === 'queued').length);

function initRuntime() {
  runtime.value = new AgentRuntime({
    apiKey: apiKey.value,
    contentLessons: content.lessons || [],
    masteryStore: {
      getStats: () => ({xp: totalXp.value, level: currentLevel.value.level, streak: streakCount.value}),
      addXp: (amount, reason) => addXp(amount, reason),
    },
  });

  // Subscribe to background tasks
  runtime.value.getTaskEngine().subscribe(() => {
    activeJobs.value = runtime.value.getTaskEngine().getTasks();
  });

  refreshMessages();
}

function refreshMessages() {
  if (!runtime.value) return;
  const memory = runtime.value.getMemory();
  activeMessages.value = [...memory.getTodayThreadMessages(activeChannelId.value)];
  archivedMessages.value = [...memory.getArchivedMessages(activeChannelId.value)];
  scrollToBottom();
}

watch(activeChannelId, () => {
  refreshMessages();
});

watch(apiKey, (newKey) => {
  if (runtime.value) {
    runtime.value.setApiKey(newKey);
  }
});

onMounted(async () => {
  await initApiKey();
  initRuntime();
  // On mobile screens, collapse sidebar by default
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false;
  }
});

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
    }
  });
}

async function handleSendPrompt({prompt, mode}) {
  if (!runtime.value || isStreaming.value) return;

  isStreaming.value = mode === 'stream';
  scrollToBottom();

  await runtime.value.sendPrompt({
    channelId: activeChannelId.value,
    prompt,
    mode,
    onToken: () => {
      refreshMessages();
    },
    onComplete: () => {
      isStreaming.value = false;
      refreshMessages();
      addXp(XP_REWARDS.SPEAK_SESSION || 10, 'Tương tác cùng Alex AI');
    },
    onError: () => {
      isStreaming.value = false;
      refreshMessages();
    },
  });
}

function handleStopStream() {
  if (runtime.value) {
    runtime.value.abortActiveStream();
    isStreaming.value = false;
    refreshMessages();
  }
}

async function handleStartRecording() {
  try {
    await startRecording();
  } catch (err) {
    console.error('Audio record error:', err);
  }
}

async function handleStopRecording() {
  try {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      handleSendPrompt({
        prompt: 'Tôi vừa gửi một đoạn ghi âm giọng nói. Hãy lắng nghe và phản hồi hỗ trợ tôi.',
        mode: 'stream',
      });
    }
  } catch (err) {
    console.error('Stop audio error:', err);
  }
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
      prompt: `Kết quả chạy thử mã nguồn:\n\`\`\`json\n${JSON.stringify(res.result || res.error, null, 2)}\n\`\`\``,
      mode: 'stream',
    });
  });
}

function handlePlayAudio(text) {
  if (!text) return;
  playTtsAudio(text, 0.9);
}

function handleClearThread() {
  if (!runtime.value) return;
  runtime.value.getMemory().clearThread(activeChannelId.value);
  refreshMessages();
}

function handleCommitDiff(card) {
  if (!runtime.value) return;
  runtime.value.getToolRegistry().execute('manage_git_repo', {
    action: 'commit_push',
    commitMessage: `feat: applied changes for ${card.file} via Alex AI`,
  }).then((res) => {
    handleSendPrompt({
      prompt: `Đã phê duyệt và commit code thành công cho Robert!\n- **Commit:** \`${res.commitId || 'c_latest'}\`\n- **Branch:** \`${res.branch || 'main'}\`\n- **PR Link:** ${res.prUrl || ''}`,
      mode: 'stream',
    });
  });
}

function handleRejectDiff(card) {
  handleSendPrompt({
    prompt: `Robert đã xem diff của \`${card.file}\` nhưng chưa ưng ý. Hãy phân tích lại và đưa ra phương án tối ưu hơn.`,
    mode: 'stream',
  });
}

function handleCancelJob(jobId) {
  if (runtime.value) {
    runtime.value.getTaskEngine().cancel(jobId);
  }
}
</script>

<template>
  <div class="agent-workspace">
    <!-- 1. Left Channel Sidebar (Shopify Messaging style) -->
    <AgentSidebar
      :active-channel-id="activeChannelId"
      :running-tasks-count="runningJobsCount"
      :is-open="isSidebarOpen"
      @select-channel="activeChannelId = $event"
      @open-context="isDrawerOpen = true"
      @close-sidebar="isSidebarOpen = false"
    />

    <!-- 2. Main Agent Interactive Stream Hub -->
    <main class="agent-main">
      <!-- Top Action Bar -->
      <header class="agent-main__header">
        <div class="agent-main__header-left">
          <button
            type="button"
            class="agent-main__icon-btn"
            title="Đóng/Mở Danh sách Kênh"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <SvgIcon name="menu" :size="18" />
          </button>

          <div class="agent-main__persona-info">
            <div class="agent-main__persona-title">
              <span>{{ currentPersona.name }}</span>
              <span class="p-badge p-badge--primary">{{ currentPersona.badge }}</span>
            </div>
            <div class="agent-main__persona-status">
              <span class="agent-main__status-dot"></span>
              <span>Sẵn sàng xử lý · Real-time Gemini 2.5</span>
            </div>
          </div>
        </div>

        <div class="agent-main__header-right">
          <button
            type="button"
            class="agent-main__icon-btn"
            title="Xóa lịch sử hội thoại hiện tại"
            @click="handleClearThread"
          >
            <SvgIcon name="trash" :size="16" />
          </button>

          <button
            type="button"
            class="agent-main__context-btn"
            :class="{'agent-main__context-btn--active': isDrawerOpen}"
            title="Mở Inspector & Hàng đợi Tác vụ"
            @click="isDrawerOpen = !isDrawerOpen"
          >
            <SvgIcon name="inspector" :size="16" />
            <span class="agent-main__context-text">Inspector</span>
            <span v-if="runningJobsCount > 0" class="p-badge p-badge--warning">
              {{ runningJobsCount }}
            </span>
          </button>
        </div>
      </header>

      <!-- Message History Stream Container -->
      <div ref="messagesContainerRef" class="agent-main__stream">
        <div class="agent-main__stream-content">
          <!-- Persona Welcome Banner -->
          <div class="agent-main__welcome-card">
            <div class="agent-main__welcome-badge" :style="{background: currentPersona.avatarBg}">
              <SvgIcon :name="currentPersona.avatarIcon" :size="20" color="#ffffff" :stroke-width="2.2" />
            </div>
            <h3>{{ currentPersona.name }}</h3>
            <p>{{ currentPersona.role }} · Trợ lý của Robert</p>
          </div>

          <!-- Archived History Collapsible Accordion (Past Days) -->
          <div v-if="archivedMessages.length > 0" class="agent-main__history-accordion">
            <button
              type="button"
              class="agent-main__history-toggle-btn"
              @click="showArchivedHistory = !showArchivedHistory"
            >
              <SvgIcon :name="showArchivedHistory ? 'close' : 'drawer'" :size="13" />
              <span>{{ showArchivedHistory ? 'Ẩn lịch sử ngày trước' : `Xem ${archivedMessages.length} tin nhắn từ các ngày trước` }}</span>
            </button>

            <div v-if="showArchivedHistory" class="agent-main__archived-list">
              <AgentMessageCard
                v-for="(msg, idx) in archivedMessages"
                :key="msg.id || idx"
                :message="msg"
                :channel-id="activeChannelId"
                @toggle-task="handleToggleTask"
                @run-code="handleRunCode"
                @play-audio="handlePlayAudio"
                @commit-diff="handleCommitDiff"
                @reject-diff="handleRejectDiff"
              />
            </div>
          </div>

          <!-- Today Active Messages -->
          <AgentMessageCard
            v-for="(msg, idx) in activeMessages"
            :key="msg.id || idx"
            :message="msg"
            :channel-id="activeChannelId"
            :is-streaming="isStreaming && idx === activeMessages.length - 1 && msg.role === 'model'"
            @toggle-task="handleToggleTask"
            @run-code="handleRunCode"
            @play-audio="handlePlayAudio"
            @commit-diff="handleCommitDiff"
            @reject-diff="handleRejectDiff"
          />
        </div>
      </div>

      <!-- 3. Bottom Multimodal Prompt Bar -->
      <AgentPromptBar
        :channel-id="activeChannelId"
        :is-streaming="isStreaming"
        :is-recording="isRecording"
        @send-prompt="handleSendPrompt"
        @stop-stream="handleStopStream"
        @start-recording="handleStartRecording"
        @stop-recording="handleStopRecording"
      />
    </main>

    <!-- 4. Right Inspector & Memory Drawer -->
    <AgentContextDrawer
      :is-open="isDrawerOpen"
      :profile="runtime?.getMemory()?.getProfile() || {}"
      :tasks="runtime?.getMemory()?.getTasks() || []"
      :active-jobs="activeJobs"
      :tools="runtime?.getToolRegistry()?.list() || []"
      :xp="totalXp"
      :streak="streakCount"
      @close-drawer="isDrawerOpen = false"
      @cancel-job="handleCancelJob"
    />
  </div>
</template>

<style scoped>
.agent-workspace {
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  background: var(--p-surface-bg);
  overflow: hidden;
  position: relative;
}

.agent-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: var(--p-surface-bg);
  position: relative;
}

.agent-main__header {
  padding: 12px 20px;
  background: var(--p-surface-card);
  border-bottom: 1px solid var(--p-border-subdued);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  z-index: 10;
}

.agent-main__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-main__persona-info {
  display: flex;
  flex-direction: column;
}

.agent-main__persona-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--p-ink-primary);
}

.agent-main__persona-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--p-color-success);
}

.agent-main__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--p-color-success);
  box-shadow: 0 0 0 2px rgba(0, 128, 96, 0.2);
}

.agent-main__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-main__icon-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--p-radius-sm);
  border: 1px solid var(--p-border-subdued);
  background: var(--p-surface-card);
  color: var(--p-ink-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.agent-main__icon-btn:hover {
  background: var(--p-surface-hover);
  color: var(--p-ink-primary);
}

.agent-main__context-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--p-radius-sm);
  border: 1px solid var(--p-border-subdued);
  background: var(--p-surface-card);
  color: var(--p-ink-primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.agent-main__context-btn:hover,
.agent-main__context-btn--active {
  background: var(--p-surface-hover);
  border-color: var(--p-border-strong);
  color: var(--p-color-primary);
}

.agent-main__stream {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.agent-main__stream-content {
  max-width: 840px;
  margin: 0 auto;
}

.agent-main__welcome-card {
  text-align: center;
  padding: 24px 16px;
  margin-bottom: 24px;
  background: var(--p-surface-card);
  border-radius: var(--p-radius-lg);
  border: 1px solid var(--p-border-subdued);
  box-shadow: var(--p-shadow-card);
}

.agent-main__welcome-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(61, 78, 232, 0.25);
}

.agent-main__welcome-card h3 {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--p-ink-primary);
}

.agent-main__welcome-card p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--p-ink-secondary);
}

.agent-main__history-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.agent-main__history-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--p-radius-sm);
  border: 1px dashed var(--p-border-subdued);
  background: var(--p-surface-card);
  color: var(--p-ink-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
}

.agent-main__archived-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--p-surface-subdued);
  border-radius: var(--p-radius-md);
  border: 1px solid var(--p-border-subdued);
  opacity: 0.85;
}

@media (max-width: 768px) {
  .agent-main__context-text {
    display: none;
  }
}
</style>
