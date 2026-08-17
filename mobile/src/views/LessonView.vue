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
  <p v-else>Lesson not found.</p>
</template>
