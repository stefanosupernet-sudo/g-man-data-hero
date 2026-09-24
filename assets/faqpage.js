/**
 * Dynamic FAQPage JSON-LD
 * Scans .faq-item (h3+p) or details/summary+p and injects schema.org FAQPage.
 * Skips if a static FAQPage JSON-LD is already present.
 */
(function () {
  function textOf(el) {
    return (el && (el.textContent || "")).replace(/\s+/g, " ").trim();
  }

  function collectFaqs() {
    var items = [];

    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector("h3, h2, .faq-q");
      var a = item.querySelector("p, .faq-a");
      if (q && a && textOf(q) && textOf(a)) {
        items.push({ q: textOf(q), a: textOf(a) });
      }
    });

    if (!items.length) {
      var scope = document.querySelector("#faq, .faq-list, .faq, section.faq") || document;
      scope.querySelectorAll("details").forEach(function (d) {
        var q = d.querySelector("summary");
        var a = d.querySelector("p");
        if (q && a && textOf(q) && textOf(a)) {
          items.push({ q: textOf(q), a: textOf(a) });
        }
      });
    }

    return items;
  }

  function hasStaticFAQPage() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].getAttribute("data-faqpage-dynamic") === "1") continue;
      try {
        var d = JSON.parse(scripts[i].textContent);
        if (!d) continue;
        if (d["@type"] === "FAQPage") return true;
        if (Array.isArray(d["@type"]) && d["@type"].indexOf("FAQPage") !== -1) return true;
        if (Array.isArray(d["@graph"])) {
          for (var j = 0; j < d["@graph"].length; j++) {
            var t = d["@graph"][j] && d["@graph"][j]["@type"];
            if (t === "FAQPage" || (Array.isArray(t) && t.indexOf("FAQPage") !== -1)) return true;
          }
        }
      } catch (e) {}
    }
    return false;
  }

  function injectFAQPage(items) {
    if (!items || items.length < 2) return;
    if (hasStaticFAQPage()) return;

    var mainEntity = items.map(function (it) {
      return {
        "@type": "Question",
        name: it.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: it.a
        }
      };
    });

    var data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: mainEntity
    };

    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-faqpage-dynamic", "1");
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  function run() {
    try {
      injectFAQPage(collectFaqs());
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
