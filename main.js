/* ============================================================
   Sorelia – main.js
   ============================================================ */
'use strict';

// ── Sticky header ──────────────────────────────────────────
const header = document.getElementById('site-header');
const shouldShrinkHeader = header && !document.body.classList.contains('page-404');

if (shouldShrinkHeader) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

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

// ── Cookies + externí obsah ───────────────────────────────
const CONSENT_KEY = 'soreliaCookieConsent';

function readConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveConsent(consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessary: true,
      maps: Boolean(consent.maps),
      savedAt: new Date().toISOString(),
    }));
  } catch (error) {
    // If storage is unavailable, keep the current page behavior only.
  }
}

function loadGoogleMaps() {
  document.querySelectorAll('[data-map-src]').forEach(mapWrap => {
    if (mapWrap.querySelector('iframe')) return;

    const iframe = document.createElement('iframe');
    iframe.title = 'Mapa – Sorelia, Královehradecká 418, Klášterec nad Ohří';
    iframe.src = mapWrap.dataset.mapSrc;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';

    mapWrap.innerHTML = '';
    mapWrap.appendChild(iframe);
  });
}

function unloadGoogleMaps() {
  document.querySelectorAll('[data-map-src]').forEach(mapWrap => {
    if (!mapWrap.querySelector('iframe')) return;

    mapWrap.innerHTML = `
      <div class="map-consent-placeholder">
        <p>Mapa se načte po povolení externího obsahu.</p>
        <div class="map-consent-actions">
          <button type="button" class="btn btn-primary" data-map-allow>Povolit mapu</button>
          <a href="https://www.google.com/maps/search/?api=1&query=Kr%C3%A1lovehradeck%C3%A1%20418%2C%20431%2051%20Kl%C3%A1%C5%A1terec%20nad%20Oh%C5%99%C3%AD" target="_blank" rel="noopener" class="btn btn-outline">Otevřít mapu</a>
        </div>
      </div>
    `;
  });
}

function applyConsent(consent) {
  if (consent && consent.maps) loadGoogleMaps();
  else unloadGoogleMaps();
}

document.addEventListener('click', e => {
  const allowMapBtn = e.target.closest('[data-map-allow]');
  if (!allowMapBtn) return;

  const consent = { maps: true };
  saveConsent(consent);
  applyConsent(consent);

  const banner = document.getElementById('cookie-banner');
  if (banner) banner.hidden = true;
});

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const settingsBtn = document.getElementById('cookie-settings');
  if (!banner) {
    applyConsent(readConsent());
    return;
  }

  const preferences = document.getElementById('cookie-preferences');
  const mapsCheckbox = document.getElementById('cookie-maps');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const customizeBtn = document.getElementById('cookie-customize');
  const saveBtn = document.getElementById('cookie-save');
  const storedConsent = readConsent();

  function setPreferencesOpen(open) {
    if (preferences) preferences.hidden = !open;
    if (saveBtn) saveBtn.hidden = !open;
    customizeBtn?.setAttribute('aria-expanded', String(open));
  }

  function syncCheckbox() {
    if (mapsCheckbox) mapsCheckbox.checked = Boolean(readConsent()?.maps);
  }

  function closeBanner() {
    banner.hidden = true;
    setPreferencesOpen(false);
  }

  function openBannerWithPreferences() {
    syncCheckbox();
    banner.hidden = false;
    setPreferencesOpen(true);
  }

  acceptBtn?.addEventListener('click', () => {
    const consent = { maps: true };
    saveConsent(consent);
    applyConsent(consent);
    closeBanner();
  });

  rejectBtn?.addEventListener('click', () => {
    const consent = { maps: false };
    saveConsent(consent);
    applyConsent(consent);
    closeBanner();
  });

  customizeBtn?.addEventListener('click', () => {
    const isOpen = preferences && !preferences.hidden;
    syncCheckbox();
    setPreferencesOpen(!isOpen);
  });

  saveBtn?.addEventListener('click', () => {
    const consent = { maps: Boolean(mapsCheckbox?.checked) };
    saveConsent(consent);
    applyConsent(consent);
    closeBanner();
  });

  settingsBtn?.addEventListener('click', openBannerWithPreferences);

  if (storedConsent) {
    applyConsent(storedConsent);
    return;
  }

  banner.hidden = false;
  setPreferencesOpen(false);
}

