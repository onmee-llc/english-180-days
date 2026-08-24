import {createRouter, createWebHistory} from 'vue-router';
import {authGuard} from './authGuard.js';
import TodayView from './views/TodayView.vue';
import AlexTalkHomeView from './views/AlexTalkHomeView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'home', component: TodayView},
    {
      path: '/agent',
      name: 'agent',
      component: AlexTalkHomeView,
    },
    {
      path: '/today-lesson',
      name: 'today-lesson',
      component: TodayView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('./views/CalendarView.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('./views/CoursesView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/SettingsView.vue'),
    },
    {
      path: '/lesson/:topicSlug/:lessonNum',
      name: 'lesson',
      component: () => import('./views/LessonView.vue'),
    },
    {
      path: '/speak',
      name: 'speak',
      component: () => import('./views/SpeakView.vue'),
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('./views/AgentWorkspaceView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
    },
  ],
});

router.beforeEach(authGuard);
