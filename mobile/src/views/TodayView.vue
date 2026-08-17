<script setup>
import {computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';
import LessonDetail from '../components/LessonDetail.vue';

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
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete"
      :show-sign-in-hint="!isSignedIn"
      @mark-complete="markComplete(lessonKey)"
    />
  </section>
  <p v-else>No lesson scheduled for today.</p>
</template>
