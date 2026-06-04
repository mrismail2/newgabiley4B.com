// Stat Cards — School Plus
function renderStatCards(containerId, cards = []) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = 'stats-grid';
  el.innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-icon si-${c.color || 'blue'}">
        <i data-lucide="${c.icon}" style="width:22px;height:22px"></i>
      </div>
      <div class="stat-info">
        <div class="stat-label">${sanitizeHTML(c.label)}</div>
        <div class="stat-value">${sanitizeHTML(String(c.value))}</div>
        ${c.change ? `<div class="stat-change ${c.dir || 'neutral'}">
          <i data-lucide="${c.dir === 'up' ? 'trending-up' : c.dir === 'down' ? 'trending-down' : 'minus'}" style="width:12px;height:12px"></i>
          ${sanitizeHTML(c.change)}
        </div>` : ''}
      </div>
    </div>
  `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
