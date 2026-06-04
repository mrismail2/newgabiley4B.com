// Sidebar — School Plus
const SIDEBAR_MENUS = {
  school_admin: [
    { label: 'OVERVIEW', items: [
      { id: 'dashboard',   label: 'Dashboard',   icon: 'layout-dashboard', href: 'dashboard.html' },
    ]},
    { label: 'MANAGEMENT', items: [
      { id: 'students',    label: 'Students',     icon: 'users',            href: 'students.html' },
      { id: 'attendance',  label: 'Attendance',   icon: 'calendar-check',   href: 'attendance.html' },
      { id: 'exams',       label: 'Exams',        icon: 'file-text',        href: 'exams.html' },
      { id: 'payments',    label: 'Payments',     icon: 'credit-card',      href: 'payments.html' },
      { id: 'reports',     label: 'Reports',      icon: 'bar-chart-2',      href: 'reports.html' },
    ]},
    { label: 'SETTINGS', items: [
      { id: 'settings',    label: 'Settings',     icon: 'settings',         href: 'settings.html' },
    ]},
  ],
  teacher: [
    { label: 'OVERVIEW', items: [
      { id: 'dashboard',  label: 'Dashboard',    icon: 'layout-dashboard', href: 'dashboard.html' },
    ]},
    { label: 'TEACHING', items: [
      { id: 'students',   label: 'My Students',  icon: 'users',            href: 'students.html' },
      { id: 'attendance', label: 'Attendance',   icon: 'calendar-check',   href: 'attendance.html' },
      { id: 'exams',      label: 'Exams & Marks',icon: 'file-text',        href: 'exams.html' },
    ]},
  ],
  accountant: [
    { label: 'OVERVIEW', items: [
      { id: 'dashboard',  label: 'Dashboard',    icon: 'layout-dashboard', href: 'dashboard.html' },
    ]},
    { label: 'FINANCE', items: [
      { id: 'payments',   label: 'Payments',     icon: 'credit-card',      href: 'payments.html' },
      { id: 'students',   label: 'Students',     icon: 'users',            href: 'students.html' },
      { id: 'reports',    label: 'Reports',      icon: 'bar-chart-2',      href: 'reports.html' },
    ]},
  ],
  parent: [
    { label: 'MY CHILD', items: [
      { id: 'dashboard',  label: 'Overview',     icon: 'layout-dashboard', href: 'dashboard.html' },
      { id: 'attendance', label: 'Attendance',   icon: 'calendar-check',   href: 'attendance.html' },
      { id: 'exams',      label: 'Results',      icon: 'file-text',        href: 'exams.html' },
      { id: 'payments',   label: 'Payments',     icon: 'credit-card',      href: 'payments.html' },
    ]},
  ],
  super_admin: [
    { label: 'PLATFORM', items: [
      { id: 'super-admin',       label: 'Dashboard',        icon: 'layout-dashboard', href: 'super-admin.html' },
      { id: 'schools',           label: 'Schools',          icon: 'building-2',       href: 'schools.html' },
      { id: 'trial-requests',    label: 'Trial Requests',   icon: 'inbox',            href: 'trial-requests.html' },
      { id: 'subscriptions',     label: 'Subscriptions',    icon: 'credit-card',      href: 'subscriptions.html' },
      { id: 'platform-reports',  label: 'Platform Reports', icon: 'bar-chart-2',      href: 'platform-reports.html' },
    ]},
  ],
};

function renderSidebar({ role = 'school_admin', activePage = 'dashboard', schoolName = 'My School', userName = 'Admin', userRole = 'School Admin' } = {}) {
  const el = document.getElementById('sidebar');
  if (!el) return;
  const menus = SIDEBAR_MENUS[role] || SIDEBAR_MENUS.school_admin;
  const initial = getInitials(userName);
  const sectionsHTML = menus.map(section => `
    <div class="nav-section-label">${section.label}</div>
    ${section.items.map(item => `
      <a href="${item.href}" class="nav-item${activePage === item.id ? ' active' : ''}">
        <i data-lucide="${item.icon}" style="width:17px;height:17px"></i>
        <span>${item.label}</span>
      </a>
    `).join('')}
  `).join('');

  el.innerHTML = `
    <aside class="sidebar" id="appSidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">SP</div>
        <div style="min-width:0">
          <div class="sidebar-brand-name">School Plus</div>
          <div class="sidebar-school-name">${sanitizeHTML(schoolName)}</div>
        </div>
      </div>
      <nav class="sidebar-nav">${sectionsHTML}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${sanitizeHTML(initial)}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${sanitizeHTML(userName)}</div>
            <div class="sidebar-user-role">${sanitizeHTML(userRole)}</div>
          </div>
          <button class="sidebar-logout" id="sidebarLogout" title="Logout">
            <i data-lucide="log-out" style="width:15px;height:15px"></i>
          </button>
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);
  document.getElementById('sidebarLogout')?.addEventListener('click', () => window.Auth?.logout());
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openSidebar() {
  document.getElementById('appSidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('open');
}
function closeSidebar() {
  document.getElementById('appSidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}
