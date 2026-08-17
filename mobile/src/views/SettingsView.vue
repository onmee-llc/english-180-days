<script setup>
import {onMounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';

const {isSignedIn, authError, signIn, signOut} = useProgress();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();

const signInError = ref('');
const apiKeyDraft = ref('');
const apiKeySaved = ref(false);

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

async function saveApiKey() {
  await setApiKey(apiKeyDraft.value.trim());
  apiKeySaved.value = true;
  setTimeout(() => (apiKeySaved.value = false), 2000);
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
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

    <div class="settings__row">
      <label for="claude-api-key">Claude API key</label>
      <input
        id="claude-api-key"
        type="password"
        v-model="apiKeyDraft"
        placeholder="sk-ant-..."
        autocomplete="off"
      />
      <button type="button" @click="saveApiKey">Save</button>
      <span v-if="apiKeySaved" class="settings__saved">Saved</span>
      <p class="settings__hint">
        Used by the Speak tab to translate and explain sentences. Stored only
        on this device.
      </p>
    </div>
  </section>
</template>

<style scoped>
.settings__error {
  color: #e0554f;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
.settings__saved {
  color: #2ecc71;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}
.settings__hint {
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
