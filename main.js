/* ============================================================
   Sorelia – main.js
   ============================================================ */
'use strict';

// ── Sticky header ──────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile hamburger ───────────────────────────────────────
const burger   = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});

navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// ── Ordinační doba ─────────────────────────────────────────
const HOURS = {
  1: { o: '8:00',  c: '14:00' }, // Po
  2: { o: '8:00',  c: '16:00' }, // Út
  3: null,                         // St – zavřeno
  4: { o: '8:00',  c: '16:00' }, // Čt
  5: { o: '8:00',  c: '13:00' }, // Pá
  6: null,                         // So
  0: null,                         // Ne
};

const DOCTORS = {
  1: 'MUDr. Jana Nováková',
  2: 'MUDr. Petr Kratochvíl',
  3: 'Neordinuje',
  4: 'MUDr. Alena Horáková',
  5: 'MUDr. Martin Šimánek',
};

// ── Výjimečně zavřeno (YYYY-M-D) ───────────────────────────
const CLOSED_DATES = [
  '2026-3-25', // St 25. 3.
  '2026-3-26', // Čt 26. 3.
];

function isExceptionallyClosed(d) {
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  return CLOSED_DATES.includes(key);
}

const DAY_NAMES = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

const MONTH_NAMES = [
  'leden','únor','březen','duben','květen','červen',
  'červenec','srpen','září','říjen','listopad','prosinec',
];

const today = new Date();
today.setHours(0, 0, 0, 0);

function getMonday(d) {
  const date = new Date(d);
  const dow  = date.getDay();
  date.setDate(date.getDate() + (dow === 0 ? -6 : 1 - dow));
  date.setHours(0, 0, 0, 0);
  return date;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth()    === b.getMonth()
      && a.getDate()     === b.getDate();
}

function fmt(d) { return `${d.getDate()}.\u00a0${d.getMonth() + 1}.`; }

let weekStart = getMonday(today);

