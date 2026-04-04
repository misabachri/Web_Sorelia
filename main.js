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
  '2022-8-1': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2022-8-2': [
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                     type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                     type: 'Kontroly' },
  ],
  '2022-8-3': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '14:30–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2022-8-4': [
    { time: '08:00–14:00', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
  ],
  '2022-8-9': [
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                     type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                     type: 'Kontroly' },
  ],
  '2022-8-15': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2022-8-22': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2022-8-23': [
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                     type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                     type: 'Kontroly' },
  ],
  '2022-8-24': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '14:30–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2022-8-25': [
    { time: '08:00–14:00', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
  ],
  '2022-8-29': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2022-8-31': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '14:30–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
};

function scheduleKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getSlotsForDay(d) {
  return SCHEDULE[scheduleKey(d)] || null;
}

const DAY_NAMES = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

const MONTH_NAMES = [
  'leden','únor','březen','duben','květen','červen',
  'červenec','srpen','září','říjen','listopad','prosinec',
];

// TESTOVACÍ DATUM: 1. 8. 2022
const today = new Date(2022, 7, 1);
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
    const dow     = d.getDay();
    const slots   = getSlotsForDay(d);
    const isToday = isSameDay(d, today);
    const hoursTxt = slots ? slots[0].time : 'Neordinuje';
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

          // Jméno lékaře zobrazíme jen jednou – při první změně lékaře v daném dni.
          // Pokud stejný lékař pokrývá více po sobě jdoucích slotů, buňka se roztáhne
          // přes všechny tyto řádky a jméno se vycentruje na střed.
          const sameAsPrev = idx > 0 && s.doctor === resolved[idx - 1].doctor;
          let doctorHtml = '';
          if (!sameAsPrev) {
            let span = 1;
            for (let j = idx + 1; j < resolved.length; j++) {
              if (resolved[j].doctor === s.doctor) span++;
              else break;
            }
            const spanStyle = span > 1
              ? ` style="grid-row: span ${span}; align-self: center;"`
              : '';
            doctorHtml = `<span class="schedule-doctor"${spanStyle}>${s.doctor || '—'}</span>`;
          }

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
          <span class="schedule-hours">Neordinuje</span>
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

  const year  = weekStart.getFullYear();
  const month = weekStart.getMonth();

  const firstDay    = new Date(year, month, 1);
  const lastDay     = new Date(year, month + 1, 0);
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
