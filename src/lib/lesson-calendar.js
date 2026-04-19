/**
 * @fileoverview Lesson calendar — client-side month navigation and today highlight.
 * Loaded only on the homepage via pageScripts front matter.
 */

const container = document.querySelector('.lesson-calendar__widget');
if (container) {
  const months = Array.from(
    container.querySelectorAll('.lesson-calendar__month'),
  );
  const prevBtn = container.querySelector('.lesson-calendar__prev');
  const nextBtn = container.querySelector('.lesson-calendar__next');
  const label = document.querySelector('.lesson-calendar__month-label');

  if (months.length && prevBtn && nextBtn && label) {
    const todayISO = new Date().toISOString().slice(0, 10);
    const todayMonth = todayISO.slice(0, 7); // YYYY-MM

    let currentIndex = months.findIndex((m) => m.dataset.month === todayMonth);
    if (currentIndex === -1) currentIndex = 0;

    const show = (index) => {
      months.forEach((m, i) => {
        m.hidden = i !== index;
      });
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === months.length - 1;
      label.textContent = months[index].dataset.label || '';
    };

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) show(--currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < months.length - 1) show(++currentIndex);
    });

    // Mark today and past cells
    const allCells = container.querySelectorAll('[data-date]');
    allCells.forEach((cell) => {
      const cellDate = cell.dataset.date;
      if (!cellDate) return;
      if (cellDate === todayISO) {
        cell.classList.add('is-today');
      } else if (cellDate < todayISO) {
        cell.classList.add('is-past');
      }
    });

    // Initialise the calendar
    show(currentIndex);

    // Scroll today into view after paint
    requestAnimationFrame(() => {
      const todayCell = container.querySelector('.is-today');
      if (todayCell) {
        todayCell.scrollIntoView({behavior: 'smooth', block: 'nearest'});
      }
    });
  }
}
