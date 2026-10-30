(function () {
  if (window.__gmanNavInit) return;
  window.__gmanNavInit = true;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function closeSubs(scope, except) {
    qsa(".nav-item.open", scope || document).forEach(function (item) {
      if (except && (item === except || (except.contains && except.contains(item)))) return;
      item.classList.remove("open");
      var btn = qs(".nav-sub-toggle", item);
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  var SERVICE_MENUS = [
    {
      match: ["/servizi/google-ads", "/en/services/google-ads"],
      label: "Google Ads",
      href: "/servizi/google-ads/",
      aria: "Tipi di campagna Google Ads",
      items: [
        ["/servizi/google-ads/", "Panoramica"],
        ["/servizi/google-ads/search/", "Search"],
        ["/servizi/google-ads/shopping/", "Shopping"],
        ["/servizi/google-ads/performance-max/", "Performance Max"],
        ["/servizi/google-ads/demand-gen/", "Demand Gen"],
        ["/servizi/google-ads/youtube/", "YouTube"],
        ["/servizi/google-ads/remarketing/", "Remarketing"]
      ]
    },
    {
      match: ["/servizi/google-analytics-4", "/en/services/google-analytics-4"],
      label: "Google Analytics 4",
      href: "/servizi/google-analytics-4/",
      aria: "Approfondimenti GA4",
      items: [
        ["/servizi/google-analytics-4/", "Panoramica"],
        ["/servizi/google-analytics-4/eventi-chiave/", "Eventi chiave"],
        ["/servizi/google-analytics-4/metriche/", "Metriche"],
        ["/servizi/google-analytics-4/remarketing-audience/", "Remarketing e audience"]
      ]
    },
    {
      match: ["/servizi/merchant-center-feed", "/en/services/merchant-center"],
      label: "Merchant Center & Feed",
      href: "/servizi/merchant-center-feed/",
      aria: "Approfondimenti Merchant Center",
      items: [
        ["/servizi/merchant-center-feed/", "Panoramica"],
        ["/servizi/merchant-center-feed/feed-formati/", "Feed e formati"],
        ["/servizi/merchant-center-feed/policy/", "Policy"],
        ["/servizi/merchant-center-feed/regole-promozioni/", "Regole e promozioni"]
      ]
    },
    {
      match: ["/servizi/tag-manager-tracking", "/en/services/tag-manager"],
      label: "Tag Manager & Tracking",
      href: "/servizi/tag-manager-tracking/",
      aria: "Approfondimenti tracking",
      items: [
        ["/servizi/tag-manager-tracking/", "Panoramica"],
        ["/servizi/tag-manager-tracking/data-layer/", "Data Layer"],
        ["/servizi/tag-manager-tracking/eventi/", "Eventi"],
        ["/servizi/tag-manager-tracking/conversion-linker/", "Conversion Linker"],
        ["/servizi/tag-manager-tracking/multi-piattaforma/", "Multi-piattaforma"]
      ]
    },
    {
      match: ["/servizi/consulenza-strategica-ai", "/en/services/strategy-ai"],
      label: "Consulenza strategica & AI",
      href: "/servizi/consulenza-strategica-ai/",
      aria: "Approfondimenti consulenza AI",
      items: [
        ["/servizi/consulenza-strategica-ai/", "Panoramica"],
        ["/servizi/consulenza-strategica-ai/smart-bidding/", "Smart Bidding"],
        ["/servizi/consulenza-strategica-ai/audit-strategico/", "Audit strategico"],
        ["/servizi/consulenza-strategica-ai/ai-controllo-umano/", "AI e controllo umano"]
      ]
    }
  ];

  function normalizeHref(href) {
    return (href || "").replace(/\/$/, "");
  }

  function alreadyNested(a) {
    return !!(a && a.closest && a.closest(".nav-item.has-sub.nested"));
  }

  function injectServiceMenu(cfg) {
    var link = null;
    qsa(".nav-sub > a[href], .nav-sub a[href]").forEach(function (a) {
      if (alreadyNested(a)) return;
      var href = normalizeHref(a.getAttribute("href"));
      for (var i = 0; i < cfg.match.length; i++) {
        if (href === normalizeHref(cfg.match[i])) {
          // only top-level items under servizi submenu (direct child of .nav-sub of servizi)
          if (a.parentElement && a.parentElement.classList.contains("nav-sub")) {
            link = a;
          }
        }
      }
    });
    if (!link) return;

    var parentSub = link.parentElement;
    var itemsHtml = cfg.items.map(function (it) {
      return '<a href="' + it[0] + '" role="menuitem">' + it[1] + "</a>";
    }).join("");

    var wrap = document.createElement("div");
    wrap.className = "nav-item has-sub nested";
    wrap.innerHTML =
      '<div class="nav-parent">' +
      '<a href="' + cfg.href + '" role="menuitem">' + cfg.label + "</a>" +
      '<button type="button" class="nav-sub-toggle" aria-expanded="false" aria-label="' + cfg.aria + '">+</button>' +
      "</div>" +
      '<div class="nav-sub" role="menu">' + itemsHtml + "</div>";

    parentSub.insertBefore(wrap, link);
    if (link.parentNode) link.parentNode.removeChild(link);
  }

  function ensureServiceSubmenus() {
    SERVICE_MENUS.forEach(injectServiceMenu);
  }

  function bindSubToggles() {
    qsa(".nav-item.has-sub").forEach(function (item) {
      var btn = qs(".nav-sub-toggle", item);
      if (!btn || btn.__gmanBound) return;
      btn.__gmanBound = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains("open");
        var parent = item.parentElement;
        if (parent) {
          qsa(".nav-item.has-sub.open", parent).forEach(function (sib) {
            if (sib !== item && sib.parentElement === parent) {
              sib.classList.remove("open");
              var b = qs(".nav-sub-toggle", sib);
              if (b) b.setAttribute("aria-expanded", "false");
            }
          });
        }
        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  function init() {
    ensureServiceSubmenus();

    var toggle = qs(".nav-toggle");
    var nav = qs("nav.nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        nav.classList.toggle("nav-open", !open);
        if (open) closeSubs(nav);
      });
    }

    bindSubToggles();

    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".nav-item.has-sub")) {
        closeSubs(document);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeSubs(document);
        if (toggle && nav) {
          toggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("nav-open");
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
