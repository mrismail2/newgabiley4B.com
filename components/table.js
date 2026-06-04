// Data Table — School Plus
function renderTable(containerId, { columns = [], rows = [], actions = [], emptyMsg = 'No records found' } = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!rows.length) {
    el.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox" style="width:48px;height:48px;opacity:0.3"></i>
        <h3>${sanitizeHTML(emptyMsg)}</h3>
        <p style="font-size:13px;color:var(--muted);margin-top:6px">No data to display yet.</p>
      </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }
  const hasActions = actions.length > 0;
  el.innerHTML = `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr>
          ${columns.map(c => `<th>${sanitizeHTML(c.label)}</th>`).join('')}
          ${hasActions ? '<th>Actions</th>' : ''}
        </tr></thead>
        <tbody>
          ${rows.map(row => `<tr>
            ${columns.map(c => {
              const raw = row[c.key] ?? '';
              const val = c.render ? c.render(raw, row) : sanitizeHTML(String(raw));
              return `<td>${val}</td>`;
            }).join('')}
            ${hasActions ? `<td><div class="t-actions">${
              actions.map(a => `<button class="${a.cls || 't-view'}" title="${sanitizeHTML(a.label)}" onclick="${a.fn}('${sanitizeHTML(String(row.id))}')">
                <i data-lucide="${a.icon}" style="width:13px;height:13px"></i>
              </button>`).join('')
            }</div></td>` : ''}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
