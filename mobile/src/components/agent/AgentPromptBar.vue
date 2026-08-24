<script setup>
import {ref, watch, nextTick, computed} from 'vue';
import {AGENT_PERSONAS} from '../../agent-core/AgentPersonas.js';
import SvgIcon from '../base/SvgIcon.vue';

const props = defineProps({
  channelId: {
    type: String,
    default: 'companion',
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
  isRecording: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'send-prompt',
  'stop-stream',
  'start-recording',
  'stop-recording',
]);

const inputText = ref('');
const executionMode = ref('stream'); // 'stream' | 'background'
const textareaRef = ref(null);

const persona = computed(() => AGENT_PERSONAS[props.channelId] || AGENT_PERSONAS.companion);

function autoResize() {
  nextTick(() => {
    if (!textareaRef.value) return;
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 140)}px`;
  });
}

watch(inputText, autoResize);

function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitPrompt();
  }
}

function submitPrompt() {
  const text = inputText.value.trim();
  if (!text || props.isStreaming) return;

  emit('send-prompt', {
    prompt: text,
    mode: executionMode.value,
  });

  inputText.value = '';
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
}

function useQuickAction(prompt) {
  inputText.value = prompt;
  submitPrompt();
}

function toggleRecording() {
  if (props.isRecording) {
    emit('stop-recording');
  } else {
    emit('start-recording');
  }
}
</script>

<template>
  <div class="agent-prompt-bar">
    <!-- Quick Action Chips (Shopify Messaging style - zero emojis) -->
    <div class="agent-prompt-bar__chips">
      <button
        v-for="(action, i) in persona.quickActions"
        :key="i"
        type="button"
        class="agent-prompt-bar__chip"
        @click="useQuickAction(action.prompt)"
      >
        <SvgIcon name="spark" :size="12" class="agent-prompt-bar__chip-icon" />
        <span>{{ action.label }}</span>
      </button>
    </div>

    <!-- Main Input Box -->
    <div class="agent-prompt-bar__box">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        placeholder="Nhập yêu cầu cho Alex..."
        rows="1"
        class="agent-prompt-bar__textarea"
        @keydown="handleKeyDown"
      ></textarea>

      <!-- Bottom Controls: Mode Selector + Mic + Send/Stop -->
      <div class="agent-prompt-bar__controls">
        <!-- Execution Mode Switcher -->
        <div class="agent-prompt-bar__mode-group">
          <button
            type="button"
            class="agent-prompt-bar__mode-btn"
            :class="{'agent-prompt-bar__mode-btn--active': executionMode === 'stream'}"
            title="Stream tức thời (Real-time)"
            @click="executionMode = 'stream'"
          >
            <SvgIcon name="bolt" :size="12" />
            <span class="agent-prompt-bar__mode-label">Stream</span>
          </button>

          <button
            type="button"
            class="agent-prompt-bar__mode-btn"
            :class="{'agent-prompt-bar__mode-btn--active': executionMode === 'background'}"
            title="Chạy nền song song (Background Task)"
            @click="executionMode = 'background'"
          >
            <SvgIcon name="gear" :size="12" />
            <span class="agent-prompt-bar__mode-label">Task</span>
          </button>
        </div>

        <div class="agent-prompt-bar__right-actions">
          <!-- Voice Record Button -->
          <button
            type="button"
            class="agent-prompt-bar__mic-btn"
            :class="{'agent-prompt-bar__mic-btn--recording': isRecording}"
            title="Thu âm giọng nói"
            @click="toggleRecording"
          >
            <SvgIcon name="mic" :size="16" />
          </button>

          <!-- Stop Stream Button -->
          <button
            v-if="isStreaming"
            type="button"
            class="agent-prompt-bar__stop-btn"
            title="Dừng phản hồi"
            @click="$emit('stop-stream')"
          >
            <SvgIcon name="stop" :size="12" />
            <span>Dừng</span>
          </button>

          <!-- Send Button -->
          <button
            v-else
            type="button"
            class="agent-prompt-bar__send-btn"
            :disabled="!inputText.trim()"
            @click="submitPrompt"
          >
            <SvgIcon name="send" :size="16" :stroke-width="2.2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-prompt-bar {
  padding: 12px 16px;
  background: var(--p-surface-bg);
  border-top: 1px solid var(--p-border-subdued);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.agent-prompt-bar__chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.agent-prompt-bar__chips::-webkit-scrollbar {
  display: none;
}

.agent-prompt-bar__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-default);
  border-radius: var(--p-radius-full);
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--p-ink-primary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.agent-prompt-bar__chip-icon {
  color: var(--p-color-primary);
}

.agent-prompt-bar__chip:hover {
  background: var(--p-surface-hover);
  border-color: var(--p-border-strong);
  color: var(--p-color-primary);
}

.agent-prompt-bar__box {
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-default);
  border-radius: var(--p-radius-lg);
  padding: 10px 14px;
  box-shadow: var(--p-shadow-card);
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.agent-prompt-bar__box:focus-within {
  border-color: var(--p-color-primary);
  box-shadow: 0 0 0 2px var(--p-color-primary-tint);
}

.agent-prompt-bar__textarea {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  font-size: 0.9rem;
  color: var(--p-ink-primary);
  line-height: 1.5;
  max-height: 140px;
  padding: 0;
  font-family: inherit;
}

.agent-prompt-bar__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--p-border-subdued);
}

.agent-prompt-bar__mode-group {
  display: flex;
  gap: 4px;
  background: var(--p-surface-subdued);
  padding: 2px;
  border-radius: var(--p-radius-sm);
}

.agent-prompt-bar__mode-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  border: none;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--p-ink-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.agent-prompt-bar__mode-btn--active {
  background: var(--p-surface-card);
  color: var(--p-color-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.agent-prompt-bar__right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-prompt-bar__mic-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--p-border-subdued);
  background: var(--p-surface-subdued);
  color: var(--p-ink-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.agent-prompt-bar__mic-btn:hover {
  background: var(--p-surface-hover);
  color: var(--p-ink-primary);
}

.agent-prompt-bar__mic-btn--recording {
  background: #fee2e2;
  color: #ef4444;
  border-color: #ef4444;
  animation: pulse-border 1s infinite;
}

.agent-prompt-bar__send-btn {
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
  transition: all 0.15s;
}

.agent-prompt-bar__send-btn:disabled {
  background: var(--p-surface-subdued);
  color: var(--p-ink-subdued);
  cursor: not-allowed;
}

.agent-prompt-bar__stop-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #fee2e2;
  color: #ef4444;
  border: 1px solid #fca5a5;
  border-radius: var(--p-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
