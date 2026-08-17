// mobile/src/composables/useTranslateHistory.js
import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';

const HISTORY_KEY = 'dm_translate_history';

const history = ref([]);
let isLoaded = false;

async function persist() {
  await Preferences.set({
    key: HISTORY_KEY,
    value: JSON.stringify(history.value),
  });
}

export function useTranslateHistory() {
  async function init() {
    if (isLoaded) return;
    const {value} = await Preferences.get({key: HISTORY_KEY});
    try {
      history.value = value ? JSON.parse(value) : [];
    } catch (_) {
      history.value = [];
    }
    isLoaded = true;
  }

  /**
   * @param {{vietnameseText: string, englishSentence: string, ipa: string, explanation: string}} entry
   */
  async function addEntry(entry) {
    history.value = [
      {...entry, timestamp: new Date().toISOString()},
      ...history.value,
    ];
    await persist();
  }

  return {history, init, addEntry};
}
