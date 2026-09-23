/* Canonicalize /index and /index.html to / */
(function () {
  var p = location.pathname;
  if (/^\/index(\.html)?\/?$/i.test(p)) {
    location.replace("/" + location.search + location.hash);
  }
})();
