// ===== COOKIE MANAGEMENT =====
function handleCookies(action) {
  const banner = document.getElementById('cookieBanner');
  const modal  = document.getElementById('cookieModal');
  if (action === 'accept') {
    localStorage.setItem('vbs-cookies', JSON.stringify({n:1,a:1,m:1}));
  } else if (action === 'reject') {
    localStorage.setItem('vbs-cookies', JSON.stringify({n:1,a:0,m:0}));
    window['ga-disable-G-ZSCQFCZV23'] = true;
  } else {
    const an = document.getElementById('cookieAnalytics').checked;
    const mk = document.getElementById('cookieMarketing').checked;
    localStorage.setItem('vbs-cookies', JSON.stringify({n:1,a:an,m:mk}));
    if (!an) window['ga-disable-G-ZSCQFCZV23'] = true;
  }
  if (banner) banner.style.display = 'none';
  if (modal)  modal.classList.remove('open');
}

function openCookiePrefs() {
  const banner = document.getElementById('cookieBanner');
  const modal  = document.getElementById('cookieModal');
  if (banner) banner.style.display = 'none';
  if (modal)  modal.classList.add('open');
}

// ===== COMPANIES / INDUSTRY TABS =====
const companies = [
  {name:'Banco do Brasil',i:'finance'},{name:'Banco Itaú',i:'finance'},
  {name:'Petrobras',i:'energy'},{name:'Claro',i:'telecom'},
  {name:'Bancolombia',i:'finance'},{name:'Anheuser Busch InBev',i:'retail'},
  {name:'AmbevTech',i:'retail'},{name:'Cielo',i:'finance'},
  {name:'Stone Pagamentos',i:'finance'},{name:'Localiza',i:'aviation'},
  {name:'Azul Linhas Aéreas',i:'aviation'},{name:'COMGÁS',i:'energy'},
  {name:'Sicredi',i:'finance'},{name:'Grupo Boticário',i:'retail'},
  {name:'Citrosuco',i:'retail'},{name:'Magazine Luiza',i:'retail'},
  {name:'Banco Davivienda',i:'finance'},{name:'Seguros Monterrey',i:'finance'},
  {name:'Mountain America CU',i:'finance'},{name:'Banco Santander',i:'finance'},
  {name:'Telefónica',i:'telecom'},{name:'LATAM Airlines',i:'aviation'}
];
const sn = {finance:'Financial',telecom:'Telecom',retail:'Retail',energy:'Energy',aviation:'Aviation'};

function renderTabs() {
  const t = document.getElementById('industryTabs');
  if (!t) return;
  t.textContent = '';
  ['all', ...Object.keys(sn)].forEach(s => {
    const b = document.createElement('button');
    b.className = 'tab-b' + (s === 'all' ? ' active' : '');
    b.dataset.s = s;
    b.textContent = s === 'all' ? 'All Sectors' : sn[s];
    t.appendChild(b);
  });
  t.addEventListener('click', e => {
    if (!e.target.classList.contains('tab-b')) return;
    t.querySelectorAll('.tab-b').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderCo(e.target.dataset.s);
  });
}

function renderCo(f = 'all') {
  const g = document.getElementById('companiesGrid');
  if (!g) return;
  const list = f === 'all' ? companies : companies.filter(c => c.i === f);
  g.textContent = '';
  list.forEach(c => {
    const d  = document.createElement('div');
    d.className = 'co-ch';
    d.textContent = c.name;
    const sm = document.createElement('small');
    sm.textContent = sn[c.i];
    d.appendChild(sm);
    g.appendChild(d);
  });
}

