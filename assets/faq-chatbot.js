/**
 * G-Man FAQ Chatbot — knowledge from 100 FAQ pilastro (/assets/faq-kb.json)
 */
(function () {
  "use strict";

  var KB = [];

  var STOP = {
    a:1, ad:1, al:1, alla:1, allo:1, ai:1, agli:1, alle:1, con:1, da:1, dal:1, dalla:1,
    dei:1, del:1, della:1, delle:1, dello:1, di:1, e:1, ed:1, che:1, chi:1, come:1, cosa:1,
    i:1, il:1, in:1, la:1, le:1, lo:1, mi:1, o:1, per:1, un:1, una:1, uno:1, sul:1,
    sulla:1, sui:1, sulle:1, se:1, si:1, sono:1, the:1, is:1, are:1, of:1, to:1,
    for:1, my:1, me:1, you:1, your:1, can:1, what:1, how:1, why:1, quando:1, quale:1,
    quali:1, quanto:1, quanti:1, serve:1, meglio:1, bisogna:1, sempre:1, davvero:1
  };

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(s) {
    return norm(s).split(" ").filter(function (t) {
      return t.length > 2 && !STOP[t];
    });
  }

  function score(query, item) {
    var qt = tokens(query);
    if (!qt.length) return 0;
    var hay = norm(item.q + " " + item.a);
    var qn = norm(item.q);
    var sc = 0;
    for (var i = 0; i < qt.length; i++) {
      var t = qt[i];
      if (qn.indexOf(t) !== -1) sc += 3;
      else if (hay.indexOf(t) !== -1) sc += 1.2;
    }
    var nq = norm(query);
    if (qn.indexOf(nq) !== -1) sc += 8;
    var boosts = [
      ["roas", "roas"], ["cpa", "cpa"], ["ga4", "ga4"], ["gtm", "tag manager"],
      ["consent", "consent"], ["merchant", "merchant"], ["shopping", "shopping"],
      ["performance max", "performance max"], ["pmax", "performance max"],
      ["lead", "lead"], ["whatsapp", "whatsapp"], ["maps", "maps"],
      ["tracking", "tracking"], ["conversione", "conversione"], ["budget", "budget"],
      ["audit", "audit"], ["feed", "feed"], ["cookie", "cookie"], ["gdpr", "gdpr"]
    ];
    for (var b = 0; b < boosts.length; b++) {
      if (nq.indexOf(boosts[b][0]) !== -1 && hay.indexOf(boosts[b][1]) !== -1) sc += 2.5;
    }
    return sc;
  }

  function search(query, limit) {
    limit = limit || 3;
    var ranked = KB.map(function (item) {
      return { item: item, sc: score(query, item) };
    }).filter(function (x) { return x.sc > 0; });
    ranked.sort(function (a, b) { return b.sc - a.sc; });
    return ranked.slice(0, limit);
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function addMsg(box, role, text, meta) {
    var row = el("div", "gman-chat-msg gman-chat-" + role);
    var bubble = el("div", "gman-chat-bubble");
    bubble.textContent = text;
    row.appendChild(bubble);
    if (meta) {
      var m = el("div", "gman-chat-meta");
      m.textContent = meta;
      row.appendChild(m);
    }
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
  }

  function answer(query) {
    var hits = search(query, 3);
    if (!hits.length || hits[0].sc < 2) {
      return {
        text: "Non ho trovato una risposta precisa nelle FAQ. Prova a riformulare (es. ROAS, GA4, tracking, Consent Mode, lead generation) oppure richiedi un audit gratuito: ti rispondo entro 24 ore.",
        meta: null
      };
    }
    var best = hits[0].item;
    var more = hits.slice(1).filter(function (h) { return h.sc >= hits[0].sc * 0.45; });
    var text = best.a;
    if (more.length) {
      text += "\n\nPotrebbe interessarti anche:\n";
      more.forEach(function (h) {
        text += "• " + h.item.q + "\n";
      });
    }
    text += "\n\nFonte: FAQ #" + best.id + " — /blog/faq-google-ads-analytics-tracking/";
    return { text: text, meta: "FAQ #" + best.id + " · " + best.q };
  }

  function openChat() {
    var panel = document.getElementById("gman-chat-panel");
    if (!panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    var input = document.getElementById("gman-chat-input");
    if (input) setTimeout(function () { input.focus(); }, 120);
  }

  function closeChat() {
    var panel = document.getElementById("gman-chat-panel");
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  function buildUI() {
    if (document.getElementById("gman-chat-root")) return;

    var root = el("div", "gman-chat-root");
    root.id = "gman-chat-root";

    var fab = el("button", "gman-chat-fab");
    fab.type = "button";
    fab.setAttribute("aria-label", "Apri assistente AI");
    fab.innerHTML = '<span aria-hidden="true">✦</span> Chiedi alla AI';
    fab.addEventListener("click", openChat);

    var panel = el("div", "gman-chat-panel");
    panel.id = "gman-chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Assistente G-Man FAQ");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<div class="gman-chat-header">' +
        '<div><strong>Assistente G-Man</strong><span>Risposte dalle 100 FAQ · Google Ads, tracking, GA4</span></div>' +
        '<button type="button" class="gman-chat-close" aria-label="Chiudi">×</button>' +
      '</div>' +
      '<div class="gman-chat-messages" id="gman-chat-messages"></div>' +
      '<form class="gman-chat-form" id="gman-chat-form">' +
        '<input id="gman-chat-input" type="text" autocomplete="off" placeholder="Es. Cos\'è il ROAS? Come tracciare le conversioni?" maxlength="300" />' +
        '<button type="submit" class="gman-chat-send">Invia</button>' +
      '</form>' +
      '<div class="gman-chat-footer"><a href="/blog/faq-google-ads-analytics-tracking/">Apri tutte le FAQ →</a></div>';

    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);

    var msgs = document.getElementById("gman-chat-messages");
    addMsg(msgs, "bot", "Ciao! Sono l'assistente virtuale di G-Man. Rispondo usando le 100 FAQ su Google Ads, tracking, GA4, ROAS, Consent Mode e lead generation. Cosa vuoi sapere?");

    panel.querySelector(".gman-chat-close").addEventListener("click", closeChat);

    document.getElementById("gman-chat-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("gman-chat-input");
      var q = (input.value || "").trim();
      if (!q) return;
      addMsg(msgs, "user", q);
      input.value = "";
      var res = answer(q);
      addMsg(msgs, "bot", res.text, res.meta);
    });

    document.querySelectorAll("[data-gman-chat-open]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openChat();
      });
    });
  }

  function mount() {
    fetch("/assets/faq-kb.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        KB = d || [];
        buildUI();
      })
      .catch(function () {
        KB = [];
        buildUI();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
