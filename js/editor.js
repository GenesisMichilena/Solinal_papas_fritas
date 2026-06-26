// EDITOR DE DOCUMENTOS Y FUNCIONALIDADES
window.loadDocumentToEditor = function(code) {
  const doc = window.state.documents.find(d => d.code === code);
  if (!doc) return;

  window.state.activeDocCode = code;

  // Cargar metadatos
  const badgeEl = document.getElementById('editor-doc-badge');
  if (badgeEl) badgeEl.textContent = doc.code;
  
  document.getElementById('editor-doc-code').value = doc.code;
  document.getElementById('editor-doc-type').value = doc.type;
  document.getElementById('editor-doc-norma').value = doc.norma;
  document.getElementById('editor-doc-status').value = doc.estado + (doc.vencido ? ' (Vencido)' : '');
  document.getElementById('editor-doc-title').value = doc.title;
  document.getElementById('editorContent').value = doc.content;

  // Reactividad del candado / Bloqueo (G03 Scenario 2)
  const isOwner = (window.state.activeUser === doc.creador) || (window.state.activeRole === 'Administrador');
  const lockedContainer = document.getElementById('locked-section-container');
  if (doc.code === 'PRO-CAL-009') {
    if (lockedContainer) {
      lockedContainer.style.display = 'block';
      const lockedTextArea = document.getElementById('lockedSectionText');
      if (!isOwner) {
        lockedTextArea.setAttribute('readonly', 'true');
        lockedContainer.querySelector('.lock-banner').innerHTML = `<i class="ti ti-lock"></i> Bloqueado (Solo Propietario: Ana Torres)`;
        lockedContainer.style.borderColor = 'var(--red)';
      } else {
        lockedTextArea.removeAttribute('readonly');
        lockedContainer.querySelector('.lock-banner').innerHTML = `<i class="ti ti-lock-open"></i> editable por ti`;
        lockedContainer.style.borderColor = 'var(--green)';
      }
    }
  } else {
    if (lockedContainer) lockedContainer.style.display = 'none';
  }

  // Guía de recomendaciones laterales (G01 Scenario 2 & 3)
  window.rebuildEditorLeftGuide(doc);

  // Cargar firmas
  window.rebuildSignaturesList(doc);

  // Cargar comentarios
  window.rebuildCommentsList(doc);
};

window.editorMetaChanged = function() {
  // Guardamos cambios sobre el estado dinámico local temporalmente
  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  if (!doc) return;
  
  doc.title = document.getElementById('editor-doc-title').value;
  doc.type = document.getElementById('editor-doc-type').value;
  doc.norma = document.getElementById('editor-doc-norma').value;
  doc.content = document.getElementById('editorContent').value;
};

// CONSTRUIR RECOMENDACIONES LATERALES (G01 Scenario 2 & 3)
window.rebuildEditorLeftGuide = function(doc) {
  const container = document.getElementById('editor-left-guide');
  if (!container) return;
  container.innerHTML = '';

  const isBlank = doc.content.trim() === '';

  if (isBlank) {
    // Guía para documento en blanco (G01 Scenario 3)
    container.innerHTML = `
      <div class="alert-card" style="background:#EBF4FD;border-color:rgba(31,73,118,0.15);padding:12px">
        <i class="ti ti-info-circle" style="color:var(--blue)"></i>
        <div>
          <strong>Documento Vacío</strong>
          <span style="font-size:11px;color:var(--muted)">Estás redactando desde cero. Sigue estos pasos clave:</span>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text);display:grid;gap:8px">
        <div style="padding:10px;background:#F8FAFC;border-radius:10px">
          <strong>1. Definir Alcance:</strong> Establece con exactitud qué procesos de la planta abarca.
        </div>
        <div style="padding:10px;background:#F8FAFC;border-radius:10px">
          <strong>2. Responsables:</strong> Lista las áreas involucradas (Calidad, Fritura).
        </div>
        <div style="padding:10px;background:#F8FAFC;border-radius:10px">
          <strong>3. Requisitos ISO:</strong> Asocia este borrador con la norma reguladora.
        </div>
      </div>
    `;
  } else {
    // Guía del documento más usado / Recomendaciones (G01 Scenario 2)
    container.innerHTML = `
      <div style="padding:12px;background:#F8FAFC;border-radius:12px;border:1px solid var(--border)">
        <strong style="font-size:12px;display:block;margin-bottom:6px;color:var(--blue)">Estructura Recomendada</strong>
        <span style="font-size:11px;color:var(--muted);line-height:1.4">Se recomienda enlazar este <strong>${doc.type}</strong> bajo la norma <strong>${doc.norma}</strong> en el capítulo de procesos operativos.</span>
      </div>
      <div style="padding:12px;background:#F8FAFC;border-radius:12px;border:1px solid var(--border)">
        <strong style="font-size:12px;display:block;margin-bottom:6px;color:var(--green)">Integración ISO</strong>
        <span style="font-size:11px;color:var(--muted);line-height:1.4">Mantener un tiempo de retención de firma digital de al menos 3 años para sustentar auditorías de inocuidad.</span>
      </div>
      <div style="padding:12px;background:#FEF9E7;border-radius:12px;border:1px solid rgba(125,102,8,0.2)">
        <strong style="font-size:12px;display:flex;align-items:center;gap:6px;color:var(--amber)"><i class="ti ti-bulb"></i> Tip de Auditor</strong>
        <span style="font-size:11px;color:var(--muted);line-height:1.4">Recuerda colocar límites claros en las temperaturas y bitácora de limpieza CIP para cumplir ISO 22000.</span>
      </div>
    `;
  }
};

