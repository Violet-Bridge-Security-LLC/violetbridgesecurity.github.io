/* Violet Bridge Security LLC – minimal enhancements for a static site */

/* 1) Smoothly highlight current section link while scrolling */
const navLinks = [...document.querySelectorAll("nav a[href^='#']")];
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActive = () => {
  const y = window.scrollY + 120; // offset for header
  let current = null;
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec;
  }
  navLinks.forEach(a => a.classList.toggle(
    "is-active", current && a.getAttribute("href") === `#${current.id}`
  ));
};
addEventListener("scroll", setActive);
addEventListener("load", setActive);

/* 2) Smooth-anchor behavior for older browsers */
navLinks.forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.startsWith("#")) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    }
  });
});

/* 3) Back-to-top button */
const toTop = document.getElementById("toTop");
if (toTop){
  const toggleTop = () => {
    if (window.scrollY > 400) toTop.classList.add("visible");
    else toTop.classList.remove("visible");
  };
  addEventListener("scroll", toggleTop);
  addEventListener("load", toggleTop);
}

/* 4) Simple data-driven placeholders (optional)
   - You can replace these arrays with real data or fetch from your GitHub later.
*/
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

/* Example usage (uncomment when you’re ready to auto-render cards)
mountList("#toolsGrid", toolsData, t => `
  <article class="card">
    <h3>${t.name}</h3>
    <p>${t.desc}</p>
    <a class="btn" href="${t.url}" target="_blank" rel="noopener">View on GitHub</a>
  </article>
`);
mountList("#reportsGrid", reportsData, r => `
  <article class="card">
    <h3>${r.title}</h3>
    <a class="btn" href="${r.url}" target="_blank" rel="noopener">Open PDF</a>
  </article>
`);
*/

/* 5) Small helper: copy email to clipboard */
document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-copy");
    navigator.clipboard.writeText(value).then(() => {
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = old), 1100);
    });
  });
});
