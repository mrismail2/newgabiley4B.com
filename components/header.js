// Header — School Plus
function renderHeader({ pageTitle = 'Dashboard', schoolName = 'School Plus' } = {}) {
  const el = document.getElementById('header');
  if (!el) return;
  el.innerHTML = `
    <header class="app-header">
      <div class="header-left">
        <button class="header-mobile-toggle" id="mobileToggle" style="display:none">
          <i data-lucide="menu" style="width:20px;height:20px"></i>
        </button>
        <h1 class="header-page-title">${sanitizeHTML(pageTitle)}</h1>
      </div>
      <div class="header-right">
        <div class="header-school-tag">
          <i data-lucide="building-2" style="width:13px;height:13px"></i>
          ${sanitizeHTML(schoolName)}
        </div>
        <button class="header-notif-btn" title="Notifications">
          <i data-lucide="bell" style="width:17px;height:17px"></i>
          <span class="notif-dot"></span>
        </button>
      </div>
    </header>
  `;
  const toggle = document.getElementById('mobileToggle');
  if (toggle) {
    toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    toggle.addEventListener('click', openSidebar);
    window.addEventListener('resize', () => {
      toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    });
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
