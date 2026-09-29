/**
 * G-Man i18n router
 * - Italy (geo) → Italian paths
 * - Abroad → English paths (/en/...)
 * - Cookie gman_lang remembers explicit choice
 * - ?lang=it|en forces language
 * - Visible IT | EN switcher on every page
 */
(function () {
  var COOKIE = 'gman_lang';
  var MAX_AGE = 365 * 24 * 60 * 60;

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function setCookie(name, value) {
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      ';path=/;max-age=' +
      MAX_AGE +
      ';SameSite=Lax';
  }

  function pathLang(pathname) {
    if (pathname === '/en' || pathname.indexOf('/en/') === 0) return 'en';
    return 'it';
  }

  function toEnPath(pathname) {
    if (pathname === '/en' || pathname.indexOf('/en/') === 0) return pathname;
    if (pathname === '/' || pathname === '') return '/en/';
    if (pathname === '/index' || pathname === '/index/' || pathname === '/index.html') return '/en/';
    return '/en' + (pathname.charAt(0) === '/' ? pathname : '/' + pathname);
  }

  function toItPath(pathname) {
    if (pathname === '/en' || pathname === '/en/') return '/';
    if (pathname.indexOf('/en/') === 0) {
      var rest = pathname.slice(3);
      return rest || '/';
    }
    return pathname;
  }

  /** Pages that have a dedicated EN twin (redirect target). */
  function hasEnTwin(itPath) {
    var p = itPath.replace(/\/+$/, '') || '/';
    if (p === '/' || p === '/index') return true;
    if (p === '/chi-sono') return true;
    if (p === '/blog') return true;
    if (p.indexOf('/blog/') === 0) return false;
    return false;
  }

  function detectCountry() {
    return fetch('https://api.country.is/', { credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('geo');
        return r.json();
      })
      .then(function (j) {
        return String(j.country || '').toUpperCase();
      })
      .catch(function () {
        var langs = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < langs.length; i++) {
          if (/^it\b/i.test(langs[i] || '')) return 'IT';
        }
        return 'XX';
      });
  }

  function injectSwitcher(active) {
    if (document.getElementById('gman-lang-switch')) return;

    var wrap = document.createElement('div');
    wrap.id = 'gman-lang-switch';
    wrap.setAttribute('role', 'navigation');
    wrap.setAttribute('aria-label', 'Language / Lingua');
    wrap.innerHTML =
      '<span class="gman-lang-label">Lingua</span>' +
      '<button type="button" data-lang="it" class="' +
      (active === 'it' ? 'is-active' : '') +
      '" title="Italiano" aria-pressed="' +
      (active === 'it' ? 'true' : 'false') +
      '">IT</button>' +
      '<button type="button" data-lang="en" class="' +
      (active === 'en' ? 'is-active' : '') +
      '" title="English" aria-pressed="' +
      (active === 'en' ? 'true' : 'false') +
      '">EN</button>';

    var style = document.createElement('style');
    style.id = 'gman-lang-switch-css';
    style.textContent =
      '#gman-lang-switch{' +
      'position:fixed;top:14px;right:14px;z-index:9999;' +
      'display:flex;align-items:center;gap:0;' +
      'border-radius:999px;overflow:hidden;' +
      'border:2px solid rgba(255,77,46,.55);' +
      'background:rgba(10,14,26,.96);' +
      'backdrop-filter:blur(10px);' +
      'box-shadow:0 6px 24px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.06);' +
      'font-family:Barlow,system-ui,sans-serif}' +
      '#gman-lang-switch .gman-lang-label{' +
      'display:none;padding:0 10px 0 14px;font-size:11px;font-weight:600;' +
      'letter-spacing:.08em;text-transform:uppercase;color:#94a3b8}' +
      '#gman-lang-switch button{' +
      'font:700 13px/1 Barlow,system-ui,sans-serif;letter-spacing:.08em;' +
      'padding:11px 14px;border:0;background:transparent;color:#94a3b8;cursor:pointer;' +
      'min-width:44px;transition:background .15s,color .15s}' +
      '#gman-lang-switch button.is-active{background:#ff4d2e;color:#fff}' +
      '#gman-lang-switch button:hover:not(.is-active){color:#f1f5f9;background:rgba(255,255,255,.06)}' +
      '@media(min-width:640px){#gman-lang-switch .gman-lang-label{display:inline}}' +
      '@media(max-width:600px){' +
      '#gman-lang-switch{top:auto;bottom:88px;right:12px}' +
      '#gman-lang-switch button{padding:12px 16px;font-size:14px}' +
      '}';

    function mount() {
      if (!document.getElementById('gman-lang-switch-css')) {
        document.head.appendChild(style);
      }
      if (!document.body) return false;
      if (!document.getElementById('gman-lang-switch')) {
        document.body.appendChild(wrap);
      }
      return true;
    }

    if (!mount()) {
      document.addEventListener('DOMContentLoaded', mount);
    }

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      var lang = btn.getAttribute('data-lang');
      setCookie(COOKIE, lang);
      var path = location.pathname;
      var target = lang === 'en' ? toEnPath(toItPath(path)) : toItPath(path);
      if (
        lang === 'en' &&
        pathLang(path) === 'it' &&
        path.indexOf('/blog/') === 0 &&
        !hasEnTwin(path)
      ) {
        target = '/en/blog/';
      }
      var qs = location.search.replace(/[?&]lang=(it|en)/g, '').replace(/^&/, '?');
      if (qs === '?') qs = '';
      if (target !== path) location.href = target + qs + location.hash;
      else location.reload();
    });
  }

  function boot(preferred) {
    var lang = pathLang(location.pathname);
    injectSwitcher(preferred || lang);

    if (!preferred) return;

    if (preferred === 'en' && lang === 'it') {
      var itPath = location.pathname;
      if (itPath.indexOf('/blog/') === 0 && itPath.replace(/\/+$/, '') !== '/blog') {
        return;
      }
      if (
        hasEnTwin(itPath) ||
        itPath === '/' ||
        itPath === '/blog/' ||
        itPath === '/blog' ||
        itPath === '/chi-sono/' ||
        itPath === '/chi-sono'
      ) {
        var dest = toEnPath(itPath);
        if (dest !== itPath) {
          location.replace(dest + location.search + location.hash);
        }
      }
    } else if (preferred === 'it' && lang === 'en') {
      var destIt = toItPath(location.pathname);
      if (destIt !== location.pathname) {
        location.replace(destIt + location.search + location.hash);
      }
    }
  }

  function start() {
    var params = new URLSearchParams(location.search);
    var forced = params.get('lang');
    if (forced === 'it' || forced === 'en') {
      setCookie(COOKIE, forced);
      boot(forced);
      return;
    }

    var saved = getCookie(COOKIE);
    if (saved === 'it' || saved === 'en') {
      boot(saved);
      return;
    }

    detectCountry().then(function (country) {
      var preferred = country === 'IT' ? 'it' : 'en';
      setCookie(COOKIE, preferred);
      boot(preferred);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
