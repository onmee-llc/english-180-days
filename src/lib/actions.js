import {store} from './store';
import lang from './utils/language';
import {localStorage} from './utils/storage';
import cookies from 'js-cookie';
import {ids} from 'webdev_analytics';
import {isProd} from 'webdev_config';

export const clearSignedInState = store.action(() => {
  const {isSignedIn} = store.getState();
  if (isSignedIn) {
    return {
      checkingSignedInState: false,
      isSignedIn: false,
      user: null,
    };
  }
});

const disablePage = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      if (main) main.inert = true;
      if (footer) footer.inert = true;
    });
  });
};

const enablePage = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      if (main) main.inert = false;
      if (footer) footer.inert = false;
    });
  });
};

export const openNavigationDrawer = store.action(() => {
  disablePage();
  return {isNavigationDrawerOpen: true};
});

export const closeNavigationDrawer = store.action(() => {
  enablePage();
  return {isNavigationDrawerOpen: false};
});

export const openModal = store.action(() => {
  disablePage();
  return {isModalOpen: true};
});

export const closeModal = store.action(() => {
  enablePage();
  return {isModalOpen: false};
});

export const checkIfUserAcceptsCookies = store.action(({cookiePreference}) => {
  if (cookiePreference) {
    return;
  }

  const storedWebAcceptsCookiesValue = localStorage['web-accepts-cookies'];

  if (typeof storedWebAcceptsCookiesValue === 'string') {
    cookiePreference =
      storedWebAcceptsCookiesValue === '1' ? 'accepts' : 'rejects';
  } else {
    cookiePreference = null;
  }

  const showingSnackbar = cookiePreference === null;

  return {cookiePreference, showingSnackbar, snackbarType: 'cookies'};
});

export const setUserAcceptsCookies = store.action(() => {
  localStorage['web-accepts-cookies'] = '1';
  return {
    cookiePreference: 'accepts',
    showingSnackbar: false,
  };
});

export const setUserRejectsCookies = store.action(() => {
  localStorage['web-accepts-cookies'] = '0';
  return {
    cookiePreference: 'rejects',
    showingSnackbar: false,
  };
});

export const setLanguage = store.action((state, language) => {
  if (!lang.isValidLanguage(language)) {
    return state;
  }
  const options = {
    expires: 10 * 365,
    samesite: 'strict',
  };
  cookies.set('firebase-language-override', language, options);
  if (language !== state.currentLanguage) {
    location.reload();
  }
  return {
    currentLanguage: language,
  };
});

export const loadAnalyticsScript = store.action(() => {
  const {gtmScriptLoaded} = store.getState();
  if (!gtmScriptLoaded && isProd) {
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${ids.GTM}`, null);
    return {
      gtmScriptLoaded: true,
    };
  }
});
