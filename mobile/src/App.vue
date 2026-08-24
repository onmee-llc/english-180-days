<script setup>
import {onMounted} from 'vue';
import {useProgress} from './composables/useProgress.js';
import BottomNav from './components/BottomNav.vue';
import SplashView from './views/SplashView.vue';
import AlexLiveCallOverlay from './components/agent/AlexLiveCallOverlay.vue';
import AlexTopDockCoPilot from './components/agent/AlexTopDockCoPilot.vue';

const {init, authResolved, isSignedIn} = useProgress();
onMounted(init);
</script>

<template>
  <SplashView v-if="!authResolved" />
  <template v-else>
    <router-view />
    <AlexTopDockCoPilot v-if="isSignedIn" />
    <AlexLiveCallOverlay v-if="isSignedIn" />
    <BottomNav v-if="isSignedIn" />
  </template>
</template>
