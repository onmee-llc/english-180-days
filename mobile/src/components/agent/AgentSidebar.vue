<script setup>
import {ref, computed} from 'vue';
import {DEFAULT_CHANNELS} from '../../agent-core/MemoryStore.js';
import SvgIcon from '../base/SvgIcon.vue';

const props = defineProps({
  activeChannelId: {
    type: String,
    default: 'companion',
  },
  runningTasksCount: {
    type: Number,
    default: 0,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['select-channel', 'open-context', 'close-sidebar']);

const searchQuery = ref('');

const filteredChannels = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return DEFAULT_CHANNELS;
  return DEFAULT_CHANNELS.filter(
    (ch) =>
      ch.title.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q),
  );
});

function onSelect(channelId) {
  emit('select-channel', channelId);
  emit('close-sidebar');
}
</script>

<template>
  <aside class="agent-sidebar" :class="{'agent-sidebar--open': isOpen}">
    <!-- Header -->
    <div class="agent-sidebar__header">
      <div class="agent-sidebar__brand">
        <div class="agent-sidebar__logo-badge">
          <SvgIcon name="logo" :size="18" :stroke-width="2.2" color="#ffffff" />
        </div>
        <div class="agent-sidebar__brand-text">
          <span class="agent-sidebar__brand-title">Daily Mastery</span>
          <span class="agent-sidebar__brand-sub">Alex AI Agent</span>
        </div>
      </div>

      <button
        v-if="runningTasksCount > 0"
        type="button"
        class="agent-sidebar__task-pill"
        title="Xem các tác vụ đang chạy song song"
        @click="$emit('open-context')"
      >
        <span class="agent-sidebar__pulse-dot"></span>
        <SvgIcon name="gear" :size="12" />
        <span>{{ runningTasksCount }} tác vụ</span>
      </button>
    </div>

    <!-- Channel Search Bar -->
    <div class="agent-sidebar__search">
      <SvgIcon name="search" :size="14" class="agent-sidebar__search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm kênh / Persona..."
        class="agent-sidebar__search-input"
      />
    </div>

    <!-- Channels Navigation List (Shopify Messaging style) -->
    <div class="agent-sidebar__section-label">KÊNH TRỢ LÝ (CHANNELS)</div>
    <nav class="agent-sidebar__nav">
      <button
        v-for="channel in filteredChannels"
        :key="channel.id"
        type="button"
        class="agent-sidebar__item"
        :class="{'agent-sidebar__item--active': activeChannelId === channel.id}"
        @click="onSelect(channel.id)"
      >
        <div class="agent-sidebar__item-icon" :class="'agent-sidebar__item-icon--' + channel.id">
          <SvgIcon :name="channel.icon" :size="16" />
        </div>

        <div class="agent-sidebar__item-info">
          <div class="agent-sidebar__item-title">{{ channel.title }}</div>
          <div class="agent-sidebar__item-desc">{{ channel.description }}</div>
        </div>

        <span v-if="channel.unreadCount > 0" class="agent-sidebar__unread-dot">
          {{ channel.unreadCount }}
        </span>
      </button>
    </nav>

    <!-- Footer Quick Actions -->
    <div class="agent-sidebar__footer">
      <button
        type="button"
        class="agent-sidebar__footer-btn"
        @click="$emit('open-context')"
      >
        <SvgIcon name="drawer" :size="16" />
        <span>Inspector & Memory</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.agent-sidebar {
  width: 280px;
  background: var(--p-surface-sidebar);
  border-right: 1px solid var(--p-border-subdued);
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.agent-sidebar__header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--p-border-subdued);
}

.agent-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-sidebar__logo-badge {
  width: 32px;
  height: 32px;
  border-radius: var(--p-radius-md);
  background: var(--p-color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(61, 78, 232, 0.28);
}

.agent-sidebar__brand-text {
  display: flex;
  flex-direction: column;
}

.agent-sidebar__brand-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--p-ink-primary);
  letter-spacing: -0.01em;
}

.agent-sidebar__brand-sub {
  font-size: 0.72rem;
  color: var(--p-ink-secondary);
}

.agent-sidebar__task-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--p-color-primary-tint);
  color: var(--p-color-primary);
  border: 1px solid rgba(61, 78, 232, 0.2);
  border-radius: var(--p-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.agent-sidebar__pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--p-color-primary);
  animation: p-pulse-dot 1s infinite alternate;
}

.agent-sidebar__search {
  padding: 12px 16px;
  position: relative;
  display: flex;
  align-items: center;
}

.agent-sidebar__search-icon {
  position: absolute;
  left: 28px;
  color: var(--p-ink-subdued);
  pointer-events: none;
}

.agent-sidebar__search-input {
  width: 100%;
  padding: 7px 12px 7px 32px;
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-subdued);
  border-radius: var(--p-radius-md);
  font-size: 0.8rem;
  color: var(--p-ink-primary);
  outline: none;
  transition: border-color 0.15s;
}

.agent-sidebar__search-input:focus {
  border-color: var(--p-color-primary);
  box-shadow: 0 0 0 2px var(--p-color-primary-tint);
}

.agent-sidebar__section-label {
  padding: 8px 16px 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--p-ink-subdued);
}

.agent-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agent-sidebar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--p-radius-md);
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
}

.agent-sidebar__item:hover {
  background: var(--p-surface-hover);
}

.agent-sidebar__item--active {
  background: var(--p-surface-card);
  border-color: var(--p-border-default);
  box-shadow: var(--p-shadow-card);
}

.agent-sidebar__item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-sidebar__item-icon--companion {
  background: rgba(61, 78, 232, 0.1);
  color: #3d4ee8;
}

.agent-sidebar__item-icon--engineering {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.agent-sidebar__item-icon--english {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.agent-sidebar__item-icon--finance {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.agent-sidebar__item-icon--inbox {
  background: rgba(100, 116, 139, 0.12);
  color: #475569;
}

.agent-sidebar__item-info {
  flex: 1;
  min-width: 0;
}

.agent-sidebar__item-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--p-ink-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agent-sidebar__item-desc {
  font-size: 0.72rem;
  color: var(--p-ink-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.agent-sidebar__unread-dot {
  background: var(--p-color-primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--p-radius-full);
}

.agent-sidebar__footer {
  padding: 12px 16px;
  border-top: 1px solid var(--p-border-subdued);
}

.agent-sidebar__footer-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--p-surface-card);
  border: 1px solid var(--p-border-subdued);
  border-radius: var(--p-radius-md);
  color: var(--p-ink-primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.agent-sidebar__footer-btn:hover {
  background: var(--p-surface-hover);
  border-color: var(--p-border-default);
}

@media (max-width: 768px) {
  .agent-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .agent-sidebar--open {
    transform: translateX(0);
  }
}
</style>
