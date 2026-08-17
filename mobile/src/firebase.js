import {initializeApp, getApps} from 'firebase/app';

// Same aevo-labs project the web app uses (src/site/_data/site.js).
// Firebase web API keys are not secret — access is enforced by
// firestore.rules, not by hiding this value.
const firebaseConfig = {
  apiKey: 'AIzaSyDG2xe1oIY6KywRLLiSx_9iPAVHDjnKs3Q',
  authDomain: 'aevo-labs.firebaseapp.com',
  projectId: 'aevo-labs',
  storageBucket: 'aevo-labs.firebasestorage.app',
  messagingSenderId: '372316750039',
  appId: '1:372316750039:web:dd0018f4275ac35201f092',
};

export function ensureFirebaseApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}
