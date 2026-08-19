<template>
  <div class="card"><slot /></div>
</template>

<style scoped>
/* Hallmark · component: Card · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: static only — no interactive elements
 */
.card {
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}
</style>
