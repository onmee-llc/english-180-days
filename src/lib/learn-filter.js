/**
 * @fileoverview Learn page — filter courses by type (tech / english).
 * Loaded as a page script via pageScripts front matter.
 */

const collection = document.getElementById('learn-collection');
const btns = document.querySelectorAll('.learn__filter-btn');

if (collection && btns.length) {
  const cards = collection.querySelectorAll('[data-course-type]');

  const applyFilter = (filter) => {
    btns.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.filter === filter);
      b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
    });
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.courseType === filter;
      card.style.display = match ? '' : 'none';
    });
    try {
      sessionStorage.setItem('learnFilter', filter);
    } catch (_) {
      // sessionStorage unavailable (e.g. private browsing restrictions)
    }
  };

  btns.forEach((btn) => {
    btn.addEventListener('click', () =>
      applyFilter(btn.dataset.filter || 'all'),
    );
  });

  // Restore last selected filter on navigation
  const saved = sessionStorage.getItem('learnFilter') || 'all';
  applyFilter(saved);
}