initCookieBanner();

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
  '2026-7-7': [
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-7-9': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-7-13': [
    { time: '08:00–17:00', doctor: 'MUDr. Tomáš Bachratý', type: 'Běžná ambulance' },
  ],
  '2026-7-14': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-7-15': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima', type: 'Běžná ambulance' },
  ],
  '2026-7-16': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-7-21': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-7-22': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',     type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar', type: 'Běžná ambulance' },
  ],
  '2026-7-23': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-7-27': [
    { time: '08:00–17:00', doctor: 'MUDr. Tomáš Bachratý', type: 'Běžná ambulance' },
  ],
  '2026-7-28': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-7-29': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',     type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar', type: 'Běžná ambulance' },
  ],
  '2026-8-3': [
    { time: '12:00–17:00', doctor: 'MUDr. Tomáš Bachratý', type: 'Běžná ambulance' },
  ],
  '2026-8-4': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-8-5': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',     type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar', type: 'Běžná ambulance' },
  ],
  '2026-8-6': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-8-10': [
    { time: '08:00–17:00', doctor: 'MUDr. Tomáš Bachratý', type: 'Běžná ambulance' },
  ],
  '2026-8-11': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-8-18': [
    { time: '15:00–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
    { time: '16:00–17:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
  ],
  '2026-8-19': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima', type: 'Běžná ambulance' },
  ],
  '2026-8-20': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-8-24': [
    { time: '12:00–17:00', doctor: 'MUDr. Tomáš Bachratý', type: 'Běžná ambulance' },
  ],
  '2026-8-25': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:00–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
    { time: '16:00–17:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
  ],
  '2026-8-26': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',     type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar', type: 'Běžná ambulance' },
  ],
  '2026-8-27': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček', type: 'Běžná ambulance' },
  ],
  '2026-8-31': [
    { time: '08:00–17:00', doctor: 'MUDr. Tomáš Bachratý', type: 'Běžná ambulance' },
  ],
  '2026-9-1': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Vyšetření dětí s RTG' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-9-2': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-9-3': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-9-7': [
    { time: '12:00–17:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-9-8': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-9-9': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-9-10': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-9-14': [
    { time: '08:00–17:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-9-15': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-9-16': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-9-17': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-9-21': [
    { time: '08:00–17:00', doctor: 'MUDr. Tomáš Bachratý',  type: 'Běžná ambulance' },
  ],
  '2026-9-22': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-9-23': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
  '2026-9-24': [
    { time: '08:00–12:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
  ],
  '2026-9-29': [
    { time: '09:00–13:30', doctor: 'MUDr. Jiří Šťovíček',   type: 'Běžná ambulance' },
    { time: '15:30–16:00', doctor: 'MUDr. Radoslav Vrabeľ', type: 'Běžná ambulance' },
    { time: '16:00–17:00', doctor: null,                    type: 'UZV vyšetření' },
    { time: '17:00–19:00', doctor: null,                    type: 'Kontroly' },
  ],
  '2026-9-30': [
    { time: '09:00–13:30', doctor: 'MUDr. Josef Zima',      type: 'Běžná ambulance' },
    { time: '15:00–19:00', doctor: 'MUDr. Antonín Pultar',  type: 'Běžná ambulance' },
  ],
};

function scheduleKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getSlotsForDay(d) {
  return SCHEDULE[scheduleKey(d)] || null;
}

const LAST_SCHEDULE_DATE = Object.keys(SCHEDULE).reduce((latest, key) => {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date > latest ? date : latest;
}, new Date(0));
LAST_SCHEDULE_DATE.setHours(0, 0, 0, 0);

function isAfterLastScheduleDate(d) {
  return d > LAST_SCHEDULE_DATE;
}

function closedTextForDay(d) {
  if (isAfterLastScheduleDate(d)) return 'Bude doplněno';
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
  const labelEls = document.querySelectorAll('.schedule-week-label');

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 4);

  labelEls.forEach(labelEl => {
    labelEl.textContent = `${fmt(weekStart)} – ${fmt(weekEnd)} ${weekEnd.getFullYear()}`;
  });
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
      if (!slots && isAfterLastScheduleDate(d)) row.classList.add('is-pending-schedule');

      // Každý slot má vlastní řádek, aby desktop držel tabulkové sloupce
      // a mobil mohl zobrazit typ služby s časem v jedné řádce.
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
            <div class="schedule-slot">
              <span class="sch-day-date${repeatCls}">
                <span class="sch-dname">${DAY_NAMES[dow]}</span>
                <span class="sch-ddate">${fmt(d)}</span>
                ${badge}
              </span>
              ${doctorHtml}
              <span class="schedule-slot-meta">
                <span class="schedule-hours">${s.time}</span>
                <span class="schedule-type">${s.type}</span>
              </span>
            </div>
          `;
        });
      } else {
        html = `
          <div class="schedule-slot">
            <span class="sch-day-date">
              <span class="sch-dname">${DAY_NAMES[dow]}</span>
              <span class="sch-ddate">${fmt(d)}</span>
            </span>
            <span class="schedule-doctor"></span>
            <span class="schedule-slot-meta">
              <span class="schedule-hours">${closedTextForDay(d)}</span>
              <span class="schedule-type"></span>
            </span>
          </div>
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

document.querySelectorAll('[data-week-shift]').forEach(button => {
  button.addEventListener('click', () => {
    weekStart.setDate(weekStart.getDate() + Number(button.dataset.weekShift));
    calendarViewDate = new Date(weekStart);
    renderSchedule();
  });
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