function renderHeroWeek() {
  const el = document.getElementById('hero-week-days');
  if (!el) return;
  el.innerHTML = '';
  const start = getMonday(today);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  const rangeEl = document.getElementById('hero-week-range');
  if (rangeEl) rangeEl.textContent = `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dow      = d.getDay();
    const hours    = isExceptionallyClosed(d) ? null : HOURS[dow];
    const isToday  = isSameDay(d, today);
    const hoursTxt = hours ? `${hours.o}–${hours.c}` : 'Zavřeno';
    const row = document.createElement('div');
    row.className = 'hero-week-day';
    row.setAttribute('role', 'listitem');
    if (isToday) row.classList.add('is-today');
    if (!hours)  row.classList.add('is-closed');
    row.innerHTML = `<strong>${DAY_NAMES[dow]}</strong><span class="hero-week-hours">${hoursTxt}</span>`;
    el.appendChild(row);
  }
}

function renderSchedule() {
  const daysEl  = document.getElementById('schedule-days');
  const labelEl = document.getElementById('week-label');

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 4);

  if (labelEl) labelEl.textContent = `${fmt(weekStart)} – ${fmt(weekEnd)} ${weekEnd.getFullYear()}`;
  if (daysEl) daysEl.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dow     = d.getDay();
    const hours   = isExceptionallyClosed(d) ? null : HOURS[dow];
    const doctor  = hours ? (DOCTORS[dow] || 'Dle rozpisu') : 'Neordinuje';
    const isToday = isSameDay(d, today);
    const hoursTxt = hours ? `${hours.o}–${hours.c}` : 'Zavřeno';

    if (daysEl) {
      const row = document.createElement('div');
      row.className = 'schedule-day';
      row.setAttribute('role', 'listitem');
      if (isToday) row.classList.add('is-today');
      if (!hours) row.classList.add('is-closed');
      row.innerHTML = `
        <span class="schedule-day-name">${DAY_NAMES[dow]}</span>
        <span class="schedule-date">${fmt(d)}</span>
        <span class="schedule-hours">${hoursTxt}</span>
        <span class="schedule-doctor">${doctor}</span>
        ${isToday ? '<span class="today-badge">Dnes</span>' : ''}
      `;
      daysEl.appendChild(row);
    }
  }
  renderMiniCal('mini-calendar');
}

function renderMiniCal(targetId) {
  const calEl = document.getElementById(targetId);
  if (!calEl) return;

  const year  = weekStart.getFullYear();
  const month = weekStart.getMonth();

  const firstDay   = new Date(year, month, 1);
  const lastDay    = new Date(year, month + 1, 0);
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  let startPad = firstDay.getDay() - 1;
  if (startPad < 0) startPad = 6;

  let html = `
    <div class="mini-cal-header">
      <span class="mini-cal-month">${MONTH_NAMES[month]} ${year}</span>
    </div>
    <div class="mini-cal-grid" role="grid" aria-label="Kalendář ${MONTH_NAMES[month]} ${year}">
      <span class="mini-cal-wd">Po</span><span class="mini-cal-wd">Út</span>
      <span class="mini-cal-wd">St</span><span class="mini-cal-wd">Čt</span>
      <span class="mini-cal-wd">Pá</span><span class="mini-cal-wd">So</span>
      <span class="mini-cal-wd">Ne</span>
  `;

  for (let e = 0; e < startPad; e++)
    html += '<span class="mini-cal-day is-empty" aria-hidden="true"></span>';

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const cell = new Date(year, month, d);
    const isT  = isSameDay(cell, today);
    const inW  = cell >= weekStart && cell <= weekEndDate;
    const isEx = isExceptionallyClosed(cell);
    let cls    = 'mini-cal-day';
    if (isT)       cls += ' is-today-cal';
    else if (inW)  cls += ' in-week';
    if (isEx)      cls += ' is-exception';
    html += `<span class="${cls}" role="button" tabindex="0"
      data-ts="${cell.getTime()}" aria-label="${d}. ${month+1}. ${year}"
      aria-pressed="${inW}">${d}</span>`;
  }
  html += '</div>';
  calEl.innerHTML = html;

  calEl.querySelectorAll('.mini-cal-day:not(.is-empty)').forEach(el => {
    el.addEventListener('click', () => {
      weekStart = getMonday(new Date(+el.dataset.ts));
      renderSchedule();
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
}

document.getElementById('prev-week').addEventListener('click', () => {
  weekStart.setDate(weekStart.getDate() - 7); renderSchedule();
});
document.getElementById('next-week').addEventListener('click', () => {
  weekStart.setDate(weekStart.getDate() + 7); renderSchedule();
});
renderHeroWeek();
renderSchedule();

// ── FAQ accordion ──────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.faq-btn');
  if (!btn) return;

  const expanded = btn.getAttribute('aria-expanded') === 'true';
  const answerId = btn.getAttribute('aria-controls');
  const answer = answerId ? document.getElementById(answerId) : null;
  if (!answer) return;

  btn.setAttribute('aria-expanded', String(!expanded));
  answer.hidden = expanded;
});

// ── Form ────────────────────────────────────────────────────
const form     = document.getElementById('objednani-form');
const formOk   = document.getElementById('form-success');
const telInput = document.getElementById('telefon');
const telErr   = document.getElementById('tel-error');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (document.getElementById('hp-field').value) return;

  const tel = telInput.value.trim();
  if (!tel) {
    telInput.classList.add('is-invalid');
    telInput.setAttribute('aria-invalid', 'true');
    telErr.hidden = false;
    telInput.focus();
    return;
  }

  telInput.classList.remove('is-invalid');
  telInput.removeAttribute('aria-invalid');
  telErr.hidden = true;
  form.hidden   = true;
  formOk.hidden = false;
});

telInput.addEventListener('input', () => {
  if (telInput.value.trim()) {
    telInput.classList.remove('is-invalid');
    telInput.removeAttribute('aria-invalid');
    telErr.hidden = true;
  }
});
