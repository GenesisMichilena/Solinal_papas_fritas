// DASHBOARD DINÁMICO (G05 Scenario 1, 2, 3, 4)
let areDashboardTasksCleared = false;

window.rebuildDashboard = function() {
  const docs = window.state.documents;
  const activeCount = docs.length;
  const publishedCount = docs.filter(d => d.estado === 'Aprobado').length;
  const vencidosCount = docs.filter(d => d.vencido).length;
  const pendingApprovalsCount = docs.filter(d => d.estado === 'En Aprobación').length;

  document.getElementById('dash-active-docs').textContent = activeCount;
  document.getElementById('dash-active-docs-sub').textContent = `${publishedCount} publicados, ${activeCount - publishedCount} en flujo/borradores`;
  document.getElementById('dash-pending-approvals').textContent = pendingApprovalsCount;
  document.getElementById('dash-pending-approvals-sub').textContent = `${docs.filter(d => d.estado === 'En Revisión').length} en revisión, ${pendingApprovalsCount} en aprobación final`;
  document.getElementById('dash-vencidos-count').textContent = vencidosCount;

  // Banner de Alerta Vencidos
  const alertBanner = document.getElementById('vencidos-alert-banner');
  if (vencidosCount > 0) {
    alertBanner.style.display = 'flex';
    document.getElementById('vencidos-alert-text').textContent = `Existen ${vencidosCount} documentos vigentes vencidos. Requieren actualización de firmas e ISO de forma prioritaria.`;
  } else {
    alertBanner.style.display = 'none';
  }

  // Cumplimiento Promedio
  const scores = window.calculateComplianceScores();
  const avgComp = Math.round((scores.iso9001 + scores.iso14001 + scores.iso22000) / 3);
  document.getElementById('dash-iso-percentage').textContent = `${avgComp}%`;
  document.getElementById('dash-iso-percentage-pill').textContent = `${avgComp}%`;
  document.getElementById('dash-iso-progress-inner').style.width = `${avgComp}%`;

  document.getElementById('dash-iso-9001').textContent = `${scores.iso9001}%`;
  document.getElementById('dash-iso-14001').textContent = `${scores.iso14001}%`;
  document.getElementById('dash-iso-22000').textContent = `${scores.iso22000}%`;

  // Tareas Urgentes según el Rol
  const role = window.state.activeRole;
  document.getElementById('dash-role-tasks-title').textContent = role;
  const tasksContainer = document.getElementById('dash-tasks-container');
  tasksContainer.innerHTML = '';

  let tasks = [];
  if (!areDashboardTasksCleared) {
    if (role === 'Administrador') {
      tasks = [
        { title: 'Doble aprobación obligatoria', desc: 'Validar co-firma de documento crítico POL-GER-003.', badge: 'Aprobación Doble', type: 's-aprobacion' },
        { title: 'Auditar 3 documentos vencidos', desc: 'Renovar firmas digitales obsoletas de checklist HACCP y Residuos.', badge: 'Crítico', type: 's-rechazado' },
        { title: 'Habilitar políticas 2FA', desc: 'Configurar token de inicio obligatorio en panel de Configuración.', badge: 'Seguridad', type: 's-borrador' }
      ];
    } else if (role === 'Elaborador') {
      tasks = [
        { title: 'Corregir Instructivo CIP rechazado', desc: 'El revisor denegó INS-PRO-012 por falta de parámetros de temperatura.', badge: 'Rechazado', type: 's-rechazado' },
        { title: 'Redactar documento en blanco', desc: 'Generar el nuevo Instructivo de Fritura asistido por Asistente Copilot IA.', badge: 'Borrador', type: 's-borrador' }
      ];
    } else if (role === 'Revisor') {
      tasks = [
        { title: 'Evaluar Control de Calidad', desc: 'Realizar revisión técnica y dejar comentarios en PRO-CAL-009 v1.2.', badge: 'En revisión', type: 's-revision' },
        { title: 'Auditoría de Requisitos ISO 9001', desc: 'Validar si la sección 8.4 cuenta con evidencia suficiente en los registros.', badge: 'Norma', type: 's-revision' }
      ];
    } else if (role === 'Aprobador') {
      tasks = [
        { title: 'Firmar Política de Inocuidad', desc: 'Revisar declaración final y colocar firma digital en POL-GER-003.', badge: 'Aprobación', type: 's-aprobacion' },
        { title: 'Validar Co-Firma Crítica', desc: 'El documento PRO-SEG-005 requiere doble aprobación organizacional.', badge: 'Firma 2/2', type: 's-aprobacion' }
      ];
    } else if (role === 'Lector') {
      tasks = [
        { title: 'Leer Manual del SGC vigente', desc: 'Consultar el alcance v3.1 de la planta de producción.', badge: 'Lectura', type: 's-vigente' },
        { title: 'Verificar alérgenos en recepción', desc: 'Revisar checklist vigente CHK-HAC-001.', badge: 'Consulta', type: 's-vigente' }
      ];
    }
  }

  if (tasks.length === 0) {
    // Escenario 4: Sin actividad pendiente
    tasksContainer.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-checkbox" style="color:var(--green)"></i>
        <h4>Sin actividad pendiente</h4>
        <p>¡Excelente! No tienes tareas prioritarias asignadas para tu rol de ${role}. Todo al día.</p>
      </div>
    `;
  } else {
    tasks.forEach(t => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <strong>${t.title}</strong>
        <div class="meta">${t.desc}</div>
        <div style="margin-top:6px"><span class="status-badge ${t.type}">${t.badge}</span></div>
      `;
      tasksContainer.appendChild(item);
    });
  }

  // Documentos clave
  const keyDocsContainer = document.getElementById('dash-key-docs');
  keyDocsContainer.innerHTML = '';
  docs.slice(0, 3).forEach(d => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.cursor = 'pointer';
    item.onclick = () => {
      if (typeof loadDocumentToEditor === 'function') loadDocumentToEditor(d.code);
      window.goPage('edit');
    };
    item.innerHTML = `
      <strong>${d.title}</strong>
      <div class="meta">${d.type} · ${d.norma} · ${d.version}</div>
    `;
    keyDocsContainer.appendChild(item);
  });
};

window.toggleClearTasks = function() {
  areDashboardTasksCleared = !areDashboardTasksCleared;
  const btn = document.getElementById('btn-clear-tasks');
  if (areDashboardTasksCleared) {
    btn.innerHTML = '<i class="ti ti-refresh"></i> Cargar tareas';
    showToast("Tareas vaciadas. Cumpliendo con el flujo sin pendientes.", "ok");
  } else {
    btn.innerHTML = '<i class="ti ti-checkbox"></i> Limpiar tareas';
    showToast("Tareas del rol cargadas exitosamente.", "ok");
  }
  window.rebuildDashboard();
};

window.calculateComplianceScores = function() {
  const approvedDocs = window.state.documents.filter(d => d.estado === 'Aprobado');
  
  let c9001 = 40 + approvedDocs.filter(d => d.norma === 'ISO 9001:2015').length * 15;
  let c14001 = 50 + approvedDocs.filter(d => d.norma === 'ISO 14001:2015').length * 16;
  let c22000 = 35 + approvedDocs.filter(d => d.norma === 'ISO 22000:2018').length * 13;

  return {
    iso9001: Math.min(100, c9001),
    iso14001: Math.min(100, c14001),
    iso22000: Math.min(100, c22000)
  };
};
