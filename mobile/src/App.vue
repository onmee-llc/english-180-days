<script setup>
import {onMounted} from 'vue';
import {useProgress} from './composables/useProgress.js';
import BottomNav from './components/BottomNav.vue';

const {init} = useProgress();
onMounted(init);
</script>

<template>
  <router-view />
  <BottomNav />
</template>
