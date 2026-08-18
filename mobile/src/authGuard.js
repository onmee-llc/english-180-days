import {useProgress} from './composables/useProgress.js';

// Exported as a standalone function (not just registered inline in
// router.js) so it can be unit-tested directly — createWebHistory() needs a
// browser `window`, which the test environment doesn't have, so importing
// router.js in a test isn't an option.
export async function authGuard(to) {
  const {authResolved, isSignedIn, init, whenAuthResolved} = useProgress();
  await init();
  if (!authResolved.value) await whenAuthResolved();
  if (to.name !== 'login' && !isSignedIn.value) return {name: 'login'};
  if (to.name === 'login' && isSignedIn.value) return {name: 'today'};
}
