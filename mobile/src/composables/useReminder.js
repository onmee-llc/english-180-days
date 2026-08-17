import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from '@capacitor/core';
import {LocalNotifications} from '@capacitor/local-notifications';

const REMINDER_KEY = 'dm_reminder_time'; // "HH:mm"
const NOTIFICATION_ID = 1;

const time = ref('20:00');

async function scheduleNative(hhmm) {
  if (!Capacitor.isNativePlatform()) return;

  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') {
    const req = await LocalNotifications.requestPermissions();
    if (req.display !== 'granted') return;
  }

  await LocalNotifications.cancel({notifications: [{id: NOTIFICATION_ID}]});

  const [hour, minute] = hhmm.split(':').map(Number);
  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title: 'Daily Mastery',
        body: "Today's lesson is ready — keep the streak going.",
        schedule: {on: {hour, minute}, every: 'day'},
      },
    ],
  });
}

export function useReminder() {
  async function init() {
    const {value} = await Preferences.get({key: REMINDER_KEY});
    if (value) time.value = value;
  }

  async function setTime(hhmm) {
    time.value = hhmm;
    await Preferences.set({key: REMINDER_KEY, value: hhmm});
    await scheduleNative(hhmm);
  }

  return {time, init, setTime};
}