// GESTIÓN DE COMENTARIOS (G02 Scenario 4)
window.rebuildCommentsList = function(doc) {
  const container = document.getElementById('editor-comments-list');
  if (!container) return;
  container.innerHTML = '';

  const comments = window.state.comments.filter(c => c.code === doc.code);
  if (comments.length === 0) {
    container.innerHTML = `<span style="font-size:12px;color:var(--muted);font-style:italic">No hay comentarios en este documento.</span>`;
  } else {
    comments.forEach(c => {
      const bubble = document.createElement('div');
      bubble.className = 'comment-bubble';
      bubble.innerHTML = `
        <header><span>${c.author}</span><small>${c.date}</small></header>
        <p>${c.text}</p>
      `;
      container.appendChild(bubble);
    });
  }
};

window.addCommentToDocument = function() {
  const input = document.getElementById('new-comment-input');
  const text = input.value.trim();
  if (!text) return;

  const newComment = {
    code: window.state.activeDocCode,
    author: window.state.activeUser,
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    text: text
  };

  window.state.comments.push(newComment);
  input.value = '';
  showToast('Comentario añadido al hilo de discusión.', 'ok');
  logAuditAction(`Añadió un comentario en documento ${window.state.activeDocCode}`);
  
  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  window.rebuildCommentsList(doc);
};

// SECCIÓN DE FIRMAS ELECTRONICAS (G03 Scenario 1)
window.rebuildSignaturesList = function(doc) {
  const container = document.getElementById('document-signatures-list');
  if (!container) return;
  container.innerHTML = '';

  const signatures = doc.signatures || [];
  if (signatures.length === 0) {
    container.innerHTML = `<span style="font-size:12px;color:var(--muted);font-style:italic">Documento pendiente de firma y validación.</span>`;
  } else {
    signatures.forEach(s => {
      const box = document.createElement('div');
      box.className = 'sig-box';
      box.innerHTML = `
        <div class="sig-info">
          <strong>Firmado digitalmente por ${s}</strong>
          <small>Fecha: ${new Date().toISOString().slice(0,10)} - Autorización Completa</small>
        </div>
        <span class="sig-cert">ISO-CERT-SHA256</span>
      `;
      container.appendChild(box);
    });
  }
};

window.signActiveDocument = function() {
  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  if (!doc) return;

  // Restricciones de Aprobación
  if (window.state.activeRole !== 'Aprobador' && window.state.activeRole !== 'Administrador') {
    showToast('Acción bloqueada: Solo los roles de Aprobador o Administrador pueden firmar este documento.', 'err');
    logAuditAction(`Intento fallido de firma en ${doc.code} por ${window.state.activeUser} (Rol: ${window.state.activeRole})`);
    return;
  }

  if (doc.signatures.includes(window.state.activeUser)) {
    showToast('Ya has firmado este documento.', 'warn');
    return;
  }

  doc.signatures.push(window.state.activeUser);

  // Doble Aprobación para Documentos Críticos (G07 Scenario 4)
  if (doc.critico && window.state.doubleApproval === 'critical') {
    if (doc.signatures.length < 2) {
      doc.estado = 'En Aprobación';
      showToast('Firma 1/2 agregada. Pendiente de co-firma de un segundo aprobador.', 'warn');
      logAuditAction(`Añadió primera firma electrónica al documento crítico ${doc.code}`);
    } else {
      doc.estado = 'Aprobado';
      doc.vencido = false;
      showToast('Firma 2/2 agregada. El documento pasa a estado Vigente / Aprobado.', 'ok');
      logAuditAction(`Documento crítico ${doc.code} aprobado con firmas completas`);
    }
  } else {
    doc.estado = 'Aprobado';
    doc.vencido = false;
    showToast('Firma colocada. Documento aprobado de forma oficial.', 'ok');
    logAuditAction(`Firmó y aprobó el documento ${doc.code}`);
  }

  window.loadDocumentToEditor(doc.code);
  if (typeof rebuildDashboard === 'function') rebuildDashboard();
};

