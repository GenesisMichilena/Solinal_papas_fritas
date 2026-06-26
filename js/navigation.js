// NAVEGACIÓN Y RESTRICTIVIDAD DE VISTAS POR ROL (G07 Scenario 1 & 2)
window.goPage = function(page) {
  // Impedir acceso si es Lector a páginas restringidas
  if (window.state.activeRole === 'Lector' && ['edit', 'templates', 'audit', 'config'].includes(page)) {
    showToast('Acceso denegado: El rol de Lector no tiene permisos para esta vista.', 'err');
    logAuditAction(`Acceso denegado a la vista de ${page} por falta de permisos.`);
    return;
  }

  window.pages.forEach(p => {
    const el = document.getElementById('pg-' + p);
    if (el) el.classList.remove('on');
  });

  const targetEl = document.getElementById('pg-' + page);
  if (targetEl) targetEl.classList.add('on');

  document.querySelectorAll('#sidebar .ni').forEach(el => {
    el.classList.toggle('on', el.dataset.page === page);
  });
};

// CAMBIO DE ROL (G07 Scenario 3)
window.cycleRole = function() {
  if (window.state.twoFactorEnabled) {
    // Si 2FA está activo, mostramos modal de confirmación antes de cambiar (G10 Scenario 2)
    openModal('twoFactorModal');
    document.getElementById('two-factor-pin').value = '';
    document.getElementById('two-factor-error-msg').textContent = '';
    return;
  }
  window.executeRoleChange();
};

window.executeRoleChange = function() {
  window.state.roleIndex = (window.state.roleIndex + 1) % window.state.users.length;
  const user = window.state.users[window.state.roleIndex];
  window.state.activeRole = user.role;
  window.state.activeUser = user.name;

  document.getElementById('uName').textContent = user.name;
  document.getElementById('uAv').textContent = user.short;
  document.getElementById('uRole').textContent = '· ' + user.role;

  showToast(`Rol cambiado a ${user.role} (${user.name})`, 'ok');
  logAuditAction(`Cambió rol de usuario a: ${user.role}`);

  // Reactividad del Layout
  window.applyRoleRestrictiveness();
  if (typeof rebuildDashboard === 'function') rebuildDashboard();
  if (typeof renderDocumentList === 'function') renderDocumentList();
  if (typeof loadDocumentToEditor === 'function') loadDocumentToEditor(window.state.activeDocCode);
};

window.applyRoleRestrictiveness = function() {
  const warningBanner = document.getElementById('lector-warning-banner');

  if (window.state.activeRole === 'Lector') {
    warningBanner.style.display = 'flex';
    // Ocultar del sidebar las páginas que no puede ver
    document.getElementById('sb-edit').style.display = 'none';
    document.getElementById('sb-templates').style.display = 'none';
    document.getElementById('sb-audit').style.display = 'none';
    document.getElementById('sb-config').style.display = 'none';

    // Ocultar botones de creación general
    document.querySelectorAll('.action-restrict-hide').forEach(el => el.style.display = 'none');
    
    // Si estaba en una página restringida, devolverlo al dashboard
    const activePage = document.querySelector('.page.on').id;
    if (['pg-edit', 'pg-templates', 'pg-audit', 'pg-config'].includes(activePage)) {
      window.goPage('dash');
    }
  } else {
    warningBanner.style.display = 'none';
    document.getElementById('sb-edit').style.display = 'flex';
    document.getElementById('sb-templates').style.display = 'flex';
    document.getElementById('sb-audit').style.display = 'flex';
    document.getElementById('sb-config').style.display = 'flex';
    document.querySelectorAll('.action-restrict-hide').forEach(el => el.style.display = 'inline-flex');
  }
};

window.toggleSidebar = function() {
  document.body.classList.toggle('sidebar-collapsed');
  const icon = document.getElementById('sidebarToggleIcon');
  icon.className = document.body.classList.contains('sidebar-collapsed') ? 'ti ti-layout-sidebar-right' : 'ti ti-menu-2';
};
