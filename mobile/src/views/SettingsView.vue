<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';
import {getBadges} from '../composables/useBadges.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import Badge from '../components/base/Badge.vue';
import TextField from '../components/base/TextField.vue';
import Card from '../components/base/Card.vue';
import {version as appVersion} from '../../package.json';

// This screen is only ever reached signed-in (the router's authGuard
// guarantees it), so there's no sign-in button or auth-error branch here
// anymore — that lives in LoginView.vue now.
const {user, progress, signOut} = useProgress();
const router = useRouter();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length);
const completedCount = computed(() => progress.value.completed.length);
const badges = computed(() =>
  getBadges({streakCount: streakCount.value, completedCount: completedCount.value}),
);

const apiKeyDraft = ref('');
const apiKeySaved = ref(false);
const apiKeyError = ref('');

async function handleApiKeyBlur() {
  if (apiKeyDraft.value.trim() === apiKey.value) return;
  apiKeyError.value = '';
  try {
    await setApiKey(apiKeyDraft.value.trim());
    apiKeySaved.value = true;
    setTimeout(() => (apiKeySaved.value = false), 2000);
  } catch (err) {
    apiKeyError.value = 'Could not save the key. Please try again.';
  }
}

function handleReminderChange(event) {
  setTime(event.target.value);
}

async function handleSignOut() {
  await signOut();
  router.push({name: 'login'});
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
</script>

<template>
  <section class="settings">
    <ScreenHeader eyebrow="SETTINGS" title="Settings" />

    <Card v-if="user" class="settings__row settings__profile">
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        :alt="user.displayName || user.email"
        class="settings__avatar"
      />
      <div class="settings__profile-info">
        <p class="settings__profile-name">{{ user.displayName || user.email }}</p>
        <p class="settings__profile-email">{{ user.email }}</p>
      </div>
      <div class="settings__profile-stats">
        <span>🔥 {{ streakCount }} {{ streakCount === 1 ? 'day' : 'days' }}</span>
        <span>📚 {{ completedCount }} done</span>
      </div>
      <ul class="settings__badges">
        <Badge
          v-for="badge in badges"
          :key="badge.id"
          :icon="badge.icon"
          :label="badge.label"
          :earned="badge.earned"
        />
      </ul>
    </Card>

    <Card class="settings__row">
      <BaseButton variant="outline" @click="handleSignOut">Sign out</BaseButton>
    </Card>

    <Card>
      <TextField
        id="reminder-time"
        type="time"
        label="Daily reminder"
        :model-value="time"
        @change="handleReminderChange"
      />
    </Card>

    <Card>
      <TextField
        id="gemini-api-key"
        type="password"
        label="Gemini API key"
        v-model="apiKeyDraft"
        placeholder="AIza..."
        autocomplete="off"
        :error="apiKeyError"
        :success="apiKeySaved ? '✓ Saved' : ''"
        hint="Used by the Speak tab to translate and explain sentences. Stored only on this device."
        @blur="handleApiKeyBlur"
      />
    </Card>

    <p class="settings__version">Daily Mastery v{{ appVersion }}</p>
  </section>
</template>

<style scoped>
/* Hallmark · component: settings form · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: buttons — default · hover · focus-visible · active
 *         time/password inputs — default · hover · focus · disabled(n/a)
 */

.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.settings__row {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* ---------- profile ---------- */

.settings__profile {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-sm) var(--space-md);
}

.settings__avatar {
  grid-row: span 2;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-pill);
  object-fit: cover;
}

.settings__profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.settings__profile-name {
  margin: 0;
  font-weight: 600;
}

.settings__profile-email {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.8rem;
}

.settings__profile-stats {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--space-md);
  font-size: 0.9rem;
  font-weight: 500;
}

.settings__badges {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.settings__version {
  margin: 0;
  color: var(--color-ink-3);
  font-size: 0.8rem;
  text-align: center;
}
</style>
