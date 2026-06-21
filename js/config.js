// CONFIGURACIONES Y BRANDING EN TIEMPO REAL (G10 Scenario 3)
window.applyConfigBrandColor = function(color) {
  const hexLabel = document.getElementById('brand-color-hex');
  if (hexLabel) hexLabel.textContent = color.toUpperCase();
  document.documentElement.style.setProperty('--blue', color);
  document.documentElement.style.setProperty('--blue2', color + 'D9');
};

window.saveConfigurationSettings = function() {
  const org = document.getElementById('config-org-name').value.trim();
  const color = document.getElementById('config-brand-color').value;
  const header = document.getElementById('config-header-footer').value;

  window.state.orgName = org || 'Solinal S.A.';
  window.state.brandColor = color;
  window.state.twoFactorEnabled = document.getElementById('config-2fa-toggle').value === 'true';
  window.state.passwordPolicy = document.getElementById('config-password-policy').value;
  window.state.doubleApproval = document.getElementById('config-double-approval').value;

  showToast('Configuraciones guardadas y aplicadas al sistema.', 'ok');
  logAuditAction('Actualizó políticas de seguridad e identidad visual del sistema');

  if (typeof rebuildDashboard === 'function') rebuildDashboard();
};

// INTERACTIVIDAD DE DOBLE FACTOR DE AUTENTICACION (2FA) (G10 Scenarios 2 & 4)
window.submit2FA = function() {
  const pin = document.getElementById('two-factor-pin').value.trim();
  
  if (pin === '123456' || pin === '654321') {
    closeModal();
    window.state.failedAttempts = 0;
    showToast('Token de seguridad 2FA verificado correctamente.', 'ok');
    window.executeRoleChange();
  } else {
    window.state.failedAttempts++;
    const remaining = 3 - window.state.failedAttempts;
    
    if (window.state.failedAttempts >= 3) {
      closeModal();
      window.state.isLocked = true;
      document.getElementById('lock-screen-overlay').style.display = 'flex';
      logAuditAction('SISTEMA BLOQUEADO: 3 intentos fallidos de token de seguridad 2FA');
    } else {
      document.getElementById('two-factor-error-msg').textContent = `Token inválido. Te quedan ${remaining} intentos antes de bloquear la cuenta.`;
      logAuditAction(`Intento fallido de token 2FA por ${window.state.activeUser} (Intento #${window.state.failedAttempts})`);
    }
  }
};

window.cancel2FA = function() {
  closeModal();
  showToast('Cambio de perfil cancelado.', 'warn');
};

window.unlockSystemDemo = function() {
  window.state.isLocked = false;
  window.state.failedAttempts = 0;
  document.getElementById('lock-screen-overlay').style.display = 'none';
  showToast('Sistema desbloqueado para demostración del MVP.', 'ok');
  logAuditAction('Sistema desbloqueado manualmente por el administrador (Simulado)');
};
