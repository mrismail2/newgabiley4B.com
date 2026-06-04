document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireRole(['super_admin']);
  renderSidebar({ role: 'super_admin', activePage: 'subscriptions', schoolName: 'Platform', userName: 'Super Admin', userRole: 'Super Admin' });
  renderHeader({ pageTitle: 'Subscriptions', schoolName: 'School Plus Platform' });
  renderStatCards('statsGrid', [
    { label: 'Active Plans',     value: '—', icon: 'check-circle', color: 'success' },
    { label: 'Expiring Soon',    value: '—', icon: 'clock',        color: 'warning' },
    { label: 'Expired',          value: '—', icon: 'x-circle',     color: 'danger'  },
    { label: 'Monthly Revenue',  value: '—', icon: 'credit-card',  color: 'blue'    },
  ]);
  renderTable('subscriptionsTable', {
    columns: [
      { key: 'school',     label: 'School' },
      { key: 'plan',       label: 'Plan', render: v => `<span class="plan-tag ${v}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'start_date', label: 'Start', render: v => formatDate(v) },
      { key: 'end_date',   label: 'Expires', render: v => formatDate(v) },
      { key: 'status',     label: 'Status', render: v => `<span class="badge badge-${v === 'active' ? 'success' : v === 'trial' ? 'warning' : 'danger'}">${sanitizeHTML(capitalize(v))}</span>` },
    ],
    rows: [],
    actions: [
      { label: 'Renew',   icon: 'refresh-cw', cls: 't-edit',   fn: 'renewSub'  },
      { label: 'Cancel',  icon: 'x',          cls: 't-delete', fn: 'cancelSub' },
    ],
    emptyMsg: 'No subscriptions yet',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
function renewSub(id)  { showToast('Subscription renewal — coming in Phase 4', 'info'); }
function cancelSub(id) { showToast('Subscription cancellation — coming in Phase 4', 'info'); }
