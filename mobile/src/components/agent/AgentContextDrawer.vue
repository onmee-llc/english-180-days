<script setup>
import {ref, computed} from 'vue';
import {TASK_STATUS} from '../../agent-core/ConcurrentTaskEngine.js';
import SvgIcon from '../base/SvgIcon.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  profile: {
    type: Object,
    default: () => ({}),
  },
  tasks: {
    type: Array,
    default: () => [],
  },
  activeJobs: {
    type: Array,
    default: () => [],
  },
  tools: {
    type: Array,
    default: () => [],
  },
  xp: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close-drawer', 'cancel-job', 'add-task', 'toggle-task']);

const activeTab = ref('tasks'); // 'tasks' | 'memory' | 'tools'
const newGoalInput = ref('');

function onCancelJob(jobId) {
  emit('cancel-job', jobId);
}
</script>

<template>
  <aside class="agent-drawer" :class="{'agent-drawer--open': isOpen}">
    <!-- Header -->
    <div class="agent-drawer__header">
      <div class="agent-drawer__title">
        <SvgIcon name="inspector" :size="16" />
        <span>Inspector & Context</span>
      </div>

      <button
        type="button"
        class="agent-drawer__close-btn"
        @click="$emit('close-drawer')"
      >
        <SvgIcon name="close" :size="16" />
      </button>
    </div>

    <!-- Telemetry Summary Strip (Clean SVG icons, zero emojis) -->
    <div class="agent-drawer__strip">
      <div class="agent-drawer__strip-item">
        <span class="agent-drawer__strip-label">STREAK</span>
        <span class="agent-drawer__strip-val">
          <SvgIcon name="flame" :size="13" color="#f59e0b" />
          <span>{{ streak }} ngày</span>
        </span>
      </div>
      <div class="agent-drawer__strip-item">
        <span class="agent-drawer__strip-label">MASTERY</span>
        <span class="agent-drawer__strip-val">
          <SvgIcon name="star" :size="13" color="#3d4ee8" />
          <span>{{ xp }} XP</span>
        </span>
      </div>
      <div class="agent-drawer__strip-item">
        <span class="agent-drawer__strip-label">MODEL</span>
        <span class="agent-drawer__strip-val">
          <SvgIcon name="bolt" :size="13" color="#008060" />
          <span>Gemini 2.5</span>
        </span>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="agent-drawer__tabs">
      <button
        type="button"
        class="agent-drawer__tab"
        :class="{'agent-drawer__tab--active': activeTab === 'tasks'}"
        @click="activeTab = 'tasks'"
      >
        <span>Tác vụ song song ({{ activeJobs.length }})</span>
      </button>
      <button
        type="button"
        class="agent-drawer__tab"
        :class="{'agent-drawer__tab--active': activeTab === 'memory'}"
        @click="activeTab = 'memory'"
      >
        <span>Bộ nhớ Alex</span>
      </button>
      <button
        type="button"
        class="agent-drawer__tab"
        :class="{'agent-drawer__tab--active': activeTab === 'tools'}"
        @click="activeTab = 'tools'"
      >
        <span>Tools ({{ tools.length }})</span>
      </button>
    </div>

    <!-- Tab 1: Background Concurrent Jobs -->
    <div v-if="activeTab === 'tasks'" class="agent-drawer__content">
      <div class="agent-drawer__section-title">HÀNG ĐỢI CONCURRENCY (BACKGROUND QUEUE)</div>

      <div v-if="activeJobs.length === 0" class="agent-drawer__empty">
        <SvgIcon name="gear" :size="32" class="agent-drawer__empty-icon" />
        <p>Không có tác vụ chạy nền nào đang thực thi.</p>
        <span>Khi bạn gửi prompt ở chế độ "Chạy nền", tiến độ xử lý sẽ hiển thị tại đây theo thời gian thực.</span>
      </div>

      <div v-else class="agent-drawer__jobs-list">
        <div
          v-for="job in activeJobs"
          :key="job.id"
          class="agent-drawer__job-card"
          :class="'agent-drawer__job-card--' + job.status"
        >
          <div class="agent-drawer__job-header">
            <div class="agent-drawer__job-title">{{ job.title }}</div>
            <button
              v-if="job.status === 'running' || job.status === 'queued'"
              type="button"
              class="agent-drawer__job-cancel"
              title="Hủy tác vụ"
              @click="onCancelJob(job.id)"
            >
              Hủy
            </button>
          </div>

          <div class="agent-drawer__job-sub">
            <span>{{ job.statusMessage || job.status }}</span>
            <span v-if="job.durationMs">{{ job.durationMs }}ms</span>
          </div>

          <!-- Progress Bar -->
          <div class="agent-drawer__progress-track">
            <div
              class="agent-drawer__progress-fill"
              :style="{width: `${job.progress}%`}"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Memory & Profile -->
    <div v-else-if="activeTab === 'memory'" class="agent-drawer__content">
      <div class="agent-drawer__section-title">HỒ SƠ CÁ NHÂN & MỤC TIÊU (SEMANTIC MEMORY)</div>

      <div class="agent-drawer__profile-card">
        <div class="agent-drawer__profile-name">{{ profile.name || 'Người dùng' }}</div>
        <div class="agent-drawer__profile-title">{{ profile.title || 'Senior Engineer' }}</div>

        <div class="agent-drawer__goals-label">MỤC TIÊU ĐANG THEO ĐUỔI:</div>
        <ul class="agent-drawer__goals-list">
          <li v-for="(goal, idx) in profile.goals" :key="idx">
            {{ goal }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Tab 3: Connected Tools & Skills -->
    <div v-else class="agent-drawer__content">
      <div class="agent-drawer__section-title">HỆ THỐNG CÔNG CỤ (REGISTERED TOOLS)</div>

      <div class="agent-drawer__tools-list">
        <div v-for="t in tools" :key="t.name" class="agent-drawer__tool-item">
          <div class="agent-drawer__tool-name">
            <code>{{ t.name }}</code>
            <span class="p-badge p-badge--success">Ready</span>
          </div>
          <div class="agent-drawer__tool-desc">{{ t.description }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.agent-drawer {
  width: 300px;
  background: var(--p-surface-card);
  border-left: 1px solid var(--p-border-subdued);
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.agent-drawer__header {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--p-border-subdued);
}

.agent-drawer__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--p-ink-primary);
}

