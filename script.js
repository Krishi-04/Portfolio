/* Krishi Jain — portfolio interactions */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var progress = document.getElementById("scrollProgress");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---- One rAF-throttled scroll renderer: header, progress bar, metric rings ---- */
  var rings = Array.prototype.slice.call(document.querySelectorAll(".ring"));
  var ticking = false;

  function render() {
    ticking = false;

    header.classList.toggle("scrolled", window.scrollY > 8);

    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    }

    var vh = window.innerHeight;
    for (var i = 0; i < rings.length; i++) {
      var r = rings[i];
      var p;
      if (reduceMotion) {
        p = 1;
      } else {
        var rect = r.getBoundingClientRect();
        var startY = vh * 0.92;   // ring top here -> 0
        var endY = vh * 0.36;     // ring top here -> full
        p = (startY - rect.top) / (startY - endY);
        p = p < 0 ? 0 : p > 1 ? 1 : p;
      }
      r.style.setProperty("--p", p.toFixed(3));
      var num = r.querySelector(".ring-num");
      if (num) num.textContent = Math.round(p * (parseFloat(r.getAttribute("data-target")) || 0)) + "%";
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  }
  render();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---- Scroll reveal (fire once) ---- */
  try {
    var items = document.querySelectorAll(".reveal");
    var showAll = function () { items.forEach(function (el) { el.classList.add("in"); }); };
    if ("IntersectionObserver" in window && items.length) {
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
      setTimeout(showAll, 1400);
      window.addEventListener("load", showAll);
    } else {
      showAll();
    }
  } catch (e) { /* motion is optional */ }

  /* ---- Lightbox: click a screenshot for a closer look ---- */
  var lb = document.getElementById("lb");
  if (lb && typeof lb.showModal === "function") {
    var lbStage = document.getElementById("lbStage");
    var lbTag = document.getElementById("lbTag");
    var lbTitle = document.getElementById("lbTitle");
    var lbPoints = document.getElementById("lbPoints");
    var lbNote = document.getElementById("lbNote");

    var DETAIL = {
      silver: {
        tag: "Accounting & stock", title: "Silver Idols Stock",
        note: "Screens use sample data.",
        points: [
          "Party-wise ledger — receivable and payable, with a running balance",
          "Gross weight, purity, making charges and fine weight calculated on entry",
          "Loan interest accrued by the day",
          "One-click balance sheet, pulled live from every ledger",
        ],
      },
      accounts: {
        tag: "Accounting", title: "Accounting Software",
        note: "Screens use sample data.",
        points: [
          "Every settlement round on its own sheet, with members and shares",
          "Payments and payouts logged per member",
          "“Who owes whom” report, oldest first",
          "Backup and restore built in",
        ],
      },
      "class": {
        tag: "Admin portal · demo", title: "Class Admin",
        note: "A working demo — it runs entirely in the browser.",
        points: [
          "Batches, timetables and rosters across three branches",
          "Fees, attendance and test marks per student",
          "Tests with an invigilator and a paper-checking flow",
          "Staff paid per duty, tracked from assigned to settled",
        ],
      },
    };

    var opener = null;
    function openLB(btn) {
      var d = DETAIL[btn.getAttribute("data-lb")];
      if (!d) return;
      opener = btn;
      var shot = document.createElement("div");
      shot.className = "frame";
      shot.innerHTML = btn.innerHTML;
      var badge = shot.querySelector(".frame-open");
      if (badge) badge.remove();
      lbStage.innerHTML = "";
      lbStage.appendChild(shot);
      lbTag.textContent = d.tag;
      lbTitle.textContent = d.title;
      lbNote.textContent = d.note;
      lbPoints.innerHTML = d.points.map(function (p) { return "<li>" + p + "</li>"; }).join("");
      lb.showModal();
    }
    function closeLB() { lb.close(); }

    document.querySelectorAll(".frame[data-lb]").forEach(function (btn) {
      btn.addEventListener("click", function () { openLB(btn); });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(btn); }
      });
    });
    lb.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeLB); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    lb.addEventListener("close", function () { if (opener) { opener.focus(); opener = null; } });
  }

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
