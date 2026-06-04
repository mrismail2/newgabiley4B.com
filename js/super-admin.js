document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireRole(['super_admin']);
  const session = window.Auth?.getSession() || { role: 'super_admin', full_name: 'Super Admin', school_name: 'Platform' };
  renderSidebar({ role: 'super_admin', activePage: 'super-admin', schoolName: 'Platform', userName: session.full_name || 'Super Admin', userRole: 'Super Admin' });
  renderHeader({ pageTitle: 'Platform Dashboard', schoolName: 'School Plus Platform' });
  renderStatCards('statsGrid', [
    { label: 'Total Schools',     value: '—', icon: 'building-2',   color: 'blue',    change: 'Connect Supabase', dir: 'neutral' },
    { label: 'Active Schools',    value: '—', icon: 'check-circle', color: 'success', change: 'Connect Supabase', dir: 'neutral' },
    { label: 'Pending Requests',  value: '—', icon: 'inbox',        color: 'warning', change: 'Connect Supabase', dir: 'neutral' },
    { label: 'Platform Revenue',  value: '—', icon: 'credit-card',  color: 'purple',  change: 'Connect Supabase', dir: 'neutral' },
  ]);
  renderTable('recentRequestsTable', {
    columns: [
      { key: 'school_name',  label: 'School' },
      { key: 'plan',         label: 'Plan', render: v => `<span class="plan-tag ${v}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'contact_name', label: 'Contact' },
      { key: 'email',        label: 'Email' },
      { key: 'status',       label: 'Status', render: v => `<span class="badge badge-${v === 'pending' ? 'warning' : v === 'approved' ? 'success' : 'danger'}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'created_at',   label: 'Submitted', render: v => timeAgo(v) },
    ],
    rows: [],
    actions: [
      { label: 'Approve', icon: 'check',   cls: 't-edit',   fn: 'approveRequest' },
      { label: 'Reject',  icon: 'x',       cls: 't-delete', fn: 'rejectRequest' },
    ],
    emptyMsg: 'No trial requests yet',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
function approveRequest(id) { showToast('Approval flow coming in Phase 4', 'info'); }
function rejectRequest(id)  { showToast('Rejection flow coming in Phase 4', 'info'); }
