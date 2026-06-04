document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireAuth();
  const session = window.Auth?.getSession() || { role: 'school_admin', school_name: 'My School', full_name: 'Admin' };
  renderSidebar({ role: session.role || 'school_admin', activePage: 'students', schoolName: session.school_name || 'My School', userName: session.full_name || 'Admin', userRole: capitalize(session.role || 'school_admin') });
  renderHeader({ pageTitle: 'Students', schoolName: session.school_name || 'My School' });
  renderStatCards('statsGrid', [
    { label: 'Total Students', value: '—', icon: 'users',         color: 'blue'    },
    { label: 'Active',         value: '—', icon: 'check-circle',  color: 'success' },
    { label: 'Inactive',       value: '—', icon: 'user-x',        color: 'danger'  },
    { label: 'Classes',        value: '—', icon: 'door-open',     color: 'purple'  },
  ]);
  renderTable('studentsTable', {
    columns: [
      { key: 'full_name', label: 'Name', render: (v, r) => `<div style="display:flex;align-items:center;gap:10px"><div class="table-avatar">${sanitizeHTML(getInitials(v))}</div><span>${sanitizeHTML(v)}</span></div>` },
      { key: 'class',     label: 'Class' },
      { key: 'gender',    label: 'Gender' },
      { key: 'status',    label: 'Status', render: v => `<span class="badge badge-${v === 'active' ? 'success' : 'muted'}">${sanitizeHTML(capitalize(v))}</span>` },
    ],
    rows: [],
    actions: [
      { label: 'Edit',   icon: 'pencil',  cls: 't-edit',   fn: 'editStudent' },
      { label: 'Delete', icon: 'trash-2', cls: 't-delete', fn: 'deleteStudent' },
    ],
    emptyMsg: 'No students yet — add your first student',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

function openAddStudentModal() {
  openModal('Add New Student', `
    <div class="modal-form">
      <div class="form-row">
        <div class="form-group"><label class="form-label">First Name *</label><input class="form-input" name="first_name" placeholder="Ahmed" required></div>
        <div class="form-group"><label class="form-label">Last Name *</label><input class="form-input" name="last_name" placeholder="Ali" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Gender</label><select class="form-select" name="gender"><option value="male">Male</option><option value="female">Female</option></select></div>
        <div class="form-group"><label class="form-label">Date of Birth</label><input class="form-input" type="date" name="dob"></div>
      </div>
      <div class="form-group"><label class="form-label">Class</label><select class="form-select" name="class_id"><option value="">Select class...</option></select></div>
      <p class="form-hint" style="margin-top:4px">TODO Phase 2: Save to Supabase with school_id isolation.</p>
    </div>
  `, { confirmLabel: 'Add Student', onConfirm: () => { showToast('Student management available in Phase 2', 'info'); closeModal(); } });
}
function editStudent(id) { showToast('Edit student — coming in Phase 2', 'info'); }
function deleteStudent(id) { showToast('Delete student — coming in Phase 2', 'info'); }
