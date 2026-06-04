document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireRole(['super_admin']);
  renderSidebar({ role: 'super_admin', activePage: 'trial-requests', schoolName: 'Platform', userName: 'Super Admin', userRole: 'Super Admin' });
  renderHeader({ pageTitle: 'Trial Requests', schoolName: 'School Plus Platform' });
  renderStatCards('statsGrid', [
    { label: 'Total Requests',   value: '—', icon: 'inbox',        color: 'blue'    },
    { label: 'Pending',          value: '—', icon: 'clock',        color: 'warning' },
    { label: 'Approved',         value: '—', icon: 'check-circle', color: 'success' },
    { label: 'Rejected',         value: '—', icon: 'x-circle',     color: 'danger'  },
  ]);
  renderTable('requestsTable', {
    columns: [
      { key: 'school_name',   label: 'School Name' },
      { key: 'school_type',   label: 'Type' },
      { key: 'contact_name',  label: 'Contact' },
      { key: 'email',         label: 'Email' },
      { key: 'plan',          label: 'Plan', render: v => `<span class="plan-tag ${v}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'status',        label: 'Status', render: v => `<span class="badge badge-${v === 'pending' ? 'warning' : v === 'approved' ? 'success' : 'danger'}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'created_at',    label: 'Date', render: v => formatDate(v) },
    ],
    rows: [],
    actions: [
      { label: 'Approve', icon: 'check',   cls: 't-edit',   fn: 'approveRequest' },
      { label: 'Reject',  icon: 'x',       cls: 't-delete', fn: 'rejectRequest'  },
    ],
    emptyMsg: 'No trial requests yet',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
function approveRequest(id) { showToast('Approval flow — coming in Phase 4', 'info'); }
function rejectRequest(id)  { showToast('Rejection flow — coming in Phase 4', 'info'); }
