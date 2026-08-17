<script setup>
defineProps({
  lesson: {type: Object, required: true},
  isComplete: {type: Boolean, required: true},
  showSignInHint: {type: Boolean, default: false},
});
defineEmits(['mark-complete']);
</script>

<template>
  <section class="lesson-detail">
    <p class="lesson-detail__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
    <h1>{{ lesson.shortTitle }}</h1>
    <div class="lesson-detail__body" v-html="lesson.bodyHtml"></div>
    <button
      type="button"
      :disabled="isComplete"
      @click="$emit('mark-complete')"
    >
      {{ isComplete ? 'Completed ✓' : 'Mark complete' }}
    </button>
    <p v-if="showSignInHint" class="lesson-detail__hint">
      Sign in from Settings to sync progress across devices.
    </p>
  </section>
</template>
