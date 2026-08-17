<script setup>
import {computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
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
</script>

<template>
  <section class="calendar">
    <header class="calendar__header">
      <p class="calendar__eyebrow">CALENDAR</p>
      <h1 class="calendar__title">Your streak</h1>
    </header>

    <div class="calendar__streak">
      <span class="calendar__streak-flame" aria-hidden="true">🔥</span>
      <span class="calendar__streak-count">{{ streakCount }}</span>
      <span class="calendar__streak-label">{{ streakCount === 1 ? 'day' : 'days' }} in a row</span>
    </div>

    <div v-for="month in months" :key="month.key" class="calendar__month">
      <h2 class="calendar__month-title">{{ month.key }}</h2>
      <ul class="calendar__list">
        <li
          v-for="lesson in month.lessons"
          :key="`${lesson.topicSlug}-${lesson.lessonNum}`"
          class="calendar__day"
          :class="{'calendar__day--done': progress.streak[lesson.date]}"
        >
          <span class="calendar__day-mark" aria-hidden="true"></span>
          <span class="calendar__date">{{ lesson.date }}</span>
          <span class="calendar__title-text">{{ lesson.shortTitle }}</span>
          <span v-if="progress.streak[lesson.date]" class="calendar__done-label">Done</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: streak + list screen · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: day row — pending · done (icon + label + colour, never colour alone)
 */

.calendar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.calendar__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.calendar__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.calendar__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ---------- streak badge — the motivating number ---------- */

.calendar__streak {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-accent-3-tint);
  box-shadow: 0 12px 32px -18px oklch(20% 0.012 250 / 0.25);
}

.calendar__streak-flame {
  font-size: 1.8rem;
  line-height: 1;
}

.calendar__streak-count {
  font-size: 2.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--color-accent-3-deep);
  font-variant-numeric: tabular-nums;
}

.calendar__streak-label {
  color: var(--color-ink-2);
  font-size: 0.95rem;
}

/* ---------- month groups ---------- */

.calendar__month {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.calendar__month-title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
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
  padding: var(--space-sm) var(--space-md);
  border-radius: 14px;
  background: var(--color-paper-2);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.calendar__day-mark {
  flex: none;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-ink-3);
  background: transparent;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.calendar__date {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
}

.calendar__title-text {
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar__done-label {
  flex: none;
  padding: 0.15em 0.6em;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 0.7rem;
  font-weight: 600;
}

.calendar__day--done {
  background: var(--color-accent-2-tint);
}

.calendar__day--done .calendar__day-mark {
  border-color: var(--color-accent-2);
  background: var(--color-accent-2);
}

.calendar__day--done .calendar__title-text {
  color: var(--color-ink-2);
  text-decoration: line-through;
  text-decoration-color: var(--color-ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .calendar__day,
  .calendar__day-mark {
    transition: background-color var(--dur-fast) linear;
  }
}
</style>
