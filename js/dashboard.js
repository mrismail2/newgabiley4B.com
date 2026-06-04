document.addEventListener('DOMContentLoaded', () => {
  window.Auth?.requireAuth();
  const session = window.Auth?.getSession() || { role: 'school_admin', full_name: 'Demo Admin', school_name: 'Demo School' };

  renderSidebar({ role: session.role || 'school_admin', activePage: 'dashboard', schoolName: session.school_name || 'My School', userName: session.full_name || 'Admin', userRole: capitalize(session.role || 'school_admin') });
  renderHeader({ pageTitle: 'Dashboard', schoolName: session.school_name || 'My School' });

  const cards = {
    school_admin: [
      { label: 'Total Students',    value: '—', icon: 'users',          color: 'blue',    change: 'Connect Supabase', dir: 'neutral' },
      { label: 'Total Classes',     value: '—', icon: 'door-open',     color: 'purple',  change: 'Connect Supabase', dir: 'neutral' },
      { label: 'Monthly Payments',  value: '—', icon: 'credit-card',   color: 'success', change: 'Connect Supabase', dir: 'neutral' },
      { label: "Today's Attendance",value: '—', icon: 'calendar-check',color: 'orange',  change: 'Connect Supabase', dir: 'neutral' },
    ],
    teacher: [
      { label: 'My Students',       value: '—', icon: 'users',         color: 'blue'    },
      { label: 'Classes Today',     value: '—', icon: 'book-open',     color: 'purple'  },
      { label: 'Pending Marks',     value: '—', icon: 'file-text',     color: 'orange'  },
      { label: 'Attendance Rate',   value: '—', icon: 'calendar-check',color: 'success' },
    ],
    accountant: [
      { label: 'Paid This Month',   value: '—', icon: 'check-circle',  color: 'success' },
      { label: 'Unpaid Students',   value: '—', icon: 'alert-circle',  color: 'danger'  },
      { label: 'Monthly Revenue',   value: '—', icon: 'credit-card',   color: 'blue'    },
      { label: 'Pending Payments',  value: '—', icon: 'clock',         color: 'orange'  },
    ],
    parent: [
      { label: 'Attendance Rate',   value: '—', icon: 'calendar-check',color: 'success' },
      { label: 'Last Exam Score',   value: '—', icon: 'file-text',     color: 'blue'    },
      { label: 'Payment Status',    value: '—', icon: 'credit-card',   color: 'purple'  },
      { label: 'School Notices',    value: '—', icon: 'bell',          color: 'orange'  },
    ],
  };
  renderStatCards('statsGrid', cards[session.role] || cards.school_admin);

  // TODO Phase 2: load real data from Supabase
  renderTable('recentTable', {
    columns: [
      { key: 'name',   label: 'Student' },
      { key: 'class',  label: 'Class' },
      { key: 'status', label: 'Status', render: v => `<span class="badge badge-${v === 'Active' ? 'success' : 'muted'}">${sanitizeHTML(v)}</span>` },
      { key: 'date',   label: 'Enrolled', render: v => formatDate(v) },
    ],
    rows: [],
    emptyMsg: 'No students yet — connect Supabase to load data',
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
});
