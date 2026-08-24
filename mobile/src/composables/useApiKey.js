import {ref} from 'vue';
import {SecureStoragePlugin} from 'capacitor-secure-storage-plugin';
import {Preferences} from '@capacitor/preferences';

const API_KEY_STORAGE_KEY = 'dm_gemini_api_key';
const FALLBACK_KEY_NAME = 'gemini_api_key';

const apiKey = ref('');
const isLoaded = ref(false);

export function useApiKey() {
  async function init() {
    if (isLoaded.value && apiKey.value) return;

    let retrievedKey = '';

    // 1. Try SecureStoragePlugin
    try {
      const res = await SecureStoragePlugin.get({key: API_KEY_STORAGE_KEY});
      if (res && res.value) {
        retrievedKey = res.value.trim();
      }
    } catch (_) {}

    // 2. Try Capacitor Preferences fallback
    if (!retrievedKey) {
      try {
        const {value} = await Preferences.get({key: API_KEY_STORAGE_KEY});
        if (value) retrievedKey = value.trim();
      } catch (_) {}
    }

    // 3. Try localStorage fallback
    if (!retrievedKey && typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      try {
        retrievedKey = (
          localStorage.getItem(API_KEY_STORAGE_KEY) ||
          localStorage.getItem(FALLBACK_KEY_NAME) ||
          ''
        ).trim();
      } catch (_) {}
    }

    // 4. Try Vite environment variable fallback
    if (!retrievedKey && typeof import.meta !== 'undefined' && import.meta.env) {
      retrievedKey = (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_AI_API_KEY || '').trim();
    }

    apiKey.value = retrievedKey;
    isLoaded.value = true;
  }

  async function setApiKey(newKey) {
    const cleanKey = (newKey || '').trim();
    apiKey.value = cleanKey;

    if (cleanKey) {
      try {
        await SecureStoragePlugin.set({key: API_KEY_STORAGE_KEY, value: cleanKey});
      } catch (_) {}
      try {
        await Preferences.set({key: API_KEY_STORAGE_KEY, value: cleanKey});
      } catch (_) {}
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        try {
          localStorage.setItem(API_KEY_STORAGE_KEY, cleanKey);
        } catch (_) {}
      }
    } else {
      try {
        await SecureStoragePlugin.remove({key: API_KEY_STORAGE_KEY}).catch(() => {});
      } catch (_) {}
      try {
        await Preferences.remove({key: API_KEY_STORAGE_KEY}).catch(() => {});
      } catch (_) {}
      if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
        try {
          localStorage.removeItem(API_KEY_STORAGE_KEY);
          localStorage.removeItem(FALLBACK_KEY_NAME);
        } catch (_) {}
      }
    }
  }

  return {apiKey, isLoaded, init, setApiKey};
}
