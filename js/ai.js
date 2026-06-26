// ASISTENTE COPILOT IA INTERACTIVO (G01 Scenario 1)
window.sendPromptToAI = function() {
  const input = document.getElementById('ai-prompt-input');
  const text = input.value.trim();
  if (!text) return;

  const chat = document.getElementById('ai-chat-content');
  if (!chat) return;
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-msg user';
  userMsg.innerHTML = `<strong>Tú:</strong> ${text}`;
  chat.appendChild(userMsg);
  input.value = '';

  // Mostrar loader
  const loader = document.getElementById('ai-status-loader');
  if (loader) loader.style.display = 'block';

  // Delay de procesamiento
  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    const systemMsg = document.createElement('div');
    systemMsg.className = 'ai-msg system';
    
    let aiResponse = '';
    let actionBtn = '';

    if (text.toLowerCase().includes('inocuidad') || text.toLowerCase().includes('haccp')) {
      aiResponse = `<strong>IA:</strong> He redactado una propuesta de control crítico HACCP adaptada a Solinal.<br>Secciones: 1. Puntos Críticos de Control (PCC), 2. Límites Críticos y 3. Sistema de Vigilancia.`;
      actionBtn = `<button class="btn sm prim" style="margin-top:6px" onclick="insertProposedTextToEditor('PCC Inocuidad')">Insertar propuesta</button>`;
    } else {
      aiResponse = `<strong>IA:</strong> Basado en el contexto de tu consulta, he generado la sección solicitada conforme a los estándares de auditoría de la norma ISO.`;
      actionBtn = `<button class="btn sm prim" style="margin-top:6px" onclick="insertProposedTextToEditor('Sección IA')">Insertar texto</button>`;
    }

    systemMsg.innerHTML = `${aiResponse}<br>${actionBtn}`;
    chat.appendChild(systemMsg);
    chat.scrollTop = chat.scrollHeight;

    logAuditAction('Utilizó Asistente Copilot IA para redacción');
  }, 1400);
};

window.insertProposedTextToEditor = function(type) {
  const editor = document.getElementById('editorContent');
  if (!editor) return;
  let proposedText = '';
  if (type === 'PCC Inocuidad') {
    proposedText = `\n\n[PROPUSTA IA - PLAN HACCP]\n1. Puntos Críticos (PCC): Fritura de papas.\n2. Límites Críticos: Humedad < 2%, Temperatura > 175°C.\n3. Vigilancia: Sensor digital calibrado y registro de bitácora por hora.`;
  } else {
    proposedText = `\n\n[SECCIÓN GENERADA CON IA]\nDefinición del procedimiento operativo: Todos los controles de muestreo deben registrarse en tiempo real usando firmas electrónicas del elaborador a cargo.`;
  }
  editor.value += proposedText;
  showToast('Sugerencia de la IA insertada al borrador.', 'ok');
};

// ANALISIS DE RIESGOS CON IA (G04 Scenario 1)
window.triggerRiskAnalysis = function() {
  const loader = document.getElementById('ai-status-loader');
  if (loader) loader.style.display = 'block';

  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    const chat = document.getElementById('ai-chat-content');
    if (!chat) return;
    const msg = document.createElement('div');
    msg.className = 'ai-msg suggestion';
    msg.innerHTML = `
      <strong>Análisis de Riesgos IA:</strong><br>
      ⚠️ <strong>Inconsistencia detectada:</strong> La frecuencia de verificación en la sección de control de registros es vaga ("de forma regular"). Recomiendo cambiar por "Diario al cierre de turno".<br>
      ⚠️ <strong>Alerta:</strong> No se ha definido el procedimiento de acciones correctivas ante desvíos de límites de fritura.
    `;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    showToast('Análisis de riesgos completado por IA.', 'ok');
    logAuditAction(`Ejecutó análisis de riesgos IA en ${window.state.activeDocCode}`);
  }, 1000);
};

// RESUMEN IA MULTIDOCUMENTO (G04 Scenario 3)
window.triggerMultiDocSummary = function() {
  openModal('summaryModal');
  const container = document.getElementById('summary-docs-checkboxes');
  if (!container) return;
  container.innerHTML = '';
  window.state.documents.forEach(d => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '10px';
    label.style.cursor = 'pointer';
    label.innerHTML = `<input type="checkbox" value="${d.code}" class="summary-check"> <strong>${d.code}</strong> - ${d.title}`;
    container.appendChild(label);
  });
};

window.runAISummary = function() {
  const checks = document.querySelectorAll('.summary-check:checked');
  if (checks.length === 0) {
    showToast('Selecciona al menos un documento.', 'err');
    return;
  }

  const output = document.getElementById('summary-ai-output');
  if (!output) return;
  output.innerHTML = '<em>Consolidando contenidos e identificando hallazgos regulatorios...</em>';

  setTimeout(() => {
    let summaryText = `<strong>Resumen IA consolidado (${checks.length} documentos):</strong><br><br>`;
    summaryText += `• <strong>Objetivos unificados:</strong> Asegurar la calidad organoléptica y de inocuidad en el proceso de fritura de papas fritas.<br>`;
    summaryText += `• <strong>Límites regulatorios:</strong> Se identificaron concordancias en el control de temperatura y retención de registros.<br>`;
    summaryText += `• <strong>Recomendación:</strong> Homologar los códigos y firmas del flujo para que no existan desvíos en auditorías de ISO 22000.`;
    
    output.innerHTML = summaryText;
    showToast('Resumen consolidado generado.', 'ok');
    logAuditAction(`Generó resumen consolidado IA de ${checks.length} documentos`);
  }, 1500);
};

// ESCANER DE FORMATO FISICO (G04 Scenario 4)
window.triggerScanner = function() {
  openModal('scanModal');
  
  setTimeout(() => {
    closeModal();
    const editor = document.getElementById('editorContent');
    if (editor) {
      editor.value += `\n\n[DATOS IMPORTADOS DE FORMATO FISICO ESCANEADO]\n- Código de Registro: REG-FIS-099\n- Fecha de Inspección: 2026-06-21\n- Inspector: Erick Murillo\n- Resultado del Control: Limpieza CIP completada de forma óptima sin alérgenos.`;
      if (typeof loadDocumentToEditor === 'function') loadDocumentToEditor(window.state.activeDocCode);
    }
    showToast('Escaneo completado. Datos importados.', 'ok');
    logAuditAction('Escaneó formato físico e importó datos al editor');
  }, 2200);
};

// SIMULADOR DE CAMBIO DE LEY / NORMA INTERNACIONAL (G01 Scenario 4)
window.simulateRegulationChange = function() {
  const banner = document.getElementById('regulation-change-banner');
  if (banner) banner.style.display = 'flex';
  showToast('Se ha recibido una alerta de actualización regulatoria internacional.', 'warn');
  logAuditAction('Recibió alerta de actualización de norma ISO internacional');
};

window.applyNormativeUpdateInEditor = function() {
  const editor = document.getElementById('editorContent');
  if (editor) {
    editor.value += `\n\n[ACTUALIZACIÓN REGULATORIA AUTOMÁTICA ISO 22000:2026]\n- Se incorpora la enmienda de mitigación del cambio climático y controles ambientales en el plan de inocuidad.`;
    const banner = document.getElementById('regulation-change-banner');
    if (banner) banner.style.display = 'none';
  }
  showToast('Cambios regulatorios ISO 22000:2026 aplicados al borrador.', 'ok');
};
