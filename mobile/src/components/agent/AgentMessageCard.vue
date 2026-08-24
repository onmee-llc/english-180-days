<script setup>
import {ref, computed} from 'vue';
import MarkdownIt from 'markdown-it';
import AgentActionCard from './AgentActionCard.vue';
import SvgIcon from '../base/SvgIcon.vue';
import {AGENT_PERSONAS} from '../../agent-core/AgentPersonas.js';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
  channelId: {
    type: String,
    default: 'companion',
  },
});

const emit = defineEmits([
  'toggle-task',
  'run-code',
  'play-audio',
  'commit-diff',
  'reject-diff',
]);

const isThinkingExpanded = ref(true);

const persona = computed(() => AGENT_PERSONAS[props.channelId] || AGENT_PERSONAS.companion);

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

const renderedHtml = computed(() => {
  if (!props.message.content) return '';
  return md.render(props.message.content);
});

const formattedTime = computed(() => {
  if (!props.message.timestamp) return '';
  const d = new Date(props.message.timestamp);
  return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
});
</script>

<template>
  <div
    class="agent-msg"
    :class="{
      'agent-msg--user': message.role === 'user',
      'agent-msg--model': message.role === 'model',
      'agent-msg--streaming': isStreaming,
    }"
  >
    <!-- Avatar -->
    <div class="agent-msg__avatar">
      <div v-if="message.role === 'user'" class="agent-msg__avatar-user">
        <span>R</span>
      </div>
      <div
        v-else
        class="agent-msg__avatar-model"
        :style="{background: persona.avatarBg}"
      >
        <SvgIcon :name="persona.avatarIcon" :size="16" color="#ffffff" :stroke-width="2.2" />
      </div>
    </div>

    <!-- Message Bubble & Content -->
    <div class="agent-msg__body">
      <div class="agent-msg__meta">
        <span class="agent-msg__sender">
          {{ message.role === 'user' ? 'Bạn' : persona.name }}
        </span>
        <span v-if="message.role === 'model'" class="p-badge p-badge--slate">
          {{ persona.badge }}
        </span>
        <span class="agent-msg__time">{{ formattedTime }}</span>

        <!-- Telemetry Tags (Clean SVG icon, zero emojis) -->
        <span
          v-if="message.telemetry?.tokensPerSec"
          class="agent-msg__telemetry"
          title="Tốc độ xử lý real-time"
        >
          <SvgIcon name="bolt" :size="11" />
          <span>{{ message.telemetry.tokensPerSec }} tok/s</span>
        </span>
      </div>

      <!-- Thinking & Tool Execution Accordion Trace -->
      <div
        v-if="(message.toolsExecuted && message.toolsExecuted.length > 0) || message.thinking"
        class="agent-msg__trace"
      >
        <button
          type="button"
          class="agent-msg__trace-toggle"
          @click="isThinkingExpanded = !isThinkingExpanded"
        >
          <SvgIcon name="gear" :size="12" class="agent-msg__trace-icon" />
          <span>
            {{ message.thinking ? 'Đang suy luận...' : `Đã thực thi ${message.toolsExecuted.length} công cụ` }}
          </span>
          <SvgIcon
            name="chevron-down"
            :size="12"
            :class="{'agent-msg__trace-chevron--open': isThinkingExpanded}"
          />
        </button>

        <div v-show="isThinkingExpanded" class="agent-msg__trace-content">
          <div v-if="message.thinking" class="agent-msg__trace-step">
            <span class="agent-msg__trace-dot"></span>
            <span>{{ message.thinking }}</span>
          </div>

          <div
            v-for="(tool, idx) in message.toolsExecuted"
            :key="idx"
            class="agent-msg__trace-step"
          >
            <span class="agent-msg__trace-dot agent-msg__trace-dot--done"></span>
            <span>
              Tool: <code>{{ tool.toolName }}</code> ({{ tool.executionMs || 10 }}ms)
            </span>
          </div>
        </div>
      </div>

      <!-- Main Text Content -->
      <div class="agent-msg__bubble">
        <div v-if="message.content" class="agent-msg__text" v-html="renderedHtml"></div>
        <span v-if="isStreaming" class="p-streaming-cursor"></span>
      </div>

      <!-- Action Cards (Shopify Messaging widgets) -->
      <div
        v-if="message.actionCards && message.actionCards.length > 0"
        class="agent-msg__cards"
      >
        <AgentActionCard
          v-for="(card, i) in message.actionCards"
          :key="i"
          :card="card"
          @toggle-task="$emit('toggle-task', $event)"
          @run-code="$emit('run-code', $event)"
          @play-audio="$emit('play-audio', $event)"
          @commit-diff="$emit('commit-diff', $event)"
          @reject-diff="$emit('reject-diff', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-msg {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeIn 0.2s ease-out;
}

