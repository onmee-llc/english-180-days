<script setup>
import {computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import content from '../content/lessons.json';

const {progress} = useProgress();

const months = computed(() => {
  const byMonth = {};
  for (const lesson of content.lessons) {
    const key = lesson.date.slice(0, 7); // YYYY-MM
    (byMonth[key] ||= []).push(lesson);
  }
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, lessons]) => ({key, lessons}));
});

const streakCount = computed(
  () => Object.keys(progress.value.streak || {}).length,
);

const totalCompleted = computed(() => progress.value.completed?.length || 0);
</script>

<template>
  <section class="calendar">
    <ScreenHeader
      eyebrow="CALENDAR · CHUỖI NGÀY"
      title="Lịch luyện tập"
      subtitle="Theo dõi chuỗi ngày chăm chỉ và các bài học bạn đã hoàn thành."
    />

    <!-- Streak Hero Banner -->
    <div class="calendar__streak-card">
      <div class="calendar__streak-top">
        <div class="calendar__streak-left">
          <svg class="calendar__streak-flame" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <div>
            <span class="calendar__streak-count">{{ streakCount }}</span>
            <span class="calendar__streak-unit">ngày liên tục</span>
          </div>
        </div>
        <div class="calendar__streak-badge">
          <span>{{ totalCompleted }} bài xong</span>
        </div>
      </div>
      <p class="calendar__streak-message">
        {{
          streakCount > 0
            ? 'Tuyệt vời! Bạn đang giữ vững nhịp độ học tập hàng ngày.'
            : 'Hãy hoàn thành bài học hôm nay để bắt đầu chuỗi ngọn lửa!'
        }}
      </p>
    </div>

    <!-- Month Timeline Groups -->
    <div v-for="month in months" :key="month.key" class="calendar__month-card">
      <div class="calendar__month-header">
        <h2 class="calendar__month-title">Tháng {{ month.key }}</h2>
        <span class="calendar__month-count">
          {{ month.lessons.filter((l) => progress.streak[l.date]).length }}/{{ month.lessons.length }} ngày
        </span>
      </div>

      <ul class="calendar__list">
        <li
          v-for="lesson in month.lessons"
          :key="`${lesson.topicSlug}-${lesson.lessonNum}`"
          class="calendar__day"
          :class="{'calendar__day--done': progress.streak[lesson.date]}"
        >
          <span class="calendar__day-mark" aria-hidden="true">
            <span v-if="progress.streak[lesson.date]">✓</span>
          </span>
          <span class="calendar__date">{{ lesson.date.slice(5) }}</span>
          <span class="calendar__title-text">{{ lesson.shortTitle }}</span>
          <span v-if="progress.streak[lesson.date]" class="calendar__done-label">Xong</span>
          <span v-else class="calendar__pending-label">D{{ lesson.day }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6.5rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.calendar * {
  box-sizing: border-box;
}

/* ---------- Streak Hero Card ---------- */
.calendar__streak-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1.5px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 10px 28px -6px rgba(245, 158, 11, 0.25);
}

.calendar__streak-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar__streak-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.calendar__streak-flame {
  font-size: 2.5rem;
  line-height: 1;
  animation: flame-pulse 2s infinite ease-in-out;
}

@keyframes flame-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

.calendar__streak-count {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #b45309;
  font-variant-numeric: tabular-nums;
  margin-right: 0.3rem;
}

.calendar__streak-unit {
  font-size: var(--text-sm);
  font-weight: 700;
  color: #92400e;
}

.calendar__streak-badge {
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-pill);
  background: #fde68a;
  color: #78350f;
  font-size: var(--text-xs);
  font-weight: 700;
}

.calendar__streak-message {
  margin: 0;
  font-size: var(--text-xs);
  color: #78350f;
  font-weight: 500;
}

/* ---------- Month Groups ---------- */
.calendar__month-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  box-shadow: var(--color-shadow-card);
}

.calendar__month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar__month-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.calendar__month-count {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink-2);
  background: var(--color-paper-3);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
}

.calendar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.calendar__day {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-input);
  background: var(--color-paper);
  transition: all var(--dur-fast) var(--ease-out);
}

.calendar__day-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-on-accent);
  font-size: var(--text-2xs);
  font-weight: 800;
}

.calendar__date {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-ink-3);
  font-weight: 600;
}

.calendar__title-text {
  flex: 1;
  min-width: 0;
  font-size: var(--text-sm);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar__done-label {
  flex: none;
  padding: 0.15em 0.55em;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2);
  color: var(--color-on-accent);
  font-size: var(--text-2xs);
  font-weight: 700;
}

.calendar__pending-label {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
  padding: 0.15em 0.45em;
  background: var(--color-paper-3);
  border-radius: var(--radius-pill);
}

.calendar__day--done {
  background: rgba(16, 185, 129, 0.08);
}

.calendar__day--done .calendar__day-mark {
  border-color: var(--color-accent-2);
  background: var(--color-accent-2);
}

.calendar__day--done .calendar__title-text {
  color: var(--color-ink-2);
}

@media (prefers-reduced-motion: reduce) {
  .calendar__streak-flame {
    animation: none;
  }
}
</style>

