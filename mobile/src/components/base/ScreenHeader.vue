<script setup>
defineProps({
  eyebrow: {type: String, required: true},
  title: {type: String, required: true},
  subtitle: {type: String, default: ''},
});
</script>

<template>
  <header class="screen-header">
    <p class="screen-header__eyebrow">{{ eyebrow }}</p>
    <h1 class="screen-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="screen-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
/* Hallmark · component: ScreenHeader · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: static only — no interactive elements
 */
.screen-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.screen-header__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.screen-header__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.screen-header__subtitle {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
