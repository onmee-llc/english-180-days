<script setup>
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';

const router = useRouter();
const {authError, isSignedIn, signIn} = useProgress();

const isSigningIn = ref(false);
const signInError = ref('');

// Navigate off the redirect only once isSignedIn is actually true — not
// right after signIn()'s own promise resolves. signIn() can resolve before
// the onAuthStateChanged listener (which also runs the disallowed-email
// check) has finished — isSignedIn is the one signal that's already been
// through that check.
watch(isSignedIn, (signedIn) => {
  if (signedIn) router.push({name: 'today'});
});

async function handleSignIn() {
  signInError.value = '';
  isSigningIn.value = true;
  try {
    await signIn();
  } catch (err) {
    // Most commonly the user closed the Google account picker — not a bug,
    // just needs a visible message instead of a silently dead button.
    signInError.value = 'Sign-in was cancelled or failed. Please try again.';
  } finally {
    isSigningIn.value = false;
  }
}
</script>

<template>
  <section class="login">
    <div class="login__card">
      <p class="login__eyebrow">SIGN IN</p>
      <h1 class="login__title">Daily Mastery</h1>
      <p class="login__subtitle">
        Sign in with your Google account to start today's lesson.
      </p>

      <button
        type="button"
        class="login__button"
        :disabled="isSigningIn"
        :aria-disabled="isSigningIn"
        @click="handleSignIn"
      >
        <svg
          v-if="!isSigningIn"
          class="login__google-icon"
          viewBox="0 0 18 18"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
          />
        </svg>
        {{ isSigningIn ? 'Signing in…' : 'Sign in with Google' }}
      </button>

      <p v-if="authError || signInError" class="login__error" role="alert">
        {{ authError || signInError }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: auth gate screen · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: sign-in button — default · hover · focus-visible · active · disabled(loading) · error
 */

.login {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.login__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 26rem;
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  text-align: center;
}

.login__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.login__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.login__subtitle {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.95rem;
  line-height: 1.5;
}

.login__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  height: 2.75rem;
  padding: 0 1.4rem;
  margin-top: var(--space-xs);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}

.login__google-icon {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 3px;
  background: var(--color-on-accent);
  padding: 2px;
}

@media (hover: hover) {
  .login__button:hover:not(:disabled) {
    background: var(--color-accent-deep);
  }
}

.login__button:active:not(:disabled) {
  transform: translateY(1px);
}

.login__button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.login__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: 0.85rem;
}

@media (prefers-reduced-motion: reduce) {
  .login__button {
    transition:
      background-color var(--dur-fast) linear,
      opacity var(--dur-fast) linear;
    transform: none !important;
  }
}
</style>
