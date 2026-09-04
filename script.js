/* Krishi Jain — portfolio interactions */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var progress = document.getElementById("scrollProgress");

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

  /* ---- Header border + scroll progress ---- */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Scroll reveal ---- */
  try {
    var items = document.querySelectorAll(".reveal");
    var showAll = function () { items.forEach(function (el) { el.classList.add("in"); }); };
    if ("IntersectionObserver" in window && items.length) {
      // stagger siblings that reveal together
      items.forEach(function (el) {
        var sibs = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [el];
        var idx = Array.prototype.indexOf.call(sibs, el);
        if (idx > 0) el.style.setProperty("--rd", Math.min(idx, 4) * 90 + "ms");
      });
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
      items.forEach(function (el) { obs.observe(el); });
      setTimeout(showAll, 1400);           // never leave content hidden
      window.addEventListener("load", showAll);
    } else {
      showAll();
    }
  } catch (e) { /* motion is optional */ }

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
