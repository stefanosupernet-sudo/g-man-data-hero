/** Early LCP boost: first non-tiny image gets fetchpriority=high + eager */
(function () {
  function run() {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var w = parseInt(img.getAttribute("width") || "0", 10);
      if (w > 0 && w < 48) continue;
      if (img.getAttribute("fetchpriority") === "high") return;
      img.setAttribute("fetchpriority", "high");
      img.setAttribute("loading", "eager");
      img.setAttribute("decoding", "async");
      return;
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
