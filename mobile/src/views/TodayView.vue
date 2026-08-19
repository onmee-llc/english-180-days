<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {selectTodayLesson} from '../composables/selectTodayLesson.js';
import content from '../content/lessons.json';
import LessonDetail from '../components/LessonDetail.vue';

const {isComplete, markComplete} = useProgress();

// A Capacitor app stays resident across midnight, so the date can't be read
// once at setup time — refresh it whenever the app comes back to the
// foreground. `visibilitychange` covers both the WebView and the dev server
// without pulling in @capacitor/app.
const todayISO = ref(new Date().toISOString().slice(0, 10));

function refreshToday() {
  if (document.visibilityState === 'visible') {
    todayISO.value = new Date().toISOString().slice(0, 10);
  }
}

onMounted(() => document.addEventListener('visibilitychange', refreshToday));
onUnmounted(() =>
  document.removeEventListener('visibilitychange', refreshToday),
);

const today = computed(() =>
  selectTodayLesson(content.lessons, todayISO.value),
);
const lesson = computed(() => today.value.lesson);
</script>

<template>
  <section v-if="lesson" class="today">
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete(lesson)"
      @mark-complete="markComplete(lesson)"
    />
  </section>
  <section v-else class="today today--empty">
    <p v-if="today.status === 'complete'" class="today__empty-text">
      🎉 You've completed the program — every lesson is still in Courses.
    </p>
    <p v-else class="today__empty-text">No lesson scheduled for today.</p>
  </section>
</template>

<style scoped>
/* Hallmark · component: screen header + empty state · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * LessonDetail owns its own padding/background; the empty state mirrors it so the
 * screen never flashes unstyled black-on-white while lesson data resolves.
 */

.today {
  min-height: 100dvh;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.today--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  text-align: center;
}

.today__empty-text {
  margin: 0;
  max-width: 32ch;
  color: var(--color-ink-2);
  font-size: var(--text-md);
  line-height: 1.5;
}
</style>
