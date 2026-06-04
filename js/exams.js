document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireAuth();
  const session = window.Auth?.getSession() || { role: 'school_admin', school_name: 'My School', full_name: 'Admin' };
  renderSidebar({ role: session.role || 'school_admin', activePage: 'exams', schoolName: session.school_name || 'My School', userName: session.full_name || 'Admin', userRole: capitalize(session.role || 'school_admin') });
  renderHeader({ pageTitle: 'Exams', schoolName: session.school_name || 'My School' });
  renderStatCards('statsGrid', [
    { label: 'Total Exams',    value: '—', icon: 'file-text',    color: 'blue'    },
    { label: 'Upcoming',       value: '—', icon: 'calendar',     color: 'warning' },
    { label: 'Completed',      value: '—', icon: 'check-circle', color: 'success' },
    { label: 'Average Score',  value: '—', icon: 'bar-chart-2',  color: 'purple'  },
  ]);
  renderTable('examsTable', {
    columns: [
      { key: 'name',      label: 'Exam Name' },
      { key: 'subject',   label: 'Subject' },
      { key: 'class',     label: 'Class' },
      { key: 'date',      label: 'Date', render: v => formatDate(v) },
      { key: 'max_marks', label: 'Max Marks' },
    ],
    rows: [],
    actions: [
      { label: 'Edit',   icon: 'pencil',  cls: 't-edit',   fn: 'editExam' },
      { label: 'Marks',  icon: 'list',    cls: 't-view',   fn: 'viewMarks' },
    ],
    emptyMsg: 'No exams yet — create your first exam',
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
function editExam(id) { showToast('Exam editing — coming in Phase 8', 'info'); }
function viewMarks(id) { showToast('Marks entry — coming in Phase 8', 'info'); }
