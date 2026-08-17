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
    <h1 class="lesson-detail__title">{{ lesson.shortTitle }}</h1>
    <div class="lesson-detail__body" v-html="lesson.bodyHtml"></div>
    <button
      type="button"
      class="lesson-detail__complete"
      :class="{'lesson-detail__complete--done': isComplete}"
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

<style scoped>
/* Hallmark · component: lesson reading screen · genre: playful (Hum register, offline-adapted)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: mark-complete button — default · hover · focus-visible · active · disabled(done)
 * the lesson body is bundled v-html (markdown-it output + `.lesson-vi` bilingual blocks from
 * scripts/build-content.js) — its tags are styled via :deep() since they aren't scoped.
 */

.lesson-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  max-width: 65ch;
  margin: 0 auto;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.lesson-detail__day {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.lesson-detail__title {
  margin: 0 0 var(--space-xs);
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* ---------- lesson body (v-html) ---------- */

.lesson-detail__body {
  line-height: 1.65;
  font-size: 1rem;
}

.lesson-detail__body :deep(> :first-child) {
  margin-top: 0;
}

.lesson-detail__body :deep(h2) {
  margin: var(--space-xl) 0 var(--space-xs);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.lesson-detail__body :deep(h3) {
  margin: var(--space-lg) 0 var(--space-2xs);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.lesson-detail__body :deep(h4) {
  margin: var(--space-md) 0 var(--space-2xs);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-ink-2);
}

.lesson-detail__body :deep(p) {
  margin: 0 0 var(--space-md);
}

.lesson-detail__body :deep(ul),
.lesson-detail__body :deep(ol) {
  margin: 0 0 var(--space-md);
  padding-left: 1.3em;
}

.lesson-detail__body :deep(li) {
  margin-bottom: var(--space-2xs);
}

.lesson-detail__body :deep(li)::marker {
  color: var(--color-accent-deep);
}

.lesson-detail__body :deep(strong) {
  font-weight: 700;
}

.lesson-detail__body :deep(em) {
  font-style: italic;
}

.lesson-detail__body :deep(a) {
  color: var(--color-accent-2);
  text-decoration-color: color-mix(in oklab, var(--color-accent-2) 40%, transparent);
  text-underline-offset: 0.15em;
}

.lesson-detail__body :deep(a:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

.lesson-detail__body :deep(code) {
  padding: 0.15em 0.4em;
  border-radius: 6px;
  background: var(--color-paper-2);
  font-family: var(--font-mono);
  font-size: 0.88em;
}

.lesson-detail__body :deep(pre) {
  margin: 0 0 var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  overflow-x: auto;
}

.lesson-detail__body :deep(pre code) {
  padding: 0;
  background: none;
}

.lesson-detail__body :deep(hr) {
  margin: var(--space-lg) 0;
  border: 0;
  border-top: 1px solid oklch(20% 0.012 250 / 0.1);
}

.lesson-detail__body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-card);
}

/* blockquote — quiet callout, distinct from the Vietnamese block below */
.lesson-detail__body :deep(blockquote) {
  margin: 0 0 var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--color-accent-deep);
  border-radius: 0 var(--radius-card) var(--radius-card) 0;
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-style: normal;
}

.lesson-detail__body :deep(blockquote > :last-child) {
  margin-bottom: 0;
}

/* tables — key-phrase lists in the bundled content */
.lesson-detail__body :deep(table) {
  width: 100%;
  margin: 0 0 var(--space-md);
  border-collapse: collapse;
  font-size: 0.9rem;
}

.lesson-detail__body :deep(th),
.lesson-detail__body :deep(td) {
  padding: var(--space-xs) var(--space-sm);
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid oklch(20% 0.012 250 / 0.1);
}

.lesson-detail__body :deep(th) {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.lesson-detail__body :deep(tr:last-child td) {
  border-bottom: 0;
}

/* wide tables scroll inside themselves rather than blowing out the page */
.lesson-detail__body :deep(table) {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}

/* ---------- Vietnamese bilingual callout ---------- */

.lesson-detail__body :deep(.lesson-vi) {
  margin: var(--space-sm) 0 var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--color-accent-2);
  border-radius: 0 var(--radius-card) var(--radius-card) 0;
  background: var(--color-accent-2-tint);
}

.lesson-detail__body :deep(.lesson-vi__label) {
  display: inline-block;
  margin-bottom: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent-2);
}

.lesson-detail__body :deep(.lesson-vi__body) {
  color: var(--color-ink);
}

.lesson-detail__body :deep(.lesson-vi__body > :first-child) {
  margin-top: 0;
}

.lesson-detail__body :deep(.lesson-vi__body > :last-child) {
  margin-bottom: 0;
}

/* ---------- mark-complete button ---------- */

.lesson-detail__complete {
  align-self: flex-start;
  margin-top: var(--space-sm);
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 0 0 var(--color-accent-deep);
  transition:
    transform var(--dur-fast) var(--ease-spring),
    box-shadow var(--dur-fast) var(--ease-spring),
    background-color var(--dur-med) var(--ease-out),
    color var(--dur-med) var(--ease-out),
    opacity var(--dur-med) var(--ease-out);
}

@media (hover: hover) {
  .lesson-detail__complete:not(:disabled):hover {
    background: var(--color-accent-deep);
  }
}

.lesson-detail__complete:not(:disabled):active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 0 var(--color-accent-deep);
}

.lesson-detail__complete:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.lesson-detail__complete:disabled,
.lesson-detail__complete--done {
  cursor: not-allowed;
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  box-shadow: none;
  opacity: 0.85;
}

/* ---------- sign-in hint ---------- */

.lesson-detail__hint {
  margin: 0;
  padding-top: var(--space-sm);
  border-top: 1px solid oklch(20% 0.012 250 / 0.08);
  color: var(--color-ink-3);
  font-size: 0.85rem;
}

@media (prefers-reduced-motion: reduce) {
  .lesson-detail__complete {
    transition: background-color var(--dur-fast) linear, color var(--dur-fast) linear;
    transform: none !important;
  }
}
</style>