// ===== UTILITIES =====
function sanitize(s) {
  return s.replace(/[<>"'`]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','`':'&#x60;'}[c]));
}

function setStatus(el, text, isSuccess) {
  if (!el) return;
  el.textContent = '';
  const span = document.createElement('span');
  span.style.color = isSuccess ? 'var(--gn)' : 'var(--rd)';
  span.textContent = text;
  el.appendChild(span);
}

// ===== DOM INIT =====
document.addEventListener('DOMContentLoaded', function () {

  // Cookie banner: show/hide (GA4 opt-out flag is set by the early inline script)
  try {
    const stored = localStorage.getItem('vbs-cookies');
    if (!stored) {
      if (navigator.globalPrivacyControl) {
        localStorage.setItem('vbs-cookies', JSON.stringify({n:1,a:0,m:0}));
        document.getElementById('gpcIndicator')?.classList.add('vis');
      } else {
        const banner = document.getElementById('cookieBanner');
        if (banner) banner.style.display = 'block';
      }
    } else {
      if (navigator.globalPrivacyControl) {
        document.getElementById('gpcIndicator')?.classList.add('vis');
      }
    }
  } catch (_) {}

  // Cookie banner buttons
  document.getElementById('ckReject')?.addEventListener('click', () => handleCookies('reject'));
  document.getElementById('ckManage')?.addEventListener('click', openCookiePrefs);
  document.getElementById('ckAccept')?.addEventListener('click', () => handleCookies('accept'));

  // Cookie modal buttons
  document.getElementById('ckModalSave')?.addEventListener('click',   () => handleCookies('custom'));
  document.getElementById('ckModalAccept')?.addEventListener('click', () => handleCookies('accept'));

  // Footer manage-cookies link
  document.getElementById('footerCookieLink')?.addEventListener('click', e => {
    e.preventDefault();
    openCookiePrefs();
  });

  // Header CTA
  document.getElementById('navCta')?.addEventListener('click', () => { location.href = '#contact'; });

  // Mobile menu
  const mNav = document.getElementById('mNav');
  document.getElementById('mnTog')?.addEventListener('click',   () => mNav?.classList.add('open'));
  document.getElementById('mnClose')?.addEventListener('click', () => mNav?.classList.remove('open'));
  mNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mNav.classList.remove('open')));

  // Companies / industry tabs
  renderTabs();
  renderCo();

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending...';
      const fd = new FormData(form);
      for (const [k, v] of [...fd.entries()]) {
        if (typeof v === 'string') fd.set(k, sanitize(v));
      }
      const statusEl = document.getElementById('formStatus');
      try {
        await fetch('https://formspree.io/f/xyznznrd', {
          method: 'POST', body: fd,
          headers: {'Accept': 'application/json'}
        });
        setStatus(statusEl, '✓ Sent successfully.', true);
        form.reset();
      } catch (_) {
        setStatus(statusEl, '✗ Error. Please email us directly.', false);
      } finally {
        btn.disabled = false;
        btn.textContent = orig;
      }
    });
  }

  // HUD scan + scramble animation
  const CHARS = '0123456789ABCDEF#$%@&*<>{}|/\\?^~';

  function scramble(el, txt, ms, done) {
    const n = txt.length, total = Math.ceil(ms / 35);
    let frame = 0;
    const t = setInterval(function () {
      frame++;
      const rev = Math.floor((frame / total) * n);
      let s = '';
      for (let i = 0; i < n; i++) {
        s += txt[i] === ' ' ? ' '
           : i < rev        ? txt[i]
           : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = s;
      if (frame >= total) {
        clearInterval(t);
        el.textContent = txt;
        el.classList.remove('scrambling');
        if (done) done();
      }
    }, 35);
    return t;
  }

  document.querySelectorAll('.svc-card').forEach(function (card) {
    const desc = card.querySelector('.svc-cdesc');
    if (!desc) return;
    const orig = desc.textContent;
    let timer = null, st = null;
    card.addEventListener('mouseenter', function () {
      card.classList.add('scanning');
      timer = setTimeout(function () {
        desc.classList.add('scrambling');
        st = scramble(desc, orig, 480, function () { card.classList.add('revealed'); });
      }, 90);
    });
    card.addEventListener('mouseleave', function () {
      card.classList.remove('scanning', 'revealed');
      clearTimeout(timer);
      if (st) clearInterval(st);
      desc.textContent = orig;
      desc.classList.remove('scrambling');
    });
    card.addEventListener('animationend', function (e) {
      if (e.animationName === 'hudScan') card.classList.remove('scanning');
    });
  });
});
