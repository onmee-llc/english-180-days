<script setup>
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';

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
      <ScreenHeader
        eyebrow="SIGN IN"
        title="Daily Mastery"
        subtitle="Sign in with your Google account to start today's lesson."
      />

      <BaseButton
        :loading="isSigningIn"
        loading-label="Signing in…"
        class="login__button"
        @click="handleSignIn"
      >
        <template #icon>
          <svg
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
        </template>
        Sign in with Google
      </BaseButton>

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

.login__button {
  margin-top: var(--space-xs);
}

.login__google-icon {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 3px;
  background: var(--color-on-accent);
  padding: 2px;
}

.login__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: var(--text-sm);
}
</style>
