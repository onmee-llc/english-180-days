<script setup>
import {onMounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';

const {isSignedIn, authError, signIn, signOut} = useProgress();
const {time, init, setTime} = useReminder();

const signInError = ref('');

async function handleSignIn() {
  signInError.value = '';
  try {
    await signIn();
  } catch (err) {
    // Most commonly the user closed the Google account picker — not a bug,
    // just needs a visible message instead of a silently dead button.
    signInError.value = 'Sign-in was cancelled or failed. Please try again.';
  }
}

onMounted(init);
</script>

<template>
  <section class="settings">
    <h1>Settings</h1>

    <div class="settings__row">
      <button v-if="!isSignedIn" type="button" @click="handleSignIn">
        Sign in with Google
      </button>
      <button v-else type="button" @click="signOut">Sign out</button>
      <p v-if="authError" class="settings__error">{{ authError }}</p>
      <p v-else-if="signInError" class="settings__error">{{ signInError }}</p>
    </div>

    <div class="settings__row">
      <label for="reminder-time">Daily reminder</label>
      <input
        id="reminder-time"
        type="time"
        :value="time"
        @change="setTime($event.target.value)"
      />
    </div>
  </section>
</template>

<style scoped>
.settings__error {
  color: #e0554f;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
