document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireRole(['super_admin']);
  renderSidebar({ role: 'super_admin', activePage: 'schools', schoolName: 'Platform', userName: 'Super Admin', userRole: 'Super Admin' });
  renderHeader({ pageTitle: 'Schools', schoolName: 'School Plus Platform' });
  renderStatCards('statsGrid', [
    { label: 'Total Schools',    value: '—', icon: 'building-2',   color: 'blue'    },
    { label: 'Active',           value: '—', icon: 'check-circle', color: 'success' },
    { label: 'In Trial',         value: '—', icon: 'clock',        color: 'warning' },
    { label: 'Suspended',        value: '—', icon: 'alert-circle', color: 'danger'  },
  ]);
  renderTable('schoolsTable', {
    columns: [
      { key: 'name',       label: 'School Name' },
      { key: 'type',       label: 'Type' },
      { key: 'plan',       label: 'Plan', render: v => `<span class="plan-tag ${v}">${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'status',     label: 'Status', render: v => `<span class="school-status ${v}"><span class="sd"></span>${sanitizeHTML(capitalize(v))}</span>` },
      { key: 'trial_end',  label: 'Trial Ends', render: v => formatDate(v) },
    ],
    rows: [],
    actions: [
      { label: 'Activate',  icon: 'check',      cls: 't-edit',   fn: 'activateSchool' },
      { label: 'Suspend',   icon: 'pause',       cls: 't-view',   fn: 'suspendSchool'  },
      { label: 'Delete',    icon: 'trash-2',     cls: 't-delete', fn: 'deleteSchool'   },
    ],
    emptyMsg: 'No schools yet — approve a trial request to create one',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
function activateSchool(id) { showToast('School activation — coming in Phase 4', 'info'); }
function suspendSchool(id)  { showToast('School suspension — coming in Phase 4', 'info'); }
function deleteSchool(id)   { showToast('School deletion — coming in Phase 4', 'info'); }
