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
    <h1>Calendar</h1>
    <p class="calendar__streak">🔥 {{ streakCount }}-day streak</p>

    <div v-for="month in months" :key="month.key" class="calendar__month">
      <h2>{{ month.key }}</h2>
      <ul>
        <li
          v-for="lesson in month.lessons"
          :key="`${lesson.topicSlug}-${lesson.lessonNum}`"
          :class="{'calendar__day--done': progress.streak[lesson.date]}"
        >
          <span class="calendar__date">{{ lesson.date }}</span>
          <span class="calendar__title">{{ lesson.shortTitle }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.calendar__day--done {
  color: #2ecc71;
}
</style>