// CONTROL DE BLOQUEO DE SECCIONES (G03 Scenario 2)
window.toggleBlockSection = function() {
  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  if (!doc) return;

  if (window.state.activeUser !== doc.creador && window.state.activeRole !== 'Administrador') {
    showToast('Solo el dueño o creador del documento puede modificar las restricciones de bloqueo.', 'err');
    return;
  }

  window.state.isSectionLocked = !window.state.isSectionLocked;
  showToast(window.state.isSectionLocked ? 'Sección crítica bloqueada para no-propietarios.' : 'Sección desbloqueada.', 'ok');
  window.loadDocumentToEditor(doc.code);
};

// GUARDAR NUEVA VERSION DE DOCUMENTO SIN SOBRESCRIBIR LA ANTERIOR (G02 Scenario 1)
window.saveActiveDocument = function() {
  const code = document.getElementById('editor-doc-code').value.trim();
  const type = document.getElementById('editor-doc-type').value;
  const norma = document.getElementById('editor-doc-norma').value;
  const title = document.getElementById('editor-doc-title').value.trim();
  const content = document.getElementById('editorContent').value;

  if (!code || !title) {
    showToast('El código y el título del documento son requeridos.', 'err');
    return;
  }

  const docIndex = window.state.documents.findIndex(d => d.code === window.state.activeDocCode);
  if (docIndex === -1) return;

  const originalDoc = window.state.documents[docIndex];

  // Incrementar la versión
  const currentVer = parseFloat(originalDoc.version.replace('v', ''));
  const nextVer = 'v' + (currentVer + 0.1).toFixed(1);

  // Agregar la versión previa a la lista de revisión histórica
  originalDoc.revisiones.unshift(`${originalDoc.version} - Modificado el ${new Date().toISOString().slice(0,10)} por ${window.state.activeUser}: ${title}`);

  // Actualizar metadatos del documento
  originalDoc.code = code;
  originalDoc.type = type;
  originalDoc.norma = norma;
  originalDoc.title = title;
  originalDoc.content = content;
  originalDoc.version = nextVer;
  
  window.state.activeDocCode = code;

  showToast(`Nueva versión ${nextVer} guardada con éxito.`, 'ok');
  logAuditAction(`Creó la versión ${nextVer} del documento ${code}`);

  window.loadDocumentToEditor(code);
  if (typeof renderDocumentList === 'function') renderDocumentList();
  if (typeof rebuildDashboard === 'function') rebuildDashboard();
};

// RESTAURAR VERSION HISTORICA (G02 Scenario 3)
window.openVersionModal = function() {
  openModal('versionModal');
  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  const container = document.getElementById('versionModalList');
  if (!container) return;
  container.innerHTML = '';

  if (!doc || !doc.revisiones || doc.revisiones.length === 0) {
    container.innerHTML = '<span style="font-size:12px;color:var(--muted)">No hay registros históricos de versiones para restaurar.</span>';
    return;
  }

  doc.revisiones.forEach((r, idx) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.cursor = 'pointer';
    item.onclick = () => window.selectVersionToRestore(idx, r);
    item.innerHTML = `
      <strong>Versión Histórica</strong>
      <div class="meta">${r}</div>
    `;
    container.appendChild(item);
  });
};

let selectedVersionIdx = -1;
window.selectVersionToRestore = function(idx, text) {
  selectedVersionIdx = idx;
  document.querySelectorAll('#versionModalList .timeline-item').forEach((el, index) => {
    el.style.borderColor = index === idx ? 'var(--blue)' : 'var(--border)';
  });
  showToast(`Seleccionada: ${text.split(' - ')[0]}`, 'ok');
};

window.restoreSelectedVersion = function() {
  if (selectedVersionIdx === -1) {
    showToast('Selecciona una versión histórica de la lista.', 'err');
    return;
  }

  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  const revisionText = doc.revisiones[selectedVersionIdx];
  const oldVer = revisionText.split(' - ')[0];

  doc.content = `[Versión Restaurada de ${oldVer}]\n` + doc.content;
  doc.version = oldVer;

  showToast(`Versión ${oldVer} restaurada con éxito en el borrador.`, 'ok');
  logAuditAction(`Restauró documento ${doc.code} a la versión ${oldVer}`);

  closeModal();
  window.loadDocumentToEditor(doc.code);
};

// SIMULADOR DE CO-FIRMA FUSION CONCURRENTE (G02 Scenario 2)
window.openSimulatedMerge = function() {
  openModal('mergeModal');
};

window.confirmMergeSimulated = function() {
  const doc = window.state.documents.find(d => d.code === window.state.activeDocCode);
  if (!doc) return;

  doc.content += '\n- Medición con termómetro infrarrojo calibrado. (Fusión consolidada)';
  closeModal();
  window.loadDocumentToEditor(doc.code);
  showToast('Cambios fusionados e integrados al borrador.', 'ok');
  logAuditAction(`Consolidó cambios concurrentes en documento ${doc.code}`);
};
