// School Plus — Utility Functions

function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return String(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', ...opts });
}

function formatCurrency(amount, currency = 'USD') {
  if (amount == null || amount === '') return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatNumber(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US').format(n);
}

function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}

function sanitizeHTML(str) {
  const d = document.createElement('div');
  d.textContent = String(str ?? '');
  return d.innerHTML;
}

function showLoading(btn, label = 'Loading...') {
  if (!btn) return;
  btn.disabled = true;
  btn._orig = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> ${label}`;
}

function hideLoading(btn) {
  if (!btn) return;
  btn.disabled = false;
  if (btn._orig != null) { btn.innerHTML = btn._orig; btn._orig = null; }
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}
