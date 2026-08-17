<script setup></script>

<template>
  <nav class="bottom-nav">
    <router-link to="/">Today</router-link>
    <router-link to="/calendar">Calendar</router-link>
    <router-link to="/courses">Courses</router-link>
    <router-link to="/settings">Settings</router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0 env(safe-area-inset-bottom);
  background: #111;
  border-top: 1px solid #333;
}
.bottom-nav a {
  color: #999;
  text-decoration: none;
  font-size: 0.85rem;
}
.bottom-nav a.router-link-exact-active {
  color: #fff;
  font-weight: 600;
}
</style>
