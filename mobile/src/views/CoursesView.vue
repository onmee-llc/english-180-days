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

// topicHighlight comes straight from course content and is mostly a real
// CSS color keyword, but a couple of topics use Tailwind/Material names
// (amber, emerald) that aren't valid CSS — those silently render as no
// color at all. Map the known-invalid ones; anything else passes through
// unchanged, same as before.
const HIGHLIGHT_ALIASES = {amber: '#f59e0b', emerald: '#10b981'};
function topicDotColor(highlight) {
  return HIGHLIGHT_ALIASES[highlight] || highlight;
}
</script>

<template>
  <section class="courses">
    <header class="courses__header">
      <p class="courses__eyebrow">COURSES</p>
      <h1 class="courses__title">All topics</h1>
    </header>

    <article v-for="topic in topics" :key="topic.topicSlug" class="courses__topic">
      <h2 class="courses__topic-title">
        <span
          class="courses__topic-dot"
          :style="{background: topicDotColor(topic.topicHighlight)}"
          aria-hidden="true"
        ></span>
        {{ topic.topicTitle }}
      </h2>
      <ul class="courses__list">
        <li v-for="lesson in topic.lessons" :key="lesson.lessonNum" class="courses__item">
          <router-link
            class="courses__link"
            :to="{name: 'lesson', params: {topicSlug: topic.topicSlug, lessonNum: lesson.lessonNum}}"
          >
            <span class="courses__link-day">Day {{ lesson.day }}</span>
            <span class="courses__link-title">{{ lesson.shortTitle }}</span>
            <span class="courses__link-chevron" aria-hidden="true">›</span>
          </router-link>
        </li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
/* Hallmark · component: grouped list screen · genre: playful (Hum register)
 * theme: Hum — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: lesson link — default · hover(pointer) · focus-visible · active
 */

.courses {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.courses__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.courses__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.courses__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.courses__topic {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.courses__topic-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.courses__topic-dot {
  flex: none;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: var(--radius-pill);
  /* subtle per-topic accent from content data (topicHighlight); a small dot, never a fill */
}

.courses__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.courses__link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: 14px;
  background: var(--color-paper-2);
  color: var(--color-ink);
  text-decoration: none;
  min-height: 44px;
  transition: background-color var(--dur-fast) var(--ease-out);
}

@media (hover: hover) {
  .courses__link:hover {
    background: var(--color-paper-3);
  }
}

.courses__link:active {
  transform: translateY(1px);
}

.courses__link:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.courses__link-day {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
}

.courses__link-title {
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.courses__link-chevron {
  flex: none;
  color: var(--color-ink-3);
  font-size: 1.1rem;
  line-height: 1;
}
</style>
