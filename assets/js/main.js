// Mobile nav toggle
var toggle = document.querySelector('.nav-toggle');
var nav = document.querySelector('.site-nav nav');
if (toggle && nav) {
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });
}

// Scroll-spy: highlight the nav link for the section in view (homepage only)
var sections = document.querySelectorAll('main section[id]');
var links = document.querySelectorAll('.nav-links a[href^="/#"]');
if (sections.length && links.length && 'IntersectionObserver' in window) {
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(2)] = a; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = byId[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
}
