<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';
import LessonDetail from '../components/LessonDetail.vue';

const route = useRoute();
const {isComplete, markComplete} = useProgress();

const lesson = computed(() =>
  content.lessons.find(
    (l) =>
      l.topicSlug === route.params.topicSlug &&
      l.lessonNum === route.params.lessonNum,
  ),
);
</script>

<template>
  <section v-if="lesson" class="lesson">
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete(lesson)"
      @mark-complete="markComplete(lesson)"
    />
  </section>
  <section v-else class="lesson lesson--empty">
    <p class="lesson__empty-text">Lesson not found.</p>
  </section>
</template>

<style scoped>
/* Hallmark · component: screen header + empty state · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 */

.lesson {
  min-height: 100dvh;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.lesson--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  text-align: center;
}

.lesson__empty-text {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 1.05rem;
  line-height: 1.5;
}
</style>
