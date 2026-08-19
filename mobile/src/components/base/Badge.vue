<script setup>
defineProps({
  icon: {type: String, required: true},
  label: {type: String, required: true},
  earned: {type: Boolean, default: false},
});
</script>

<template>
  <li class="badge" :class="{'badge--earned': earned}" :title="label">
    <span aria-hidden="true">{{ icon }}</span>
    <span class="badge__label">{{ label }}</span>
  </li>
</template>

<style scoped>
/* Hallmark · component: Badge · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: default · earned
 */
.badge {
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  color: var(--color-ink-3);
  font-size: 0.78rem;
  opacity: 0.55;
}

.badge--earned {
  background: var(--color-accent-2-tint);
  color: var(--color-ink);
  opacity: 1;
}
</style>
