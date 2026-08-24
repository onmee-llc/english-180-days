<script setup>
import {ref} from 'vue';
import SvgIcon from '../base/SvgIcon.vue';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'toggle-task',
  'run-code',
  'play-audio',
  'commit-diff',
  'reject-diff',
]);

const isCopied = ref(false);

async function copyCode(code) {
  if (!code || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(code);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch (_) {}
}
</script>

<template>
  <div class="agent-action-card" :class="'agent-action-card--' + (card.type || 'generic').toLowerCase()">
    <!-- 1. Task List Widget -->
    <div v-if="card.type === 'TASK_LIST'" class="card-task">
      <div class="card-task__header">
        <div class="card-task__title">
          <SvgIcon name="task-check" :size="16" />
          <span>Nhiệm vụ đề xuất (Action Items)</span>
        </div>
        <span class="p-badge p-badge--primary">Alex Action</span>
      </div>

      <div class="card-task__list">
        <div
          v-for="task in card.tasks"
          :key="task.id || task.title"
          class="card-task__item"
          :class="{'card-task__item--done': task.completed}"
          @click="$emit('toggle-task', task)"
        >
          <input
            type="checkbox"
            :checked="task.completed"
            class="card-task__checkbox"
            @change.stop="$emit('toggle-task', task)"
          />
          <span class="card-task__item-title">{{ task.title }}</span>
          <span v-if="task.category" class="card-task__item-cat">
            {{ task.category }}
          </span>
        </div>
      </div>
    </div>

    <!-- 2. Code Sandbox Widget -->
    <div v-else-if="card.type === 'CODE_SNIPPET'" class="card-code">
      <div class="card-code__header">
        <span class="card-code__lang">{{ card.language || 'javascript' }}</span>
        <div class="card-code__actions">
          <button
            type="button"
            class="card-code__btn"
            @click="copyCode(card.code)"
          >
            <SvgIcon v-if="isCopied" name="check" :size="12" />
            <span>{{ isCopied ? 'Đã sao chép' : 'Sao chép' }}</span>
          </button>
          <button
            v-if="card.runnable"
            type="button"
            class="card-code__btn card-code__btn--run"
            @click="$emit('run-code', card.code)"
          >
            <SvgIcon name="play" :size="10" />
            <span>Chạy thử</span>
          </button>
        </div>
      </div>
      <pre class="card-code__body"><code>{{ card.code }}</code></pre>
    </div>

    <!-- 3. Git Diff & Review Card Widget -->
    <div v-else-if="card.type === 'GIT_DIFF'" class="card-diff">
      <div class="card-diff__header">
        <div class="card-diff__title">
          <SvgIcon name="git-branch" :size="15" />
          <span>{{ card.branch || 'feature/branch' }}</span>
        </div>
        <span class="card-diff__file">
          <SvgIcon name="diff" :size="13" />
          <code>{{ card.file }}</code>
        </span>
      </div>

      <pre class="card-diff__body"><code class="diff-view">{{ card.diff }}</code></pre>

      <div class="card-diff__footer">
        <button
          type="button"
          class="card-diff__btn card-diff__btn--commit"
          @click="$emit('commit-diff', card)"
        >
          <SvgIcon name="git-commit" :size="14" />
          <span>Approve & Commit</span>
        </button>

        <button
          type="button"
          class="card-diff__btn card-diff__btn--reject"
          @click="$emit('reject-diff', card)"
        >
          <span>Bỏ qua</span>
        </button>
      </div>
    </div>

    <!-- 4. AI Engine Dispatch Status Widget (Antigravity / Claude Code / Codex) -->
    <div v-else-if="card.type === 'AGENT_DISPATCH'" class="card-dispatch">
      <div class="card-dispatch__header">
        <div class="card-dispatch__title">
          <SvgIcon :name="card.engine?.icon || 'cpu'" :size="16" />
          <span>{{ card.engine?.name || 'AI Coding Engine' }}</span>
        </div>
        <span class="p-badge p-badge--primary">{{ card.engine?.badge || 'Orchestrator' }}</span>
      </div>

      <div class="card-dispatch__task-name">{{ card.taskTitle }}</div>

      <!-- Logs -->
      <div v-if="card.logs && card.logs.length > 0" class="card-dispatch__logs">
        <div v-for="(log, idx) in card.logs" :key="idx" class="card-dispatch__log-line">
          {{ log }}
        </div>
      </div>
    </div>

    <!-- 5. Audio / Voice Memo Widget -->
    <div v-else-if="card.type === 'AUDIO_MEMO'" class="card-audio">
      <div class="card-audio__left">
        <button
          type="button"
          class="card-audio__play-btn"
          @click="$emit('play-audio', card.text)"
        >
          <SvgIcon name="play" :size="14" color="#ffffff" />
        </button>
        <div class="card-audio__info">
          <div class="card-audio__title">{{ card.title || 'Voice Note / Luyện phát âm' }}</div>
          <div class="card-audio__ipa" v-if="card.ipa">{{ card.ipa }}</div>
        </div>
      </div>

      <div class="p-waveform-bars">
        <div class="p-waveform-bar"></div>
        <div class="p-waveform-bar"></div>
        <div class="p-waveform-bar"></div>
        <div class="p-waveform-bar"></div>
        <div class="p-waveform-bar"></div>
      </div>
    </div>

    <!-- 6. Background Task Status Widget -->
    <div v-else-if="card.type === 'TASK_QUEUED' || card.type === 'BACKGROUND_COMPLETED'" class="card-job">
      <div class="card-job__header">
        <div class="card-job__icon" :class="{'card-job__icon--done': card.type === 'BACKGROUND_COMPLETED'}">
          <SvgIcon v-if="card.type === 'TASK_QUEUED'" name="gear" :size="14" />
          <SvgIcon v-else name="check" :size="14" :stroke-width="2.5" />
        </div>
        <div class="card-job__content">
          <div class="card-job__title">{{ card.title }}</div>
          <div class="card-job__sub">Job ID: <code>{{ card.jobId }}</code></div>
        </div>
        <span class="p-badge" :class="card.type === 'BACKGROUND_COMPLETED' ? 'p-badge--success' : 'p-badge--warning'">
          {{ card.type === 'BACKGROUND_COMPLETED' ? 'Hoàn thành' : 'Đang xử lý nền' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-action-card {
  margin-top: 10px;
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-default);
  border-radius: var(--p-radius-md);
  box-shadow: var(--p-shadow-card);
  overflow: hidden;
  transition: all 0.2s;
}

.agent-action-card:hover {
  border-color: var(--p-border-strong);
}

/* Task List Card */
.card-task {
  padding: 12px 14px;
}

.card-task__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--p-border-subdued);
}

