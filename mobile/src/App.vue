<script setup>
import {onMounted} from 'vue';
import {useProgress} from './composables/useProgress.js';
import BottomNav from './components/BottomNav.vue';
import SplashView from './views/SplashView.vue';

const {init, authResolved, isSignedIn} = useProgress();
onMounted(init);
</script>

<template>
  <SplashView v-if="!authResolved" />
  <router-view v-else />
  <BottomNav v-if="authResolved && isSignedIn" />
</template>
