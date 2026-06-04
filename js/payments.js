document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireAuth();
  const session = window.Auth?.getSession() || { role: 'school_admin', school_name: 'My School', full_name: 'Admin' };
  renderSidebar({ role: session.role || 'school_admin', activePage: 'payments', schoolName: session.school_name || 'My School', userName: session.full_name || 'Admin', userRole: capitalize(session.role || 'school_admin') });
  renderHeader({ pageTitle: 'Payments', schoolName: session.school_name || 'My School' });
  renderStatCards('statsGrid', [
    { label: 'Total Collected',  value: '—', icon: 'credit-card',   color: 'success' },
    { label: 'Pending',          value: '—', icon: 'clock',         color: 'warning' },
    { label: 'Overdue',          value: '—', icon: 'alert-circle',  color: 'danger'  },
    { label: 'This Month',       value: '—', icon: 'calendar',      color: 'blue'    },
  ]);
  renderTable('paymentsTable', {
    columns: [
      { key: 'student', label: 'Student' },
      { key: 'amount',  label: 'Amount',  render: v => formatCurrency(v) },
      { key: 'month',   label: 'Month' },
      { key: 'status',  label: 'Status', render: v => `<span class="badge badge-${v === 'paid' ? 'success' : v === 'partial' ? 'warning' : 'danger'}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'paid_date', label: 'Paid Date', render: v => formatDate(v) },
    ],
    rows: [],
    actions: [
      { label: 'Edit',   icon: 'pencil',  cls: 't-edit',   fn: 'editPayment' },
      { label: 'View',   icon: 'eye',     cls: 't-view',   fn: 'viewPayment' },
    ],
    emptyMsg: 'No payments recorded yet',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
function editPayment(id) { showToast('Payment editing — coming in Phase 6', 'info'); }
function viewPayment(id) { showToast('Payment details — coming in Phase 6', 'info'); }
