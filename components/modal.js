// Modal — School Plus
function openModal(title, bodyHTML, { confirmLabel = 'Save', onConfirm = null } = {}) {
  let overlay = document.getElementById('globalModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'globalModal';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${sanitizeHTML(title)}</h3>
        <button class="modal-close" id="modalCloseX">
          <i data-lucide="x" style="width:16px;height:16px"></i>
        </button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      ${onConfirm ? `
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" id="modalCancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="modalConfirm">${sanitizeHTML(confirmLabel)}</button>
      </div>` : ''}
    </div>
  `;
  requestAnimationFrame(() => overlay.classList.add('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); }, { once: false });
  document.getElementById('modalCloseX')?.addEventListener('click', closeModal);
  document.getElementById('modalCancel')?.addEventListener('click', closeModal);
  document.getElementById('modalConfirm')?.addEventListener('click', () => { if (onConfirm) onConfirm(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); } });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal() {
  const overlay = document.getElementById('globalModal');
  if (overlay) overlay.classList.remove('open');
}
