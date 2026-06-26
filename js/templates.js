// PLANTILLAS (G06 Scenarios 1, 2, 3, 4)
window.renderTemplates = function() {
  const container = document.getElementById('templates-list-container');
  if (!container) return;
  container.innerHTML = '';

  window.state.templates.forEach(t => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.onclick = () => {
      // Crear borrador usando plantilla
      document.getElementById('newDocTemplate').value = t.key;
      window.templateChanged();
      openModal('newDocModal');
    };
    card.innerHTML = `
      <strong>${t.name}</strong>
      <div class="meta">${t.desc}</div>
      <div class="meta" style="margin-top:6px"><span class="badge">${t.norma}</span></div>
    `;
    container.appendChild(card);
  });
};

window.populateTemplateSelect = function() {
  const select = document.getElementById('newDocTemplate');
  if (!select) return;
  select.innerHTML = '<option value="">-- Crear en Blanco (Sin plantilla) --</option>';
  window.state.templates.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.key;
    opt.textContent = t.name;
    select.appendChild(opt);
  });
};

window.templateChanged = function() {
  const key = document.getElementById('newDocTemplate').value;
  const preview = document.getElementById('templatePreview');
  const previewText = document.getElementById('templatePreviewText');

  const title = document.getElementById('newDocTitle');
  const code = document.getElementById('newDocCode');
  const type = document.getElementById('newDocType');
  const norma = document.getElementById('newDocNorma');
  const desc = document.getElementById('newDocDescription');

  if (!key) {
    if (preview) preview.style.display = 'none';
    window.clearNewDocForm();
    return;
  }

  const template = window.state.templates.find(t => t.key === key);
  if (template) {
    title.value = `Borrador — ${template.name}`;
    code.value = `PRO-${template.type.slice(0,3).toUpperCase()}-010`;
    type.value = template.type;
    norma.value = template.norma;
    desc.value = template.desc;

    if (previewText) previewText.textContent = `Secciones obligatorias: ${template.mandatory.join(', ')}.`;
    if (preview) preview.style.display = 'block';
  }
};

window.clearNewDocForm = function() {
  document.getElementById('newDocCode').value = '';
  document.getElementById('newDocTitle').value = '';
  document.getElementById('newDocDescription').value = '';
  document.getElementById('newDocType').value = 'Procedimiento';
  document.getElementById('newDocNorma').value = 'ISO 9001:2015';
};

window.createDocument = function() {
  const code = document.getElementById('newDocCode').value.trim();
  const title = document.getElementById('newDocTitle').value.trim();
  const type = document.getElementById('newDocType').value;
  const norma = document.getElementById('newDocNorma').value;
  const critical = document.getElementById('newDocCritical').checked;
  const key = document.getElementById('newDocTemplate').value;

  if (!code || !title) {
    showToast('Código y título son necesarios.', 'err');
    return;
  }

  let content = '';
  if (key) {
    const template = window.state.templates.find(t => t.key === key);
    if (template) content = template.content;
  }

  const newDoc = {
    code: code,
    title: title,
    type: type,
    norma: norma,
    estado: 'Borrador',
    version: 'v1.0',
    creador: window.state.activeUser,
    vencido: false,
    critico: critical,
    content: content,
    signatures: [],
    revisiones: []
  };

  window.state.documents.push(newDoc);
  closeModal();
  showToast(`Documento ${code} creado exitosamente en Borrador.`, 'ok');
  logAuditAction(`Creó el documento ${code} desde plantilla`);

  // Ir al editor con el nuevo doc
  if (typeof loadDocumentToEditor === 'function') loadDocumentToEditor(code);
  window.goPage('edit');
  
  if (typeof renderDocumentList === 'function') renderDocumentList();
  if (typeof rebuildDashboard === 'function') rebuildDashboard();
};

// NUEVA PLANTILLA CON SECCION OBLIGATORIA (G06 Scenario 4)
window.saveNewTemplate = function() {
  const name = document.getElementById('newTempName').value.trim();
  const norma = document.getElementById('newTempNorma').value;
  const type = document.getElementById('newTempType').value;
  const mandatoryInput = document.getElementById('newTempMandatory').value.trim();
  const desc = document.getElementById('newTempDesc').value.trim();

  if (!name) {
    showToast('El nombre de la plantilla es obligatorio.', 'err');
    return;
  }

  // Validación de sección obligatoria (G06 Scenario 4)
  if (!mandatoryInput) {
    showToast('Error: Debe especificar al menos una sección obligatoria para cumplir con las directrices ISO.', 'err');
    return;
  }

  const newKey = name.toLowerCase().replace(/ /g, '-');
  const mandatoryArray = mandatoryInput.split(',').map(s => s.trim());

  const newTemp = {
    key: newKey,
    name: name,
    norma: norma,
    type: type,
    desc: desc || `Estructura personalizada para ${type} bajo la norma ${norma}.`,
    preview: `Secciones obligatorias: ${mandatoryArray.join(', ')}`,
    content: mandatoryArray.map((m, i) => `${i+1}. ${m}`).join('\n'),
    mandatory: mandatoryArray
  };

  window.state.templates.push(newTemp);
  closeModal();
  showToast('Plantilla guardada y disponible en el catálogo.', 'ok');
  logAuditAction(`Creó una nueva plantilla de documento: ${name}`);

  window.renderTemplates();
  window.populateTemplateSelect();
};

// GENERADOR IA DE PLANTILLAS
window.generateTemplateByAI = function() {
  const prompt = document.getElementById('ai-template-prompt').value.trim();
  if (!prompt) return;

  const content = document.getElementById('ai-template-box-content');
  if (!content) return;
  content.innerHTML = '<em>IA construyendo borrador de estructura y secciones obligatorias...</em>';

  setTimeout(() => {
    content.innerHTML = `
      <div class="ai-msg system">
        <strong>Propuesta IA de Plantilla:</strong><br>
        • Nombre sugerido: Plantilla de Control de Plagas ISO 22000<br>
        • Secciones recomendadas: Alcance, Monitoreo de trampas, Acciones Correctivas, Evidencia Fotográfica.<br>
        <button class="btn sm prim" style="margin-top:6px" onclick="acceptAITemplate()">Aceptar e integrar como Plantilla</button>
      </div>
    `;
    logAuditAction('Generó plantilla de documento con Copilot IA');
  }, 1500);
};

window.acceptAITemplate = function() {
  document.getElementById('newTempName').value = 'Plantilla de Control de Plagas';
  document.getElementById('newTempNorma').value = 'ISO 22000:2018';
  document.getElementById('newTempType').value = 'Procedimiento';
  document.getElementById('newTempMandatory').value = 'Alcance, Monitoreo de trampas, Acciones Correctivas, Evidencia Fotográfica';
  document.getElementById('newTempDesc').value = 'Estructura sugerida por Copilot IA para control de plagas bajo ISO 22000.';
  
  openModal('templateModal');
  showToast('Edita los campos antes de guardar la propuesta de la IA.', 'ok');
};
