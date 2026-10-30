(function () {
  if (window.__gmanNavInit) return;
  window.__gmanNavInit = true;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function closeAllSubs(except) {
    qsa(".nav-item.open").forEach(function (item) {
      if (except && item === except) return;
      item.classList.remove("open");
      var btn = qs(".nav-sub-toggle", item);
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function init() {
    var toggle = qs(".nav-toggle");
    var nav = qs("nav.nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        nav.classList.toggle("nav-open", !open);
        if (open) closeAllSubs();
      });
    }

    qsa(".nav-item.has-sub").forEach(function (item) {
      var btn = qs(".nav-sub-toggle", item);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains("open");
        closeAllSubs(item);
        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".nav-item.has-sub")) {
        closeAllSubs();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllSubs();
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
