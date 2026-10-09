/**
 * G-Man Consent Mode v2 + cookie popup (IT/EN)
 * Default denied → update on choice. Preferences FAB left, above AI chat.
 */
(function () {
  if (window.__gmanConsentInit) return;
  window.__gmanConsentInit = true;

  var KEY = "gman_consent_v1";
  var isEn =
    location.pathname === "/en" ||
    location.pathname.indexOf("/en/") === 0;

  var i18n = isEn
    ? {
        title: "We value your privacy",
        body:
          "We use cookies and similar technologies for analytics and advertising measurement (Google Analytics 4 / Google Ads), only with your consent. Essential cookies keep the site working.",
        analytics: "Analytics",
        analyticsHint: "Page views and site usage (GA4)",
        ads: "Advertising",
        adsHint: "Conversion measurement and ads (Google Ads)",
        accept: "Accept all",
        reject: "Reject",
        save: "Save choices",
        fab: "Cookie settings"
      }
    : {
        title: "La tua privacy conta",
        body:
          "Usiamo cookie e tecnologie simili per analitica e misurazione pubblicitaria (Google Analytics 4 / Google Ads), solo con il tuo consenso. I cookie essenziali fanno funzionare il sito.",
        analytics: "Analitica",
        analyticsHint: "Visite e utilizzo del sito (GA4)",
        ads: "Pubblicità",
        adsHint: "Conversioni e annunci (Google Ads)",
        accept: "Accetta tutto",
        reject: "Rifiuta",
        save: "Salva scelte",
        fab: "Preferenze cookie"
      };

  function dlPush() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      dlPush.apply(null, arguments);
    };
  }

  function applyDefault() {
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
      wait_for_update: 500
    });
  }

  function applyUpdate(state) {
    var a = state.analytics ? "granted" : "denied";
    var d = state.ads ? "granted" : "denied";
    window.gtag("consent", "update", {
      analytics_storage: a,
      ad_storage: d,
      ad_user_data: d,
      ad_personalization: d
    });
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function write(state) {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          analytics: !!state.analytics,
          ads: !!state.ads,
          ts: Date.now()
        })
      );
    } catch (e) {}
  }

  function ensureCss() {
    if (document.querySelector('link[href*="consent-mode.css"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "/assets/consent-mode.css";
    document.head.appendChild(l);
  }

  function buildUi() {
    if (document.getElementById("gman-consent-overlay")) return;

    var overlay = document.createElement("div");
    overlay.id = "gman-consent-overlay";
    overlay.className = "gman-consent-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "gman-consent-title");
    overlay.hidden = true;

    overlay.innerHTML =
      '<div class="gman-consent-modal">' +
      "<header>" +
      '<strong id="gman-consent-title">' +
      i18n.title +
      "</strong>" +
      "<p>" +
      i18n.body +
      "</p>" +
      "</header>" +
      '<div class="gman-consent-body">' +
      '<div class="gman-consent-toggles">' +
      '<label class="gman-consent-row"><span>' +
      i18n.analytics +
      "<small>" +
      i18n.analyticsHint +
      '</small></span><input type="checkbox" id="gman-c-analytics" checked /></label>' +
      '<label class="gman-consent-row"><span>' +
      i18n.ads +
      "<small>" +
      i18n.adsHint +
      '</small></span><input type="checkbox" id="gman-c-ads" checked /></label>' +
      "</div></div>" +
      '<div class="gman-consent-actions">' +
      '<button type="button" class="gman-consent-reject" data-act="reject">' +
      i18n.reject +
      "</button>" +
      '<button type="button" class="gman-consent-save" data-act="save">' +
      i18n.save +
      "</button>" +
      '<button type="button" class="gman-consent-accept" data-act="accept">' +
      i18n.accept +
      "</button>" +
      "</div></div>";

    var fab = document.createElement("button");
    fab.type = "button";
    fab.id = "gman-consent-fab";
    fab.className = "gman-consent-fab";
    fab.setAttribute("aria-label", i18n.fab);
    fab.textContent = "🍪 " + i18n.fab;

    document.body.appendChild(overlay);
    document.body.appendChild(fab);

    function close() {
      overlay.hidden = true;
      document.documentElement.style.overflow = "";
    }
    function open() {
      var s = read() || { analytics: true, ads: true };
      var a = document.getElementById("gman-c-analytics");
      var d = document.getElementById("gman-c-ads");
      if (a) a.checked = !!s.analytics;
      if (d) d.checked = !!s.ads;
      overlay.hidden = false;
      document.documentElement.style.overflow = "hidden";
    }

    function commit(state) {
      write(state);
      applyUpdate(state);
      close();
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        if (read()) close();
      }
    });

    overlay.querySelector('[data-act="accept"]').addEventListener("click", function () {
      commit({ analytics: true, ads: true });
    });
    overlay.querySelector('[data-act="reject"]').addEventListener("click", function () {
      commit({ analytics: false, ads: false });
    });
    overlay.querySelector('[data-act="save"]').addEventListener("click", function () {
      var a = document.getElementById("gman-c-analytics");
      var d = document.getElementById("gman-c-ads");
      commit({ analytics: !!(a && a.checked), ads: !!(d && d.checked) });
    });

    fab.addEventListener("click", open);
    window.__gmanOpenConsent = open;
    return { open: open, close: close };
  }

  applyDefault();

  function boot() {
    ensureCss();
    var ui = buildUi();
    var saved = read();
    if (saved) {
      applyUpdate(saved);
    } else {
      ui.open();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
