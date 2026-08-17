import {createRouter, createWebHistory} from 'vue-router';
import TodayView from './views/TodayView.vue';
import CalendarView from './views/CalendarView.vue';
import CoursesView from './views/CoursesView.vue';
import SettingsView from './views/SettingsView.vue';
import LessonView from './views/LessonView.vue';
import SpeakView from './views/SpeakView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'today', component: TodayView},
    {path: '/calendar', name: 'calendar', component: CalendarView},
    {path: '/courses', name: 'courses', component: CoursesView},
    {path: '/settings', name: 'settings', component: SettingsView},
    {
      path: '/lesson/:topicSlug/:lessonNum',
      name: 'lesson',
      component: LessonView,
    },
    {path: '/speak', name: 'speak', component: SpeakView},
  ],
});
