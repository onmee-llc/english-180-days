<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';

const route = useRoute();
const {progress, markComplete} = useProgress();

const lesson = computed(() =>
  content.lessons.find(
    (l) =>
      l.topicSlug === route.params.topicSlug &&
      l.lessonNum === route.params.lessonNum,
  ),
);
const lessonKey = computed(() =>
  lesson.value ? `${lesson.value.topicSlug}/lesson-${lesson.value.lessonNum}` : '',
);
const isComplete = computed(() =>
  progress.value.completed.includes(lessonKey.value),
);
</script>

<template>
  <section v-if="lesson" class="lesson">
    <p class="lesson__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
    <h1>{{ lesson.shortTitle }}</h1>
    <div class="lesson__body" v-html="lesson.bodyHtml"></div>
    <button
      type="button"
      :disabled="isComplete"
      @click="markComplete(lessonKey)"
    >
      {{ isComplete ? 'Completed ✓' : 'Mark complete' }}
    </button>
  </section>
  <p v-else>Lesson not found.</p>
</template>
