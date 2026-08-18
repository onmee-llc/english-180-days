import {ref} from 'vue';
import {SecureStoragePlugin} from 'capacitor-secure-storage-plugin';

const API_KEY_STORAGE_KEY = 'dm_gemini_api_key';

const apiKey = ref('');
const isLoaded = ref(false);

export function useApiKey() {
  async function init() {
    if (isLoaded.value) return;
    try {
      const {value} = await SecureStoragePlugin.get({key: API_KEY_STORAGE_KEY});
      apiKey.value = value;
    } catch (_) {
      // Plugin throws when the key doesn't exist yet — first run.
      apiKey.value = '';
    }
    isLoaded.value = true;
  }

  async function setApiKey(newKey) {
    if (newKey) {
      await SecureStoragePlugin.set({key: API_KEY_STORAGE_KEY, value: newKey});
    } else {
      await SecureStoragePlugin.remove({key: API_KEY_STORAGE_KEY}).catch(
        () => {},
      );
    }
    apiKey.value = newKey;
  }

  return {apiKey, isLoaded, init, setApiKey};
}
