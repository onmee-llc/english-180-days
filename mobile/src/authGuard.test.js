import {describe, it, expect, vi, beforeEach} from 'vitest';

const authResolved = {value: false};
const isSignedIn = {value: false};
const init = vi.fn(async () => {});
let resolveWhenAuthResolved;
const whenAuthResolved = vi.fn(
  () =>
    new Promise((resolve) => {
      resolveWhenAuthResolved = resolve;
    }),
);

vi.mock('./composables/useProgress.js', () => ({
  useProgress: () => ({authResolved, isSignedIn, init, whenAuthResolved}),
}));

beforeEach(() => {
  vi.resetModules();
  authResolved.value = false;
  isSignedIn.value = false;
  init.mockClear();
  whenAuthResolved.mockClear();
});

describe('authGuard', () => {
  it('waits for auth to resolve before deciding', async () => {
    const {authGuard} = await import('./authGuard.js');
    const resultPromise = authGuard({name: 'today'});

    // Flush pending microtasks so the guard's `await init()` chain runs to
    // completion and reaches `await whenAuthResolved()`. A single
    // `await Promise.resolve()` isn't reliable here — how many microtask
    // ticks separate the two awaits depends on the test transform, not just
    // native async/await semantics — so wait for a macrotask boundary
    // instead, which flushes the whole microtask queue.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(whenAuthResolved).toHaveBeenCalled();
    authResolved.value = true;
    isSignedIn.value = false;
    resolveWhenAuthResolved();

    const result = await resultPromise;
    expect(result).toEqual({name: 'login'});
  });

  it('redirects to login when resolved and signed out', async () => {
    authResolved.value = true;
    const {authGuard} = await import('./authGuard.js');

    const result = await authGuard({name: 'today'});

    expect(result).toEqual({name: 'login'});
  });

  it('lets a signed-in user through to a non-login route', async () => {
    authResolved.value = true;
    isSignedIn.value = true;
    const {authGuard} = await import('./authGuard.js');

    const result = await authGuard({name: 'settings'});

    expect(result).toBeUndefined();
  });

  it('redirects a signed-in user away from /login', async () => {
    authResolved.value = true;
    isSignedIn.value = true;
    const {authGuard} = await import('./authGuard.js');

    const result = await authGuard({name: 'login'});

    expect(result).toEqual({name: 'today'});
  });
});