.agent-drawer__close-btn {
  background: none;
  border: none;
  color: var(--p-ink-subdued);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.agent-drawer__close-btn:hover {
  background: var(--p-surface-hover);
  color: var(--p-ink-primary);
}

.agent-drawer__strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 10px 14px;
  background: var(--p-surface-subdued);
  border-bottom: 1px solid var(--p-border-subdued);
  gap: 8px;
}

.agent-drawer__strip-item {
  display: flex;
  flex-direction: column;
}

.agent-drawer__strip-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--p-ink-subdued);
  letter-spacing: 0.05em;
}

.agent-drawer__strip-val {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--p-ink-primary);
  margin-top: 2px;
}

.agent-drawer__tabs {
  display: flex;
  border-bottom: 1px solid var(--p-border-subdued);
  background: var(--p-surface-card);
}

.agent-drawer__tab {
  flex: 1;
  padding: 10px 6px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--p-ink-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.agent-drawer__tab--active {
  color: var(--p-color-primary);
  border-bottom-color: var(--p-color-primary);
}

.agent-drawer__content {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

.agent-drawer__section-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--p-ink-subdued);
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}

.agent-drawer__empty {
  text-align: center;
  padding: 30px 10px;
  color: var(--p-ink-subdued);
  font-size: 0.8rem;
}

.agent-drawer__empty-icon {
  margin: 0 auto 8px;
  display: block;
}

.agent-drawer__empty p {
  font-weight: 600;
  margin: 8px 0 4px;
  color: var(--p-ink-secondary);
}

.agent-drawer__empty span {
  font-size: 0.72rem;
  line-height: 1.4;
  display: block;
}

.agent-drawer__jobs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agent-drawer__job-card {
  padding: 10px 12px;
  border-radius: var(--p-radius-sm);
  background: var(--p-surface-subdued);
  border: 1px solid var(--p-border-subdued);
}

.agent-drawer__job-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.agent-drawer__job-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-ink-primary);
}

.agent-drawer__job-cancel {
  font-size: 0.7rem;
  background: none;
  border: none;
  color: var(--p-color-critical);
  cursor: pointer;
  padding: 0;
}

.agent-drawer__job-sub {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--p-ink-secondary);
  margin: 4px 0 6px;
}

.agent-drawer__progress-track {
  height: 4px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.agent-drawer__progress-fill {
  height: 100%;
  background: var(--p-color-primary);
  transition: width 0.2s ease;
}

.agent-drawer__profile-card {
  background: var(--p-surface-subdued);
  padding: 12px;
  border-radius: var(--p-radius-md);
  border: 1px solid var(--p-border-subdued);
}

.agent-drawer__profile-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--p-ink-primary);
}

.agent-drawer__profile-title {
  font-size: 0.75rem;
  color: var(--p-ink-secondary);
  margin-bottom: 12px;
}

.agent-drawer__goals-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--p-ink-subdued);
  margin-bottom: 6px;
}

.agent-drawer__goals-list {
  margin: 0;
  padding-left: 16px;
  font-size: 0.78rem;
  color: var(--p-ink-primary);
  line-height: 1.5;
}

.agent-drawer__tools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.agent-drawer__tool-item {
  padding: 8px 10px;
  background: var(--p-surface-subdued);
  border-radius: var(--p-radius-sm);
  border: 1px solid var(--p-border-subdued);
}

.agent-drawer__tool-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 700;
}

.agent-drawer__tool-desc {
  font-size: 0.72rem;
  color: var(--p-ink-secondary);
  margin-top: 4px;
}

@media (max-width: 992px) {
  .agent-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 50;
    transform: translateX(100%);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .agent-drawer--open {
    transform: translateX(0);
  }
}
</style>
