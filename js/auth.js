// ============================================================
// Auth — School Plus (Phase 1 shell)
// Phase 3 will replace stubs with real Supabase Auth calls.
// ============================================================

window.Auth = {
  // Phase 1: reads mock session from localStorage
  getSession() {
    try { return JSON.parse(localStorage.getItem('sp_session')) || null; }
    catch { return null; }
  },
  setSession(data) {
    localStorage.setItem('sp_session', JSON.stringify(data));
  },
  clearSession() {
    localStorage.removeItem('sp_session');
  },
  getUser() {
    return this.getSession();
  },
  getRole() {
    return this.getSession()?.role || null;
  },
  getSchoolId() {
    return this.getSession()?.school_id || null;
  },
  // Phase 1: soft guard — logs warning, does not redirect
  // TODO Phase 3: uncomment redirect after Supabase Auth is wired
  requireAuth(redirectTo = 'login.html') {
    const session = this.getSession();
    if (!session) {
      // window.location.href = redirectTo;
      console.warn('[School Plus] Auth guard: no session. Real redirect enabled in Phase 3.');
    }
    return session;
  },
  requireRole(allowedRoles = [], redirectTo = 'login.html') {
    const session = this.getSession();
    if (!session || (allowedRoles.length && !allowedRoles.includes(session.role))) {
      // window.location.href = redirectTo;
      console.warn('[School Plus] Role guard: role not allowed. Real redirect enabled in Phase 3.');
    }
    return session;
  },
  async login(email, password) {
    // TODO Phase 3: replace with supabaseClient.auth.signInWithPassword
    console.warn('[School Plus] Login: Supabase Auth integration in Phase 3.');
    return { error: { message: 'Supabase Auth not configured yet. See js/config.js.' } };
  },
  logout() {
    this.clearSession();
    window.location.href = 'login.html';
  },
};
