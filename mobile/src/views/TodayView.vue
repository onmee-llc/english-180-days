<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';
import LessonDetail from '../components/LessonDetail.vue';

const {isSignedIn, isComplete, markComplete} = useProgress();

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

const lesson = computed(
  () =>
    content.lessons.find((l) => l.date === todayISO.value) ||
    content.lessons.find((l) => l.date >= content.programStart),
);
</script>

<template>
  <section v-if="lesson" class="today">
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete(lesson)"
      :show-sign-in-hint="!isSignedIn"
      @mark-complete="markComplete(lesson)"
    />
  </section>
  <p v-else>No lesson scheduled for today.</p>
</template>
