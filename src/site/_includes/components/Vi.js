/*
 * Daily Mastery — bilingual paired shortcode.
 *
 * Renders a Vietnamese translation block directly beneath the preceding
 * English content. Usage in markdown:
 *
 *   English text here.
 *
 *   {% vi %}
 *   Bản dịch tiếng Việt ngay dưới.
 *   {% endvi %}
 *
 * The block is styled via `.lesson-vi` (see src/scss). `html: true` lets the
 * translation contain inline HTML/markdown like the surrounding content.
 */

const {html} = require('common-tags');
const md = require('markdown-it')({html: true});

/**
 * @param {string} content Vietnamese markdown content.
 * @return {string} Rendered bilingual block.
 */
function Vi(content) {
  const rendered = md.render((content || '').trim());
  const block =
    `<div class="lesson-vi" lang="vi">` +
    `<span class="lesson-vi__label" aria-hidden="true">🇻🇳 Tiếng Việt</span>` +
    `<div class="lesson-vi__body flow">${rendered}</div>` +
    `</div>`;

  return html`${block}`;
}

module.exports = Vi;
