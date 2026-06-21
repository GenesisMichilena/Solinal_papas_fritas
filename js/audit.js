// AUDIT TRAIL INMUTABLE CON FILTRADO DINÁMICO (G09 Scenarios 1, 2, 3, 4)
window.renderAuditTrail = function() {
  const tbody = document.getElementById('auditTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const userFilter = document.getElementById('audit-filter-user').value;
  const docFilter = document.getElementById('audit-filter-doc').value;

  let logs = window.state.auditLogs;

  if (userFilter !== 'all') {
    logs = logs.filter(l => l.user === userFilter);
  }
  if (docFilter !== 'all') {
    logs = logs.filter(l => l.action.includes(docFilter));
  }

  logs.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${l.id}</strong></td>
      <td>${l.action}</td>
      <td>${l.user}</td>
      <td>${l.role}</td>
      <td>${l.date} ${l.time}</td>
      <td><span class="tag" style="background:#F1F5F9;font-family:monospace;font-size:11px">${l.ip}</span></td>
    `;
    tbody.appendChild(tr);
  });
};

window.populateAuditFilters = function() {
  const userSelect = document.getElementById('audit-filter-user');
  const docSelect = document.getElementById('audit-filter-doc');
  if (!userSelect || !docSelect) return;

  const prevUser = userSelect.value;
  const prevDoc = docSelect.value;

  // Extraer valores únicos
  const users = [...new Set(window.state.auditLogs.map(l => l.user))];
  
  userSelect.innerHTML = '<option value="all">Todos los usuarios</option>';
  users.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u;
    opt.textContent = u;
    userSelect.appendChild(opt);
  });

  docSelect.innerHTML = '<option value="all">Todos los documentos</option>';
  window.state.documents.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.code;
    opt.textContent = d.code;
    docSelect.appendChild(opt);
  });

  userSelect.value = prevUser || 'all';
  docSelect.value = prevDoc || 'all';
};

window.applyAuditFilters = function() {
  window.renderAuditTrail();
};

window.clearAuditFilters = function() {
  document.getElementById('audit-filter-user').value = 'all';
  document.getElementById('audit-filter-doc').value = 'all';
  window.renderAuditTrail();
};

// INMUTABILIDAD - IMPEDIR MODIFICACIÓN (G09 Scenario 4)
window.simulateUnauthorizedAuditEdit = function() {
  showToast('❌ Registro inmutable: Las regulaciones ISO prohíben la modificación del Audit Trail.', 'err');
  logAuditAction('Intento fallido de eliminación del Audit Trail por usuario no autorizado');
};

// EXPORTACION CSV REAL (G09 Scenario 3)
window.exportAuditCSV = function() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Accion Registrada,Usuario,Rol,Fecha,Hora,IP\n";

  let logs = window.state.auditLogs;
  const userFilter = document.getElementById('audit-filter-user').value;
  const docFilter = document.getElementById('audit-filter-doc').value;

  if (userFilter !== 'all') logs = logs.filter(l => l.user === userFilter);
  if (docFilter !== 'all') logs = logs.filter(l => l.action.includes(docFilter));

  logs.forEach(l => {
    let row = `${l.id},"${l.action.replace(/"/g, '""')}","${l.user}","${l.role}","${l.date}","${l.time}","${l.ip}"`;
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `solinal_audit_trail_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("CSV de auditoría descargado exitosamente.", "ok");
  logAuditAction("Exportó registros de auditoría a CSV");
};
