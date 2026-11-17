(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Light/dark theme toggle (initial theme is set by the inline script in <head>)
  var root = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeQuery = window.matchMedia('(prefers-color-scheme: light)');
  function hasSavedTheme() {
    try { var t = localStorage.getItem('theme'); return t === 'light' || t === 'dark'; } catch (e) { return false; }
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#1a1029' : '#f7f2ff');
  }
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  // Follow browser changes until the visitor picks a theme themselves
  var onSystemChange = function (e) { if (!hasSavedTheme()) applyTheme(e.matches ? 'light' : 'dark'); };
  if (themeQuery.addEventListener) themeQuery.addEventListener('change', onSystemChange);

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  function setMenu(open) {
    sidebar.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () {
    setMenu(!sidebar.classList.contains('open'));
  });
  sidebar.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Scroll progress bar
  var progress = document.getElementById('progress');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Scroll-spy
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          var link = links[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(links).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  // Rotating role text in hero
  var rotator = document.getElementById('rotator');
  var phrases = ['backend systems', 'RESTful APIs', 'cloud-ready services', 'clean web apps'];
  if (rotator && !reduceMotion) {
    var p = 0, i = phrases[0].length, deleting = true;
    (function tick() {
      var word = phrases[p];
      rotator.textContent = word.slice(0, i);
      var delay = deleting ? 45 : 85;
      if (deleting) {
        i--;
        if (i < 0) { deleting = false; p = (p + 1) % phrases.length; i = 0; }
      } else {
        i++;
        if (i > phrases[p].length) { deleting = true; i = phrases[p].length; delay = 1800; }
      }
      setTimeout(tick, delay);
    })();
  }
})();
