document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireAuth();
  const session = window.Auth?.getSession() || { role: 'school_admin', school_name: 'My School', full_name: 'Admin' };
  renderSidebar({ role: session.role || 'school_admin', activePage: 'reports', schoolName: session.school_name || 'My School', userName: session.full_name || 'Admin', userRole: capitalize(session.role || 'school_admin') });
  renderHeader({ pageTitle: 'Reports', schoolName: session.school_name || 'My School' });
  document.getElementById('generateReportBtn')?.addEventListener('click', () => {
    showToast('Report generation coming in Phase 9', 'info');
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
