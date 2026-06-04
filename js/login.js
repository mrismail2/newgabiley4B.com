document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  // Toggle password visibility
  document.getElementById('togglePassword')?.addEventListener('click', () => {
    const inp = document.getElementById('passwordInput');
    const ico = document.getElementById('togglePassword');
    if (!inp) return;
    inp.type = inp.type === 'password' ? 'text' : 'password';
    ico.innerHTML = inp.type === 'password'
      ? '<i data-lucide="eye" style="width:16px;height:16px"></i>'
      : '<i data-lucide="eye-off" style="width:16px;height:16px"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const msg = document.getElementById('loginMsg');

  const email = form.email?.value?.trim();
  const password = form.password?.value;

  if (!email || !password) {
    if (msg) { msg.className = 'alert alert-error'; msg.textContent = 'Please enter your email and password.'; }
    return;
  }

  showLoading(btn, 'Signing in...');
  if (msg) msg.className = 'hidden';

  try {
    // TODO Phase 3: Real Supabase Auth login
    // const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    // if (error) throw error;
    // const profile = await fetchProfile(data.user.id);
    // Auth.setSession(profile);
    // redirectByRole(profile.role);

    if (msg) { msg.className = 'alert alert-error'; msg.textContent = 'Supabase Auth not configured yet. Complete js/config.js setup first.'; }
  } catch (err) {
    if (msg) { msg.className = 'alert alert-error'; msg.textContent = err.message || 'Login failed. Please try again.'; }
  } finally {
    hideLoading(btn);
  }
}

function redirectByRole(role) {
  const map = { super_admin: 'super-admin.html', school_admin: 'dashboard.html', teacher: 'dashboard.html', accountant: 'dashboard.html', parent: 'dashboard.html' };
  window.location.href = map[role] || 'dashboard.html';
}