.card-task__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--p-text-body);
  font-weight: 600;
  color: var(--p-ink-primary);
}

.card-task__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-task__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: var(--p-radius-sm);
  background: var(--p-surface-subdued);
  cursor: pointer;
  transition: background 0.15s;
}

.card-task__item:hover {
  background: var(--p-surface-hover);
}

.card-task__item--done .card-task__item-title {
  text-decoration: line-through;
  color: var(--p-ink-subdued);
}

.card-task__checkbox {
  accent-color: var(--p-color-primary);
  cursor: pointer;
}

.card-task__item-title {
  flex: 1;
  font-size: var(--p-text-body);
  color: var(--p-ink-primary);
}

.card-task__item-cat {
  font-size: var(--p-text-xs);
  padding: 1px 6px;
  border-radius: var(--p-radius-full);
  background: rgba(0, 0, 0, 0.05);
  color: var(--p-ink-secondary);
}

/* Code Snippet Card */
.card-code {
  background: var(--p-surface-code);
  color: #f8fafc;
}

.card-code__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-code__lang {
  font-size: var(--p-text-xs);
  font-family: var(--p-font-mono);
  color: #94a3b8;
  text-transform: uppercase;
}

.card-code__actions {
  display: flex;
  gap: 6px;
}

.card-code__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e2e8f0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: var(--p-text-xs);
  cursor: pointer;
  transition: background 0.15s;
}

.card-code__btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.card-code__btn--run {
  background: var(--p-color-success);
  color: #fff;
}

.card-code__body {
  padding: 12px;
  margin: 0;
  font-family: var(--p-font-mono);
  font-size: var(--p-text-sm);
  line-height: 1.5;
  overflow-x: auto;
}

/* Git Diff Card */
.card-diff {
  background: #ffffff;
}

.card-diff__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--p-surface-subdued);
  border-bottom: 1px solid var(--p-border-subdued);
}

.card-diff__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--p-text-xs);
  font-weight: 600;
  color: var(--p-color-accent);
}

.card-diff__file {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--p-text-xs);
  color: var(--p-ink-secondary);
}

.card-diff__body {
  margin: 0;
  padding: 10px 12px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: var(--p-font-mono);
  font-size: 0.72rem;
  line-height: 1.4;
  overflow-x: auto;
}

.card-diff__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: var(--p-surface-card);
  border-top: 1px solid var(--p-border-subdued);
}

.card-diff__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--p-radius-md);
  font-size: var(--p-text-xs);
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

.card-diff__btn--commit {
  background: var(--p-color-primary);
  color: #fff;
}

.card-diff__btn--reject {
  background: var(--p-surface-subdued);
  border-color: var(--p-border-default);
  color: var(--p-ink-secondary);
}

/* Dispatch Card */
.card-dispatch {
  padding: 10px 14px;
  background: var(--p-surface-subdued);
}

.card-dispatch__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.card-dispatch__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--p-text-sm);
  font-weight: 700;
  color: var(--p-ink-primary);
}

.card-dispatch__task-name {
  font-size: var(--p-text-body);
  font-weight: 600;
  color: var(--p-ink-primary);
  margin-bottom: 6px;
}

.card-dispatch__logs {
  background: var(--p-surface-code);
  color: #a7f3d0;
  padding: 8px;
  border-radius: var(--p-radius-sm);
  font-family: var(--p-font-mono);
  font-size: 0.68rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* Audio Memo Card */
.card-audio {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #f8fafc, #ffffff);
}

.card-audio__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-audio__play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--p-color-primary);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s;
}

.card-audio__play-btn:hover {
  transform: scale(1.06);
}

.card-audio__title {
  font-size: var(--p-text-body);
  font-weight: 600;
  color: var(--p-ink-primary);
}

.card-audio__ipa {
  font-size: var(--p-text-xs);
  font-family: var(--p-font-mono);
  color: var(--p-color-accent);
}

/* Job Card */
.card-job {
  padding: 10px 14px;
}

.card-job__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-job__icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--p-color-warning-tint);
  color: var(--p-color-warning);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: p-pulse-dot 1.5s infinite alternate;
}

.card-job__icon--done {
  background: var(--p-color-success-tint);
  color: var(--p-color-success);
  animation: none;
}

.card-job__content {
  flex: 1;
}

.card-job__title {
  font-size: var(--p-text-body);
  font-weight: 600;
  color: var(--p-ink-primary);
}

.card-job__sub {
  font-size: var(--p-text-xs);
  color: var(--p-ink-secondary);
}
</style>
