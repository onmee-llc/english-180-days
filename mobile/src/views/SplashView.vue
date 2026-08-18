<script setup>
import iconUrl from '../../brand/icon.svg';
</script>

<template>
  <section class="splash">
    <div class="splash__mark-wrap">
      <span class="splash__ring" aria-hidden="true"></span>
      <img :src="iconUrl" alt="" class="splash__mark" />
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: launch splash · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: static only — no interactive elements
 */

.splash {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  background: var(--color-paper);
}

.splash__mark-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 6rem;
  height: 6rem;
}

.splash__ring {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-card);
  border: 1.5px solid var(--color-accent);
  opacity: 0;
  animation: splash-ring 1.8s var(--ease-out) infinite;
}

@keyframes splash-ring {
  0% {
    transform: scale(0.85);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}

.splash__mark {
  position: relative;
  z-index: 1;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: var(--radius-card);
  box-shadow: 0 10px 24px -8px color-mix(in oklab, var(--color-accent) 55%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .splash__ring {
    animation: none;
    display: none;
  }
}
</style>
