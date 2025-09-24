// Violet Bridge Security LLC — merged site script

// ============== 1) Mobile navigation toggle ==============
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// ============== 2) Active section highlight on scroll ==============
const navLinks = [...document.querySelectorAll("#site-nav a[href^='#']")];
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function setActiveLink() {
  const y = window.scrollY + 120; // offset for header
  let current = null;
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec;
  }
  navLinks.forEach(a => {
    const isActive = current && a.getAttribute("href") === `#${current.id}`;
    a.classList.toggle("is-active", !!isActive);
  });
}
addEventListener("scroll", setActiveLink, { passive: true });
addEventListener("load", setActiveLink);

// ============== 3) Smooth in-page anchor scrolling ==============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
      // Close mobile nav after navigating
      if (siteNav && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// ============== 4) Back-to-top + reveal-on-scroll ==============
const backToTop = document.getElementById('backToTop');
function onScrollEffects() {
  // Back-to-top visibility (matches #backToTop + .show in HTML/CSS)
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 400);

  // Reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('in');
  });
}
addEventListener('scroll', onScrollEffects, { passive: true });
addEventListener('load', onScrollEffects);

// Optional: click back-to-top to scroll smoothly
backToTop?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
});

// ============== 5) Footer year ==============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============== 6) Copy-to-clipboard helper (for buttons with data-copy) ==============
document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-copy");
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = old), 1100);
    });
  });
});

// ============== 7) Optional data-driven lists (tools/reports) ==============
// Leave arrays empty or fill later; nothing will render unless items exist.
const toolsData = [
  // { name: "FluxGuard", desc: "Fast-Flux DNS detector (beta).", url: "https://github.com/..." },
  // { name: "HarborX", desc: "ZTNA policy linter & tester.", url: "https://github.com/..." },
];
const reportsData = [
  // { title: "Banking SSE Readiness (redacted sample)", url: "reports/banking-sse-sample.pdf" },
  // { title: "DLP Program Maturity (sample)", url: "reports/dlp-maturity-sample.pdf" },
];

function mountList(selector, items, render){
  const el = document.querySelector(selector);
  if (!el || !items?.length) return;
  el.innerHTML = items.map(render).join("");
}

// Example usage (uncomment when you add #toolsGrid / #reportsGrid to the HTML):
/*
mountList("#toolsGrid", toolsData, t => `
  <article class="card reveal">
    <h3>${t.name}</h3>
    <p>${t.desc}</p>
    <p><a class="btn btn-outline" href="${t.url}" target="_blank" rel="noopener">View on GitHub</a></p>
  </article>
`);
mountList("#reportsGrid", reportsData, r => `
  <article class="card reveal">
    <h3>${r.title}</h3>
    <p><a class="btn btn-outline" href="${r.url}" target="_blank" rel="noopener">Open PDF</a></p>
  </article>
`);
*/
