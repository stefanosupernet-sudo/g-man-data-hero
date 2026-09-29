/**
 * G-Man i18n router
 * - Italy (geo) → Italian paths
 * - Abroad → English paths (/en/...)
 * - Cookie gman_lang remembers explicit choice
 * - ?lang=it|en forces language
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
    // EN blog posts can be added over time under /en/blog/.../
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
    wrap.setAttribute('aria-label', 'Language');
    wrap.innerHTML =
      '<button type="button" data-lang="it" class="' +
      (active === 'it' ? 'is-active' : '') +
      '" title="Italiano">IT</button>' +
      '<button type="button" data-lang="en" class="' +
      (active === 'en' ? 'is-active' : '') +
      '" title="English">EN</button>';
    var style = document.createElement('style');
    style.textContent =
      '#gman-lang-switch{position:fixed;top:72px;right:12px;z-index:120;display:flex;gap:0;border-radius:999px;overflow:hidden;border:1px solid rgba(148,163,184,.35);background:rgba(10,14,26,.92);backdrop-filter:blur(8px);box-shadow:0 4px 16px rgba(0,0,0,.25)}' +
      '#gman-lang-switch button{font:600 12px/1 Barlow,system-ui,sans-serif;letter-spacing:.06em;padding:8px 10px;border:0;background:transparent;color:#94a3b8;cursor:pointer}' +
      '#gman-lang-switch button.is-active{background:#ff4d2e;color:#fff}' +
      '#gman-lang-switch button:hover:not(.is-active){color:#f1f5f9}' +
      '@media(max-width:600px){#gman-lang-switch{top:auto;bottom:84px;right:12px}}';
    document.head.appendChild(style);
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      var lang = btn.getAttribute('data-lang');
      setCookie(COOKIE, lang);
      var path = location.pathname;
      var target = lang === 'en' ? toEnPath(toItPath(path)) : toItPath(path);
      if (lang === 'en' && pathLang(path) === 'it' && path.indexOf('/blog/') === 0 && !hasEnTwin(path)) {
        // Stay on IT article but remember EN preference; go to EN blog hub
        target = '/en/blog/';
      }
      if (target !== path) location.href = target + location.search.replace(/[?&]lang=(it|en)/, '') + location.hash;
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
        // Article without EN twin: keep content, only switcher
        return;
      }
      if (hasEnTwin(itPath) || itPath === '/' || itPath === '/blog/' || itPath === '/blog' || itPath === '/chi-sono/' || itPath === '/chi-sono') {
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

  // Force via query
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

  // First visit: geo (Italy → it, else → en)
  detectCountry().then(function (country) {
    var preferred = country === 'IT' ? 'it' : 'en';
    setCookie(COOKIE, preferred);
    boot(preferred);
  });
})();
