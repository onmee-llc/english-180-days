<script setup>
import {computed} from 'vue';
import content from '../content/lessons.json';

const topics = computed(() => {
  const byTopic = {};
  for (const lesson of content.lessons) {
    (byTopic[lesson.topicSlug] ||= {
      topicSlug: lesson.topicSlug,
      topicTitle: lesson.topicTitle,
      topicHighlight: lesson.topicHighlight,
      lessons: [],
    }).lessons.push(lesson);
  }
  return Object.values(byTopic);
});
</script>

<template>
  <section class="courses">
    <h1>Courses</h1>
    <article v-for="topic in topics" :key="topic.topicSlug" class="courses__topic">
      <h2>{{ topic.topicTitle }}</h2>
      <ul>
        <li v-for="lesson in topic.lessons" :key="lesson.lessonNum">
          <router-link
            :to="{name: 'lesson', params: {topicSlug: topic.topicSlug, lessonNum: lesson.lessonNum}}"
          >
            Day {{ lesson.day }} · {{ lesson.shortTitle }}
          </router-link>
        </li>
      </ul>
    </article>
  </section>
</template>
