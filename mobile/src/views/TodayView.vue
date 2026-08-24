<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {selectTodayLesson} from '../composables/selectTodayLesson.js';
import {useMasteryPoints} from '../composables/useMasteryPoints.js';
import content from '../content/lessons.json';
import LessonDetail from '../components/LessonDetail.vue';
import SvgIcon from '../components/base/SvgIcon.vue';

const {isComplete, markComplete, hasPassedLesson, progress} = useProgress();
const {totalXp, currentLevel, levelProgressPercent} = useMasteryPoints();

const todayISO = ref(new Date().toISOString().slice(0, 10));
const selectedSessionPace = ref('standard');

function refreshToday() {
  if (document.visibilityState === 'visible') {
    todayISO.value = new Date().toISOString().slice(0, 10);
  }
}

onMounted(() => document.addEventListener('visibilitychange', refreshToday));
onUnmounted(() => document.removeEventListener('visibilitychange', refreshToday));

const activeLesson = computed(() => {
  const uncompleted = content.lessons.find((l) => !isComplete(l) && !hasPassedLesson(l));
  if (uncompleted) return uncompleted;
  const dateBased = selectTodayLesson(content.lessons, todayISO.value);
  return dateBased.lesson || content.lessons[0];
});

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length);
</script>

<template>
  <div class="today-container">
    <!-- Top Bar (Polaris Minimalist) -->
    <header class="today__top-strip">
      <div class="today__top-left">
        <!-- Level & XP Indicator -->
        <span class="today__level-chip">
          <SvgIcon name="star" :size="12" color="#b98900" />
          <span>Lv.{{ currentLevel.level }} · {{ totalXp }} XP</span>
        </span>

        <span class="today__streak-chip">
          <SvgIcon name="flame" :size="12" color="#b98900" />
          <span>{{ streakCount }} ngày</span>
        </span>
      </div>

      <!-- Micro-Learning Session Chips -->
      <div class="today__pace-selector">
        <button
          type="button"
          class="today__pace-btn"
          :class="{'today__pace-btn--active': selectedSessionPace === 'sprint'}"
          title="5 phút"
          @click="selectedSessionPace = 'sprint'"
        >
          5p
        </button>
        <button
          type="button"
          class="today__pace-btn"
          :class="{'today__pace-btn--active': selectedSessionPace === 'standard'}"
          title="10 phút"
          @click="selectedSessionPace = 'standard'"
        >
          10p
        </button>
        <button
          type="button"
          class="today__pace-btn"
          :class="{'today__pace-btn--active': selectedSessionPace === 'mastery'}"
          title="15 phút"
          @click="selectedSessionPace = 'mastery'"
        >
          15p
        </button>
      </div>
    </header>

    <!-- XP Progress Line -->
    <div class="today__xp-line" role="progressbar" :aria-valuenow="levelProgressPercent" aria-valuemin="0" aria-valuemax="100">
      <div
        class="today__xp-line-fill"
        :style="{width: `${levelProgressPercent}%`}"
      ></div>
    </div>

    <!-- AI Agent Co-pilot Launcher Banner -->
    <div class="today__agent-banner" @click="$router.push('/agent')">
      <div class="today__agent-badge">
        <SvgIcon name="spark" :size="16" color="#ffffff" :stroke-width="2.2" />
      </div>
      <div class="today__agent-info">
        <div class="today__agent-title">Alex AI Co-pilot · Trợ lý của Robert</div>
        <div class="today__agent-sub">Lên kế hoạch, điều phối Git & AI Coding Engines</div>
      </div>
      <SvgIcon name="arrow-right" :size="16" class="today__agent-arrow" />
    </div>

    <!-- Active Lesson Details -->
    <main v-if="activeLesson" class="today__main">
      <LessonDetail
        :lesson="activeLesson"
        :is-complete="isComplete(activeLesson) || hasPassedLesson(activeLesson)"
        @mark-complete="markComplete(activeLesson)"
      />
    </main>

    <!-- Fallback Empty State -->
    <main v-else class="today today--empty">
      <div class="today__empty-card">
        <SvgIcon name="check" :size="36" color="#008060" />
        <p class="today__empty-text">
          Chúc mừng Robert! Bạn đã hoàn thành toàn bộ lộ trình bài học.
        </p>
        <div class="today__empty-actions">
          <router-link to="/courses" class="today__empty-btn">
            Khám phá tất cả bài học →
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.today-container {
  min-height: 100vh;
  padding-bottom: 84px;
  background: var(--color-paper);
}

.today__top-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-paper-2);
  border-bottom: 1px solid var(--color-border);
}

.today__top-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.today__level-chip,
.today__streak-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink);
}

.today__pace-selector {
  display: flex;
  gap: 4px;
  background: var(--color-paper-3);
  padding: 3px;
  border-radius: var(--radius-input);
}

.today__pace-btn {
  padding: 3px 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink-2);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.today__pace-btn--active {
  background: var(--color-paper-2);
  color: var(--color-accent);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.today__xp-line {
  height: 3px;
  background: rgba(0, 0, 0, 0.04);
  width: 100%;
}

.today__xp-line-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

.today__agent-banner {
  margin: 14px 16px;
  padding: 12px 16px;
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow-card);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.today__agent-banner:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--color-shadow-glow);
}

.today__agent-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(61, 78, 232, 0.25);
}

.today__agent-info {
  flex: 1;
  min-width: 0;
}

.today__agent-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.01em;
}

.today__agent-sub {
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.today__agent-arrow {
  color: var(--color-ink-3);
}

.today__main {
  padding: 0 16px;
}

.today--empty {
  padding: 24px 16px;
}

.today__empty-card {
  text-align: center;
  padding: 36px 16px;
  background: var(--color-paper-2);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow-card);
}

.today__empty-text {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-ink);
  margin: 12px 0 16px;
}

.today__empty-btn {
  display: inline-flex;
  padding: 10px 18px;
  border-radius: var(--radius-input);
  background: var(--color-accent);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
}
</style>
