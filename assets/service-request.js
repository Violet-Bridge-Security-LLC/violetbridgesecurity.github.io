// Record load time for bot timing check
const FORM_INIT_TIME = Date.now();

// ===== UTILITIES =====
function sanitize(s) {
  return String(s).replace(/[<>"'`]/g, c => ({
    '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#x27;', '`':'&#x60;'
  }[c]));
}

function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}

function setSubmitError() {
  const el = document.getElementById('srStatus');
  if (!el) return;
  el.textContent = '';
  const span = document.createElement('span');
  span.style.color = 'var(--rd)';
  span.textContent = '✗ Submission failed. Please email us at ';
  const link = document.createElement('a');
  link.href = 'mailto:info@violetbridgesecurity.com';
  link.textContent = 'info@violetbridgesecurity.com';
  span.appendChild(link);
  el.appendChild(span);
}

// ===== SERVICE SCOPING =====
const SCOPING_SERVICES = new Set([
  'Penetration Testing', 'Social Engineering', 'Application Security',
  'GRC / Compliance', 'Consulting / vCISO'
]);

const SERVICE_PARAM_MAP = {
  'Penetration Testing': 'pentest',
  'Application Security': 'appsec',
  'Social Engineering': 'social',
  'GRC / Compliance': 'grc',
  'Consulting / vCISO': 'consulting'
};

function needsQuestionnaire() {
  return [...document.querySelectorAll('input[name="services"]:checked')]
    .some(cb => SCOPING_SERVICES.has(cb.value));
}

// Store context in sessionStorage — keeps PII out of the URL
function storeQuestionnaireContext() {
  const svcs = [...document.querySelectorAll('input[name="services"]:checked')].map(c => c.value);
  const keys = svcs.filter(s => SERVICE_PARAM_MAP[s]).map(s => SERVICE_PARAM_MAP[s]);
  try {
    sessionStorage.setItem('vbs_sr_context', JSON.stringify({
      name: (
        document.getElementById('sr_fname').value.trim() + ' ' +
        document.getElementById('sr_lname').value.trim()
      ).trim(),
      company:  document.getElementById('sr_company').value.trim(),
      services: keys
    }));
  } catch (_) {}
}

function updatePentestNotice() {
  const notice = document.getElementById('pentestNotice');
  if (notice) notice.style.display = needsQuestionnaire() ? 'flex' : 'none';
}

// ===== STEP NAVIGATION =====
function goToStep(n) {
  if (n === 2 && !validateStep1()) return;
  if (n === 3 && !validateStep2()) return;
  if (n === 3) populateSummary();
  [1, 2, 3].forEach(i => {
    document.getElementById('step' + i).style.display = i === n ? 'block' : 'none';
    const ind = document.getElementById('step' + i + '-ind');
    if (ind) ind.className = 'step' + (i === n ? ' active' : i < n ? ' done' : '');
    if (i > 1) {
      const line = document.getElementById('line' + (i - 1));
      if (line) line.className = 'step-line' + (i <= n ? ' done' : '');
    }
  });
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ===== VALIDATION =====
function validateStep1() {
  let ok = true;
  const checks = [
    ['sr_fname',   'err_fname',   v => v.trim().length > 0],
    ['sr_lname',   'err_lname',   v => v.trim().length > 0],
    // Fixed regex: allows + and other valid local-part characters
    ['sr_email',   'err_email',   v => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(v)],
    ['sr_title',   'err_title',   v => v.trim().length > 0],
    ['sr_company', 'err_company', v => v.trim().length > 0],
  ];
  checks.forEach(([fid, eid, fn]) => {
    const pass = fn(document.getElementById(fid).value);
    showErr(eid, !pass);
    if (!pass) ok = false;
  });
  return ok;
}

function validateStep2() {
  const checked = [...document.querySelectorAll('input[name="services"]:checked')].length > 0;
  showErr('err_services', !checked);
  if (!checked) return false;
  const desc = document.getElementById('sr_desc').value.trim();
  showErr('err_desc', !desc);
  return !!desc;
}

// ===== URGENCY & BUDGET =====
function setUrgency(btn) {
  document.querySelectorAll('.urg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sr_urgency').value = btn.dataset.v;
}

function setBudget(btn) {
  document.querySelectorAll('.budget-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sr_budget').value = btn.dataset.v;
}

// ===== SUMMARY =====
function populateSummary() {
  const g = id => document.getElementById(id)?.value || '';
  document.getElementById('sum_contact').textContent  = sanitize(g('sr_fname') + ' ' + g('sr_lname'));
  document.getElementById('sum_company').textContent  = sanitize(g('sr_company'));
  document.getElementById('sum_email').textContent    = sanitize(g('sr_email'));
  const svcs = [...document.querySelectorAll('input[name="services"]:checked')].map(c => c.value).join(', ');
  document.getElementById('sum_services').textContent = sanitize(svcs || '—');
  document.getElementById('sum_urgency').textContent  = sanitize(g('sr_urgency'));
  document.getElementById('sum_budget').textContent   = sanitize(g('sr_budget') || 'Not specified');
  document.getElementById('sum_timeline').textContent = sanitize(g('sr_timeline') || 'Not specified');
  updatePentestNotice();
}

// ===== DOM INIT =====
document.addEventListener('DOMContentLoaded', function () {

  // Service checkbox visual state + pentest notice
  document.querySelectorAll('.svc-opt input').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.svc-opt').classList.toggle('checked', cb.checked);
      updatePentestNotice();
    });
  });

  // Step navigation — data-goto attribute drives which step to go to
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.goto)));
  });

  // Urgency buttons
  document.querySelectorAll('.urg-btn').forEach(btn => {
    btn.addEventListener('click', () => setUrgency(btn));
  });

  // Budget buttons
  document.querySelectorAll('.budget-opt').forEach(btn => {
    btn.addEventListener('click', () => setBudget(btn));
  });

  // Form submit
  const form = document.getElementById('srForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot: silently discard if the hidden field was filled by a bot
    if (form.querySelector('input[name="organization_website"]')?.value) return;

    // Timing check: bots submit in milliseconds; humans need at least 3 seconds
    if (Date.now() - FORM_INIT_TIME < 3000) return;

    const consent = document.getElementById('sr_consent').checked;
    showErr('err_consent', !consent);
    if (!consent) return;

    const btn  = document.getElementById('srSubmitBtn');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const fd = new FormData(form);
    fd.delete('organization_website');
    const svcs = [...document.querySelectorAll('input[name="services"]:checked')].map(c => c.value);
    fd.set('services_requested', svcs.join(', '));

    try {
      const res = await fetch('https://formspree.io/f/xyznznrd', {
        method: 'POST', body: fd,
        headers: {'Accept': 'application/json'}
      });
      if (!res.ok) throw new Error('non-ok');

      form.style.display = 'none';

      if (needsQuestionnaire()) {
        storeQuestionnaireContext();
        // URL carries only the non-PII services key; name/company travel via sessionStorage
        document.getElementById('questionnaireLink').href = './questionnaire.html';
        document.getElementById('successScreenPentest').style.display = 'block';
      } else {
        document.getElementById('successScreen').style.display = 'block';
      }
      window.scrollTo({top: 0, behavior: 'smooth'});

    } catch (_) {
      setSubmitError();
      btn.disabled = false;
      btn.textContent = orig;
    }
  });
});
