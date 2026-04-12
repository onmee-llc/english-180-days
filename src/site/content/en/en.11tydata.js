const lang = require('./lang');

// =============================================================================
// HOME OVERVIEW
//
// Context object for the homepage.
// =============================================================================

module.exports = function () {
  return {
    lang: lang.lang,
    locale: lang.locale,
  };
};
