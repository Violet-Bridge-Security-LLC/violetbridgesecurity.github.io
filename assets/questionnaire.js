const SAVE_KEY = 'vbs-questionnaire-v1';
let saveTimer;

const ACTIVITY_MAP = {
  pentest:    ['A','B','C'],
  appsec:     ['A','D','E','F','H'],
  social:     ['A','G'],
  grc:        ['I','J'],
  consulting: ['A','I']
};

function sanitize(s) {
  return String(s).replace(/[<>"'`]/g, c => ({
    '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#x27;', '`':'&#x60;'
  }[c]));
}

function getIncludedActivities(rawServices) {
  if (!rawServices) return new Set(['A','B','C','D','E','F','G','H','I','J']);
  const keys = rawServices.split(',').map(s => s.trim().toLowerCase());
  const included = new Set();
  keys.forEach(k => { if (ACTIVITY_MAP[k]) ACTIVITY_MAP[k].forEach(a => included.add(a)); });
  return included;
}

function saveProgress() {
  const data = {};
  document.querySelectorAll('#qForm [name]').forEach(el => {
    if (el.type !== 'submit' && el.name !== 'organization_website') {
      data[el.name] = el.value;
    }
  });
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (_) {}
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.keys(data).forEach(name => {
      const el = document.querySelector('#qForm [name="' + name + '"]');
      if (el && el.tagName === 'TEXTAREA') {
        el.value = data[name] || '';
      } else if (el && el.type === 'email' && !el.value) {
        el.value = data[name] || '';
      } else if (el && el.type === 'text' && el.name !== 'contact_name' && el.name !== 'company_name' && !el.value) {
        // contact_name and company_name come from service request context, not localStorage
        el.value = data[name] || '';
      }
    });
    updateAllCounters();
  } catch (_) {}
}

function clearSaved() {
  if (!confirm('Clear all saved data? This cannot be undone.')) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  document.querySelectorAll('#qForm textarea').forEach(t => { t.value = ''; });
  updateAllCounters();
}

function updateCounter(textarea) {
  const wrap = textarea.closest('.question');
  if (!wrap) return;
  const cc = wrap.querySelector('.cc');
  if (cc) cc.textContent = textarea.value.length;
}

function updateAllCounters() {
  document.querySelectorAll('#qForm textarea').forEach(updateCounter);
}

function setSubmitError() {
  const el = document.getElementById('qStatus');
  if (!el) return;
  el.textContent = '';
  const span = document.createElement('span');
  span.style.color = 'var(--rd)';
  span.textContent = '✗ Submission failed. Please email your responses to ';
  const link = document.createElement('a');
  link.href = 'mailto:info@violetbridgesecurity.com';
  link.style.color = 'var(--ac2)';
  link.textContent = 'info@violetbridgesecurity.com';
  span.appendChild(link);
  span.appendChild(document.createTextNode(' or use the PDF export.'));
  el.appendChild(span);
}

document.addEventListener('DOMContentLoaded', function () {

  // Read inter-page context: sessionStorage first (PII-safe), URL params as fallback
  // URL params remain supported for direct links and bookmarks (services key only, no PII)
  let ctx = null;
  try {
    ctx = JSON.parse(sessionStorage.getItem('vbs_sr_context') || 'null');
    if (ctx) sessionStorage.removeItem('vbs_sr_context'); // consume once
  } catch (_) {}

  const params       = new URLSearchParams(window.location.search);
  const rawServices  = (ctx && ctx.services ? ctx.services.join(',') : '') || params.get('services') || '';
  const paramName    = (ctx && ctx.name)    || '';
  const paramCompany = (ctx && ctx.company) || '';

  const included = getIncludedActivities(rawServices);

  // Pre-fill contact fields from service request context
  if (paramName)    { const el = document.getElementById('q_name');    if (el) el.value = paramName;    }
  if (paramCompany) { const el = document.getElementById('q_company'); if (el) el.value = paramCompany; }
  if (rawServices || paramName || paramCompany) {
    document.getElementById('prefillNotice')?.classList.add('show');
  }

  // Pre-select activity table rows based on requested services
  document.querySelectorAll('.act-sel').forEach(sel => {
    if (rawServices) sel.value = included.has(sel.dataset.activity) ? 'Y' : 'N';
  });

  // Show only activity sections relevant to the requested services
  document.querySelectorAll('.q-section[data-activity]').forEach(sec => {
    if (rawServices && !included.has(sec.dataset.activity)) sec.style.display = 'none';
  });

  loadSaved();

  // Auto-save + char counters on a single input listener
  document.getElementById('qForm')?.addEventListener('input', e => {
    if (e.target.tagName === 'TEXTAREA') updateCounter(e.target);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveProgress, 1200);
  });

  // Toolbar buttons
  document.getElementById('clearSavedBtn')?.addEventListener('click', clearSaved);
  document.getElementById('printBtn')?.addEventListener('click', () => window.print());

  // Form submit
  const form = document.getElementById('qForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (this.querySelector('[name="organization_website"]').value) return;
    const btn  = document.getElementById('qSubmitBtn');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting...';
    const fd = new FormData(this);
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') fd.set(k, sanitize(v));
    }
    const actSummary = [];
    document.querySelectorAll('.act-sel').forEach(sel => {
      if (sel.value === 'Y') actSummary.push(sel.dataset.activity);
    });
    fd.set('activities_included', actSummary.join(', ') || 'All');
    try {
      const res = await fetch('https://formspree.io/f/mkgqqeqo', {
        method: 'POST', body: fd,
        headers: {'Accept': 'application/json'}
      });
      if (!res.ok) throw new Error('non-ok');
      try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
      form.style.display = 'none';
      document.getElementById('successScreen').style.display = 'block';
      window.scrollTo({top: 0, behavior: 'smooth'});
    } catch (_) {
      setSubmitError();
      btn.disabled = false;
      btn.textContent = orig;
    }
  });
});
