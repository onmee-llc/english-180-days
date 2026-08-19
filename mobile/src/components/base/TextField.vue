<script setup>
defineOptions({inheritAttrs: false});

const props = defineProps({
  modelValue: {type: String, default: ''},
  type: {type: String, default: 'text'},
  label: {type: String, required: true},
  id: {type: String, required: true},
  hint: {type: String, default: ''},
  error: {type: String, default: ''},
  success: {type: String, default: ''},
});

defineEmits(['update:modelValue']);

const hintId = `${props.id}-hint`;
</script>

<template>
  <div class="text-field">
    <label :for="id" class="text-field__label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      class="text-field__input"
      :value="modelValue"
      :aria-invalid="!!error"
      :aria-describedby="hintId"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span class="text-field__success" role="status">{{ success }}</span>
    <p
      :id="hintId"
      class="text-field__hint"
      :class="{'text-field__hint--error': error}"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<style scoped>
/* Hallmark · component: TextField · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: default · hover · focus-visible · error · success
 */
.text-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.text-field__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink-2);
}

.text-field__input {
  height: 2.75rem;
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  outline: 2px solid transparent;
  outline-offset: 1px;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 0.95rem;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.text-field__input::placeholder {
  color: var(--color-ink-3);
}

@media (hover: hover) {
  .text-field__input:hover {
    background: var(--color-paper-3);
  }
}

.text-field__input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
  border-color: var(--color-ink-2);
}

.text-field__success {
  min-height: 1lh;
  color: var(--color-accent-2);
  font-size: 0.85rem;
  font-weight: 600;
}

.text-field__hint {
  margin: 0;
  min-height: 1lh;
  color: var(--color-ink-3);
  font-size: 0.8rem;
  line-height: 1.5;
}

.text-field__hint--error {
  color: var(--color-accent-3-deep);
}
</style>