.agent-msg--user {
  flex-direction: row-reverse;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.agent-msg__avatar {
  flex-shrink: 0;
  margin-top: 2px;
}

.agent-msg__avatar-user {
  width: 32px;
  height: 32px;
  border-radius: var(--p-radius-md);
  background: var(--p-color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.agent-msg__avatar-model {
  width: 32px;
  height: 32px;
  border-radius: var(--p-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.agent-msg__body {
  max-width: 82%;
  display: flex;
  flex-direction: column;
}

.agent-msg--user .agent-msg__body {
  align-items: flex-end;
}

.agent-msg__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.agent-msg__sender {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--p-ink-primary);
}

.agent-msg__time {
  font-size: 0.7rem;
  color: var(--p-ink-subdued);
}

.agent-msg__telemetry {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--p-color-success);
  background: var(--p-color-success-tint);
  padding: 1px 6px;
  border-radius: var(--p-radius-full);
}

/* Thinking & Trace */
.agent-msg__trace {
  margin-bottom: 6px;
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-subdued);
  border-radius: var(--p-radius-sm);
  padding: 4px 8px;
  font-size: 0.72rem;
}

.agent-msg__trace-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--p-ink-secondary);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 0;
  width: 100%;
}

.agent-msg__trace-chevron--open {
  transform: rotate(180deg);
}

.agent-msg__trace-content {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed var(--p-border-subdued);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agent-msg__trace-step {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--p-ink-secondary);
}

.agent-msg__trace-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--p-color-warning);
}

.agent-msg__trace-dot--done {
  background: var(--p-color-success);
}

/* Bubble */
.agent-msg__bubble {
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-subdued);
  border-radius: var(--p-radius-md);
  padding: 12px 16px;
  color: var(--p-ink-primary);
  box-shadow: var(--p-shadow-card);
  line-height: 1.6;
  font-size: 0.88rem;
}

.agent-msg--user .agent-msg__bubble {
  background: var(--p-color-primary);
  color: #fff;
  border-color: var(--p-color-primary);
}

.agent-msg__text :deep(p) {
  margin: 0 0 8px 0;
}

.agent-msg__text :deep(p:last-child) {
  margin-bottom: 0;
}

.agent-msg__text :deep(h1),
.agent-msg__text :deep(h2),
.agent-msg__text :deep(h3) {
  margin: 12px 0 6px 0;
  font-size: 0.98rem;
  color: var(--p-ink-primary);
}

.agent-msg--user .agent-msg__text :deep(h1),
.agent-msg--user .agent-msg__text :deep(h2),
.agent-msg--user .agent-msg__text :deep(h3) {
  color: #fff;
}

.agent-msg__text :deep(code) {
  font-family: var(--font-mono);
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.82em;
}

.agent-msg--user .agent-msg__text :deep(code) {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.agent-msg__text :deep(pre) {
  background: var(--p-surface-code);
  color: #f8fafc;
  padding: 10px 12px;
  border-radius: var(--p-radius-sm);
  overflow-x: auto;
  margin: 8px 0;
}

.agent-msg__cards {
  width: 100%;
}
</style>
