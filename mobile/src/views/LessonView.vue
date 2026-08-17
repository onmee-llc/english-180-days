<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';
import LessonDetail from '../components/LessonDetail.vue';

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
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete"
      @mark-complete="markComplete(lessonKey)"
    />
  </section>
  <p v-else>Lesson not found.</p>
</template>
