import {createRouter, createWebHistory} from 'vue-router';
import TodayView from './views/TodayView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'today', component: TodayView},
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
  ],
});
