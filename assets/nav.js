(function () {
  if (window.__gmanNavInit) return;
  window.__gmanNavInit = true;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setOpen(item, open) {
    if (!item) return;
    item.classList.toggle("open", !!open);
    var btn = qs(":scope > .nav-parent > .nav-sub-toggle", item) || qs(".nav-sub-toggle", item);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) {
      // closing parent also closes nested children
      qsa(".nav-item.open", item).forEach(function (child) {
        child.classList.remove("open");
        var b = qs(".nav-sub-toggle", child);
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }
  }

  function closeSubs(scope, except) {
    qsa(".nav-item.open", scope || document).forEach(function (item) {
      if (except && (item === except || (except.contains && except.contains(item)))) return;
      setOpen(item, false);
    });
  }

  var isEn = (location.pathname || "").indexOf("/en/") === 0 || location.pathname === "/en";

  var MENUS_IT = [
    {
      match: ["/servizi/google-ads"],
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
      match: ["/servizi/google-analytics-4"],
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
      match: ["/servizi/merchant-center-feed"],
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
      match: ["/servizi/tag-manager-tracking"],
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
      match: ["/servizi/consulenza-strategica-ai"],
      label: "Consulenza strategica & AI",
      href: "/servizi/consulenza-strategica-ai/",
      aria: "Approfondimenti consulenza",
      items: [
        ["/servizi/consulenza-strategica-ai/", "Panoramica"],
        ["/servizi/consulenza-strategica-ai/smart-bidding/", "Smart Bidding"],
        ["/servizi/consulenza-strategica-ai/audit-strategico/", "Audit strategico"],
        ["/servizi/consulenza-strategica-ai/ai-controllo-umano/", "AI e controllo umano"]
      ]
    }
  ];

  var MENUS_EN = [
    {
      match: ["/en/services/google-ads"],
      label: "Google Ads",
      href: "/en/services/google-ads/",
      aria: "Google Ads campaign types",
      items: [
        ["/en/services/google-ads/", "Overview"],
        ["/en/services/google-ads/search/", "Search"],
        ["/en/services/google-ads/shopping/", "Shopping"],
        ["/en/services/google-ads/performance-max/", "Performance Max"],
        ["/en/services/google-ads/demand-gen/", "Demand Gen"],
        ["/en/services/google-ads/youtube/", "YouTube"],
        ["/en/services/google-ads/remarketing/", "Remarketing"]
      ]
    },
    {
      match: ["/en/services/google-analytics-4"],
      label: "Google Analytics 4",
      href: "/en/services/google-analytics-4/",
      aria: "GA4 topics",
      items: [
        ["/en/services/google-analytics-4/", "Overview"],
        ["/en/services/google-analytics-4/key-events/", "Key events"],
        ["/en/services/google-analytics-4/metrics/", "Metrics"],
        ["/en/services/google-analytics-4/remarketing-audiences/", "Remarketing audiences"]
      ]
    },
    {
      match: ["/en/services/merchant-center-feed"],
      label: "Merchant Center & Feed",
      href: "/en/services/merchant-center-feed/",
      aria: "Merchant Center topics",
      items: [
        ["/en/services/merchant-center-feed/", "Overview"],
        ["/en/services/merchant-center-feed/feed-formats/", "Feed formats"],
        ["/en/services/merchant-center-feed/policies/", "Policies"],
        ["/en/services/merchant-center-feed/rules-promotions/", "Rules & promotions"]
      ]
    },
    {
      match: ["/en/services/tag-manager-tracking"],
      label: "Tag Manager & Tracking",
      href: "/en/services/tag-manager-tracking/",
      aria: "Tracking topics",
      items: [
        ["/en/services/tag-manager-tracking/", "Overview"],
        ["/en/services/tag-manager-tracking/data-layer/", "Data layer"],
        ["/en/services/tag-manager-tracking/events/", "Events"],
        ["/en/services/tag-manager-tracking/conversion-linker/", "Conversion Linker"],
        ["/en/services/tag-manager-tracking/multi-platform/", "Multi-platform"]
      ]
    },
    {
      match: ["/en/services/strategy-ai"],
      label: "Strategy & AI",
      href: "/en/services/strategy-ai/",
      aria: "Strategy topics",
      items: [
        ["/en/services/strategy-ai/", "Overview"],
        ["/en/services/strategy-ai/smart-bidding/", "Smart Bidding"],
        ["/en/services/strategy-ai/strategic-audit/", "Strategic audit"],
        ["/en/services/strategy-ai/ai-human-control/", "AI & human control"]
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
    qsa(".nav-sub > a[href]").forEach(function (a) {
      if (alreadyNested(a)) return;
      var href = normalizeHref(a.getAttribute("href"));
      for (var i = 0; i < cfg.match.length; i++) {
        if (href === normalizeHref(cfg.match[i])) {
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
    var menus = isEn ? MENUS_EN : MENUS_IT;
    menus.forEach(injectServiceMenu);
  }

  function bindSubToggles() {
    qsa(".nav-item.has-sub").forEach(function (item) {
      var btn = qs(":scope > .nav-parent > .nav-sub-toggle", item);
      if (!btn) btn = qs(".nav-sub-toggle", item);
      if (!btn || btn.__gmanBound) return;
      btn.__gmanBound = true;

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var willOpen = !item.classList.contains("open");

        // Accordion: close siblings at the same level
        var parent = item.parentElement;
        if (parent) {
          qsa(":scope > .nav-item.has-sub.open", parent).forEach(function (sib) {
            if (sib !== item) setOpen(sib, false);
          });
          // fallback if :scope not supported for query
          qsa(".nav-item.has-sub.open", parent).forEach(function (sib) {
            if (sib !== item && sib.parentElement === parent) setOpen(sib, false);
          });
        }

        // If opening a top-level item, nested are already closed via setOpen on siblings
        // If closing this item, setOpen closes children
        setOpen(item, willOpen);
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
