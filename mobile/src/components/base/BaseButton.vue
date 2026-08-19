<script setup>
defineProps({
  variant: {type: String, default: 'primary'}, // 'primary' | 'outline'
  tone: {type: String, default: 'default'}, // 'default' | 'coral'
  loading: {type: Boolean, default: false},
  loadingLabel: {type: String, default: 'Loading…'},
  disabled: {type: Boolean, default: false},
});
</script>

<template>
  <button
    type="button"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      {'base-button--coral': tone === 'coral'},
    ]"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
  >
    <template v-if="loading">{{ loadingLabel }}</template>
    <template v-else>
      <slot name="icon" />
      <slot />
    </template>
  </button>
</template>

<style scoped>
/* Hallmark · component: BaseButton · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: default · hover · focus-visible · active · disabled(loading)
 */
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  height: 2.75rem;
  padding: 0 1.4rem;
  border: 0;
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}

.base-button:active:not(:disabled) {
  transform: translateY(1px);
}

.base-button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

@media (hover: hover) {
  .base-button--primary:hover:not(:disabled) {
    background: var(--color-accent-deep);
  }
}

.base-button--outline {
  border: 1.5px solid var(--color-ink-2);
  background: transparent;
  color: var(--color-ink);
}

@media (hover: hover) {
  .base-button--outline:hover:not(:disabled) {
    background: var(--color-paper-3);
  }
}

.base-button--outline.base-button--coral {
  border-color: var(--color-accent-3-deep);
  color: var(--color-accent-3-deep);
}

@media (hover: hover) {
  .base-button--outline.base-button--coral:hover:not(:disabled) {
    background: var(--color-accent-3);
    color: var(--color-ink);
  }
}

@media (prefers-reduced-motion: reduce) {
  .base-button {
    transition:
      background-color var(--dur-fast) linear,
      color var(--dur-fast) linear,
      opacity var(--dur-fast) linear;
    transform: none !important;
  }
}
</style>
