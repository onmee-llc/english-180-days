<script setup>
import {onMounted} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';

const {isSignedIn, signIn, signOut} = useProgress();
const {time, init, setTime} = useReminder();

onMounted(init);
</script>

<template>
  <section class="settings">
    <h1>Settings</h1>

    <div class="settings__row">
      <button v-if="!isSignedIn" type="button" @click="signIn">
        Sign in with Google
      </button>
      <button v-else type="button" @click="signOut">Sign out</button>
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
