<script setup>
import {computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';

const {progress, isSignedIn, markComplete} = useProgress();

const todayISO = new Date().toISOString().slice(0, 10);
const lesson = computed(
  () =>
    content.lessons.find((l) => l.date === todayISO) ||
    content.lessons.find((l) => l.date >= content.programStart),
);

const lessonKey = computed(() =>
  lesson.value ? `${lesson.value.topicSlug}/lesson-${lesson.value.lessonNum}` : '',
);
const isComplete = computed(() =>
  progress.value.completed.includes(lessonKey.value),
);
</script>

<template>
  <section v-if="lesson" class="today">
    <p class="today__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
    <h1>{{ lesson.shortTitle }}</h1>
    <div class="today__body" v-html="lesson.bodyHtml"></div>
    <button
      type="button"
      :disabled="isComplete"
      @click="markComplete(lessonKey)"
    >
      {{ isComplete ? 'Completed ✓' : 'Mark complete' }}
    </button>
    <p v-if="!isSignedIn" class="today__hint">
      Sign in from Settings to sync progress across devices.
    </p>
  </section>
  <p v-else>No lesson scheduled for today.</p>
</template>
