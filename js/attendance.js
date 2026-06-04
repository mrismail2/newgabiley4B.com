document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireAuth();
  const session = window.Auth?.getSession() || { role: 'school_admin', school_name: 'My School', full_name: 'Admin' };
  renderSidebar({ role: session.role || 'school_admin', activePage: 'attendance', schoolName: session.school_name || 'My School', userName: session.full_name || 'Admin', userRole: capitalize(session.role || 'school_admin') });
  renderHeader({ pageTitle: 'Attendance', schoolName: session.school_name || 'My School' });
  renderStatCards('statsGrid', [
    { label: 'Present Today',    value: '—', icon: 'check-circle',  color: 'success' },
    { label: 'Absent Today',     value: '—', icon: 'x-circle',      color: 'danger'  },
    { label: 'Late Today',       value: '—', icon: 'clock',         color: 'warning' },
    { label: 'Attendance Rate',  value: '—', icon: 'percent',       color: 'blue'    },
  ]);
  renderTable('attendanceTable', {
    columns: [
      { key: 'student', label: 'Student' },
      { key: 'class',   label: 'Class' },
      { key: 'date',    label: 'Date', render: v => formatDate(v) },
      { key: 'status',  label: 'Status', render: v => `<span class="badge badge-${v === 'present' ? 'success' : v === 'late' ? 'warning' : 'danger'}">${sanitizeHTML(capitalize(v))}</span>` },
    ],
    rows: [],
    emptyMsg: 'No attendance records — mark attendance to get started',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
