/* Krishi Jain — portfolio interactions (kept deliberately small) */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");

  /* ---- Mobile nav ---- */
  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeNav(); });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 680) closeNav(); });

  /* ---- Header border on scroll ---- */
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Active nav link ---- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var map = navLinks
    .map(function (link) {
      var sec = document.getElementById(link.getAttribute("href").slice(1));
      return sec ? { link: link, sec: sec } : null;
    })
    .filter(Boolean);
  if ("IntersectionObserver" in window && map.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var m = map.find(function (x) { return x.sec === entry.target; });
        if (!m) return;
        navLinks.forEach(function (l) { l.classList.remove("active"); });
        m.link.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach(function (m) { navObs.observe(m.sec); });
  }
})();
