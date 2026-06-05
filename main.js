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

// ── Ordinační doba – data ──────────────────────────────────
// Klíč: 'YYYY-M-D' (bez nulového prefixu)
// Každý den může mít více slotů: { time, doctor, type }
// doctor: null = neuveden (UZV, kontroly apod.)
const SCHEDULE = {
  '2026-6-1': [
    { time: '08:00–11:00', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '12:00–18:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-6-2': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-6-3': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-6-4': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-6-8': [
    { time: '08:00–18:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-6-9': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-6-10': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-6-11': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-6-15': [
    { time: '12:00–18:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-6-16': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-6-17': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-6-18': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-6-23': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-6-24': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-6-29': [
    { time: '08:00–18:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-6-30': [
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
};

function scheduleKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getSlotsForDay(d) {
  return SCHEDULE[scheduleKey(d)] || null;
}

function closedTextForDay(d) {
  if (d.getMonth() === 6) return 'Bude doplněno';
  return d.getDay() === 5 ? 'Ordinační doba po domluvě' : 'Neordinujeme';
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

function getDefaultWeekStart(d) {
  const date = getMonday(d);
  const dow = d.getDay();
  if (dow === 6) date.setDate(date.getDate() + 7);
  if (dow === 0) date.setDate(date.getDate() + 7);
  return date;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth()    === b.getMonth()
      && a.getDate()     === b.getDate();
}

function fmt(d) { return `${d.getDate()}.\u00a0${d.getMonth() + 1}.`; }

let weekStart = getDefaultWeekStart(today);
let calendarViewDate = new Date(weekStart);

function renderHeroWeek() {
  const el = document.getElementById('hero-week-days');
  if (!el) return;
  el.innerHTML = '';
  const start = getDefaultWeekStart(today);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  const rangeEl = document.getElementById('hero-week-range');
  if (rangeEl) rangeEl.textContent = `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dow     = d.getDay();
    const slots   = getSlotsForDay(d);
    const isToday = isSameDay(d, today);
    const hoursTxt = slots ? slots[0].time : closedTextForDay(d);
    const row = document.createElement('div');
    row.className = 'hero-week-day';
    row.setAttribute('role', 'listitem');
    if (isToday) row.classList.add('is-today');
    if (!slots)  row.classList.add('is-closed');
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
    const slots   = getSlotsForDay(d);
    const isToday = isSameDay(d, today);

    if (daysEl) {
      const row = document.createElement('div');
      row.className = 'schedule-day';
      row.setAttribute('role', 'listitem');
      if (isToday) row.classList.add('is-today');
      if (!slots)  row.classList.add('is-closed');
      if (!slots && dow === 5) row.classList.add('is-friday-closed');
      if (!slots && closedTextForDay(d) === 'Bude doplněno') row.classList.add('is-pending-schedule');

      // Každý slot přispívá 4 přímými dětmi do CSS gridu:
      // [sch-day-date] [schedule-hours] [schedule-doctor] [schedule-type]
      let html = '';
      if (slots) {
        // null znamená "stejný lékař jako předchozí slot" – vyřeší se dopředu
        const resolved = [];
        for (let i = 0; i < slots.length; i++) {
          resolved.push({
            ...slots[i],
            doctor: slots[i].doctor !== null ? slots[i].doctor
                  : (i > 0 ? resolved[i - 1].doctor : null),
          });
        }

        resolved.forEach((s, idx) => {
          const repeatCls = idx > 0 ? ' is-repeat' : '';
          const badge     = (idx === 0 && isToday) ? '<span class="today-badge">Dnes</span>' : '';

          // Jméno lékaře zobrazíme jen u první položky daného bloku.
          // Skrytá buňka u dalších položek drží správné zarovnání grid sloupců.
          const sameAsPrev = idx > 0 && s.doctor === resolved[idx - 1].doctor;
          const doctorHtml = sameAsPrev
            ? '<span class="schedule-doctor is-repeat" aria-hidden="true"></span>'
            : `<span class="schedule-doctor">${s.doctor || '—'}</span>`;

          html += `
            <span class="sch-day-date${repeatCls}">
              <span class="sch-dname">${DAY_NAMES[dow]}</span>
              <span class="sch-ddate">${fmt(d)}</span>
              ${badge}
            </span>
            ${doctorHtml}
            <span class="schedule-hours">${s.time}</span>
            <span class="schedule-type">${s.type}</span>
          `;
        });
      } else {
        html = `
          <span class="sch-day-date">
            <span class="sch-dname">${DAY_NAMES[dow]}</span>
            <span class="sch-ddate">${fmt(d)}</span>
          </span>
          <span class="schedule-doctor"></span>
          <span class="schedule-hours">${closedTextForDay(d)}</span>
          <span class="schedule-type"></span>
        `;
      }

      row.innerHTML = html;
      daysEl.appendChild(row);
    }
  }
  renderMiniCal('mini-calendar');
}

function renderMiniCal(targetId) {
  const calEl = document.getElementById(targetId);
  if (!calEl) return;

  const year  = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();

  const firstDay    = new Date(year, month, 1);
  const lastDay     = new Date(year, month + 1, 0);
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  let startPad = firstDay.getDay() - 1;
  if (startPad < 0) startPad = 6;

  let html = `
    <div class="mini-cal-header">
      <button class="mini-cal-nav" type="button" data-cal-shift="-1" aria-label="Předchozí měsíc">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="mini-cal-month">${MONTH_NAMES[month]} ${year}</span>
      <button class="mini-cal-nav" type="button" data-cal-shift="1" aria-label="Další měsíc">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
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
    const cell     = new Date(year, month, d);
    const isT      = isSameDay(cell, today);
    const inW      = cell >= weekStart && cell <= weekEndDate;
    const hasSlots = !!getSlotsForDay(cell);
    let cls = 'mini-cal-day';
    if (isT)            cls += ' is-today-cal';
    else if (inW)       cls += ' in-week';
    else if (hasSlots)  cls += ' has-schedule';
    if (!hasSlots)      cls += ' is-no-schedule';
    html += `<span class="${cls}" role="button" tabindex="0"
      data-ts="${cell.getTime()}" aria-label="${d}. ${month+1}. ${year}"
      aria-pressed="${inW}">${d}</span>`;
  }
  html += '</div>';
  calEl.innerHTML = html;

  calEl.querySelectorAll('.mini-cal-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      calendarViewDate = new Date(year, month + Number(btn.dataset.calShift), 1);
      renderMiniCal(targetId);
    });
  });

  calEl.querySelectorAll('.mini-cal-day:not(.is-empty)').forEach(el => {
    el.addEventListener('click', () => {
      weekStart = getMonday(new Date(+el.dataset.ts));
      calendarViewDate = new Date(+el.dataset.ts);
      renderSchedule();
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
}

document.getElementById('prev-week').addEventListener('click', () => {
  weekStart.setDate(weekStart.getDate() - 7);
  calendarViewDate = new Date(weekStart);
  renderSchedule();
});
document.getElementById('next-week').addEventListener('click', () => {
  weekStart.setDate(weekStart.getDate() + 7);
  calendarViewDate = new Date(weekStart);
  renderSchedule();
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

// ── Formspree form ─────────────────────────────────────────
const form = document.getElementById('sorelia-form');
const successMessage = document.getElementById('form-success');
const errorMessage = document.getElementById('form-error');

if (form && successMessage && errorMessage) {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Odesílám...';
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        form.style.display = 'none';
        successMessage.style.display = 'flex';
        errorMessage.style.display = 'none';
      } else {
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.style.display = 'block';
    } finally {
      if (submitButton && form.style.display !== 'none') {
        submitButton.disabled = false;
        submitButton.textContent = 'Požádat o termín';
      }
    }
  });
}
